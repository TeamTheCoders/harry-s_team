'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { ImageUpload } from '@/components/forms/ImageUpload';
import { HeroImage } from '@/types/hero-image';

interface HeroImageFormProps {
  initialData?: HeroImage;
  onSubmit: (data: FormData) => void;
  onCancel: () => void;
}

export const HeroImageForm = ({ initialData, onSubmit, onCancel }: HeroImageFormProps) => {
  const [title, setTitle] = useState(initialData?.title || '');
  const [altText, setAltText] = useState(initialData?.altText || '');
  const [caption, setCaption] = useState(initialData?.caption || '');
  const [position, setPosition] = useState(initialData?.position?.toString() || '0');
  const [isActive, setIsActive] = useState<boolean>(initialData?.isActive || true);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState(initialData?.imageUrl || '');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{type: 'success' | 'error', text: string} | null>(null);

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || '');
      setAltText(initialData.altText);
      setCaption(initialData.caption || '');
      setPosition(initialData.position.toString());
      setIsActive(Boolean(initialData.isActive));
      setImageUrl(initialData.imageUrl);
    }
  }, [initialData]);

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!altText.trim()) {
      newErrors.altText = 'Alt text is required for accessibility';
    }

    if (!imageFile && !initialData?.imageUrl) {
      newErrors.image = 'An image is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate() || isSubmitting) {
      return;
    }

    setIsSubmitting(true);
    setMessage(null);

    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('altText', altText);
      formData.append('caption', caption);
      formData.append('position', position);
      formData.append('isActive', isActive.toString());

      if (imageFile) {
        formData.append('image', imageFile);
      }

      // If editing, include the ID
      if (initialData?.id) {
        formData.append('id', initialData.id);
      }

      await onSubmit(formData);
      setMessage({type: 'success', text: initialData ? 'Hero image updated successfully!' : 'Hero image created successfully!'});
    } catch (error: any) {
      setMessage({type: 'error', text: error.message || 'An error occurred while saving the hero image.'});
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileSelect = (file: File) => {
    setImageFile(file);
    setImageUrl(URL.createObjectURL(file));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{initialData ? 'Edit Hero Image' : 'Add New Hero Image'}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
              Title (Optional)
              <span className="ml-1 relative group inline-block">
                <span className="text-gray-400">ⓘ</span>
                <span className="absolute left-1/2 transform -translate-x-1/2 bottom-full mb-2 hidden group-hover:block w-48 p-2 text-xs text-white bg-gray-800 rounded-md z-10">
                  A descriptive title for the image (optional)
                </span>
              </span>
            </label>
            <Input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Image title"
            />
          </div>

          <div className="relative">
            <label htmlFor="altText" className="block text-sm font-medium text-gray-700 mb-1">
              Alt Text *
              <span className="ml-1 relative group inline-block">
                <span className="text-gray-400">ⓘ</span>
                <span className="absolute left-1/2 transform -translate-x-1/2 bottom-full mb-2 hidden group-hover:block w-48 p-2 text-xs text-white bg-gray-800 rounded-md z-10">
                  Alternative text for accessibility (required)
                </span>
              </span>
            </label>
            <Input
              id="altText"
              type="text"
              value={altText}
              onChange={(e) => setAltText(e.target.value)}
              placeholder="Image description for accessibility"
              className={errors.altText ? 'border-red-500' : ''}
            />
            {errors.altText && <p className="mt-1 text-sm text-red-600">{errors.altText}</p>}
          </div>

          <div className="relative">
            <label htmlFor="caption" className="block text-sm font-medium text-gray-700 mb-1">
              Caption (Optional)
              <span className="ml-1 relative group inline-block">
                <span className="text-gray-400">ⓘ</span>
                <span className="absolute left-1/2 transform -translate-x-1/2 bottom-full mb-2 hidden group-hover:block w-48 p-2 text-xs text-white bg-gray-800 rounded-md z-10">
                  A short description that appears with the image (optional)
                </span>
              </span>
            </label>
            <Input
              id="caption"
              type="text"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="Image caption"
            />
          </div>

          <div className="relative">
            <label htmlFor="position" className="block text-sm font-medium text-gray-700 mb-1">
              Position
              <span className="ml-1 relative group inline-block">
                <span className="text-gray-400">ⓘ</span>
                <span className="absolute left-1/2 transform -translate-x-1/2 bottom-full mb-2 hidden group-hover:block w-48 p-2 text-xs text-white bg-gray-800 rounded-md z-10">
                  Order in which the image appears (lower numbers first)
                </span>
              </span>
            </label>
            <Input
              id="position"
              type="number"
              value={position}
              onChange={(e) => setPosition(e.target.value)}
              min="0"
              placeholder="Display order position"
            />
          </div>

          <div className="relative">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                className="rounded"
              />
              <span className="text-sm font-medium text-gray-700">Active</span>
              <span className="relative group inline-block">
                <span className="text-gray-400">ⓘ</span>
                <span className="absolute left-1/2 transform -translate-x-1/2 bottom-full mb-2 hidden group-hover:block w-48 p-2 text-xs text-white bg-gray-800 rounded-md z-10">
                  Whether the image is visible on the website
                </span>
              </span>
            </label>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Image *
            </label>
            <ImageUpload
              onFileSelect={handleFileSelect}
              className={errors.image ? 'border-red-500' : ''}
            />
            {errors.image && <p className="mt-1 text-sm text-red-600">{errors.image}</p>}
            {initialData?.imageUrl && !imageFile && (
              <div className="mt-2">
                <p className="text-sm text-gray-600">Current image:</p>
                <img
                  src={initialData.imageUrl}
                  alt={initialData.altText}
                  className="mt-1 max-h-32 object-contain"
                />
              </div>
            )}
          </div>

          {message && (
            <div className={`p-3 rounded-md mb-4 ${
              message.type === 'success'
                ? 'bg-green-100 text-green-700'
                : 'bg-red-100 text-red-700'
            }`}>
              {message.text}
            </div>
          )}

          <div className="flex space-x-2 pt-4">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : 'Save Hero Image'}
            </Button>
            <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};