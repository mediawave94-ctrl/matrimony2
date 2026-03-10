import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Mail, Phone, MapPin, Facebook, Instagram, Twitter } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="bg-[#1a0000] text-white pt-20 pb-10 overflow-hidden relative">
            {/* Background Decoration */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full translate-x-1/3 -translate-y-1/3 blur-3xl" />

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
                    {/* Brand Section */}
                    <div className="col-span-1 lg:col-span-1">
                        <Link to="/" className="flex items-center gap-3 mb-8 group">
                            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-secondary shadow-lg">
                                <span className="text-xl">💍</span>
                            </div>
                            <span className="text-xl font-serif font-black tracking-tight">
                                Shisya <span className="text-secondary">Matrimony</span>
                            </span>
                        </Link>
                        <p className="text-rose-100/60 text-sm leading-relaxed mb-8 max-w-xs">
                            Find your perfect life partner mit Shisya Matrimony. We bridge traditions with modern matchmaking to help you find your destined soulmate.
                        </p>
                        <div className="flex items-center gap-4">
                            {[Facebook, Instagram, Twitter].map((Icon, i) => (
                                <a key={i} href="#" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-rose-100/60 hover:bg-primary hover:text-white transition-all duration-300">
                                    <Icon size={18} />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-lg font-bold mb-8 text-white">Company</h4>
                        <ul className="space-y-4">
                            {['About Us', 'Success Stories', 'Premium Plans', 'Contact Us'].map((item) => (
                                <li key={item}>
                                    <Link to="#" className="text-rose-100/60 hover:text-amber-400 text-sm transition-colors flex items-center gap-2 group">
                                        <div className="w-1 h-1 rounded-full bg-primary group-hover:bg-amber-400 transition-colors" />
                                        {item}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Support */}
                    <div>
                        <h4 className="text-lg font-bold mb-8 text-white">Support</h4>
                        <ul className="space-y-4">
                            {['Privacy Policy', 'Terms of Use', 'Safety Tips', 'FAQs'].map((item) => (
                                <li key={item}>
                                    <Link to="#" className="text-rose-100/60 hover:text-amber-400 text-sm transition-colors flex items-center gap-2 group">
                                        <div className="w-1 h-1 rounded-full bg-primary group-hover:bg-amber-400 transition-colors" />
                                        {item}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h4 className="text-lg font-bold mb-8 text-white">Get in Touch</h4>
                        <ul className="space-y-6">
                            <li className="flex items-start gap-4 text-rose-100/60 group">
                                <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-primary transition-colors">
                                    <Mail size={18} className="text-amber-400" />
                                </div>
                                <div className="text-sm">
                                    <p className="text-white font-bold">Email Us</p>
                                    <p>support@shisyamatrimony.com</p>
                                </div>
                            </li>
                            <li className="flex items-start gap-4 text-rose-100/60 group">
                                <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-primary transition-colors">
                                    <Phone size={18} className="text-amber-400" />
                                </div>
                                <div className="text-sm">
                                    <p className="text-white font-bold">Call Us</p>
                                    <p>+91 98765 43210</p>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="mt-20 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
                    <p className="text-rose-100/40 text-xs">
                        © {new Date().getFullYear()} Shisya Matrimony. Dedicated to your beautiful beginnings.
                    </p>
                    <div className="flex items-center gap-2 text-rose-100/40 text-xs">
                        Made with <Heart size={14} className="text-primary fill-primary animate-pulse" /> for the community
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
