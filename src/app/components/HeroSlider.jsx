// "use client";
// import { useState, useEffect } from 'react';
// import Image from 'next/image';

// // Add placeholder image paths here.
// // These images must be in your `public/` folder.
// const images = [
//   'https://placehold.co/1920x1080/0A2768/FFFFFF?text=QNect+Image+1',
//   'https://placehold.co/1920x1080/26BCCA/FFFFFF?text=QNect+Image+2',
//   'https://placehold.co/1920x1080/51D4D9/FFFFFF?text=QNect+Image+3',
// ];

// export const HeroSlider = () => {
//   const [currentIndex, setCurrentIndex] = useState(0);

//   useEffect(() => {
//     const interval = setInterval(() => {
//       setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
//     }, 4000); // Change image every 4 seconds
//     return () => clearInterval(interval);
//   }, []);

//   return (
//     <div className="absolute inset-0 z-0">
//       {images.map((src, index) => (
//         <Image
//           key={src}
//           src={src}
//           alt="QNect background image"
//           layout="fill"
//           objectFit="cover"
//           priority={index === 0} // Load the first image faster
//           className={`transition-opacity duration-1000 ease-in-out ${
//             index === currentIndex ? 'opacity-30' : 'opacity-0' // Darker opacity
//           }`}
//         />
//       ))}
//       {/* This dark overlay makes the white text readable */}
//       <div className="absolute inset-0 bg-black opacity-30"></div>
//     </div>
//   );
// };