'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { zoomIn, fadeIn } from '@/lib/animations';
import { Event } from '@/types';
import { formatDate } from '@/lib/utils';
import { Card, CardContent } from '@/components/Card/Card';
import Button from '@/components/Button/Button';

interface ActiveEventDisplayProps {
  event: Event;
}

const ActiveEventDisplay: React.FC<ActiveEventDisplayProps> = ({ event }) => {
  return (
    <section className="py-16 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 md:px-8">
        <motion.div
          initial="hidden"
          whileInView="show"
          variants={zoomIn(0.8, 0.1)}
          viewport={{ once: true, amount: 0.2 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
        >
          <motion.div variants={fadeIn('right')}>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              {event.title}
            </h1>
            <div className="flex items-center text-gray-600 dark:text-gray-300 mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span>{event.date ? formatDate(event.date) : 'Date TBD'}</span>
            </div>
            <div className="flex items-center text-gray-600 dark:text-gray-300 mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span>{event.location || 'Location TBD'}</span>
            </div>
            <p className="text-lg text-gray-700 dark:text-gray-300 mb-8">
              {event.description}
            </p>
            <div className="flex space-x-4">
              <Link href={`/events/${event.slug || event.id}`}>
                <Button variant="primary">Learn More</Button>
              </Link>
              <Link href="/contact">
                <Button variant="outline">Get Tickets</Button>
              </Link>
            </div>
          </motion.div>
          
          <motion.div 
            variants={fadeIn('left')}
            className="relative rounded-2xl overflow-hidden shadow-xl"
          >
            {event.imageUrl ? (
              <Image
                src={event.imageUrl}
                alt={event.title}
                width={600}
                height={400}
                className="w-full h-auto object-cover"
                priority
              />
            ) : (
              <div className="bg-gray-200 border-2 border-dashed rounded-2xl w-full h-96 flex items-center justify-center text-gray-500">
                Event Image
              </div>
            )}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default ActiveEventDisplay;