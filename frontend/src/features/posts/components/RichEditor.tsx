'use client';

import { useState, useMemo, useRef, useEffect } from 'react';
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
}) as any;

// Helper function to clean pasted text: merges single newlines into spaces but preserves paragraphs and lists
function cleanPastedText(text: string): string {
    if (typeof text !== 'string') return text;
    
    // Normalize newlines
    const normalized = text.replace(/\r\n/g, '\n');
    const lines = normalized.split('\n');
    if (lines.length <= 1) return text;
    
    // Simple heuristic to detect if the text is code:
    // If > 25% of lines start with indentation or end with code symbols, don't clean newlines.
    let codeLikeLines = 0;
    let totalNonEmpty = 0;
    for (const line of lines) {
        const trimmed = line.trim();
        if (trimmed.length === 0) continue;
        totalNonEmpty++;
        if (line.startsWith(' ') || line.startsWith('\t')) {
            codeLikeLines++;
        } else if (trimmed.endsWith(';') || trimmed.endsWith('{') || trimmed.endsWith('}') || trimmed.endsWith('=')) {
            codeLikeLines++;
        }
    }
    
    if (totalNonEmpty > 0 && (codeLikeLines / totalNonEmpty) > 0.25) {
        return text;
    }

    const result: string[] = [];
    for (let i = 0; i < lines.length; i++) {
        const currentLine = lines[i];
        if (i === lines.length - 1) {
            result.push(currentLine);
            break;
        }
        const nextLine = lines[i + 1];
        const currentTrim = currentLine.trim();
        const nextTrim = nextLine.trim();
        
        let joinWithSpace = true;
        
        // Don't join empty lines (preserves paragraphs)
        if (currentTrim.length === 0 || nextTrim.length === 0) {
            joinWithSpace = false;
        }
        // Don't join if next line starts with bullet list points
        else if (/^[-*+•◦▪■]\s/.test(nextTrim)) {
            joinWithSpace = false;
        }
        // Don't join if next line starts with numbered list
        else if (/^\d+[.)]\s/.test(nextTrim)) {
            joinWithSpace = false;
        }
        // Don't join if next line is a heading
        else if (/^(h\d|#+)\s/i.test(nextTrim)) {
            joinWithSpace = false;
        }
        // Don't join if quote block
        else if (nextTrim.startsWith('>') || currentTrim.startsWith('>')) {
            joinWithSpace = false;
        }
        
        if (joinWithSpace) {
            // Join with a space, but handle trailing space in current line to avoid double spaces
            result.push(currentLine.endsWith(' ') ? currentLine : currentLine + ' ');
        } else {
            result.push(currentLine + '\n');
        }
    }
    
    // Join lines and clean up any double spaces
    return result.join('').replace(/ +/g, ' ');
}

const COLOR_PALETTE = [
  "#000000", "#e60000", "#ff9900", "#ffff00", "#008a00", "#0066cc", "#9933ff",
  "#ffffff", "#facccc", "#ffebcc", "#ffffcc", "#cce8cc", "#cce0f5", "#ebd6ff",
  "#bbbbbb", "#f06666", "#ffc266", "#ffff66", "#66b966", "#66a3e0", "#c285ff",
  "#888888", "#a10000", "#b26b00", "#b2b200", "#006100", "#0047b2", "#6b24b2",
  "#444444", "#5c0000", "#663d00", "#666600", "#003700", "#002966", "#3d1466"
];

interface RichEditorProps {
    id?: string;
    name?: string;
    value: string;
    onChange: (content: string) => void;
    placeholder?: string;
}

export default function RichEditor({ id, name, value, onChange, placeholder }: RichEditorProps) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const imageInputRef = useRef<HTMLInputElement>(null);
    const quillRef = useRef<any>(null);
    const lastRangeRef = useRef<{ index: number; length: number } | null>(null);
    const [importing, setImporting] = useState(false);
    const [msgData, setMsgData] = useState<{ isOpen: boolean; title: string; message: string; variant: 'info' | 'success' | 'warning' | 'error' }>({
        isOpen: false, title: '', message: '', variant: 'error'
    });

    const [lastColor, setLastColor] = useState('#e60000');
    const [lastBgColor, setLastBgColor] = useState('#ffff00');
    const [colorOpen, setColorOpen] = useState(false);
    const [bgOpen, setBgOpen] = useState(false);

    const colorPickerRef = useRef<HTMLDivElement>(null);
    const bgPickerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (colorPickerRef.current && !colorPickerRef.current.contains(event.target as Node)) {
                setColorOpen(false);
            }
            if (bgPickerRef.current && !bgPickerRef.current.contains(event.target as Node)) {
                setBgOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleApplyColor = (e: React.MouseEvent) => {
        e.preventDefault();
        const quill = quillRef.current?.getEditor();
        if (quill) {
            quill.focus();
            if (lastColor === 'transparent') {
                quill.format('color', false);
            } else {
                quill.format('color', lastColor);
            }
        }
    };

    const handleSelectColor = (color: string, e: React.MouseEvent) => {
        e.preventDefault();
        setLastColor(color);
        setColorOpen(false);
        const quill = quillRef.current?.getEditor();
        if (quill) {
            quill.focus();
            if (color === 'transparent') {
                quill.format('color', false);
            } else {
                quill.format('color', color);
            }
        }
    };

    const handleApplyBgColor = (e: React.MouseEvent) => {
        e.preventDefault();
        const quill = quillRef.current?.getEditor();
        if (quill) {
            quill.focus();
            if (lastBgColor === 'transparent') {
                quill.format('background', false);
            } else {
                quill.format('background', lastBgColor);
            }
        }
    };

    const handleSelectBgColor = (color: string, e: React.MouseEvent) => {
        e.preventDefault();
        setLastBgColor(color);
        setBgOpen(false);
        const quill = quillRef.current?.getEditor();
        if (quill) {
            quill.focus();
            if (color === 'transparent') {
                quill.format('background', false);
            } else {
                quill.format('background', color);
            }
        }
    };

    useEffect(() => {
        // Fix accessibility for dynamic Quill inputs (formula, link, video tooltips)
        const fixDynamicInputs = () => {
            const inputs = document.querySelectorAll('input[data-formula], input[data-link], input[data-video]');
            inputs.forEach((input, index) => {
                if (!input.id) input.id = `ql-dynamic-${id}-${index}`;
                if (!input.getAttribute('name')) input.setAttribute('name', `ql-dynamic-name-${id}-${index}`);
                if (!input.getAttribute('aria-label')) input.setAttribute('aria-label', 'quill-tool-input');
            });
        };

        const observer = new MutationObserver(fixDynamicInputs);
        observer.observe(document.body, { childList: true, subtree: true });

        fixDynamicInputs();
        return () => observer.disconnect();
    }, [id]);

    const modules = useMemo(() => ({
        toolbar: {
            container: `#toolbar-${id || 'editor'}`,
        },
        clipboard: {
            matchVisual: false,
            matchers: [
                [3, (node: any, delta: any) => {
                    if (delta && delta.ops) {
                        delta.ops = delta.ops.map((op: any) => {
                            if (typeof op.insert === 'string') {
                                op.insert = cleanPastedText(op.insert);
                            }
                            return op;
                        });
                    }
                    return delta;
                }]
            ]
        }
    }), [id]);

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

    const handleImageUploadChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
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
                const quill = quillRef.current?.getEditor();
                if (quill) {
                    quill.focus();
                    const range = lastRangeRef.current;
                    const insertIndex = range ? range.index : quill.getLength();
                    let baseUrl = 'http://localhost:3001';
                    try {
                        baseUrl = new URL(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001').origin;
                    } catch {
                        baseUrl = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001').replace('/api/v1', '').replace('/v1', '').replace('/api', '');
                    }
                    const imageUrl = data.url.startsWith('http://') || data.url.startsWith('https://')
                        ? data.url
                        : `${baseUrl}${data.url}`;
                    quill.insertEmbed(insertIndex, 'image', imageUrl);
                    setTimeout(() => {
                        quill.setSelection(insertIndex + 1, 0);
                    }, 50);
                }
            }
        } catch (error) {
            console.error('Lỗi khi upload ảnh:', error);
            setMsgData({ isOpen: true, title: 'Lỗi upload', message: 'Không thể tải ảnh vào bài viết vào lúc này.', variant: 'error' });
        } finally {
            if (imageInputRef.current) {
                imageInputRef.current.value = '';
            }
        }
    };

    const fileInputId = `file-import-${id || 'editor'}`;

    return (
        <div className="rich-editor-container border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50/50 dark:bg-slate-950/50">
            {/* Auxiliary Actions Header */}
            <div className="flex items-center justify-between p-3 border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm rounded-t-xl">
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
                        tabIndex={-1}
                    >
                        {importing ? <Loader2 size={14} className="animate-spin" /> : <FileUp size={14} />}
                        <span>NHẬP TỪ FILE</span>
                    </button>
                    <input
                        id={fileInputId}
                        name="import_file"
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileImport}
                        accept=".txt,.html,.md,.docx"
                        className="hidden"
                    />
                    <input
                        id="quill-image-upload-helper"
                        name="quill-image-upload-helper"
                        type="file"
                        ref={imageInputRef}
                        onChange={handleImageUploadChange}
                        accept="image/*"
                        className="hidden"
                    />
                </div>
            </div>

            {/* Custom Toolbar HTML to fix accessibility issues with hidden select/input elements */}
            <div id={`toolbar-${id || 'editor'}`} className="ql-toolbar-custom">
                <span className="ql-formats">
                    <select className="ql-header" id={`ql-header-${id}`} name={`ql-header-${id}`} aria-label="Header" defaultValue="" tabIndex={-1}>
                        <option value="1" />
                        <option value="2" />
                        <option value="3" />
                        <option value="4" />
                        <option value="5" />
                        <option value="6" />
                        <option value="" />
                    </select>
                    <select className="ql-font" id={`ql-font-${id}`} name={`ql-font-${id}`} aria-label="Font" defaultValue="inter" tabIndex={-1}>
                        <option value="inter" />
                        <option value="roboto" />
                        <option value="georgia" />
                        <option value="times-new-roman" />
                        <option value="courier-new" />
                    </select>
                    <select className="ql-size" id={`ql-size-${id}`} name={`ql-size-${id}`} aria-label="Size" defaultValue="" tabIndex={-1}>
                        <option value="small" />
                        <option value="" />
                        <option value="large" />
                        <option value="huge" />
                    </select>
                </span>
                <span className="ql-formats">
                    <button className="ql-bold" aria-label="Bold" tabIndex={-1} />
                    <button className="ql-italic" aria-label="Italic" tabIndex={-1} />
                    <button className="ql-underline" aria-label="Underline" tabIndex={-1} />
                    <button className="ql-strike" aria-label="Strike" tabIndex={-1} />
                </span>
                <span className="ql-formats" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                    {/* Custom Text Color Picker */}
                    <div ref={colorPickerRef} className="custom-color-picker-wrapper relative inline-flex items-center">
                        <button
                            type="button"
                            className="custom-color-btn"
                            onClick={handleApplyColor}
                            onMouseDown={(e) => e.preventDefault()}
                            title={`Tô màu chữ (${lastColor === 'transparent' ? 'Mặc định' : lastColor})`}
                            tabIndex={-1}
                        >
                            <span className="text-slate-800 dark:text-slate-200 text-sm font-bold font-serif leading-none relative flex flex-col items-center">
                                A
                                <span className="w-4 h-[3px] rounded-sm mt-0.5" style={{ backgroundColor: lastColor === 'transparent' ? '#cbd5e1' : lastColor }} />
                            </span>
                        </button>
                        <button
                            type="button"
                            className="custom-color-arrow"
                            onClick={(e) => {
                                e.preventDefault();
                                setColorOpen(!colorOpen);
                            }}
                            onMouseDown={(e) => e.preventDefault()}
                            title="Chọn màu chữ"
                            tabIndex={-1}
                        >
                            <svg className="w-2 h-2 text-slate-500 dark:text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>
 
                        {colorOpen && (
                            <div className="absolute top-[32px] left-0 z-50 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg shadow-xl p-2 grid grid-cols-7 gap-1 min-w-[154px]">
                                {/* Option for default color */}
                                <button
                                    type="button"
                                    className="w-4.5 h-4.5 rounded-sm border border-slate-300 dark:border-slate-700 flex items-center justify-center hover:scale-110 cursor-pointer relative overflow-hidden bg-white"
                                    onClick={(e) => handleSelectColor('transparent', e)}
                                    onMouseDown={(e) => e.preventDefault()}
                                    title="Màu mặc định (Default Color)"
                                >
                                    <span className="absolute w-[140%] h-[1.5px] bg-red-500 rotate-45" />
                                </button>
                                {COLOR_PALETTE.map((color) => (
                                    <button
                                        key={color}
                                        type="button"
                                        className="w-4.5 h-4.5 rounded-sm border border-slate-200 dark:border-slate-800 transition-transform hover:scale-110 cursor-pointer"
                                        style={{ backgroundColor: color }}
                                        onClick={(e) => handleSelectColor(color, e)}
                                        onMouseDown={(e) => e.preventDefault()}
                                        title={color}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
 
                    {/* Custom Background Color Picker */}
                    <div ref={bgPickerRef} className="custom-color-picker-wrapper relative inline-flex items-center">
                        <button
                            type="button"
                            className="custom-color-btn"
                            onClick={handleApplyBgColor}
                            onMouseDown={(e) => e.preventDefault()}
                            title={`Tô màu nền (${lastBgColor === 'transparent' ? 'Không màu' : lastBgColor})`}
                            tabIndex={-1}
                        >
                            <span className="text-slate-800 dark:text-slate-200 text-xs font-bold font-sans leading-none relative flex flex-col items-center">
                                Aa
                                <span 
                                    className="w-5 h-[3px] rounded-sm mt-0.5" 
                                    style={{ backgroundColor: lastBgColor === 'transparent' ? '#cbd5e1' : lastBgColor }} 
                                />
                            </span>
                        </button>
                        <button
                            type="button"
                            className="custom-color-arrow"
                            onClick={(e) => {
                                e.preventDefault();
                                setBgOpen(!bgOpen);
                            }}
                            onMouseDown={(e) => e.preventDefault()}
                            title="Chọn màu nền"
                            tabIndex={-1}
                        >
                            <svg className="w-2 h-2 text-slate-500 dark:text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>
 
                        {bgOpen && (
                            <div className="absolute top-[32px] left-0 z-50 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg shadow-xl p-2 grid grid-cols-7 gap-1 min-w-[154px]">
                                {/* Option for no color / transparent */}
                                <button
                                    type="button"
                                    className="w-4.5 h-4.5 rounded-sm border border-slate-300 dark:border-slate-700 flex items-center justify-center hover:scale-110 cursor-pointer relative overflow-hidden bg-white"
                                    onClick={(e) => handleSelectBgColor('transparent', e)}
                                    onMouseDown={(e) => e.preventDefault()}
                                    title="Không màu (No Color)"
                                >
                                    <span className="absolute w-[140%] h-[1.5px] bg-red-500 rotate-45" />
                                </button>
                                {COLOR_PALETTE.filter(c => c !== '#ffffff').map((color) => (
                                    <button
                                        key={color}
                                        type="button"
                                        className="w-4.5 h-4.5 rounded-sm border border-slate-200 dark:border-slate-800 transition-transform hover:scale-110 cursor-pointer"
                                        style={{ backgroundColor: color }}
                                        onClick={(e) => handleSelectBgColor(color, e)}
                                        onMouseDown={(e) => e.preventDefault()}
                                        title={color}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                </span>
                <span className="ql-formats">
                    <button className="ql-script" value="sub" aria-label="Subscript" tabIndex={-1} />
                    <button className="ql-script" value="super" aria-label="Superscript" tabIndex={-1} />
                </span>
                <span className="ql-formats">
                    <button className="ql-list" value="ordered" aria-label="Ordered List" tabIndex={-1} />
                    <button className="ql-list" value="bullet" aria-label="Bullet List" tabIndex={-1} />
                    <button className="ql-indent" value="-1" aria-label="Decrease Indent" tabIndex={-1} />
                    <button className="ql-indent" value="+1" aria-label="Increase Indent" tabIndex={-1} />
                </span>
                <span className="ql-formats">
                    <select className="ql-align" id={`ql-align-${id}`} name={`ql-align-${id}`} aria-label="Align" tabIndex={-1} />
                    <button className="ql-direction" value="rtl" aria-label="Text Direction" tabIndex={-1} />
                </span>
                <span className="ql-formats">
                    <button className="ql-blockquote" aria-label="Blockquote" tabIndex={-1} />
                    <button className="ql-code-block" aria-label="Code Block" tabIndex={-1} />
                </span>
                <span className="ql-formats">
                    <button className="ql-link" aria-label="Insert Link" tabIndex={-1} />
                    <button
                        type="button"
                        className="image-custom-btn"
                        aria-label="Insert Image"
                        tabIndex={-1}
                        onClick={() => imageInputRef.current?.click()}
                    >
                        <svg viewBox="0 0 18 18">
                            <rect className="ql-stroke" height="10" width="12" x="3" y="4"></rect>
                            <circle className="ql-fill" cx="6" cy="8" r="1"></circle>
                            <polyline className="ql-stroke" points="5 12 9 8 11 10 13 8 15 10"></polyline>
                        </svg>
                    </button>
                    <button className="ql-video" aria-label="Insert Video" tabIndex={-1} />
                </span>
                <span className="ql-formats">
                    <button className="ql-clean" aria-label="Remove Formatting" tabIndex={-1} />
                </span>
            </div>

            <div className="relative rounded-b-xl overflow-hidden">
                {/* Hidden textarea for form label association and accessibility */}
                <textarea
                    id={id}
                    name={name}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className="sr-only"
                    tabIndex={-1}
                />
                <ReactQuill
                    ref={quillRef}
                    id={`${id}-quill`}
                    theme="snow"
                    value={value}
                    onChange={onChange}
                    onChangeSelection={(range: any) => {
                        if (range) {
                            lastRangeRef.current = range;
                        }
                    }}
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
                    
                    position: sticky;
                    top: 120px;
                    z-index: 30;
                    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.05);
                    transition: top 0.2s ease;
                }
                @media (min-width: 768px) {
                    .ql-toolbar.ql-snow {
                        top: 140px;
                    }
                }
                .dark .ql-toolbar.ql-snow {
                    background: #111827 !important;
                    border-bottom-color: #1e293b !important;
                    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.25), 0 2px 4px -1px rgba(0, 0, 0, 0.15);
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
                
                /* Custom Split Color Pickers styling */
                .custom-color-picker-wrapper {
                    height: 28px;
                    border: 1px solid #cbd5e1;
                    border-radius: 6px;
                    display: inline-flex;
                    align-items: center;
                    background: white;
                    transition: all 0.15s ease;
                    padding: 1px;
                }
                .dark .custom-color-picker-wrapper {
                    border-color: #334155;
                    background: #0f172a;
                }
                .custom-color-picker-wrapper:hover {
                    border-color: #94a3b8;
                    box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
                }
                .dark .custom-color-picker-wrapper:hover {
                    border-color: #475569;
                }
                
                .custom-color-btn, .custom-color-arrow {
                    background: transparent;
                    border: none;
                    cursor: pointer;
                    height: 24px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border-radius: 4px;
                    transition: all 0.15s ease;
                }
                .custom-color-btn {
                    padding: 0 6px !important;
                    min-width: 24px;
                }
                .custom-color-arrow {
                    padding: 0 3px !important;
                    width: 14px;
                    border-left: 1px solid #e2e8f0;
                }
                .dark .custom-color-arrow {
                    border-left-color: #1e293b;
                }
                .custom-color-btn:hover {
                    background: #f1f5f9;
                }
                .dark .custom-color-btn:hover {
                    background: #1e293b;
                }
                .custom-color-arrow:hover {
                    background: #f1f5f9;
                }
                .dark .custom-color-arrow:hover {
                    background: #1e293b;
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

