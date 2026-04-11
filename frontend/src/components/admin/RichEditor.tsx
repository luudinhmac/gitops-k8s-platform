'use client';

import { useState, useMemo, useRef } from 'react';
import dynamic from 'next/dynamic';
import 'react-quill-new/dist/quill.snow.css';
import { FileUp, Loader2 } from 'lucide-react';
import * as mammoth from 'mammoth';

// Register fonts in Quill
const registerQuill = async () => {
    const Quill = (await import('react-quill-new')).default.Quill;
    const Font = Quill.import('formats/font');
    Font.whitelist = ['inter', 'roboto', 'georgia', 'times-new-roman', 'courier-new'];
    Quill.register(Font, true);
};
registerQuill();

// Dynamic import to avoid SSR issues with Quill
const ReactQuill = dynamic(async () => {
    const { default: RQ } = await import('react-quill-new');
    return RQ;
}, {
    ssr: false,
    loading: () => <div className="h-[400px] w-full bg-slate-50 animate-pulse rounded-2xl flex items-center justify-center text-slate-400">Đang tải trình soạn thảo...</div>
});

interface RichEditorProps {
    value: string;
    onChange: (content: string) => void;
    placeholder?: string;
}

export default function RichEditor({ value, onChange, placeholder }: RichEditorProps) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [importing, setImporting] = useState(false);

    const modules = useMemo(() => ({
        toolbar: {
            container: [
                [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
                [{ 'font': ['inter', 'roboto', 'georgia', 'times-new-roman', 'courier-new'] }],
                [{ 'size': ['small', false, 'large', 'huge'] }],
                ['bold', 'italic', 'underline', 'strike'],
                [{ 'color': [] }, { 'background': [] }],
                [{ 'script': 'sub' }, { 'script': 'super' }],
                [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'indent': '-1' }, { 'indent': '+1' }],
                [{ 'direction': 'rtl' }, { 'align': [] }],
                ['blockquote', 'code-block'],
                ['link', 'image', 'video'],
                ['clean']
            ],
        },
        clipboard: {
            matchVisual: false,
        }
    }), []);

    const formats = [
        'header', 'font', 'size',
        'bold', 'italic', 'underline', 'strike', 'blockquote',
        'list', 'indent',
        'link', 'image', 'video', 'color', 'background', 'align', 'code-block'
    ];

    const handleFileImport = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setImporting(true);
        const reader = new FileReader();

        if (file.name.endsWith('.docx')) {
            reader.onload = async (event) => {
                const arrayBuffer = event.target?.result as ArrayBuffer;
                try {
                    const result = await mammoth.convertToHtml({ arrayBuffer });
                    onChange(result.value);
                } catch {
                    alert('Không thể chuyển đổi file Word!');
                } finally {
                    setImporting(false);
                }
            };
            reader.readAsArrayBuffer(file);
        } else {
            reader.onload = (event) => {
                const content = event.target?.result as string;
                if (file.name.endsWith('.md')) {
                    onChange(content.replace(/\n/g, '<br>'));
                } else if (file.name.endsWith('.html')) {
                    onChange(content);
                } else {
                    onChange(content.split('\n').map(line => `<p>${line}</p>`).join(''));
                }
                setImporting(false);
            };
            reader.readAsText(file);
        }
        
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    return (
        <div className="relative rich-editor-container">
            <div className="absolute right-2 top-2 z-10">
                <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center space-x-2 px-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-[10px] font-bold text-slate-500 hover:text-primary transition-colors shadow-sm"
                    disabled={importing}
                >
                    {importing ? <Loader2 size={14} className="animate-spin" /> : <FileUp size={14} />}
                    <span>NHẬP TỪ FILE</span>
                </button>
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileImport}
                    accept=".txt,.html,.md,.docx"
                    className="hidden"
                />
            </div>
            
            <ReactQuill
                theme="snow"
                value={value}
                onChange={onChange}
                modules={modules}
                formats={formats}
                placeholder={placeholder || 'Bắt đầu viết nội dung bài viết của bạn...'}
                className="bg-white dark:bg-slate-900 rounded-2xl overflow-hidden min-h-[400px]"
            />

            <style jsx global>{`
                .ql-toolbar.ql-snow {
                    border: none !important;
                    background: #f8fafc;
                    padding: 12px !important;
                    border-bottom: 1px solid #e2e8f0 !important;
                }
                .dark .ql-toolbar.ql-snow {
                    background: #0f172a;
                    border-bottom-color: #1e293b !important;
                }
                .ql-container.ql-snow {
                    border: none !important;
                    font-family: var(--font-sans) !important;
                    font-size: 16px !important;
                }
                .ql-editor {
                    min-h-[350px];
                    line-height: 1.8;
                    padding: 24px !important;
                }
                .ql-editor p {
                    margin-bottom: 1.5rem;
                }
                /* Font Whitelist Classes */
                .ql-font-inter { font-family: 'Inter', sans-serif !important; }
                .ql-font-roboto { font-family: 'Roboto', sans-serif !important; }
                .ql-font-georgia { font-family: 'Georgia', serif !important; }
                .ql-font-times-new-roman { font-family: 'Times New Roman', serif !important; }
                .ql-font-courier-new { font-family: 'Courier New', monospace !important; }

                .dark .ql-snow .ql-stroke {
                    stroke: #94a3b8 !important;
                }
                .dark .ql-snow .ql-fill {
                    fill: #94a3b8 !important;
                }
                .dark .ql-snow .ql-picker {
                    color: #94a3b8 !important;
                }
                .dark .ql-snow .ql-picker-options {
                    background-color: #0f172a !important;
                    border-color: #1e293b !important;
                    color: #94a3b8 !important;
                }
            `}</style>
        </div>
    );
}
