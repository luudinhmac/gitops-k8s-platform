'use client';

import Link from 'next/link';
import { ChevronRight, FileText, Clock } from 'lucide-react';

export default function TermsContent() {
  return (
    <div className="pt-24 pb-12 px-4 min-h-screen bg-slate-50/30 dark:bg-slate-950/30">
      <div className="max-w-4xl mx-auto">
        {/* Breadcrumbs */}
        <nav className="flex items-center space-x-2 mb-4 text-[10px] font-bold uppercase tracking-widest text-slate-400">
          <Link href="/" className="hover:text-primary transition-colors flex items-center">Trang chủ</Link>
          <ChevronRight size={10} className="text-slate-300" />
          <span className="text-slate-500">Điều khoản</span>
        </nav>

        {/* Header Section */}
        <div className="mb-2">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-500/5 border border-blue-500/10 mb-2 text-blue-500">
            <FileText size={14} />
            <span className="text-[10px] font-bold uppercase tracking-widest">Điều khoản & Điều kiện</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-display font-bold text-slate-900 dark:text-white mb-2">
            Điều khoản sử dụng
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
              Khi truy cập và sử dụng blog Portfolio (“Blog”), bạn đồng ý tuân thủ các điều khoản sau. Nếu bạn không đồng ý, vui lòng không sử dụng blog.
            </p>

            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">1. Nội dung trên blog</h3>
            <ul className="space-y-4 mb-8">
              <li>• Tất cả bài viết, hình ảnh, video và nội dung trên blog là tài sản trí tuệ của [Macld / Blog] hoặc được sử dụng hợp pháp.</li>
              <li>• Bạn được phép đọc, chia sẻ (với ghi nguồn đầy đủ và liên kết về blog) cho mục đích cá nhân, phi thương mại.</li>
              <li>• <strong className="text-red-500">Cấm:</strong> Sao chép toàn bộ hoặc một phần nội dung để đăng lại trên website khác, sử dụng thương mại, chỉnh sửa mà không có sự cho phép bằng văn bản.</li>
            </ul>

            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">2. Bình luận và tương tác</h3>
            <ul className="space-y-4 mb-8">
              <li>• Bạn chịu hoàn toàn trách nhiệm về nội dung bình luận mình đăng.</li>
              <li>• Chúng tôi không chịu trách nhiệm về nội dung bình luận của người dùng.</li>
              <li>• Bình luận vi phạm (xúc phạm, thù địch, spam, vi phạm pháp luật Việt Nam, quảng cáo trá hình...) sẽ bị xóa mà không cần báo trước.</li>
              <li>• Chúng tôi có quyền chặn hoặc xóa bình luận mà không phải giải thích.</li>
            </ul>

            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">3. Hành vi bị cấm</h3>
            <p className="mb-4">Khi sử dụng blog, bạn không được:</p>
            <ul className="space-y-4 mb-8">
              <li>• Tải lên hoặc đăng nội dung vi phạm pháp luật Việt Nam (chống Nhà nước, xúc phạm danh dự cá nhân, đồi trụy, bạo lực, lừa đảo...).</li>
              <li>• Sử dụng blog để phát tán virus, spam, tấn công hoặc gây hại.</li>
              <li>• Thu thập dữ liệu người dùng khác một cách trái phép.</li>
              <li>• Giả mạo người khác hoặc cung cấp thông tin sai lệch.</li>
            </ul>

            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">4. Giới hạn trách nhiệm</h3>
            <ul className="space-y-4 mb-8">
              <li>• Blog cung cấp nội dung “như hiện có” (as is). Chúng tôi không đảm bảo nội dung chính xác 100% hoặc phù hợp với mọi mục đích.</li>
              <li>• Chúng tôi không chịu trách nhiệm về bất kỳ thiệt hại trực tiếp hoặc gián tiếp nào phát sinh từ việc sử dụng blog (mất dữ liệu, mất mát tài chính...).</li>
              <li>• Blog có thể chứa liên kết đến website bên thứ ba. Chúng tôi không kiểm soát và không chịu trách nhiệm về nội dung của các trang đó.</li>
            </ul>

            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">5. Chấm dứt sử dụng</h3>
            <p className="mb-8">Chúng tôi có quyền chấm dứt hoặc hạn chế quyền truy cập của bạn vào blog bất kỳ lúc nào nếu phát hiện vi phạm điều khoản, mà không cần thông báo trước.</p>

            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">6. Luật áp dụng</h3>
            <p className="mb-8">Các điều khoản này được điều chỉnh bởi pháp luật Việt Nam. Bất kỳ tranh chấp nào sẽ được giải quyết tại tòa án có thẩm quyền tại Việt Nam.</p>

            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">7. Thay đổi điều khoản</h3>
            <p className="mb-8">Chúng tôi có thể cập nhật điều khoản này bất kỳ lúc nào. Phiên bản mới sẽ được đăng trên blog. Việc bạn tiếp tục sử dụng sau khi thay đổi nghĩa là bạn chấp nhận phiên bản mới.</p>

            <div className="mt-8 pt-8 border-t border-slate-100 dark:border-slate-800 text-sm text-slate-500">
              <p>Nếu bạn có câu hỏi về Quyền riêng tư hoặc Điều khoản sử dụng, vui lòng liên hệ:</p>
              <p className="mt-2">Email: <span className="text-primary font-bold">luumac2801@gmail.com</span></p>
            </div>
          </div>
        </article>
      </div>
    </div>
  );
}
