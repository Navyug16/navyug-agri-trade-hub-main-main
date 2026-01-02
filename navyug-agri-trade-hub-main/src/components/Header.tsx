
import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const Header = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const isActive = (path: string) => location.pathname === path;

    return (
        <>
            {/* Top Bar */}
            <div className="bg-gray-900 text-white py-2 text-sm animate-in slide-in-from-top duration-500">
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

            {/* Header */}
            <header className="bg-white shadow-sm sticky top-0 z-50 animate-in slide-in-from-top duration-700 delay-100 fill-mode-backwards">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3 cursor-pointer" onClick={() => navigate('/')}>
                            <img
                                src="/logo-new.jpg"
                                alt="NAVYUG ENTERPRISE Logo"
                                className="w-16 h-16 object-contain rounded-full mix-blend-multiply"
                            />
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">NAVYUG ENTERPRISE</h1>
                                <p className="text-sm text-gray-600">Quality Agricultural Products</p>
                            </div>
                        </div>
                        <nav className="hidden md:flex space-x-8">
                            <Link
                                to="/"
                                className={`${isActive('/') ? 'text-amber-600 font-semibold' : 'text-gray-700 hover:text-amber-600'} transition-colors`}
                            >
                                Home
                            </Link>
                            <Link
                                to="/about"
                                className={`${isActive('/about') ? 'text-amber-600 font-semibold' : 'text-gray-700 hover:text-amber-600'} transition-colors`}
                            >
                                About
                            </Link>
                            <Link
                                to="/products"
                                className={`${isActive('/products') ? 'text-amber-600 font-semibold' : 'text-gray-700 hover:text-amber-600'} transition-colors`}
                            >
                                Products
                            </Link>
                            <Link
                                to="/blog"
                                className={`${isActive('/blog') ? 'text-amber-600 font-semibold' : 'text-gray-700 hover:text-amber-600'} transition-colors`}
                            >
                                Blog
                            </Link>
                            <Link
                                to="/contact"
                                className={`${isActive('/contact') ? 'text-amber-600 font-semibold' : 'text-gray-700 hover:text-amber-600'} transition-colors`}
                            >
                                Contact
                            </Link>
                        </nav>
                    </div>
                </div>
            </header>
        </>
    );
};

export default Header;
