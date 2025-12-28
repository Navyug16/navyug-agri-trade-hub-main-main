import React from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";

interface ThankYouPopupProps {
    isOpen: boolean;
    onClose: () => void;
    message?: string;
}

const ThankYouPopup: React.FC<ThankYouPopupProps> = ({
    isOpen,
    onClose,
    message = "Thank you! We have received your inquiry and will get back to you shortly."
}) => {
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md text-center">
                <div className="flex justify-center mb-4 mt-4">
                    <div className="rounded-full bg-green-100 p-3">
                        <CheckCircle2 className="h-10 w-10 text-green-600" />
                    </div>
                </div>
                <DialogHeader className="mb-4">
                    <DialogTitle className="text-2xl font-bold text-center text-gray-900">Thank You!</DialogTitle>
                    <DialogDescription className="text-center text-gray-600 text-base mt-2">
                        {message}
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter className="sm:justify-center">
                    <Button onClick={onClose} className="w-full sm:w-auto bg-green-600 hover:bg-green-700 min-w-[120px]">
                        Close
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default ThankYouPopup;
