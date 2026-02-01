import React from 'react';
import { MessageCircle, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

const FloatingContact = () => {
    const whatsappNumber = "917016055780";
    const whatsappMessage = encodeURIComponent("Hello Navyug Enterprise, I am interested in your products.");

    const handleWhatsAppClick = () => {
        window.open(`https://wa.me/${whatsappNumber}?text=${whatsappMessage}`, '_blank');
    };

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-4 animate-in slide-in-from-bottom-8 duration-700 delay-1000">
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button
                            onClick={handleWhatsAppClick}
                            className="bg-[#25D366] hover:bg-[#128C7E] text-white rounded-full p-4 h-14 w-14 shadow-lg hover:scale-110 transition-transform duration-300"
                        >
                            <MessageCircle className="h-8 w-8" />
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent side="left">
                        <p>Chat on WhatsApp</p>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
        </div>
    );
};

export default FloatingContact;
