'use client';

import Link from 'next/link';
import { ChevronRight, ShieldCheck, Clock } from 'lucide-react';

export default function PrivacyPage() {
  return (
    <div className="pt-24 pb-12 px-4 min-h-screen bg-slate-50/30 dark:bg-slate-950/30">
      <div className="max-w-4xl mx-auto">
        {/* Breadcrumbs */}
        <nav className="flex items-center space-x-2 mb-4 text-[10px] font-bold uppercase tracking-widest text-slate-400">
          <Link href="/" className="hover:text-primary transition-colors flex items-center">Trang chủ</Link>
          <ChevronRight size={10} className="text-slate-300" />
          <span className="text-slate-500">Quyền riêng tư</span>
        </nav>

        {/* Header Section */}
        <div className="mb-2">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-primary/5 border border-primary/10 mb-2">
            <ShieldCheck size={14} className="text-primary" />
            <span className="text-[10px] font-bold text-primary uppercase tracking-widest">Chính sách bảo mật</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-display font-bold text-slate-900 dark:text-white mb-2">
            Quyền riêng tư
          </h1>
          <div className="flex items-center text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            <Clock size={12} className="mr-2" />
            Cập nhật lần cuối: 18/04/2026
          </div>
        </div>

        {/* Content Card */}
        <article className="bg-white dark:bg-slate-900 rounded-[2rem] p-8 md:p-12 shadow-sm border border-slate-100 dark:border-slate-800/50">
          <div className="rich-text-content admin-content article-body">
            <p className="italic text-slate-500 mb-8 pb-4 border-b border-slate-100 dark:border-slate-800">
              Blog Portfolio (sau đây gọi là “Blog”, “chúng tôi”, “tôi”) cam kết tôn trọng và bảo vệ quyền riêng tư của bạn. Chính sách bảo mật này giải thích cách chúng tôi thu thập, sử dụng, lưu trữ và bảo vệ thông tin cá nhân khi bạn truy cập và sử dụng blog.
            </p>

            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">1. Thông tin chúng tôi thu thập</h3>
            <ul className="space-y-4 mb-8">
              <li>
                <strong>Thông tin tự động thu thập:</strong> Khi bạn truy cập blog, chúng tôi có thể thu thập thông tin như địa chỉ IP, loại trình duyệt, thiết bị sử dụng, thời gian truy cập, trang bạn xem (qua công cụ như Google Analytics hoặc tương tự).
              </li>
              <li>
                <strong>Thông tin bạn cung cấp chủ động:</strong>
                <ul className="ml-6 mt-2 list-disc space-y-2 text-sm text-slate-600 dark:text-slate-400">
                  <li>Khi để lại bình luận: tên, email, nội dung bình luận.</li>
                  <li>Khi liên hệ qua form: tên, email, tin nhắn.</li>
                  <li>Khi đăng ký nhận tin (newsletter): địa chỉ email.</li>
                </ul>
              </li>
              <li>
                <strong>Cookies và công nghệ tương tự:</strong> Chúng tôi sử dụng cookies để cải thiện trải nghiệm (nhớ cài đặt ngôn ngữ, phân tích lượt truy cập). Bạn có thể tắt cookies trong trình duyệt, nhưng một số tính năng có thể bị ảnh hưởng.
              </li>
            </ul>

            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">2. Mục đích sử dụng thông tin</h3>
            <ul className="space-y-2 mb-8">
              <li>• Cải thiện nội dung và trải nghiệm người dùng.</li>
              <li>• Phản hồi bình luận và liên hệ.</li>
              <li>• Gửi newsletter (nếu bạn đăng ký).</li>
              <li>• Phân tích thống kê để hiểu hành vi truy cập (không nhận diện cá nhân cụ thể).</li>
              <li>• Tuân thủ pháp luật khi có yêu cầu từ cơ quan nhà nước có thẩm quyền.</li>
            </ul>

            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">3. Chia sẻ thông tin</h3>
            <p className="mb-4">Chúng tôi không bán thông tin cá nhân của bạn cho bên thứ ba. Thông tin chỉ có thể được chia sẻ trong các trường hợp:</p>
            <ul className="space-y-4 mb-8">
              <li>
                <strong>Với nhà cung cấp dịch vụ:</strong> (Google Analytics, nền tảng bình luận, dịch vụ email marketing...) – họ chỉ được sử dụng thông tin để cung cấp dịch vụ cho chúng tôi và phải tuân thủ bảo mật.
              </li>
              <li>
                <strong>Khi có yêu cầu của pháp luật:</strong> (Cơ quan nhà nước Việt Nam).
              </li>
            </ul>

            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">4. Bảo mật và lưu trữ</h3>
            <p className="mb-4">Chúng tôi áp dụng các biện pháp kỹ thuật và tổ chức hợp lý để bảo vệ thông tin cá nhân khỏi mất mát, lạm dụng hoặc truy cập trái phép.</p>
            <p className="mb-8">Thông tin sẽ được lưu trữ trong thời gian cần thiết cho mục đích đã nêu, hoặc theo quy định pháp luật (thường không quá 2 năm đối với một số loại dữ liệu theo quy định Việt Nam).</p>

            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">5. Quyền của bạn</h3>
            <p className="mb-4">Theo Nghị định 13/2023/NĐ-CP, bạn có quyền:</p>
            <ul className="space-y-2 mb-8">
              <li>• Truy cập, chỉnh sửa hoặc yêu cầu xóa thông tin cá nhân của mình.</li>
              <li>• Rút lại sự đồng ý (với một số ngoại lệ theo pháp luật).</li>
              <li>• Khiếu nại nếu bạn cho rằng quyền riêng tư bị vi phạm.</li>
            </ul>
            <p className="mb-8">Để thực hiện quyền này, vui lòng liên hệ qua email: <span className="text-primary font-bold">luumac2801@gmail.com</span>.</p>

            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">6. Liên kết đến trang thứ ba</h3>
            <p className="mb-8">Blog có thể chứa liên kết đến website khác. Chúng tôi không chịu trách nhiệm về chính sách bảo mật của các trang đó. Hãy đọc chính sách của họ trước khi cung cấp thông tin.</p>

            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">7. Thay đổi chính sách</h3>
            <p className="mb-8">Chúng tôi có thể cập nhật chính sách này bất kỳ lúc nào. Phiên bản mới sẽ được đăng trên blog và có hiệu lực ngay khi đăng. Bạn nên kiểm tra định kỳ. Bằng việc tiếp tục sử dụng blog, bạn đồng ý với Chính sách bảo mật này.</p>
          </div>
        </article>
      </div>
    </div>
  );
}
