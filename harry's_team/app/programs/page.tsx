'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { fadeIn } from '@/lib/animations';
import EventFilter from '@/components/EventFilter/EventFilter';
import EventList from '@/components/EventList/EventList';
import { Event } from '@/types';
import { getAllEvents } from '@/models/Event';

const ProgramsPage = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [eventType, setEventType] = useState('');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const result = await getAllEvents();
        setEvents(result);
        setFilteredEvents(result);
      } catch (err) {
        console.error('Error fetching events:', err);
        setError('Failed to load events');
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  // Apply filters whenever any filter changes
  useEffect(() => {
    let result = [...events];
    
    // Apply search filter
    if (searchTerm) {
      result = result.filter(event => 
        event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Apply event type filter (in a real app, events would have a type field)
    if (eventType) {
      // For demo purposes, we'll just filter based on title keywords
      result = result.filter(event => 
        event.title.toLowerCase().includes(eventType.toLowerCase())
      );
    }
    
    // Apply date range filter
    if (dateRange.start || dateRange.end) {
      result = result.filter(event => {
        if (!event.date) return true;
        
        const eventDate = new Date(event.date);
        const startDate = dateRange.start ? new Date(dateRange.start) : null;
        const endDate = dateRange.end ? new Date(dateRange.end) : null;
        
        if (startDate && eventDate < startDate) return false;
        if (endDate && eventDate > endDate) return false;
        
        return true;
      });
    }
    
    setFilteredEvents(result);
  }, [searchTerm, eventType, dateRange, events]);

  return (
    <div>
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <div className="container mx-auto px-4 md:px-8 text-center">
          <motion.h1
            className="text-4xl md:text-5xl font-bold mb-4"
            initial="hidden"
            animate="show"
            variants={fadeIn()}
            transition={{ type: 'spring', bounce: 0, duration: 0.6, delay: 0 }}
          >
            Our Programs
          </motion.h1>
          <motion.p
            className="text-xl max-w-2xl mx-auto text-blue-100"
            initial="hidden"
            animate="show"
            variants={fadeIn()}
            transition={{ type: 'spring', bounce: 0, duration: 0.6, delay: 0.2 }}
          >
            Discover our diverse range of community events and programs designed to bring people together.
          </motion.p>
        </div>
      </section>

      {/* Filter and Events Section */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4 md:px-8">
          <EventFilter 
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            eventType={eventType}
            onEventTypeChange={setEventType}
            dateRange={dateRange}
            onDateRangeChange={setDateRange}
          />
          
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              {filteredEvents.length} {filteredEvents.length === 1 ? 'Event' : 'Events'} Available
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Browse our upcoming and past events
            </p>
          </div>
          
          <EventList 
            events={filteredEvents} 
            loading={loading}
            error={error}
          />
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 bg-white dark:bg-gray-800">
        <div className="container mx-auto px-4 md:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <motion.h2
              className="text-3xl font-bold text-gray-900 dark:text-white mb-4"
              initial="hidden"
              whileInView="show"
              variants={fadeIn()}
              transition={{ type: 'spring', bounce: 0, duration: 0.6, delay: 0 }}
              viewport={{ once: true, amount: 0.2 }}
            >
              Stay Updated
            </motion.h2>
            <motion.p
              className="text-lg text-gray-600 dark:text-gray-300 mb-8"
              initial="hidden"
              whileInView="show"
              variants={fadeIn()}
              transition={{ type: 'spring', bounce: 0, duration: 0.6, delay: 0.1 }}
              viewport={{ once: true, amount: 0.2 }}
            >
              Subscribe to our newsletter to receive updates about upcoming events and programs.
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row gap-4 max-w-xl mx-auto"
              initial="hidden"
              whileInView="show"
              variants={fadeIn()}
              transition={{ type: 'spring', bounce: 0, duration: 0.6, delay: 0.2 }}
              viewport={{ once: true, amount: 0.2 }}
            >
              <input
                type="email"
                placeholder="Enter your email address"
                className="flex-grow px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors">
                Subscribe
              </button>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ProgramsPage;