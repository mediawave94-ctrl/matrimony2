import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';
import HeroBg from '../assets/hero-bg.png';
import SuccessStory1 from '../assets/success-story-1.png';

const Landing = () => {
    return (
        <div className="flex flex-col min-h-screen">
            <main className="flex-grow">
                {/* Hero Section */}
                <section className="relative h-[600px] lg:h-[750px] flex items-center overflow-hidden">
                    {/* Background with Overlay */}
                    <div className="absolute inset-0 z-0">
                        <img
                            src={HeroBg}
                            alt="Happy Couple"
                            className="w-full h-full object-cover object-center"
                        />
                        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent"></div>
                    </div>

                    <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                        <div className="max-w-2xl text-white">
                            <span className="inline-block py-1 px-3 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-sm font-medium tracking-wide mb-6 text-secondary font-sans">
                                ✨ #1 Trusted Matrimony Platform
                            </span>
                            <h1 className="text-5xl md:text-7xl font-playfair font-bold leading-tight mb-6">
                                Find Your <br />
                                <span className="text-secondary italic">Perfect Soulmate</span>
                            </h1>
                            <p className="text-xl text-gray-200 mb-10 font-light leading-relaxed">
                                Join our exclusive community of verified profiles. <br className="hidden md:block" />
                                Designed for modern families who value tradition and trust.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4">
                                {localStorage.getItem('token') ? (
                                    <Link to="/dashboard">
                                        <Button className="w-full sm:w-auto h-14 px-8 text-lg bg-secondary hover:bg-secondary-hover text-white shadow-xl shadow-secondary/20 rounded-full transition-all hover:scale-105">
                                            Go to Dashboard
                                        </Button>
                                    </Link>
                                ) : (
                                    <>
                                        <Link to="/register">
                                            <Button className="w-full sm:w-auto h-14 px-8 text-lg bg-secondary hover:bg-secondary-hover text-white shadow-xl shadow-secondary/20 rounded-full transition-all hover:scale-105">
                                                Start for Free
                                            </Button>
                                        </Link>
                                    </>
                                )}
                            </div>
                            <div className="mt-12 flex items-center gap-4 text-sm text-gray-300">
                                <div className="flex -space-x-3">
                                    {[1, 2, 3, 4].map(i => (
                                        <div key={i} className="w-10 h-10 rounded-full border-2 border-primary bg-gray-600"></div>
                                    ))}
                                </div>
                                <p>Join 10,000+ happy members</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Trust Section */}
                <section className="py-24 bg-white">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl font-bold text-primary font-playfair">Why Choose Shisya Matrimony?</h2>
                            <div className="w-24 h-1 bg-secondary mx-auto mt-4 rounded-full"></div>
                        </div>

                        <div className="grid md:grid-cols-3 gap-8">
                            {[
                                {
                                    title: "100% Verified Profiles",
                                    desc: "Every profile is manually screened and Aadhar verified to ensure a safe and trustworthy environment for you.",
                                    icon: "🛡️"
                                },
                                {
                                    title: "Smart Compatibility",
                                    desc: "Our proprietary AI matching algorithm connects you with people who share your values and lifestyle.",
                                    icon: "🤖"
                                },
                                {
                                    title: "Privacy First",
                                    desc: "You have complete control over who sees your photos and contact information. Your privacy is our priority.",
                                    icon: "🔒"
                                }
                            ].map((feature, idx) => (
                                <div key={idx} className="group p-8 rounded-2xl bg-gray-50 hover:bg-white border border-gray-100 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
                                    <div className="w-16 h-16 bg-white rounded-2xl shadow-sm text-4xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                        {feature.icon}
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                                    <p className="text-gray-600 leading-relaxed">
                                        {feature.desc}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Carousel - Featured Profiles (Dummy Animation) */}
                <section className="py-20 bg-primary overflow-hidden">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-10 text-center text-white">
                        <h2 className="text-3xl font-bold font-playfair">Featured Profiles</h2>
                        <p className="text-gray-300 mt-2">Discover verified members from your community</p>
                    </div>

                    <div className="flex gap-6 animate-scroll whitespace-nowrap px-4 overflow-x-auto pb-4 hide-scrollbar">
                        {/* We repeat this block to simulate infinite scroll feel if we had CSS animation, for now horizontal scroll */}
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                            <div key={i} className="inline-block w-64 bg-white/10 backdrop-blur-lg rounded-xl overflow-hidden border border-white/10 hover:border-secondary/50 transition-colors flex-shrink-0">
                                <div className="h-64 bg-gray-800 relative">
                                    {/* Blurred Image Effect */}
                                    <div className="absolute inset-0 bg-gray-600 blur-sm opacity-50"></div>
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <span className="text-3xl opacity-30">📷</span>
                                    </div>
                                    <div className="absolute bottom-0 inset-x-0 p-4 bg-gradient-to-t from-black/80 to-transparent text-white">
                                        <p className="font-bold text-lg">Member #{1000 + i}</p>
                                        <p className="text-sm text-gray-300">2{i} yrs • Engineer</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Success Stories */}
                <section className="py-24 bg-accent">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex flex-col md:flex-row justify-between items-end mb-12">
                            <div>
                                <h2 className="text-3xl md:text-4xl font-bold text-primary font-playfair">Success Stories</h2>
                                <p className="text-gray-600 mt-2">Real couples, real love.</p>
                            </div>
                            <Button variant="outline" className="hidden md:block">View All Stories</Button>
                        </div>

                        <div className="grid md:grid-cols-2 gap-8">
                            {/* Story 1 */}
                            <div className="bg-white rounded-3xl overflow-hidden shadow-xl shadow-gray-200/50 flex flex-col md:flex-row h-full md:h-80 group hover:shadow-2xl transition-shadow">
                                <div className="md:w-1/2 overflow-hidden">
                                    <img
                                        src={SuccessStory1}
                                        alt="Success Story"
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                    />
                                </div>
                                <div className="p-8 md:w-1/2 flex flex-col justify-center">
                                    <div className="mb-4 text-secondary text-4xl font-serif">"</div>
                                    <p className="text-gray-600 italic mb-6">
                                        We found each other on Shisya Matrimony within a week. The compatibility scoring was spot on! We are now happily married for 2 years.
                                    </p>
                                    <div>
                                        <h4 className="font-bold text-primary text-lg">Rahul & Priya</h4>
                                        <p className="text-sm text-gray-500">Married Dec 2024</p>
                                    </div>
                                </div>
                            </div>

                            {/* Story 2 (Placeholder) */}
                            <div className="bg-white rounded-3xl overflow-hidden shadow-xl shadow-gray-200/50 flex flex-col md:flex-row h-full md:h-80 group hover:shadow-2xl transition-shadow">
                                <div className="md:w-1/2 overflow-hidden bg-gray-200 relative">
                                    <div className="absolute inset-0 bg-gray-300"></div>
                                </div>
                                <div className="p-8 md:w-1/2 flex flex-col justify-center">
                                    <div className="mb-4 text-secondary text-4xl font-serif">"</div>
                                    <p className="text-gray-600 italic mb-6">
                                        The most trusted platform for our community. The verification process gave us peace of mind. Highly recommended!
                                    </p>
                                    <div>
                                        <h4 className="font-bold text-primary text-lg">Amit & Sneha</h4>
                                        <p className="text-sm text-gray-500">Married Jan 2025</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Footer CTA */}
                <section className="py-20 bg-secondary relative overflow-hidden">
                    <div className="absolute top-0 right-0 -m-10 w-64 h-64 rounded-full bg-white/10"></div>
                    <div className="absolute bottom-0 left-0 -m-10 w-96 h-96 rounded-full bg-white/10"></div>

                    <div className="relative text-center max-w-3xl mx-auto px-4 z-10">
                        <h2 className="text-3xl md:text-5xl font-bold text-white font-playfair mb-6">Ready to find your soulmate?</h2>
                        <p className="text-white/90 text-lg mb-10">Join millions of happy couples who found love on Shisya Matrimony.</p>
                        <Link to="/register">
                            <Button className="bg-white text-secondary hover:bg-gray-100 px-10 py-4 h-auto text-lg rounded-full shadow-lg">
                                Create Free Profile
                            </Button>
                        </Link>
                    </div>
                </section>
            </main>
        </div>
    );
};

export default Landing;
