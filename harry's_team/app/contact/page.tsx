'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { fadeIn, staggerContainer } from '@/lib/animations';
import ContactForm from '@/components/ContactForm/ContactForm';
import ContactInfo from '@/components/ContactInfo/ContactInfo';

const ContactPage = () => {
  const handleFormSubmitSuccess = () => {
    console.log('Form submitted successfully!');
    // Additional actions after successful form submission
  };

  const handleFormSubmitError = (error: string) => {
    console.error('Form submission error:', error);
    // Handle form submission error
  };

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
            Contact Us
          </motion.h1>
          <motion.p
            className="text-xl max-w-2xl mx-auto text-blue-100"
            initial="hidden"
            animate="show"
            variants={fadeIn()}
            transition={{ type: 'spring', bounce: 0, duration: 0.6, delay: 0.2 }}
          >
            Have questions about our events or want to plan your own? Reach out to our team.
          </motion.p>
        </div>
      </section>

      {/* Contact Content */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <motion.div
              initial="hidden"
              whileInView="show"
              variants={fadeIn('right')}
              transition={{ type: 'spring', bounce: 0, duration: 0.6, delay: 0 }}
              viewport={{ once: true, amount: 0.2 }}
            >
              <ContactForm
                onSubmitSuccess={handleFormSubmitSuccess}
                onSubmitError={handleFormSubmitError}
              />
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="show"
              variants={fadeIn('left')}
              transition={{ type: 'spring', bounce: 0, duration: 0.6, delay: 0 }}
              viewport={{ once: true, amount: 0.2 }}
            >
              <ContactInfo />
            </motion.div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-white dark:bg-gray-800">
        <div className="container mx-auto px-4 md:px-8">
          <motion.div
            initial="hidden"
            whileInView="show"
            variants={staggerContainer(0.1, 0.1)}
            viewport={{ once: true, amount: 0.2 }}
            className="max-w-4xl mx-auto"
          >
            <motion.h2
              className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12"
              variants={fadeIn()}
              transition={{ type: 'spring', bounce: 0, duration: 0.6, delay: 0 }}
            >
              Frequently Asked Questions
            </motion.h2>

            <div className="space-y-6">
              {[
                {
                  question: "How far in advance should I book an event?",
                  answer: "We recommend booking at least 2-3 months in advance for the best availability, especially for weekends and holidays."
                },
                {
                  question: "What areas do you serve?",
                  answer: "We serve the entire metropolitan area and surrounding counties. For events outside our standard service area, additional fees may apply."
                },
                {
                  question: "Can I customize my event package?",
                  answer: "Absolutely! We offer customizable packages to suit your specific needs and budget. Contact us to discuss your requirements."
                },
                {
                  question: "What safety measures do you have in place?",
                  answer: "We follow all local health guidelines and have comprehensive safety protocols for all our events. Our staff is trained in emergency procedures."
                }
              ].map((faq, index) => (
                <motion.div
                  key={index}
                  className="border border-gray-200 dark:border-gray-700 rounded-xl p-6"
                  variants={fadeIn('up')}
                  transition={{ type: 'spring', bounce: 0, duration: 0.6, delay: 0.1 * index }}
                >
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{faq.question}</h3>
                  <p className="text-gray-600 dark:text-gray-300">{faq.answer}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;