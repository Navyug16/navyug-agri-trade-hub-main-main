import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from '@/hooks/use-toast';
import { Copy, ExternalLink, Mail, Trash2, X, CheckCircle, Printer, Send } from 'lucide-react';

interface Inquiry {
  id: string;
  name: string;
  email: string;
  phone?: string;
  product_interest?: string;
  message: string;
  status: 'pending' | 'in_progress' | 'resolved';
  created_at: string;
}

interface AdminInquiriesProps {
  inquiries: Inquiry[];
  onUpdateStatus: (id: string, status: 'pending' | 'in_progress' | 'resolved') => void;
  onDelete: (id: string) => void;
}

const AdminInquiries = ({ inquiries, onUpdateStatus, onDelete }: AdminInquiriesProps) => {
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);
  const [replyDraft, setReplyDraft] = useState<{
    open: boolean;
    to: string;
    subject: string;
    body: string;
    inquiryId: string | null;
  }>({
    open: false,
    to: '',
    subject: '',
    body: '',
    inquiryId: null
  });

  const getStatusBadge = (status: string) => {
    const safeStatus = status || 'pending';
    const variants: Record<string, 'default' | 'secondary' | 'destructive'> = {
      pending: 'destructive',
      in_progress: 'secondary',
      resolved: 'default'
    };
    return <Badge variant={variants[safeStatus] || 'default'}>{safeStatus.replace('_', ' ')}</Badge>;
  };

  const openReplyDraft = (inquiry: Inquiry) => {
    if (!inquiry.email) {
      toast({ title: "No Email", description: "This inquiry has no email address.", variant: "destructive" });
      return;
    }
    setReplyDraft({
      open: true,
      to: inquiry.email,
      subject: `Re: Inquiry about ${inquiry.product_interest || 'Navyug Enterprise Products'}`,
      body: `Hi ${inquiry.name || 'Customer'},\n\nThank you for your inquiry regarding ${inquiry.product_interest || 'our products'}.\n\n(Write your response here)\n\nBest Regards,\nNavyug Enterprise`,
      inquiryId: inquiry.id
    });
  };

  const handleSendMailTo = () => {
    const { to, subject, body } = replyDraft;
    window.open(`mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`, '_blank');
    setReplyDraft({ ...replyDraft, open: false });
    toast({ title: "Email Client Opened", description: "Draft copied to your default email app." });
  };

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(replyDraft.body);
    toast({ title: "Copied!", description: "Reply body copied to clipboard." });
  };

  const handleQuickReply = (inquiry: Inquiry) => {
    if (!inquiry.email) {
      toast({ title: "No Email", description: "This inquiry has no email address.", variant: "destructive" });
      return;
    }
    const subject = `Re: Inquiry about ${inquiry.product_interest || 'Navyug Enterprise Products'}`;
    const body = `Hi ${inquiry.name || 'Customer'},\n\nThank you for your inquiry regarding ${inquiry.product_interest || 'our products'}.\n\n(Write your response here)\n\nBest Regards,\nNavyug Enterprise`;

    window.open(`mailto:${inquiry.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`, '_blank');
    toast({ title: "Email Client Opened", description: "Quick reply drafted in your default email app." });
  };

  return (
    <>
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>Customer Inquiries</CardTitle>
          <CardDescription>Manage customer inquiries and contact requests.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Client Details</TableHead>
                  <TableHead>Product</TableHead>
                  <TableHead className="w-[300px]">Message</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {inquiries.map((inquiry) => (
                  <TableRow
                    key={inquiry.id}
                    className="cursor-pointer hover:bg-gray-50 bg-white"
                    onClick={() => setSelectedInquiry(inquiry)}
                  >
                    <TableCell>
                      <div className="font-medium text-gray-900">{inquiry.name || 'Unknown Name'}</div>
                      <div className="text-sm text-gray-500">{inquiry.email || 'No email'}</div>
                      {inquiry.phone && <div className="text-sm text-gray-500">{inquiry.phone}</div>}
                    </TableCell>
                    <TableCell><Badge variant="outline">{inquiry.product_interest || 'General'}</Badge></TableCell>
                    <TableCell>
                      <p className="line-clamp-2 text-sm text-gray-600">
                        {inquiry.message || 'No message content'}
                      </p>
                    </TableCell>
                    <TableCell>{getStatusBadge(inquiry.status)}</TableCell>
                    <TableCell className="whitespace-nowrap text-sm text-gray-500">
                      {inquiry.created_at ? new Date(inquiry.created_at).toLocaleDateString() : 'Unknown Date'}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2" onClick={(e) => e.stopPropagation()}>
                        <Button
                          size="sm"
                          variant="outline"
                          title="Draft & Preview Reply"
                          className="text-blue-600 border-blue-200 hover:bg-blue-50"
                          onClick={() => openReplyDraft(inquiry)}
                        >
                          <Mail className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          title="Quick Reply via Email App"
                          className="text-green-600 border-green-200 hover:bg-green-50"
                          onClick={() => handleQuickReply(inquiry)}
                        >
                          <Send className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          title="Delete Inquiry"
                          className="text-red-500 hover:text-red-700 hover:bg-red-50"
                          onClick={() => onDelete(inquiry.id)}
                        >
                          <Trash2 className="w-4 h-4" />
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
              <p>No inquiries found</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Inquiry Details Modal */}
      {selectedInquiry && (
        <div
          className="fixed inset-0 z-[9000] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200"
          onClick={() => setSelectedInquiry(null)}
        >
          <div
            className="bg-white text-gray-900 rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto flex flex-col relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b sticky top-0 bg-white z-10">
              <div>
                <h2 className="text-2xl font-bold">Inquiry Details</h2>
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
            <div className="p-6 space-y-8">
              {/* Status Bar */}
              <div className="flex flex-wrap items-center justify-between gap-4 bg-gray-50 p-4 rounded-lg border">
                <div className="flex items-center gap-3">
                  <span className="font-semibold text-sm text-gray-500 uppercase">Status:</span>
                  {getStatusBadge(selectedInquiry.status)}
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => window.print()}>
                    <Printer className="w-4 h-4 mr-2" /> Print
                  </Button>
                  {selectedInquiry.status !== 'resolved' && (
                    <Button
                      size="sm"
                      className="bg-green-600 hover:bg-green-700 text-white"
                      onClick={() => {
                        onUpdateStatus(selectedInquiry.id, 'resolved');
                        setSelectedInquiry(null);
                      }}
                    >
                      <CheckCircle className="w-4 h-4 mr-2" /> Mark Resolved
                    </Button>
                  )}
                </div>
              </div>

              {/* Customer Info Grid */}
              <div className="grid md:grid-cols-2 gap-y-6 gap-x-8">
                <div>
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1 block">Name</label>
                  <p className="text-lg font-medium text-gray-900">{selectedInquiry.name || 'N/A'}</p>
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1 block">Email</label>
                  <p
                    className="text-lg font-medium text-blue-600 hover:underline cursor-pointer"
                    onClick={() => openReplyDraft(selectedInquiry)}
                  >
                    {selectedInquiry.email || 'N/A'}
                  </p>
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1 block">Phone</label>
                  <p className="text-lg font-medium text-gray-900">{selectedInquiry.phone || 'N/A'}</p>
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1 block">Product Interest</label>
                  <p className="text-lg font-medium text-gray-900">{selectedInquiry.product_interest || 'General Inquiry'}</p>
                </div>
              </div>

              {/* Message Box */}
              <div>
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 block">Message Content</label>
                <div className="bg-gray-50 p-6 rounded-lg border text-gray-800 leading-relaxed whitespace-pre-wrap font-sans text-base">
                  {selectedInquiry.message || 'No message content provided.'}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-6 border-t bg-gray-50/50 flex justify-between items-center sticky bottom-0 backdrop-blur-md">
              <Button
                variant="ghost"
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                onClick={() => {
                  if (confirm('Delete this inquiry permanently?')) {
                    onDelete(selectedInquiry.id);
                    setSelectedInquiry(null);
                  }
                }}
              >
                <Trash2 className="w-4 h-4 mr-2" /> Delete Inquiry
              </Button>
              <Button
                className="bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-200"
                onClick={() => openReplyDraft(selectedInquiry)}
              >
                <Mail className="w-4 h-4 mr-2" /> Reply via Email
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Reply Draft Modal */}
      {replyDraft.open && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200"
        >
          <div
            className="bg-white text-gray-900 rounded-xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col relative"
          >
            <div className="p-4 border-b flex justify-between items-center bg-gray-50">
              <h3 className="font-bold text-lg flex items-center gap-2">
                <Mail className="w-5 h-5 text-blue-600" /> Draft Reply
              </h3>
              <button
                onClick={() => setReplyDraft({ ...replyDraft, open: false })}
                className="p-1 hover:bg-gray-200 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500 uppercase">To:</label>
                <div className="p-2 bg-gray-100 rounded border text-sm">{replyDraft.to}</div>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500 uppercase">Subject:</label>
                <input
                  className="w-full p-2 border rounded text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                  value={replyDraft.subject}
                  onChange={(e) => setReplyDraft({ ...replyDraft, subject: e.target.value })}
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500 uppercase">Message:</label>
                <textarea
                  className="w-full p-2 border rounded text-sm h-40 focus:ring-2 focus:ring-blue-500 outline-none resize-none font-sans"
                  value={replyDraft.body}
                  onChange={(e) => setReplyDraft({ ...replyDraft, body: e.target.value })}
                />
              </div>
            </div>

            <div className="p-4 border-t bg-gray-50/50 flex justify-end gap-2">
              <Button variant="ghost" onClick={() => handleCopyToClipboard()}>
                <Copy className="w-4 h-4 mr-2" /> Copy Text
              </Button>
              <Button onClick={handleSendMailTo} className="bg-blue-600 hover:bg-blue-700 text-white">
                <ExternalLink className="w-4 h-4 mr-2" /> Open Mail App
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AdminInquiries;
