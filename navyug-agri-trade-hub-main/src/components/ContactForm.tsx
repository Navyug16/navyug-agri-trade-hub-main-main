import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from "@/hooks/use-toast";
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { sendEmail } from "@/lib/emailService";
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

      // Show Thank You Popup immediately after saving to DB
      setShowThankYou(true);

      const formSnapshot = { ...formData }; // Capture for email
      setFormData({ name: '', email: '', phone: '', subject: '', quantity: '', message: '' });

      // Send Notification to Admin
      // Non-blocking try-catch to ensure UI feedback is shown even if email fails
      const adminEmail = 'navyugenterprise2003@gmail.com'; // Primary Admin Email

      try {
        await sendEmail({
          to_email: adminEmail,
          to_name: 'Admin',
          from_name: formSnapshot.name,
          reply_to: formSnapshot.email,
          subject: `New Inquiry: ${formSnapshot.subject}`,
          message: `NEW WEBSITE INQUIRY\n\nName: ${formSnapshot.name}\nPhone: ${formSnapshot.phone}\nEmail: ${formSnapshot.email}\nProduct: ${formSnapshot.subject}\nQuantity: ${formSnapshot.quantity}\n\nMessage:\n${formSnapshot.message}\n\nTime: ${new Date().toLocaleString()}`
        });
      } catch (emailError) {
        console.error("Failed to send admin notification:", emailError);
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
