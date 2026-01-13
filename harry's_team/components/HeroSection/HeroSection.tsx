'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { fadeIn } from '@/lib/animations';
import Button from '@/components/Button/Button';
import Link from 'next/link';
import Image from 'next/image';
import { HeroImage } from '@/types';
import { getActiveHeroImages } from '@/models/HeroImage';

const HeroSection = () => {
  const [heroImages, setHeroImages] = useState<HeroImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchHeroImages = async () => {
      try {
        const result = await getActiveHeroImages();
        setHeroImages(result);
      } catch (err) {
        console.error('Error fetching hero images:', err);
        setError('Failed to load hero images');
      } finally {
        setLoading(false);
      }
    };

    fetchHeroImages();
  }, []);

  if (loading) {
    return (
      <div className="relative bg-gradient-to-r from-blue-600 to-indigo-700 text-white h-96 flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="relative bg-gradient-to-r from-blue-600 to-indigo-700 text-white h-96 flex items-center justify-center">
        <div className="text-xl text-red-300">{error}</div>
      </div>
    );
  }

  const hero = heroImages[0]; // Using the first active hero image

  if (!hero) {
    return (
      <div className="relative bg-gradient-to-r from-blue-600 to-indigo-700 text-white h-96 flex items-center justify-center">
        <div className="text-xl text-center">
          <p>No hero image available</p>
          <p className="text-sm mt-2">Add hero images in the database to display content here</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative text-white">
      {/* Background image or gradient */}
      {hero.imageUrl ? (
        <div className="relative h-[80vh] min-h-[500px]">
          <div className="absolute inset-0">
            <Image
              src={hero.imageUrl}
              alt={hero.title || "Hero section image"}
              fill
              style={{ objectFit: 'cover' }}
              quality={100}
              className="z-0"
            />
            <div className="absolute inset-0 bg-black bg-opacity-50 z-10"></div>
          </div>
        </div>
      ) : (
        <div className="relative h-[80vh] min-h-[500px] bg-gradient-to-r from-blue-600 to-indigo-700 z-0">
          <div className="absolute inset-0 bg-black bg-opacity-30"></div>
        </div>
      )}

      <div className="absolute inset-0 flex items-center">
        <div className="container mx-auto px-4 md:px-8 z-20">
          <div className="max-w-3xl">
            <motion.h1
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.2 }}
              variants={fadeIn('down')}
              transition={{ type: 'spring', bounce: 0, duration: 0.6, delay: 0 }}
              className="text-4xl md:text-6xl font-bold mb-6 leading-tight"
            >
              {hero.title || 'Creating Unforgettable Moments Together'}
            </motion.h1>

            <motion.p
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.2 }}
              variants={fadeIn('down')}
              transition={{ type: 'spring', bounce: 0, duration: 0.6, delay: 0.2 }}
              className="text-xl md:text-2xl mb-8 text-blue-100 max-w-2xl"
            >
              {hero.description || 'Join us for community events, celebrations, and gatherings that bring people together.'}
            </motion.p>

            <motion.div
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.2 }}
              className="flex flex-wrap gap-4"
              variants={fadeIn('down')}
              transition={{ type: 'spring', bounce: 0, duration: 0.6, delay: 0.4 }}
            >
              <Link href="/events">
                <Button variant="secondary" size="lg">
                  View Events
                </Button>
              </Link>
              <Link href="/contact">
                <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-blue-600">
                  Contact Us
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;