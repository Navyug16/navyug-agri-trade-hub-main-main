
import React, { useEffect, useState } from 'react';
import { db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";
import { Link, useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, ArrowRight } from 'lucide-react';

interface Blog {
    id: string;
    title: string;
    excerpt: string;
    image: string;
    created_at: any;
}

const BlogSection = () => {
    const [blogs, setBlogs] = useState<Blog[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchBlogs = async () => {
            try {
                // Fetch first 3 blogs (client side limit slightly inefficient if thousands, but okay for start)
                const querySnapshot = await getDocs(collection(db, "blogs"));
                const fetchedBlogs: Blog[] = [];
                querySnapshot.forEach((doc) => {
                    fetchedBlogs.push({ id: doc.id, ...doc.data() } as Blog);
                });

                fetchedBlogs.sort((a, b) => {
                    const dateA = a.created_at?.toDate ? a.created_at.toDate() : new Date(a.created_at);
                    const dateB = b.created_at?.toDate ? b.created_at.toDate() : new Date(b.created_at);
                    return dateB.getTime() - dateA.getTime();
                });

                setBlogs(fetchedBlogs.slice(0, 3));
            } catch (error) {
                console.error("Error fetching blogs for home:", error);
            }
        };

        fetchBlogs();
    }, []);

    if (blogs.length === 0) return null; // Don't show if no blogs

    return (
        <section className="py-20 bg-gray-50">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                    <h2 className="text-4xl font-bold text-gray-900 mb-4">Latest Insights</h2>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                        News, updates, and stories from the world of agriculture.
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {blogs.map((blog) => (
                        <Card key={blog.id} className="overflow-hidden hover:shadow-xl transition-all duration-300 border-0 shadow-sm flex flex-col group h-full">
                            <div className="relative overflow-hidden h-48">
                                <img
                                    src={blog.image || "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?q=80&w=2670&auto=format&fit=crop"}
                                    alt={blog.title}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                            </div>
                            <CardContent className="p-6 flex-1 flex flex-col">
                                <div className="flex items-center text-sm text-gray-500 mb-3">
                                    <Calendar className="w-4 h-4 mr-2 text-amber-600" />
                                    {blog.created_at?.toDate
                                        ? blog.created_at.toDate().toLocaleDateString()
                                        : new Date(blog.created_at).toLocaleDateString()}
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-amber-600 transition-colors line-clamp-2">
                                    {blog.title}
                                </h3>
                                <p className="text-gray-600 mb-4 line-clamp-2 text-sm">
                                    {blog.excerpt}
                                </p>
                                <Button
                                    variant="link"
                                    className="p-0 h-auto text-amber-600 font-semibold mt-auto self-start"
                                    onClick={() => navigate(`/blog/${blog.id}`)}
                                >
                                    Read More <ArrowRight className="ml-1 h-3 w-3" />
                                </Button>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                <div className="text-center mt-12">
                    <Button
                        size="lg"
                        variant="outline"
                        className="rounded-full border-amber-600 text-amber-600 hover:bg-amber-50"
                        onClick={() => navigate('/blog')}
                    >
                        View All Articles
                    </Button>
                </div>
            </div>
        </section>
    );
};

export default BlogSection;
