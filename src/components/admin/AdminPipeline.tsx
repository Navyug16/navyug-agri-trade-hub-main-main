import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Plus, MoreVertical, Trash2 } from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface Inquiry {
    id: string;
    name: string;
    status: 'pending' | 'in_progress' | 'closed' | 'closed_won' | 'closed_lost' | 'ghosted';
    dealValue?: number;
    product_interest: string;
    labels?: string[];
    [key: string]: any;
}

interface AdminPipelineProps {
    inquiries: Inquiry[];
    onUpdateStatus: (id: string, newStatus: any) => void;
    onUpdateLabels: (id: string, labels: string[]) => void;
    onDelete: (id: string) => void;
    onAddInquiry: (initialStatus: string) => void;
}

const COLUMNS = [
    { id: 'pending', title: 'Starting', color: 'bg-amber-100 border-amber-200' },
    { id: 'in_progress', title: 'On Going', color: 'bg-blue-100 border-blue-200' },
    { id: 'ghosted', title: 'Ghosted', color: 'bg-gray-100 border-gray-200' },
    { id: 'closed_won', title: 'Won', color: 'bg-emerald-100 border-emerald-200' },
    { id: 'closed_lost', title: 'Lost', color: 'bg-red-100 border-red-200' }
];

const AdminPipeline = ({ inquiries, onUpdateStatus, onUpdateLabels, onDelete, onAddInquiry }: AdminPipelineProps) => {
    const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);
    const [isLabelDialogOpen, setIsLabelDialogOpen] = useState(false);
    const [newLabel, setNewLabel] = useState('');

    const onDragEnd = (result: DropResult) => {
        const { destination, source, draggableId } = result;

        if (!destination) return;

        if (
            destination.droppableId === source.droppableId &&
            destination.index === source.index
        ) {
            return;
        }

        const newStatus = destination.droppableId;
        onUpdateStatus(draggableId, newStatus);
    };

    const handleAddLabel = () => {
        if (!selectedInquiry || !newLabel.trim()) return;
        const currentLabels = selectedInquiry.labels || [];
        if (!currentLabels.includes(newLabel.trim())) {
            onUpdateLabels(selectedInquiry.id, [...currentLabels, newLabel.trim()]);
        }
        setNewLabel('');
        setIsLabelDialogOpen(false);
    };

    const handleRemoveLabel = (inquiry: Inquiry, labelToRemove: string) => {
        const currentLabels = inquiry.labels || [];
        const newLabels = currentLabels.filter(l => l !== labelToRemove);
        onUpdateLabels(inquiry.id, newLabels);
    };

    return (
        <div className="h-full overflow-x-auto pb-4 -mx-4 px-4 md:mx-0 md:px-0">
            <DragDropContext onDragEnd={onDragEnd}>
                <div className="flex gap-4 w-full h-full min-w-max p-1">
                    {COLUMNS.map(column => {
                        const columnInquiries = inquiries.filter(i => {
                            if (column.id === 'closed_won' || column.id === 'closed_lost') return i.status === column.id;
                            // Treat generic 'closed' as 'closed_lost' strictly for pipeline vis? Or maybe ignore?
                            // For now, map exactly.
                            return i.status === column.id;
                        });

                        const totalValue = columnInquiries.reduce((sum, i) => sum + (i.dealValue || 0), 0);

                        return (
                            <div key={column.id} className="w-[72vw] sm:w-80 flex-shrink-0 flex flex-col bg-gray-50/50 rounded-xl border h-full max-h-[calc(100vh-200px)]">
                                {/* Column Header */}
                                <div className={`p-3 sm:p-4 rounded-t-xl border-b flex justify-between items-start ${column.color}`}>
                                    <div className="min-w-0 overflow-hidden">
                                        <h3 className="font-bold text-gray-700 truncate">{column.title}</h3>
                                        <p className="text-xs text-gray-500 mt-1">{columnInquiries.length} leads</p>
                                    </div>
                                    <div className="text-right flex items-center gap-2">
                                        <p className="text-xs font-semibold text-gray-600">
                                            ₹{totalValue.toLocaleString()}
                                        </p>
                                        <Button variant="ghost" size="icon" className="h-6 w-6 hover:bg-black/10" onClick={() => onAddInquiry(column.id)}>
                                            <Plus className="h-4 w-4 text-gray-600" />
                                        </Button>
                                    </div>
                                </div>

                                {/* Droppable Area */}
                                <Droppable droppableId={column.id}>
                                    {(provided, snapshot) => (
                                        <div
                                            {...provided.droppableProps}
                                            ref={provided.innerRef}
                                            className={`p-2 sm:p-3 flex-1 overflow-y-auto space-y-2 sm:space-y-3 transition-colors ${snapshot.isDraggingOver ? 'bg-slate-100' : ''}`}
                                        >
                                            {columnInquiries.map((inquiry, index) => (
                                                <Draggable key={inquiry.id} draggableId={inquiry.id} index={index}>
                                                    {(provided, snapshot) => (
                                                        <Card
                                                            ref={provided.innerRef}
                                                            {...provided.draggableProps}
                                                            {...provided.dragHandleProps}
                                                            className={`bg-white shadow-sm hover:shadow-md transition-shadow border-l-4 ${snapshot.isDragging ? 'shadow-lg rotate-2' : ''
                                                                } ${column.id === 'pending' ? 'border-l-amber-400' :
                                                                    column.id === 'in_progress' ? 'border-l-blue-400' :
                                                                        column.id === 'ghosted' ? 'border-l-gray-400' :
                                                                            column.id === 'closed_won' ? 'border-l-emerald-400' :
                                                                                'border-l-red-400'
                                                                }`}
                                                        >
                                                            <CardContent className="p-2 sm:p-3">
                                                                <div className="flex justify-between items-start mb-1 sm:mb-2">
                                                                    <span className="font-medium text-sm truncate w-3/4">{inquiry.name}</span>
                                                                    <DropdownMenu>
                                                                        <DropdownMenuTrigger asChild>
                                                                            <Button variant="ghost" size="icon" className="h-6 w-6 -mr-2"><MoreVertical className="h-3 w-3" /></Button>
                                                                        </DropdownMenuTrigger>
                                                                        <DropdownMenuContent align="end">
                                                                            <DropdownMenuItem onClick={() => { setSelectedInquiry(inquiry); setIsLabelDialogOpen(true); }}>
                                                                                Add Label
                                                                            </DropdownMenuItem>
                                                                            <DropdownMenuItem className="text-red-600" onClick={() => onDelete(inquiry.id)}>
                                                                                <Trash2 className="mr-2 h-3 w-3" /> Move to Trash
                                                                            </DropdownMenuItem>
                                                                        </DropdownMenuContent>
                                                                    </DropdownMenu>
                                                                </div>

                                                                <p className="text-xs text-gray-500 mb-1 sm:mb-2 truncate">{inquiry.product_interest}</p>

                                                                <div className="flex flex-wrap gap-1 mb-1 sm:mb-2">
                                                                    {inquiry.labels?.map((label, i) => (
                                                                        <Badge key={i} variant="secondary" className="text-[10px] px-1 h-5 gap-1">
                                                                            {label}
                                                                            <span className="cursor-pointer hover:text-red-500" onClick={(e) => { e.stopPropagation(); handleRemoveLabel(inquiry, label); }}>×</span>
                                                                        </Badge>
                                                                    ))}
                                                                    <Button
                                                                        variant="ghost"
                                                                        size="sm"
                                                                        className="h-5 w-5 rounded-full p-0 text-gray-400"
                                                                        onClick={() => { setSelectedInquiry(inquiry); setIsLabelDialogOpen(true); }}
                                                                    >
                                                                        <Plus className="h-3 w-3" />
                                                                    </Button>
                                                                </div>

                                                                <div className="flex justify-between items-center pt-1.5 mt-1.5 sm:pt-2 sm:mt-2 border-t">
                                                                    <span className="text-xs font-bold text-gray-700">₹{(inquiry.dealValue || 0).toLocaleString()}</span>
                                                                    <span className="text-[10px] text-gray-400">{new Date(inquiry.created_at).toLocaleDateString()}</span>
                                                                </div>
                                                            </CardContent>
                                                        </Card>
                                                    )}
                                                </Draggable>
                                            ))}
                                            {provided.placeholder}
                                        </div>
                                    )}
                                </Droppable>
                            </div>
                        );
                    })}
                </div>
            </DragDropContext>

            {/* Add Label Dialog */}
            <Dialog open={isLabelDialogOpen} onOpenChange={setIsLabelDialogOpen}>
                <DialogContent className="max-w-sm">
                    <DialogHeader>
                        <DialogTitle>Add Label</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label>Label Name</Label>
                            <Input
                                placeholder="e.g. VIP, Urgent, Cold"
                                value={newLabel}
                                onChange={(e) => setNewLabel(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') handleAddLabel();
                                }}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button onClick={handleAddLabel}>Add Label</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default AdminPipeline;
