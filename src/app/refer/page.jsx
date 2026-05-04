import React from 'react';
import Link from 'next/link';

export const metadata = {
  title: 'Refer a Friend | QNect',
  description: 'Invite friends to explore QNect and earn exciting rewards for every successful referral.',
};

export default function ReferPage() {
  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12">
      {/* Hero Section */}
      <section className="bg-qnect-gradient text-white py-20 px-6 text-center">
        <div className="container mx-auto max-w-4xl">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">Refer a Friend. Get Rewarded.</h1>
          <p className="text-lg md:text-xl text-white/90 leading-relaxed max-w-2xl mx-auto">
            Know someone who owns a car? Invite them to explore QNect and earn exciting rewards for every successful referral.
          </p>
          <div className="mt-10">
            <Link
              href="/profile"
              className="inline-block px-10 py-4 bg-qnect-gradient text-white text-lg font-bold border-2 border-white rounded-lg shadow-md transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 hover:opacity-90"
            >
              Get Your Referral Link
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 px-6 container mx-auto max-w-5xl">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-primary-blue mb-12">How It Works</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {/* Step 1 */}
          <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100 text-center transform transition duration-300 hover:-translate-y-2 hover:shadow-xl">
            <div className="w-16 h-16 bg-[#3BDAD7]/20 text-[#1e40af] rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold">1</div>
            <h3 className="text-xl font-bold text-gray-800 mb-3">Share Your Link</h3>
            <p className="text-gray-600">Send your unique referral link to car owners and friends.</p>
          </div>

          {/* Step 2 */}
          <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100 text-center transform transition duration-300 hover:-translate-y-2 hover:shadow-xl">
            <div className="w-16 h-16 bg-[#3BDAD7]/20 text-[#1e40af] rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold">2</div>
            <h3 className="text-xl font-bold text-gray-800 mb-3">They Buy the Sticker</h3>
            <p className="text-gray-600">They purchase the QNect sticker using your referral link.</p>
          </div>

          {/* Step 3 */}
          <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100 text-center transform transition duration-300 hover:-translate-y-2 hover:shadow-xl">
            <div className="w-16 h-16 bg-[#3BDAD7]/20 text-[#1e40af] rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold">3</div>
            <h3 className="text-xl font-bold text-gray-800 mb-3">You Earn Rewards</h3>
            <p className="text-gray-600">Get rewarded instantly on every successful purchase they make.</p>
          </div>
        </div>
      </section>

      {/* Why You Should Refer Section */}
      <section className="py-16 px-6 bg-white border-t border-gray-200">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-primary-blue mb-10">Why You Should Refer</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="flex items-start p-6 bg-gray-50 rounded-lg">
              <span className="text-[#3BDAD7] text-2xl mr-4">✓</span>
              <div>
                <h4 className="font-bold text-gray-800 text-lg mb-1">Earn on every sticker sale</h4>
                <p className="text-gray-600">Get a guaranteed reward every time your link is used for a purchase.</p>
              </div>
            </div>
            <div className="flex items-start p-6 bg-gray-50 rounded-lg">
              <span className="text-[#3BDAD7] text-2xl mr-4">✓</span>
              <div>
                <h4 className="font-bold text-gray-800 text-lg mb-1">No limit on referrals</h4>
                <p className="text-gray-600">The more you share, the more you earn. There is no cap on your rewards.</p>
              </div>
            </div>
            <div className="flex items-start p-6 bg-gray-50 rounded-lg">
              <span className="text-[#3BDAD7] text-2xl mr-4">✓</span>
              <div>
                <h4 className="font-bold text-gray-800 text-lg mb-1">Simple sharing via WhatsApp</h4>
                <p className="text-gray-600">Share your link effortlessly with your contacts in just one tap.</p>
              </div>
            </div>
            <div className="flex items-start p-6 bg-gray-50 rounded-lg">
              <span className="text-[#3BDAD7] text-2xl mr-4">✓</span>
              <div>
                <h4 className="font-bold text-gray-800 text-lg mb-1">Scalable earning opportunity</h4>
                <p className="text-gray-600">Build a passive income stream simply by introducing others to QNect.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
