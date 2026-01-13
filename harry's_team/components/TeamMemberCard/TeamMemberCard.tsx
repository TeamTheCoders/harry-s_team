import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { fadeIn } from '@/lib/animations';
import { TeamMember } from '@/types';

interface TeamMemberCardProps {
  member: TeamMember;
}

const TeamMemberCard: React.FC<TeamMemberCardProps> = ({ member }) => {
  return (
    <motion.div
      className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg"
      variants={fadeIn('up')}
      whileHover={{ y: -10 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    >
      <div className="p-6">
        <div className="flex justify-center mb-4">
          {member.imageUrl ? (
            <Image
              src={member.imageUrl}
              alt={member.name}
              width={120}
              height={120}
              className="rounded-full object-cover border-4 border-blue-100"
            />
          ) : (
            <div className="bg-gray-200 border-2 border-dashed rounded-full w-32 h-32 flex items-center justify-center text-gray-500">
              Photo
            </div>
          )}
        </div>
        <h3 className="text-xl font-bold text-center text-gray-900 dark:text-white mb-1">{member.name}</h3>
        <p className="text-center text-blue-600 dark:text-blue-400 mb-3">{member.role}</p>
        <p className="text-gray-600 dark:text-gray-300 text-center">{member.bio}</p>
      </div>
    </motion.div>
  );
};

export default TeamMemberCard;