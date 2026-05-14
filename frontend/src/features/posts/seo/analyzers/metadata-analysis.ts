import { SeoCheck, SeoInput } from '../types';

export const analyzeMetadata = (input: SeoInput): SeoCheck[] => {
  const { title, metaDescription } = input;
  const checks: SeoCheck[] = [];

  // 1. Title Length
  if (title.length >= 40 && title.length <= 70) {
    checks.push({
      id: 'title-length',
      label: 'Độ dài tiêu đề',
      type: 'success',
      message: 'Tiêu đề có độ dài lý tưởng (40-70 ký tự).',
      score: 10
    });
  } else if (title.length > 70) {
    checks.push({
      id: 'title-length',
      label: 'Độ dài tiêu đề',
      type: 'warning',
      message: 'Tiêu đề quá dài, có thể bị cắt bớt trên Google.',
      score: 5
    });
  } else {
    checks.push({
      id: 'title-length',
      label: 'Độ dài tiêu đề',
      type: 'error',
      message: 'Tiêu đề quá ngắn (dưới 40 ký tự).',
      score: 0
    });
  }

  // 2. Meta Description
  if (!metaDescription) {
    checks.push({
      id: 'meta-desc',
      label: 'Meta Description',
      type: 'error',
      message: 'Vui lòng nhập mô tả meta để cải thiện CTR.',
      score: 0
    });
  } else if (metaDescription.length >= 120 && metaDescription.length <= 160) {
    checks.push({
      id: 'meta-desc',
      label: 'Meta Description',
      type: 'success',
      message: 'Mô tả meta có độ dài lý tưởng.',
      score: 10
    });
  } else {
    checks.push({
      id: 'meta-desc',
      label: 'Meta Description',
      type: 'warning',
      message: 'Mô tả meta nên nằm trong khoảng 120-160 ký tự.',
      score: 5
    });
  }

  return checks;
};
