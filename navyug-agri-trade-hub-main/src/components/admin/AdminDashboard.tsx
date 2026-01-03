import React, { useState, useEffect } from 'react';
import AdminPipeline from './AdminPipeline';
import { useSearchParams } from 'react-router-dom';
import { useAdminAuth } from '@/contexts/AdminAuthContext';
import { db } from '@/lib/firebase';
import {
  collection,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
  query,
  serverTimestamp,
  setDoc,
  addDoc
} from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import AdminHeader from './AdminHeader';
import AdminNavigation from './AdminNavigation';
import AdminOverview from './AdminOverview';
import AdminInquiries from './AdminInquiries';
import AdminProducts from './AdminProducts';
import AdminBlogs from './AdminBlogs';
import { products as staticProducts } from '@/data/products';
import { Button } from '@/components/ui/button';
import { Plus, Upload, Loader2, X, Trash2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface Inquiry {
  id: string;
  name: string;
  email: string;
  phone?: string;
  product_interest: string;
  message: string;
  status: 'pending' | 'in_progress' | 'closed' | 'closed_won' | 'closed_lost' | 'ghosted';
  dealValue?: number;
  notes?: string;
  created_at: string;
  date: any;
  time_string: string;
  isDeleted?: boolean;
  labels?: string[];
}

interface Product {
  id: string;
  name: string;
  type: string;
  image: string; // Primary image for list view
  images?: string[]; // Gallery images
  description: string;
  longDescription?: string;
  varieties?: string[];
  specifications?: Record<string, string>;
  features?: string[];
}

// ProductDialogForm component
const ProductDialogForm = ({
  title,
  currentProduct,
  setCurrentProduct,
  handleSaveProduct,
  saving,
  onCancel,
  isEditMode
}: {
  title: string;
  currentProduct: Partial<Product>;
  setCurrentProduct: React.Dispatch<React.SetStateAction<Partial<Product>>>;
  handleSaveProduct: (e: React.FormEvent) => Promise<void>;
  saving: boolean;
  onCancel: () => void;
  isEditMode: boolean;
}) => {
  const [newVariety, setNewVariety] = useState("");
  const [newFeature, setNewFeature] = useState("");
  const [newSpecKey, setNewSpecKey] = useState("");
  const [newSpecValue, setNewSpecValue] = useState("");
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);

      files.forEach(file => {
        const reader = new FileReader();
        reader.onload = (ev) => {
          const img = new Image();
          img.src = ev.target?.result as string;
          img.onload = () => {
            // Resize logic
            const canvas = document.createElement('canvas');
            let width = img.width;
            let height = img.height;
            const MAX_WIDTH = 800;
            const MAX_HEIGHT = 800;

            if (width > height) {
              if (width > MAX_WIDTH) { height *= MAX_WIDTH / width; width = MAX_WIDTH; }
            } else {
              if (height > MAX_HEIGHT) { width *= MAX_HEIGHT / height; height = MAX_HEIGHT; }
            }

            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d');
            if (ctx) {
              ctx.drawImage(img, 0, 0, width, height);
              const webpDataUrl = canvas.toDataURL('image/webp', 0.7);

              setCurrentProduct(prev => {
                const currentImages = prev.images || (prev.image ? [prev.image] : []);
                const newImages = [...currentImages, webpDataUrl];
                return {
                  ...prev,
                  images: newImages,
                  image: newImages[0] // Always ensure primary image is set
                };
              });
            }
          };
        };
        reader.readAsDataURL(file);
      });
      toast({ title: "Images Added", description: `${files.length} images processed.` });
    }
  };

  const removeImage = (index: number) => {
    setCurrentProduct(prev => {
      const currentImages = prev.images || [];
      const newImages = currentImages.filter((_, i) => i !== index);
      return {
        ...prev,
        images: newImages,
        image: newImages.length > 0 ? newImages[0] : '' // Update primary image
      };
    });
  };

  const addVariety = () => {
    if (!newVariety.trim()) return;
    setCurrentProduct(prev => ({
      ...prev,
      varieties: [...(prev.varieties || []), newVariety.trim()]
    }));
    setNewVariety("");
  };

  const removeVariety = (index: number) => {
    setCurrentProduct(prev => ({
      ...prev,
      varieties: (prev.varieties || []).filter((_, i) => i !== index)
    }));
  };

  const addFeature = () => {
    if (!newFeature.trim()) return;
    setCurrentProduct(prev => ({
      ...prev,
      features: [...(prev.features || []), newFeature.trim()]
    }));
    setNewFeature("");
  };

  const removeFeature = (index: number) => {
    setCurrentProduct(prev => ({
      ...prev,
      features: (prev.features || []).filter((_, i) => i !== index)
    }));
  };

  const addSpec = () => {
    if (!newSpecKey.trim() || !newSpecValue.trim()) return;
    setCurrentProduct(prev => ({
      ...prev,
      specifications: { ...(prev.specifications || {}), [newSpecKey.trim()]: newSpecValue.trim() }
    }));
    setNewSpecKey("");
    setNewSpecValue("");
  };

  const removeSpec = (key: string) => {
    const newSpecs = { ...(currentProduct.specifications || {}) };
    delete newSpecs[key];
    setCurrentProduct(prev => ({ ...prev, specifications: newSpecs }));
  };

  return (
    <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle>{title}</DialogTitle>
        <DialogDescription>Fill in the product details below. All fields are customizable.</DialogDescription>
      </DialogHeader>
      <form onSubmit={handleSaveProduct} className="space-y-6">

        {/* Basic Info */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="id">Product ID (Slug)</Label>
            <Input
              id="id"
              placeholder="e.g. groundnut"
              value={currentProduct.id || ''}
              onChange={(e) => setCurrentProduct((prev) => ({ ...prev, id: e.target.value }))}
              disabled={isEditMode}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="type">Type (e.g. Oil Seed)</Label>
            <Input
              id="type"
              placeholder="e.g. Oil Seed"
              value={currentProduct.type || ''}
              onChange={(e) => setCurrentProduct((prev) => ({ ...prev, type: e.target.value }))}
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="name">Product Name</Label>
          <Input
            id="name"
            value={currentProduct.name || ''}
            onChange={(e) => setCurrentProduct((prev) => ({ ...prev, name: e.target.value }))}
            required
          />
        </div>

        {/* Image Upload */}
        <div className="space-y-2">
          <Label>Product Images (First one is cover)</Label>
          <div className="grid grid-cols-4 gap-4 mb-2">
            {currentProduct.images && currentProduct.images.length > 0 ? (
              currentProduct.images.map((img, idx) => (
                <div key={idx} className="relative group aspect-square">
                  <img src={img} alt={`Product ${idx}`} className="w-full h-full object-cover rounded border" />
                  <button
                    type="button"
                    onClick={() => removeImage(idx)}
                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-3 h-3" />
                  </button>
                  {idx === 0 && <span className="absolute bottom-1 left-1 bg-black/60 text-white text-[10px] px-1 rounded">Cover</span>}
                </div>
              ))
            ) : (
              currentProduct.image && (
                <div className="relative group aspect-square">
                  <img src={currentProduct.image} alt="Preview" className="w-full h-full object-cover rounded border" />
                  <button
                    type="button"
                    onClick={() => setCurrentProduct(prev => ({ ...prev, image: '', images: [] }))}
                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-100"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              )
            )}

            <label className="flex flex-col items-center justify-center border-2 border-dashed rounded-lg cursor-pointer hover:bg-gray-50 aspect-square">
              <Upload className="h-6 w-6 text-gray-400" />
              <span className="text-xs text-gray-500 mt-1">Add</span>
              <input type="file" className="hidden" accept="image/*" multiple onChange={handleFileChange} />
            </label>
          </div>
          <div className="flex gap-2">
            <Input
              value={currentProduct.image || ''}
              onChange={(e) => setCurrentProduct((prev) => ({ ...prev, image: e.target.value }))}
              placeholder="Enter URL manually for Cover Image..."
              className="mt-1"
            />
          </div>
        </div>

        {/* Descriptions */}
        <div className="space-y-2">
          <Label htmlFor="description">Short Description (List View)</Label>
          <Textarea
            id="description"
            value={currentProduct.description || ''}
            onChange={(e) => setCurrentProduct((prev) => ({ ...prev, description: e.target.value }))}
            required
            className="h-20"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="longDescription">Long Description (Detail View)</Label>
          <Textarea
            id="longDescription"
            value={currentProduct.longDescription || ''}
            onChange={(e) => setCurrentProduct((prev) => ({ ...prev, longDescription: e.target.value }))}
            className="h-32"
          />
        </div>

        {/* Varieties Section */}
        <div className="space-y-3 p-4 border rounded-lg bg-gray-50">
          <Label className="text-base font-semibold">Available Varieties</Label>
          <div className="flex gap-2">
            <Input
              placeholder="Add variety (e.g. Eagle)"
              value={newVariety}
              onChange={(e) => setNewVariety(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addVariety(); } }}
            />
            <Button type="button" onClick={addVariety} size="icon"><Plus className="h-4 w-4" /></Button>
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            {currentProduct.varieties?.map((v, i) => (
              <div key={i} className="flex items-center bg-white border px-3 py-1 rounded-full text-sm">
                <span>{v}</span>
                <button type="button" onClick={() => removeVariety(i)} className="ml-2 text-gray-500 hover:text-red-500"><X className="h-3 w-3" /></button>
              </div>
            ))}
          </div>
        </div>

        {/* Features Section */}
        <div className="space-y-3 p-4 border rounded-lg bg-gray-50">
          <Label className="text-base font-semibold">Key Features</Label>
          <div className="flex gap-2">
            <Input
              placeholder="Add feature (e.g. Aroma)"
              value={newFeature}
              onChange={(e) => setNewFeature(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addFeature(); } }}
            />
            <Button type="button" onClick={addFeature} size="icon"><Plus className="h-4 w-4" /></Button>
          </div>
          <div className="grid grid-cols-2 gap-2 mt-2">
            {currentProduct.features?.map((f, i) => (
              <div key={i} className="flex items-center justify-between bg-white border px-3 py-2 rounded text-sm">
                <span>{f}</span>
                <button type="button" onClick={() => removeFeature(i)} className="text-gray-500 hover:text-red-500"><X className="h-4 w-4" /></button>
              </div>
            ))}
          </div>
        </div>

        {/* Specifications Section */}
        <div className="space-y-3 p-4 border rounded-lg bg-gray-50">
          <Label className="text-base font-semibold">Specifications</Label>
          <div className="flex gap-2">
            <Input
              placeholder="Key (e.g. Purity)"
              value={newSpecKey}
              onChange={(e) => setNewSpecKey(e.target.value)}
            />
            <Input
              placeholder="Value (e.g. 99% Min)"
              value={newSpecValue}
              onChange={(e) => setNewSpecValue(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addSpec(); } }}
            />
            <Button type="button" onClick={addSpec} size="icon"><Plus className="h-4 w-4" /></Button>
          </div>
          <div className="space-y-2 mt-2">
            {currentProduct.specifications && Object.entries(currentProduct.specifications).map(([key, value]) => (
              <div key={key} className="flex items-center justify-between bg-white border px-3 py-2 rounded text-sm">
                <span className="font-semibold">{key}: <span className="font-normal">{value}</span></span>
                <button type="button" onClick={() => removeSpec(key)} className="text-gray-500 hover:text-red-500"><Trash2 className="h-4 w-4" /></button>
              </div>
            ))}
          </div>
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
          <Button type="submit" disabled={saving}>
            {saving ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...</> : 'Save Product'}
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
};



import AddInquiryDialog from './AddInquiryDialog';

const AdminDashboard = () => {
  const { admin, logout } = useAdminAuth();
  const { toast } = useToast();
  const [searchParams, setSearchParams] = useSearchParams();

  const activeTab = searchParams.get('tab') || 'overview';

  const setActiveTab = (tab: string) => {
    setSearchParams({ tab });
  };

  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Dialog states
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [isEditProductOpen, setIsEditProductOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<Partial<Product>>({
    name: '',
    type: '',
    image: '',
    description: '',
    longDescription: '',
    varieties: [],
    specifications: {},
    features: []
  });

  const handleUpdateLabels = async (id: string, labels: string[]) => {
    try {
      const inquiryRef = doc(db, "inquiries", id);
      await updateDoc(inquiryRef, { labels });
      setInquiries(prev => prev.map(i => i.id === id ? { ...i, labels } : i));
      toast({ title: "Labels Updated", description: "Inquiry labels saved." });
    } catch (error) {
      console.error("Error updating labels:", error);
      toast({ title: "Error", description: "Failed to update labels", variant: "destructive" });
    }
  };

  // Add Inquiry State
  const [isAddInquiryOpen, setIsAddInquiryOpen] = useState(false);
  const [initialInquiryStatus, setInitialInquiryStatus] = useState('pending');

  const startAddInquiry = (status: string) => {
    setInitialInquiryStatus(status);
    setIsAddInquiryOpen(true);
  };

  const handleSaveNewInquiry = async (data: any) => {
    try {
      const docRef = await addDoc(collection(db, "inquiries"), data);
      const newInquiry = { id: docRef.id, ...data };
      setInquiries(prev => [newInquiry, ...prev]);
      toast({ title: "Inquiry Added", description: "New lead added to pipeline." });
    } catch (error) {
      console.error("Error adding inquiry:", error);
      toast({ title: "Error", description: "Failed to add inquiry.", variant: "destructive" });
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Parallelize fetching inquiries and products
      const inquiriesRef = collection(db, "inquiries");
      const qInquiries = query(inquiriesRef);
      const productsRef = collection(db, "products");

      const [inquiriesSnapshot, productsSnapshot] = await Promise.all([
        getDocs(qInquiries),
        getDocs(productsRef)
      ]);

      // Process Inquiries
      const fetchedInquiries: Inquiry[] = inquiriesSnapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          name: data.name,
          email: data.email,
          phone: data.phone,
          product_interest: data.product_interest,
          message: data.message,
          status: data.status || 'pending',
          dealValue: data.dealValue || 0,
          notes: data.notes || '',
          created_at: data.created_at?.toDate().toISOString() || new Date().toISOString(),
          isDeleted: data.isDeleted || false,
        } as Inquiry;
      });
      // Sort inquiries (newest first)
      fetchedInquiries.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      setInquiries(fetchedInquiries);

      // Process Products
      if (!productsSnapshot.empty) {
        let fetchedProducts: Product[] = productsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data()
        } as Product));

        // Sort by 'order'
        fetchedProducts.sort((a: any, b: any) => {
          const orderA = a.order ?? 9999;
          const orderB = b.order ?? 9999;
          return orderA - orderB;
        });

        setProducts(fetchedProducts);
      } else {
        setProducts([]);
      }

    } catch (error: any) {
      console.error("Error fetching data: ", error);
      if (error.code === 'permission-denied') {
        toast({
          title: "Permission Denied",
          description: "Check Firestore Security Rules.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Error fetching data",
          description: error.message,
          variant: "destructive",
        });
      }
    } finally {
      setLoading(false);
      setSaving(false);
    }
  };

  const handleSeedProducts = async () => {
    setLoading(true);
    try {
      for (const product of staticProducts) {
        await setDoc(doc(db, "products", product.id), product);
      }
      toast({ title: "Success", description: "Products seeded successfully." });
      fetchData();
    } catch (error: any) {
      console.error("Seeding error:", error);
      toast({ title: "Error", description: "Failed to seed products.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleMoveProduct = async (id: string, direction: 'up' | 'down') => {
    const currentIndex = products.findIndex(p => p.id === id);
    if (currentIndex === -1) return;

    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    if (newIndex < 0 || newIndex >= products.length) return;

    // optimistically update state
    const newProducts = [...products];
    const temp = newProducts[currentIndex];
    newProducts[currentIndex] = newProducts[newIndex];
    newProducts[newIndex] = temp;
    setProducts(newProducts);

    try {
      // Update both documents with new order index
      const productA = newProducts[currentIndex];
      const productB = newProducts[newIndex];

      // Ensure they have order property
      await updateDoc(doc(db, "products", productA.id), { order: currentIndex });
      await updateDoc(doc(db, "products", productB.id), { order: newIndex });

      toast({ title: "Reordered", description: "Product order updated" });
    } catch (err) {
      console.error("Failed to reorder", err);
      fetchData(); // revert on error
    }
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const productData = {
        ...currentProduct,
        order: currentProduct.id ? (products.find(p => p.id === currentProduct.id) as any)?.order ?? products.length : products.length,
        varieties: currentProduct.varieties || [],
        specifications: currentProduct.specifications || {},
        features: currentProduct.features || []
      };

      if (isEditProductOpen && currentProduct.id) {
        // Update
        await updateDoc(doc(db, "products", currentProduct.id), productData);
        toast({ title: "Product Updated", description: "Product updated successfully." });
      } else {
        // Create
        // If ID is provided manually, use setDoc, else addDoc
        if (currentProduct.id) {
          await setDoc(doc(db, "products", currentProduct.id), productData);
        } else {
          await addDoc(collection(db, "products"), productData);
        }
        toast({ title: "Product Added", description: "New product added successfully." });
      }

      setIsAddProductOpen(false);
      setIsEditProductOpen(false);
      setCurrentProduct({});
      fetchData();
    } catch (error: any) {
      console.error("Error saving product:", error);
      toast({ title: "Error", description: "Failed to save product. File might be too large.", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      await deleteDoc(doc(db, "products", id));
      setProducts(products.filter(p => p.id !== id));
      toast({ title: "Product Deleted", description: "Product removed successfully." });
    } catch (error) {
      console.error("Error deleting product:", error);
      toast({ title: "Error", description: "Failed to delete product.", variant: "destructive" });
    }
  };

  const startEditProduct = (product: Product) => {
    setCurrentProduct(product);
    setIsEditProductOpen(true);
  };

  const startAddProduct = () => {
    setCurrentProduct({
      id: '',
      name: '',
      type: '',
      image: '',
      description: '',
      longDescription: '',
      varieties: [],
      specifications: {},
      features: []
    });
    setIsAddProductOpen(true);
  };

  const handleDeleteInquiry = async (id: string) => {
    if (!window.confirm("Are you sure? This will permanently delete the inquiry.")) return;
    try {
      await deleteDoc(doc(db, "inquiries", id));
      setInquiries(prev => prev.filter(i => i.id !== id));
      toast({ title: "Inquiry Deleted", description: "Inquiry has been permanently removed." });
    } catch (error) {
      console.error("Error deleting inquiry: ", error);
      toast({ title: "Error", description: "Failed to delete inquiry", variant: "destructive" });
    }
  };

  const handleUpdateInquiry = async (id: string, updates: Partial<Inquiry>) => {
    try {
      const inquiryRef = doc(db, "inquiries", id);
      const dataToUpdate = { ...updates, updated_at: serverTimestamp() };
      await updateDoc(inquiryRef, dataToUpdate);

      setInquiries(prev => prev.map(inq =>
        inq.id === id ? { ...inq, ...updates } : inq
      ));

      toast({ title: "Inquiry Updated", description: "Changes saved successfully." });
    } catch (error) {
      console.error("Error updating inquiry: ", error);
      toast({ title: "Error", description: "Failed to update inquiry", variant: "destructive" });
    }
  };

  // Stats are derived from state
  const [dateRange, setDateRange] = useState<'all' | 'today' | 'week' | 'month'>('all');

  const getFilteredInquiries = () => {
    if (dateRange === 'all') return inquiries;

    const now = new Date();
    const startOfDay = new Date(now.setHours(0, 0, 0, 0));

    return inquiries.filter(inquiry => {
      const inquiryDate = new Date(inquiry.created_at);
      if (dateRange === 'today') {
        return inquiryDate >= startOfDay;
      }
      if (dateRange === 'week') {
        const weekAgo = new Date(now);
        weekAgo.setDate(now.getDate() - 7);
        return inquiryDate >= weekAgo;
      }
      if (dateRange === 'month') {
        const monthAgo = new Date(now);
        monthAgo.setMonth(now.getMonth() - 1);
        return inquiryDate >= monthAgo;
      }
      return true;
    });
  };

  // filteredInquiries contains ALL (including deleted) matching the date range
  const filteredInquiries = getFilteredInquiries();
  // activeInquiries contains ONLY VISIBLE (non-deleted) matching the date range
  const activeInquiries = filteredInquiries.filter(i => !i.isDeleted);

  const handleExportCSV = () => {
    const headers = ['ID', 'Name', 'Email', 'Phone', 'Product', 'Message', 'Status', 'Deal Value', 'Date', 'Notes'];
    const csvContent = [
      headers.join(','),
      ...activeInquiries.map(i => [
        i.id,
        `"${i.name}"`,
        i.email,
        i.phone,
        `"${i.product_interest}"`,
        `"${i.message?.replace(/"/g, '""')}"`, // Escape quotes
        i.status,
        i.dealValue || 0,
        new Date(i.created_at).toLocaleDateString(),
        `"${(i.notes || '').replace(/"/g, '""')}"`
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `inquiries_export_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    toast({ title: "Export Complete", description: "Inquiries downloaded as CSV." });
  };

  // Stats are derived from filtered state
  const stats = {
    totalInquiries: filteredInquiries.length, // Show TOTAL traffic in the card (including deleted) as per user request
    pendingInquiries: activeInquiries.filter(i => i.status === 'pending').length, // Only active pending
    totalProducts: products.length,
    totalEarnings: activeInquiries.reduce((sum, i) => sum + (i.dealValue || 0), 0), // Only active earnings
    topProducts: filteredInquiries.reduce((acc: any, curr) => {
      const product = curr.product_interest || 'Unknown';
      acc[product] = (acc[product] || 0) + 1;
      return acc;
    }, {}),
    closedInquiries: activeInquiries.filter(i => i.status === 'closed' || i.status === 'closed_won').length,
  };

  if (loading) return <div className="flex items-center justify-center min-h-screen">Loading...</div>;

  return (
    <div className="flex h-screen overflow-hidden bg-gray-100">
      {/* Sidebar Navigation */}
      <AdminNavigation
        activeTab={activeTab as 'overview' | 'inquiries' | 'products' | 'blogs' | 'pipeline'}
        onTabChange={setActiveTab}
        pendingInquiries={stats.pendingInquiries}
        onLogout={logout}
        adminName={admin?.name}
      />

      {/* Main Content Area */}
      <main className="flex-1 overflow-auto relative">
        <div className="p-8">
          {/* Header for content area */}
          <div className="flex justify-between items-center mb-6">
            {activeTab === 'inquiries' ? <div></div> : <h1 className="text-3xl font-bold text-gray-800 capitalize">{activeTab.replace('_', ' ')}</h1>}

            {/* Global Date Filter (Visible on Overview/Inquiries) */}
            {(activeTab === 'overview' || activeTab === 'inquiries') && (
              <div className="flex bg-white rounded-lg border p-1 gap-1 shadow-sm">
                {(['all', 'month', 'week', 'today'] as const).map(range => (
                  <Button
                    key={range}
                    variant={dateRange === range ? 'secondary' : 'ghost'}
                    size="sm"
                    onClick={() => setDateRange(range)}
                    className="capitalize text-xs h-8"
                  >
                    {range === 'all' ? 'All Time' : range}
                  </Button>
                ))}
              </div>
            )}

            {/* Export Button (Inquiries Only) */}

          </div>

          {activeTab === 'overview' && (
            <AdminOverview
              stats={stats}
              inquiries={filteredInquiries} // Pass ALL inquiries (including deleted) to graph
              onInquiryClick={() => setActiveTab('inquiries')}
              onProductClick={() => setActiveTab('products')}
            />
          )}

          {activeTab === 'pipeline' && (
            <div className="h-full">
              <AdminPipeline
                inquiries={activeInquiries}
                onUpdateStatus={(id, status) => handleUpdateInquiry(id, { status })}
                onUpdateLabels={handleUpdateLabels}
                onDelete={handleDeleteInquiry}
                onAddInquiry={startAddInquiry}
              />
              <AddInquiryDialog
                isOpen={isAddInquiryOpen}
                onClose={() => setIsAddInquiryOpen(false)}
                onSave={handleSaveNewInquiry}
                initialStatus={initialInquiryStatus}
              />
            </div>
          )}


          {activeTab === 'inquiries' && (
            <div className="relative z-10">
              <AdminInquiries inquiries={activeInquiries} onUpdateInquiry={handleUpdateInquiry} onDelete={handleDeleteInquiry} />
              {/* Pass only ACTIVE inquiries to list */}
            </div>
          )}

          {activeTab === 'products' && (
            <div>
              <div className="flex justify-between mb-4">
                <h2 className="text-xl font-bold sr-only">Products List</h2>
                <div className="flex gap-2 w-full justify-end">
                  {products.length === 0 && (
                    <Button variant="outline" onClick={handleSeedProducts} disabled={loading}>
                      <Upload className="mr-2 h-4 w-4" /> Seed Initial Data
                    </Button>
                  )}

                  <Dialog open={isAddProductOpen} onOpenChange={setIsAddProductOpen}>
                    <DialogTrigger asChild>
                      <Button onClick={startAddProduct}>
                        <Plus className="mr-2 h-4 w-4" /> Add Product
                      </Button>
                    </DialogTrigger>
                    <ProductDialogForm
                      title="Add New Product"
                      currentProduct={currentProduct}
                      setCurrentProduct={setCurrentProduct}
                      handleSaveProduct={handleSaveProduct}
                      saving={saving}
                      onCancel={() => {
                        setIsAddProductOpen(false);
                        setIsEditProductOpen(false);
                        setCurrentProduct({});
                      }}
                      isEditMode={!!currentProduct.id && isEditProductOpen}
                    />
                  </Dialog>
                </div>

                <AdminProducts
                  products={products}
                  onMove={handleMoveProduct}
                  onEdit={startEditProduct}
                  onDelete={handleDeleteProduct}
                />
              </div>
            </div>
          )}

          {activeTab === 'blogs' && <AdminBlogs />}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
