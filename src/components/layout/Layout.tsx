import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Footer } from './Footer';

export const Layout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 relative overflow-x-hidden selection:bg-sky-500 selection:text-white">
      {/* Ambient background glow effects */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-gradient-to-tr from-sky-600/15 via-indigo-600/15 to-purple-600/10 blur-[130px] rounded-full" />
        <div className="absolute top-[40%] -right-40 w-[450px] h-[450px] bg-indigo-600/10 blur-[140px] rounded-full" />
        <div className="absolute -bottom-40 -left-40 w-[450px] h-[450px] bg-sky-600/10 blur-[140px] rounded-full" />
      </div>

      {/* Main Navbar */}
      <Navbar />

      {/* Content Viewport */}
      <main className="flex-1 relative z-10">
        <Outlet />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};
