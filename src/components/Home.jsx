import React from 'react';
import Hero from './Hero';
import PartnersSlider from './PartnersSlider';
import AcademySlider from './AcademySlider';
import LatestNews from './LatestNews';
import TechExhibitions from './TechExhibitions';
import ActiveMembers from './ActiveMembers';
import AIFeatures from './AIFeatures';

const Home = () => {
  return (
    <div className="flex flex-col w-full">
      <Hero />
      <PartnersSlider />
      <AIFeatures />
      <AcademySlider />
      <LatestNews />
      <TechExhibitions />
      <ActiveMembers />
    </div>
  );
};

export default Home;
