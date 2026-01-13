import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { fadeIn } from '@/lib/animations';
import { Program } from '@/types';
import Link from 'next/link';

interface ProgramCardProps {
  program: Program;
}


const ProgramCard: React.FC<ProgramCardProps> = ({ program }) => {
  return (
    
    <motion.div
      className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg"
      variants={fadeIn('up')}
      whileHover={{ y: -10 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    >
      <div className="h-48 overflow-hidden">
        {program.imageUrl ? (
          <Image
            src={program.imageUrl}
            alt={program.title}
            width={400}
            height={300}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="bg-gray-200 border-2 border-dashed w-full h-full flex items-center justify-center text-gray-500">
            Program Image
          </div>
        )}
      </div>
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{program.title}</h3>
        <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">{program.description}</p>
        <Link
          href={`/programs/${program.slug || program.id}`}
          className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium inline-flex items-center"
        >
          Learn More
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>
    </motion.div>
  );
};

export default ProgramCard;