import { Metadata } from 'next';
import AboutContent from './AboutContent';

export const metadata: Metadata = {
  title: 'Về tôi | Lưu Đình Mác',
  description: 'System Engineer & Web Developer chuyên về Hạ tầng Đám mây, Tự động hóa và Phát triển Phần mềm. Tìm hiểu thêm về kinh nghiệm và hành trình chuyên môn của tôi.',
  openGraph: {
    title: 'Về tôi | Lưu Đình Mác',
    description: 'System Engineer & Web Developer chuyên về Hạ tầng Đám mây, Tự động hóa và Phát triển Phần mềm.',
    images: ['/favicon.ico'], // Fallback
  },
};

export default function AboutPage() {
  return <AboutContent />;
}
