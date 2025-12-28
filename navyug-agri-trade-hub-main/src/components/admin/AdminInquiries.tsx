import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from "@/hooks/use-toast";
import { Search, Filter, Download, Mail, ChevronRight, CheckCircle2, XCircle, Clock, AlertCircle, Send, FileText, History } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { sendEmail } from '@/lib/emailService';
import { format } from "date-fns"; // 1. Include import { format } from "date-fns";
import { db } from "@/lib/firebase";
import { collection, getDocs, updateDoc, doc, Timestamp, orderBy, query } from "firebase/firestore";
import { useAdminAuth } from '@/contexts/AdminAuthContext'; // Import Auth Context

interface EmailReply {
  id: string;
  date: string;
  subject: string;
  body: string;
  sender: string;
}

interface Inquiry {
  id: string;
  name: string;
  email: string;
  phone?: string;
  product_interest: string;
  quantity?: string; // New field
  message: string;
  status: 'pending' | 'in_progress' | 'closed'; // Updated status types
  dealValue?: number;
  notes?: string;
  replyHistory?: EmailReply[];
  date: Date; // 2. Updated Inquiry interface
  time_string?: string; // 2. Updated Inquiry interface
}

interface AdminInquiriesProps {
  onUpdateInquiry: (id: string, updates: Partial<Inquiry>) => void;
}

const EMAIL_TEMPLATES: Record<string, { label: string, subject: string, body: string }> = {
  'general_reply': {
    label: 'General Reply',
    subject: "Re: Your Inquiry - Navyug Enterprise",
    body: "Dear {name},\n\nThank you for reaching out to us regarding {product}.\n\n[Your Message Here]\n\nBest regards,\nNavyug Enterprise"
  },
  'quote': {
    label: 'Price Quotation',
    subject: "Quotation for {product} - Navyug Enterprise",
    body: "Dear {name},\n\nHere is the quotation for {product} you requested.\n\nPrice: [Enter Price]\nTerms: [Enter Terms]\n\nPlease let us know if you'd like to proceed.\n\nRegards,\nNavyug Enterprise"
  },
  'not_available': {
    label: 'Out of Stock / Unavailable',
    subject: "Update on Product Availability - {product}",
    body: "Dear {name},\n\nThank you for your interest in {product}.\n\nCurrently, this item is out of stock. We expect it to be available by [Date]. Would you like us to notify you then?\n\nSincerely,\nNavyug Enterprise"
  },
  'enquiry_ack': {
    label: 'Enquiry Acknowledgement (Standard)',
    subject: "We received your enquiry - NAVYUG ENTERPRISE",
    body: "Dear {name},\n\nThank you for reaching out to NAVYUG ENTERPRISE.\n\nWe have successfully received your enquiry through our website, and our team is currently reviewing the details you shared.\n\n### Your Enquiry Summary:\n\n* Product Interested In: {product}\n* Message: [See Above]\n\nOur team will contact you shortly with the required information, pricing, and next steps.\n\nAt NAVYUG ENTERPRISE, we focus on delivering quality agricultural products, transparent communication, and reliable service.\n\nIf your enquiry is urgent, you can reply directly to this email.\n\nThank you for choosing NAVYUG ENTERPRISE.\nWe look forward to working with you.\n\nWarm regards,\nNAVYUG ENTERPRISE\nAgricultural Products & Commission-Based Services\n\n📧 Email: navyugenterprise2003@gmail.com\n📞 Phone: +91 7016055780\n🌐 Website: www.navyugenterprise.com"
  }
};


const AdminInquiries = ({ onUpdateInquiry }: AdminInquiriesProps) => {
  const { toast } = useToast();
  const { admin } = useAdminAuth(); // Get current admin info
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'pending' | 'in_progress' | 'closed'>('all');
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);

  // Email Reply State
  const [replySubject, setReplySubject] = useState('');
  const [replyBody, setReplyBody] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [isSending, setIsSending] = useState(false);

  // Internal Notes State
  const [notesInput, setNotesInput] = useState<string>('');

  useEffect(() => {
    fetchInquiries();
  }, []);

  const fetchInquiries = async () => {
    try {
      setLoading(true);
      const q = query(collection(db, "inquiries"), orderBy("created_at", "desc"));
      const querySnapshot = await getDocs(q);

      const fetchedInquiries: Inquiry[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        fetchedInquiries.push({
          id: doc.id,
          name: data.name,
          email: data.email,
          phone: data.phone,
          product_interest: data.product_interest,
          quantity: data.quantity, // Fetch quantity
          message: data.message,
          status: data.status,
          dealValue: data.dealValue,
          notes: data.notes,
          replyHistory: data.replyHistory || [],
          date: data.created_at?.toDate() || new Date(), // 3. Map Firestore created_at to Local date
          time_string: data.time_string || format(data.created_at?.toDate() || new Date(), 'hh:mm a') // 3. Map Firestore created_at to Local time_string if not present
        } as Inquiry);
      });

      setInquiries(fetchedInquiries);
    } catch (error) {
      console.error("Error fetching inquiries:", error);
      toast({ title: "Error", description: "Failed to load inquiries", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const filteredInquiries = inquiries.filter(inquiry => {
    const matchesSearch =
      inquiry.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inquiry.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inquiry.product_interest?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter = activeFilter === 'all' ? true : inquiry.status === activeFilter;

    return matchesSearch && matchesFilter;
  });

  const handleStatusUpdate = async (inquiryId: string, newStatus: Inquiry['status']) => {
    try {
      await updateDoc(doc(db, "inquiries", inquiryId), { status: newStatus });

      // Update local state
      setInquiries(prev => prev.map(i => i.id === inquiryId ? { ...i, status: newStatus } : i));
      if (selectedInquiry && selectedInquiry.id === inquiryId) {
        setSelectedInquiry(prev => prev ? ({ ...prev, status: newStatus }) : null);
      }
      onUpdateInquiry(inquiryId, { status: newStatus });

      toast({ title: "Status Updated", description: `Inquiry marked as ${newStatus.replace('_', ' ')} ` });
    } catch (error) {
      toast({ title: "Error", description: "Failed to update status", variant: "destructive" });
    }
  };

  const handleTemplateSelect = (templateKey: string) => {
    if (!selectedInquiry) return;

    const template = EMAIL_TEMPLATES[templateKey];
    if (template) {
      setReplySubject(template.subject.replace('{product}', selectedInquiry.product_interest));
      setReplyBody(template.body.replace('{name}', selectedInquiry.name).replace('{product}', selectedInquiry.product_interest));
      setSelectedTemplate(templateKey);
    }
  };

  const handleSendReply = async () => {
    if (!selectedInquiry || !replySubject || !replyBody) {
      toast({ title: "Validation Error", description: "Subject and Body are required.", variant: "destructive" });
      return;
    }

    setIsSending(true);

    // Use the actual logged-in admin name, or fallback to 'Admin'
    const senderName = admin?.name || 'Admin';

    const result = await sendEmail({
      to_email: selectedInquiry.email,
      to_name: selectedInquiry.name,
      subject: replySubject,
      message: replyBody,
      from_name: 'Navyug Enterprise', // Sender Name in email client
      reply_to: 'navyugenterprise2003@gmail.com' // Where they reply to
    });

    if (result.success) {
      // 4. Remove mocked check in handleSendReply.
      toast({ title: "Email Sent", description: "Reply sent successfully." });
      // Log history
      const newReply: EmailReply = {
        id: Date.now().toString(),
        date: new Date().toISOString(),
        subject: replySubject,
        body: replyBody,
        sender: senderName // Log who sent it
      };

      const updatedHistory = [...(selectedInquiry.replyHistory || []), newReply];

      // Update Firestore
      try {
        await updateDoc(doc(db, "inquiries", selectedInquiry.id), {
          replyHistory: updatedHistory,
          status: 'in_progress' // Auto-update status
        });

        // Update Local State
        setInquiries(prev => prev.map(i => i.id === selectedInquiry.id ? {
          ...i,
          replyHistory: updatedHistory,
          status: 'in_progress'
        } : i));

        setSelectedInquiry(prev => prev ? ({
          ...prev,
          replyHistory: updatedHistory,
          status: 'in_progress'
        }) : null);

        setReplySubject('');
        setReplyBody('');
        setSelectedTemplate('');
      } catch (err) {
        console.error(err);
        toast({ title: "Database Error", description: "Email sent but failed to save history.", variant: "destructive" });
      }
    } else {
      toast({ title: "Error Sending Email", description: result.error, variant: "destructive" });
    }

    setIsSending(false);
  };

  const handleNotesSave = async () => {
    if (!selectedInquiry) return;
    try {
      await updateDoc(doc(db, "inquiries", selectedInquiry.id), { notes: notesInput });

      // Update local state
      setInquiries(prev => prev.map(i => i.id === selectedInquiry.id ? { ...i, notes: notesInput } : i));
      setSelectedInquiry(prev => prev ? ({ ...prev, notes: notesInput }) : null);

      toast({ title: "Notes Saved", description: "Internal notes updated." });
      onUpdateInquiry(selectedInquiry.id, { notes: notesInput });
    } catch (error) {
      toast({ title: "Error", description: "Failed to save notes", variant: "destructive" });
    }
  };


  const getStatusBadge = (status: Inquiry['status']) => {
    switch (status) {
      case 'pending': return <Badge variant="outline" className="bg-amber-100 text-amber-800 border-amber-200">Pending</Badge>;
      case 'in_progress': return <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-200">In Progress</Badge>;
      case 'closed': return <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">Closed</Badge>;
      default: return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const handleOpenInquiry = (inquiry: Inquiry) => {
    setSelectedInquiry(inquiry);
    // Initialize notes from the inquiry
    setNotesInput(inquiry.notes || '');
    // Reset Reply Form
    setReplySubject(`Re: Inquiry about ${inquiry.product_interest} `);
    setReplyBody('');
    setSelectedTemplate('');
    setDetailsOpen(true);
  };

  const exportToCSV = () => {
    const headers = ['Date', 'Time', 'Name', 'Email', 'Phone', 'Product', 'Quantity', 'Status', 'Deal Value'];
    const csvContent = [
      headers.join(','),
      ...filteredInquiries.map(i => [
        format(i.date, 'yyyy-MM-dd'), // 7. Ensure format is used correctly on inquiry.date
        i.time_string || '', // Export time string
        `"${i.name}"`,
        i.email,
        i.phone || '', // Export phone
        `"${i.product_interest}"`,
        `"${i.quantity || ''}"`, // Export Quantity
        i.status,
        i.dealValue || 0
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `inquiries_export_${format(new Date(), 'yyyyMMdd')}.csv`;
    link.click();
  };

  // Calculate Stats
  const stats = {
    pending: inquiries.filter(i => i.status === 'pending').length,
    inProgress: inquiries.filter(i => i.status === 'in_progress').length,
    closed: inquiries.filter(i => i.status === 'closed').length
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-gray-900">Inquiries CRM</h2>
          <p className="text-gray-500">Manage customer inquiries, send replies, and track deals.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={exportToCSV}>
            <Download className="mr-2 h-4 w-4" /> Export CSV
          </Button>
        </div>
      </div>

      <Card className="shadow-sm border-gray-200">
        <CardHeader className="pb-3">
          <CardTitle>Inquiry Management</CardTitle>
          <CardDescription>
            You have {stats.pending} pending inquiries requiring attention.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Filters and Search */}
          <div className="flex flex-col md:flex-row gap-4 mb-6 justify-between">
            <div className="relative w-full md:w-96">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Search by name, email, or product..."
                className="pl-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Simple Status Filters */}
            <div className="flex gap-2 overflow-x-auto pb-2">
              <Button
                variant={activeFilter === 'all' ? "default" : "outline"}
                onClick={() => setActiveFilter('all')}
                className="whitespace-nowrap h-9 text-sm"
              >
                All
              </Button>
              <Button
                variant={activeFilter === 'pending' ? "default" : "outline"}
                onClick={() => setActiveFilter('pending')}
                className="whitespace-nowrap h-9 text-sm"
              >
                Pending
              </Button>
              <Button
                variant={activeFilter === 'in_progress' ? "default" : "outline"}
                onClick={() => setActiveFilter('in_progress')}
                className="whitespace-nowrap h-9 text-sm"
              >
                In Progress
              </Button>
              <Button
                variant={activeFilter === 'closed' ? "default" : "outline"}
                onClick={() => setActiveFilter('closed')}
                className="whitespace-nowrap h-9 text-sm"
              >
                Closed
              </Button>
            </div>
          </div>

          {/* Inquiries Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Product</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Deal Value</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredInquiries.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                      No inquiries found matching your filters.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredInquiries.map((inquiry) => (
                    <TableRow
                      key={inquiry.id}
                      className="hover:bg-gray-50 cursor-pointer"
                      onClick={() => handleOpenInquiry(inquiry)}
                    >
                      <TableCell className="whitespace-nowrap">
                        {format(inquiry.date, 'dd MMM yyyy')} {/* 7. Ensure format is used correctly on inquiry.date */}
                        <div className="text-xs text-gray-400">{inquiry.time_string}</div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium text-gray-900">{inquiry.name || 'Unknown'}</div>
                        <div className="text-sm text-gray-500">{inquiry.email}</div>
                        <div className="text-xs text-gray-400">{inquiry.phone || 'N/A'}</div>
                      </TableCell>
                      <TableCell><Badge variant="outline">{inquiry.product_interest}</Badge></TableCell>
                      <TableCell>{inquiry.quantity || '-'}</TableCell>
                      <TableCell>{getStatusBadge(inquiry.status)}</TableCell>
                      <TableCell>
                        {inquiry.dealValue ?
                          <span className="font-semibold text-green-700">₹{inquiry.dealValue.toLocaleString()}</span> :
                          <span className="text-gray-400">-</span>
                        }
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); handleOpenInquiry(inquiry); }}>
                          View <ChevronRight className="ml-1 h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Inquiry Details Modal */}
      <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold flex items-center justify-between">
              <span>Inquiry Details</span>
              {selectedInquiry && getStatusBadge(selectedInquiry.status)}
            </DialogTitle>
            <DialogDescription>
              Received on {selectedInquiry && format(selectedInquiry.date, 'PPP')} at {selectedInquiry?.time_string} {/* 6. Ensure created_at is NOT used, use time_string or date. 7. Ensure format is used correctly on inquiry.date */}
            </DialogDescription>
          </DialogHeader>

          {selectedInquiry && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
              {/* Left Column: Customer & Inquiry Info */}
              <div className="md:col-span-1 space-y-6">
                <Card>
                  <CardHeader className="py-3 bg-gray-50">
                    <CardTitle className="text-sm font-medium">Customer Information</CardTitle>
                  </CardHeader>
                  <CardContent className="py-4 space-y-3">
                    <div>
                      <Label className="text-xs text-gray-500">Name</Label>
                      <p className="font-medium">{selectedInquiry.name}</p>
                    </div>
                    <div>
                      <Label className="text-xs text-gray-500">Email</Label>
                      <p className="font-medium break-all">{selectedInquiry.email}</p>
                    </div>
                    <div>
                      <Label className="text-xs text-gray-500">Phone</Label>
                      <p className="font-medium">{selectedInquiry.phone || 'N/A'}</p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="py-3 bg-gray-50">
                    <CardTitle className="text-sm font-medium">Inquiry Details</CardTitle>
                  </CardHeader>
                  <CardContent className="py-4 space-y-3">
                    <div>
                      <Label className="text-xs text-gray-500">Product</Label>
                      <p className="font-medium text-amber-700">{selectedInquiry.product_interest}</p>
                    </div>
                    <div>
                      <Label className="text-xs text-gray-500">Quantity</Label>
                      <p className="font-medium">{selectedInquiry.quantity || 'N/A'}</p>
                    </div>
                    <div>
                      <Label className="text-xs text-gray-500">Message</Label>
                      <div className="bg-gray-50 p-3 rounded-md text-sm mt-1 whitespace-pre-wrap">
                        {selectedInquiry.message}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Internal Notes Section */}
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <Label className="font-bold text-amber-800 flex items-center gap-2">
                      <FileText className="h-4 w-4" /> Internal Notes
                    </Label>
                    <Button size="sm" variant="ghost" className="h-6 text-amber-800 hover:bg-amber-100" onClick={handleNotesSave}>
                      Save Notes
                    </Button>
                  </div>
                  <Textarea
                    value={notesInput}
                    onChange={(e) => setNotesInput(e.target.value)}
                    placeholder="Add internal notes (e.g. 'Called customer, interested in bulk order')..."
                    className="bg-white border-amber-200 focus:border-amber-400 min-h-[100px]"
                  />
                </div>
              </div>

              {/* Right Column: Actions & Communication */}
              <div className="md:col-span-2 space-y-6">
                {/* Status & Deal Value Controls */}
                <div className="flex flex-col sm:flex-row gap-4 p-4 bg-gray-50 rounded-lg border">
                  <div className="flex-1 space-y-2">
                    <Label>Status</Label>
                    <Select
                      value={selectedInquiry.status}
                      onValueChange={(val: any) => handleStatusUpdate(selectedInquiry.id, val)}
                    >
                      <SelectTrigger className="bg-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="in_progress">In Progress</SelectItem>
                        <SelectItem value="closed">Closed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex-1 space-y-2">
                    <Label>Deal Value (Est. ₹)</Label>
                    <div className="flex gap-2">
                      <Input
                        type="number"
                        placeholder="0"
                        className="bg-white"
                        defaultValue={selectedInquiry.dealValue}
                        onBlur={(e) => {
                          const val = parseFloat(e.target.value);
                          if (!isNaN(val)) onUpdateInquiry(selectedInquiry.id, { dealValue: val });
                        }}
                      />
                    </div>
                  </div>
                </div>

                {/* Communication Tabs */}
                <Tabs defaultValue="reply" className="w-full">
                  <TabsList className="w-full grid grid-cols-2">
                    <TabsTrigger value="reply">Compose Reply</TabsTrigger>
                    <TabsTrigger value="history">History ({selectedInquiry.replyHistory?.length || 0})</TabsTrigger>
                  </TabsList>

                  <TabsContent value="reply" className="mt-4 space-y-4">
                    <div className="p-4 border rounded-lg bg-white space-y-4">
                      <div className="space-y-2">
                        <Label>Use Template</Label>
                        <Select value={selectedTemplate} onValueChange={handleTemplateSelect}>
                          <SelectTrigger>
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
                          value={replySubject}
                          onChange={(e) => setReplySubject(e.target.value)}
                          placeholder="Email Subject"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Message Body</Label>
                        <Textarea
                          value={replyBody}
                          onChange={(e) => setReplyBody(e.target.value)}
                          placeholder="Type your reply here..."
                          rows={8}
                          className="font-mono text-sm"
                        />
                      </div>

                      <div className="flex justify-end pt-2">
                        <Button
                          onClick={handleSendReply}
                          disabled={isSending}
                          className="bg-amber-600 hover:bg-amber-700 text-white"
                        >
                          {isSending ? (
                            <>Sending...</>
                          ) : (
                            <><Send className="w-4 h-4 mr-2" /> Send Reply via Email</>
                          )}
                        </Button>
                        <p className="text-xs text-gray-400 w-full pt-2 text-right">
                          Powered by EmailJS
                        </p>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="history" className="mt-4">
                    <div className="space-y-4 max-h-[400px] overflow-y-auto p-1">
                      {!selectedInquiry.replyHistory || selectedInquiry.replyHistory.length === 0 ? (
                        <div className="text-center py-12 text-gray-500 bg-gray-50 rounded-lg">
                          <History className="w-12 h-12 mx-auto mb-3 opacity-20" />
                          <p>No replies sent yet.</p>
                        </div>
                      ) : (
                        selectedInquiry.replyHistory.map((reply, idx) => (
                          <Card key={idx} className="border-l-4 border-l-amber-500">
                            <CardHeader className="py-3 bg-gray-50/50">
                              <div className="flex justify-between items-start">
                                <div>
                                  <CardTitle className="text-sm font-bold">{reply.subject}</CardTitle>
                                  <CardDescription className="text-xs mt-1">
                                    Sent by {reply.sender} on {format(new Date(reply.date), 'PP p')} {/* 7. Ensure format is used correctly on inquiry.date */}
                                  </CardDescription>
                                </div>
                              </div>
                            </CardHeader>
                            <CardContent className="py-4 text-sm whitespace-pre-wrap">
                              {reply.body}
                            </CardContent>
                          </Card>
                        )).reverse() // Show newest first
                      )}
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminInquiries;

