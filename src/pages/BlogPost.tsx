
import React, { useEffect, useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Calendar, User, ArrowLeft, Clock } from 'lucide-react';
import { format } from 'date-fns';

interface Blog {
    id: string;
    title: string;
    excerpt: string;
    content: string;
    image: string;
    author: string;
    created_at: any;
}

const BlogPost = () => {
    const { id } = useParams<{ id: string }>();
    const [blog, setBlog] = useState<Blog | null>(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        window.scrollTo(0, 0);
        const fetchBlog = async () => {
            if (!id) return;
            try {
                const docRef = doc(db, "blogs", id);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    const blogData = { id: docSnap.id, ...docSnap.data() } as Blog;
                    setBlog(blogData);
                    document.title = `${blogData.title} | Navyug Enterprise`;
                } else {
                    console.log("No such document!");
                }
            } catch (error) {
                console.error("Error fetching blog:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchBlog();
    }, [id]);

    useEffect(() => {
        if (!blog) return;

        // Update Title
        document.title = `${blog.title} | Navyug Enterprise`;

        // Helper to update or create meta tags
        const updateMeta = (name: string, content: string, isProperty: boolean = false) => {
            const attr = isProperty ? 'property' : 'name';
            let element = document.querySelector(`meta[${attr}='${name}']`);
            if (!element) {
                element = document.createElement('meta');
                element.setAttribute(attr, name);
                document.head.appendChild(element);
            }
            element.setAttribute('content', content);
        };

        // Update Meta Tags
        const description = blog.excerpt || blog.content.substring(0, 150) + '...';
        updateMeta('description', description);
        updateMeta('og:title', blog.title, true);
        updateMeta('og:description', description, true);
        if (blog.image) {
            updateMeta('og:image', blog.image, true);
        }

        // Cleanup (optional: reset to default on unmount, but often not necessary in this flow)
        return () => {
            document.title = 'Navyug Enterprise';
        };
    }, [blog]);
    const formatDate = (date: any) => {
        if (!date) return '';
        const d = date.toDate ? date.toDate() : new Date(date);
        return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-white">
                <Header />
                <div className="flex justify-center items-center h-[60vh]">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
                </div>
                <Footer />
            </div>
        );
    }

    if (!blog) {
        return (
            <div className="min-h-screen bg-white">
                <Header />
                <div className="container mx-auto px-4 py-20 text-center">
                    <h1 className="text-3xl font-bold text-gray-900 mb-4">Blog Post Not Found</h1>
                    <Button onClick={() => navigate('/blog')}>Back to Blogs</Button>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white">
            <Header />

            <article>
                {/* Article Header */}
                <div className="bg-amber-50 py-16">
                    <div className="container mx-auto px-4 max-w-4xl">
                        <Button
                            variant="ghost"
                            className="mb-8 hover:bg-amber-100 -ml-4"
                            onClick={() => navigate('/blog')}
                        >
                            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Blogs
                        </Button>
                        <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                            {blog.title}
                        </h1>
                        <div className="flex flex-wrap items-center text-gray-600 gap-6">
                            <div className="flex items-center">
                                <Calendar className="w-5 h-5 mr-2 text-amber-600" />
                                {formatDate(blog.created_at)}
                            </div>
                            {blog.author && (
                                <div className="flex items-center">
                                    <User className="w-5 h-5 mr-2 text-amber-600" />
                                    {blog.author}
                                </div>
                            )}
                            <div className="flex items-center">
                                <Clock className="w-5 h-5 mr-2 text-amber-600" />
                                <span>{Math.ceil(blog.content.split(' ').length / 200)} min read</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Cover Image */}
                <div className="container mx-auto px-4 max-w-5xl -mt-12 mb-12 relative z-10">
                    <img
                        src={blog.image || "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?q=80&w=2670&auto=format&fit=crop"}
                        alt={blog.title}
                        className="w-full h-auto aspect-video object-cover rounded-2xl shadow-xl"
                    />
                </div>

                {/* Content */}
                <div className="container mx-auto px-4 max-w-3xl mb-20">
                    <div className="prose prose-lg prose-amber hover:prose-a:text-amber-600 mx-auto">
                        <p className="lead text-xl text-gray-600 font-medium mb-8 border-l-4 border-amber-500 pl-4 py-1 italic">
                            {blog.excerpt}
                        </p>
                        <div className="whitespace-pre-line text-gray-800 leading-relaxed">
                            {blog.content}
                        </div>
                    </div>

                    <div className="border-t border-gray-200 mt-12 pt-8">
                        <h4 className="font-bold text-gray-900 mb-4">Share this article:</h4>
                        <div className="flex gap-2">
                            <Button variant="outline" size="sm" onClick={() => {
                                navigator.clipboard.writeText(window.location.href);
                                alert("Link copied to clipboard!");
                            }}>
                                Copy Link
                            </Button>
                        </div>
                    </div>
                </div>
            </article>

            <Footer />
        </div>
    );
};

export default BlogPost;
