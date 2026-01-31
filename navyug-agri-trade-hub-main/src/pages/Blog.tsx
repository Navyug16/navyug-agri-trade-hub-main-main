
import React, { useEffect, useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";
import { Link, useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, User, ArrowRight } from 'lucide-react';

interface Blog {
    id: string;
    title: string;
    excerpt: string;
    content: string;
    image: string;
    author: string;
    created_at: any;
}

const Blog = () => {
    const [blogs, setBlogs] = useState<Blog[]>([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        window.scrollTo(0, 0);
        const fetchBlogs = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, "blogs"));
                const fetchedBlogs: Blog[] = [];
                querySnapshot.forEach((doc) => {
                    fetchedBlogs.push({ id: doc.id, ...doc.data() } as Blog);
                });

                // Sort by date descending
                fetchedBlogs.sort((a, b) => {
                    const dateA = a.created_at?.toDate ? a.created_at.toDate() : new Date(a.created_at);
                    const dateB = b.created_at?.toDate ? b.created_at.toDate() : new Date(b.created_at);
                    return dateB.getTime() - dateA.getTime();
                });

                setBlogs(fetchedBlogs);
            } catch (error) {
                console.error("Error fetching blogs:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchBlogs();
    }, []);

    const formatDate = (date: any) => {
        if (!date) return '';
        const d = date.toDate ? date.toDate() : new Date(date);
        return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    };

    useEffect(() => {
        document.title = "Navyug Enterprise - Mandi Pulse: Insights into Indian Agriculture & Market Trends";
        const metaDescription = document.querySelector('meta[name="description"]');
        if (metaDescription) {
            metaDescription.setAttribute('content', "Stay updated with the latest market trends, daily Mandi Bhav (prices) from Gujarat APMCs, and expert tips on agricultural sourcing and tech-driven farming from Navyug Enterprise.");
        } else {
            const meta = document.createElement('meta');
            meta.name = "description";
            meta.content = "Stay updated with the latest market trends, daily Mandi Bhav (prices) from Gujarat APMCs, and expert tips on agricultural sourcing and tech-driven farming from Navyug Enterprise.";
            document.head.appendChild(meta);
        }
    }, []);

    return (
        <div className="min-h-screen bg-white">
            <Header />

            {/* Hero Section */}
            <section className="bg-amber-50 py-16 md:py-24">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Mandi Pulse: Insights into Indian Agriculture & Market Trends</h1>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                        Expert Analysis, Daily Mandi Bhav, and Agri-Tech Innovations.
                    </p>
                </div>
            </section>

            <main className="container mx-auto px-4 py-16">
                {loading ? (
                    <div className="flex justify-center items-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
                    </div>
                ) : blogs.length > 0 ? (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {blogs.map((blog) => (
                            <Card key={blog.id} className="overflow-hidden hover:shadow-xl transition-all duration-300 border-0 shadow-md flex flex-col h-full group">
                                <div className="relative overflow-hidden h-56">
                                    <img
                                        src={blog.image || "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?q=80&w=2670&auto=format&fit=crop"}
                                        alt={blog.title}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                </div>
                                <CardContent className="p-6 flex-1 flex flex-col">
                                    <div className="flex items-center text-sm text-gray-500 mb-4 space-x-4">
                                        <div className="flex items-center">
                                            <Calendar className="w-4 h-4 mr-1 text-amber-600" />
                                            {formatDate(blog.created_at)}
                                        </div>
                                        {blog.author && (
                                            <div className="flex items-center">
                                                <User className="w-4 h-4 mr-1 text-amber-600" />
                                                {blog.author}
                                            </div>
                                        )}
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-amber-600 transition-colors line-clamp-2">
                                        {blog.title}
                                    </h3>
                                    <p className="text-gray-600 mb-6 line-clamp-3">
                                        {blog.excerpt}
                                    </p>
                                    <div className="mt-auto">
                                        <Button
                                            variant="ghost"
                                            className="p-0 text-amber-600 hover:text-amber-700 hover:bg-transparent font-semibold"
                                            onClick={() => navigate(`/blog/${blog.id}`)}
                                        >
                                            Read Full Article <ArrowRight className="ml-2 h-4 w-4" />
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-gray-50 rounded-2xl">
                        <h3 className="text-2xl font-semibold text-gray-900 mb-2">No blogs found</h3>
                        <p className="text-gray-600">Check back soon for our latest updates!</p>
                    </div>
                )}
            </main>

            <Footer />
        </div>
    );
};

export default Blog;
