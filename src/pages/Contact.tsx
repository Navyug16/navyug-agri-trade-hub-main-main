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
        <div className="min-h-screen bg-white">
            <Header />

            <main className="container mx-auto px-4 py-12">
                <div className="text-center mb-16">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">Partner with Navyug Enterprise Today</h1>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                        Whether you are a Farmer or a Global Importer, let’s grow together.
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

                    <Card className="p-4 md:p-8">
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
