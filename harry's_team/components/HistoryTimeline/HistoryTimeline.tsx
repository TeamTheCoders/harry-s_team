import React from 'react';
import { motion } from 'framer-motion';
import { fadeIn } from '@/lib/animations';

interface TimelineEvent {
  year: string;
  title: string;
  description: string;
}

interface HistoryTimelineProps {
  events: TimelineEvent[];
}

const HistoryTimeline: React.FC<HistoryTimelineProps> = ({ events }) => {
  return (
    <div className="relative">
      {/* Vertical line */}
      <div className="absolute left-4 top-0 h-full w-0.5 bg-blue-200 dark:bg-blue-800 transform -translate-x-1/2"></div>
      
      <div className="space-y-12 pl-10">
        {events.map((event, index) => (
          <motion.div
            key={index}
            className="relative"
            variants={fadeIn('up')}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
          >
            {/* Timeline dot */}
            <div className="absolute -left-10 top-2 w-8 h-8 rounded-full bg-blue-600 dark:bg-blue-500 flex items-center justify-center z-10">
              <div className="w-4 h-4 rounded-full bg-white dark:bg-gray-800"></div>
            </div>
            
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
              <div className="text-blue-600 dark:text-blue-400 font-bold text-lg mb-2">{event.year}</div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{event.title}</h3>
              <p className="text-gray-600 dark:text-gray-300">{event.description}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default HistoryTimeline;