import { Metadata } from 'next';
import TermsContent from './TermsContent';

export const metadata: Metadata = {
  title: 'Điều khoản sử dụng | Lưu Đình Mác',
  description: 'Điều khoản và điều kiện sử dụng Blog Portfolio Lưu Đình Mác. Quy định về bản quyền nội dung và trách nhiệm người dùng.',
  openGraph: {
    title: 'Điều khoản sử dụng | Lưu Đình Mác',
    description: 'Điều khoản và điều kiện sử dụng Blog Portfolio Lưu Đình Mác.',
  },
};

export default function TermsPage() {
  return <TermsContent />;
}

