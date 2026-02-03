import React from 'react';
import { Facebook, Twitter, Instagram, Linkedin, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link, useNavigate } from 'react-router-dom';

const Footer = () => {
    const navigate = useNavigate();

    return (
        <footer className="bg-gray-900 text-white pt-16 pb-8">
            <div className="container mx-auto px-4">
                <div className="grid md:grid-cols-4 gap-8 mb-12">
                    <div className="col-span-1 md:col-span-1">
                        <div className="flex items-center space-x-3 mb-6 flex-wrap">
                            <img
                                src="/images/logo-new.jpg"
                                alt="NAVYUG ENTERPRISE Logo"
                                className="w-16 h-16 object-contain rounded-full"
                            />
                            <h3 className="text-xl font-bold break-words">NAVYUG ENTERPRISE</h3>
                        </div>
                        <p className="text-gray-400 leading-relaxed mb-6 text-sm">
                            Your trusted partner in agricultural product import and export, connecting global markets with premium Indian produce.
                        </p>
                        <div className="flex space-x-4">
                            <a href="#" className="text-gray-400 hover:text-amber-500 transition-colors"><Facebook className="h-5 w-5" /></a>
                            <a href="#" className="text-gray-400 hover:text-amber-500 transition-colors"><Twitter className="h-5 w-5" /></a>
                            <a href="#" className="text-gray-400 hover:text-amber-500 transition-colors"><Instagram className="h-5 w-5" /></a>
                            <a href="#" className="text-gray-400 hover:text-amber-500 transition-colors"><Linkedin className="h-5 w-5" /></a>
                        </div>
                    </div>

                    <div>
                        <h4 className="text-lg font-semibold mb-6 text-white">Quick Links</h4>
                        <ul className="space-y-3 text-gray-400 text-sm">
                            <li><Link to="/" className="hover:text-amber-400 transition-colors">Home</Link></li>
                            <li><Link to="/about" className="hover:text-amber-400 transition-colors">About Us</Link></li>
                            <li><Link to="/products" className="hover:text-amber-400 transition-colors">Products</Link></li>
                            <li><Link to="/contact" className="hover:text-amber-400 transition-colors">Contact</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-lg font-semibold mb-6 text-white">Our Products</h4>
                        <ul className="space-y-3 text-gray-400 text-sm">
                            <li><button onClick={() => navigate('/products')} className="hover:text-amber-400 transition-colors text-left">Groundnut & Peanut</button></li>
                            <li><button onClick={() => navigate('/products')} className="hover:text-amber-400 transition-colors text-left">Coriander & Cumin</button></li>
                            <li><button onClick={() => navigate('/products')} className="hover:text-amber-400 transition-colors text-left">Sesame Seeds</button></li>
                            <li><button onClick={() => navigate('/products')} className="hover:text-amber-400 transition-colors text-left">Chickpeas & Mung</button></li>
                            <li><button onClick={() => navigate('/products')} className="hover:text-amber-400 transition-colors text-left">Wheat</button></li>
                            <li className="pt-2">
                                <button
                                    onClick={() => navigate('/products')}
                                    className="flex items-center text-amber-500 hover:text-amber-400 transition-colors font-medium"
                                >
                                    More Products <ArrowRight className="ml-1 h-3 w-3" />
                                </button>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-lg font-semibold mb-6 text-white">Newsletter</h4>
                        <p className="text-gray-400 text-sm mb-4">Subscribe to get updates on new products and market trends.</p>
                        <form className="space-y-3" onSubmit={(e) => e.preventDefault()}>
                            <input
                                type="email"
                                placeholder="Your email address"
                                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded focus:outline-none focus:border-amber-500 text-white text-sm"
                            />
                            <Button className="w-full bg-amber-600 hover:bg-amber-700 text-white text-sm">
                                Subscribe
                            </Button>
                        </form>
                    </div>
                </div>

                <div className="border-t border-gray-800 pt-8 text-center">
                    <p className="text-gray-500 text-sm">© 2024 NAVYUG ENTERPRISE. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
