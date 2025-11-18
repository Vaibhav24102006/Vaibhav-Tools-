import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  normalizeAllProducts, 
  verifyNormalizedProducts, 
  previewNormalization,
  STANDARD_CATEGORIES,
  STANDARD_BRANDS 
} from '../utils/normalizeProducts';

const ProductNormalizer = () => {
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState('');
  const [result, setResult] = useState(null);
  const [preview, setPreview] = useState(null);
  const [verification, setVerification] = useState(null);
  const [activeTab, setActiveTab] = useState('normalize');

  const handleNormalize = async () => {
    if (!window.confirm('This will update all products in Firestore. Continue?')) {
      return;
    }

    setLoading(true);
    setProgress('');
    setResult(null);

    try {
      const result = await normalizeAllProducts((message) => {
        setProgress(message);
      });

      setResult(result);
      
      if (result.success) {
        // Auto-verify after normalization
        setTimeout(() => handleVerify(), 1000);
      }
    } catch (error) {
      setResult({
        success: false,
        error: error.message
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePreview = async () => {
    setLoading(true);
    setPreview(null);

    try {
      const result = await previewNormalization();
      setPreview(result);
    } catch (error) {
      setPreview({
        success: false,
        error: error.message
      });
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async () => {
    setLoading(true);
    setVerification(null);

    try {
      const result = await verifyNormalizedProducts();
      setVerification(result);
    } catch (error) {
      setVerification({
        success: false,
        error: error.message
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-3xl font-bold mb-6 text-gray-800 flex items-center">
        <span className="mr-3">🔧</span>
        Product Data Normalizer
      </h2>

      {/* Tabs */}
      <div className="flex space-x-2 mb-6 border-b border-gray-200">
        {['normalize', 'preview', 'verify', 'info'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 font-medium transition-colors ${
              activeTab === tab
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Normalize Tab */}
      {activeTab === 'normalize' && (
        <div>
          <div className="mb-6">
            <h3 className="text-xl font-semibold mb-3 text-gray-800">Normalize All Products</h3>
            <p className="text-gray-600 mb-4">
              This will automatically:
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-2 mb-6">
              <li>Categorize products into 7 standard categories</li>
              <li>Standardize brand names (Taparia, Metro, Indian Tools, Bosch, Vaibhav Tools)</li>
              <li>Fix missing or invalid prices</li>
              <li>Add placeholder images where missing</li>
              <li>Ensure all required fields are present</li>
            </ul>

            <button
              onClick={handleNormalize}
              disabled={loading}
              className={`w-full py-3 px-6 rounded-lg font-semibold text-white transition-colors ${
                loading
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800'
              }`}
            >
              {loading ? '⏳ Normalizing...' : '🚀 Normalize All Products'}
            </button>
          </div>

          {progress && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg"
            >
              <p className="text-blue-800 font-medium">{progress}</p>
            </motion.div>
          )}

          {result && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-6 rounded-lg ${
                result.success
                  ? 'bg-green-50 border border-green-200'
                  : 'bg-red-50 border border-red-200'
              }`}
            >
              <p className={`font-bold text-lg mb-3 ${
                result.success ? 'text-green-800' : 'text-red-800'
              }`}>
                {result.success ? '✅ Success!' : '❌ Error!'}
              </p>
              <p className={`mb-4 ${result.success ? 'text-green-700' : 'text-red-700'}`}>
                {result.success ? result.message : result.error}
              </p>

              {result.success && result.stats && (
                <div className="mt-4 space-y-3">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-white p-3 rounded-lg">
                      <p className="text-sm text-gray-600">Total Products</p>
                      <p className="text-2xl font-bold text-gray-800">{result.stats.total}</p>
                    </div>
                    <div className="bg-white p-3 rounded-lg">
                      <p className="text-sm text-gray-600">Re-categorized</p>
                      <p className="text-2xl font-bold text-blue-600">{result.stats.categorized}</p>
                    </div>
                    <div className="bg-white p-3 rounded-lg">
                      <p className="text-sm text-gray-600">Brands Fixed</p>
                      <p className="text-2xl font-bold text-purple-600">{result.stats.brandFixed}</p>
                    </div>
                    <div className="bg-white p-3 rounded-lg">
                      <p className="text-sm text-gray-600">Prices Fixed</p>
                      <p className="text-2xl font-bold text-orange-600">{result.stats.priceFixed}</p>
                    </div>
                  </div>

                  <div className="bg-white p-4 rounded-lg">
                    <h4 className="font-semibold text-gray-800 mb-2">Products by Category:</h4>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      {Object.entries(result.stats.byCategory || {}).map(([cat, count]) => (
                        <div key={cat} className="flex justify-between">
                          <span className="text-gray-600">{cat}:</span>
                          <span className="font-semibold text-gray-800">{count}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-white p-4 rounded-lg">
                    <h4 className="font-semibold text-gray-800 mb-2">Products by Brand:</h4>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      {Object.entries(result.stats.byBrand || {}).map(([brand, count]) => (
                        <div key={brand} className="flex justify-between">
                          <span className="text-gray-600">{brand}:</span>
                          <span className="font-semibold text-gray-800">{count}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </div>
      )}

      {/* Preview Tab */}
      {activeTab === 'preview' && (
        <div>
          <div className="mb-6">
            <h3 className="text-xl font-semibold mb-3 text-gray-800">Preview Changes</h3>
            <p className="text-gray-600 mb-4">
              See what changes will be made without actually updating the database.
            </p>

            <button
              onClick={handlePreview}
              disabled={loading}
              className={`w-full py-3 px-6 rounded-lg font-semibold text-white transition-colors ${
                loading
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-purple-600 hover:bg-purple-700'
              }`}
            >
              {loading ? '⏳ Loading Preview...' : '👁️ Preview Changes'}
            </button>
          </div>

          {preview && preview.success && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-gray-50 border border-gray-200 rounded-lg p-4 max-h-96 overflow-y-auto"
            >
              <p className="font-semibold text-gray-800 mb-3">
                {preview.totalChanges} products will be modified (showing first 50):
              </p>
              <div className="space-y-3">
                {preview.preview.map((item, idx) => (
                  <div key={idx} className="bg-white p-3 rounded-lg border border-gray-200">
                    <p className="font-medium text-gray-800 mb-1">{item.name}</p>
                    <ul className="text-sm text-gray-600 space-y-1">
                      {item.changes.map((change, i) => (
                        <li key={i} className="flex items-start">
                          <span className="text-blue-500 mr-2">→</span>
                          {change}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {preview && !preview.success && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-800">Error: {preview.error}</p>
            </div>
          )}
        </div>
      )}

      {/* Verify Tab */}
      {activeTab === 'verify' && (
        <div>
          <div className="mb-6">
            <h3 className="text-xl font-semibold mb-3 text-gray-800">Verify Data Quality</h3>
            <p className="text-gray-600 mb-4">
              Check for any remaining data quality issues.
            </p>

            <button
              onClick={handleVerify}
              disabled={loading}
              className={`w-full py-3 px-6 rounded-lg font-semibold text-white transition-colors ${
                loading
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-green-600 hover:bg-green-700'
              }`}
            >
              {loading ? '⏳ Verifying...' : '✓ Verify Products'}
            </button>
          </div>

          {verification && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className={`p-6 rounded-lg ${
                verification.success
                  ? 'bg-green-50 border border-green-200'
                  : 'bg-yellow-50 border border-yellow-200'
              }`}
            >
              <p className={`font-bold text-lg mb-3 ${
                verification.success ? 'text-green-800' : 'text-yellow-800'
              }`}>
                {verification.success ? '✅ All Products Valid!' : '⚠️ Issues Found'}
              </p>

              {verification.stats && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div className="bg-white p-3 rounded-lg">
                    <p className="text-sm text-gray-600">Total Products</p>
                    <p className="text-2xl font-bold text-gray-800">{verification.stats.total}</p>
                  </div>
                  <div className="bg-white p-3 rounded-lg">
                    <p className="text-sm text-gray-600">Missing Fields</p>
                    <p className="text-2xl font-bold text-red-600">{verification.stats.missingFields}</p>
                  </div>
                  <div className="bg-white p-3 rounded-lg">
                    <p className="text-sm text-gray-600">Invalid Prices</p>
                    <p className="text-2xl font-bold text-orange-600">{verification.stats.invalidPrices}</p>
                  </div>
                  <div className="bg-white p-3 rounded-lg">
                    <p className="text-sm text-gray-600">Invalid Categories</p>
                    <p className="text-2xl font-bold text-purple-600">{verification.stats.invalidCategories}</p>
                  </div>
                </div>
              )}

              {verification.issues && verification.issues.length > 0 && (
                <div className="bg-white p-4 rounded-lg max-h-64 overflow-y-auto">
                  <h4 className="font-semibold text-gray-800 mb-2">Issues (first 20):</h4>
                  <div className="space-y-2">
                    {verification.issues.map((issue, idx) => (
                      <div key={idx} className="text-sm border-l-4 border-yellow-400 pl-3 py-1">
                        <p className="font-medium text-gray-800">{issue.name}</p>
                        <p className="text-gray-600">{issue.issue}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </div>
      )}

      {/* Info Tab */}
      {activeTab === 'info' && (
        <div className="space-y-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-3 text-blue-800">Standard Categories</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {Object.keys(STANDARD_CATEGORIES).map((cat) => (
                <div key={cat} className="bg-white p-3 rounded-lg">
                  <p className="font-medium text-gray-800">{cat}</p>
                  <p className="text-sm text-gray-600 mt-1">
                    Keywords: {STANDARD_CATEGORIES[cat].slice(0, 5).join(', ')}...
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-3 text-purple-800">Standard Brands</h3>
            <div className="flex flex-wrap gap-2">
              {STANDARD_BRANDS.map((brand) => (
                <span key={brand} className="bg-white px-4 py-2 rounded-full text-gray-800 font-medium">
                  {brand}
                </span>
              ))}
            </div>
          </div>

          <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-3 text-gray-800">How It Works</h3>
            <ol className="list-decimal list-inside space-y-2 text-gray-600">
              <li>Scans all products in Firestore</li>
              <li>Analyzes product names and descriptions using keyword matching</li>
              <li>Assigns appropriate category based on content</li>
              <li>Standardizes brand names to match official list</li>
              <li>Fixes missing or invalid data (prices, images, etc.)</li>
              <li>Updates all products in a single batch operation</li>
            </ol>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductNormalizer;
