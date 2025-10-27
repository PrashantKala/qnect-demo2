import Link from 'next/link';
import { FaFacebook, FaTwitter, FaInstagram } from 'react-icons/fa';

export function Footer() {
  return (
    <footer className="bg-primary-blue py-16 text-gray-300">
      {/* This is the layout fix. 
        Instead of 'container', we use 'max-w-6xl' to prevent it from being too wide.
      */}
      <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-12">
        
        {/* Quick Links */}
        <div>
          <h3 className="text-2xl font-bold text-white mb-4">Quick Links</h3>
          <ul className="space-y-3 text-lg"> 
            <li><Link href="/about" className="hover:text-accent-cyan">About Us</Link></li>
            <li><Link href="/faq" className="hover:text-accent-cyan">FAQ</Link></li>
            <li><Link href="/terms" className="hover:text-accent-cyan">Terms & Conditions</Link></li>
            <li><Link href="/contact" className="hover:text-accent-cyan">Contact Us</Link></li>
          </ul>
        </div>
        
        {/* Refer a Friend (New Content) */}
        <div>
           <h3 className="text-2xl font-bold text-white mb-4">Refer a Friend</h3>
           <p className="text-gray-400 mb-3">Love QNect? Share it with friends and earn.</p>
           <ul className="space-y-2 text-lg text-gray-300">
             <li>✓ Share your unique link</li>
             <li>✓ Your friend gets 10% off</li>
             <li>✓ You get ₹50 in credits</li>
             {/* <li>✓ Unlimited rewards!</li> */}
           </ul>
        </div>

        {/* Connect With Us */}
        <div className="flex flex-col justify-center items-center"> {/* Changed from text-right */}
          <h3 className="text-2xl font-bold text-white mb-4">Connect With Us</h3>
          <div className="flex  space-x-6">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-accent-cyan">
              <FaFacebook size={30} />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-accent-cyan">
              <FaInstagram size={30} />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-accent-cyan">
              <FaTwitter size={30} />
            </a>
          </div>
          <p className="mt-6 text-gray-400 text-lg">support@qnect.in</p>
        </div>
      </div>
      <div className="text-center text-gray-500 pt-8 mt-12 border-t border-gray-700 text-base">
        &copy; 2025 QNect. All Rights Reserved. Made in Jaipur.
      </div>
    </footer>
  );
}