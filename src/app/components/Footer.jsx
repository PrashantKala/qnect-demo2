import Link from 'next/link';
import { FaFacebook, FaTwitter, FaInstagram } from 'react-icons/fa';

export function Footer() {
  return (
    <footer className="relative bg-gradient-to-b from-[#0A1E46] via-[#0A2768] to-[#0C3C8A] text-gray-300 pt-20 pb-10 overflow-hidden">
      
      {/* Animated glow gradient overlay */}
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_top_left,_#3BDAD7,_transparent_60%)] animate-pulse"></div>

      <div className="relative z-10 max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-12">

        {/* Quick Links */}
        <div>
          <h3 className="text-2xl font-bold text-white mb-4">Quick Links</h3>
          {/* <h3 className="text-2xl font-bold text-white mb-4 relative inline-block after:content-[''] after:block after:w-16 after:h-[3px] after:bg-gradient-to-r after:from-[#3BDAD7] after:to-[#26BCCA] after:mt-2"></h3> */}
          <ul className="space-y-3 text-lg">

            <li><Link href="/about" className="relative inline-block transition-all duration-300 hover:text-white
                    after:content-[''] after:absolute after:left-0 after:bottom-0 after:h-[2px]
                    after:w-0 after:bg-gradient-to-r after:from-[#3BDAD7] after:to-[#26BCCA]
                    hover:after:w-full after:transition-all after:duration-300">About Us</Link></li>
            <li><Link href="/faq" className="relative inline-block transition-all duration-300 hover:text-white
                    after:content-[''] after:absolute after:left-0 after:bottom-0 after:h-[2px]
                    after:w-0 after:bg-gradient-to-r after:from-[#3BDAD7] after:to-[#26BCCA]
                    hover:after:w-full after:transition-all after:duration-300">FAQ</Link></li>
            <li><Link href="/terms" className="relative inline-block transition-all duration-300 hover:text-white
                    after:content-[''] after:absolute after:left-0 after:bottom-0 after:h-[2px]
                    after:w-0 after:bg-gradient-to-r after:from-[#3BDAD7] after:to-[#26BCCA]
                    hover:after:w-full after:transition-all after:duration-300">Terms & Conditions</Link></li>
            <li><Link href="/privacy" className="relative inline-block transition-all duration-300 hover:text-white
                    after:content-[''] after:absolute after:left-0 after:bottom-0 after:h-[2px]
                    after:w-0 after:bg-gradient-to-r after:from-[#3BDAD7] after:to-[#26BCCA]
                    hover:after:w-full after:transition-all after:duration-300">Privacy Policy</Link></li>
            <li><Link href="/contact" className="relative inline-block transition-all duration-300 hover:text-white
                    after:content-[''] after:absolute after:left-0 after:bottom-0 after:h-[2px]
                    after:w-0 after:bg-gradient-to-r after:from-[#3BDAD7] after:to-[#26BCCA]
                    hover:after:w-full after:transition-all after:duration-300">Contact Us</Link></li>

          </ul>
        </div>

        {/* Refer a Friend */}
        <div>
          <h3 className="text-2xl font-bold text-white mb-4 relative inline-block after:content-[''] after:block after:w-16 after:h-[3px] after:bg-gradient-to-r after:from-[#3BDAD7] after:to-[#26BCCA] after:mt-2">
            Refer a Friend
          </h3>
          <p className="text-gray-400 mb-3">Love QNect? Share it with friends and earn rewards. Our referral program is coming soon!</p>
          <ul className="space-y-2 text-lg text-gray-300">
            <li>✓ Share your unique link</li>
            <li>✓ Your friend gets 10% off</li>
            <li>✓ You get ₹50 in credits</li>
            <li>✓ Unlimited rewards!</li>
          </ul>
        </div>

        {/* Connect With Us */}
        <div className="md:justify-self-center ">
          <h3 className="text-2xl font-bold text-white mb-4 relative inline-block after:content-[''] after:block after:w-16 after:h-[3px] after:bg-gradient-to-r after:from-[#3BDAD7] after:to-[#26BCCA] after:mt-2">
            Connect With Us
          </h3>
          <div className="flex space-x-6">
            {[
              { Icon: FaFacebook, link: 'https://facebook.com' },
              { Icon: FaInstagram, link: 'https://instagram.com' },
              { Icon: FaTwitter, link: 'https://twitter.com' },
            ].map(({ Icon, link }, i) => (
              <a
                key={i}
                href={link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-white transition-all duration-300 transform hover:scale-110 hover:drop-shadow-[0_0_8px_#3BDAD7]"
              >
                <Icon size={30} />
              </a>
            ))}
          </div>
          <p className="mt-6 text-gray-400 text-lg hover:text-white transition-colors">
            support@qnect.in
          </p>
        </div>
      </div>

      {/* Bottom Copyright Bar */}
      <div className="relative z-10 text-center text-gray-400 pt-8 mt-16 border-t border-gray-700/50 text-base">
        <p className="bg-gradient-to-r from-[#3BDAD7] to-[#26BCCA] bg-clip-text text-transparent font-semibold">
          &copy; 2025 QNect. All Rights Reserved. Made in Jaipur.
        </p>
      </div>
    </footer>
  );
}
