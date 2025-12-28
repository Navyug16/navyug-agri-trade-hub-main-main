
import emailjs from '@emailjs/browser';

// These IDs should normally be in environment variables
// But for client-side demo and setup instructions, we'll keep them here or ask user to fill them
const EMAILJS_SERVICE_ID = 'Inquery';
const EMAILJS_TEMPLATE_ID = 'tamplate_etb8qb9';
const EMAILJS_PUBLIC_KEY = 'B8OxCKHew1JXcmRsG';

interface EmailData {
    to_email: string;
    to_name: string;
    from_name: string;
    reply_to: string;
    subject: string;
    message: string;
}

export const sendEmail = async (data: EmailData) => {
    try {
        // We check if the keys are placeholders
        if (EMAILJS_SERVICE_ID === 'YOUR_SERVICE_ID') {
            console.warn("EmailJS not configured yet. Returning mock success.");
            // Throw error generally, but for demo we might just simulate
            // throw new Error("EmailJS is not configured. Please add your credentials.");
            return { success: true, mocked: true };
        }

        const response = await emailjs.send(
            EMAILJS_SERVICE_ID,
            EMAILJS_TEMPLATE_ID,
            {
                to_email: data.to_email,
                to_name: data.to_name,
                from_name: data.from_name,
                reply_to: data.reply_to,
                subject: data.subject,
                message: data.message,
            },
            EMAILJS_PUBLIC_KEY
        );

        if (response.status === 200) {
            return { success: true };
        } else {
            throw new Error(`EmailJS Status: ${response.status}`);
        }
    } catch (error: any) {
        console.error("Failed to send email:", error);
        return { success: false, error: error.message || 'Unknown error' };
    }
};
