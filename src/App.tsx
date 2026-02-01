import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AdminAuthProvider } from "@/contexts/AdminAuthContext";
import React, { useEffect, Suspense } from "react";

// Lazy load pages
const Index = React.lazy(() => import("./pages/Index"));
const About = React.lazy(() => import("./pages/About"));
const Products = React.lazy(() => import("./pages/Products"));
const Contact = React.lazy(() => import("./pages/Contact"));
const AdminPage = React.lazy(() => import("./pages/AdminPage"));
const ProductDetails = React.lazy(() => import("./pages/ProductDetails"));
const Blog = React.lazy(() => import("./pages/Blog"));
const BlogPost = React.lazy(() => import("./pages/BlogPost"));
const NotFound = React.lazy(() => import("./pages/NotFound"));

const queryClient = new QueryClient();

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
  }, []);

  return null;
};

const LoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-600"></div>
  </div>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AdminAuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <ScrollToTop />
          <Suspense fallback={<LoadingFallback />}>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/about" element={<About />} />
              <Route path="/products" element={<Products />} />
              <Route path="/contact" element={<Contact />} />
              {/* TestAdmin route removed */}
              <Route path="/admin" element={<AdminPage />} />
              <Route path="/product/:id" element={<ProductDetails />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/blog/:id" element={<BlogPost />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </AdminAuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
