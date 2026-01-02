
import emailjs from '@emailjs/browser';

// These IDs should normally be in environment variables
// But for client-side demo and setup instructions, we'll keep them here or ask user to fill them
const EMAILJS_SERVICE_ID = 'Inquery';
const EMAILJS_TEMPLATE_ID = 'template_etb8qb9';
const EMAILJS_PUBLIC_KEY = 'B8OxCKHew1JXcmRsG';

interface EmailData {
    to_email: string;
    to_name: string;
    from_name: string;
    reply_to: string;
    subject: string;
    message: string;
    cc_email?: string;
}

export const sendEmail = async (data: EmailData) => {
    try {
        // Credentials configured. Proceeding to send.

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
                cc_email: data.cc_email, // Pass CC if available
            },
            EMAILJS_PUBLIC_KEY
        );

        if (response.status === 200) {
            return { success: true };
        } else {
            throw new Error(`EmailJS Status: ${response.status}`);
        }
    } catch (error: any) {
        console.error("FAILED to send email via EmailJS:", error);

        // Extract meaningful error message if possible
        let errorMessage = 'Unknown error occurred while sending email.';

        if (error?.text) {
            errorMessage = `EmailJS Error: ${error.text}`;
        } else if (error?.status === 400) {
            errorMessage = 'Bad Request: Verify your Service ID and Template ID.';
        } else if (error?.status === 412) {
            errorMessage = 'Precondition Failed: Verify your Public Key.';
        } else if (error.message) {
            errorMessage = error.message;
        }

        return { success: false, error: errorMessage };
    }
};
