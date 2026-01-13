import React, { useState } from 'react';
import { cn } from '@/lib/utils';

interface RichTextEditorProps {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  className?: string;
}

const RichTextEditor = ({
  value = '',
  onChange,
  placeholder = 'Type here...',
  className,
}: RichTextEditorProps) => {
  const [internalValue, setInternalValue] = useState(value);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    setInternalValue(newValue);
    if (onChange) {
      onChange(newValue);
    }
  };

  const handleBold = () => {
    document.execCommand('bold', false);
  };

  const handleItalic = () => {
    document.execCommand('italic', false);
  };

  const handleUnderline = () => {
    document.execCommand('underline', false);
  };

  const handleInsertUnorderedList = () => {
    document.execCommand('insertUnorderedList', false);
  };

  const handleInsertOrderedList = () => {
    document.execCommand('insertOrderedList', false);
  };

  return (
    <div className={cn('border rounded-md overflow-hidden', className)}>
      {/* Toolbar */}
      <div className="flex flex-wrap gap-1 p-2 border-b bg-gray-50">
        <button
          type="button"
          onClick={handleBold}
          className="p-2 rounded hover:bg-gray-200"
          title="Bold"
        >
          <strong>B</strong>
        </button>
        <button
          type="button"
          onClick={handleItalic}
          className="p-2 rounded hover:bg-gray-200"
          title="Italic"
        >
          <em>I</em>
        </button>
        <button
          type="button"
          onClick={handleUnderline}
          className="p-2 rounded hover:bg-gray-200"
          title="Underline"
        >
          <u>U</u>
        </button>
        <div className="border-r mx-1 h-6 self-center"></div>
        <button
          type="button"
          onClick={handleInsertUnorderedList}
          className="p-2 rounded hover:bg-gray-200"
          title="Bullet List"
        >
          <span>• List</span>
        </button>
        <button
          type="button"
          onClick={handleInsertOrderedList}
          className="p-2 rounded hover:bg-gray-200"
          title="Numbered List"
        >
          <span>1. List</span>
        </button>
      </div>
      
      {/* Editor Area */}
      <textarea
        value={internalValue}
        onChange={handleChange}
        placeholder={placeholder}
        className="w-full min-h-[200px] p-3 resize-none focus:outline-none"
      />
    </div>
  );
};

export { RichTextEditor };