
import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const Header = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [isVisible, setIsVisible] = React.useState(true);
    const [lastScrollY, setLastScrollY] = React.useState(0);

    const isActive = (path: string) => location.pathname === path;

    React.useEffect(() => {
        const controlNavbar = () => {
            if (typeof window !== 'undefined') {
                if (window.scrollY > lastScrollY && window.scrollY > 100) {
                    // if scroll down hide the navbar
                    setIsVisible(false);
                } else {
                    // if scroll up show the navbar
                    setIsVisible(true);
                }
                setLastScrollY(window.scrollY);
            }
        };

        window.addEventListener('scroll', controlNavbar);

        return () => {
            window.removeEventListener('scroll', controlNavbar);
        };
    }, [lastScrollY]);

    return (
        <>
            {/* Top Bar */}
            <div className="bg-gray-900 text-white py-2 text-sm animate-in slide-in-from-top duration-500">
                <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-2">
                    <div className="flex flex-wrap justify-center gap-2 sm:gap-4 text-center">
                        <span>GST: <span className="font-semibold text-amber-400 whitespace-nowrap">24ABCDE1234F1Z5</span></span>
                        <span className="hidden sm:inline text-gray-600">|</span>
                        <span>Licence: <span className="font-semibold text-amber-400 whitespace-nowrap">1234567890</span></span>
                    </div>
                    <div className="flex flex-wrap justify-center gap-2 sm:gap-4 text-gray-300 text-xs md:text-sm">
                        <a href="mailto:info@navyugenterprise.com" className="hover:text-amber-400 transition-colors break-all sm:break-normal">info@navyugenterprise.com</a>
                        <span className="hidden sm:inline">|</span>
                        <a href="tel:+917016055780" className="hover:text-amber-400 transition-colors whitespace-nowrap">+91 7016055780</a>
                    </div>
                </div>
            </div>

            {/* Header */}
            <header className={`bg-white shadow-sm sticky top-0 z-50 transition-transform duration-300 ${isVisible ? 'translate-y-0' : '-translate-y-full'}`}>
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3 cursor-pointer" onClick={() => navigate('/')}>
                            <img
                                src="/images/logo-new.jpg"
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
