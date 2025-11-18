import React from 'react';
import { motion } from 'framer-motion';
import { Edit, Trash2, Eye } from 'lucide-react';

const ProductTable = ({ products, onEdit, onDelete, loading }) => {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-red"></div>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-12 text-gray-400">
        <p className="text-lg">No products found</p>
        <p className="text-sm mt-2">Add your first product to get started</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="text-gray-400 border-b border-gray-800">
            <th className="py-3 pr-4">Image</th>
            <th className="py-3 pr-4">Name</th>
            <th className="py-3 pr-4">Price</th>
            <th className="py-3 pr-4">Category</th>
            <th className="py-3 pr-4">Brand</th>
            <th className="py-3 pr-4">Stock</th>
            <th className="py-3 pr-4">Status</th>
            <th className="py-3 pr-4">Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <motion.tr
              key={product.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="border-b border-gray-800 hover:bg-gray-800/50 transition-colors"
            >
              <td className="py-3 pr-4">
                {product.image ? (
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-12 h-12 object-cover rounded-lg"
                  />
                ) : (
                  <div className="w-12 h-12 bg-gray-800 rounded-lg flex items-center justify-center">
                    <Eye size={20} className="text-gray-600" />
                  </div>
                )}
              </td>
              <td className="py-3 pr-4 text-white font-medium">{product.name}</td>
              <td className="py-3 pr-4 text-white">₹{Number(product.price || 0).toFixed(2)}</td>
              <td className="py-3 pr-4 text-gray-300">{product.category || '-'}</td>
              <td className="py-3 pr-4 text-gray-300">{product.brand || '-'}</td>
              <td className="py-3 pr-4 text-gray-300">{product.stock || 0}</td>
              <td className="py-3 pr-4">
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    product.inStock
                      ? 'bg-green-900/30 text-green-400'
                      : 'bg-red-900/30 text-red-400'
                  }`}
                >
                  {product.inStock ? 'In Stock' : 'Out of Stock'}
                </span>
              </td>
              <td className="py-3 pr-4">
                <div className="flex gap-2">
                  <button
                    onClick={() => onEdit(product)}
                    className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
                    title="Edit"
                  >
                    <Edit size={16} className="text-blue-400" />
                  </button>
                  <button
                    onClick={() => onDelete(product.id)}
                    className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
                    title="Delete"
                  >
                    <Trash2 size={16} className="text-red-400" />
                  </button>
                </div>
              </td>
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductTable;
