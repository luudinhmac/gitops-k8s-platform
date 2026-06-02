'use client';

import { LucideIcon, Save, FileText } from 'lucide-react';
import AdminPageHeader from '@/features/admin/components/AdminPageHeader';

interface EditorHeaderProps {
  title: string;
  isEditMode: boolean;
  postId?: number;
  submitting: boolean;
  hasErrors: boolean;
  onSave: (published: boolean) => void;
}

export default function EditorHeader({
  title,
  isEditMode,
  postId,
  submitting,
  hasErrors,
  onSave
}: EditorHeaderProps) {
  return (
    <AdminPageHeader 
      title={isEditMode ? "Chỉnh sửa bài viết" : "Viết bài mới"}
      subtitle={isEditMode ? `ID: #${postId} • ${title || 'Đang soạn thảo'}` : "Bắt đầu chia sẻ kiến thức của bạn"}
      showBack={true}
      backHref="/profile"
      primaryAction={{
        label: isEditMode ? "Cập nhật bài viết" : "Xuất bản bài viết",
        icon: Save,
        onClick: () => onSave(true),
        loading: submitting,
        disabled: hasErrors
      }}
      secondaryAction={{
        label: "Lưu bản nháp",
        icon: FileText,
        onClick: () => onSave(false),
        loading: submitting,
        disabled: hasErrors
      }}
    />
  );
}
