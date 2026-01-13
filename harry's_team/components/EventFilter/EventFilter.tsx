import React from 'react';
import { motion } from 'framer-motion';
import { fadeIn } from '@/lib/animations';
import Input from '@/components/Input/Input';

interface EventFilterProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  eventType: string;
  onEventTypeChange: (type: string) => void;
  dateRange: { start: string; end: string };
  onDateRangeChange: (range: { start: string; end: string }) => void;
}

const EventFilter: React.FC<EventFilterProps> = ({
  searchTerm,
  onSearchChange,
  eventType,
  onEventTypeChange,
  dateRange,
  onDateRangeChange
}) => {
  return (
    <motion.div 
      className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md mb-8"
      variants={fadeIn('up')}
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Search Input */}
        <div>
          <Input
            label="Search Events"
            placeholder="Find events by name..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
        
        {/* Event Type Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Event Type</label>
          <select
            value={eventType}
            onChange={(e) => onEventTypeChange(e.target.value)}
            className="w-full rounded-md border border-gray-300 bg-white py-2 px-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
          >
            <option value="">All Types</option>
            <option value="community">Community</option>
            <option value="corporate">Corporate</option>
            <option value="private">Private</option>
            <option value="fundraiser">Fundraiser</option>
          </select>
        </div>
        
        {/* Date Range Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Date Range</label>
          <div className="flex space-x-2">
            <input
              type="date"
              value={dateRange.start}
              onChange={(e) => onDateRangeChange({...dateRange, start: e.target.value})}
              className="w-full rounded-md border border-gray-300 bg-white py-2 px-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            />
            <span className="self-center">to</span>
            <input
              type="date"
              value={dateRange.end}
              onChange={(e) => onDateRangeChange({...dateRange, end: e.target.value})}
              className="w-full rounded-md border border-gray-300 bg-white py-2 px-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default EventFilter;