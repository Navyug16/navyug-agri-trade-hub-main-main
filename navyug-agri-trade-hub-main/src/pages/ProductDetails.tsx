import { resolveImagePath } from '@/lib/utils';
import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Check, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
// import { products } from '@/data/products'; // Removed static
import { db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import InquiryDialog from '@/components/InquiryDialog';
import Footer from '@/components/Footer';
import Header from '@/components/Header';

const ProductDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    const [isInquiryOpen, setIsInquiryOpen] = useState(false);

    useEffect(() => {
        const fetchProduct = async () => {
            if (!id) return;
            try {
                const docRef = doc(db, "products", id);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    setProduct({ id: docSnap.id, ...docSnap.data() });
                }
            } catch (error) {
                console.error("Error fetching product:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchProduct();
        window.scrollTo(0, 0);
    }, [id]);

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
    }

    if (!product) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
                <h1 className="text-3xl font-bold text-gray-900 mb-4">Product Not Found</h1>
                <Link to="/">
                    <Button>Back to Home</Button>
                </Link>
            </div>
        );
    }

    const handleInquire = () => {
        setIsInquiryOpen(true);
    };

    return (
        <div className="min-h-screen bg-white">
            <Header />

            <div className="min-h-screen bg-gray-50 py-12">
                <div className="container mx-auto px-4">
                    <Link to="/products" className="inline-flex items-center text-gray-600 hover:text-amber-600 mb-8 transition-colors">
                        <ArrowLeft className="mr-2 h-5 w-5" />
                        Back to Products
                    </Link>

                    <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
                        <div className="grid md:grid-cols-2 gap-0">
                            <div className="relative h-96 md:h-full md:min-h-[600px] bg-white flex items-center justify-center border-r border-gray-100">
                                <img
                                    src={resolveImagePath(product.image)}
                                    alt={product.name}
                                    className="w-full h-full object-cover"
                                />
                            </div>

                            <div className="p-8 md:p-12 flex flex-col justify-center">
                                <div className="space-y-6">
                                    <div className="flex items-center gap-3">
                                        <h1 className="text-4xl font-bold text-gray-900">{product.name}</h1>
                                        <span className="px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-sm font-medium">
                                            {product.type}
                                        </span>
                                    </div>

                                    <p className="text-xl text-gray-600 leading-relaxed">
                                        {product.description}
                                    </p>

                                    <div className="mt-8 border-t pt-8 space-y-10">

                                        {/* Detailed Description */}
                                        <div className="space-y-4">
                                            <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                                                Detailed Description
                                            </h3>
                                            <p className="text-gray-600 leading-relaxed text-base">
                                                {product.longDescription || product.description}
                                            </p>
                                        </div>

                                        {/* Specifications */}
                                        <div className="space-y-4">
                                            <h3 className="text-xl font-bold text-gray-900">Specifications</h3>
                                            <div className="bg-gray-50 rounded-xl p-5 border border-gray-100">
                                                <div className="grid gap-3">
                                                    {product.specifications && Object.entries(product.specifications).map(([key, value]) => (
                                                        <div key={key} className="flex justify-between border-b border-gray-200 pb-2 last:border-0 last:pb-0">
                                                            <span className="font-medium text-gray-600">{key}</span>
                                                            <span className="text-gray-900 font-semibold text-right pl-4">{value as string}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Features & Varieties */}
                                        <div className="space-y-6">
                                            <div>
                                                <h3 className="text-xl font-bold text-gray-900 mb-4">Key Features</h3>
                                                <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                    {product.features?.map((feature: string, index: number) => (
                                                        <li key={index} className="flex items-start text-gray-600 bg-gray-50 p-3 rounded-lg border border-gray-100">
                                                            <Check className="h-5 w-5 text-amber-600 mr-2 mt-0.5 shrink-0" />
                                                            <span className="leading-snug">{feature}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>

                                            {product.varieties && product.varieties.length > 0 && (
                                                <div>
                                                    <h3 className="text-xl font-bold text-gray-900 mb-4">Available Varieties</h3>
                                                    <div className="flex flex-wrap gap-2">
                                                        {product.varieties.map((variety: string, index: number) => (
                                                            <span key={index} className="px-4 py-2 bg-amber-50 text-amber-900 rounded-lg text-sm font-medium border border-amber-100">
                                                                {variety}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="mt-8">
                                        <Button
                                            size="lg"
                                            className="w-full bg-amber-600 hover:bg-amber-700 text-white text-lg py-6 shadow-lg shadow-amber-200"
                                            onClick={handleInquire}
                                        >
                                            <ShoppingCart className="mr-2 h-6 w-6" />
                                            Inquire Now
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <InquiryDialog
                isOpen={isInquiryOpen}
                onClose={() => setIsInquiryOpen(false)}
                productName={product.name}
            />
            <Footer />
        </div>
    );
};

export default ProductDetails;
