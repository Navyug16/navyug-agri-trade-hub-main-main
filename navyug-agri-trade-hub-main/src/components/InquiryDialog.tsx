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
import ThankYouPopup from './ThankYouPopup';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

const COUNTRY_CODES = [
    { code: "+91", country: "IN" },
    { code: "+1", country: "US" },
    { code: "+44", country: "UK" },
    { code: "+971", country: "UAE" },
    { code: "+61", country: "AU" },
    { code: "+65", country: "SG" },
    { code: "+86", country: "CN" },
    { code: "+81", country: "JP" },
    { code: "+49", country: "DE" },
    { code: "+33", country: "FR" },
];

interface InquiryDialogProps {
    isOpen: boolean;
    onClose: () => void;
    productName?: string;
}

const InquiryDialog: React.FC<InquiryDialogProps> = ({ isOpen, onClose, productName }) => {
    const { toast } = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showThankYou, setShowThankYou] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        countryCode: '+91',
        product: productName || '',
        message: ''
    });

    useEffect(() => {
        if (productName) {
            setFormData(prev => ({ ...prev, product: productName }));
        }
    }, [productName]);

    // Reset state when dialog opens
    useEffect(() => {
        if (isOpen) {
            setShowThankYou(false);
            // Optional: Reset form fields? The user might want to persist if they accidentally closed.
            // But usually reset is safer to avoid stale data.
            // setFormData({ ... }) - keeping existing behavior for now, just resetting showThankYou
        }
    }, [isOpen]);


    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleCountryChange = (value: string) => {
        setFormData(prev => ({ ...prev, countryCode: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const fullPhone = `${formData.countryCode} ${formData.phone}`;

            await addDoc(collection(db, "inquiries"), {
                name: formData.name,
                email: formData.email,
                phone: fullPhone,
                product_interest: formData.product,
                message: formData.message,
                status: 'pending',
                created_at: serverTimestamp()
            });

            // Show Thank You Popup state instead of closing
            setShowThankYou(true);
            setFormData({ name: '', email: '', phone: '', countryCode: '+91', product: '', message: '' });

            // Optional: Backup toast
            // toast({ ... }); 
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

    if (showThankYou) {
        return <ThankYouPopup isOpen={isOpen} onClose={onClose} />;
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            {/* ... Existing Dialog Content ... */}
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
                            <div className="flex gap-2">
                                <Select
                                    value={formData.countryCode}
                                    onValueChange={handleCountryChange}
                                >
                                    <SelectTrigger className="w-[110px]">
                                        <SelectValue placeholder="Code" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {COUNTRY_CODES.map((country) => (
                                            <SelectItem key={country.code} value={country.code}>
                                                {country.code} ({country.country})
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <Input
                                    id="phone"
                                    name="phone"
                                    type="tel"
                                    value={formData.phone}
                                    onChange={handleInputChange}
                                    placeholder="9876543210"
                                    pattern="[0-9]{5,15}"
                                    className="flex-1"
                                />
                            </div>
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
