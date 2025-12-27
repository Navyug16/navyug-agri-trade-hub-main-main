import React, { useEffect } from 'react';
import { ArrowLeft, Users, Target, Award, ShieldCheck, HeartHandshake, Leaf, Sprout } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Link, useNavigate } from 'react-router-dom';

const About = () => {
    const navigate = useNavigate();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="min-h-screen bg-white">
            {/* Top Bar - Consistent with Index */}
            <div className="bg-gray-900 text-white py-2 text-sm">
                <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-2">
                    <div className="flex items-center space-x-4">
                        <span>GST: <span className="font-semibold text-amber-400">24ABCDE1234F1Z5</span></span>
                        <span className="hidden md:inline text-gray-600">|</span>
                        <span>Licence: <span className="font-semibold text-amber-400">1234567890</span></span>
                    </div>
                    <div className="flex items-center space-x-4 text-gray-300 text-xs md:text-sm">
                        <a href="mailto:info@navyugenterprise.com" className="hover:text-amber-400 transition-colors">info@navyugenterprise.com</a>
                        <span>|</span>
                        <a href="tel:+917016055780" className="hover:text-amber-400 transition-colors">+91 7016055780</a>
                    </div>
                </div>
            </div>

            {/* Header - consistent with Index but adapted links */}
            <header className="bg-white shadow-sm sticky top-0 z-50">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3 cursor-pointer" onClick={() => navigate('/')}>
                            <img
                                src="/lovable-uploads/ef1bc6e7-7b27-4e12-8ef2-bcf775af4873.png"
                                alt="NAVYUG ENTERPRISE Logo"
                                className="w-12 h-12 object-contain"
                            />
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">NAVYUG ENTERPRISE</h1>
                                <p className="text-sm text-gray-600">Quality Agricultural Products</p>
                            </div>
                        </div>
                        <nav className="hidden md:flex space-x-8">
                            <Link to="/" className="text-gray-700 hover:text-amber-600 transition-colors">Home</Link>
                            <Link to="/about" className="text-amber-600 font-semibold transition-colors">About</Link>
                            <Link to="/products" className="text-gray-700 hover:text-amber-600 transition-colors">Products</Link>
                            <a href="/#contact" className="text-gray-700 hover:text-amber-600 transition-colors">Contact</a>
                        </nav>
                    </div>
                </div>
            </header>

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
                <section className="grid md:grid-cols-2 gap-12 items-center">
                    <div>
                        <div className="flex items-center gap-3 mb-4 text-amber-600">
                            <Leaf className="h-6 w-6" />
                            <span className="font-semibold tracking-wide uppercase text-sm">Our Story</span>
                        </div>
                        <h2 className="text-3xl font-bold text-gray-900 mb-6">Who We Are</h2>
                        <p className="text-gray-600 leading-relaxed mb-6">
                            NAVYUG ENTERPRISE was established in 2003 with a singular vision: to bridge the gap between hardworking Indian farmers and the global marketplace. Founded by Mr. Hareshbhai Galani & Mr. Manojbhai Galani, we operate as a trusted commission agent specializing in agricultural food products.
                        </p>
                        <p className="text-gray-600 leading-relaxed">
                            We take pride in dealing exclusively in natural, farm-grown produce—strictly no fertilizers or chemicals involved in our trading process where possible. Our foundation is built on transparency, rural values, and an unwavering commitment to quality.
                        </p>
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
                <section className="grid md:grid-cols-2 gap-12 items-center md:flex-row-reverse">
                    <div className="order-2 md:order-1 rounded-2xl overflow-hidden shadow-xl aspect-video md:aspect-square relative group">
                        <img
                            src="https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=2574&auto=format&fit=crop"
                            alt="Who We Serve"
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                    </div>
                    <div className="order-1 md:order-2">
                        <div className="flex items-center gap-3 mb-4 text-amber-600">
                            <Users className="h-6 w-6" />
                            <span className="font-semibold tracking-wide uppercase text-sm">Our Partners</span>
                        </div>
                        <h2 className="text-3xl font-bold text-gray-900 mb-6">Who We Serve</h2>
                        <p className="text-gray-600 leading-relaxed mb-6">
                            We serve a diverse network of domestic and international buyers who value authenticity and quality. From local wholesalers/retailers to large-scale global importers, our client base relies on us for consistent supply chains of Groundnut, Cumin, Sesame, and other essential commodities.
                        </p>
                        <p className="text-gray-600 leading-relaxed">
                            Equally important are the farmers we serve. By providing them with a fair, transparent marketplace, we ensure that the agricultural community thrives alongside our business partners.
                        </p>
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

                {/* Why Client Trust Us */}
                <section className="text-center max-w-5xl mx-auto">
                    <div className="flex items-center justify-center gap-3 mb-4 text-amber-600">
                        <HeartHandshake className="h-6 w-6" />
                        <span className="font-semibold tracking-wide uppercase text-sm">Our Values</span>
                    </div>
                    <h2 className="text-3xl font-bold text-gray-900 mb-12">Why Clients Trust Us</h2>
                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="p-6 bg-white border rounded-xl shadow-sm hover:shadow-md transition-shadow">
                            <div className="bg-amber-100 w-12 h-12 rounded-lg flex items-center justify-center text-amber-700 mx-auto mb-4">
                                <ShieldCheck className="w-6 h-6" />
                            </div>
                            <h3 className="font-bold text-lg mb-2">Transparency</h3>
                            <p className="text-gray-600 text-sm">No hidden costs or compromised quality. We believe in clear, honest communication at every step.</p>
                        </div>
                        <div className="p-6 bg-white border rounded-xl shadow-sm hover:shadow-md transition-shadow">
                            <div className="bg-amber-100 w-12 h-12 rounded-lg flex items-center justify-center text-amber-700 mx-auto mb-4">
                                <Truck className="w-6 h-6" />
                            </div>
                            {/* Note: Truck icon needed so adding import */}
                            <h3 className="font-bold text-lg mb-2">Reliability</h3>
                            <p className="text-gray-600 text-sm">Timely delivery is our promise. Our robust logistics network ensures your orders arrive as planned.</p>
                        </div>
                        <div className="p-6 bg-white border rounded-xl shadow-sm hover:shadow-md transition-shadow">
                            <div className="bg-amber-100 w-12 h-12 rounded-lg flex items-center justify-center text-amber-700 mx-auto mb-4">
                                <Users className="w-6 h-6" />
                            </div>
                            <h3 className="font-bold text-lg mb-2">Long-term Relations</h3>
                            <p className="text-gray-600 text-sm">We treat every client as a partner, focusing on building lasting relationships over quick profits.</p>
                        </div>
                    </div>
                </section>

            </div>

            {/* Footer - Consistent with Index */}
            <footer className="bg-gray-900 text-white pt-16 pb-8">
                <div className="container mx-auto px-4">
                    <div className="border-t border-gray-800 pt-8 text-center">
                        <p className="text-gray-500 text-sm">© 2024 NAVYUG ENTERPRISE. All rights reserved.</p>
                        <Link to="/">
                            <Button variant="link" className="text-gray-500 hover:text-amber-500 mt-2">Back to Home</Button>
                        </Link>
                    </div>
                </div>
            </footer>
        </div>
    );
};

// Internal imports helper for icons not imported at top
import { Truck } from 'lucide-react';

export default About;
