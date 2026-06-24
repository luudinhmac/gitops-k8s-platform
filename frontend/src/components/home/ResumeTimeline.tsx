'use client';

import { Calendar, Briefcase, GraduationCap, Award, Download, Rocket, Server, Cpu, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TimelineItem {
  title: string;
  subtitle: string;
  period: string;
  description: string | string[];
  status?: 'PRESENT' | 'COMPLETED' | 'IN_PROGRESS' | 'PLANNED';
  type: 'WORK' | 'EDUCATION' | 'CERTIFICATION';
  tags?: string[];
}

const timelineData: TimelineItem[] = [
  {
    title: 'Infrastructure Engineer',
    subtitle: 'Saigon Precision — Misumi Group',
    period: 'Tháng 03/2026 - Hiện tại',
    description: [
      'Di chuyển các workloads production từ hệ thống on-premise VMware lên CMC Cloud, đảm bảo tính liên tục dịch vụ.',
      'Thiết kế và tự động hóa triển khai các nền tảng giám sát doanh nghiệp (Zabbix, Grafana, Docker Compose, Ansible).',
      'Xây dựng các dashboard tùy chỉnh, metrics, triggers và workflow cảnh báo qua webhook tới Microsoft Teams để quản lý sự cố thời gian thực.',
      'Triển khai giám sát topology mạng thời gian thực và băng thông sử dụng Grafana Network Weathermap.',
      'Quản trị môi trường ảo hóa VMware hỗ trợ các cơ sở dữ liệu sản xuất Oracle Database và Microsoft SQL Server.',
      'Quản lý hạ tầng mạng nội bộ và các dịch vụ doanh nghiệp: Firewall, VPN, Active Directory, ảo hóa.',
      'Vận hành hệ thống sao lưu Veeam Backup & Replication liên kết với Cloudflare R2 object storage.'
    ],
    status: 'PRESENT',
    type: 'WORK',
    tags: ['Cloud Migration', 'Ansible', 'VMware', 'Grafana', 'Veeam Backup']
  },
  {
    title: 'Systems Deployment Engineer',
    subtitle: 'Thi Thien Solutions Technology Corporation',
    period: 'Tháng 11/2023 - Tháng 03/2026',
    description: [
      'Cấu hình SQL Server Failover Cluster Instance (FCI) trên Windows Server 2022 (2-node) đảm bảo tính sẵn sàng cao.',
      'Triển khai iSCSI Direct Attach, MPIO và Storage Tiering (SSD/HDD) cho hệ thống lưu trữ HPE MSA 2060.',
      'Khôi phục thành công quyền truy cập root ESXi 8 cho BV Bưu điện, đưa hệ thống bệnh viện hoạt động lại sau sự cố mất điện kéo dài 10 ngày trong vòng 2 giờ.',
      'Khôi phục thông tin đăng nhập ESXi 7 cho Vietsovpetro Resort Hồ Tràm với thời gian gián đoạn dưới 1 giờ.',
      'Xử lý sự cố đồng bộ hóa HA trên cụm HPE SimpliVity cho Báo Sài Gòn Giải Phóng.',
      'Chẩn đoán và xử lý lỗi phần cứng/phần mềm phức tạp cho các hệ thống lưu trữ SAN (Dell, IBM, 3PAR, MSA).',
      'Hỗ trợ thiết lập VMware ESXi 8, cài đặt Oracle Linux và cấu hình Oracle Database cho Bệnh viện Hùng Vương.',
      'Cấu hình CUDA drivers, TensorFlow, PyTorch và Jupyter Notebook hỗ trợ GPU cho các workloads AI/ML.'
    ],
    status: 'COMPLETED',
    type: 'WORK',
    tags: ['SQL Cluster', 'HPE MSA', 'SAN Storage', 'AI Infrastructure', 'VMware ESXi']
  },
  {
    title: 'Freelance System Engineer',
    subtitle: 'Kubernetes & OpenStack Deployment Support',
    period: 'Tháng 04/2025 & Tháng 10/2025',
    description: [
      'Xử lý sự cố cụm Kubernetes ngăn worker nodes gia nhập cụm và khôi phục các production workloads bằng cách triển khai lại manifests (Tháng 04/2025).',
      'Điều tra lỗi khởi động dịch vụ và xung đột dependencies trong OpenStack cài đặt bằng Kolla-Ansible, đưa các dịch vụ online thành công (Tháng 10/2025).'
    ],
    status: 'COMPLETED',
    type: 'WORK',
    tags: ['Kubernetes', 'OpenStack', 'Kolla-Ansible']
  },
  {
    title: 'IT Systems Specialist',
    subtitle: 'Delta Engineering Corporation (Nay là DEC Engineering JSC)',
    period: 'Tháng 09/2020 - Tháng 04/2022',
    description: [
      'Triển khai và vận hành OpenStack, cụm Proxmox và lưu trữ phân tán CEPH cho hạ tầng Private Cloud.',
      'Thiết lập kiến trúc HA cho MariaDB và PostgreSQL sử dụng HAProxy, Galera Cluster và Patroni.',
      'Xây dựng và vận hành Private Cloud với Nextcloud tích hợp SSO (ADFS) cho Microsoft Office 365.',
      'Triển khai hệ thống giám sát tập trung bằng Zabbix và Grafana; cấu hình thiết bị tường lửa (Sophos, Fortinet, pfSense).',
      'Tự động hóa các tác vụ quản trị hệ thống hàng ngày bằng Bash và Python, giảm 80% thời gian thực hiện thủ công.',
      'Quản trị hệ thống IT nội bộ: cấp phát tài khoản người dùng, Active Directory, Microsoft 365 và Domain Controller.'
    ],
    status: 'COMPLETED',
    type: 'WORK',
    tags: ['Zabbix', 'CEPH', 'Nextcloud', 'Private Cloud', 'OpenStack', 'HA Cluster']
  },
  {
    title: 'System Operation',
    subtitle: 'Berjaya Gia Thinh Investment Technology JSC (Vietlott)',
    period: 'Tháng 01/2019 - Tháng 12/2019',
    description: [
      'Vận hành và giám sát hệ thống máy chủ Vietlott; thực hiện sao lưu hàng ngày/hàng tuần ra băng tải (tape).',
      'Quản lý hệ thống khởi động/đóng và vận hành OSS (Online Sell Server) trên hệ điều hành OpenVMS trong các kỳ quay thưởng.'
    ],
    status: 'COMPLETED',
    type: 'WORK',
    tags: ['Backup Tape', 'OpenVMS', 'System Ops']
  },
  {
    title: 'NOC Operator Trainee',
    subtitle: 'Online Mobile Services JSC (MoMo)',
    period: 'Tháng 01/2018 - Tháng 08/2018',
    description: [
      'Giám sát máy chủ và dịch vụ bằng Nagios và Grafana; ghi nhận và xử lý các sự cố bất thường để đảm bảo tính sẵn sàng của nền tảng.'
    ],
    status: 'COMPLETED',
    type: 'WORK',
    tags: ['NOC', 'Monitoring', 'Nagios', 'Grafana']
  },
  {
    title: 'Đại học Sư phạm Kỹ thuật TP.HCM',
    subtitle: 'Cử nhân Công nghệ Thông tin',
    period: '2014 - 2019',
    description: [
      'Chuyên ngành: Mạng máy tính và truyền thông.',
      'Đồ án tốt nghiệp: Xây dựng hệ thống cân bằng tải với tính sẵn sàng cao (High Availability).',
      'Nghiên cứu giải pháp bảo mật và ngăn chặn xâm nhập cho Website (Modsecurity, SQLi, XSS, DOS).'
    ],
    status: 'COMPLETED',
    type: 'EDUCATION'
  },
  {
    title: 'Chứng chỉ Chuyên môn',
    subtitle: 'Đào tạo bởi DevOpsEdu.vn & VNPRO',
    period: '2017 - 2025',
    description: [
      '2025: DevOps on AWS (EC2, IAM, VPC, S3) & DevOps for Business.',
      '2024: DevOps & DevSecOps, Practical Kubernetes Certification.',
      '2017: CCNA (VNPRO).'
    ],
    status: 'COMPLETED',
    type: 'CERTIFICATION'
  }
];

const StatusBadge = ({ status }: { status?: string }) => {
  if (!status) return null;

  const styles = {
    PRESENT: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
    COMPLETED: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
    IN_PROGRESS: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
    PLANNED: 'bg-slate-500/10 text-slate-500 border-slate-500/20',
  };

  const labels = {
    PRESENT: 'HIỆN TẠI',
    COMPLETED: 'HOÀN THÀNH',
    IN_PROGRESS: 'ĐANG HỌC',
    PLANNED: 'KẾ HOẠCH',
  };

  return (
    <span className={cn(
      "px-2 py-0.5 rounded-full text-[9px] font-bold border tracking-wider",
      styles[status as keyof typeof styles] || styles.PLANNED
    )}>
      {labels[status as keyof typeof labels] || status}
    </span>
  );
};

export default function ResumeTimeline() {
  const experiences = timelineData.filter(i => i.type === 'WORK');
  const others = timelineData.filter(i => i.type !== 'WORK');

  return (
    <section className="py-20 px-4 bg-slate-50/50 dark:bg-slate-950/50 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-primary/5 blur-[100px] rounded-full -z-10" />
      <div className="absolute bottom-0 left-0 w-1/4 h-1/4 bg-blue-500/5 blur-[80px] rounded-full -z-10" />

      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-bold mb-4 uppercase tracking-[0.2em]">
            <Calendar size={12} />
            <span>Hành trình sự nghiệp</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-display font-bold text-slate-900 dark:text-white mb-5 tracking-tight">
            Kinh nghiệm <span className="text-primary">&</span> Học vấn
          </h2>
          <p className="text-slate-500 dark:text-slate-400 max-w-2xl mx-auto text-base md:text-lg leading-relaxed font-medium">
            Tóm tắt quá trình hình thành kỹ năng và kinh nghiệm thực chiến qua các giai đoạn nghề nghiệp.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Work Experience Column */}
          <div className="lg:col-span-7 space-y-10">
            <div className="flex items-center space-x-3 mb-2">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
                <Briefcase size={22} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white uppercase tracking-wide">Kinh nghiệm thực chiến</h3>
                <p className="text-xs text-slate-500">Các vị trí chuyên môn đã đảm nhận</p>
              </div>
            </div>

            <div className="relative pl-6 md:pl-10 space-y-12 before:absolute before:left-[11px] md:before:left-[19px] before:top-2 before:bottom-2 before:w-[2px] before:bg-gradient-to-b before:from-primary before:via-primary/30 before:to-transparent">
              {experiences.map((item, idx) => (
                <div key={idx} className="relative animate-fade-in group">
                  {/* Glowing Point */}
                  <div className={cn(
                    "absolute -left-[28px] md:-left-[38px] top-1.5 w-5 h-5 rounded-full border-[3px] border-white dark:border-slate-950 z-10 transition-all duration-500",
                    item.status === 'PRESENT'
                      ? "bg-primary shadow-[0_0_12px_rgba(37,99,235,0.8)] scale-110"
                      : "bg-slate-300 dark:bg-slate-700 group-hover:bg-primary"
                  )} />

                  <div className="glass p-6 md:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 hover:border-primary/30 transition-all duration-500 relative overflow-hidden group-hover:shadow-xl group-hover:shadow-primary/5">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 -mr-12 -mt-12 rounded-full blur-2xl" />

                    <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
                      <div className="flex items-center space-x-2 text-primary font-bold text-xs uppercase tracking-widest">
                        <Calendar size={14} />
                        <span>{item.period}</span>
                      </div>
                      <StatusBadge status={item.status} />
                    </div>

                    <h4 className="text-lg md:text-xl font-bold text-slate-900 dark:text-white mb-1 tracking-tight">
                      {item.title}
                    </h4>
                    <p className="text-sm font-bold text-blue-500/80 mb-5">
                      {item.subtitle}
                    </p>

                    <div className="space-y-2.5 mb-6">
                      {Array.isArray(item.description) ? (
                        <ul className="space-y-2.5">
                          {item.description.map((desc, i) => (
                            <li key={i} className="text-xs md:text-sm text-slate-600 dark:text-slate-400 leading-relaxed flex items-start">
                              <span className="w-1.5 h-1.5 rounded-full bg-primary/40 mt-1.5 mr-2.5 flex-shrink-0" />
                              {desc}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-xs md:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{item.description}</p>
                      )}
                    </div>

                    {item.tags && (
                      <div className="flex flex-wrap gap-2">
                        {item.tags.map(tag => (
                          <span key={tag} className="px-2 py-0.5 bg-slate-100 dark:bg-slate-900 text-slate-500 dark:text-slate-400 text-[8px] font-bold rounded-md border border-slate-200 dark:border-slate-800 uppercase tracking-tighter">
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Education & Certificates Column */}
          <div className="lg:col-span-5 space-y-10">
            <div className="flex items-center space-x-3 mb-2">
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-500 border border-amber-500/20">
                <GraduationCap size={22} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white uppercase tracking-wide">Học vấn & Chứng chỉ</h3>
                <p className="text-xs text-slate-500">Nền tảng tri thức chuyên môn</p>
              </div>
            </div>

            <div className="relative pl-6 space-y-10 before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[2px] before:bg-gradient-to-b before:from-amber-500 before:via-amber-500/20 before:to-transparent">
              {others.map((item, idx) => (
                <div key={idx} className="relative animate-fade-in group/item">
                  <div className={cn(
                    "absolute -left-[28px] top-1.5 w-5 h-5 rounded-full border-[3px] border-white dark:border-slate-950 z-10 transition-all duration-500",
                    item.status === 'IN_PROGRESS'
                      ? "bg-amber-500 shadow-[0_0_12px_rgba(245,158,11,0.6)] animate-pulse"
                      : "bg-slate-300 dark:bg-slate-700 group-hover/item:bg-amber-500"
                  )} />

                  <div className="glass p-6 md:p-7 rounded-3xl border border-slate-200 dark:border-slate-800 hover:border-amber-500/30 transition-all duration-500">
                    <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                      <div className="flex items-center space-x-2 text-amber-600 font-bold text-[10px] uppercase tracking-widest">
                        {item.type === 'EDUCATION' ? <GraduationCap size={14} /> : <Award size={14} />}
                        <span>{item.period}</span>
                      </div>
                      <StatusBadge status={item.status} />
                    </div>
                    <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-1 tracking-tight">
                      {item.title}
                    </h4>
                    <p className="text-xs font-bold text-slate-500 dark:text-slate-400 mb-4 italic">
                      {item.subtitle}
                    </p>
                    <ul className="space-y-2">
                      {Array.isArray(item.description) ? item.description.map((desc, i) => (
                        <li key={i} className="text-xs text-slate-600 dark:text-slate-400 flex items-start">
                          <CheckCircle2 size={12} className="text-amber-500/50 mr-2 mt-0.5 flex-shrink-0" />
                          {desc}
                        </li>
                      )) : (
                        <li className="text-xs text-slate-600 dark:text-slate-400">{item.description}</li>
                      )}
                    </ul>
                  </div>
                </div>
              ))}

              {/* Enhanced Call to Action Card */}
              <div className="mt-10 p-8 rounded-[2rem] bg-gradient-to-br from-primary via-blue-600 to-indigo-700 text-white shadow-xl shadow-primary/20 relative overflow-hidden group/cta">
                <div className="absolute top-0 right-0 p-6 opacity-10 group-hover/cta:scale-110 transition-transform duration-700">
                  <Rocket size={80} />
                </div>
                <div className="relative z-10">
                  <h4 className="text-xl font-bold mb-3 italic tracking-tight">Hồ sơ năng lực</h4>
                  <p className="text-white/80 text-xs mb-8 leading-relaxed">
                    Tải bản CV đầy đủ (PDF) để xem chi tiết hơn về các dự án và kỹ năng của tôi.
                  </p>
                  <div className="flex flex-col gap-3">
                    <a href="/LuuDinhMac_CV_DevOps.pdf" download className="w-full px-5 py-3.5 bg-white text-primary rounded-xl text-xs font-bold flex items-center justify-center hover:bg-slate-50 transition-all active:scale-95 shadow-lg">
                      Tải CV DevOps (PDF)
                      <Download size={16} className="ml-2" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

