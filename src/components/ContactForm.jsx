import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import firebaseService from '../services/firebaseService';

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const initialState = { name: '', email: '', phone: '', message: '' };

function ContactForm() {
  const [form, setForm] = useState(initialState);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState({ type: '', message: '' });
  const formRef = useRef(null);

  const validate = () => {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = 'Name is required';
    if (!form.email.trim()) newErrors.email = 'Email is required';
    else if (!emailRegex.test(form.email.trim())) newErrors.email = 'Enter a valid email';
    if (!form.message.trim()) newErrors.message = 'Message is required';
    if (form.phone && form.phone.trim().length < 8) newErrors.phone = 'Enter a valid phone';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    setStatus({ type: '', message: '' });
    try {
      await firebaseService.submitContactMessage({
        name: form.name,
        email: form.email,
        phone: form.phone,
        message: form.message
      });
      setStatus({ type: 'success', message: 'Thanks! Your message has been sent.' });
      setForm(initialState);
    } catch (err) {
      setStatus({ type: 'error', message: err.message || 'Failed to send message. Please try again.' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">Name</label>
          <input
            id="name"
            name="name"
            type="text"
            autoComplete="name"
            placeholder="Your full name"
            value={form.name}
            onChange={handleChange}
            className={`w-full rounded-lg bg-gray-800 border ${errors.name ? 'border-red-500' : 'border-gray-700'} text-white px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-600`}
          />
          <AnimatePresence>
            {errors.name && (
              <motion.p className="text-red-400 text-sm mt-1" initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }}>
                {errors.name}
              </motion.p>
            )}
          </AnimatePresence>
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            value={form.email}
            onChange={handleChange}
            className={`w-full rounded-lg bg-gray-800 border ${errors.email ? 'border-red-500' : 'border-gray-700'} text-white px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-600`}
          />
          <AnimatePresence>
            {errors.email && (
              <motion.p className="text-red-400 text-sm mt-1" initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }}>
                {errors.email}
              </motion.p>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-300 mb-1">Phone (optional)</label>
          <input
            id="phone"
            name="phone"
            type="tel"
            inputMode="tel"
            placeholder="+91 98765 43210"
            value={form.phone}
            onChange={handleChange}
            className={`w-full rounded-lg bg-gray-800 border ${errors.phone ? 'border-red-500' : 'border-gray-700'} text-white px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-600`}
          />
          <AnimatePresence>
            {errors.phone && (
              <motion.p className="text-red-400 text-sm mt-1" initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }}>
                {errors.phone}
              </motion.p>
            )}
          </AnimatePresence>
        </div>
        <div>
          <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-1">Message</label>
          <textarea
            id="message"
            name="message"
            rows={5}
            placeholder="How can we help you?"
            value={form.message}
            onChange={handleChange}
            className={`w-full rounded-lg bg-gray-800 border ${errors.message ? 'border-red-500' : 'border-gray-700'} text-white px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-600`}
          />
          <AnimatePresence>
            {errors.message && (
              <motion.p className="text-red-400 text-sm mt-1" initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }}>
                {errors.message}
              </motion.p>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <p className="text-xs text-gray-500">This site is protected by reCAPTCHA and the Google Privacy Policy and Terms of Service apply.</p>
        <motion.button
          type="submit"
          disabled={submitting}
          whileHover={{ scale: submitting ? 1 : 1.02 }}
          whileTap={{ scale: submitting ? 1 : 0.98 }}
          className={`inline-flex items-center justify-center px-6 py-3 rounded-lg font-semibold transition-colors duration-200 border-2 ${submitting ? 'bg-gray-700 border-gray-600 text-gray-300 cursor-not-allowed' : 'bg-red-600 border-red-600 text-white hover:bg-white hover:text-red-600'}`}
          style={{ backgroundColor: submitting ? undefined : '#a00000' }}
        >
          {submitting ? 'Sending…' : 'Send Message'}
        </motion.button>
      </div>

      <AnimatePresence>
        {status.type && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            className={`mt-4 p-3 rounded-lg border ${status.type === 'success' ? 'bg-green-900/40 border-green-700 text-green-200' : 'bg-red-900/40 border-red-700 text-red-200'}`}
          >
            {status.message}
          </motion.div>
        )}
      </AnimatePresence>
    </form>
  );
}

export default ContactForm;