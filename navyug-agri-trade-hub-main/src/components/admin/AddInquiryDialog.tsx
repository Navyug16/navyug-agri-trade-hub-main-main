import React, { useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface AddInquiryDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: any) => Promise<void>;
    initialStatus: string;
}

const AddInquiryDialog = ({ isOpen, onClose, onSave, initialStatus }: AddInquiryDialogProps) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [product, setProduct] = useState('');
    const [status, setStatus] = useState(initialStatus || 'pending');
    const [dealValue, setDealValue] = useState('');
    const [loading, setLoading] = useState(false);

    // Update status when initialStatus changes (if opened with different status)
    React.useEffect(() => {
        if (initialStatus) setStatus(initialStatus);
    }, [initialStatus, isOpen]);

    const handleSave = async () => {
        if (!name || !email) return; // Simple validation
        setLoading(true);
        try {
            await onSave({
                name,
                email,
                phone,
                product_interest: product,
                status,
                dealValue: parseFloat(dealValue) || 0,
                message: 'Added manually via Pipeline',
                created_at: new Date(),
                isDeleted: false,
                labels: []
            });
            onClose();
            // Reset form
            setName('');
            setEmail('');
            setPhone('');
            setProduct('');
            setDealValue('');
        } catch (error) {
            console.error("Failed to add", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add New Lead</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Name *</Label>
                            <Input value={name} onChange={e => setName(e.target.value)} placeholder="Client Name" />
                        </div>
                        <div className="space-y-2">
                            <Label>Email *</Label>
                            <Input value={email} onChange={e => setEmail(e.target.value)} placeholder="email@example.com" />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Phone</Label>
                            <Input value={phone} onChange={e => setPhone(e.target.value)} placeholder="+91..." />
                        </div>
                        <div className="space-y-2">
                            <Label>Deal Value (₹)</Label>
                            <Input type="number" value={dealValue} onChange={e => setDealValue(e.target.value)} placeholder="0" />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label>Product Interest</Label>
                        <Input value={product} onChange={e => setProduct(e.target.value)} placeholder="e.g. Groundnut Oil" />
                    </div>
                    <div className="space-y-2">
                        <Label>Status</Label>
                        <Select value={status} onValueChange={setStatus}>
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="pending">Starting</SelectItem>
                                <SelectItem value="in_progress">On Going</SelectItem>
                                <SelectItem value="ghosted">Ghosted</SelectItem>
                                <SelectItem value="closed_won">Won</SelectItem>
                                <SelectItem value="closed_lost">Lost</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={onClose} disabled={loading}>Cancel</Button>
                    <Button onClick={handleSave} disabled={loading}>{loading ? 'Saving...' : 'Add Lead'}</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default AddInquiryDialog;
