import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from '@/hooks/use-toast';
import { Copy, ExternalLink, Mail, Trash2, X, CheckCircle, Printer, Send, DollarSign, XCircle, FileText, History, User } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { sendEmail } from '@/lib/emailService';

interface Inquiry {
  id: string;
  name: string;
  email: string;
  phone?: string;
  product_interest?: string;
  message: string;
  status: 'pending' | 'in_progress' | 'closed_won' | 'closed_lost';
  dealValue?: number;
  notes?: string;
  replyHistory?: {
    id: string;
    date: string;
    subject: string;
    body: string;
    sender: string;
  }[];
  created_at: string;
}

interface AdminInquiriesProps {
  inquiries: Inquiry[];
  onUpdateInquiry: (id: string, updates: Partial<Inquiry>) => void;
  onDelete: (id: string) => void;
  adminName?: string;
}

const EMAIL_TEMPLATES: Record<string, { subject: string; body: string; label: string }> = {
  'general_reply': {
    label: 'General Reply',
    subject: "Re: Your Inquiry - Navyug Enterprise",
    body: "Dear {name},\n\nThank you for reaching out to us.\n\nWe have received your inquiry and would be happy to discuss your requirements further.\n\nBest regards,\nNavyug Enterprise Team"
  },
  'price_quote': {
    label: 'Price Quotation',
    subject: "Quotation for {product} - Navyug Enterprise",
    body: "Dear {name},\n\nRegarding your interest in {product}, we are pleased to offer the following quotation:\n\n[Insert Price Details Here]\n\nPlease let us know if you wish to proceed.\n\nBest regards,\nSales Team, Navyug Enterprise"
  },
  'not_available': {
    label: 'Out of Stock / Unavailable',
    subject: "Update on Product Availability - {product}",
    body: "Dear {name},\n\nThank you for your interest in {product}.\n\nCurrently, this item is out of stock. We expect it to be available by [Date]. Would you like us to notify you then?\n\nSincerely,\nNavyug Enterprise"
  }
};

const AdminInquiries = ({ inquiries, onUpdateInquiry, onDelete, adminName = 'Admin' }: AdminInquiriesProps) => {
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);
  const [dealValueInput, setDealValueInput] = useState<string>('');
  const [notesInput, setNotesInput] = useState<string>('');
  const [isSending, setIsSending] = useState(false);

  // Compose State
  const [composeSubject, setComposeSubject] = useState('');
  const [composeBody, setComposeBody] = useState('');

  const getStatusBadge = (status: string) => {
    const safeStatus = status || 'pending';
    const variants: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
      pending: 'destructive',
      in_progress: 'secondary',
      closed_won: 'default',
      closed_lost: 'outline'
    };

    let label = safeStatus.replace(/_/g, ' ');
    label = label.charAt(0).toUpperCase() + label.slice(1);

    if (safeStatus === 'closed_won') {
      return <Badge className="bg-emerald-600 hover:bg-emerald-700 text-white">{label}</Badge>;
    }
    if (safeStatus === 'closed_lost') {
      return <Badge variant="outline" className="text-gray-500 border-gray-300">{label}</Badge>;
    }

    return <Badge variant={variants[safeStatus] || 'default'}>{label}</Badge>;
  };

  const handleOpenInquiry = (inquiry: Inquiry) => {
    setSelectedInquiry(inquiry);
    setDealValueInput(inquiry.dealValue?.toString() || '');
    setNotesInput(inquiry.notes || '');
    setComposeSubject(`Re: Inquiry about ${inquiry.product_interest || 'Navyug Enterprise Products'} `);
    setComposeBody(`Hi ${inquiry.name || 'Customer'}, \n\n`); // Basic greeting reset
  };

  const handleApplyTemplate = (templateKey: string) => {
    const template = EMAIL_TEMPLATES[templateKey];
    if (!selectedInquiry || !template) return;

    const subject = template.subject
      .replace('{product}', selectedInquiry.product_interest || 'Product')
      .replace('{name}', selectedInquiry.name || 'Customer');

    const body = template.body
      .replace('{product}', selectedInquiry.product_interest || 'our product')
      .replace('{name}', selectedInquiry.name || 'Customer');

    setComposeSubject(subject);
    setComposeBody(body);
  };

  const handleSendEmail = async () => {
    if (!selectedInquiry || !selectedInquiry.email) return;

    setIsSending(true);
    const result = await sendEmail({
      to_email: selectedInquiry.email,
      to_name: selectedInquiry.name,
      from_name: adminName,
      reply_to: 'support@navyug.com', // Should be dynamic ideally, but static for now
      subject: composeSubject,
      message: composeBody
    });

    setIsSending(false);

    if (result.success) {
      if (result.mocked) {
        toast({
          title: "Simulated Send Successful",
          description: "Email logged to history. To really send, configure EmailJS keys in src/lib/emailService.ts.",
          duration: 5000
        });
      } else {
        toast({ title: "Email Sent", description: "Your reply has been sent successfully." });
      }

      // Add to History
      const newHistoryEntry = {
        id: Date.now().toString(),
        date: new Date().toISOString(),
        subject: composeSubject,
        body: composeBody,
        sender: adminName
      };

      const updatedHistory = [...(selectedInquiry.replyHistory || []), newHistoryEntry];
      onUpdateInquiry(selectedInquiry.id, { replyHistory: updatedHistory, status: 'in_progress' });

      // Update local state
      setSelectedInquiry({ ...selectedInquiry, replyHistory: updatedHistory, status: 'in_progress' });
      setComposeBody(''); // Clear body after send
    } else {
      toast({ title: "Failed to Send", description: result.error, variant: "destructive" });
    }
  };

  const handleDealValueSave = () => {
    if (!selectedInquiry) return;
    const val = parseFloat(dealValueInput);
    if (isNaN(val)) return;

    onUpdateInquiry(selectedInquiry.id, { dealValue: val });
    setSelectedInquiry(prev => prev ? ({ ...prev, dealValue: val }) : null);
  };

  const handleNotesSave = () => {
    if (!selectedInquiry) return;
    onUpdateInquiry(selectedInquiry.id, { notes: notesInput });
    setSelectedInquiry(prev => prev ? ({ ...prev, notes: notesInput }) : null);
  };

  return (
    <>
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>Customer Inquiries (CRM)</CardTitle>
          <CardDescription>Manage leads, track status, and record earnings.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Client Details</TableHead>
                  <TableHead>Product</TableHead>
                  <TableHead className="w-[200px]">Message</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Value</TableHead>
                  <TableHead>Replies</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {inquiries.map((inquiry) => (
                  <TableRow
                    key={inquiry.id}
                    className="cursor-pointer hover:bg-gray-50 bg-white"
                    onClick={() => handleOpenInquiry(inquiry)}
                  >
                    <TableCell>
                      <div className="font-medium text-gray-900">{inquiry.name || 'Unknown Name'}</div>
                      <div className="text-sm text-gray-500">{inquiry.email || 'No email'}</div>
                    </TableCell>
                    <TableCell><Badge variant="outline">{inquiry.product_interest || 'General'}</Badge></TableCell>
                    <TableCell>
                      <p className="line-clamp-2 text-sm text-gray-600">
                        {inquiry.message || 'No message content'}
                      </p>
                    </TableCell>
                    <TableCell>{getStatusBadge(inquiry.status)}</TableCell>
                    <TableCell>
                      {inquiry.dealValue ?
                        <span className="font-medium text-emerald-600">
                          {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(inquiry.dealValue)}
                        </span>
                        : <span className="text-gray-300">-</span>
                      }
                    </TableCell>
                    <TableCell>
                      {inquiry.replyHistory && inquiry.replyHistory.length > 0 ? (
                        <Badge variant="secondary" className="bg-blue-100 text-blue-700 hover:bg-blue-200">
                          {inquiry.replyHistory.length} sent
                        </Badge>
                      ) : <span className="text-gray-300">-</span>}
                    </TableCell>
                    <TableCell className="whitespace-nowrap text-sm text-gray-500">
                      {inquiry.created_at ? new Date(inquiry.created_at).toLocaleDateString() : 'Unknown'}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2" onClick={(e) => e.stopPropagation()}>
                        <Button
                          size="sm"
                          variant="ghost"
                          title="View & Edit"
                          onClick={() => handleOpenInquiry(inquiry)}
                        >
                          <ExternalLink className="w-4 h-4 text-gray-400" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          {inquiries.length === 0 && (
            <div className="text-center py-12 text-gray-500 bg-gray-50 rounded-lg mt-4 border border-dashed">
              <p>No inquiries found matching your filters</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Inquiry Details / CRM Modal */}
      {selectedInquiry && (
        <div
          className="fixed inset-0 z-[9000] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200"
          onClick={() => setSelectedInquiry(null)}
        >
          <div
            className="bg-white text-gray-900 rounded-xl shadow-2xl w-full max-w-5xl max-h-[95vh] overflow-y-auto flex flex-col relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b sticky top-0 bg-white z-10">
              <div>
                <h2 className="text-2xl font-bold">Manage Inquiry</h2>
                <div className="flex items-center gap-2 mt-1 text-sm text-gray-500">
                  <span>ID: {selectedInquiry.id ? selectedInquiry.id.slice(0, 8) : '...'}</span>
                  <span>•</span>
                  <span>{selectedInquiry.created_at ? new Date(selectedInquiry.created_at).toLocaleString() : 'N/A'}</span>
                </div>
              </div>
              <button
                onClick={() => setSelectedInquiry(null)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors font-bold text-xl"
                aria-label="Close"
              >
                ✕
              </button>
            </div>

            {/* Body */}
            <div className="p-6 grid grid-cols-1 lg:grid-cols-12 gap-8">

              {/* Left Column: CRM Controls (4 cols) */}
              <div className="lg:col-span-4 space-y-6 border-r pr-0 lg:pr-6">
                {/* Status Section */}
                <div>
                  <Label className="uppercase text-xs font-bold text-gray-500 mb-2 block">Deal Status</Label>
                  <div className="space-y-2">
                    <Button
                      variant={selectedInquiry.status === 'pending' ? 'default' : 'outline'}
                      className={`w - full justify - start ${selectedInquiry.status === 'pending' ? 'bg-orange-500 hover:bg-orange-600' : ''} `}
                      onClick={() => {
                        onUpdateInquiry(selectedInquiry.id, { status: 'pending' });
                        setSelectedInquiry({ ...selectedInquiry, status: 'pending' });
                      }}
                    >
                      <span className="mr-2">⏳</span> Pending
                    </Button>
                    <Button
                      variant={selectedInquiry.status === 'in_progress' ? 'default' : 'outline'}
                      className={`w - full justify - start ${selectedInquiry.status === 'in_progress' ? 'bg-blue-500 hover:bg-blue-600' : ''} `}
                      onClick={() => {
                        onUpdateInquiry(selectedInquiry.id, { status: 'in_progress' });
                        setSelectedInquiry({ ...selectedInquiry, status: 'in_progress' });
                      }}
                    >
                      <span className="mr-2">🔄</span> In Progress
                    </Button>
                    <Button
                      variant={selectedInquiry.status === 'closed_won' ? 'default' : 'outline'}
                      className={`w - full justify - start ${selectedInquiry.status === 'closed_won' ? 'bg-emerald-600 hover:bg-emerald-700' : ''} `}
                      onClick={() => {
                        onUpdateInquiry(selectedInquiry.id, { status: 'closed_won' });
                        setSelectedInquiry({ ...selectedInquiry, status: 'closed_won' });
                      }}
                    >
                      <CheckCircle className="mr-2 h-4 w-4" /> Closed Won
                    </Button>
                    <Button
                      variant={selectedInquiry.status === 'closed_lost' ? 'default' : 'outline'}
                      className={`w - full justify - start ${selectedInquiry.status === 'closed_lost' ? 'bg-gray-600 hover:bg-gray-700' : ''} `}
                      onClick={() => {
                        onUpdateInquiry(selectedInquiry.id, { status: 'closed_lost' });
                        setSelectedInquiry({ ...selectedInquiry, status: 'closed_lost' });
                      }}
                    >
                      <XCircle className="mr-2 h-4 w-4" /> Closed Lost
                    </Button>
                  </div>
                </div>

                {/* Deal Value */}
                <div className="pt-4 border-t">
                  <Label className="uppercase text-xs font-bold text-gray-500 mb-2 block">Deal Value (Revenue)</Label>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <DollarSign className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                      <Input
                        type="number"
                        placeholder="0.00"
                        className="pl-9"
                        value={dealValueInput}
                        onChange={(e) => setDealValueInput(e.target.value)}
                      />
                    </div>
                    <Button size="sm" onClick={handleDealValueSave}>Save</Button>
                  </div>
                </div>

                {/* Notes */}
                <div className="pt-4 border-t">
                  <div className="flex justify-between items-center mb-2">
                    <Label className="uppercase text-xs font-bold text-gray-500 block">Internal Notes</Label>
                    <Button size="sm" variant="ghost" className="h-6 text-xs text-amber-800 hover:bg-amber-100" onClick={handleNotesSave}>
                      Save
                    </Button>
                  </div>
                  <Textarea
                    value={notesInput}
                    onChange={(e) => setNotesInput(e.target.value)}
                    placeholder="Private notes..."
                    className="bg-amber-50 border-amber-200 focus:border-amber-400 min-h-[100px] text-sm"
                  />
                </div>

                <div className="pt-4 border-t">
                  <Button
                    size="sm"
                    variant="outline"
                    className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
                    onClick={() => {
                      if (confirm('Delete this inquiry permanently?')) {
                        onDelete(selectedInquiry.id);
                        setSelectedInquiry(null);
                      }
                    }}
                  >
                    <Trash2 className="w-4 h-4 mr-2" /> Delete Inquiry
                  </Button>
                </div>
              </div>

              {/* Right Column: Details & Communication (8 cols) */}
              <div className="lg:col-span-8 flex flex-col h-full">

                {/* Customer Info Card */}
                <div className="bg-gray-50 p-4 rounded-xl border mb-6">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <label className="text-xs font-bold text-gray-400 uppercase block">Name</label>
                      <p className="font-medium text-gray-900 truncate">{selectedInquiry.name}</p>
                    </div>
                    <div>
                      <label className="text-xs font-bold text-gray-400 uppercase block">Email</label>
                      <p className="font-medium text-blue-600 truncate">{selectedInquiry.email}</p>
                    </div>
                    <div>
                      <label className="text-xs font-bold text-gray-400 uppercase block">Phone</label>
                      <p className="font-medium text-gray-900 truncate">{selectedInquiry.phone || '-'}</p>
                    </div>
                    <div>
                      <label className="text-xs font-bold text-gray-400 uppercase block">Product</label>
                      <p className="font-medium text-gray-900 truncate">{selectedInquiry.product_interest}</p>
                    </div>
                  </div>
                </div>

                {/* Communication Tabs */}
                <Tabs defaultValue="compose" className="flex-1 flex flex-col">
                  <TabsList className="grid w-full grid-cols-3 mb-4">
                    <TabsTrigger value="message">Original Message</TabsTrigger>
                    <TabsTrigger value="compose">Compose Reply</TabsTrigger>
                    <TabsTrigger value="history">
                      History
                      {selectedInquiry.replyHistory && selectedInquiry.replyHistory.length > 0 && (
                        <Badge variant="secondary" className="ml-2 bg-gray-200 p-0 px-1 text-[10px] h-4 leading-none">{selectedInquiry.replyHistory.length}</Badge>
                      )}
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="message" className="flex-1">
                    <div className="bg-white p-6 rounded-lg border text-gray-800 leading-relaxed whitespace-pre-wrap font-sans text-base shadow-sm h-full max-h-[400px] overflow-y-auto">
                      {selectedInquiry.message || 'No message content provided.'}
                    </div>
                  </TabsContent>

                  <TabsContent value="compose" className="flex-1 flex flex-col space-y-4">
                    <div className="flex gap-2 items-center">
                      <Label className="whitespace-nowrap">Template:</Label>
                      <Select onValueChange={handleApplyTemplate}>
                        <SelectTrigger className="w-full md:w-[250px]">
                          <SelectValue placeholder="Select a template..." />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.entries(EMAIL_TEMPLATES).map(([key, tpl]) => (
                            <SelectItem key={key} value={key}>{tpl.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Subject</Label>
                      <Input
                        value={composeSubject}
                        onChange={(e) => setComposeSubject(e.target.value)}
                        placeholder="Email Subject"
                      />
                    </div>

                    <div className="space-y-2 flex-1 flex flex-col">
                      <Label>Message Body</Label>
                      <Textarea
                        value={composeBody}
                        onChange={(e) => setComposeBody(e.target.value)}
                        placeholder="Type your reply here..."
                        className="flex-1 min-h-[200px] font-sans"
                      />
                    </div>

                    <div className="flex justify-between items-center pt-2">
                      <p className="text-xs text-muted-foreground">
                        Sending as: <span className="font-bold">{adminName}</span> (via EmailJS)
                      </p>
                      <Button onClick={handleSendEmail} disabled={isSending} className="bg-blue-600 hover:bg-blue-700 text-white min-w-[120px]">
                        {isSending ? 'Sending...' : (
                          <>
                            <Send className="w-4 h-4 mr-2" /> Send Reply
                          </>
                        )}
                      </Button>
                    </div>
                  </TabsContent>

                  <TabsContent value="history" className="flex-1">
                    <div className="h-full max-h-[500px] overflow-y-auto space-y-4 pr-2">
                      {selectedInquiry.replyHistory && selectedInquiry.replyHistory.length > 0 ? (
                        selectedInquiry.replyHistory.slice().reverse().map((reply) => (
                          <div key={reply.id} className="bg-gray-50 border rounded-lg p-4 space-y-2">
                            <div className="flex justify-between items-start">
                              <div>
                                <p className="font-bold text-sm text-gray-900">{reply.subject}</p>
                                <p className="text-xs text-gray-500">
                                  Sent by <span className="font-medium text-gray-700">{reply.sender || 'Admin'}</span> on {new Date(reply.date).toLocaleString()}
                                </p>
                              </div>
                              <Badge variant="outline" className="bg-white">Sent</Badge>
                            </div>
                            <div className="text-sm text-gray-700 whitespace-pre-wrap border-t pt-2 mt-2">
                              {reply.body}
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="h-full flex flex-col items-center justify-center text-gray-400 py-12">
                          <History className="h-12 w-12 mb-2 opacity-20" />
                          <p>No replies sent yet.</p>
                        </div>
                      )}
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            </div>

          </div>
        </div>
      )}
    </>
  );
};

export default AdminInquiries;
