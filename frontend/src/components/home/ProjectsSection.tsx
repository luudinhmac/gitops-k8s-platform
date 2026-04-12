'use client';

import { useState } from 'react';
import { ExternalLink, Github, Layers, Cpu, Globe, Database } from 'lucide-react';
import { cn } from '@/lib/utils';

const projects = [
  {
    title: 'Hệ thống SQL Server Failover Cluster (FCI)',
    description: 'Thiết lập cụm băm lỗi (Failover Cluster) cho SQL Server trên Windows Server 2022, đảm bảo tính sẵn sàng cao cho cơ sở dữ liệu doanh nghiệp.',
    tech: ['Windows Server', 'SQL Server', 'Failover Cluster', 'Active Directory'],
    category: 'High Availability',
    link: '#',
    github: 'https://github.com/luudinhmac',
    icon: Layers
  },
  {
    title: 'Hạ tầng Private Cloud & CEPH Storage',
    description: 'Triển khai và vận hành hệ thống OpenStack, cụm Proxmox và giải pháp lưu trữ phân tán CEPH cho hạ tầng đám mây nội bộ.',
    tech: ['OpenStack', 'CEPH', 'Proxmox', 'Kolla-Ansible'],
    category: 'Cloud',
    link: '#',
    github: 'https://github.com/luudinhmac',
    icon: Globe
  },
  {
    title: 'Quản lý Lưu trữ HPE MSA 2060',
    description: 'Cấu cấu hình iSCSI Direct Attach, MPIO và Storage Tiering trên HPE MSA 2060 để tối ưu hóa hiệu suất và khả năng mở rộng.',
    tech: ['HPE MSA', 'iSCSI', 'SAN Storage', 'Storage Tiering'],
    category: 'Storage',
    link: '#',
    github: 'https://github.com/luudinhmac',
    icon: Database
  },
  {
    title: 'Hạ tầng AI/ML & GPU Computing',
    description: 'Cài đặt và cấu hình môi trường tính toán hiệu năng cao với CUDA drivers, TensorFlow và PyTorch hỗ trợ GPU cho các workload AI.',
    tech: ['CUDA', 'TensorFlow', 'PyTorch', 'GPU Acceleration'],
    category: 'AI Infrastructure',
    link: '#',
    github: 'https://github.com/luudinhmac',
    icon: Cpu
  },
  {
    title: 'Private Cloud & Nextcloud (SSO ADFS)',
    description: 'Xây dựng giải pháp Private Cloud bằng Nextcloud tích hợp xác thực một lần (SSO) qua ADFS và hệ thống lưu trữ phân tán.',
    tech: ['Nextcloud', 'ADFS', 'SSO', 'Private Cloud'],
    category: 'Cloud',
    link: '#',
    github: 'https://github.com/luudinhmac',
    icon: Globe
  },
  {
    title: 'Cụm MariaDB Galera Cluster (HA)',
    description: 'Triển khai cụm cơ sở dữ liệu MariaDB sẵn sàng cao sử dụng Galera Cluster cho các ứng dụng trọng yếu như Zabbix, Nextcloud và Web Services.',
    tech: ['MariaDB', 'Galera Cluster', 'HAProxy', 'Keepalived'],
    category: 'High Availability',
    link: '#',
    github: 'https://github.com/luudinhmac',
    icon: Database
  },
  {
    title: 'VMWare vSphere Cluster & vSAN',
    description: 'Thiết lập cụm máy chủ ảo hóa VMware vSphere Cluster tích hợp giải pháp lưu trữ hội tụ vSAN cho môi trường doanh nghiệp.',
    tech: ['VMware ESXi', 'vCenter', 'vSAN', 'HA/DRS'],
    category: 'Virtualization',
    link: '#',
    github: 'https://github.com/luudinhmac',
    icon: Layers
  },
  {
    title: 'Bảo trì & Xử lý sự cố SAN & Server Hardware',
    description: 'Thiết lập RAID cho các dòng SAN IBM (v3700, v7000, v9000), thay thế controller (3PAR, MSA), linh kiện máy chủ (HPE, DELL, IBM, Lenovo, Fujitsu) và chuẩn đoán lỗi, thay thế phần cứng HPE Tape Autoloader.',
    tech: ['RAID Configuration', 'HPE Tape Autoloader', 'SAN Maintenance', 'Hardware Troubleshooting'],
    category: 'Infrastructure',
    link: '#',
    github: 'https://github.com/luudinhmac',
    icon: Database
  },
  {
    title: 'Quản trị & Tối ưu hóa Enterprise Linux',
    description: 'Vận hành và bảo mật các bản phân phối Linux (Ubuntu, CentOS, Debian) cho hạ tầng production. Tự động hóa tác vụ và triển khai giám sát hệ thống tập trung.',
    tech: ['Linux Server', 'Security Patching', 'Bash Scripting', 'Performance Tuning'],
    category: 'Infrastructure',
    link: '#',
    github: 'https://github.com/luudinhmac',
    icon: Globe
  }
];

export default function ProjectsSection() {
  const [activeFilter, setActiveFilter] = useState('All');
  
  const filters = [
    { label: 'Tất cả', value: 'All' },
    { label: 'High Availability', value: 'High Availability' },
    { label: 'Virtualization', value: 'Virtualization' },
    { label: 'Cloud', value: 'Cloud' },
    { label: 'Storage', value: 'Storage' },
    { label: 'Infrastructure', value: 'Infrastructure' }
  ];

  const filteredProjects = activeFilter === 'All' 
    ? projects 
    : projects.filter(p => p.category === activeFilter);

  return (
    <section id="projects" className="py-24 px-4 bg-slate-50/50 dark:bg-slate-900/20 relative">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-display font-bold text-slate-900 dark:text-white mb-6">
            Dự án <span className="text-primary">Thực tế</span>
          </h2>
          <p className="text-base md:text-lg text-slate-500 max-w-2xl mx-auto leading-relaxed">
            Danh sách các dự án tiêu biểu tôi đã tham gia triển khai, vận hành và tối ưu hóa hạ tầng.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap justify-center gap-2 md:gap-3 mb-12">
          {filters.map((filter) => (
            <button
              key={filter.value}
              onClick={() => setActiveFilter(filter.value)}
              className={cn(
                "px-5 py-2 md:px-6 md:py-2.5 rounded-full text-xs md:text-sm font-medium transition-all shadow-sm border border-transparent",
                activeFilter === filter.value 
                  ? "bg-primary text-white shadow-lg shadow-primary/20" 
                  : "bg-white dark:bg-slate-900 text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 border-slate-100 dark:border-slate-800"
              )}
            >
              {filter.label}
            </button>
          ))}
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {filteredProjects.map((project, i) => (
            <div 
              key={i}
              className="group glass rounded-xl p-6 md:p-8 hover-lift flex flex-col h-full border border-slate-100 dark:border-slate-800 hover:border-primary/20"
            >
              <div className="mb-6 flex items-start justify-between">
                <div className="p-3 md:p-4 bg-primary/10 rounded-xl text-primary">
                  <project.icon size={28} />
                </div>
                <div className="flex space-x-2">
                  <a href={project.github} target="_blank" rel="noopener noreferrer" className="p-2 text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
                    <Github size={18} />
                  </a>
                  <a href={project.link} target="_blank" rel="noopener noreferrer" className="p-2 text-slate-400 hover:text-primary transition-colors">
                    <ExternalLink size={18} />
                  </a>
                </div>
              </div>

              <h3 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white mb-4 group-hover:text-primary transition-colors">
                {project.title}
              </h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm mb-6 flex-grow leading-relaxed">
                {project.description}
              </p>

              <div className="flex flex-wrap gap-2 pt-6 border-t border-slate-100 dark:border-slate-800">
                {project.tech.map((t) => (
                  <span key={t} className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 rounded-lg text-[9px] font-bold text-slate-500 uppercase tracking-wider">
                    {t}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
