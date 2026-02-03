import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from "@/hooks/use-toast";
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp, getDocs, query, orderBy } from "firebase/firestore";
import { sendEmail } from "@/lib/emailService";
import ThankYouPopup from './ThankYouPopup';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

// Comprehensive list of major country codes
const COUNTRY_CODES = [
  { code: "+91", country: "IN" },
  { code: "+1", country: "US/CA" },
  { code: "+44", country: "UK" },
  { code: "+971", country: "UAE" },
  { code: "+61", country: "AU" },
  { code: "+65", country: "SG" },
  { code: "+86", country: "CN" },
  { code: "+81", country: "JP" },
  { code: "+49", country: "DE" },
  { code: "+33", country: "FR" },
  { code: "+39", country: "IT" },
  { code: "+7", country: "RU" },
  { code: "+34", country: "ES" },
  { code: "+55", country: "BR" },
  { code: "+966", country: "SA" },
  { code: "+27", country: "ZA" },
  { code: "+60", country: "MY" },
  { code: "+62", country: "ID" },
  { code: "+20", country: "EG" },
  { code: "+90", country: "TR" },
];

const ContactForm = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showThankYou, setShowThankYou] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    countryCode: '+91',
    subject: '', // This acts as "Product"
    quantity: '',
    message: ''
  });


  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
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

      // Saving to Firestore in the requested structure
      await addDoc(collection(db, "inquiries"), {
        name: formData.name,
        email: formData.email,
        phone: fullPhone,
        product_interest: formData.subject, // Keeping internal name consistent, but it is the "product"
        quantity: formData.quantity,
        message: formData.message,
        status: 'pending',
        created_at: serverTimestamp(),
        time_string: new Date().toLocaleString() // Formatting requirement
      });

      // Show Thank You Popup immediately after saving to DB
      setShowThankYou(true);

      const formSnapshot = { ...formData, phone: fullPhone }; // Capture for email
      setFormData({ name: '', email: '', phone: '', countryCode: '+91', subject: '', quantity: '', message: '' });

      // Send Notification to Admin
      const adminEmail = 'navyugmgalani@gmail.com';
      // ---------------------------------------------------------
      // EmailJS Template IDs
      // ---------------------------------------------------------
      const ADMIN_TEMPLATE_ID = 'template_AN';
      const USER_THANK_YOU_TEMPLATE_ID = 'template_UTY';
      // ---------------------------------------------------------

      // 1. Send Admin Notification
      const adminResponse = await sendEmail({
        to_email: adminEmail,
        to_name: 'Admin',
        from_name: formSnapshot.name,
        reply_to: formSnapshot.email,
        subject: `New Inquiry: ${formSnapshot.subject}`,
        message: `NEW WEBSITE INQUIRY\n\nName: ${formSnapshot.name}\nPhone: ${formSnapshot.phone}\nEmail: ${formSnapshot.email}\nProduct: ${formSnapshot.subject}\nQuantity: ${formSnapshot.quantity}\n\nMessage:\n${formSnapshot.message}\n\nTime: ${new Date().toLocaleString()}`,
        template_id: ADMIN_TEMPLATE_ID
      });

      if (!adminResponse.success) {
        console.error("Failed to send Admin Notification:", adminResponse.error);
      }

      // 2. Send Thank You Email to User
      if (formSnapshot.email) {
        const userResponse = await sendEmail({
          to_email: formSnapshot.email,
          to_name: formSnapshot.name,
          from_name: 'Navyug Enterprise',
          reply_to: 'navyugenterprise2003@gmail.com',
          subject: `Thank you for contacting Navyug Enterprise`,
          message: `Dear ${formSnapshot.name},\n\nThank you for your inquiry about ${formSnapshot.subject}.\n\nWe have received your message and our team will get back to you shortly.\n\nBest Regards,\nNavyug Enterprise Team`,
          template_id: USER_THANK_YOU_TEMPLATE_ID
        });

        if (!userResponse.success) {
          console.error("Failed to send User Thank You Email:", userResponse.error);
        }
      }

      toast({
        title: "Message Sent",
        description: "We've received your message and will get back to you soon.",
      });

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

  return (
    <>
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
            <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
            <div className="flex w-full border border-gray-300 rounded-lg focus-within:ring-2 focus-within:ring-amber-500 focus-within:border-transparent overflow-hidden bg-white">
              <Select
                value={formData.countryCode}
                onValueChange={handleCountryChange}
              >
                <SelectTrigger className="w-[90px] px-3 py-3 h-auto border-0 rounded-none bg-transparent focus:ring-0 focus:ring-offset-0 border-r border-gray-200">
                  <span className="truncate">{formData.countryCode}</span>
                </SelectTrigger>
                <SelectContent>
                  {COUNTRY_CODES.map((country) => (
                    <SelectItem key={country.code} value={country.code}>
                      {country.code} ({country.country})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                required
                pattern="[0-9]{5,15}"
                title="Please enter a valid phone number (digits only)"
                className="flex-1 px-4 py-3 border-0 focus:ring-0 focus:outline-none min-w-0"
                placeholder="98765 43210"
              />
            </div>
          </div>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
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

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Quantity (Kg/Tons)</label>
            <input
              type="number"
              name="quantity"
              value={formData.quantity}
              onChange={handleInputChange}
              required
              min="1"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              placeholder="e.g. 50"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Purpose / Product</label>
          <input
            type="text"
            name="subject"
            value={formData.subject}
            onChange={handleInputChange}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            placeholder="e.g. Groundnut Oil or General Inquiry"
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
      </form >
      <ThankYouPopup isOpen={showThankYou} onClose={() => setShowThankYou(false)} />
    </>
  );
};

export default ContactForm;
