import React, { useState, useRef, ChangeEvent } from 'react';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';

interface ImageUploadProps {
  onFileSelect?: (file: File) => void;
  className?: string;
  accept?: string;
  maxFileSize?: number; // in MB
}

const ImageUpload = ({
  onFileSelect,
  className,
  accept = 'image/*',
  maxFileSize = 5,
}: ImageUploadProps) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    setError(null);
    
    if (!e.target.files || e.target.files.length === 0) {
      return;
    }

    const file = e.target.files[0];
    
    // Validate file type
    if (!file.type.match('image.*')) {
      setError('Please select a valid image file');
      return;
    }

    // Validate file size (in MB)
    const fileSizeInMB = file.size / 1024 / 1024;
    if (fileSizeInMB > maxFileSize) {
      setError(`File size exceeds ${maxFileSize}MB limit`);
      return;
    }

    // Set file name
    setFileName(file.name);

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result as string);
    };
    reader.readAsDataURL(file);

    // Call callback
    if (onFileSelect) {
      onFileSelect(file);
    }
  };

  const triggerFileSelect = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const removeFile = () => {
    setPreviewUrl(null);
    setFileName(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className={cn('space-y-4', className)}>
      <div 
        className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-gray-400 transition-colors"
        onClick={triggerFileSelect}
      >
        {previewUrl ? (
          <div className="space-y-2">
            <img 
              src={previewUrl} 
              alt="Preview" 
              className="max-h-40 mx-auto rounded-md object-contain"
            />
            <p className="text-sm text-gray-600">{fileName}</p>
            <Button type="button" variant="destructive" size="sm" onClick={(e) => {
              e.stopPropagation();
              removeFile();
            }}>
              Remove
            </Button>
          </div>
        ) : (
          <div className="space-y-2">
            <div className="mx-auto h-12 w-12 text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
            </div>
            <p className="text-sm text-gray-600">Click to upload an image</p>
            <p className="text-xs text-gray-500">Supports JPG, PNG, WEBP up to {maxFileSize}MB</p>
          </div>
        )}
        
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept={accept}
          className="hidden"
        />
      </div>
      
      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
    </div>
  );
};

export { ImageUpload };