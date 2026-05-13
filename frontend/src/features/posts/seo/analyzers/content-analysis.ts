import { SeoCheck, SeoInput } from '../types';

export const analyzeContent = (input: SeoInput): SeoCheck[] => {
  const { content } = input;
  const checks: SeoCheck[] = [];

  // 1. Internal/External Links
  const linkCount = (content.match(/<a /g) || []).length;
  if (linkCount > 0) {
    checks.push({
      id: 'links',
      label: 'Liên kết',
      type: 'success',
      message: `Đã tìm thấy ${linkCount} liên kết trong bài viết.`,
      score: 10
    });
  } else {
    checks.push({
      id: 'links',
      label: 'Liên kết',
      type: 'warning',
      message: 'Nên thêm các liên kết nội bộ và bên ngoài.',
      score: 0
    });
  }

  // 2. Images and Alt text
  const imgCount = (content.match(/<img /g) || []).length;
  const altCount = (content.match(/alt=["'][^"']+["']/g) || []).length;

  if (imgCount > 0) {
    if (altCount === imgCount) {
      checks.push({
        id: 'images',
        label: 'Hình ảnh',
        type: 'success',
        message: 'Tất cả hình ảnh đều có thẻ alt.',
        score: 10
      });
    } else {
      checks.push({
        id: 'images',
        label: 'Hình ảnh',
        type: 'warning',
        message: `${imgCount - altCount} hình ảnh thiếu thẻ alt.`,
        score: 5
      });
    }
  } else {
    checks.push({
      id: 'images',
      label: 'Hình ảnh',
      type: 'warning',
      message: 'Bài viết sẽ bắt mắt hơn nếu có hình ảnh minh họa.',
      score: 0
    });
  }

  // 3. Heading Structure
  const h2Count = (content.match(/<h2/g) || []).length;
  if (h2Count >= 2) {
    checks.push({
      id: 'headings',
      label: 'Phân cấp nội dung',
      type: 'success',
      message: 'Bài viết có cấu trúc phân cấp tốt (H2).',
      score: 10
    });
  } else {
    checks.push({
      id: 'headings',
      label: 'Phân cấp nội dung',
      type: 'warning',
      message: 'Nên sử dụng ít nhất 2 thẻ H2 để cấu trúc nội dung.',
      score: 5
    });
  }

  return checks;
};
