import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Kết hợp các Class Name của Tailwind một cách thông minh,
 * giúp xử lý các class bị ghi đè hoặc xung đột một cách tự động.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Chuyển đổi văn bản thành đường dẫn (slug) thân thiện với SEO,
 * xử lý tốt tiếng Việt có dấu và ký tự đặc biệt.
 */
export function slugify(text: string) {
  return text.toLowerCase()
    .normalize('NFD') // Tách các dấu ra khỏi chữ cái
    .replace(/[\u0300-\u036f]/g, '') // Loại bỏ các dấu
    .replace(/[đĐ]/g, 'd') // Xử lý chữ đ
    .replace(/[^a-z0-9\s-]/g, '') // Loại bỏ ký tự đặc biệt
    .trim()
    .replace(/\s+/g, '-') // Thay khoảng trắng bằng dấu gạch ngang
    .replace(/-+/g, '-'); // Loại bỏ nhiều dấu gạch ngang liên tiếp
}




