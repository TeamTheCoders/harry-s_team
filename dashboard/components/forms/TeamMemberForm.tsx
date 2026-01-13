'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { ImageUpload } from '@/components/forms/ImageUpload';
import { RichTextEditor } from '@/components/forms/RichTextEditor';
import { TeamMember } from '@/types/team-member';

interface TeamMemberFormProps {
  initialData?: TeamMember;
  onSubmit: (data: FormData) => void;
  onCancel: () => void;
}

export const TeamMemberForm = ({ initialData, onSubmit, onCancel }: TeamMemberFormProps) => {
  const [name, setName] = useState(initialData?.name || '');
  const [position, setPosition] = useState(initialData?.position || '');
  const [bio, setBio] = useState(initialData?.bio || '');
  const [email, setEmail] = useState(initialData?.email || '');
  const [phone, setPhone] = useState(initialData?.phone || '');
  const [twitter, setTwitter] = useState(initialData?.socialLinks?.twitter || '');
  const [linkedin, setLinkedin] = useState(initialData?.socialLinks?.linkedin || '');
  const [facebook, setFacebook] = useState(initialData?.socialLinks?.facebook || '');
  const [isActive, setIsActive] = useState<boolean>(initialData?.isActive || true);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [photoUrl, setPhotoUrl] = useState(initialData?.photoUrl || '');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{type: 'success' | 'error', text: string} | null>(null);

  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
      setPosition(initialData.position);
      setBio(initialData.bio);
      setEmail(initialData.email || '');
      setPhone(initialData.phone || '');
      setTwitter(initialData.socialLinks?.twitter || '');
      setLinkedin(initialData.socialLinks?.linkedin || '');
      setFacebook(initialData.socialLinks?.facebook || '');
      setIsActive(initialData.isActive);
      setPhotoUrl(initialData.photoUrl || '');
    }
  }, [initialData]);

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!position.trim()) {
      newErrors.position = 'Position is required';
    }

    if (!bio.trim()) {
      newErrors.bio = 'Biography is required';
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
      formData.append('name', name);
      formData.append('position', position);
      formData.append('bio', bio);
      formData.append('email', email);
      formData.append('phone', phone);
      formData.append('twitter', twitter);
      formData.append('linkedin', linkedin);
      formData.append('facebook', facebook);
      formData.append('isActive', isActive.toString());

      if (imageFile) {
        formData.append('photo', imageFile);
      }

      // If editing, include the ID
      if (initialData?.id) {
        formData.append('id', initialData.id);
      }

      await onSubmit(formData);
      setMessage({type: 'success', text: initialData ? 'Team member updated successfully!' : 'Team member created successfully!'});
    } catch (error: any) {
      setMessage({type: 'error', text: error.message || 'An error occurred while saving the team member.'});
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileSelect = (file: File) => {
    setImageFile(file);
    setPhotoUrl(URL.createObjectURL(file));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{initialData ? 'Edit Team Member' : 'Add New Team Member'}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Name *
                <span className="ml-1 relative group inline-block">
                  <span className="text-gray-400">ⓘ</span>
                  <span className="absolute left-1/2 transform -translate-x-1/2 bottom-full mb-2 hidden group-hover:block w-48 p-2 text-xs text-white bg-gray-800 rounded-md z-10">
                    Full name of the team member (required)
                  </span>
                </span>
              </label>
              <Input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Full name"
                className={errors.name ? 'border-red-500' : ''}
              />
              {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
            </div>

            <div className="relative">
              <label htmlFor="position" className="block text-sm font-medium text-gray-700 mb-1">
                Position *
                <span className="ml-1 relative group inline-block">
                  <span className="text-gray-400">ⓘ</span>
                  <span className="absolute left-1/2 transform -translate-x-1/2 bottom-full mb-2 hidden group-hover:block w-48 p-2 text-xs text-white bg-gray-800 rounded-md z-10">
                    Job title or position of the team member (required)
                  </span>
                </span>
              </label>
              <Input
                id="position"
                type="text"
                value={position}
                onChange={(e) => setPosition(e.target.value)}
                placeholder="Job title or position"
                className={errors.position ? 'border-red-500' : ''}
              />
              {errors.position && <p className="mt-1 text-sm text-red-600">{errors.position}</p>}
            </div>
          </div>

          <div className="relative">
            <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-1">
              Biography *
              <span className="ml-1 relative group inline-block">
                <span className="text-gray-400">ⓘ</span>
                <span className="absolute left-1/2 transform -translate-x-1/2 bottom-full mb-2 hidden group-hover:block w-48 p-2 text-xs text-white bg-gray-800 rounded-md z-10">
                  Detailed information about the team member (required)
                  </span>
              </span>
            </label>
            <RichTextEditor
              value={bio}
              onChange={setBio}
              placeholder="Tell us about this team member..."
              className={errors.bio ? 'border-red-500' : ''}
            />
            {errors.bio && <p className="mt-1 text-sm text-red-600">{errors.bio}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email
                <span className="ml-1 relative group inline-block">
                  <span className="text-gray-400">ⓘ</span>
                  <span className="absolute left-1/2 transform -translate-x-1/2 bottom-full mb-2 hidden group-hover:block w-48 p-2 text-xs text-white bg-gray-800 rounded-md z-10">
                    Contact email address for the team member
                  </span>
                </span>
              </label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email address"
              />
            </div>

            <div className="relative">
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                Phone
                <span className="ml-1 relative group inline-block">
                  <span className="text-gray-400">ⓘ</span>
                  <span className="absolute left-1/2 transform -translate-x-1/2 bottom-full mb-2 hidden group-hover:block w-48 p-2 text-xs text-white bg-gray-800 rounded-md z-10">
                    Contact phone number for the team member
                  </span>
                </span>
              </label>
              <Input
                id="phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Phone number"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <label htmlFor="twitter" className="block text-sm font-medium text-gray-700 mb-1">
                Twitter
                <span className="ml-1 relative group inline-block">
                  <span className="text-gray-400">ⓘ</span>
                  <span className="absolute left-1/2 transform -translate-x-1/2 bottom-full mb-2 hidden group-hover:block w-48 p-2 text-xs text-white bg-gray-800 rounded-md z-10">
                    Twitter handle (without @)
                  </span>
                </span>
              </label>
              <Input
                id="twitter"
                type="text"
                value={twitter}
                onChange={(e) => setTwitter(e.target.value)}
                placeholder="Twitter handle"
              />
            </div>

            <div className="relative">
              <label htmlFor="linkedin" className="block text-sm font-medium text-gray-700 mb-1">
                LinkedIn
                <span className="ml-1 relative group inline-block">
                  <span className="text-gray-400">ⓘ</span>
                  <span className="absolute left-1/2 transform -translate-x-1/2 bottom-full mb-2 hidden group-hover:block w-48 p-2 text-xs text-white bg-gray-800 rounded-md z-10">
                    LinkedIn profile URL or username
                  </span>
                </span>
              </label>
              <Input
                id="linkedin"
                type="text"
                value={linkedin}
                onChange={(e) => setLinkedin(e.target.value)}
                placeholder="LinkedIn profile"
              />
            </div>

            <div className="relative">
              <label htmlFor="facebook" className="block text-sm font-medium text-gray-700 mb-1">
                Facebook
                <span className="ml-1 relative group inline-block">
                  <span className="text-gray-400">ⓘ</span>
                  <span className="absolute left-1/2 transform -translate-x-1/2 bottom-full mb-2 hidden group-hover:block w-48 p-2 text-xs text-white bg-gray-800 rounded-md z-10">
                    Facebook profile URL or username
                  </span>
                </span>
              </label>
              <Input
                id="facebook"
                type="text"
                value={facebook}
                onChange={(e) => setFacebook(e.target.value)}
                placeholder="Facebook profile"
              />
            </div>
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
                  Whether the team member is visible on the website
                </span>
              </span>
            </label>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Photo
            </label>
            <ImageUpload 
              onFileSelect={handleFileSelect}
              accept="image/*"
              maxFileSize={2} // 2MB limit
            />
            {initialData?.photoUrl && !imageFile && (
              <div className="mt-2">
                <p className="text-sm text-gray-600">Current photo:</p>
                <img 
                  src={initialData.photoUrl} 
                  alt={initialData.name} 
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
              {isSubmitting ? 'Saving...' : 'Save Team Member'}
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