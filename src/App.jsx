import React, { useEffect, Suspense, lazy } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import { useAuth } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import Navbar from './components/Navbar';
import ParticleBackground from './components/ParticleBackground';
import AIChatBot from './components/AIChatBot';
import Footer from './components/Footer';
import ToastContainer from './components/ui/ToastContainer';
import GlobalSearch from './components/ui/GlobalSearch';

// Lazy loading all major components for better performance
const Home = lazy(() => import('./components/Home'));
const NewsPage = lazy(() => import('./components/NewsPage'));
const NewsDetails = lazy(() => import('./components/NewsDetails'));
const GlobalNewsDetails = lazy(() => import('./components/GlobalNewsDetails'));
const GalleryPage = lazy(() => import('./components/GalleryPage'));
const EventsPage = lazy(() => import('./components/EventsPage'));
const EventDetails = lazy(() => import('./components/EventDetails'));
const TechProjectsPage = lazy(() => import('./components/TechProjectsPage'));
const Academy = lazy(() => import('./components/Academy'));
const ClassroomTheater = lazy(() => import('./components/academy/ClassroomTheater'));
const PublicProfile = lazy(() => import('./components/PublicProfile'));
const About = lazy(() => import('./components/About'));
const ProjectsHub = lazy(() => import('./components/ProjectsHub'));
const AuthForms = lazy(() => import('./components/AuthForms'));
const ForgotPassword = lazy(() => import('./components/ForgotPassword'));
const VerifyCertificate = lazy(() => import('./components/VerifyCertificate'));
const ProjectDetails = lazy(() => import('./components/ProjectDetails'));
const VirtualLab = lazy(() => import('./components/VirtualLab'));
const CollaborationBoard = lazy(() => import('./components/CollaborationBoard'));
const LibraryBookDetails = lazy(() => import('./components/LibraryBookDetails'));

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
  const { currentUser } = useAuth();
  const location = useLocation();
  
  const isTheaterMode = location.pathname.includes('/academy/course/');

  const renderDashboard = () => {
    if (!currentUser) return <Navigate to="/login" replace />;
    
    switch (currentUser.role) {
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

  const renderRoutes = () => {
    return (
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/news" element={<NewsPage />} />
        <Route path="/news/:id" element={<NewsDetails />} />
        <Route path="/news/global/article" element={<GlobalNewsDetails />} />
        <Route path="/gallery" element={<GalleryPage />} />
        <Route path="/events" element={<EventsPage />} />
        <Route path="/events/:id" element={<EventDetails />} />
        <Route path="/projects" element={<TechProjectsPage />} />
        <Route path="/academy" element={<Academy />} />
        <Route path="/academy/course/:id" element={<ClassroomTheater />} />
        <Route path="/about-us" element={<About />} />
        <Route path="/projects-hub" element={<ProjectsHub />} />
        <Route path="/profile/:id" element={<PublicProfile />} />
        <Route path="/project-details/:id" element={<ProjectDetails />} />
        <Route path="/virtual-lab" element={<VirtualLab />} />
        <Route path="/collab-board" element={<CollaborationBoard />} />
        <Route path="/login" element={<AuthForms initialMode="login" />} />
        <Route path="/register" element={<AuthForms initialMode="register" />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/verify-certificate" element={<VerifyCertificate />} />
        <Route path="/library/book" element={<LibraryBookDetails />} />
        <Route path="/dashboard/:hash" element={renderDashboard()} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    );
  };

  return (
    <div className="min-h-screen bg-cyan-50 dark:bg-[#0B132B] text-[#0B132B] dark:text-white transition-colors duration-300 font-sans relative overflow-x-hidden flex flex-col">
      {/* Global Background Elements */}
      <div className="fixed inset-0 z-0 bg-grid-slate-200 dark:bg-grid-white/[0.02] bg-[size:30px_30px]" />
      <div className="fixed inset-0 z-0 bg-gradient-to-br from-transparent to-teal-50/50 dark:to-cyan-900/10 pointer-events-none" />
      
      {/* 3D Particle Background - Only shown on home page or behind transparent layers */}
      {location.pathname === '/' && (
        <div className="fixed inset-0 z-0">
          <ParticleBackground />
        </div>
      )}

      {/* Main App Layout */}
      <div className="relative z-10 flex flex-col min-h-screen">
        {!isTheaterMode && <Navbar />}
        {!isTheaterMode && <GlobalSearch />}
        
        {/* Main Content Area */}
        <main className={`flex-1 ${isTheaterMode ? 'w-full h-screen overflow-hidden' : 'mt-20 p-4 md:p-6 pb-24 max-w-7xl mx-auto w-full'}`}>
          <Suspense fallback={<LoadingFallback />}>
            {renderRoutes()}
          </Suspense>
        </main>
        
        {!isTheaterMode && <Footer />}
      </div>

      {/* Global AI Assistant */}
      <AIChatBot />

      {/* Global Toast Notifications */}
      <ToastContainer />
    </div>
  );
};

function App() {
  return (
    <LanguageProvider>
      <NotificationProvider>
        <AppContent />
      </NotificationProvider>
    </LanguageProvider>
  );
}

export default App;
