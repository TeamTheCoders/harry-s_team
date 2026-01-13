import React from 'react';
import { motion } from 'framer-motion';
import { staggerContainer } from '@/lib/animations';
import EventCard from '@/components/EventCard/EventCard';
import { Event } from '@/types';

interface EventListProps {
  events: Event[];
  loading?: boolean;
  error?: string | null;
}

const EventList: React.FC<EventListProps> = ({ events, loading, error }) => {
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-xl">Loading events...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-xl text-red-500">{error}</div>
      </div>
    );
  }

  if (!events || events.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-xl font-medium text-gray-900 dark:text-white">No events found</h3>
        <p className="mt-1 text-gray-500 dark:text-gray-400">
          Try adjusting your search or filter to find what you're looking for.
        </p>
      </div>
    );
  }

  return (
    <motion.div 
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
      variants={staggerContainer(0.1, 0.1)}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.1 }}
    >
      {events.map((event, index) => (
        <EventCard key={event.id} event={event} />
      ))}
    </motion.div>
  );
};

export default EventList;