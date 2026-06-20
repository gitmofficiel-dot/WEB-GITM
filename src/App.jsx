import React, { useEffect, Suspense, lazy } from 'react';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import Navbar from './components/Navbar';
import ParticleBackground from './components/ParticleBackground';
import AIChatBot from './components/AIChatBot';

// Lazy loading all major components for better performance
const Home = lazy(() => import('./components/Home'));
const NewsPage = lazy(() => import('./components/NewsPage'));
const GalleryPage = lazy(() => import('./components/GalleryPage'));
const EventsPage = lazy(() => import('./components/EventsPage'));
const TechProjectsPage = lazy(() => import('./components/TechProjectsPage'));
const AIFeatures = lazy(() => import('./components/AIFeatures'));
const Academy = lazy(() => import('./components/Academy'));
const MemberProfiles = lazy(() => import('./components/MemberProfiles'));
const PublicProfile = lazy(() => import('./components/PublicProfile'));
const AuthForms = lazy(() => import('./components/AuthForms'));
const ForgotPassword = lazy(() => import('./components/ForgotPassword'));
const VerifyCertificate = lazy(() => import('./components/VerifyCertificate'));
const ProjectDetails = lazy(() => import('./components/ProjectDetails'));
const VirtualLab = lazy(() => import('./components/VirtualLab'));
const CollaborationBoard = lazy(() => import('./components/CollaborationBoard'));

// Dashboards
const PresidentDashboard = lazy(() => import('./components/dashboards/PresidentDashboard'));
const TeacherDashboard = lazy(() => import('./components/dashboards/TeacherDashboard'));
const MemberDashboard = lazy(() => import('./components/dashboards/MemberDashboard'));
const StudentDashboard = lazy(() => import('./components/dashboards/StudentDashboard'));
const PartnerDashboard = lazy(() => import('./components/dashboards/PartnerDashboard'));
const UniversityDashboard = lazy(() => import('./components/dashboards/UniversityDashboard'));
const ContentManagerDashboard = lazy(() => import('./components/dashboards/ContentManagerDashboard'));
const SupervisorDashboard = lazy(() => import('./components/dashboards/SupervisorDashboard'));

const LoadingFallback = () => (
  <div className="flex-1 flex items-center justify-center min-h-[60vh]">
    <div className="relative w-16 h-16">
      <div className="absolute inset-0 border-4 border-cyan-500/20 rounded-full"></div>
      <div className="absolute inset-0 border-4 border-cyan-500 rounded-full border-t-transparent animate-spin"></div>
    </div>
  </div>
);

const AppContent = () => {
  const { view, setView, activeDashboardRole } = useLanguage();

  const renderDashboard = () => {
    switch (activeDashboardRole) {
      case 'president': return <PresidentDashboard />;
      case 'teacher': return <TeacherDashboard />;
      case 'student': return <StudentDashboard />;
      case 'partner': return <PartnerDashboard />;
      case 'university': return <UniversityDashboard />;
      case 'content_manager': return <ContentManagerDashboard />;
      case 'supervisor': return <SupervisorDashboard />;
      case 'member': 
      default: return <MemberDashboard />;
    }
  };

  const renderView = () => {
    switch (view) {
      case 'home': return <Home setView={setView} />;
      case 'news': return <NewsPage />;
      case 'gallery': return <GalleryPage />;
      case 'events': return <EventsPage />;
      case 'projects': return <TechProjectsPage />;
      case 'ai-features': return <AIFeatures />;
      case 'academy': return <Academy />;
      case 'about': return <MemberProfiles />;
      case 'profile': return <PublicProfile />;
      case 'project-details': return <ProjectDetails />;
      case 'virtual-lab': return <VirtualLab />;
      case 'collab-board': return <CollaborationBoard />;
      case 'login': return <AuthForms initialMode="login" />;
      case 'register': return <AuthForms initialMode="register" />;
      case 'forgot-password': return <ForgotPassword />;
      case 'verify-certificate': return <VerifyCertificate />;
      case 'dashboard': return renderDashboard();
      default: return <Home setView={setView} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0B132B] text-slate-900 dark:text-white transition-colors duration-300 font-sans relative overflow-x-hidden flex flex-col">
      {/* Global Background Elements */}
      <div className="fixed inset-0 z-0 bg-grid-slate-200 dark:bg-grid-white/[0.02] bg-[size:30px_30px]" />
      <div className="fixed inset-0 z-0 bg-gradient-to-br from-transparent to-teal-50/50 dark:to-cyan-900/10 pointer-events-none" />
      
      {/* 3D Particle Background - Only shown on home page or behind transparent layers */}
      {view === 'home' && (
        <div className="fixed inset-0 z-0">
          <ParticleBackground />
        </div>
      )}

      {/* Main App Layout */}
      <div className="relative z-10 flex flex-col min-h-screen">
        <Navbar />
        
        {/* Main Content Area */}
        <main className="flex-1 mt-20 p-4 md:p-6 pb-24 max-w-7xl mx-auto w-full">
          <Suspense fallback={<LoadingFallback />}>
            {renderView()}
          </Suspense>
        </main>
      </div>

      {/* Global AI Assistant */}
      <AIChatBot />
    </div>
  );
};

function App() {
  return (
    <LanguageProvider>
      <AppContent />
    </LanguageProvider>
  );
}

export default App;
