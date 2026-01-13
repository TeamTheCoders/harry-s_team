import React, { TextareaHTMLAttributes } from 'react';

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
  className?: string;
}

const Textarea: React.FC<TextareaProps> = ({
  label,
  error,
  helperText,
  className = '',
  ...props
}) => {
  const textareaClasses = `flex min-h-20 w-full rounded-md border px-3 py-2 text-sm 
    resize-y placeholder:text-muted-foreground focus-visible:outline-none 
    focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 
    disabled:cursor-not-allowed disabled:opacity-50 ${error ? 'border-red-500' : 'border-input'}`;
  
  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
          {label}
        </label>
      )}
      <textarea
        className={`${textareaClasses} ${className}`}
        {...props}
      />
      {helperText && !error && (
        <p className="text-xs text-muted-foreground">{helperText}</p>
      )}
      {error && (
        <p className="text-xs font-medium text-destructive">{error}</p>
      )}
    </div>
  );
};

export default Textarea;