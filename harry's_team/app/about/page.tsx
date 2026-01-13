'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { fadeIn } from '@/lib/animations';
import TeamMemberCard from '@/components/TeamMemberCard/TeamMemberCard';
import ProgramCard from '@/components/ProgramCard/ProgramCard';
import HistoryTimeline from '@/components/HistoryTimeline/HistoryTimeline';
import { TeamMember, Program } from '@/types';
import { getAllTeamMembers } from '@/models/TeamMember';
import { getAllPrograms } from '@/models/Program';

const AboutPage = () => {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch team members
        const teamResult = await getAllTeamMembers();

        // Fetch programs
        const programsResult = await getAllPrograms();

        setTeamMembers(teamResult);
        setPrograms(programsResult);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Sample timeline data - in a real app, this would come from Sanity
  const timelineEvents = [
    {
      year: '2015',
      title: 'Foundation',
      description: 'PartyOrg was founded with the mission to bring communities together through memorable events.'
    },
    {
      year: '2017',
      title: 'First Major Event',
      description: 'Hosted our first large-scale community celebration with over 1,000 attendees.'
    },
    {
      year: '2019',
      title: 'Expansion',
      description: 'Expanded our services to include corporate events and private celebrations.'
    },
    {
      year: '2021',
      title: 'Digital Transformation',
      description: 'Launched our online platform to better serve our community during challenging times.'
    },
    {
      year: '2023',
      title: 'Award Winning',
      description: 'Received the Community Excellence Award for outstanding contribution to local events.'
    }
  ];

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
            About PartyOrg
          </motion.h1>
          <motion.p
            className="text-xl max-w-2xl mx-auto text-blue-100"
            initial="hidden"
            animate="show"
            variants={fadeIn()}
            transition={{ type: 'spring', bounce: 0, duration: 0.6, delay: 0.2 }}
          >
            Bringing communities together through memorable events and celebrations since 2015.
          </motion.p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4 md:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <motion.h2
              className="text-3xl font-bold text-gray-900 dark:text-white mb-6"
              initial="hidden"
              whileInView="show"
              variants={fadeIn()}
              transition={{ type: 'spring', bounce: 0, duration: 0.6, delay: 0 }}
              viewport={{ once: true, amount: 0.2 }}
            >
              Our Mission
            </motion.h2>
            <motion.p
              className="text-lg text-gray-600 dark:text-gray-300 mb-8"
              initial="hidden"
              whileInView="show"
              variants={fadeIn()}
              transition={{ type: 'spring', bounce: 0, duration: 0.6, delay: 0.1 }}
              viewport={{ once: true, amount: 0.2 }}
            >
              At PartyOrg, we believe that meaningful connections happen when people come together in celebration.
              Our mission is to create unforgettable experiences that strengthen communities, foster relationships,
              and provide spaces for joy, creativity, and shared memories.
            </motion.p>
            <motion.div
              className="bg-gray-200 border-2 border-dashed rounded-xl w-full h-64 flex items-center justify-center text-gray-500"
              initial="hidden"
              whileInView="show"
              variants={fadeIn()}
              transition={{ type: 'spring', bounce: 0, duration: 0.6, delay: 0.2 }}
              viewport={{ once: true, amount: 0.2 }}
            >
              Our Story Image
            </motion.div>
          </div>
        </div>
      </section>

      {/* Programs Section */}
      <section className="py-16 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-4 md:px-8">
          <motion.h2
            className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12"
            initial="hidden"
            whileInView="show"
            variants={fadeIn()}
            transition={{ type: 'spring', bounce: 0, duration: 0.6, delay: 0 }}
            viewport={{ once: true, amount: 0.2 }}
          >
            Our Programs
          </motion.h2>
          
          {programs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {programs.map((program, index) => (
                <ProgramCard key={program.id} program={program} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600 dark:text-gray-300">No programs available at the moment.</p>
            </div>
          )}
        </div>
      </section>

      {/* History Section */}
      <section className="py-16 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4 md:px-8">
          <motion.h2
            className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12"
            initial="hidden"
            whileInView="show"
            variants={fadeIn()}
            transition={{ type: 'spring', bounce: 0, duration: 0.6, delay: 0 }}
            viewport={{ once: true, amount: 0.2 }}
          >
            Our Journey
          </motion.h2>
          
          <div className="max-w-4xl mx-auto">
            <HistoryTimeline events={timelineEvents} />
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-4 md:px-8">
          <motion.h2
            className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12"
            initial="hidden"
            whileInView="show"
            variants={fadeIn()}
            transition={{ type: 'spring', bounce: 0, duration: 0.6, delay: 0 }}
            viewport={{ once: true, amount: 0.2 }}
          >
            Meet Our Team
          </motion.h2>
          
          {teamMembers.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {teamMembers.map((member, index) => (
                <TeamMemberCard key={member.id} member={member} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600 dark:text-gray-300">No team members available at the moment.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default AboutPage;