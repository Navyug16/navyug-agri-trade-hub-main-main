import { resolveImagePath } from '@/lib/utils';
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { ArrowUp, ArrowDown, Trash2, Edit } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  type: string;
  image: string;
  description: string;
}

interface AdminProductsProps {
  products: Product[];
  onDelete: (id: string) => void;
  onEdit: (product: Product) => void;
  onMove: (id: string, direction: 'up' | 'down') => void;
  headerAction?: React.ReactNode;
}

const AdminProducts = ({ products, onDelete, onEdit, onMove, headerAction }: AdminProductsProps) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Products Management</CardTitle>
          <CardDescription>View and manage your products</CardDescription>
        </div>
        {headerAction}
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order</TableHead>
              <TableHead>Image</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product, index) => (
              <TableRow key={product.id}>
                <TableCell>
                  <div className="flex flex-col gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      disabled={index === 0}
                      onClick={() => onMove(product.id, 'up')}
                    >
                      <ArrowUp className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      disabled={index === products.length - 1}
                      onClick={() => onMove(product.id, 'down')}
                    >
                      <ArrowDown className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
                <TableCell>
                  <img src={resolveImagePath(product.image)} alt={product.name} className="w-10 h-10 object-cover rounded" />
                </TableCell>
                <TableCell className="font-medium">{product.name}</TableCell>
                <TableCell>{product.type}</TableCell>
                <TableCell className="max-w-xs truncate" title={product.description}>
                  {product.description}
                </TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" onClick={() => onEdit(product)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="destructive" size="sm" onClick={() => onDelete(product.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {products.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No products found
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AdminProducts;
