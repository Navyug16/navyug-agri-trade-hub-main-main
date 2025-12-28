import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from "@/hooks/use-toast";
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { sendEmail } from "@/lib/emailService";

// ... imports
import ThankYouPopup from './ThankYouPopup';

const ContactForm = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showThankYou, setShowThankYou] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '', // This acts as "Product"
    quantity: '',
    message: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Saving to Firestore in the requested structure
      await addDoc(collection(db, "inquiries"), {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        product_interest: formData.subject, // Keeping internal name consistent, but it is the "product"
        quantity: formData.quantity,
        message: formData.message,
        status: 'pending',
        created_at: serverTimestamp(),
        time_string: new Date().toLocaleString() // Formatting requirement
      });

      // Send Notification to Admin
      // Note: We use the same 'sendEmail' function but direct it to the Admin.
      // Ideally, we would have a separate 'Notification' template, but we can reuse the generic one 
      // if we format the 'message' field to contain all the details.

      const adminEmail = 'navyugenterprise2003@gmail.com'; // Primary Admin Email

      await sendEmail({
        to_email: adminEmail,
        to_name: 'Admin',
        from_name: formData.name,
        reply_to: formData.email,
        subject: `New Inquiry: ${formData.subject}`,
        message: `NEW WEBSITE INQUIRY\n\nName: ${formData.name}\nPhone: ${formData.phone}\nEmail: ${formData.email}\nProduct: ${formData.subject}\nQuantity: ${formData.quantity}\n\nMessage:\n${formData.message}\n\nTime: ${new Date().toLocaleString()}`
      });

      // Show Thank You Popup
      setShowThankYou(true);

      // Also show toast as a fallback/notification
      toast({
        title: "Message Sent",
        description: "We've received your message and will get back to you soon.",
      });

      setFormData({ name: '', email: '', phone: '', subject: '', quantity: '', message: '' });
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
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              placeholder="+91 98765 43210"
            />
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
            <label className="block text-sm font-medium text-gray-700 mb-2">Quantity (Approx)</label>
            <input
              type="text"
              name="quantity"
              value={formData.quantity}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              placeholder="e.g. 50 Tons"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Product / Subject</label>
          <input
            type="text"
            name="subject"
            value={formData.subject}
            onChange={handleInputChange}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            placeholder="Product Name or Inquiry Subject"
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
      </form>
      <ThankYouPopup isOpen={showThankYou} onClose={() => setShowThankYou(false)} />
    </>
  );
};

export default ContactForm;
