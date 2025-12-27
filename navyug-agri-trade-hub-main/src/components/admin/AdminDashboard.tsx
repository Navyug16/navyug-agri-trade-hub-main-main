import React, { useState, useEffect } from 'react';
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
  product_interest?: string;
  message: string;
  status: 'pending' | 'in_progress' | 'resolved';
  created_at: string;
}

interface Product {
  id: string;
  name: string;
  type: string;
  image: string;
  description: string;
  longDescription?: string;
  varieties?: string[];
  specifications?: Record<string, string>;
  features?: string[];
}

// Extracted component to avoid re-rendering issues
// Extracted component to avoid re-rendering issues
const ProductDialogForm = ({
  title,
  currentProduct,
  setCurrentProduct,
  handleSaveProduct,
  handleFileChange,
  saving,
  onCancel,
  isEditMode
}: {
  title: string;
  currentProduct: Partial<Product>;
  setCurrentProduct: React.Dispatch<React.SetStateAction<Partial<Product>>>;
  handleSaveProduct: (e: React.FormEvent) => Promise<void>;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  saving: boolean;
  onCancel: () => void;
  isEditMode: boolean;
}) => {
  const [newVariety, setNewVariety] = useState("");
  const [newFeature, setNewFeature] = useState("");
  const [newSpecKey, setNewSpecKey] = useState("");
  const [newSpecValue, setNewSpecValue] = useState("");

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
            <Label htmlFor="type">Type/Category</Label>
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
          <Label>Product Image</Label>
          <div className="flex items-center gap-4">
            {currentProduct.image && (
              <img src={currentProduct.image} alt="Preview" className="h-20 w-20 object-cover rounded border" />
            )}
            <Input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
            />
          </div>
          <p className="text-xs text-muted-foreground mt-1">Or enter URL manually:</p>
          <Input
            value={currentProduct.image || ''}
            onChange={(e) => setCurrentProduct((prev) => ({ ...prev, image: e.target.value }))}
            placeholder="https://..."
            className="mt-1"
          />
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
            {(!currentProduct.varieties || currentProduct.varieties.length === 0) && <span className="text-sm text-gray-400 italic">No varieties added</span>}
          </div>
        </div>

        {/* Features Section */}
        <div className="space-y-3 p-4 border rounded-lg bg-gray-50">
          <Label className="text-base font-semibold">Key Features</Label>
          <div className="flex gap-2">
            <Input
              placeholder="Add feature (e.g. Intense Aroma)"
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
            {(!currentProduct.features || currentProduct.features.length === 0) && <span className="text-sm text-gray-400 italic">No features added</span>}
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
                <div className="flex gap-2">
                  <span className="font-semibold">{key}:</span>
                  <span>{value}</span>
                </div>
                <button type="button" onClick={() => removeSpec(key)} className="text-gray-500 hover:text-red-500"><Trash2 className="h-4 w-4" /></button>
              </div>
            ))}
            {(!currentProduct.specifications || Object.keys(currentProduct.specifications).length === 0) && <span className="text-sm text-gray-400 italic">No specifications added</span>}
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

// ProductDialogForm component ends

const AdminDashboard = () => {
  const { admin, logout } = useAdminAuth();
  const { toast } = useToast();
  const [searchParams, setSearchParams] = useSearchParams();

  const activeTab = searchParams.get('tab') || 'overview';

  const setActiveTab = (tab: string) => {
    setSearchParams({ tab });
  };

  // Stats state removed in favor of derived stats

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
  // Removed duplicate state declaration

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
          status: data.status,
          created_at: data.created_at?.toDate().toISOString() || new Date().toISOString()
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const img = new Image();
      const reader = new FileReader();

      reader.onload = (e) => {
        img.src = e.target?.result as string;
      };

      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        const MAX_WIDTH = 800;
        const MAX_HEIGHT = 800;

        // Resize logic
        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);

          // Convert to WebP with 0.7 quality
          const webpDataUrl = canvas.toDataURL('image/webp', 0.7);
          setCurrentProduct(prev => ({ ...prev, image: webpDataUrl }));
          toast({ title: "Image Compressed", description: "Image converted to WebP and resized." });
        }
      };

      reader.readAsDataURL(file);
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
    try {
      await deleteDoc(doc(db, "inquiries", id));
      setInquiries(inquiries.filter(i => i.id !== id));
      toast({ title: "Inquiry deleted", description: "Inquiry has been deleted successfully" });
    } catch (error) {
      console.error("Error deleting inquiry: ", error);
      toast({ title: "Error", description: "Failed to delete inquiry", variant: "destructive" });
    }
  };

  const updateInquiryStatus = async (id: string, status: 'pending' | 'in_progress' | 'resolved') => {
    try {
      const inquiryRef = doc(db, "inquiries", id);
      await updateDoc(inquiryRef, { status, updated_at: serverTimestamp() });
      setInquiries(prev => prev.map(inq => inq.id === id ? { ...inq, status } : inq));
      toast({ title: "Status updated", description: "Inquiry status updated." });
    } catch (error) {
      console.error("Error updating status: ", error);
      toast({ title: "Error", description: "Failed to update status", variant: "destructive" });
    }
  };

  // Stats are derived from state
  const stats = {
    totalInquiries: inquiries.length,
    pendingInquiries: inquiries.filter(i => i.status === 'pending').length,
    totalProducts: products.length,
    resolvedInquiries: inquiries.filter(i => i.status === 'resolved').length,
  };

  if (loading) return <div className="flex items-center justify-center min-h-screen">Loading...</div>;


  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader adminName={admin?.name} onLogout={logout} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AdminNavigation
          activeTab={activeTab as 'overview' | 'inquiries' | 'products'}
          onTabChange={setActiveTab}
          pendingInquiries={stats.pendingInquiries}
        />

        {activeTab === 'overview' && (
          <AdminOverview
            stats={stats}
            onInquiryClick={() => setActiveTab('inquiries')}
            onProductClick={() => setActiveTab('products')}
          />
        )}
        {activeTab === 'inquiries' && (
          <div className="relative z-10">
            <AdminInquiries inquiries={inquiries} onUpdateStatus={updateInquiryStatus} onDelete={handleDeleteInquiry} />
          </div>
        )}
        {activeTab === 'products' && (
          <div>
            <div className="flex justify-between mb-4">
              <h2 className="text-xl font-bold">Products List</h2>
              <div className="space-x-2">
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
                    handleFileChange={handleFileChange}
                    saving={saving}
                    onCancel={() => setIsAddProductOpen(false)}
                    isEditMode={false}
                  />
                </Dialog>

                <Dialog open={isEditProductOpen} onOpenChange={setIsEditProductOpen}>
                  <ProductDialogForm
                    title="Edit Product"
                    currentProduct={currentProduct}
                    setCurrentProduct={setCurrentProduct}
                    handleSaveProduct={handleSaveProduct}
                    handleFileChange={handleFileChange}
                    saving={saving}
                    onCancel={() => setIsEditProductOpen(false)}
                    isEditMode={true}
                  />
                </Dialog>
              </div>
            </div>
            <AdminProducts
              products={products}
              onDelete={handleDeleteProduct}
              onEdit={startEditProduct}
              onMove={handleMoveProduct}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
