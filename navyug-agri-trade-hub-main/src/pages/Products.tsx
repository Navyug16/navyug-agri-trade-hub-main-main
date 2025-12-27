import React, { useEffect, useState } from 'react';
import { db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";
import { useNavigate, Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ShoppingCart } from 'lucide-react';

const Products = () => {
    const navigate = useNavigate();
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        window.scrollTo(0, 0);
        const fetchProducts = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, "products"));
                const fetched: any[] = [];
                querySnapshot.forEach((doc) => {
                    fetched.push({ id: doc.id, ...doc.data() });
                });

                // Sort by 'order' field if available, else by default
                fetched.sort((a: any, b: any) => {
                    const orderA = a.order ?? 9999;
                    const orderB = b.order ?? 9999;
                    return orderA - orderB;
                });

                setProducts(fetched);
            } catch (error) {
                console.error("Error fetching products:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
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
                                src="/lovable-uploads/ef1bc6e7-7b27-4e12-8ef2-bcf775af4873.png"
                                alt="NAVYUG ENTERPRISE Logo"
                                className="w-12 h-12 object-contain"
                            />
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">NAVYUG ENTERPRISE</h1>
                                <p className="text-sm text-gray-600">Quality Agricultural Products</p>
                            </div>
                        </div>
                        <nav className="hidden md:flex space-x-8">
                            <Link to="/" className="text-gray-700 hover:text-amber-600 transition-colors">Home</Link>
                            <Link to="/about" className="text-gray-700 hover:text-amber-600 transition-colors">About</Link>
                            <Link to="/products" className="text-amber-600 font-semibold transition-colors">Products</Link>
                            <a href="/#contact" className="text-gray-700 hover:text-amber-600 transition-colors">Contact</a>
                        </nav>
                    </div>
                </div>
            </header>

            <main className="container mx-auto px-4 py-12">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">All Products</h1>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                        Explore our complete range of premium agricultural products.
                    </p>
                </div>

                {loading ? (
                    <div className="flex justify-center py-20">Loading products...</div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                        {products.map((product) => (
                            <Card key={product.id} className="overflow-hidden hover:shadow-xl transition-all duration-300 group relative border-0 shadow-md h-full flex flex-col">
                                <div className="relative overflow-hidden h-56">
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
                                <CardContent className="p-6 flex-1 flex flex-col">
                                    <h3 className="text-xl font-semibold mb-2 text-gray-900 group-hover:text-amber-600 transition-colors">{product.name}</h3>
                                    <p className="text-gray-600 text-sm mb-4 line-clamp-2 flex-1">
                                        {product.description}
                                    </p>
                                    <Button
                                        onClick={() => navigate(`/product/${product.id}`)}
                                        className="w-full bg-amber-600 hover:bg-amber-700 text-white mt-auto"
                                    >
                                        <ShoppingCart className="mr-2 h-4 w-4" />
                                        View Details
                                    </Button>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
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
        </div>
    );
};

export default Products;
