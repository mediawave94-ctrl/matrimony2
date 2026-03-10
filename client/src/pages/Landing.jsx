import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  CheckCircle2,
  Users,
  Heart,
  ShieldCheck,
  Search,
  MessageCircle,
  Bell,
  Star,
  ChevronRight,
  MapPin,
  Calendar
} from 'lucide-react';
import Button from '../components/ui/Button';
import HeroBg from '../assets/bg.jpeg';
import SuccessStory1 from '../assets/success-story-1.png';
import Login from './Login';

const Landing = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.6 }
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#fdfaf6] font-sans selection:bg-rose-100 selection:text-rose-900 overflow-x-hidden">
      {/* ================= HERO SECTION ================= */}
      <section className="relative min-h-screen flex items-center pt-20">
        {/* Background Image & Overlays */}
        <div className="absolute inset-0 z-0">
          <img
            src={HeroBg}
            alt="Traditional Wedding Background"
            className="w-full h-full object-cover"
          />
          {/* Deep Maroon Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#5a0001]/95 via-[#5a0001]/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#5a0001]/40 via-transparent to-[#5a0001]/20" />
        </div>

        {/* Content Container */}
        <div className="relative z-10 w-full max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 items-center gap-12 lg:gap-8">
            {/* LEFT CONTENT */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={containerVariants}
              className="text-white"
            >
              <motion.div variants={itemVariants} className="flex flex-col gap-2 mb-6">
                <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-400/20 border border-amber-400/30 text-xs font-bold text-amber-200 backdrop-blur-md w-fit uppercase tracking-widest">
                  ✨ The most trusted Tamil matrimony service
                </span>
              </motion.div>

              <motion.h1
                variants={itemVariants}
                className="text-5xl md:text-7xl xl:text-8xl font-black leading-[0.9] mb-8 tracking-tighter"
              >
                Find Your <br />
                <span className="text-amber-400 drop-shadow-[0_2px_10px_rgba(251,191,36,0.3)]">
                  Soulmate
                </span><br />
                Today
              </motion.h1>

              <motion.p
                variants={itemVariants}
                className="text-lg md:text-xl text-rose-50/90 mb-10 leading-relaxed max-w-lg font-medium"
              >
                Discover meaningful connections rooted in tradition. Simple, secure, and successful matchmaking for your destined journey.
              </motion.p>

              <motion.div variants={itemVariants} className="flex flex-wrap items-center gap-10">
                <div className="flex flex-col">
                  <span className="text-3xl font-black text-white">10k+</span>
                  <span className="text-[10px] uppercase font-bold tracking-widest text-rose-200/70">Verified Profiles</span>
                </div>
                <div className="h-10 w-px bg-white/20 hidden sm:block" />
                <div className="flex flex-col">
                  <span className="text-3xl font-black text-white">98%</span>
                  <span className="text-[10px] uppercase font-bold tracking-widest text-rose-200/70">Match Rate</span>
                </div>
                <div className="h-10 w-px bg-white/20 hidden sm:block" />
                <div className="flex flex-col">
                  <span className="text-3xl font-black text-white">2k+</span>
                  <span className="text-[10px] uppercase font-bold tracking-widest text-rose-200/70">Success Stories</span>
                </div>
              </motion.div>
            </motion.div>

            {/* RIGHT LOGIN CARD */}
            <motion.div
              initial={{ x: 50, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="flex justify-center lg:justify-end"
            >
              <div className="w-full max-w-sm">
                <Login isCompact={true} />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ================= HOW IT WORKS ================= */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-sm font-black text-primary uppercase tracking-[0.3em] mb-4">The Journey</h2>
            <h3 className="text-4xl md:text-5xl font-serif font-bold text-gray-900">How Shisya Works</h3>
            <div className="w-24 h-1 bg-secondary mx-auto mt-6 rounded-full" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              {
                icon: <Users className="w-8 h-8" />,
                title: "Create Profile",
                desc: "Register and fill in your details to help us find the best matches for you."
              },
              {
                icon: <Search className="w-8 h-8" />,
                title: "Find Match",
                desc: "Our intelligent algorithm suggests profiles that match your values and lifestyle."
              },
              {
                icon: <MessageCircle className="w-8 h-8" />,
                title: "Connect",
                desc: "Send interest and start chatting with profiles that spark your interest."
              }
            ].map((step, idx) => (
              <motion.div
                key={idx}
                initial={{ y: 30, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.2 }}
                className="group p-8 rounded-[2.5rem] bg-gray-50 border border-gray-100 hover:border-secondary/30 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/5 text-center"
              >
                <div className="w-20 h-20 rounded-3xl bg-white shadow-lg flex items-center justify-center text-primary mx-auto mb-8 group-hover:scale-110 group-hover:bg-primary group-hover:text-white transition-all duration-500">
                  {step.icon}
                </div>
                <h4 className="text-2xl font-bold mb-4 text-gray-900">{step.title}</h4>
                <p className="text-gray-600 leading-relaxed">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= SUCCESS STORIES ================= */}
      <section className="py-24 bg-[#5a0001] text-white relative overflow-hidden">
        {/* Decorative Circles */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-400/5 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-amber-400/5 rounded-full translate-y-1/2 -translate-x-1/2" />

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 items-center gap-16">
            <motion.div
              initial={{ x: -30, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              viewport={{ once: true }}
            >
              <h2 className="text-amber-400 font-bold tracking-widest uppercase text-sm mb-4">Milestones of Love</h2>
              <h3 className="text-4xl md:text-5xl font-serif font-bold mb-8 leading-tight">Handpicked Success Stories</h3>
              <p className="text-rose-100/80 mb-10 text-lg leading-relaxed">
                Thousands of couples have found their soulmates on Shisya Matrimony. Read their journeys and get inspired to find yours.
              </p>

              <div className="space-y-6">
                <div className="flex gap-4 items-start bg-white/5 p-6 rounded-2xl border border-white/10">
                  <Star className="text-amber-400 fill-amber-400 shrink-0" />
                  <div>
                    <h5 className="font-bold text-xl mb-1">Anand & Priya</h5>
                    <p className="text-rose-100/60 text-sm">"We found each other through the compatibility score. It's been 2 years of pure bliss."</p>
                  </div>
                </div>
                <div className="flex gap-4 items-start bg-white/5 p-6 rounded-2xl border border-white/10">
                  <Star className="text-amber-400 fill-amber-400 shrink-0" />
                  <div>
                    <h5 className="font-bold text-xl mb-1">Karthik & Meera</h5>
                    <p className="text-rose-100/60 text-sm">"The platform's verification process gave my family huge confidence. Forever grateful."</p>
                  </div>
                </div>
              </div>

              <Link to="/register">
                <Button className="mt-12 bg-amber-400 hover:bg-amber-500 text-primary px-8 py-4 font-bold rounded-2xl">
                  Start Your Story
                </Button>
              </Link>
            </motion.div>

            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="aspect-[4/5] rounded-[3rem] overflow-hidden shadow-2xl border-8 border-white/10">
                <img src={SuccessStory1} alt="Success Story" className="w-full h-full object-cover" />
              </div>
              <div className="absolute -bottom-10 -left-10 bg-white p-8 rounded-[2rem] shadow-2xl text-gray-900 hidden md:block">
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex -space-x-4">
                    {[1, 2, 3, 4].map(i => (
                      <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-gray-200" />
                    ))}
                  </div>
                  <span className="font-bold text-sm text-gray-400">+500 Happy Couples</span>
                </div>
                <div className="text-2xl font-black text-primary">Join the Community</div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ================= FEATURES ================= */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
            <div>
              <h2 className="text-primary font-bold tracking-widest uppercase text-sm mb-4">Premium Features</h2>
              <h3 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 leading-tight">Crafted for Quality</h3>
            </div>
            <p className="text-gray-600 max-w-md">
              We provide the tools and security you need to find a partner who truly complements your soul.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: "Verified Profiles", desc: "100% manual screening and verification.", icon: <ShieldCheck className="w-6 h-6" /> },
              { title: "Privacy Control", desc: "Choose who sees your photos and details.", icon: <ShieldCheck className="w-6 h-6" /> },
              { title: "Daily Matches", desc: "Get curated profiles delivered to you daily.", icon: <CheckCircle2 className="w-6 h-6" /> },
              { title: "Priority Support", desc: "Our 24/7 support is here to help you anytime.", icon: <Users className="w-6 h-6" /> }
            ].map((feat, idx) => (
              <div key={idx} className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300">
                <div className="w-12 h-12 rounded-xl bg-primary/5 text-primary flex items-center justify-center mb-6">
                  {feat.icon}
                </div>
                <h4 className="text-xl font-bold mb-3">{feat.title}</h4>
                <p className="text-gray-500 text-sm leading-relaxed">{feat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= CTA ================= */}
      <section className="py-24">
        <div className="max-w-5xl mx-auto px-6">
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            className="bg-gradient-to-br from-primary to-[#800000] rounded-[3rem] p-12 md:p-20 text-center text-white relative overflow-hidden shadow-2xl shadow-primary/20"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="relative z-10">
              <h3 className="text-4xl md:text-6xl font-serif font-bold mb-8">Ready to Find Your Life Partner?</h3>
              <p className="text-rose-100/80 mb-12 text-lg md:text-xl max-w-2xl mx-auto font-medium">
                Join our premium community today and take the first step towards a beautiful future together.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                <Link to="/register">
                  <Button className="bg-amber-400 hover:bg-amber-500 text-primary px-12 py-5 text-xl font-bold rounded-2xl shadow-xl shadow-amber-400/20">
                    Register Free
                  </Button>
                </Link>
                <div className="flex items-center gap-2 text-rose-100 font-bold">
                  <CheckCircle2 className="w-5 h-5 text-amber-400" />
                  <span>100% Free to Join</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Landing;
