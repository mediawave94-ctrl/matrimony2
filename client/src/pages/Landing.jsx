import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';
import HeroBg from '../assets/bg.jpeg';
import SuccessStory1 from '../assets/success-story-1.png';
import Login from './Login';

const Landing = () => {
  return (
    <div className="min-h-screen w-full bg-[#fdfaf6] font-sans selection:bg-rose-100 selection:text-rose-900">
      {/* ================= HERO SECTION ================= */}
      <section className="relative min-h-[95vh] lg:min-h-screen flex items-center overflow-hidden">

        {/* Background Image & Overlays */}
        <div className="absolute inset-0 z-0">
          <img
            src={HeroBg}
            alt="Traditional Wedding Background"
            className="w-full h-full object-cover scale-105"
          />
          {/* Deep Maroon Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#5a0001]/95 via-[#5a0001]/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#5a0001]/40 via-transparent to-[#5a0001]/20" />
        </div>

        {/* Decorative SVG Elements (Mandala pattern style) */}
        <div className="absolute -top-24 -left-24 w-96 h-96 opacity-10 pointer-events-none">
          <svg viewBox="0 0 100 100" className="w-full h-full text-amber-400 rotate-12">
            <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="0.5" strokeDasharray="2 2" />
            <circle cx="50" cy="50" r="35" fill="none" stroke="currentColor" strokeWidth="0.2" />
          </svg>
        </div>

        {/* Content Container */}
        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 py-20 lg:py-0">
          <div className="grid grid-cols-1 lg:grid-cols-2 items-center gap-16 lg:gap-8">

            {/* ================= LEFT CONTENT ================= */}
            <div className="text-white">
              <div className="flex flex-col gap-2 mb-8">
                <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-400/10 border border-amber-400/20 text-xs font-black text-white-400 backdrop-blur-md w-fit uppercase tracking-widest">
                  ✨The largest and most trusted Tamil matrimony service
                </span>
              </div>

              <h1 className="text-5xl md:text-7xl xl:text-8xl font-black leading-[0.9] mb-8 tracking-tighter">
                Discover Your <br />
                <span className="text-amber-400 drop-shadow-[0_2px_10px_rgba(251,191,36,0.2)]">
                  Destined
                </span><br />
                Partner
              </h1>

              <p className="text-lg md:text-xl text-rose-50/80 mb-10 leading-relaxed max-w-lg font-medium">
                Merging traditional values with modern matchmaking. Find profiles verified by trust and guided by stars.
              </p>

              {/* <div className="flex flex-col sm:flex-row items-center gap-4">
                <Link to="/register" className="w-full sm:w-auto">
                  <Button className="w-full bg-amber-400 hover:bg-amber-500 text-[#5a0001] px-10 py-7 rounded-2xl text-xl font-black shadow-2xl shadow-amber-400/20 transition-all hover:-translate-y-1">
                    Begin Journey
                  </Button>
                </Link>
                <div className="hidden sm:flex items-center gap-3 px-6 py-4 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 group cursor-pointer hover:bg-white/10 transition-colors">
                  <div className="w-10 h-10 rounded-full bg-rose-900 flex items-center justify-center text-amber-400 font-bold group-hover:scale-110 transition-transform">
                    ▶
                  </div>
                  <span className="text-sm font-bold tracking-wide">Watch Stories</span>
                </div>
              </div> */}

              {/* Trust Indicators */}
              <div className="mt-16 pt-10 border-t border-white/10 flex flex-wrap items-center gap-10">
                <div className="flex flex-col gap-1">
                  <span className="text-2xl font-black text-white-400">10k+</span>
                  <span className="text-[10px] uppercase font-bold tracking-widest text-rose-100/50">Verified Profiles</span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-2xl font-black text-white-400">98%</span>
                  <span className="text-[10px] uppercase font-bold tracking-widest text-rose-100/50">Match Accuracy</span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-2xl font-black text-white-400">24/7</span>
                  <span className="text-[10px] uppercase font-bold tracking-widest text-rose-100/50">Family Support</span>
                </div>
              </div>
            </div>

            {/* ================= RIGHT LOGIN CARD ================= */}
            <div className="flex justify-center lg:justify-end perspective-1000">
              <div className="w-full max-w-sm bg-white rounded-[2.5rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] p-2 relative group transition-all duration-700 hover:rotate-1">
                {/* Decorative border or glow */}
                <div className="absolute inset-0 rounded-[2.5rem] bg-gradient-to-tr from-amber-400/20 to-rose-900/20 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

                <div className="bg-rose-900/5 rounded-[2rem] p-1">
                  {/* Pass a special class or handle within Login if needed, 
                       but here we just wrap it in a premium container */}
                  <Login isCompact={true} />
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
};

export default Landing;
