
import React, { useEffect, useState } from 'react';
import { ArrowRight, Mail, Phone, MapPin, Truck, Globe, Award, ShoppingCart, Facebook, Twitter, Instagram, Linkedin, Star, Sprout, Leaf, Sun, CloudSun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useNavigate, useLocation, Link } from 'react-router-dom';
// import { products } from '@/data/products'; // Removed static
import { useToast } from "@/hooks/use-toast";
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp, getDocs } from "firebase/firestore";

const Index = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [scrollY, setScrollY] = useState(0);
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [products, setProducts] = useState<any[]>([]); // Using any for simplicity or reuse Product interface if exported
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await addDoc(collection(db, "inquiries"), {
        name: formData.name,
        email: formData.email,
        product_interest: formData.subject,
        message: formData.message,
        status: 'pending',
        created_at: serverTimestamp()
      });

      toast({
        title: "Message Sent",
        description: "We've received your message and will get back to you soon.",
      });

      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

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
            <div className="flex items-center space-x-3">
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
              <a href="#home" className="text-gray-700 hover:text-amber-600 transition-colors">Home</a>
              <a href="/about" className="text-gray-700 hover:text-amber-600 transition-colors">About</a>
              <Link to="/products" className="text-gray-700 hover:text-amber-600 transition-colors">Products</Link>
              <a href="#contact" className="text-gray-700 hover:text-amber-600 transition-colors">Contact</a>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section id="home" className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        {/* Background Image with Overlay and Parallax */}
        <div
          className="absolute inset-0 z-0"
          style={{ transform: `translateY(${scrollY * 0.5}px)` }}
        >
          <img
            src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=2832&auto=format&fit=crop"
            alt="Agricultural Field"
            className="w-full h-full object-cover scale-110" // Scale up slightly to prevent white gaps during parallax
          />
          <div className="absolute inset-0 bg-black/60"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10 text-center">
          <div className="max-w-4xl mx-auto animate-in fade-in zoom-in duration-1000">
            <h2 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight tracking-tight">
              Premium Agricultural Products for
              <span className="text-amber-400 block mt-2">Global Markets</span>
            </h2>
            <p className="text-xl md:text-2xl text-gray-200 mb-10 leading-relaxed max-w-2xl mx-auto">
              Connecting global markets with premium Indian agricultural produce. Quality, Trust, and Excellence in every grain.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-amber-600 hover:bg-amber-700 text-white text-lg px-8 py-6 rounded-full transition-all hover:scale-105"
                onClick={scrollToProducts}
              >
                View Our Products <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="border-2 border-white text-white hover:bg-white hover:text-gray-900 text-lg px-8 py-6 rounded-full bg-transparent transition-all hover:scale-105"
                onClick={() => {
                  const contactSection = document.getElementById('contact');
                  if (contactSection) {
                    contactSection.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
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
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Trusted by Global Partners</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">Building lasting relationships through quality and trust.</p>
            </div>
          </RevealOnScroll>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center opacity-70">
            <RevealOnScroll delay={0}>
              <div className="flex flex-col justify-center items-center h-24 bg-white rounded-lg shadow-sm hover:shadow-md transition-all hover:-translate-y-1 group cursor-pointer border border-gray-100">
                <Globe className="h-8 w-8 text-gray-400 group-hover:text-amber-600 transition-colors mb-2" />
                <span className="text-lg font-bold text-gray-400 group-hover:text-gray-700 transition-colors">AgriGlobal</span>
              </div>
            </RevealOnScroll>
            <RevealOnScroll delay={100}>
              <div className="flex flex-col justify-center items-center h-24 bg-white rounded-lg shadow-sm hover:shadow-md transition-all hover:-translate-y-1 group cursor-pointer border border-gray-100">
                <Leaf className="h-8 w-8 text-gray-400 group-hover:text-green-600 transition-colors mb-2" />
                <span className="text-lg font-bold text-gray-400 group-hover:text-gray-700 transition-colors">NatureFresh</span>
              </div>
            </RevealOnScroll>
            <RevealOnScroll delay={200}>
              <div className="flex flex-col justify-center items-center h-24 bg-white rounded-lg shadow-sm hover:shadow-md transition-all hover:-translate-y-1 group cursor-pointer border border-gray-100">
                <Sprout className="h-8 w-8 text-gray-400 group-hover:text-green-600 transition-colors mb-2" />
                <span className="text-lg font-bold text-gray-400 group-hover:text-gray-700 transition-colors">OrganicTrade</span>
              </div>
            </RevealOnScroll>
            <RevealOnScroll delay={300}>
              <div className="flex flex-col justify-center items-center h-24 bg-white rounded-lg shadow-sm hover:shadow-md transition-all hover:-translate-y-1 group cursor-pointer border border-gray-100">
                <Sun className="h-8 w-8 text-gray-400 group-hover:text-amber-500 transition-colors mb-2" />
                <span className="text-lg font-bold text-gray-400 group-hover:text-gray-700 transition-colors">PureHarvest</span>
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

          <div className="flex flex-wrap justify-center gap-6 px-4">
            {products.slice(0, 4).map((product, index) => (
              <RevealOnScroll key={product.id} delay={index * 100} className="flex-shrink-0">
                <Card className="w-64 overflow-hidden hover:shadow-xl transition-all duration-300 group relative border-0 shadow-md h-full">
                  <div className="absolute top-3 right-3 z-10 bg-amber-600 text-white text-xs font-bold px-2 py-1 rounded shadow-sm">
                    Premium Quality
                  </div>
                  <div className="relative overflow-hidden h-48">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <Button
                        onClick={() => navigate(`/product/${product.id}`)}
                        className="bg-white text-gray-900 hover:bg-amber-50"
                      >
                        View Details
                      </Button>
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <h3 className="text-lg font-semibold mb-2 text-gray-900 group-hover:text-amber-600 transition-colors">{product.name}</h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {product.description}
                    </p>
                    <Button
                      onClick={() => navigate(`/product/${product.id}`)}
                      className="w-full bg-amber-600 hover:bg-amber-700 text-white md:hidden"
                    >
                      <ShoppingCart className="mr-2 h-4 w-4" />
                      View Details
                    </Button>
                  </CardContent>
                </Card>
              </RevealOnScroll>
            ))}

            {/* View All Circle */}
            <RevealOnScroll delay={600} className="flex-shrink-0 flex items-center justify-center w-32 md:w-auto">
              <div
                onClick={() => navigate('/products')}
                className="flex flex-col items-center gap-2 cursor-pointer group"
              >
                <div className="w-16 h-16 rounded-full bg-amber-100 border-2 border-amber-300 flex items-center justify-center group-hover:scale-110 transition-transform shadow-md group-hover:bg-amber-200">
                  <ArrowRight className="h-6 w-6 text-amber-700" />
                </div>
                <span className="font-bold text-gray-700 text-sm group-hover:text-amber-700 whitespace-nowrap">View All</span>
              </div>
            </RevealOnScroll>
          </div>
        </div>
      </section>

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
                <form className="space-y-6" onSubmit={handleSubmit}>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                        placeholder="Your Name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                        placeholder="your@email.com"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
                    <input
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                      placeholder="Inquiry about products"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      required
                      rows={6}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                      placeholder="Tell us about your requirements..."
                    ></textarea>
                  </div>
                  <Button type="submit" disabled={isSubmitting} className="w-full bg-amber-600 hover:bg-amber-700 text-white py-3">
                    {isSubmitting ? 'Sending...' : 'Send Message'}
                  </Button>
                </form>
              </Card>
            </RevealOnScroll>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white pt-16 pb-8">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-12">
            <div className="col-span-1 md:col-span-1">
              <div className="flex items-center space-x-3 mb-6">
                <img
                  src="/logo-new.jpg"
                  alt="NAVYUG ENTERPRISE Logo"
                  className="w-16 h-16 object-contain rounded-full"
                />
                <h3 className="text-xl font-bold">NAVYUG</h3>
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
                <li><a href="#home" className="hover:text-amber-400 transition-colors">Home</a></li>
                <li><a href="#about" className="hover:text-amber-400 transition-colors">About Us</a></li>
                <li><a href="#products" className="hover:text-amber-400 transition-colors">Products</a></li>
                <li><a href="#contact" className="hover:text-amber-400 transition-colors">Contact</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-6 text-white">Our Products</h4>
              <ul className="space-y-3 text-gray-400 text-sm">
                <li><button onClick={scrollToProducts} className="hover:text-amber-400 transition-colors text-left">Groundnut & Peanut</button></li>
                <li><button onClick={scrollToProducts} className="hover:text-amber-400 transition-colors text-left">Coriander & Cumin</button></li>
                <li><button onClick={scrollToProducts} className="hover:text-amber-400 transition-colors text-left">Sesame Seeds</button></li>
                <li><button onClick={scrollToProducts} className="hover:text-amber-400 transition-colors text-left">Chickpeas & Mung</button></li>
                <li><button onClick={scrollToProducts} className="hover:text-amber-400 transition-colors text-left">Wheat</button></li>
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
