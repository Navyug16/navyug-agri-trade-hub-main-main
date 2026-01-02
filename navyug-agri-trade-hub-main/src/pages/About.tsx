import React, { useEffect } from 'react';
import { ArrowLeft, Users, Target, Award, ShieldCheck, HeartHandshake, Leaf, Sprout, Globe, Clock, FileCheck, Tractor } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Link, useNavigate } from 'react-router-dom';
import Footer from "@/components/Footer";
import Header from "@/components/Header";

const About = () => {
    const navigate = useNavigate();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="min-h-screen bg-white">
            <Header />

            {/* Hero Section for About Page */}
            <section className="bg-amber-50 py-16 md:py-24">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">About Our Company</h1>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                        Roots deeply planted in quality, trust, and tradition. We are dedicated to bringing the finest Indian agricultural produce to the world.
                    </p>
                </div>
            </section>

            {/* Main Content Sections */}
            <div className="container mx-auto px-4 py-16 space-y-20">

                {/* Who We Are */}
                {/* Who We Are & Our Natural Commitment */}
                <section className="grid md:grid-cols-2 gap-12 items-center">
                    <div>
                        <div className="flex items-center gap-3 mb-4 text-amber-600">
                            <Leaf className="h-6 w-6" />
                            <span className="font-semibold tracking-wide uppercase text-sm">Our Story</span>
                        </div>
                        <h2 className="text-3xl font-bold text-gray-900 mb-2">Who We Are</h2>
                        <h3 className="text-lg text-amber-600 font-medium mb-6">Bridging Rural Excellence with Global Markets Since 2003.</h3>

                        <p className="text-gray-600 leading-relaxed mb-6">
                            Navyug Enterprise was established with a singular, powerful vision: to bridge the gap between the hardworking farmers of India and the vast opportunities of the global marketplace. Founded by Mr. Hareshbhai Galani and Mr. Manojbhai Galani, our journey began over two decades ago in the heart of Gujarat's agricultural landscape.
                        </p>
                        <p className="text-gray-600 leading-relaxed mb-8">
                            Today, we operate as a premier commission agent specializing in high-quality agricultural food products. We don't just trade; we build relationships based on the traditional rural values of honesty and transparency.
                        </p>

                        <div className="bg-amber-50 p-6 rounded-xl border border-amber-100">
                            <h4 className="text-xl font-bold text-gray-900 mb-3">Our Natural Commitment</h4>
                            <p className="text-gray-700 leading-relaxed">
                                We take immense pride in dealing exclusively in natural, farm-grown produce. We maintain a strict focus on sourcing products where fertilizers and chemicals are minimized, ensuring that the food we bring to the market is as close to nature as possible.
                            </p>
                        </div>
                    </div>
                    <div className="rounded-2xl overflow-hidden shadow-xl aspect-video md:aspect-square relative group">
                        <img
                            src="https://images.unsplash.com/photo-1595113316349-9fa4eb24f884?q=80&w=2672&auto=format&fit=crop"
                            alt="Who We Are"
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors"></div>
                    </div>
                </section>

                {/* Who We Serve */}
                <section className="grid md:grid-cols-2 gap-12 items-start md:flex-row-reverse">
                    <div className="order-2 md:order-1 rounded-2xl overflow-hidden shadow-xl aspect-video md:aspect-auto h-full relative group">
                        <img
                            src="https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=2574&auto=format&fit=crop"
                            alt="Who We Serve"
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 min-h-[400px]"
                        />
                        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors"></div>
                    </div>
                    <div className="order-1 md:order-2 space-y-8">
                        <div>
                            <div className="flex items-center gap-3 mb-4 text-amber-600">
                                <Users className="h-6 w-6" />
                                <span className="font-semibold tracking-wide uppercase text-sm">Our Network</span>
                            </div>
                            <h2 className="text-3xl font-bold text-gray-900 mb-4">Who We Serve: A Dual Commitment to Excellence</h2>
                            <p className="text-gray-600 leading-relaxed">
                                At NAVYUG ENTERPRISE, we act as the vital link in a global agricultural ecosystem. Our mission is to ensure that quality produce finds the right market, creating value for everyone from the soil to the shelf.
                            </p>
                        </div>

                        {/* Global & Domestic Buyer */}
                        <div className="bg-white rounded-xl">
                            <h3 className="flex items-center gap-2 text-xl font-bold text-gray-900 mb-2">
                                <Globe className="h-5 w-5 text-amber-600" />
                                For the Global & Domestic Buyer
                            </h3>
                            <p className="text-amber-600 font-medium mb-3">Reliability in Every Consignment.</p>
                            <p className="text-gray-600 text-sm mb-4">
                                We serve a sophisticated network of domestic wholesalers, retailers, and large-scale global importers who refuse to compromise on authenticity. Our partners rely on us for:
                            </p>
                            <ul className="space-y-3">
                                <li className="flex items-start text-sm text-gray-600">
                                    <span className="font-bold text-amber-500 mr-2">•</span>
                                    <span><span className="font-semibold text-gray-900">Consistent Supply Chains:</span> Year-round availability of premium Groundnut, Cumin (Jeera), Sesame, and other essential Indian commodities.</span>
                                </li>
                                <li className="flex items-start text-sm text-gray-600">
                                    <span className="font-bold text-amber-500 mr-2">•</span>
                                    <span><span className="font-semibold text-gray-900">Verified Quality:</span> Stringent grading that meets international standards for purity and safety.</span>
                                </li>
                                <li className="flex items-start text-sm text-gray-600">
                                    <span className="font-bold text-amber-500 mr-2">•</span>
                                    <span><span className="font-semibold text-gray-900">Logistical Efficiency:</span> Seamless documentation and transparent communication that simplifies bulk sourcing.</span>
                                </li>
                            </ul>
                        </div>

                        {/* Indian Farmer */}
                        <div className="bg-white rounded-xl">
                            <h3 className="flex items-center gap-2 text-xl font-bold text-gray-900 mb-2">
                                <Tractor className="h-5 w-5 text-amber-600" />
                                For the Indian Farmer
                            </h3>
                            <p className="text-amber-600 font-medium mb-3">Empowering the Roots of Agriculture.</p>
                            <p className="text-gray-600 text-sm mb-4">
                                Equally central to our mission are the hardworking farmers who are the backbone of our industry. We serve the agricultural community by providing:
                            </p>
                            <ul className="space-y-3">
                                <li className="flex items-start text-sm text-gray-600">
                                    <span className="font-bold text-amber-500 mr-2">•</span>
                                    <span><span className="font-semibold text-gray-900">Fair & Transparent Discovery:</span> An honest marketplace where the true value of their labor is recognized through open APMC auctions.</span>
                                </li>
                                <li className="flex items-start text-sm text-gray-600">
                                    <span className="font-bold text-amber-500 mr-2">•</span>
                                    <span><span className="font-semibold text-gray-900">Financial Speed:</span> Our "Fast Payment Guarantee" ensures that farmers receive their settlements via UPI or Bank Transfer without delay.</span>
                                </li>
                                <li className="flex items-start text-sm text-gray-600">
                                    <span className="font-bold text-amber-500 mr-2">•</span>
                                    <span><span className="font-semibold text-gray-900">Sustainable Growth:</span> By connecting traditional farms to modern markets, we ensure the rural community thrives alongside our business partners.</span>
                                </li>
                            </ul>
                        </div>

                        <div className="pt-2">
                            <p className="text-lg font-semibold text-gray-900 italic border-l-4 border-amber-500 pl-4 py-1 bg-amber-50">
                                "We don't just move commodities; we grow trust."
                            </p>
                        </div>
                    </div>
                </section>

                {/* Company Leadership */}
                <section className="text-center">
                    <div className="flex items-center justify-center gap-3 mb-4 text-amber-600">
                        <Award className="h-6 w-6" />
                        <span className="font-semibold tracking-wide uppercase text-sm">Leadership</span>
                    </div>
                    <h2 className="text-3xl font-bold text-gray-900 mb-12">Company Leadership</h2>
                    <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                        <Card className="hover:shadow-lg transition-shadow border-0 shadow bg-gray-50">
                            <CardContent className="pt-8 pb-8">
                                <div className="w-24 h-24 bg-amber-200 rounded-full mx-auto mb-4 flex items-center justify-center text-amber-700 text-2xl font-bold">HG</div>
                                <h3 className="text-xl font-bold text-gray-900">Mr. Hareshbhai Galani</h3>
                                <p className="text-amber-600 font-medium mb-4">Co-Founder</p>
                                <p className="text-gray-600 text-sm">
                                    With decades of experience in the agricultural sector, Hareshbhai brings unparalleled expertise in crop quality assessment and farmer relations.
                                </p>
                            </CardContent>
                        </Card>
                        <Card className="hover:shadow-lg transition-shadow border-0 shadow bg-gray-50">
                            <CardContent className="pt-8 pb-8">
                                <div className="w-24 h-24 bg-amber-200 rounded-full mx-auto mb-4 flex items-center justify-center text-amber-700 text-2xl font-bold">MG</div>
                                <h3 className="text-xl font-bold text-gray-900">Mr. Manojbhai Galani</h3>
                                <p className="text-amber-600 font-medium mb-4">Co-Founder</p>
                                <p className="text-gray-600 text-sm">
                                    Mnojbhai drives the strategic vision of the company, overseeing market expansion and ensuring operational excellence in trade execution.
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </section>

                {/* How We Ensure Consistency */}
                <section>
                    <div className="bg-gray-900 text-white rounded-3xl p-8 md:p-16 overflow-hidden relative">
                        <div className="absolute top-0 right-0 p-16 opacity-10">
                            <Sprout className="w-64 h-64 text-white" />
                        </div>
                        <div className="relative z-10 grid md:grid-cols-2 gap-12 items-center">
                            <div>
                                <div className="flex items-center gap-3 mb-4 text-amber-400">
                                    <Target className="h-6 w-6" />
                                    <span className="font-semibold tracking-wide uppercase text-sm">Quality Control</span>
                                </div>
                                <h2 className="text-3xl font-bold text-white mb-6">How We Ensure Consistency</h2>
                                <ul className="space-y-4">
                                    <li className="flex items-start">
                                        <ShieldCheck className="h-6 w-6 text-amber-400 mr-3 mt-1 flex-shrink-0" />
                                        <div>
                                            <h4 className="font-semibold text-white">Direct Sourcing</h4>
                                            <p className="text-gray-400 text-sm">We source directly from trusted farmers, eliminating middlemen to maintain purity.</p>
                                        </div>
                                    </li>
                                    <li className="flex items-start">
                                        <ShieldCheck className="h-6 w-6 text-amber-400 mr-3 mt-1 flex-shrink-0" />
                                        <div>
                                            <h4 className="font-semibold text-white">Rigorous Grading</h4>
                                            <p className="text-gray-400 text-sm">Every batch undergoes strict cleaning and grading processes to meet specific size and quality standards.</p>
                                        </div>
                                    </li>
                                    <li className="flex items-start">
                                        <ShieldCheck className="h-6 w-6 text-amber-400 mr-3 mt-1 flex-shrink-0" />
                                        <div>
                                            <h4 className="font-semibold text-white">Storage Standards</h4>
                                            <p className="text-gray-400 text-sm">Modern storage facilities prevent moisture damage and preserve the natural freshness of produce.</p>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                            <div className="hidden md:block">
                                <img
                                    src="https://images.unsplash.com/photo-1625246333195-78d9c38ad449?q=80&w=2670&auto=format&fit=crop"
                                    alt="Quality Control"
                                    className="rounded-xl shadow-2xl transform rotate-2 hover:rotate-0 transition-transform duration-500 border-4 border-amber-500/20"
                                />
                            </div>
                        </div>
                    </div>
                </section>

                {/* Why Partner With Us */}
                <section className="text-center max-w-6xl mx-auto">
                    <div className="flex items-center justify-center gap-3 mb-4 text-amber-600">
                        <HeartHandshake className="h-6 w-6" />
                        <span className="font-semibold tracking-wide uppercase text-sm">Our Value Proposition</span>
                    </div>
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Partner With Us?</h2>
                    <p className="text-gray-600 max-w-2xl mx-auto mb-12">Our foundation is rural, but our standards are global.</p>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {/* 20+ Years */}
                        <div className="p-6 bg-white border rounded-xl shadow-sm hover:shadow-md transition-shadow h-full flex flex-col items-center text-center group">
                            <div className="bg-amber-100 w-14 h-14 rounded-full flex items-center justify-center text-amber-700 mb-5 group-hover:bg-amber-200 transition-colors">
                                <Clock className="w-7 h-7" />
                            </div>
                            <h3 className="font-bold text-lg mb-3">20+ Years of Expertise</h3>
                            <p className="text-gray-600 text-sm leading-relaxed">
                                Deep-rooted knowledge of the APMC auction process and market trends.
                            </p>
                        </div>

                        {/* Direct Sourcing */}
                        <div className="p-6 bg-white border rounded-xl shadow-sm hover:shadow-md transition-shadow h-full flex flex-col items-center text-center group">
                            <div className="bg-amber-100 w-14 h-14 rounded-full flex items-center justify-center text-amber-700 mb-5 group-hover:bg-amber-200 transition-colors">
                                <Sprout className="w-7 h-7" />
                            </div>
                            <h3 className="font-bold text-lg mb-3">Direct Sourcing</h3>
                            <p className="text-gray-600 text-sm leading-relaxed">
                                We work directly with farmers to ensure the freshest quality.
                            </p>
                        </div>

                        {/* Global Vision */}
                        <div className="p-6 bg-white border rounded-xl shadow-sm hover:shadow-md transition-shadow h-full flex flex-col items-center text-center group">
                            <div className="bg-amber-100 w-14 h-14 rounded-full flex items-center justify-center text-amber-700 mb-5 group-hover:bg-amber-200 transition-colors">
                                <Globe className="w-7 h-7" />
                            </div>
                            <h3 className="font-bold text-lg mb-3">Global Vision</h3>
                            <p className="text-gray-600 text-sm leading-relaxed">
                                Modernizing traditional trade to meet international export standards.
                            </p>
                        </div>

                        {/* Transparency First */}
                        <div className="p-6 bg-white border rounded-xl shadow-sm hover:shadow-md transition-shadow h-full flex flex-col items-center text-center group">
                            <div className="bg-amber-100 w-14 h-14 rounded-full flex items-center justify-center text-amber-700 mb-5 group-hover:bg-amber-200 transition-colors">
                                <FileCheck className="w-7 h-7" />
                            </div>
                            <h3 className="font-bold text-lg mb-3">Transparency First</h3>
                            <p className="text-gray-600 text-sm leading-relaxed">
                                Every transaction is built on trust, clear documentation, and a foundation of ethical values.
                            </p>
                        </div>
                    </div>
                </section>

            </div>

            {/* Footer - Consistent with Index */}
            <Footer />
        </div>
    );
};



export default About;
