import React from 'react';
import { Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FormattedDateProps {
  date: string | Date;
  className?: string;
  showIcon?: boolean;
  iconSize?: number;
}

const FormattedDate: React.FC<FormattedDateProps> = ({ 
  date, 
  className, 
  showIcon = false, 
  iconSize = 12 
}) => {
  if (!date) return <span className={cn("text-slate-400 italic", className)}>N/A</span>;

  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  if (isNaN(dateObj.getTime())) {
    return <span className={cn("text-slate-400 italic", className)}>Ngày không hợp lệ</span>;
  }

  const formatted = dateObj.toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric'
  });

  return (
    <span className={cn("inline-flex items-center", className)}>
      {showIcon && <Calendar size={iconSize} className="mr-1.5 text-primary shrink-0" />}
      {formatted}
    </span>
  );
};

export default FormattedDate;

