
import React, { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, Timestamp } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from "@/components/ui/label";
import { Plus, Pencil, Trash2, X, Loader2, Upload, ExternalLink } from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from '@/hooks/use-toast';

interface Blog {
    id: string;
    title: string;
    excerpt: string;
    content: string;
    image: string;
    author: string;
    created_at: any;
}

const AdminBlogs = () => {
    const [blogs, setBlogs] = useState<Blog[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const { toast } = useToast();

    const [currentBlog, setCurrentBlog] = useState<Partial<Blog>>({
        title: '',
        excerpt: '',
        content: '',
        image: '',
        author: 'Admin'
    });

    useEffect(() => {
        fetchBlogs();
    }, []);

    const fetchBlogs = async () => {
        setLoading(true);
        try {
            const querySnapshot = await getDocs(collection(db, "blogs"));
            const fetchedBlogs: Blog[] = [];
            querySnapshot.forEach((doc) => {
                fetchedBlogs.push({ id: doc.id, ...doc.data() } as Blog);
            });
            // Sort by newest
            fetchedBlogs.sort((a, b) => {
                const dateA = a.created_at?.toDate ? a.created_at.toDate() : new Date(a.created_at);
                const dateB = b.created_at?.toDate ? b.created_at.toDate() : new Date(b.created_at);
                return dateB.getTime() - dateA.getTime();
            });
            setBlogs(fetchedBlogs);
        } catch (error) {
            console.error("Error fetching blogs:", error);
            toast({ title: "Error", description: "Failed to fetch blogs", variant: "destructive" });
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            const blogData = {
                title: currentBlog.title,
                excerpt: currentBlog.excerpt,
                content: currentBlog.content,
                image: currentBlog.image,
                author: currentBlog.author,
                updated_at: Timestamp.now()
            };

            if (currentBlog.id) {
                await updateDoc(doc(db, "blogs", currentBlog.id), blogData);
                toast({ title: "Success", description: "Blog updated successfully" });
            } else {
                await addDoc(collection(db, "blogs"), {
                    ...blogData,
                    created_at: Timestamp.now()
                });
                toast({ title: "Success", description: "Blog created successfully" });
            }
            setIsDialogOpen(false);
            fetchBlogs();
            setCurrentBlog({ title: '', excerpt: '', content: '', image: '', author: 'Admin' });
        } catch (error) {
            console.error("Error saving blog:", error);
            toast({ title: "Error", description: "Failed to save blog", variant: "destructive" });
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm("Are you sure you want to delete this blog?")) return;
        try {
            await deleteDoc(doc(db, "blogs", id));
            setBlogs(blogs.filter(b => b.id !== id));
            toast({ title: "Success", description: "Blog deleted successfully" });
        } catch (error) {
            console.error("Error deleting blog:", error);
            toast({ title: "Error", description: "Failed to delete blog", variant: "destructive" });
        }
    };

    const startEdit = (blog: Blog) => {
        setCurrentBlog(blog);
        setIsDialogOpen(true);
    };

    const startAdd = () => {
        setCurrentBlog({ title: '', excerpt: '', content: '', image: '', author: 'Admin' });
        setIsDialogOpen(true);
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Manage Blogs</h2>
                <Button onClick={startAdd}>
                    <Plus className="mr-2 h-4 w-4" /> Add New Blog
                </Button>
            </div>

            {loading ? (
                <div>Loading...</div>
            ) : (
                <div className="grid gap-4">
                    {blogs.length === 0 ? (
                        <div className="text-center py-10 text-gray-500">No blogs found. Create one!</div>
                    ) : (
                        blogs.map(blog => (
                            <div key={blog.id} className="bg-white p-4 rounded-lg shadow border flex flex-col md:flex-row gap-4 items-start md:items-center">
                                <div className="h-24 w-24 flex-shrink-0 bg-gray-100 rounded overflow-hidden">
                                    {blog.image ? (
                                        <img src={blog.image} alt={blog.title} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-gray-400">No Img</div>
                                    )}
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-bold text-lg">{blog.title}</h3>
                                    <p className="text-sm text-gray-500 mb-1">
                                        By {blog.author} • {blog.created_at?.toDate ? blog.created_at.toDate().toLocaleDateString() : new Date(blog.created_at).toLocaleDateString()}
                                    </p>
                                    <p className="text-sm text-gray-600 line-clamp-2">{blog.excerpt}</p>
                                </div>
                                <div className="flex gap-2">
                                    <Button variant="outline" size="sm" onClick={() => window.open(`/blog/${blog.id}`, '_blank')}>
                                        <ExternalLink className="h-4 w-4" />
                                    </Button>
                                    <Button variant="outline" size="sm" onClick={() => startEdit(blog)}>
                                        <Pencil className="h-4 w-4" />
                                    </Button>
                                    <Button variant="destructive" size="sm" onClick={() => handleDelete(blog.id)}>
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>{currentBlog.id ? 'Edit Blog' : 'Create New Blog'}</DialogTitle>
                        <DialogDescription>Add your thoughts and updates here.</DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSave} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="title">Title</Label>
                                <Input
                                    id="title"
                                    value={currentBlog.title}
                                    onChange={(e) => setCurrentBlog(prev => ({ ...prev, title: e.target.value }))}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="author">Author</Label>
                                <Input
                                    id="author"
                                    value={currentBlog.author}
                                    onChange={(e) => setCurrentBlog(prev => ({ ...prev, author: e.target.value }))}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="image">Image URL</Label>
                            <Input
                                id="image"
                                value={currentBlog.image}
                                onChange={(e) => setCurrentBlog(prev => ({ ...prev, image: e.target.value }))}
                                placeholder="https://..."
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="excerpt">Excerpt (Short Summary)</Label>
                            <Input
                                id="excerpt"
                                value={currentBlog.excerpt}
                                onChange={(e) => setCurrentBlog(prev => ({ ...prev, excerpt: e.target.value }))}
                                placeholder="Brief description to show on cards..."
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="content">Content (HTML or Text)</Label>
                            <Textarea
                                id="content"
                                value={currentBlog.content}
                                onChange={(e) => setCurrentBlog(prev => ({ ...prev, content: e.target.value }))}
                                className="h-64 font-mono text-sm"
                                placeholder="Write your article here..."
                                required
                            />
                            <p className="text-xs text-gray-500">Tips: Use basic HTML tags like &lt;p&gt;, &lt;b&gt;, &lt;ul&gt; for formatting if desired, though plain text works too.</p>
                        </div>

                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                            <Button type="submit" disabled={saving}>
                                {saving ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...</> : 'Save Blog'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default AdminBlogs;
