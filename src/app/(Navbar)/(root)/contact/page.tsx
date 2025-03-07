'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft, Mail, MessageSquare, User, Send } from 'lucide-react';

const ContactPage = () => {
  const router = useRouter();
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    message: '',
    subject: 'General Inquiry'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<null | 'success' | 'error'>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormState({
      ...formState,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitStatus('success');
      
      // Reset form after successful submission
      setTimeout(() => {
        setFormState({
          name: '',
          email: '',
          message: '',
          subject: 'General Inquiry'
        });
        setSubmitStatus(null);
      }, 3000);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-green-900 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <button 
          onClick={() => router.back()} 
          className="mb-8 text-gray-300 hover:text-white flex items-center gap-2 transition-colors"
        >
          <ChevronLeft size={18} />
          <span>Back</span>
        </button>
        
        <div className="bg-black bg-opacity-60 backdrop-blur-md rounded-xl shadow-2xl border border-green-500 border-opacity-20 overflow-hidden">
          <div className="md:flex">
            {/* Left side - Contact Info */}
            <div className="bg-green-900 bg-opacity-40 p-6 md:p-8 md:w-1/3">
              <h1 className="text-2xl font-bold text-white mb-6">Get in Touch</h1>
              
              <div className="space-y-6 text-gray-200">
                <p>
                  Have questions about your listening data? Need help with your account? 
                  We're here to help!
                </p>
                
                <div>
                  <h2 className="text-green-400 text-lg font-medium mb-2">Contact Information</h2>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Mail size={16} className="text-green-400" />
                      <span>support@spotifyhistoryviewer.com</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h2 className="text-green-400 text-lg font-medium mb-2">Response Time</h2>
                  <p>We typically respond to all inquiries within 24-48 hours during business days.</p>
                </div>
                
                <div className="pt-6 mt-6 border-t border-green-800">
                  <h2 className="text-green-400 text-lg font-medium mb-2">Follow Us</h2>
                  <div className="flex gap-4">
                    <a href="#" className="w-10 h-10 rounded-full bg-green-800 bg-opacity-50 flex items-center justify-center hover:bg-green-700 transition-colors">
                      <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                      </svg>
                    </a>
                    <a href="#" className="w-10 h-10 rounded-full bg-green-800 bg-opacity-50 flex items-center justify-center hover:bg-green-700 transition-colors">
                      <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                      </svg>
                    </a>
                    <a href="#" className="w-10 h-10 rounded-full bg-green-800 bg-opacity-50 flex items-center justify-center hover:bg-green-700 transition-colors">
                      <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Right side - Contact Form */}
            <div className="p-6 md:p-8 md:w-2/3">
              <h2 className="text-xl font-bold text-white mb-6">Send a Message</h2>
              
              {submitStatus === 'success' ? (
                <div className="bg-green-900 bg-opacity-30 border border-green-500 border-opacity-30 rounded-lg p-6 text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-green-800 bg-opacity-50 text-green-400 text-3xl mb-4">
                    ✓
                  </div>
                  <h3 className="text-xl text-green-400 font-bold mb-2">Message Sent!</h3>
                  <p className="text-gray-300">
                    Thanks for reaching out. We'll get back to you as soon as possible.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label htmlFor="name" className="block text-green-400 mb-2 text-sm font-medium">Your Name</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <User size={16} className="text-gray-500" />
                      </div>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formState.name}
                        onChange={handleChange}
                        required
                        className="bg-gray-900 bg-opacity-70 border border-gray-800 text-white rounded-lg block w-full pl-10 p-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        placeholder="John Doe"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-green-400 mb-2 text-sm font-medium">Email Address</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Mail size={16} className="text-gray-500" />
                      </div>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formState.email}
                        onChange={handleChange}
                        required
                        className="bg-gray-900 bg-opacity-70 border border-gray-800 text-white rounded-lg block w-full pl-10 p-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        placeholder="your.email@example.com"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="subject" className="block text-green-400 mb-2 text-sm font-medium">Subject</label>
                    <select
                      id="subject"
                      name="subject"
                      value={formState.subject}
                      onChange={handleChange}
                      className="bg-gray-900 bg-opacity-70 border border-gray-800 text-white rounded-lg block w-full p-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    >
                      <option value="General Inquiry">General Inquiry</option>
                      <option value="Technical Support">Technical Support</option>
                      <option value="Account Issues">Account Issues</option>
                      <option value="Feedback">Feedback</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  
                  <div>
                    <label htmlFor="message" className="block text-green-400 mb-2 text-sm font-medium">Message</label>
                    <div className="relative">
                      <div className="absolute top-3 left-3 pointer-events-none">
                        <MessageSquare size={16} className="text-gray-500" />
                      </div>
                      <textarea
                        id="message"
                        name="message"
                        value={formState.message}
                        onChange={handleChange}
                        required
                        rows={5}
                        className="bg-gray-900 bg-opacity-70 border border-gray-800 text-white rounded-lg block w-full pl-10 p-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        placeholder="How can we help you today?"
                      ></textarea>
                    </div>
                  </div>
                  
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-black font-bold py-3 px-6 rounded-full transition-all duration-300 ${
                      isSubmitting ? 'opacity-70 cursor-not-allowed' : 'hover:shadow-lg hover:shadow-green-500/30'
                    }`}
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                        <span>Sending...</span>
                      </>
                    ) : (
                      <>
                        <Send size={18} />
                        <span>Send Message</span>
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;