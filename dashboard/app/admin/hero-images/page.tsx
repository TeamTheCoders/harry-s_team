'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { DataTable } from '@/components/ui/DataTable';
import { HeroImageForm } from '@/components/forms/HeroImageForm';
import { HeroImage } from '@/types/hero-image';
import { ColumnDef } from '@tanstack/react-table';

export default function HeroImagesPage() {
  const [heroImages, setHeroImages] = useState<HeroImage[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingHeroImage, setEditingHeroImage] = useState<HeroImage | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch hero images from API
  useEffect(() => {
    const fetchHeroImages = async () => {
      try {
        const response = await fetch('/api/hero-images');
        if (response.ok) {
          const data = await response.json();
          setHeroImages(data.data || []);
        } else {
          console.error('Failed to fetch hero images');
        }
      } catch (error) {
        console.error('Error fetching hero images:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchHeroImages();
  }, []);

  const handleAddHeroImage = () => {
    setEditingHeroImage(null);
    setShowForm(true);
  };

  const handleEditHeroImage = (heroImage: HeroImage) => {
    setEditingHeroImage(heroImage);
    setShowForm(true);
  };

  const handleDeleteHeroImage = async (id: string) => {
    if (!confirm('Are you sure you want to delete this hero image?')) {
      return;
    }

    try {
      const response = await fetch(`/api/hero-images/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setHeroImages(heroImages.filter(image => image.id !== id));
      } else {
        console.error('Failed to delete hero image');
      }
    } catch (error) {
      console.error('Error deleting hero image:', error);
    }
  };

  const handleSubmit = async (formData: FormData) => {
    try {
      let response;
      const id = formData.get('id') as string | null;

      if (id) {
        // Update existing hero image
        response = await fetch(`/api/hero-images/${id}`, {
          method: 'PUT',
          body: formData,
        });
      } else {
        // Create new hero image
        response = await fetch('/api/hero-images', {
          method: 'POST',
          body: formData,
        });
      }

      if (response.ok) {
        const result = await response.json();
        if (id) {
          // Update the existing item in the list
          setHeroImages(heroImages.map(img =>
            img.id === id ? result.data : img
          ));
        } else {
          // Add the new item to the list
          setHeroImages([...heroImages, result.data]);
        }
        setShowForm(false);
      } else {
        console.error('Failed to save hero image');
      }
    } catch (error) {
      console.error('Error saving hero image:', error);
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingHeroImage(null);
  };

  // Define columns for the data table
  const columns: ColumnDef<HeroImage>[] = [
    {
      accessorKey: 'title',
      header: 'Title',
    },
    {
      accessorKey: 'altText',
      header: 'Alt Text',
    },
    {
      accessorKey: 'position',
      header: 'Position',
    },
    {
      accessorKey: 'isActive',
      header: 'Active',
      cell: ({ row }) => (
        <span>{row.original.isActive ? 'Yes' : 'No'}</span>
      ),
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => (
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => handleEditHeroImage(row.original)}
          >
            Edit
          </Button>
          <Button 
            variant="destructive" 
            size="sm"
            onClick={() => handleDeleteHeroImage(row.original.id)}
          >
            Delete
          </Button>
        </div>
      ),
    },
  ];

  if (loading) {
    return <div className="p-6">Loading...</div>;
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Hero Images Management</h1>
        <Button onClick={handleAddHeroImage}>Add Hero Image</Button>
      </div>

      {showForm ? (
        <HeroImageForm
          initialData={editingHeroImage || undefined}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
        />
      ) : (
        <DataTable columns={columns} data={heroImages} />
      )}
    </div>
  );
}