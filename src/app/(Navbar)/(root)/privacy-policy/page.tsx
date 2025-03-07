'use client';

import React from 'react';
import Link from 'next/link';
import { ChevronLeft, ShieldCheck } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Head from 'next/head';

const PrivacyPolicyPage = () => {
  const router = useRouter();
  const lastUpdated = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <>
      {/* SEO Metadata */}
      <Head>
        <title>Privacy Policy | Musimeter</title>
        <meta
          name="description"
          content="Learn how Musimetercollects, stores, and protects your Spotify listening data."
        />
        <meta name="keywords" content="Privacy Policy, Spotify, Data Protection, GDPR, CCPA, User Rights" />
        <meta name="author" content="MusimeterTeam" />
      </Head>

      <div className="min-h-screen nav-height bg-gradient-to-b from-black to-green-900 p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={() => (window.history.length > 1 ? router.back() : router.push('/'))}
            className="mb-8 text-gray-300 hover:text-white flex items-center gap-2 transition-colors"
            aria-label="Go back to the previous page"
          >
            <ChevronLeft size={18} />
            <span>Back</span>
          </button>

          <div className="bg-black bg-opacity-60 backdrop-blur-md rounded-xl shadow-2xl p-6 md:p-8 border border-green-500 border-opacity-20">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 bg-green-900 bg-opacity-50 rounded-full flex items-center justify-center">
                <ShieldCheck size={24} className="text-green-400" />
              </div>
              <h1 className="text-2xl md:text-3xl font-bold text-white">Privacy Policy</h1>
            </div>

            <div className="space-y-8 text-gray-300">
              <section>
                <h2 className="text-xl font-semibold text-green-400 mb-3">1. Introduction</h2>
                <p>
                  This Privacy Policy explains how Musimeter("we," "our," or "us") collects, uses, and protects your data when using our service.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-green-400 mb-3">2. What Data We Collect</h2>
                <p>
                  When you use our service, we may collect the following data from your Spotify account:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Listening history (recently played tracks, top artists, genres, etc.)</li>
                  <li>Playlists and saved tracks</li>
                  <li>Basic Spotify profile information (display name, user ID, country, etc.)</li>
                </ul>
                <p className="mt-3">
                  We **do not** collect sensitive information like passwords or payment details.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-green-400 mb-3">3. How We Use Your Data</h2>
                <p>Your Spotify data is used for the following purposes:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Generating visualizations and analytics of your listening history.</li>
                  <li>Personalizing your experience within our service.</li>
                  <li>Improving our platform based on user interactions.</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-green-400 mb-3">4. Data Storage & Security</h2>
                <p>
                  We store your Spotify data securely and use industry-standard security practices to protect your information.
                  However, no system is 100% secure, and we cannot guarantee absolute protection.
                </p>
                <p className="mt-3">
                  Your authentication tokens are managed securely via **Spotify’s OAuth 2.0 PKCE flow**, meaning we never store your login credentials.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-green-400 mb-3">5. Third-Party Sharing</h2>
                <p>
                  We **do not sell, trade, or share your personal data** with third-party services except:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>When required by law (e.g., government or law enforcement requests).</li>
                  <li>If necessary to operate and maintain our service (e.g., cloud hosting providers).</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-green-400 mb-3">6. Your Rights (GDPR & CCPA)</h2>
                <p>
                  Depending on your location, you have the right to:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Request a copy of the data we have about you.</li>
                  <li>Request data deletion from our system.</li>
                  <li>Withdraw consent for data processing at any time.</li>
                </ul>
                <p className="mt-3">
                  To make a request, contact us at <a href="mailto:support@spotifyhistoryviewer.com" className="text-green-400">support@spotifyhistoryviewer.com</a>.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-green-400 mb-3">7. Data Retention & Deletion</h2>
                <p>
                  Your Spotify data is stored only as long as necessary to provide our service.  
                  If you stop using our service or request deletion, we will remove your data within **30 days**.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-green-400 mb-3">8. Changes to this Policy</h2>
                <p>
                  We may update this Privacy Policy from time to time. If changes are significant, we will notify you via email or within our service.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-green-400 mb-3">9. Contact Us</h2>
                <p>
                  If you have any questions, reach out to us at 
                  <a href="mailto:support@spotifyhistoryviewer.com" className="text-green-400"> support@spotifyhistoryviewer.com</a>.
                </p>
              </section>
            </div>

            <div className="mt-10 pt-6 border-t border-gray-800 flex flex-col sm:flex-row justify-between items-center gap-4">
              <p className="text-gray-500 text-sm">Last updated: {lastUpdated}</p>
              <Link href="/terms-and-conditions" className="!text-green-400 hover:text-green-300 transition-colors text-sm font-medium">
                View Terms and Conditions
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PrivacyPolicyPage;
