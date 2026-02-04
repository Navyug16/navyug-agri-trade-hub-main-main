
import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const Header = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [isSticky, setIsSticky] = React.useState(false);
    const [isVisible, setIsVisible] = React.useState(true);
    const lastScrollY = React.useRef(0);

    const isActive = (path: string) => location.pathname === path;

    React.useEffect(() => {
        const handleScroll = () => {
            if (typeof window !== 'undefined') {
                const currentScrollY = window.scrollY;

                // Toggle Sticky Mode based on scroll position (e.g., passed top bar)
                setIsSticky(currentScrollY > 40);

                // Smart Hide/Show Logic
                if (currentScrollY < 10) {
                    setIsVisible(true);
                } else if (currentScrollY > lastScrollY.current) {
                    // Scrolling DOWN
                    setIsVisible(false);
                } else {
                    // Scrolling UP
                    setIsVisible(true);
                }

                lastScrollY.current = currentScrollY;
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <>
            {/* Top Bar - Stays static */}
            <div className="bg-gray-900 text-white py-2 text-sm z-50 relative">
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

            {/* Header - Becomes fixed when sticky */}
            {isSticky && <div className="h-24 w-full"></div>}

            <header
                className={`bg-white shadow-sm transition-all duration-300 z-[100] w-full h-24
                    ${isSticky ? 'fixed top-0 left-0' : 'relative'} 
                    ${isSticky && !isVisible ? '-translate-y-full' : 'translate-y-0'}
                `}
            >
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
