import React, { useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Mail, Phone, MapPin } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import ContactForm from '@/components/ContactForm';
import FloatingContact from '@/components/FloatingContact';
import { Button } from '@/components/ui/button';

const Contact = () => {
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

            {/* Header */}
            <header className="bg-white shadow-sm sticky top-0 z-50">
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
                            <Link to="/" className="text-gray-700 hover:text-amber-600 transition-colors">Home</Link>
                            <Link to="/about" className="text-gray-700 hover:text-amber-600 transition-colors">About</Link>
                            <Link to="/products" className="text-gray-700 hover:text-amber-600 transition-colors">Products</Link>
                            <Link to="/contact" className="text-amber-600 font-semibold transition-colors">Contact</Link>
                        </nav>
                    </div>
                </div>
            </header>

            <main className="container mx-auto px-4 py-12">
                <div className="text-center mb-16">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">Contact Us</h1>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                        Get in touch with us for any inquiries or collaborations. We are here to help.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-12">
                    <div>
                        <h3 className="text-2xl font-semibold mb-6 text-gray-900">Contact Information</h3>
                        <div className="space-y-6">
                            <div className="flex items-center space-x-4">
                                <div className="bg-amber-600 p-3 rounded-full">
                                    <Phone className="h-6 w-6 text-white" />
                                </div>
                                <div>
                                    <h4 className="font-semibold text-gray-900">Phone</h4>
                                    <a href="tel:+917016055780" className="text-gray-600 hover:text-amber-600 transition-colors">+91 7016055780</a>
                                </div>
                            </div>
                            <div className="flex items-center space-x-4">
                                <div className="bg-amber-600 p-3 rounded-full">
                                    <Mail className="h-6 w-6 text-white" />
                                </div>
                                <div>
                                    <h4 className="font-semibold text-gray-900">Email</h4>
                                    <a href="mailto:info@navyugenterprise.com" className="text-gray-600 hover:text-amber-600 transition-colors">info@navyugenterprise.com</a>
                                </div>
                            </div>
                            <div className="flex items-center space-x-4">
                                <div className="bg-amber-600 p-3 rounded-full">
                                    <MapPin className="h-6 w-6 text-white" />
                                </div>
                                <div>
                                    <h4 className="font-semibold text-gray-900">Address</h4>
                                    <p className="text-gray-600">A.P.M.C marketing yard, NH-27<br />Gondal-360311, Rajkot, Gujarat</p>
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 h-64 w-full rounded-lg overflow-hidden shadow-md">
                            <iframe
                                src="https://maps.google.com/maps?q=APMC+Marketing+Yard+Gondal&t=&z=15&ie=UTF8&iwloc=&output=embed"
                                width="100%"
                                height="100%"
                                style={{ border: 0 }}
                                allowFullScreen
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                                title="Google Map"
                            ></iframe>
                        </div>
                    </div>

                    <Card className="p-8">
                        <h3 className="text-2xl font-semibold mb-6 text-gray-900">Send us a Message</h3>
                        <ContactForm />
                    </Card>
                </div>
            </main>

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
            <FloatingContact />
        </div>
    );
};

export default Contact;
