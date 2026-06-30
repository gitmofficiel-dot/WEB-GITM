import React from 'react';
import { motion } from 'framer-motion';
import Hero from './Hero';
import PartnersSlider from './PartnersSlider';
import AcademySlider from './AcademySlider';
import LatestNews from './LatestNews';
import TechExhibitions from './TechExhibitions';
import ActiveMembers from './ActiveMembers';
import AIFeatures from './AIFeatures';

const fadeIn = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
};

const Home = () => {
  return (
    <div className="flex flex-col w-full bg-slate-50 dark:bg-[#09090b] overflow-hidden">
      {/* 1. Full Width Hero */}
      <Hero />

      {/* 2. Partners (Floating Bar) */}
      <motion.div 
        initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeIn}
        className="relative z-20 -mt-10 mx-auto w-full max-w-7xl px-4"
      >
        <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl p-6">
          <PartnersSlider />
        </div>
      </motion.div>

      {/* 3. Bento Grid Section (News & Exhibitions) */}
      <div className="w-full max-w-7xl mx-auto px-4 py-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <motion.div 
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn}
            className="lg:col-span-7 bg-white dark:bg-slate-900/50 rounded-[3rem] border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xl"
          >
            <div className="scale-[0.85] origin-top h-[600px] overflow-hidden">
               <LatestNews />
            </div>
          </motion.div>

          <motion.div 
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn}
            className="lg:col-span-5 bg-gradient-to-br from-cyan-50 to-blue-50 dark:from-slate-900 dark:to-slate-800 rounded-[3rem] border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xl"
          >
            <div className="scale-[0.85] origin-top h-[600px] overflow-hidden">
               <TechExhibitions />
            </div>
          </motion.div>
        </div>
      </div>

      {/* 4. Full Width AI Features with Parallax-like feel */}
      <motion.div 
        initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn}
        className="w-full py-12"
      >
        <AIFeatures />
      </motion.div>

      {/* 5. Academy Showcase */}
      <motion.div 
        initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn}
        className="w-full max-w-7xl mx-auto px-4 py-12"
      >
        <div className="bg-white dark:bg-slate-900/30 rounded-[3rem] border border-slate-200 dark:border-slate-800 p-8 shadow-xl">
          <AcademySlider />
        </div>
      </motion.div>

      {/* 6. Active Members */}
      <motion.div 
        initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn}
        className="w-full py-24"
      >
        <ActiveMembers />
      </motion.div>
    </div>
  );
};

export default Home;
