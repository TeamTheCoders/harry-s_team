import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { fadeIn } from '@/lib/animations';
import { Event } from '@/types';
import { formatDate } from '@/lib/utils';
import Link from 'next/link';

interface EventCardProps {
  event: Event;
}

const EventCard: React.FC<EventCardProps> = ({ event }) => {
  return (
    <motion.article
      className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300"
      variants={fadeIn('up')}
      whileHover={{ y: -5 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    >
      <div className="h-48 overflow-hidden">
        {event.imageUrl ? (
          <Image
            src={event.imageUrl}
            alt={event.title}
            width={400}
            height={300}
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
          />
        ) : (
          <div className="bg-gray-200 border-2 border-dashed w-full h-full flex items-center justify-center text-gray-500">
            Event Image
          </div>
        )}
      </div>
      <div className="p-6">
        <div className="flex items-center text-gray-500 dark:text-gray-400 text-sm mb-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span>{event.date ? formatDate(event.date) : 'Date TBD'}</span>
        </div>
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{event.title}</h3>
        <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">{event.description}</p>
        <div className="flex justify-between items-center">
          <Link
            href={`/events/${event.slug || event.id}`}
            className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium inline-flex items-center"
          >
            Read More
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
          <span className="text-sm text-gray-500 dark:text-gray-400">{event.location || 'Location TBD'}</span>
        </div>
      </div>
    </motion.article>
  );
};

export default EventCard;