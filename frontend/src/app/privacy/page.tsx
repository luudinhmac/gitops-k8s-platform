import { Metadata } from 'next';
import PrivacyContent from './PrivacyContent';

export const metadata: Metadata = {
  title: 'Quyền riêng tư | Lưu Đình Mác',
  description: 'Chính sách bảo mật và quyền riêng tư của Blog Portfolio Lưu Đình Mác. Tìm hiểu cách chúng tôi bảo vệ thông tin cá nhân của bạn.',
  openGraph: {
    title: 'Quyền riêng tư | Lưu Đình Mác',
    description: 'Chính sách bảo mật và quyền riêng tư của Blog Portfolio Lưu Đình Mác.',
  },
};

export default function PrivacyPage() {
  return <PrivacyContent />;
}
