import React, { useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Mail, Phone, MapPin } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import ContactForm from '@/components/ContactForm';
import FloatingContact from '@/components/FloatingContact';
import { Button } from '@/components/ui/button';
import Footer from '@/components/Footer';
import Header from '@/components/Header';

const Contact = () => {
    const navigate = useNavigate();

    useEffect(() => {
        document.title = "Navyug Enterprise - Partner with Navyug Enterprise Today";
        const metaDescription = document.querySelector('meta[name="description"]');
        if (metaDescription) {
            metaDescription.setAttribute('content', "Contact Navyug Enterprise for bulk agricultural inquiries or farmer support. Visit us at our Rajkot APMC office or reach out online for transparent pricing and reliable supply chain solutions.");
        } else {
            const meta = document.createElement('meta');
            meta.name = "description";
            meta.content = "Contact Navyug Enterprise for bulk agricultural inquiries or farmer support. Visit us at our Rajkot APMC office or reach out online for transparent pricing and reliable supply chain solutions.";
            document.head.appendChild(meta);
        }
    }, []);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="min-h-screen bg-white w-full max-w-[100vw]">
            <Header />

            <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
                <div className="text-center mb-10 md:mb-16">
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 break-words hyphens-auto">Partner with Navyug Enterprise Today</h1>
                    <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
                        Whether you are a Farmer or a Global Importer, let’s grow together.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-8 md:gap-12 w-full max-w-full">
                    <div className="w-full max-w-full overflow-hidden">
                        <h3 className="text-2xl font-semibold mb-6 text-gray-900">Contact Information</h3>
                        <div className="space-y-6">
                            <div className="flex items-center space-x-4">
                                <div className="bg-amber-600 p-3 rounded-full flex-shrink-0">
                                    <Phone className="h-6 w-6 text-white" />
                                </div>
                                <div className="min-w-0 flex-1">
                                    <h4 className="font-semibold text-gray-900">Phone</h4>
                                    <a href="tel:+917016055780" className="text-gray-600 hover:text-amber-600 transition-colors block break-all">+91 7016055780</a>
                                </div>
                            </div>
                            <div className="flex items-center space-x-4">
                                <div className="bg-amber-600 p-3 rounded-full flex-shrink-0">
                                    <Mail className="h-6 w-6 text-white" />
                                </div>
                                <div className="min-w-0 flex-1">
                                    <h4 className="font-semibold text-gray-900">Email</h4>
                                    <a href="mailto:info@navyugenterprise.com" className="text-gray-600 hover:text-amber-600 transition-colors break-all block">info@navyugenterprise.com</a>
                                </div>
                            </div>
                            <div className="flex items-center space-x-4">
                                <div className="bg-amber-600 p-3 rounded-full flex-shrink-0">
                                    <MapPin className="h-6 w-6 text-white" />
                                </div>
                                <div className="min-w-0 flex-1">
                                    <h4 className="font-semibold text-gray-900">Address</h4>
                                    <p className="text-gray-600 break-words">A.P.M.C marketing yard, NH-27<br />Gondal-360311, Rajkot, Gujarat</p>
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

                    <Card className="p-3 md:p-8 w-full max-w-full overflow-hidden">
                        <h3 className="text-2xl font-semibold mb-6 text-gray-900">Send us a Message</h3>
                        <ContactForm />
                    </Card>
                </div>
            </main>

            <Footer />
            <FloatingContact />
        </div>
    );
};

export default Contact;
