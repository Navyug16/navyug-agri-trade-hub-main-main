import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from "@/hooks/use-toast";
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp, getDocs, query, orderBy } from "firebase/firestore";
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
  const [availableProducts, setAvailableProducts] = useState<string[]>([]);

  React.useEffect(() => {
    const fetchProducts = async () => {
      try {
        const q = query(collection(db, "products"), orderBy("name"));
        const querySnapshot = await getDocs(q);
        const products = querySnapshot.docs.map(doc => doc.data().name);
        setAvailableProducts(products);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
    fetchProducts();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
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
      const adminEmail = 'navyugenterprise2003@gmail.com';
      // ---------------------------------------------------------
      // EmailJS Template IDs
      // ---------------------------------------------------------
      const ADMIN_TEMPLATE_ID = 'template_mv2fuil';
      const USER_THANK_YOU_TEMPLATE_ID = 'template_u7suhcr';
      // ---------------------------------------------------------

      try {
        // 1. Send Admin Notification
        await sendEmail({
          to_email: adminEmail,
          to_name: 'Admin',
          from_name: formSnapshot.name,
          reply_to: formSnapshot.email,
          subject: `New Inquiry: ${formSnapshot.subject}`,
          message: `NEW WEBSITE INQUIRY\n\nName: ${formSnapshot.name}\nPhone: ${formSnapshot.phone}\nEmail: ${formSnapshot.email}\nProduct: ${formSnapshot.subject}\nQuantity: ${formSnapshot.quantity}\n\nMessage:\n${formSnapshot.message}\n\nTime: ${new Date().toLocaleString()}`,
          template_id: ADMIN_TEMPLATE_ID
        });

        // 2. Send Thank You Email to User
        if (formSnapshot.email) {
          await sendEmail({
            to_email: formSnapshot.email,
            to_name: formSnapshot.name,
            from_name: 'Navyug Enterprise',
            reply_to: 'navyugenterprise2003@gmail.com',
            subject: `Thank you for contacting Navyug Enterprise`,
            message: `Dear ${formSnapshot.name},\n\nThank you for your inquiry about ${formSnapshot.subject}.\n\nWe have received your message and our team will get back to you shortly.\n\nBest Regards,\nNavyug Enterprise Team`,
            template_id: USER_THANK_YOU_TEMPLATE_ID
          });
        }
      } catch (emailError) {
        console.error("Failed to send notifications:", emailError);
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
              pattern="[0-9]{10,}"
              title="Please enter a valid phone number (digits only)"
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
          <select
            name="subject"
            value={formData.subject}
            onChange={handleInputChange}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white"
          >
            <option value="" disabled>Select an option</option>
            <optgroup label="General">
              <option value="Meeting Request">Meeting Request</option>
              <option value="General Inquiry">General Inquiry</option>
            </optgroup>
            <optgroup label="Products">
              {availableProducts.map((product) => (
                <option key={product} value={product}>
                  {product}
                </option>
              ))}
            </optgroup>
          </select>
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
