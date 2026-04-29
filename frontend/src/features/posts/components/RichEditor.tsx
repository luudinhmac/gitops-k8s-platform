'use client';

import { useState, useMemo, useRef } from 'react';
import dynamic from 'next/dynamic';
import 'react-quill-new/dist/quill.snow.css';
import { FileUp, Loader2 } from 'lucide-react';
import MessageDialog from '@/shared/components/ui/MessageDialog';
import * as mammoth from 'mammoth';


// Register fonts in Quill
const registerQuill = async () => {
    if (typeof window === 'undefined') return;
    const Quill = (await import('react-quill-new')).default.Quill;
    const Font = Quill.import('formats/font') as { whitelist: string[] };
    Font.whitelist = ['inter', 'roboto', 'georgia', 'times-new-roman', 'courier-new'];
    // @ts-expect-error - Quill type definition doesn't fully match the dynamically imported Font module
    Quill.register(Font, true);
};

// Dynamic import to avoid SSR issues with Quill
const ReactQuill = dynamic(async () => {
    await registerQuill();
    const { default: RQ } = await import('react-quill-new');
    return RQ;
}, {
    ssr: false,
    loading: () => <div className="h-[400px] w-full bg-slate-50 animate-pulse rounded-xl flex items-center justify-center text-slate-400">Đang tải trình soạn thảo...</div>
});

interface RichEditorProps {
    id?: string;
    value: string;
    onChange: (content: string) => void;
    placeholder?: string;
}

export default function RichEditor({ id, value, onChange, placeholder }: RichEditorProps) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [importing, setImporting] = useState(false);
    const [msgData, setMsgData] = useState<{ isOpen: boolean; title: string; message: string; variant: 'info' | 'success' | 'warning' | 'error' }>({ 
        isOpen: false, title: '', message: '', variant: 'error' 
    });

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
            handlers: {
                image: function() {
                    const input = document.createElement('input');
                    input.setAttribute('type', 'file');
                    input.setAttribute('accept', 'image/*');
                    input.click();

                    input.onchange = async () => {
                        const file = input.files?.[0];
                        if (!file) return;

                        const formData = new FormData();
                        formData.append('file', file);

                        try {
                            const res = await fetch(`/api/v1/upload?type=content`, {
                                method: 'POST',
                                body: formData,
                                credentials: 'include'
                            });
                            const data = await res.json();
                            
                            if (data.success && data.url) {
                                // @ts-ignore - this context points to the Quill editor
                                const quill = this.quill;
                                const range = quill.getSelection();
                                quill.insertEmbed(range.index, 'image', `${process.env.NEXT_PUBLIC_API_URL?.replace('/api', '')}${data.url}`);
                            }
                        } catch (error) {
                            console.error('Lỗi khi upload ảnh:', error);
                            setMsgData({ isOpen: true, title: 'Lỗi upload', message: 'Không thể tải ảnh vào bài viết vào lúc này.', variant: 'error' });
                        }
                    };
                }
            }
        },
        clipboard: {
            matchVisual: false,
        }
    }), []);

    const formats = [
        'header', 'font', 'size',
        'bold', 'italic', 'underline', 'strike', 'blockquote',
        'list', 'indent', 'script', 'direction',
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
                    setMsgData({ isOpen: true, title: 'Lỗi chuyển đổi', message: 'Đã có lỗi xảy ra khi đọc file Word (.docx).', variant: 'error' });
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
        <div id={id} className="rich-editor-container border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden bg-slate-50/50 dark:bg-slate-950/50">
            {/* Auxiliary Actions Header */}
            <div className="flex items-center justify-between p-3 border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
                <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Trình soạn thảo bài viết</span>
                </div>
                <div className="flex items-center space-x-2">
                    <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="flex items-center space-x-2 px-3 py-1.5 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-[10px] font-bold text-slate-600 dark:text-slate-400 hover:text-primary hover:bg-primary/5 transition-all shadow-sm"
                        disabled={importing}
                    >
                        {importing ? <Loader2 size={14} className="animate-spin" /> : <FileUp size={14} />}
                        <span>NHẬP TỪ FILE</span>
                    </button>
                    <input
                        id="rich-editor-file-import"
                        name="import_file"
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileImport}
                        accept=".txt,.html,.md,.docx"
                        className="hidden"
                    />
                </div>
            </div>
            
            <div className="relative">
                <ReactQuill
                    theme="snow"
                    value={value}
                    onChange={onChange}
                    modules={modules}
                    formats={formats}
                    placeholder={placeholder || 'Bắt đầu viết nội dung bài viết của bạn...'}
                    className="bg-white dark:bg-slate-900 min-h-[400px]"
                />
            </div>

            <style jsx global>{`
                .ql-toolbar.ql-snow {
                    border: none !important;
                    background: #f8fafc !important;
                    padding: 10px 14px !important;
                    border-bottom: 1px solid #e2e8f0 !important;
                    display: flex;
                    flex-wrap: wrap;
                    gap: 4px;
                }
                .dark .ql-toolbar.ql-snow {
                    background: #111827 !important;
                    border-bottom-color: #1e293b !important;
                }
                .ql-container.ql-snow {
                    border: none !important;
                    font-family: 'Inter', sans-serif !important;
                    font-size: 16px !important;
                }
                .ql-editor {
                    min-height: 400px;
                    line-height: 1.8;
                    padding: 32px !important;
                    font-family: 'Inter', sans-serif;
                }
                
                /* FIX: Font Picker Width and Display */
                .ql-snow .ql-picker.ql-font {
                    width: 140px !important; /* Increased width */
                }
                .ql-snow .ql-picker.ql-font .ql-picker-label {
                    padding: 0 8px !important;
                    display: flex;
                    align-items: center;
                    border: 1px solid #e2e8f0;
                    border-radius: 6px;
                    background: white;
                }
                .dark .ql-snow .ql-picker.ql-font .ql-picker-label {
                    border-color: #334155;
                    background: #1e293b;
                }
                .ql-snow .ql-picker.ql-font .ql-picker-label::before {
                    line-height: 24px;
                    margin-right: 20px;
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

                /* Show Font Names in Picker */
                .ql-snow .ql-picker.ql-font .ql-picker-label[data-value="inter"]::before,
                .ql-snow .ql-picker.ql-font .ql-picker-item[data-value="inter"]::before { content: 'Inter'; font-family: 'Inter', sans-serif; }
                
                .ql-snow .ql-picker.ql-font .ql-picker-label[data-value="roboto"]::before,
                .ql-snow .ql-picker.ql-font .ql-picker-item[data-value="roboto"]::before { content: 'Roboto'; font-family: 'Roboto', sans-serif; }
                
                .ql-snow .ql-picker.ql-font .ql-picker-label[data-value="georgia"]::before,
                .ql-snow .ql-picker.ql-font .ql-picker-item[data-value="georgia"]::before { content: 'Georgia'; font-family: 'Georgia', serif; }
                
                .ql-snow .ql-picker.ql-font .ql-picker-label[data-value="times-new-roman"]::before,
                .ql-snow .ql-picker.ql-font .ql-picker-item[data-value="times-new-roman"]::before { content: 'Times New Roman'; font-family: 'Times New Roman', serif; }
                
                .ql-snow .ql-picker.ql-font .ql-picker-label[data-value="courier-new"]::before,
                .ql-snow .ql-picker.ql-font .ql-picker-item[data-value="courier-new"]::before { content: 'Courier New'; font-family: 'Courier New', monospace; }

                .ql-snow .ql-picker.ql-font .ql-picker-label:not([data-value])::before,
                .ql-snow .ql-picker.ql-font .ql-picker-item:not([data-value])::before { content: 'Inter'; }

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
                    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
                    border-radius: 8px;
                    padding: 4px !important;
                }
                .ql-editor.ql-blank::before {
                    color: #94a3b8 !important;
                    font-style: normal !important;
                    left: 32px !important;
                }
                .dark .ql-editor.ql-blank::before {
                    color: #475569 !important;
                }
                
                /* Toolbar buttons hover */
                .ql-snow.ql-toolbar button:hover,
                .ql-snow .ql-toolbar button:hover,
                .ql-snow.ql-toolbar button:focus,
                .ql-snow .ql-toolbar button:focus,
                .ql-snow.ql-toolbar .ql-picker-label:hover,
                .ql-snow .ql-toolbar .ql-picker-label:hover,
                .ql-snow.ql-toolbar .ql-picker-item:hover,
                .ql-snow .ql-toolbar .ql-picker-item:hover {
                    color: #3b82f6 !important;
                    background: rgba(59, 130, 246, 0.05) !important;
                    border-radius: 4px;
                }
                .ql-snow.ql-toolbar button.ql-active,
                .ql-snow .ql-toolbar button.ql-active,
                .ql-snow.ql-toolbar .ql-picker-label.ql-active,
                .ql-snow .ql-toolbar .ql-picker-label.ql-active,
                .ql-snow.ql-toolbar .ql-picker-item.ql-selected,
                .ql-snow .ql-toolbar .ql-picker-item.ql-selected {
                    color: #3b82f6 !important;
                    background: rgba(59, 130, 246, 0.1) !important;
                    border-radius: 4px;
                }
            `}</style>

            <MessageDialog 
                isOpen={msgData.isOpen}
                onClose={() => setMsgData({ ...msgData, isOpen: false })}
                title={msgData.title}
                message={msgData.message}
                variant={msgData.variant}
            />
        </div>
    );
}

