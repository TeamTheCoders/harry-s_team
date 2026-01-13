'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { fadeIn, staggerContainer } from '@/lib/animations';
import ActiveEventDisplay from '@/components/ActiveEventDisplay/ActiveEventDisplay';
import HeroSection from '@/components/HeroSection/HeroSection';
import { Event } from '@/types';
import { getActiveEvent } from '@/models/Event';

const HomePage = () => {
  const [activeEvent, setActiveEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchActiveEvent = async () => {
      try {
        const result = await getActiveEvent();
        setActiveEvent(result);
      } catch (err) {
        console.error('Error fetching active event:', err);
        setError('Failed to load active event');
      } finally {
        setLoading(false);
      }
    };

    fetchActiveEvent();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-2xl">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-2xl text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div>
      <HeroSection />
      {activeEvent && <ActiveEventDisplay event={activeEvent} />}

      {/* Featured Programs Section */}
      <section className="py-16 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4 md:px-8">
          <motion.div
            initial="hidden"
            whileInView="show"
            variants={staggerContainer(0.1)}
            className="text-center mb-12"
          >
            <motion.h2
              className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4"
              variants={fadeIn()}
              transition={{ type: 'spring', bounce: 0, duration: 0.6, delay: 0 }}
            >
              Featured Programs
            </motion.h2>
            <motion.p
              className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto"
              variants={fadeIn()}
              transition={{ type: 'spring', bounce: 0, duration: 0.6, delay: 0.1 }}
            >
              Explore our upcoming and popular programs designed to bring communities together.
            </motion.p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((item) => (
              <motion.div
                key={item}
                variants={fadeIn('up')}
                transition={{ type: 'spring', bounce: 0, duration: 0.6, delay: 0.1 * item }}
                whileHover={{ y: -10 }}
                className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6 shadow-md"
              >
                <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16 mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Program {item}</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Brief description of the featured program. This would come from the Sanity CMS.
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <div className="container mx-auto px-4 md:px-8 text-center">
          <motion.div
            initial="hidden"
            whileInView="show"
            variants={staggerContainer(0.1)}
          >
            <motion.h2
              className="text-3xl md:text-4xl font-bold mb-4"
              variants={fadeIn()}
              transition={{ type: 'spring', bounce: 0, duration: 0.6, delay: 0 }}
            >
              Ready to Join Our Community?
            </motion.h2>
            <motion.p
              className="text-xl mb-8 max-w-2xl mx-auto text-blue-100"
              variants={fadeIn()}
              transition={{ type: 'spring', bounce: 0, duration: 0.6, delay: 0.1 }}
            >
              Be part of unforgettable events and connect with like-minded individuals.
            </motion.p>
            <motion.div
              variants={fadeIn()}
              transition={{ type: 'spring', bounce: 0, duration: 0.6, delay: 0.2 }}
              className="flex justify-center gap-4"
            >
              <a
                href="/events"
                className="bg-white text-blue-600 hover:bg-blue-50 px-6 py-3 rounded-lg font-medium transition-colors"
              >
                Browse Events
              </a>
              <a
                href="/contact"
                className="bg-transparent border-2 border-white hover:bg-white/10 px-6 py-3 rounded-lg font-medium transition-colors"
              >
                Contact Us
              </a>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;