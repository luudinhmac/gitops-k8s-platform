import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { AdminAlertService } from './admin-alert.service';
import * as os from 'os';
import { execSync } from 'child_process';

@Injectable()
export class MonitoringService {
  private readonly logger = new Logger(MonitoringService.name);
  
  // Stats for monitoring
  private requestCounts = new Map<string, number>(); // ip -> count in last minute
  private loginAttempts = 0; // count in last minute
  
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
   * Helper to get disk usage on Windows
   */
  private getDiskUsage(): { usage: number; freeGB: number; totalGB: number } | null {
    try {
      if (os.platform() !== 'win32') return null;
      
      const output = execSync('wmic logicaldisk where "DeviceID=\'C:\'" get FreeSpace,Size /format:list').toString();
      const lines = output.split('\n').filter(l => l && l.trim());
      
      let free = 0;
      let size = 0;
      
      lines.forEach(line => {
        if (line.includes('FreeSpace=')) free = parseInt(line.split('=')[1].trim(), 10);
        if (line.includes('Size=')) size = parseInt(line.split('=')[1].trim(), 10);
      });

      if (!size || isNaN(size)) return null;
      
      return {
        usage: ((size - free) / size) * 100,
        freeGB: Math.round(free / (1024 * 1024 * 1024)),
        totalGB: Math.round(size / (1024 * 1024 * 1024))
      };
    } catch (error) {
      this.logger.error('Failed to get disk usage', error);
      return null;
    }
  }

  /**
   * Helper to get CPU usage on Windows
   */
  private getCpuUsage(): number {
    try {
      if (os.platform() !== 'win32') {
        const cpus = os.cpus().length;
        const loadAvg = os.loadavg()[0];
        return (loadAvg / cpus) * 100;
      }
      
      const output = execSync('wmic cpu get loadpercentage').toString();
      const load = parseInt(output.split('\n')[1]?.trim(), 10);
      return isNaN(load) ? 0 : load;
    } catch (error) {
      return 0;
    }
  }

  /**
   * Background task: Check resources and traffic every minute
   */
  @Cron(CronExpression.EVERY_MINUTE)
  async checkSystemHealth() {
    // 1. Check CPU Usage
    const cpuUsagePercent = this.getCpuUsage();
    
    // 2. Check RAM Usage
    const totalMem = os.totalmem();
    const freeMem = os.freemem();
    const ramUsagePercent = ((totalMem - freeMem) / totalMem) * 100;

    // 3. Check Disk Usage
    const diskInfo = this.getDiskUsage();

    // --- ALERTS ---
    
    // Resource Alerts
    if (cpuUsagePercent > this.CPU_THRESHOLD || ramUsagePercent > this.RAM_THRESHOLD || (diskInfo && diskInfo.usage > this.DISK_THRESHOLD)) {
      const diskText = diskInfo 
        ? `• <b>Disk:</b> ${diskInfo.usage.toFixed(1)}% (${diskInfo.freeGB}GB trống / ${diskInfo.totalGB}GB)\n`
        : '';

      this.adminAlertService.sendAlert({
        subject: `⚠️ CẢNH BÁO: Tài nguyên Server vượt ngưỡng`,
        text: `⚠️ <b>CẢNH BÁO TÀI NGUYÊN</b>\n\n` +
              `• <b>CPU:</b> ${cpuUsagePercent.toFixed(1)}%\n` +
              `• <b>RAM:</b> ${ramUsagePercent.toFixed(1)}%\n` +
              `${diskText}` +
              `• <b>Trạng thái:</b> VƯỢT NGƯỠNG AN TOÀN (>90%)\n` +
              `• <b>Thời gian:</b> ${new Date().toLocaleString('vi-VN')}`,
      });
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
                `• <b>Thời gian:</b> ${new Date().toLocaleString('vi-VN')}`,
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
              `• <b>Thời gian:</b> ${new Date().toLocaleString('vi-VN')}`,
      });
    }

    // Reset counters for next minute
    this.requestCounts.clear();
    this.loginAttempts = 0;
  }
}
