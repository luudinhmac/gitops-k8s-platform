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
    title: 'IT Services Specialist',
    subtitle: 'Thi Thien Solutions Technology Corporation',
    period: 'Tháng 11/2023 - Hiện tại',
    description: [
      'Cấu hình SQL Server Failover Cluster Instance (FCI) trên Windows Server 2022 (2-node).',
      'Triển khai iSCSI Direct Attach, MPIO và Storage Tiering (SSD/HDD) cho HPE MSA 2060.',
      'Khôi phục dịch vụ cơ sở dữ liệu quan trọng bằng cách cấu hình lại SAN volumes và Cluster nodes.',
      'Xử lý sự cố khẩn cấp: Khôi phục root ESXi 8 cho BV Bưu điện (trong 2h), Reset pass ESXi 7 cho Vietsovpetro Resort Hồ Tràm.',
      'Chẩn đoán và xử lý lỗi phần cứng/phần mềm phức tạp cho hệ thống lưu trữ SAN (Dell, IBM, 3PAR, MSA).',
      'Cấu hình CUDA drivers, TensorFlow, PyTorch, Jupyter Notebook với GPU support cho AI/ML.'
    ],
    status: 'PRESENT',
    type: 'WORK',
    tags: ['SQL Cluster', 'HPE MSA', 'SAN Storage', 'AI Infrastructure']
  },
  {
    title: 'Freelance System Engineer',
    subtitle: 'Kubernetes & OpenStack Deployment Support',
    period: 'Tháng 04/2025 & Tháng 10/2025',
    description: [
      'Xử lý sự cố cụm Kubernetes ngăn worker nodes gia nhập cụm và khôi phục production workloads.',
      'Triển khai lại các manifest và cấu hình Kubernetes hiện có để khôi phục dịch vụ.',
      'Điều tra lỗi khởi động dịch vụ và dependency issues trong OpenStack cài đặt bằng Kolla-Ansible.',
      'Hỗ trợ cấu hình lại OpenStack để đưa các dịch vụ online thành công.'
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
      'Triển khai, nâng cấp và cấu hình thiết bị mạng (WiFi, camera, switch, router, NAS, server).',
      'Thiết lập hệ thống giám sát toàn diện hạ tầng mạng bằng Zabbix và Grafana.',
      'Triển khai hệ thống lưu trữ phân tán CEPH để sử dụng với OpenStack và Proxmox cluster.',
      'Xây dựng và vận hành Private Cloud với Nextcloud tích hợp SSO (ADFS) cho Microsoft Office 365.',
      'Triển khai giải pháp VDI sử dụng Windows Server cho quản lý lưu trữ tập trung với thin client.',
      'Tự động hóa các tác vụ quản trị hệ thống bằng Bash và Python, giảm 80% công sức thủ công.'
    ],
    status: 'COMPLETED',
    type: 'WORK',
    tags: ['Zabbix', 'CEPH', 'Nextcloud', 'VDI Automation']
  },
  {
    title: 'System Operation',
    subtitle: 'Berjaya Gia Thinh Investment Technology JSC',
    period: 'Tháng 01/2019 - Tháng 12/2019',
    description: [
      'Vận hành hệ thống Vietlott: Giám sát máy chủ, thực hiện sao lưu hàng ngày/tuần ra băng tải (tape).',
      'Di chuyển băng tải dữ liệu đến PDC và DRC đảm bảo an toàn lưu trữ.',
      'Quản lý hệ thống khởi động/đóng và vận hành OSS (Online Sell Server) trên OpenVMS.',
      'Cài đặt mail server trên CentOS 6 và hỗ trợ kỹ thuật trong thời gian quay số mở thưởng.'
    ],
    status: 'COMPLETED',
    type: 'WORK',
    tags: ['Backup Tape', 'OpenVMS', 'System Ops']
  },
  {
    title: 'Operator (NOC) Trainee',
    subtitle: 'Online Mobile Services JSC (MoMo)',
    period: 'Tháng 01/2018 - Tháng 08/2018',
    description: [
      'Giám sát máy chủ và dịch vụ (Nagios, Grafana, Web) đảm bảo hệ thống vận hành ổn định.',
      'Ghi nhận lỗi và xử lý các vấn đề kỹ thuật do người dùng báo cáo hoặc hệ thống ghi nhận.',
      'Hỗ trợ các bộ phận Chăm sóc khách hàng, Phát triển sản phẩm và Hệ thống phân phối.'
    ],
    status: 'COMPLETED',
    type: 'WORK',
    tags: ['NOC', 'Monitoring', 'Nagios']
  },
  {
    title: 'Đại học Sư phạm Kỹ thuật TP.HCM',
    subtitle: 'Kỹ Sư Công nghệ Thông tin',
    period: '2014 - 2019',
    description: [
      'Chuyên ngành: Mạng máy tính và truyền thông.',
      'Đồ án: Xây dựng hệ thống cân bằng tải với tính sẵn sàng cao (High Availability).',
      'Đồ án: Giải pháp ngăn chặn xâm nhập cho Website (Modsecurity, SQLi, XSS, DOS).'
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
    status: 'IN_PROGRESS',
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
                    <a href="/Luu_Dinh_Mac_CV_EN.pdf" download className="w-full px-5 py-3.5 bg-white text-primary rounded-xl text-xs font-bold flex items-center justify-center hover:bg-slate-50 transition-all active:scale-95 shadow-lg">
                      Download English CV
                      <Download size={16} className="ml-2" />
                    </a>
                    <a href="/Luu_Dinh_Mac_CV_VN.pdf" download className="w-full px-5 py-3.5 bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-xl text-xs font-bold flex items-center justify-center transition-all backdrop-blur-md active:scale-95">
                      Tải CV Tiếng Việt
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

