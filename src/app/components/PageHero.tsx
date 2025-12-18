//assignment requirements are commented! (plus other comments in general)

import { motion } from "motion/react";

interface PageHeroProps {
  title: string;
  imageSrc: string;
}
//this is the page image on header with gradient effect
export default function PageHero({ title, imageSrc }: PageHeroProps) {
  return (
    <div className="relative min-h-[60vh] flex items-center overflow-hidden">
      <img src={imageSrc} alt="students studying" className="absolute inset-0 w-full h-full object-cover"/>

      <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-red-900/60 to-black/70"></div>
      <div className="relative z-10 max-w-7xl mx-auto px-8 py-32">
        <motion.h1 
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="md:text-8xl text-white mb-4 leading-tight text-[64px]"
        >
          {title}
        </motion.h1>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: '200px' }}
          transition={{ duration: 1, delay: 0.5 }}
          className="h-1 bg-gradient-to-r from-yellow-500 to-yellow-500"
        />
      </div>
    </div>
  );
}