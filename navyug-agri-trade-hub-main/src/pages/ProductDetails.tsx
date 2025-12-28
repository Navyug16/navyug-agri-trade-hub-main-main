import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Check, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
// import { products } from '@/data/products'; // Removed static
import { db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import InquiryDialog from '@/components/InquiryDialog';
import Footer from '@/components/Footer';

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
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="container mx-auto px-4">
                <Link to="/products" className="inline-flex items-center text-gray-600 hover:text-amber-600 mb-8 transition-colors">
                    <ArrowLeft className="mr-2 h-5 w-5" />
                    Back to Products
                </Link>

                <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
                    <div className="grid md:grid-cols-2 gap-0">
                        <div className="relative h-96 md:h-auto bg-gray-100">
                            <img
                                src={product.image}
                                alt={product.name}
                                className="w-full h-full object-cover"
                            />
                        </div>

                        <div className="p-8 md:p-12">
                            <div className="flex items-center gap-3 mb-4">
                                <h1 className="text-4xl font-bold text-gray-900">{product.name}</h1>
                                <span className="px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-sm font-medium">
                                    {product.type}
                                </span>
                            </div>
                            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                                {product.longDescription}
                            </p>

                            <div className="mb-8">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Available Varieties</h3>
                                <div className="flex flex-wrap gap-2">
                                    {product.varieties.map((variety: string, index: number) => (
                                        <span key={index} className="px-4 py-2 bg-gray-100 text-gray-800 rounded-lg text-sm font-medium border border-gray-200">
                                            {variety}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            <div className="mb-8">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Key Features</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    {product.features.map((feature: string, index: number) => (
                                        <div key={index} className="flex items-center text-gray-700">
                                            <Check className="h-5 w-5 text-amber-600 mr-2" />
                                            {feature}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="mb-8">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Specifications</h3>
                                <div className="bg-gray-50 rounded-xl p-6">
                                    <div className="grid gap-4">
                                        {Object.entries(product.specifications).map(([key, value]) => (
                                            <div key={key} className="flex justify-between border-b border-gray-200 pb-2 last:border-0 last:pb-0">
                                                <span className="font-medium text-gray-600">{key}</span>
                                                <span className="text-gray-900 font-semibold">{value as string}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <Button
                                size="lg"
                                className="w-full bg-amber-600 hover:bg-amber-700 text-white text-lg py-6"
                                onClick={handleInquire}
                            >
                                <ShoppingCart className="mr-2 h-6 w-6" />
                                Inquire About This Product
                            </Button>
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
