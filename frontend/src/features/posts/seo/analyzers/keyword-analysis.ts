import { SeoCheck, SeoInput } from '../types';

export const analyzeKeywords = (input: SeoInput): SeoCheck[] => {
  const { title, content, focusKeyword } = input;
  const checks: SeoCheck[] = [];

  if (!focusKeyword) {
    return [{
      id: 'no-keyword',
      label: 'Từ khóa chính',
      type: 'error',
      message: 'Vui lòng nhập từ khóa chính để bắt đầu phân tích.',
      score: 0
    }];
  }

  const keyword = focusKeyword.toLowerCase();
  const lowerTitle = title.toLowerCase();
  const lowerContent = content.toLowerCase();

  // 1. Keyword in Title
  if (lowerTitle.includes(keyword)) {
    checks.push({
      id: 'keyword-in-title',
      label: 'Từ khóa trong tiêu đề',
      type: 'success',
      message: 'Từ khóa chính xuất hiện trong tiêu đề.',
      score: 15
    });
  } else {
    checks.push({
      id: 'keyword-in-title',
      label: 'Từ khóa trong tiêu đề',
      type: 'error',
      message: 'Từ khóa chính không xuất hiện trong tiêu đề.',
      score: 0
    });
  }

  // 2. Keyword in first paragraph (simulated)
  const firstParagraph = lowerContent.split('\n')[0] || '';
  if (firstParagraph.includes(keyword)) {
    checks.push({
      id: 'keyword-in-intro',
      label: 'Từ khóa ở đoạn đầu',
      type: 'success',
      message: 'Từ khóa xuất hiện ngay trong đoạn giới thiệu.',
      score: 10
    });
  } else {
    checks.push({
      id: 'keyword-in-intro',
      label: 'Từ khóa ở đoạn đầu',
      type: 'warning',
      message: 'Nên để từ khóa chính xuất hiện trong 100 chữ đầu tiên.',
      score: 5
    });
  }

  // 3. Keyword Density
  const words = lowerContent.split(/\s+/).filter(w => w.length > 0);
  const keywordCount = (lowerContent.match(new RegExp(keyword, 'g')) || []).length;
  const density = words.length > 0 ? (keywordCount / words.length) * 100 : 0;

  if (density >= 0.5 && density <= 2.5) {
    checks.push({
      id: 'keyword-density',
      label: 'Mật độ từ khóa',
      type: 'success',
      message: `Mật độ từ khóa là ${density.toFixed(2)}%, rất tốt.`,
      score: 15
    });
  } else if (density > 2.5) {
    checks.push({
      id: 'keyword-density',
      label: 'Mật độ từ khóa',
      type: 'error',
      message: `Mật độ quá cao (${density.toFixed(2)}%), tránh nhồi nhét từ khóa.`,
      score: 0
    });
  } else {
    checks.push({
      id: 'keyword-density',
      label: 'Mật độ từ khóa',
      type: 'warning',
      message: `Mật độ từ khóa thấp (${density.toFixed(2)}%), nên bổ sung thêm.`,
      score: 5
    });
  }

  return checks;
};
