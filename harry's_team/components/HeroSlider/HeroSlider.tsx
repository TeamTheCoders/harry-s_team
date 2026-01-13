'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { fadeIn } from '@/lib/animations';
import { Event } from '@/types';
import { formatDate } from '@/lib/utils';
import Button from '@/components/Button/Button';
import Link from 'next/link';

interface HeroSliderProps {
  events: Event[];
}

const HeroSlider: React.FC<HeroSliderProps> = ({ events }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Auto-advance slides
  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % events.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [events.length, isPaused]);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  const goToPrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + events.length) % events.length);
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % events.length);
  };

  if (!events || events.length === 0) {
    return (
      <div className="h-[70vh] flex items-center justify-center bg-gray-100">
        <p className="text-gray-600">No events available</p>
      </div>
    );
  }

  return (
    <div 
      className="relative h-[70vh] w-full overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {events.map((event, index) => (
        <motion.div
          key={event.id}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'
          }`}
          initial={index === currentIndex ? "show" : "hidden"}
          animate={index === currentIndex ? "show" : "hidden"}
          variants={{
            hidden: { opacity: 0 },
            show: { opacity: 1 }
          }}
        >
          {event.imageUrl ? (
            <Image
              src={event.imageUrl}
              alt={event.title}
              fill
              className="object-cover"
              priority={index === 0}
            />
          ) : (
            <div className="bg-gray-200 w-full h-full flex items-center justify-center">
              <span className="text-gray-500">Event Image</span>
            </div>
          )}
          
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/30"></div>
          
          <div className="absolute inset-0 flex items-center">
            <div className="container mx-auto px-4 md:px-8">
              <div className="max-w-2xl ml-0 md:ml-16 text-white">
                <motion.h2 
                  className="text-3xl md:text-5xl font-bold mb-4"
                  variants={fadeIn('right')}
                  initial="hidden"
                  animate="show"
                >
                  {event.title}
                </motion.h2>
                
                <div className="flex items-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span>{event.date ? formatDate(event.date) : 'Date TBD'}</span>
                </div>
                
                <p className="text-lg mb-6">
                  {event.description}
                </p>
                
                <div className="flex space-x-4">
                  <Link href={`/events/${event.slug || event.id}`}>
                    <Button variant="primary">Learn More</Button>
                  </Link>
                  <Link href="/contact">
                    <Button variant="outline">RSVP</Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      ))}

      {/* Navigation Arrows */}
      <button
        onClick={goToPrev}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 z-20 bg-black/30 hover:bg-black/50 text-white p-3 rounded-full transition-all"
        aria-label="Previous slide"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      
      <button
        onClick={goToNext}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 z-20 bg-black/30 hover:bg-black/50 text-white p-3 rounded-full transition-all"
        aria-label="Next slide"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Slide Indicators */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-20 flex space-x-2">
        {events.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-all ${
              index === currentIndex ? 'bg-white' : 'bg-white/50'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default HeroSlider;