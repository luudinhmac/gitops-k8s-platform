'use client';

import { Calendar, Briefcase, GraduationCap, Award, ExternalLink, Download, Rocket } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TimelineItem {
  title: string;
  subtitle: string;
  period: string;
  description: string | string[];
  status?: 'PRESENT' | 'COMPLETED' | 'IN_PROGRESS' | 'PLANNED';
  type: 'WORK' | 'EDUCATION' | 'CERTIFICATION';
}

const timelineData: TimelineItem[] = [
  {
    title: 'Chuyên viên Dịch vụ IT',
    subtitle: 'Công ty Cổ phần Công nghệ Giải pháp Thi Thiên',
    period: '11/2023 - Hiện tại',
    description: [
      'Triển khai hệ thống: Thiết lập SQL Server Failover Cluster Instance (FCI) trên Windows Server 2022.',
      'Quản lý lưu trữ: Quản lý HPE MSA 2060, cấu hình iSCSI Direct Attach, MPIO và Storage Tiering để tối ưu hiệu suất.',
      'Xử lý sự cố khẩn cấp: Phục hồi quyền truy cập root ESXi 8 cho Bệnh viện Đa khoa Bưu điện trong 2 giờ sau 10 ngày gián đoạn; Khôi phục mật khẩu ESXi 7 cho Vietsovpetro Resort Hồ Tràm với thời gian downtime dưới 1 giờ; Xử lý lỗi đồng bộ HA trên cụm HPE SimpliVity cho Báo Sài Gòn Giải Phóng.',
      'Hạ tầng AI/ML: Cài đặt CUDA drivers và cấu hình TensorFlow, PyTorch với hỗ trợ GPU.'
    ],
    status: 'PRESENT',
    type: 'WORK'
  },
  {
    title: 'Kỹ sư Hệ thống Freelance',
    subtitle: 'Dự án OpenStack & Kubernetes',
    period: 'T04/2025 & T10/2025',
    description: [
      'Hỗ trợ triển khai OpenStack và xử lý các lỗi dịch vụ bằng Kolla-Ansible.',
      'Xử lý sự cố cụm Kubernetes, giúp các worker node gia nhập cụm và khôi phục workload.'
    ],
    status: 'COMPLETED',
    type: 'WORK'
  },
  {
    title: 'Chuyên viên Hệ thống IT',
    subtitle: 'Công ty Cổ phần Kỹ thuật Delta (DEC)',
    period: '09/2020 - 04/2022',
    description: [
      'Triển khai và vận hành hệ thống OpenStack, cụm Proxmox và lưu trữ phân tán CEPH.',
      'Xây dựng Private Cloud với Nextcloud tích hợp SSO qua ADFS.',
      'Tự động hóa các tác vụ quản trị hệ thống bằng Bash và Python, giúp giảm 80% công việc thủ công.',
      'Thiết lập giải pháp VDI và hệ thống giám sát với Zabbix, Grafana.'
    ],
    status: 'COMPLETED',
    type: 'WORK'
  },
  {
    title: 'Vận hành Hệ thống',
    subtitle: 'Công ty CP Đầu tư Công nghệ Berjaya Gia Thịnh',
    period: '01/2019 - 12/2019',
    description: [
      'Vận hành hệ thống cho Vietlott, thực hiện sao lưu dữ liệu hàng ngày/tuần vào băng từ.',
      'Vận hành Online Sell Server (OSS) trên hệ điều hành OpenVMS.'
    ],
    status: 'COMPLETED',
    type: 'WORK'
  },
  {
    title: 'Đại học Sư phạm Kỹ thuật TP.HCM',
    subtitle: 'Kỹ sư Công nghệ Thông tin',
    period: '2014 - 2019',
    description: [
      'Tốt nghiệp chương trình đào tạo Kỹ sư Công nghệ Thông tin chuyên ngành CNHP và mạng máy tính.'
    ],
    status: 'COMPLETED',
    type: 'EDUCATION'
  },
  {
    title: 'Chứng chỉ nghề nghiệp',
    subtitle: 'DevOps & System Administration',
    period: '2017 - 2025',
    description: [
      'DevOps on AWS, DevOps for Business (2025).',
      'DevOps & DevSecOps, Practical Kubernetes (2024).',
      'CCNA - VNPRO (2017).'
    ],
    status: 'IN_PROGRESS',
    type: 'CERTIFICATION'
  }
];

const StatusBadge = ({ status }: { status?: string }) => {
  if (!status) return null;
  
  const styles = {
    PRESENT: 'bg-green-500/10 text-green-500 border-green-500/20',
    COMPLETED: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
    IN_PROGRESS: 'bg-sky-500/10 text-sky-500 border-sky-500/20',
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
      "px-2 py-0.5 rounded text-[9px] font-bold border tracking-wider",
      styles[status as keyof typeof styles] || styles.PLANNED
    )}>
      {labels[status as keyof typeof labels] || status}
    </span>
  );
};

export default function ResumeTimeline() {
  const experiences = timelineData.filter(i => i.type === 'WORK');
  const education = timelineData.filter(i => i.type !== 'WORK');

  return (
    <section className="py-24 px-4 bg-slate-50 dark:bg-slate-950/50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-display font-bold text-slate-900 dark:text-white mb-4">
            Lộ trình Phát triển <span className="text-primary italic">& Kinh nghiệm</span>
          </h2>
          <p className="text-slate-500 dark:text-slate-400 max-w-2xl mx-auto text-sm md:text-base">
            Quá trình hình thành kỹ năng và kinh nghiệm thực chiến trong lĩnh vực System Engineering & DevOps qua các giai đoạn.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Work Experience Column */}
          <div className="space-y-8">
            <div className="flex items-center space-x-3 mb-8">
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500 shadow-sm border border-blue-500/10">
                <Briefcase size={22} />
              </div>
              <h3 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white uppercase tracking-tight">Kinh nghiệm chuyên môn</h3>
            </div>

            <div className="relative pl-8 space-y-12 before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[2px] before:bg-slate-200 dark:before:bg-slate-800">
              {experiences.map((item, idx) => (
                <div key={idx} className="relative animate-fade-in">
                  {/* Point */}
                  <div className={cn(
                    "absolute -left-[30px] top-1.5 w-4 h-4 rounded-full border-4 border-slate-50 dark:border-slate-950 z-10",
                    item.status === 'PRESENT' ? "bg-primary shadow-[0_0_12px_rgba(37,99,235,0.6)]" : "bg-slate-300 dark:bg-slate-700 hover:bg-primary transition-colors duration-300"
                  )} />
                  
                  <div className="glass p-6 md:p-8 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-primary/40 transition-all duration-300 group hover:shadow-lg hover:shadow-primary/5">
                    <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                      <div className="flex items-center space-x-2 text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider">
                        <Calendar size={14} className="text-primary/70" />
                        <span>{item.period}</span>
                      </div>
                      <StatusBadge status={item.status} />
                    </div>
                    <h4 className="text-lg md:text-xl font-bold text-slate-900 dark:text-white mb-1 group-hover:text-primary transition-colors">{item.title}</h4>
                    <p className="text-sm font-bold text-primary/80 mb-4">{item.subtitle}</p>
                    {Array.isArray(item.description) ? (
                      <ul className="space-y-1.5 list-disc list-outside ml-4 mt-2">
                        {item.description.map((desc, i) => (
                          <li key={i} className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                            {desc}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{item.description}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Education & Learning Column */}
          <div className="space-y-8">
            <div className="flex items-center space-x-3 mb-8">
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500 shadow-sm border border-blue-500/10">
                <GraduationCap size={22} />
              </div>
              <h3 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white uppercase tracking-tight">Lộ trình học tập</h3>
            </div>

            <div className="relative pl-8 space-y-12 before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[2px] before:bg-slate-200 dark:before:bg-slate-800">
              {education.map((item, idx) => (
                <div key={idx} className="relative animate-fade-in group/item">
                  {/* Point */}
                  <div className={cn(
                    "absolute -left-[30px] top-1.5 w-4 h-4 rounded-full border-4 border-slate-50 dark:border-slate-950 z-10",
                    item.status === 'IN_PROGRESS' ? "bg-sky-500 shadow-[0_0_12px_rgba(14,165,233,0.6)] animate-pulse" : "bg-slate-300 dark:bg-slate-700 group-hover/item:bg-sky-500 transition-colors duration-300"
                  )} />
                  
                  <div className="glass p-6 md:p-8 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-sky-500/40 transition-all duration-300 group hover:shadow-lg hover:shadow-sky-500/5">
                    <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                      <div className="flex items-center space-x-2 text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider">
                        {item.type === 'EDUCATION' ? <GraduationCap size={14} className="text-blue-500/70" /> : <Award size={14} className="text-blue-500/70" />}
                        <span>{item.period}</span>
                      </div>
                      <StatusBadge status={item.status} />
                    </div>
                    <h4 className="text-lg md:text-xl font-bold text-slate-900 dark:text-white mb-1 group-hover:text-blue-500 transition-colors">{item.title}</h4>
                    <p className="text-sm font-bold text-blue-500/80 mb-4">{item.subtitle}</p>
                    {Array.isArray(item.description) ? (
                      <ul className="space-y-1.5 list-disc list-outside ml-4 mt-2">
                        {item.description.map((desc, i) => (
                          <li key={i} className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                            {desc}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-medium">{item.description}</p>
                    )}
                  </div>
                </div>
              ))}

              {/* Call to action card in education column */}
              <div className="mt-12 p-8 rounded-3xl bg-gradient-to-br from-blue-600 to-sky-500 text-white shadow-2xl shadow-primary/20 relative overflow-hidden group/cta ring-1 ring-white/20">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover/cta:scale-125 group-hover/cta:rotate-12 transition-all duration-700">
                   <Rocket size={120} />
                </div>
                <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-white/10 rounded-full blur-3xl" />
                
                <h4 className="text-xl font-bold mb-3 relative z-10 tracking-tight leading-tight italic font-display underline underline-offset-4 decoration-white/30">Kết nối học tập cùng Mác</h4>
                <p className="text-sm text-white/90 mb-8 relative z-10 leading-relaxed font-medium">
                  Tôi luôn cởi mở để chia sẻ kiến thức và thảo luận về các giải pháp Cloud Native & DevOps hiện đại.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 relative z-10">
                  <a href="/CV-Eng.md" target="_blank" className="flex-1 px-6 py-3.5 bg-white text-blue-600 rounded-2xl text-sm font-display font-bold flex items-center justify-center hover:bg-slate-50 transition-all hover:scale-[1.02] shadow-sm">
                    Gửi yêu cầu
                    <ExternalLink size={16} className="ml-2" />
                  </a>
                  <a href="/Luu_Dinh_Mac_CV_VN.pdf" target="_blank" download className="flex-1 px-6 py-3.5 bg-white/10 hover:bg-white/20 text-white border border-white/30 rounded-2xl text-sm font-display font-bold flex items-center justify-center transition-all backdrop-blur-md">
                    Tải CV (PDF)
                    <Download size={16} className="ml-2" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
