'use client';

import React from 'react';
import { motion } from 'framer-motion';

// Fade in animation
export const fadeIn = (direction = 'up', delay = 0) => ({
  hidden: {
    y: direction === 'up' ? 40 : direction === 'down' ? -40 : 0,
    x: direction === 'left' ? -40 : direction === 'right' ? 40 : 0,
    opacity: 0,
  },
  show: {
    y: 0,
    x: 0,
    opacity: 1,
  },
});

// Stagger children animation
export const staggerContainer = (staggerChildren = 0.1, delayChildren = 0.1) => ({
  hidden: {},
  show: {},
});

// Slide in animation
export const slideIn = (direction = 'right', delay = 0, duration = 0.6) => ({
  hidden: {
    x: direction === 'left' ? '-100%' : direction === 'right' ? '100%' : 0,
    y: direction === 'up' ? '100%' : direction === 'down' ? '-100%' : 0,
  },
  show: {
    x: 0,
    y: 0,
  },
});

// Zoom in animation
export const zoomIn = (scale = 0, delay = 0) => ({
  hidden: {
    scale,
    opacity: 0,
  },
  show: {
    scale: 1,
    opacity: 1,
  },
});

export default motion;