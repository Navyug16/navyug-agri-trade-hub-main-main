import React, { useState, useEffect } from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { Loader2 } from "lucide-react";

interface InquiryDialogProps {
    isOpen: boolean;
    onClose: () => void;
    productName?: string;
}

const InquiryDialog: React.FC<InquiryDialogProps> = ({ isOpen, onClose, productName }) => {
    const { toast } = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        product: productName || '',
        message: ''
    });

    useEffect(() => {
        if (productName) {
            setFormData(prev => ({ ...prev, product: productName }));
        }
    }, [productName]);

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
                phone: formData.phone,
                product_interest: formData.product,
                message: formData.message,
                status: 'pending',
                created_at: serverTimestamp()
            });

            toast({
                title: "Inquiry Sent",
                description: "We've received your inquiry and will get back to you soon.",
            });

            setFormData({ name: '', email: '', phone: '', product: '', message: '' });
            onClose();
        } catch (error) {
            console.error('Error sending message:', error);
            toast({
                title: "Error",
                description: "Failed to send inquiry. Please try again.",
                variant: "destructive"
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Product Inquiry</DialogTitle>
                    <DialogDescription>
                        Fill out the form below to inquire about <span className="font-semibold text-amber-600">{productName}</span>.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input
                            id="name"
                            name="name"
                            required
                            value={formData.name}
                            onChange={handleInputChange}
                            placeholder="e.g. John Doe"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">Email Address</Label>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                required
                                value={formData.email}
                                onChange={handleInputChange}
                                placeholder="john@example.com"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="phone">Phone Number</Label>
                            <Input
                                id="phone"
                                name="phone"
                                type="tel"
                                value={formData.phone}
                                onChange={handleInputChange}
                                placeholder="+91 9876543210"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="product">Product of Interest</Label>
                        <Input
                            id="product"
                            name="product"
                            required
                            value={formData.product}
                            onChange={handleInputChange}
                            placeholder="Product Name"
                            readOnly={!!productName} // Read-only if pre-filled from product page
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="message">Message</Label>
                        <Textarea
                            id="message"
                            name="message"
                            required
                            value={formData.message}
                            onChange={handleInputChange}
                            placeholder="I'm interested in bulk ordering this product..."
                            className="min-h-[100px]"
                        />
                    </div>

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
                        <Button type="submit" className="bg-amber-600 hover:bg-amber-700" disabled={isSubmitting}>
                            {isSubmitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Sending...</> : 'Send Inquiry'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default InquiryDialog;
