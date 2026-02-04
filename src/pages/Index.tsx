
import { resolveImagePath } from '@/lib/utils';
import React, { useEffect, useState } from 'react';
import { ArrowRight, Mail, Phone, MapPin, Truck, Globe, Award, ShoppingCart, Facebook, Twitter, Instagram, Linkedin, Star, Sprout, Leaf, Sun, CloudSun, FileCheck, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useNavigate, useLocation, Link } from 'react-router-dom';
// import { products } from '@/data/products'; // Removed static
import { useToast } from "@/hooks/use-toast";
import { db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";
import FloatingContact from '@/components/FloatingContact';
import ContactForm from "@/components/ContactForm";

import Footer from "@/components/Footer";
import Header from "@/components/Header";
import BlogSection from "@/components/BlogSection";

const Index = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [scrollY, setScrollY] = useState(0);
  const [products, setProducts] = useState<any[]>([]); // Using any for simplicity or reuse Product interface if exported



  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "products"));
        // If Firestore is empty, fallback to static or empty. 
        // But better to show what's in DB.
        const fetched: any[] = [];
        querySnapshot.forEach((doc) => {
          fetched.push({ id: doc.id, ...doc.data() });
        });

        // Sort by priority list first, then by 'order' field
        const priorityOrder = ['groundnut', 'peanut', 'coriander', 'cumin', 'soyabean'];
        fetched.sort((a: any, b: any) => {
          const nameA = a.name.toLowerCase();
          const nameB = b.name.toLowerCase();

          // Function to check priority index
          const getPriority = (name: string) => {
            const index = priorityOrder.findIndex(p => name.includes(p));
            return index === -1 ? 99999 : index;
          };

          const priorityA = getPriority(nameA);
          const priorityB = getPriority(nameB);

          if (priorityA !== priorityB) {
            return priorityA - priorityB;
          }

          const orderA = a.order ?? 9999;
          const orderB = b.order ?? 9999;
          return orderA - orderB;
        });

        setProducts(fetched);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
    fetchProducts();
  }, []);



  useEffect(() => {
    document.title = "Navyug Enterprise - Premier Agricultural Commission Agent & Global Trade Hub";
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', "Navyug Enterprise is a trusted APMC Commission Agent in Gujarat. We bridge the gap between hardworking farmers and global buyers with transparent trade in Groundnut, Cumin, Sesame, and 45+ agricultural commodities.");
    } else {
      const meta = document.createElement('meta');
      meta.name = "description";
      meta.content = "Navyug Enterprise is a trusted APMC Commission Agent in Gujarat. We bridge the gap between hardworking farmers and global buyers with transparent trade in Groundnut, Cumin, Sesame, and 45+ agricultural commodities.";
      document.head.appendChild(meta);
    }
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    // Check if there's a hash in the URL (e.g., #contact) and scroll to it
    if (location.hash) {
      const element = document.getElementById(location.hash.substring(1));
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [location]);
  const scrollToProducts = () => {
    const productsSection = document.getElementById('products');
    if (productsSection) {
      productsSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero Section */}
      <section id="home" className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=2832&auto=format&fit=crop"
            alt="Agricultural Field"
            className="w-full h-full object-cover scale-110" // scale-110 kept for effect, or remove if static preference
          />
          <div className="absolute inset-0 bg-black/60"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10 text-center">
          <div className="max-w-4xl mx-auto animate-in fade-in zoom-in duration-1000">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 leading-tight tracking-tight">
              Premier Agricultural Commission Agent & Global Trade Hub
            </h1>
            <h2 className="text-xl md:text-3xl text-amber-400 font-medium mb-6">
              Connecting the Roots of Indian Agriculture to the Global Marketplace Since 2003.
            </h2>
            <p className="text-lg md:text-xl text-gray-200 mb-10 leading-relaxed max-w-2xl mx-auto hidden md:block">
              Navyug Enterprise is a trusted APMC Commission Agent in Gujarat. We bridge the gap between hardworking farmers and global buyers with transparent trade in Groundnut, Cumin, Sesame, and 45+ agricultural commodities.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-amber-600 hover:bg-amber-700 text-white text-lg px-8 py-6 rounded-full transition-all hover:scale-105"
                onClick={() => navigate('/products')}
              >
                View Our Products <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="border-2 border-white text-white hover:bg-white hover:text-gray-900 text-lg px-8 py-6 rounded-full bg-transparent transition-all hover:scale-105"
                onClick={() => navigate('/contact')}
              >
                Contact Us
              </Button>
            </div>
          </div>
        </div>

        {/* Scroll Down Indicator */}
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce text-white">
          <ArrowRight className="h-8 w-8 rotate-90" />
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex md:grid md:grid-cols-3 gap-8 overflow-x-auto snap-x snap-mandatory pb-6 md:pb-0 px-4 md:px-0 -mx-4 md:mx-0 scrollbar-hide">
            <RevealOnScroll delay={0} className="min-w-[85vw] md:min-w-0 snap-center">
              <Card className="text-center p-6 hover:shadow-lg transition-shadow h-full">
                <CardContent className="pt-6">
                  <Globe className="h-12 w-12 text-amber-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-3">Global Import-Export</h3>
                  <p className="text-gray-600">Connecting international markets with premium Indian agricultural products through reliable trade partnerships.</p>
                </CardContent>
              </Card>
            </RevealOnScroll>
            <RevealOnScroll delay={200} className="min-w-[85vw] md:min-w-0 snap-center">
              <Card className="text-center p-6 hover:shadow-lg transition-shadow h-full">
                <CardContent className="pt-6">
                  <Award className="h-12 w-12 text-amber-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-3">Quality Assurance</h3>
                  <p className="text-gray-600">Rigorous quality control processes ensure only the finest agricultural products reach our customers.</p>
                </CardContent>
              </Card>
            </RevealOnScroll>
            <RevealOnScroll delay={400} className="min-w-[85vw] md:min-w-0 snap-center">
              <Card className="text-center p-6 hover:shadow-lg transition-shadow h-full">
                <CardContent className="pt-6">
                  <Truck className="h-12 w-12 text-amber-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-3">Reliable Logistics</h3>
                  <p className="text-gray-600">Efficient supply chain management with timely delivery and proper handling of all products.</p>
                </CardContent>
              </Card>
            </RevealOnScroll>
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-16 bg-amber-50">
        <div className="container mx-auto px-4">
          <RevealOnScroll>
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold text-gray-900 mb-4 font-heading">Registered & Recognized By</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">Committed to quality and compliance with national standards.</p>
            </div>
          </RevealOnScroll>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center opacity-80">
            <RevealOnScroll delay={0}>
              <div className="flex flex-col justify-center items-center h-32 bg-white rounded-lg shadow-sm hover:shadow-md transition-all hover:-translate-y-1 group cursor-pointer border border-gray-100 p-4 text-center">
                <FileCheck className="h-8 w-8 text-gray-400 group-hover:text-amber-600 transition-colors mb-2" />
                <span className="text-md font-bold text-gray-500 group-hover:text-gray-900 transition-colors">APEDA</span>
                <span className="text-xs text-gray-400 mt-1">Govt. of India</span>
              </div>
            </RevealOnScroll>
            <RevealOnScroll delay={100}>
              <div className="flex flex-col justify-center items-center h-32 bg-white rounded-lg shadow-sm hover:shadow-md transition-all hover:-translate-y-1 group cursor-pointer border border-gray-100 p-4 text-center">
                <Leaf className="h-8 w-8 text-gray-400 group-hover:text-green-600 transition-colors mb-2" />
                <span className="text-md font-bold text-gray-500 group-hover:text-gray-900 transition-colors">SPICES BOARD</span>
                <span className="text-xs text-gray-400 mt-1">Ministry of Commerce</span>
              </div>
            </RevealOnScroll>
            <RevealOnScroll delay={200}>
              <div className="flex flex-col justify-center items-center h-32 bg-white rounded-lg shadow-sm hover:shadow-md transition-all hover:-translate-y-1 group cursor-pointer border border-gray-100 p-4 text-center">
                <ShieldCheck className="h-8 w-8 text-gray-400 group-hover:text-green-600 transition-colors mb-2" />
                <span className="text-md font-bold text-gray-500 group-hover:text-gray-900 transition-colors">FSSAI</span>
                <span className="text-xs text-gray-400 mt-1">Food Safety Authority</span>
              </div>
            </RevealOnScroll>
            <RevealOnScroll delay={300}>
              <div className="flex flex-col justify-center items-center h-32 bg-white rounded-lg shadow-sm hover:shadow-md transition-all hover:-translate-y-1 group cursor-pointer border border-gray-100 p-4 text-center">
                <MapPin className="h-8 w-8 text-gray-400 group-hover:text-amber-500 transition-colors mb-2" />
                <span className="text-md font-bold text-gray-500 group-hover:text-gray-900 transition-colors">APMC GONDAL</span>
                <span className="text-xs text-gray-400 mt-1">Registered Member</span>
              </div>
            </RevealOnScroll>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <RevealOnScroll>
              <div>
                <h2 className="text-4xl font-bold text-gray-900 mb-6">About NAVYUG ENTERPRISE</h2>
                <div className="mb-6">
                  <span className="inline-block bg-amber-100 text-amber-800 text-sm font-semibold px-3 py-1 rounded-full mb-2">Established 2003</span>
                  <h3 className="text-xl font-medium text-gray-800">Founded by Mr. Hareshbhai Galani & Mr. Manojbhai Galani</h3>
                </div>
                <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                  NAVYUG ENTERPRISE was established with a vision to support farmers and connect them with genuine buyers through honest, commission-based trade. For over two decades, we have been working as a trusted commission agent in agricultural food products such as grains, pulses, and spices. We do not deal in fertilizers or chemicals — only natural, farm-grown produce. Our goal is to ensure that farmers receive fair value for their hard work, while buyers benefit from pure, quality products. Built on transparency, trust, and rural values, NAVYUG ENTERPRISE is committed to promoting ethical trade and strengthening India's agricultural backbone.
                </p>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Our Mission</h4>
                    <p className="text-gray-600">To provide exceptional agricultural products that meet international quality standards.</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Our Vision</h4>
                    <p className="text-gray-600">To become a leading name in global agricultural trade and export excellence.</p>
                  </div>
                </div>
              </div>
            </RevealOnScroll>
            <RevealOnScroll delay={200}>
              <div className="relative">
                <img
                  src="https://images.unsplash.com/photo-1493962853295-0fd70327578a?w=600&h=500&fit=crop"
                  alt="About us"
                  className="rounded-2xl shadow-xl w-full h-96 object-cover"
                  loading="lazy"
                />
              </div>
            </RevealOnScroll>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section id="products" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <RevealOnScroll>
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Premium Products</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                We specialize in high-quality agricultural products that meet international standards and satisfy global market demands.
              </p>
            </div>
          </RevealOnScroll>

          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-8 mb-8">
            {products.slice(0, 4).map((product, index) => (
              <RevealOnScroll key={product.id} delay={index * 100}>
                <Card className="w-full h-full overflow-hidden hover:shadow-xl transition-all duration-300 group relative border-0 shadow-md flex flex-col">
                  {/* Badge */}
                  <div className="absolute top-2 right-2 z-10 bg-amber-600 text-white text-[10px] md:text-xs font-bold px-2 py-1 rounded shadow-sm">
                    Premium
                  </div>

                  {/* Image */}
                  <div className="relative overflow-hidden h-36 md:h-48 flex-shrink-0 bg-gray-100">
                    <img
                      src={resolveImagePath(product.image)}
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-500"
                      loading="lazy"
                    />
                  </div>

                  {/* Content */}
                  <CardContent className="p-3 md:p-4 flex-1 flex flex-col">
                    <h3 className="text-sm md:text-lg font-semibold mb-1 md:mb-2 text-gray-900 line-clamp-1 group-hover:text-amber-600 transition-colors">
                      {product.name}
                    </h3>
                    <p className="text-gray-600 text-xs md:text-sm mb-3 md:mb-4 line-clamp-2 hidden md:block">
                      {product.description}
                    </p>

                    {/* Mobile Only: Simple category or reduced text if needed? No, just spacing. */}

                    <div className="mt-auto">
                      <Button
                        onClick={() => navigate(`/product/${product.id}`)}
                        size="sm"
                        className="w-full bg-amber-600 hover:bg-amber-700 text-white text-xs md:text-sm h-8 md:h-10"
                      >
                        <ShoppingCart className="mr-1.5 h-3 w-3 md:h-4 md:w-4" />
                        Details
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </RevealOnScroll>
            ))}
          </div>

          <RevealOnScroll delay={400}>
            <div className="text-center">
              <Button
                onClick={() => navigate('/products')}
                variant="outline"
                className="border-amber-600 text-amber-700 hover:bg-amber-50 rounded-full px-8 group"
              >
                View All Products
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          </RevealOnScroll>
        </div>
      </section>

      {/* Blog Section */}
      <BlogSection />

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-gradient-to-br from-amber-50 to-orange-50">
        <div className="container mx-auto px-4">
          <RevealOnScroll>
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Get In Touch</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Ready to explore business opportunities? Contact us today to discuss your agricultural product requirements.
              </p>
            </div>
          </RevealOnScroll>

          <div className="grid md:grid-cols-2 gap-12">
            <RevealOnScroll>
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
            </RevealOnScroll>

            <RevealOnScroll delay={200}>
              <Card className="p-8">
                <h3 className="text-2xl font-semibold mb-6 text-gray-900">Send us a Message</h3>
                <ContactForm />
              </Card>
            </RevealOnScroll>
          </div>
        </div>
      </section>

      {/* Footer */}

      <Footer />
      <FloatingContact />
    </div>
  );
};

const RevealOnScroll = ({ children, className = "", delay = 0 }: { children: React.ReactNode, className?: string, delay?: number }) => {
  const ref = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            if (entry.target) {
              entry.target.classList.add('animate-in', 'fade-in', 'slide-in-from-bottom-8');
              entry.target.classList.remove('opacity-0');
            }
          }, delay);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [delay]);

  return (
    <div ref={ref} className={`opacity-0 duration-1000 ${className}`}>
      {children}
    </div>
  );
};

export default Index;
