import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Package, FolderTree, Tag, TrendingUp, TrendingDown } from 'lucide-react';
import AdminSidebar from '../../components/admin/AdminSidebar';
import StatCard from '../../components/admin/StatCard';
import adminFirestore from '../../utils/adminFirestore';

const AdminDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStatistics();
  }, []);

  const loadStatistics = async () => {
    try {
      setLoading(true);
      const data = await adminFirestore.getStatistics();
      setStats(data);
    } catch (error) {
      console.error('Error loading statistics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-red mx-auto"></div>
          <p className="mt-4 text-gray-400">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  // Prepare chart data
  const chartData = stats?.categoryDistribution || {};
  const chartColors = ['#E10600', '#FF4500', '#FF6347', '#FF7F50', '#FFA07A', '#FFB6C1'];
  const total = Object.values(chartData).reduce((sum, val) => sum + val, 0);

  return (
    <div className="min-h-screen bg-black pt-20">
      <div className="flex">
        <AdminSidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
        
        <main className="flex-1 p-6 lg:p-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-7xl mx-auto"
          >
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-4xl font-bold text-white mb-2">Dashboard</h1>
              <p className="text-gray-400">Welcome to Vaibhav Tools Admin Panel</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <StatCard
                title="Total Products"
                value={stats?.totalProducts || 0}
                icon={Package}
                color="red"
              />
              <StatCard
                title="Categories"
                value={stats?.totalCategories || 0}
                icon={FolderTree}
                color="blue"
              />
              <StatCard
                title="Brands"
                value={stats?.totalBrands || 0}
                icon={Tag}
                color="purple"
              />
              <StatCard
                title="In Stock"
                value={stats?.inStock || 0}
                icon={TrendingUp}
                color="green"
              />
            </div>

            {/* Stock Status */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <div className="bg-gray-900/80 border border-gray-800 rounded-xl p-6">
                <h2 className="text-xl font-semibold text-white mb-4">Stock Status</h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span className="text-gray-300">In Stock</span>
                    </div>
                    <span className="text-white font-bold">{stats?.inStock || 0}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                      <span className="text-gray-300">Out of Stock</span>
                    </div>
                    <span className="text-white font-bold">{stats?.outOfStock || 0}</span>
                  </div>
                  <div className="w-full bg-gray-800 rounded-full h-4 mt-4">
                    <div
                      className="bg-green-500 h-4 rounded-full transition-all"
                      style={{
                        width: `${stats?.totalProducts > 0 ? (stats.inStock / stats.totalProducts) * 100 : 0}%`
                      }}
                    ></div>
                  </div>
                </div>
              </div>

              {/* Category Distribution Chart */}
              <div className="bg-gray-900/80 border border-gray-800 rounded-xl p-6">
                <h2 className="text-xl font-semibold text-white mb-4">Category Distribution</h2>
                {Object.keys(chartData).length > 0 ? (
                  <div className="space-y-3">
                    {Object.entries(chartData)
                      .sort((a, b) => b[1] - a[1])
                      .slice(0, 6)
                      .map(([category, count], index) => (
                        <div key={category}>
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-gray-300 text-sm">{category}</span>
                            <span className="text-white font-medium">
                              {count} ({total > 0 ? Math.round((count / total) * 100) : 0}%)
                            </span>
                          </div>
                          <div className="w-full bg-gray-800 rounded-full h-2">
                            <div
                              className="h-2 rounded-full transition-all"
                              style={{
                                width: `${total > 0 ? (count / total) * 100 : 0}%`,
                                backgroundColor: chartColors[index % chartColors.length]
                              }}
                            ></div>
                          </div>
                        </div>
                      ))}
                  </div>
                ) : (
                  <p className="text-gray-400 text-center py-8">No data available</p>
                )}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-gray-900/80 border border-gray-800 rounded-xl p-6">
              <h2 className="text-xl font-semibold text-white mb-4">Quick Actions</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <a
                  href="/admin/products"
                  className="flex items-center gap-3 p-4 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <Package className="text-primary-red" size={24} />
                  <div>
                    <p className="text-white font-medium">Manage Products</p>
                    <p className="text-gray-400 text-sm">Add, edit, or delete products</p>
                  </div>
                </a>
                <a
                  href="/admin/categories"
                  className="flex items-center gap-3 p-4 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <FolderTree className="text-blue-400" size={24} />
                  <div>
                    <p className="text-white font-medium">Manage Categories</p>
                    <p className="text-gray-400 text-sm">Organize product categories</p>
                  </div>
                </a>
                <a
                  href="/admin/brands"
                  className="flex items-center gap-3 p-4 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <Tag className="text-purple-400" size={24} />
                  <div>
                    <p className="text-white font-medium">Manage Brands</p>
                    <p className="text-gray-400 text-sm">Add or edit product brands</p>
                  </div>
                </a>
              </div>
            </div>
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
