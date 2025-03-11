'use client';

import React from 'react';
import Link from 'next/link';
import { ChevronLeft, FileText } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Head from 'next/head';

const TermsAndConditionsPage = () => {
  const router = useRouter();
    
  return (

    <>
        {/* SEO Metadata */}
        <Head>
        <title>Terms and Conditions | Spotify History Viewer</title>
        <meta
          name="description"
          content="Read the terms and conditions for using Spotify History Viewer, a service that helps you visualize and analyze your Spotify listening data."
        />
        <meta name="keywords" content="Spotify, listening history, terms, privacy policy, data usage" />
        <meta name="author" content="Musimeter Team" />
      </Head>
    
    <div className="min-h-screen nav-height  p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <button 
          onClick={() => router.back()} 
          className="mb-8 text-gray-300 hover:text-white-1 flex items-center gap-2 transition-colors"
        >
          <ChevronLeft size={18} />
          <span>Back</span>
        </button>
        
        <div className="bg-black bg-opacity-60 backdrop-blur-md rounded-xl shadow-2xl p-6 md:p-8 border border-green-500 border-opacity-20">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 bg-green-900 bg-opacity-50 rounded-full flex items-center justify-center">
              <FileText size={24} className="text-green-400" />
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-white-1">Terms and Conditions</h1>
          </div>
          
          <div className="space-y-8 text-gray-300">
            <section>
              <h2 className="text-xl font-semibold text-green-400 mb-3">1. Introduction</h2>
              <p className="mb-3">
                Welcome to Musimeter, your listening history visualization service. By accessing or using our website, you agree to be bound by these Terms and Conditions.
              </p>
              <p>
                These Terms and Conditions govern your use of our service, which allows you to visualize and analyze your Spotify listening history data. Please read these terms carefully before using our service.
              </p>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold text-green-400 mb-3">2. Spotify Data Usage</h2>
              <p className="mb-3">
                Our service connects to your Spotify account through the official Spotify API. We only access the data you explicitly grant us permission to view through the Spotify authorization process.
              </p>
              <p className="mb-3">
                We access your listening history, playlists, saved tracks, and basic profile information to provide our visualization services. We do not modify or delete any data on your Spotify account.
              </p>
              <p>
                Your Spotify credentials are never stored on our servers. We use the industry-standard OAuth 2.0 PKCE flow for authentication, which means we only receive temporary access tokens from Spotify.
              </p>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold text-green-400 mb-3">3. Data Privacy and Storage</h2>
              <p className="mb-3">
                We may store certain information from your Spotify account (such as listening history, favorite artists, and genres) to provide you with analytics and visualizations. This data is associated with a unique identifier and not your personal information.
              </p>
              <p className="mb-3">
                We implement reasonable security measures to protect your data, but we cannot guarantee absolute security. You can request deletion of all your data from our service at any time.
              </p>
              <p>
                For more information on how we handle your data, please refer to our Privacy Policy.
              </p>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold text-green-400 mb-3">4. User Restrictions</h2>
              <p className="mb-3">
                When using our service, you agree not to:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Attempt to access, scrape, or collect data from our service through automated means</li>
                <li>Use our service for any illegal purposes</li>
                <li>Share, distribute, or publicly display data obtained from our service without our explicit permission</li>
                <li>Attempt to reverse-engineer or decode our software</li>
                <li>Interfere with or disrupt the integrity or performance of our service</li>
              </ul>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold text-green-400 mb-3">5. Service Limitations</h2>
              <p className="mb-3">
                Our service is dependent on the Spotify API. We are not responsible for any limitations, restrictions, or changes implemented by Spotify that may affect our service.
              </p>
              <p>
                We strive to provide accurate visualizations and analytics, but we do not guarantee the accuracy, completeness, or reliability of any data displayed through our service.
              </p>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold text-green-400 mb-3">6. Intellectual Property</h2>
              <p className="mb-3">
                All content on our website, including but not limited to text, graphics, logos, icons, images, audio clips, digital downloads, and software, is the property of our company or our content suppliers and is protected by international copyright laws.
              </p>
              <p>
                The visualizations generated for you are for your personal use only. You may not reproduce, distribute, or use them for commercial purposes without our explicit permission.
              </p>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold text-green-400 mb-3">7. Termination</h2>
              <p>
                We reserve the right to terminate or suspend your access to our service immediately, without prior notice or liability, for any reason. Upon termination, your right to use the service will immediately cease.
              </p>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold text-green-400 mb-3">8. Changes to Terms</h2>
              <p>
                We reserve the right to modify or replace these Terms at any time. If a revision is material, we will try to provide at least 30 days&apos; notice prior to any new terms taking effect. What constitutes a material change will be determined at our sole discretion.
              </p>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold text-green-400 mb-3">9. Contact Us</h2>
              <p>
                If you have any questions about these Terms, please contact us at support@musimeter.com.
              </p>
            </section>
          </div>
          
          <div className="mt-10 pt-6 border-t border-gray-800 flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-gray-500 text-sm">Last updated: March 7, 2025</p>
            <Link 
              href="/privacy-policy" 
              className="!text-green-400 hover:text-green-300 transition-colors text-sm font-medium"
            >
              View Privacy Policy
            </Link>
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default TermsAndConditionsPage;