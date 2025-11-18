import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Tag } from 'lucide-react';
import AdminSidebar from '../../components/admin/AdminSidebar';
import CategoryBrandManager from '../../components/admin/CategoryBrandManager';
import adminFirestore from '../../utils/adminFirestore';

const AdminBrands = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBrands();
  }, []);

  const loadBrands = async () => {
    try {
      setLoading(true);
      const data = await adminFirestore.getBrands();
      setBrands(data);
    } catch (error) {
      console.error('Error loading brands:', error);
      alert('Failed to load brands');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateBrand = async (oldBrand, newBrand) => {
    try {
      await adminFirestore.updateBrand(oldBrand, newBrand);
      await loadBrands();
      alert('Brand updated successfully');
    } catch (error) {
      console.error('Error updating brand:', error);
      alert('Failed to update brand');
    }
  };

  const handleDeleteBrand = async (brand) => {
    try {
      await adminFirestore.deleteBrand(brand);
      await loadBrands();
      alert('Brand deleted successfully');
    } catch (error) {
      console.error('Error deleting brand:', error);
      alert('Failed to delete brand');
    }
  };

  const handleAddBrand = async (brand) => {
    try {
      // Add a placeholder product with this brand or just update the list
      // Since brands are derived from products, we'll just show a message
      alert('To add a new brand, create a product with this brand name.');
      await loadBrands();
    } catch (error) {
      console.error('Error adding brand:', error);
      alert('Failed to add brand');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-red mx-auto"></div>
          <p className="mt-4 text-gray-400">Loading brands...</p>
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
                <Tag className="text-primary-red" size={32} />
                <h1 className="text-4xl font-bold text-white">Brands</h1>
              </div>
              <p className="text-gray-400">
                Manage product brands ({brands.length} total)
              </p>
            </div>

            {/* Info Box */}
            <div className="bg-blue-900/20 border border-blue-700 rounded-xl p-4 mb-6">
              <p className="text-blue-400 text-sm">
                <strong>Note:</strong> Brands are automatically derived from your products. 
                To add a new brand, create a product with that brand name. 
                Updating or deleting a brand will affect all products with that brand.
              </p>
            </div>

            {/* Brand Manager */}
            <CategoryBrandManager
              items={brands}
              title="Brands"
              onUpdate={handleUpdateBrand}
              onDelete={handleDeleteBrand}
              onAdd={handleAddBrand}
            />

            {/* Statistics */}
            <div className="mt-6 bg-gray-900/80 border border-gray-800 rounded-xl p-6">
              <h2 className="text-xl font-semibold text-white mb-4">Brand Statistics</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="bg-gray-800 rounded-lg p-4">
                  <p className="text-gray-400 text-sm">Total Brands</p>
                  <p className="text-2xl font-bold text-white mt-1">{brands.length}</p>
                </div>
                <div className="bg-gray-800 rounded-lg p-4">
                  <p className="text-gray-400 text-sm">Most Popular</p>
                  <p className="text-lg font-bold text-white mt-1">
                    {brands.length > 0 ? brands[0] : 'N/A'}
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

export default AdminBrands;
