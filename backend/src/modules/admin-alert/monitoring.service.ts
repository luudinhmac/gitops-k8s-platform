import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { AdminAlertService } from './admin-alert.service';
import * as os from 'os';

@Injectable()
export class MonitoringService {
  private readonly logger = new Logger(MonitoringService.name);
  
  // Stats for monitoring
  private requestCounts = new Map<string, number>(); // ip -> count in last minute
  private loginAttempts = 0; // count in last minute
  
  // State for resource dampening
  private resourceBreachStartTime: number | null = null;
  private resourceAlertSent = false;
  
  // Thresholds
  private readonly CPU_THRESHOLD = 90;
  private readonly RAM_THRESHOLD = 90;
  private readonly DISK_THRESHOLD = 90;
  private readonly DOS_THRESHOLD = 300; // requests per minute per IP
  private readonly LOGIN_SPIKE_THRESHOLD = 20; // logins per minute total

  constructor(private adminAlertService: AdminAlertService) {}

  /**
   * Tracks a request from an IP for DOS detection
   */
  trackRequest(ip: string) {
    const current = this.requestCounts.get(ip) || 0;
    this.requestCounts.set(ip, current + 1);
  }

  /**
   * Tracks a login attempt for spike detection
   */
  trackLoginAttempt() {
    this.loginAttempts++;
  }

  /**
   * Helper to get disk usage
   */
  private getDiskUsage(): { usage: number; freeGB: number; totalGB: number } | null {
    // Disk usage monitoring via OS commands is unreliable in containers.
    // Recommended to use external tools like Prometheus for infrastructure monitoring.
    return null;
  }

  /**
   * Helper to get CPU usage
   */
  private async getCpuUsage(): Promise<number> {
    try {
      // Return 0 for development or Windows, otherwise use Linux loadavg
      if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development' || os.platform() === 'win32') return 0; 

      const cpus = os.cpus().length;
      const loadAvg = os.loadavg()[0]; // 1 minute load average
      return cpus > 0 ? (loadAvg / cpus) * 100 : 0;
    } catch (error) {
      return 0;
    }
  }

  /**
   * Background task: Check resources and traffic every minute
   */
  @Cron(CronExpression.EVERY_MINUTE)
  async checkSystemHealth() {
    // Skip heavy monitoring in development to save CPU
    if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') return;

    // 1. Check CPU Usage
    const cpuUsagePercent = await this.getCpuUsage();
    
    // 2. Check RAM Usage
    const totalMem = os.totalmem();
    const freeMem = os.freemem();
    const ramUsagePercent = ((totalMem - freeMem) / totalMem) * 100;

    // 3. Check Disk Usage
    const diskInfo = this.getDiskUsage();

    // --- ALERTS ---
    
    // Check if any resource is currently breached
    const isCpuBreached = cpuUsagePercent > this.CPU_THRESHOLD;
    const isRamBreached = ramUsagePercent > this.RAM_THRESHOLD;
    const isDiskBreached = !!(diskInfo && diskInfo.usage > this.DISK_THRESHOLD);
    const isResourceBreached = isCpuBreached || isRamBreached || isDiskBreached;

    if (isResourceBreached) {
      // Start tracking if this is a new breach
      if (!this.resourceBreachStartTime) {
        this.resourceBreachStartTime = Date.now();
        this.logger.warn('System resource breach detected. Starting 5-minute dampening period...');
      }

      // Check if the breach has been sustained for 5 minutes
      const elapsedMinutes = (Date.now() - this.resourceBreachStartTime) / (60 * 1000);
      
      if (elapsedMinutes >= 5 && !this.resourceAlertSent) {
        const diskText = diskInfo 
          ? `• <b>Disk:</b> ${diskInfo.usage.toFixed(1)}% (${diskInfo.freeGB}GB trống / ${diskInfo.totalGB}GB)\n`
          : '';

        this.adminAlertService.sendAlert({
          subject: `⚠️ CẢNH BÁO: Tài nguyên Server vượt ngưỡng (Duy trì >5 phút)`,
          text: `⚠️ <b>CẢNH BÁO TÀI NGUYÊN</b>\n\n` +
                `Hệ thống đã duy trì mức tải cao trong hơn 5 phút:\n\n` +
                `• <b>CPU:</b> ${cpuUsagePercent.toFixed(1)}% ${isCpuBreached ? '🚨' : '✅'}\n` +
                `• <b>RAM:</b> ${ramUsagePercent.toFixed(1)}% ${isRamBreached ? '🚨' : '✅'}\n` +
                `${diskText}${isDiskBreached ? '🚨' : ''}` +
                `• <b>Trạng thái:</b> VƯỢT NGƯỠNG (>90%)\n` +
                `• <b>Thời gian:</b> ${new Date().toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' })}`,
        });
        this.resourceAlertSent = true;
      }
    } else {
      // System is healthy - Check if we need to send a recovery notification
      if (this.resourceAlertSent) {
        const diskText = diskInfo 
          ? `• <b>Disk:</b> ${diskInfo.usage.toFixed(1)}% (${diskInfo.freeGB}GB trống)\n`
          : '';

        this.adminAlertService.sendAlert({
          subject: `✅ PHỤC HỒI: Tài nguyên Server đã ổn định`,
          text: `✅ <b>THÔNG BÁO PHỤC HỒI</b>\n\n` +
                `Các chỉ số tài nguyên hệ thống đã trở lại mức an toàn:\n\n` +
                `• <b>CPU:</b> ${cpuUsagePercent.toFixed(1)}% ✅\n` +
                `• <b>RAM:</b> ${ramUsagePercent.toFixed(1)}% ✅\n` +
                `${diskText}` +
                `• <b>Thời gian:</b> ${new Date().toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' })}`,
        });
      }
      
      // Reset state
      this.resourceBreachStartTime = null;
      this.resourceAlertSent = false;
    }

    // DOS Detection
    for (const [ip, count] of this.requestCounts.entries()) {
      if (count > this.DOS_THRESHOLD) {
        this.adminAlertService.sendAlert({
          subject: `🛑 CẢNH BÁO: Nghi ngờ DOS từ IP ${ip}`,
          text: `🛑 <b>CẢNH BÁO DOS</b>\n\n` +
                `• <b>IP Truy cập:</b> ${ip}\n` +
                `• <b>Số lượng request:</b> ${count}/phút\n` +
                `• <b>Ngưỡng:</b> ${this.DOS_THRESHOLD}\n` +
                `• <b>Hành động:</b> Đang giám sát IP này\n` +
                `• <b>Thời gian:</b> ${new Date().toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' })}`,
        });
      }
    }

    // Login Spike
    if (this.loginAttempts > this.LOGIN_SPIKE_THRESHOLD) {
      this.adminAlertService.sendAlert({
        subject: `🔑 CẢNH BÁO: Lượng đăng nhập tăng cao bất thường`,
        text: `🔑 <b>CẢNH BÁO ĐĂNG NHẬP</b>\n\n` +
              `• <b>Lượng đăng nhập:</b> ${this.loginAttempts}/phút\n` +
              `• <b>Ngưỡng:</b> ${this.LOGIN_SPIKE_THRESHOLD}\n` +
              `• <b>Tình trạng:</b> Nghi ngờ tấn công Brute-force hoặc lưu lượng tăng đột biến\n` +
              `• <b>Thời gian:</b> ${new Date().toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' })}`,
      });
    }

    // Reset counters for next minute
    this.requestCounts.clear();
    this.loginAttempts = 0;
  }
}
