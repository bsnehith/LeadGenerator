import React, { useState } from 'react';
import './LeadForm.css';
import axios from 'axios';

const LeadForm = () => {
  const [formData, setFormData] = useState({ 
    name: '', 
    email: '', 
    company: '', 
    message: '' 
  });
  const [status, setStatus] = useState({ message: '', isError: false });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [touched, setTouched] = useState({});

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
  };

  const errors = {
    name: !formData.name.trim() ? 'Name is required' : '',
    email: !formData.email.trim()
      ? 'Email is required'
      : !validateEmail(formData.email)
      ? 'Please enter a valid email'
      : '',
  };

  const hasErrors = Object.values(errors).some(err => err);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setTouched({ name: true, email: true, company: true, message: true });

    if (hasErrors) {
      setStatus({ message: 'Please fix errors before submitting.', isError: true });
      return;
    }

    setIsSubmitting(true);
    setStatus({ message: '', isError: false });

    try {
      const response = await axios.post(
        'https://leadbackend-17py.onrender.com/submit',
        formData,
        {
          headers: { 'Content-Type': 'application/json' },
          timeout: 10000,
        }
      );

      setStatus({ message: response.data?.message || 'Form submitted successfully!', isError: false });
      setFormData({ name: '', email: '', company: '', message: '' });
      setTouched({});
    } catch (error) {
      let errorMessage = 'Submission failed. Please try again.';

      if (error.response) {
        if (error.response.data?.detail) errorMessage = error.response.data.detail;
        else if (error.response.status === 400) errorMessage = 'Invalid data submitted. Please check your inputs.';
        else if (error.response.status === 500) errorMessage = 'Server error. Please try again later.';
      } else if (error.message) {
        errorMessage = error.message;
      }

      setStatus({ message: errorMessage, isError: true });
      console.error('Submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="lead-form-container">
      <h2 className="lead-form-title">Contact Us</h2>
      <form onSubmit={handleSubmit} noValidate>
        {/* Name */}
        <div className="form-group">
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            onBlur={handleBlur}
            className={`form-input ${touched.name && errors.name ? 'error' : touched.name ? 'success' : ''}`}
            placeholder=" "
            disabled={isSubmitting}
            autoComplete="name"
          />
          <label htmlFor="name">Name*</label>
          {touched.name && errors.name && <div className="input-error">{errors.name}</div>}
        </div>

        {/* Email */}
        <div className="form-group">
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            onBlur={handleBlur}
            className={`form-input ${touched.email && errors.email ? 'error' : touched.email ? 'success' : ''}`}
            placeholder=" "
            disabled={isSubmitting}
            autoComplete="email"
          />
          <label htmlFor="email">Email*</label>
          {touched.email && errors.email && <div className="input-error">{errors.email}</div>}
        </div>

        {/* Company */}
        <div className="form-group">
          <input
            type="text"
            id="company"
            name="company"
            value={formData.company}
            onChange={handleChange}
            onBlur={handleBlur}
            className="form-input"
            placeholder=" "
            disabled={isSubmitting}
            autoComplete="organization"
          />
          <label htmlFor="company">Company</label>
        </div>

        {/* Message */}
        <div className="form-group">
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            onBlur={handleBlur}
            className="form-textarea"
            placeholder=" "
            disabled={isSubmitting}
            rows={4}
          />
          <label htmlFor="message">Message</label>
        </div>

        <button
          type="submit"
          className={`submit-button ${isSubmitting ? 'disabled loading' : ''}`}
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Submitting...' : 'Submit'}
        </button>

        {status.message && (
          <div className={`form-status ${status.isError ? 'error' : 'success'}`}>
            {status.message}
          </div>
        )}
      </form>
    </div>
  );
};

export default LeadForm;
