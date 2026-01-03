import React, { useEffect, useState } from 'react';
import { db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";
import { resolveImagePath } from '@/lib/utils';
import { useNavigate, Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ShoppingCart } from 'lucide-react';
import Footer from '@/components/Footer';
import Header from '@/components/Header';

const Products = () => {
    const navigate = useNavigate();
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState("All");

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

    // Extract unique categories
    const categories = ["All", ...Array.from(new Set(products.map(p => p.type))).filter(Boolean)];

    // Filter products
    const filteredProducts = selectedCategory === "All"
        ? products
        : products.filter(p => p.type === selectedCategory);

    return (
        <div className="min-h-screen bg-white">
            <Header />

            <main className="container mx-auto px-4 py-12">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">All Products</h1>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                        Explore our complete range of premium agricultural products.
                    </p>
                </div>

                {/* Category Filter */}
                {!loading && (
                    <div className="flex justify-center flex-wrap gap-2 mb-10 sticky top-24 z-40 bg-white/80 backdrop-blur-sm p-4 rounded-xl shadow-sm border border-gray-100">
                        {categories.map((category) => (
                            <Button
                                key={category}
                                variant={selectedCategory === category ? "default" : "outline"}
                                className={`rounded-full px-6 capitalize ${selectedCategory === category ? 'bg-amber-600 hover:bg-amber-700' : 'text-gray-600 border-gray-300 hover:border-amber-600 hover:text-amber-600'}`}
                                onClick={() => setSelectedCategory(category)}
                            >
                                {category}
                            </Button>
                        ))}
                    </div>
                )}

                {loading ? (
                    <div className="flex justify-center py-20">Loading products...</div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                        {filteredProducts.map((product) => (
                            <Card key={product.id} className="overflow-hidden hover:shadow-xl transition-all duration-300 group relative border-0 shadow-md h-full flex flex-col">
                                <div className="relative overflow-hidden h-56">
                                    <img
                                        src={resolveImagePath(product.image)}
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
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className="text-xl font-semibold text-gray-900 group-hover:text-amber-600 transition-colors">{product.name}</h3>
                                        <span className="bg-amber-100 text-amber-800 text-xs px-2 py-1 rounded-full font-medium">{product.type}</span>
                                    </div>
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
            <Footer />
        </div>
    );
};

export default Products;
