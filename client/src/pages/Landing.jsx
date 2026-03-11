import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';
import RegistrationHeroForm from '../components/RegistrationHeroForm';
import ManagerImg from '../assets/manager.png';
import HeroIllustration from '../assets/hero_illustration.png';

const Landing = () => {
  return (
    <div className="min-h-screen w-full bg-white font-sans selection:bg-brand-maroon/20">
      {/* ================= NAVBAR ================= */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-brand-maroon rounded-xl flex items-center justify-center text-white font-black text-2xl shadow-lg text-gold">B</div>
            <span className="text-2xl font-black tracking-tighter text-gray-900">Bondly<span className="text-brand-maroon">.</span></span>
          </div>

          <div className="flex items-center gap-6">
            <div className="hidden md:flex items-center gap-2 text-sm text-gray-600 font-medium">
              <span>Already a member?</span>
              <Link to="/login">
                <Button variant="outline" className="text-brand-maroon border-brand-maroon hover:bg-red-50 px-6 py-2 rounded-lg ml-2">
                  LOGIN
                </Button>
              </Link>
            </div>
            <div className="flex items-center gap-1 cursor-pointer group">
              <span className="text-gray-600 font-medium group-hover:text-brand-maroon transition-colors">Help</span>
              <svg className="w-4 h-4 text-gray-400 group-hover:text-brand-maroon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>
      </nav>

      {/* ================= HERO SECTION ================= */}
      <section className="pt-32 pb-20 bg-brand-light-gold relative overflow-hidden">
        {/* Decorative background circle */}
        <div className="absolute top-20 -left-20 w-[600px] h-[600px] bg-brand-maroon/5 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 lg:gap-20 items-center">

            {/* LEFT CONTENT */}
            <div className="mb-16 lg:mb-0">
              <h1 className="text-4xl md:text-5xl xl:text-6xl font-black text-gray-900 leading-[1.1] mb-8">
                The <span className="text-brand-maroon italic">biggest</span> and most <span className="text-brand-maroon underline decoration-brand-gold/30">trusted</span> matrimony service for you.
              </h1>

              <div className="relative w-full max-w-lg aspect-square mb-6 group">
                <div className="absolute inset-0 bg-brand-maroon/10 rounded-3xl -rotate-3 transition-transform group-hover:rotate-0 duration-500" />
                <img
                  src={HeroIllustration}
                  alt="Celebrating Matchmaking"
                  className="w-full h-full object-cover rounded-3xl shadow-xl relative z-10"
                />
                <div className="absolute -bottom-6 -right-6 bg-white p-6 rounded-2xl shadow-xl z-20 hidden md:block border border-gray-100">
                  <div className="flex flex-col items-center">
                    <span className="text-3xl font-black text-brand-maroon italic leading-none">Celebrating!</span>
                    <span className="text-lg font-bold text-gray-500 uppercase tracking-widest mt-1">Found Love Here</span>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT FORM */}
            <div className="flex justify-center lg:justify-end">
              <RegistrationHeroForm />
            </div>

          </div>
        </div>
      </section>

      {/* ================= TRUST BAR ================= */}
      <section className="bg-white py-12 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 items-center">
            <div className="flex items-center gap-5 justify-center md:justify-start">
              <div className="w-16 h-16 rounded-2xl bg-brand-maroon/10 flex items-center justify-center text-brand-maroon">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <div>
                <h4 className="text-2xl font-black text-gray-900">100%</h4>
                <p className="text-sm text-gray-500 font-medium">Mobile-verified profiles</p>
              </div>
            </div>
            <div className="flex items-center gap-5 justify-center">
              <div className="w-16 h-16 rounded-2xl bg-brand-maroon/10 flex items-center justify-center text-brand-maroon">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div>
                <h4 className="text-2xl font-black text-gray-900">4 Crore+</h4>
                <p className="text-sm text-gray-500 font-medium">Customers served</p>
              </div>
            </div>
            <div className="flex items-center gap-5 justify-center md:justify-end">
              <div className="w-16 h-16 rounded-2xl bg-brand-maroon/10 flex items-center justify-center text-brand-maroon">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h4 className="text-2xl font-black text-gray-900">15 Years+</h4>
                <p className="text-sm text-gray-500 font-medium">Successful matchmaking</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= ASSISTED SERVICE SECTION ================= */}
      <section className="py-24 bg-brand-light-gold relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col lg:flex-row items-center gap-16">

            <div className="flex-1 space-y-8">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-brand-maroon rounded-full flex items-center justify-center text-white font-bold text-xl text-gold">S</div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 leading-tight">Assisted Service</h3>
                  <p className="text-sm text-gray-500">Personalised matchmaking service</p>
                </div>
              </div>

              <h2 className="text-4xl md:text-5xl font-black text-gray-900 leading-[1.1]">
                Find your match <span className="text-brand-maroon italic">10x faster</span>
              </h2>
              <p className="text-lg text-gray-600 leading-relaxed max-w-xl">
                Personalised matchmaking service through expert Relationship Managers who understand your family values and preferences.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="p-6 bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center text-center group hover:shadow-md transition-shadow">
                  <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center text-brand-maroon mb-4 group-hover:scale-110 transition-transform">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  </div>
                  <span className="text-sm font-bold text-gray-800 leading-tight">Guaranteed matches</span>
                </div>
                <div className="p-6 bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center text-center group hover:shadow-md transition-shadow">
                  <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center text-brand-maroon mb-4 group-hover:scale-110 transition-transform">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                  </div>
                  <span className="text-sm font-bold text-gray-800 leading-tight">Better response</span>
                </div>
                <div className="p-6 bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center text-center group hover:shadow-md transition-shadow">
                  <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center text-brand-maroon mb-4 group-hover:scale-110 transition-transform">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <span className="text-sm font-bold text-gray-800 leading-tight">Save time & effort</span>
                </div>
              </div>

              <Button
                className="bg-brand-gold hover:bg-gold/90 text-white px-10 py-4 rounded-xl text-lg font-bold shadow-xl shadow-brand-gold/20 transition-all hover:scale-105"
              >
                Know More &rarr;
              </Button>
            </div>

            <div className="flex-1 relative">
              <div className="absolute inset-0 bg-brand-maroon/20 rounded-full blur-[100px] -z-10" />
              <img
                src={ManagerImg}
                alt="Relationship Manager"
                className="w-full max-w-md mx-auto relative z-10 drop-shadow-2xl"
              />
            </div>

          </div>
        </div>
      </section>
    </div>
  );
};

export default Landing;
