import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useAppStore } from './store/useAppStore';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { LandingPage } from './pages/LandingPage';
import { InitializationPage } from './pages/InitializationPage';
import { MusicPage } from './pages/MusicPage';
import { SettingsPage } from './pages/SettingsPage';
import { HelpPage } from './pages/HelpPage';

export default function App() {
  const { currentRoute } = useAppStore();

  const renderPage = () => {
    switch (currentRoute) {
      case 'landing':
        return <LandingPage key="landing" />;
      case 'init':
        return <InitializationPage key="init" />;
      case 'play':
        return <MusicPage key="play" />;
      case 'settings':
        return <SettingsPage key="settings" />;
      case 'help':
        return <HelpPage key="help" />;
      default:
        return <LandingPage key="landing" />;
    }
  };

  return (
    <div className="min-h-screen bg-[#020205] text-slate-200 flex flex-col font-sans selection:bg-indigo-500/30 selection:text-indigo-200 relative overflow-hidden">
      {/* Ambient Background Glow Blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-indigo-600/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-violet-600/15 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-[20%] right-[10%] w-[300px] h-[300px] bg-blue-500/10 rounded-full blur-[100px] pointer-events-none" />

      <Navbar />

      <main className="flex-grow relative z-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentRoute}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
          >
            {renderPage()}
          </motion.div>
        </AnimatePresence>
      </main>

      {currentRoute !== 'init' && <Footer />}
    </div>
  );
}
