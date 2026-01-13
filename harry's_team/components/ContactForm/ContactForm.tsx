'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { fadeIn } from '@/lib/animations';
import Input from '@/components/Input/Input';
import Textarea from '@/components/Textarea/Textarea';
import Button from '@/components/Button/Button';

// Define the validation schema using Zod
const contactSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters' }),
  email: z.string().email({ message: 'Please enter a valid email address' }),
  subject: z.string().min(5, { message: 'Subject must be at least 5 characters' }),
  message: z.string().min(10, { message: 'Message must be at least 10 characters' }),
});

type FormData = z.infer<typeof contactSchema>;

interface ContactFormProps {
  onSubmitSuccess?: () => void;
  onSubmitError?: (error: string) => void;
}

const ContactForm: React.FC<ContactFormProps> = ({ onSubmitSuccess, onSubmitError }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<FormData>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setSubmitSuccess(true);
        reset(); // Reset form after successful submission

        if (onSubmitSuccess) {
          onSubmitSuccess();
        }
      } else {
        if (onSubmitError) {
          onSubmitError(result.message || 'An error occurred while submitting the form. Please try again.');
        }
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      if (onSubmitError) {
        onSubmitError('An error occurred while submitting the form. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 md:p-8"
      variants={fadeIn('up')}
    >
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Send us a message</h2>
      
      {submitSuccess && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 p-4 bg-green-100 text-green-700 rounded-lg"
        >
          Thank you for your message! We'll get back to you soon.
        </motion.div>
      )}
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="Your Name"
            placeholder="John Doe"
            error={errors.name?.message}
            {...register('name')}
          />
          
          <Input
            label="Email Address"
            type="email"
            placeholder="john@example.com"
            error={errors.email?.message}
            {...register('email')}
          />
        </div>
        
        <Input
          label="Subject"
          placeholder="How can we help you?"
          error={errors.subject?.message}
          {...register('subject')}
        />
        
        <Textarea
          label="Your Message"
          placeholder="Tell us about your event or inquiry..."
          rows={5}
          error={errors.message?.message}
          {...register('message')}
        />
        
        <div className="pt-4">
          <Button 
            type="submit" 
            variant="primary" 
            size="lg" 
            className="w-full"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Sending...' : 'Send Message'}
          </Button>
        </div>
      </form>
    </motion.div>
  );
};

export default ContactForm;