import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FolderTree } from 'lucide-react';
import AdminSidebar from '../../components/admin/AdminSidebar';
import CategoryBrandManager from '../../components/admin/CategoryBrandManager';
import adminFirestore from '../../utils/adminFirestore';

const AdminCategories = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      setLoading(true);
      const data = await adminFirestore.getCategories();
      setCategories(data);
    } catch (error) {
      console.error('Error loading categories:', error);
      alert('Failed to load categories');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateCategory = async (oldCategory, newCategory) => {
    try {
      await adminFirestore.updateCategory(oldCategory, newCategory);
      await loadCategories();
      alert('Category updated successfully');
    } catch (error) {
      console.error('Error updating category:', error);
      alert('Failed to update category');
    }
  };

  const handleDeleteCategory = async (category) => {
    try {
      await adminFirestore.deleteCategory(category);
      await loadCategories();
      alert('Category deleted successfully');
    } catch (error) {
      console.error('Error deleting category:', error);
      alert('Failed to delete category');
    }
  };

  const handleAddCategory = async (category) => {
    try {
      // Add a placeholder product with this category or just update the list
      // Since categories are derived from products, we'll just show a message
      alert('To add a new category, create a product with this category name.');
      await loadCategories();
    } catch (error) {
      console.error('Error adding category:', error);
      alert('Failed to add category');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-red mx-auto"></div>
          <p className="mt-4 text-gray-400">Loading categories...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black pt-20">
      <div className="flex">
        <AdminSidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
        
        <main className="flex-1 p-6 lg:p-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto"
          >
            {/* Header */}
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-2">
                <FolderTree className="text-primary-red" size={32} />
                <h1 className="text-4xl font-bold text-white">Categories</h1>
              </div>
              <p className="text-gray-400">
                Manage product categories ({categories.length} total)
              </p>
            </div>

            {/* Info Box */}
            <div className="bg-blue-900/20 border border-blue-700 rounded-xl p-4 mb-6">
              <p className="text-blue-400 text-sm">
                <strong>Note:</strong> Categories are automatically derived from your products. 
                To add a new category, create a product with that category name. 
                Updating or deleting a category will affect all products in that category.
              </p>
            </div>

            {/* Category Manager */}
            <CategoryBrandManager
              items={categories}
              title="Categories"
              onUpdate={handleUpdateCategory}
              onDelete={handleDeleteCategory}
              onAdd={handleAddCategory}
            />

            {/* Statistics */}
            <div className="mt-6 bg-gray-900/80 border border-gray-800 rounded-xl p-6">
              <h2 className="text-xl font-semibold text-white mb-4">Category Statistics</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="bg-gray-800 rounded-lg p-4">
                  <p className="text-gray-400 text-sm">Total Categories</p>
                  <p className="text-2xl font-bold text-white mt-1">{categories.length}</p>
                </div>
                <div className="bg-gray-800 rounded-lg p-4">
                  <p className="text-gray-400 text-sm">Most Used</p>
                  <p className="text-lg font-bold text-white mt-1">
                    {categories.length > 0 ? categories[0] : 'N/A'}
                  </p>
                </div>
                <div className="bg-gray-800 rounded-lg p-4">
                  <p className="text-gray-400 text-sm">Status</p>
                  <p className="text-lg font-bold text-green-400 mt-1">Active</p>
                </div>
              </div>
            </div>
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default AdminCategories;
