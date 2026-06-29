import React from 'react';
import Hero from './Hero';
import PartnersSlider from './PartnersSlider';
import AcademySlider from './AcademySlider';
import LatestNews from './LatestNews';
import TechExhibitions from './TechExhibitions';
import ActiveMembers from './ActiveMembers';

const Home = ({ setView }) => {
  return (
    <div className="flex flex-col w-full">
      <Hero setView={setView} />
      <PartnersSlider />
      <AcademySlider setView={setView} />
      <LatestNews setView={setView} />
      <TechExhibitions setView={setView} />
      <ActiveMembers setView={setView} />
    </div>
  );
};

export default Home;
