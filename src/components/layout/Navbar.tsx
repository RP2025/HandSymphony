import React from 'react';
import { Music, Camera, Settings, HelpCircle, Home, Volume2, VolumeX, Sparkles, Github } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { PageRoute } from '../../types';
import { AudioEngine } from '../../audio/audioEngine';

export const Navbar: React.FC = () => {
  const { currentRoute, setCurrentRoute, audioMetrics, updateAudioMetrics } = useAppStore();

  const handleMuteToggle = () => {
    const newMute = !audioMetrics.isMuted;
    AudioEngine.getInstance().setMute(newMute);
    updateAudioMetrics({ isMuted: newMute });
  };

  const navItems: { id: PageRoute; label: string; icon: React.ReactNode }[] = [
    { id: 'landing', label: 'Home', icon: <Home className="w-4 h-4" /> },
    { id: 'play', label: 'Play Music', icon: <Camera className="w-4 h-4" /> },
    { id: 'settings', label: 'Settings', icon: <Settings className="w-4 h-4" /> },
    { id: 'help', label: 'Guide & Help', icon: <HelpCircle className="w-4 h-4" /> },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-[#020205]/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Logo */}
        <button
          onClick={() => setCurrentRoute('landing')}
          className="flex items-center gap-2.5 text-left group focus:outline-none cursor-pointer"
        >
          <div className="w-8 h-8 bg-gradient-to-tr from-indigo-500 to-violet-500 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-500/30 group-hover:scale-105 transition-transform duration-200">
            <Music className="w-4 h-4 text-white group-hover:rotate-12 transition-transform duration-200" />
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-xl font-bold tracking-tight text-white group-hover:text-indigo-300 transition-colors">
              HAND SYMPHONY<span className="text-indigo-400">.</span>
            </span>
          </div>
        </button>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 text-xs font-medium text-slate-400 uppercase tracking-widest">
          {navItems.map((item) => {
            const isActive = currentRoute === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentRoute(item.id)}
                className={`flex items-center gap-2 pb-1 transition-all cursor-pointer ${
                  isActive
                    ? 'text-white border-b-2 border-indigo-500 font-semibold'
                    : 'hover:text-white border-b-2 border-transparent'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Right Action Bar */}
        <div className="flex items-center gap-3">
          {/* Audio Indicator */}
          {audioMetrics.isAudioStarted && (
            <button
              onClick={handleMuteToggle}
              title={audioMetrics.isMuted ? 'Unmute Audio' : 'Mute Audio'}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-medium transition-all ${
                audioMetrics.isMuted
                  ? 'bg-rose-500/10 border-rose-500/30 text-rose-400 hover:bg-rose-500/20'
                  : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20'
              }`}
            >
              {audioMetrics.isMuted ? (
                <>
                  <VolumeX className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Audio Muted</span>
                </>
              ) : (
                <>
                  <Volume2 className="w-3.5 h-3.5 animate-pulse" />
                  <span className="hidden sm:inline">
                    {audioMetrics.activeNote !== 'Muted' ? audioMetrics.activeNote : 'Live Synth'}
                  </span>
                </>
              )}
            </button>
          )}

          {/* Start CTA if on Landing */}
          {currentRoute === 'landing' && (
            <button
              onClick={() => setCurrentRoute('init')}
              className="flex items-center gap-2 px-5 py-2 rounded-full border border-slate-700 bg-slate-900/50 text-xs font-medium text-slate-200 hover:bg-slate-800 hover:text-white transition-all cursor-pointer shadow-sm hover:border-slate-600"
            >
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              <span>Launch App</span>
            </button>
          )}

          {/* GitHub link */}
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            title="View on GitHub"
            className="p-2 rounded-full text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
          >
            <Github className="w-4 h-4" />
          </a>
        </div>
      </div>
    </header>
  );
};
