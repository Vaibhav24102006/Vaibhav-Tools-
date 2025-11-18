import React from 'react';
import ProductNormalizer from '../components/ProductNormalizer';

const NormalizeProducts = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-12 pt-24">
      <div className="container mx-auto px-4">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-3">
            Product Data Management
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Normalize, categorize, and standardize your product data for optimal performance and consistency.
          </p>
        </div>
        
        <ProductNormalizer />
        
        <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-6 max-w-4xl mx-auto">
          <h3 className="font-semibold text-yellow-800 mb-2 flex items-center">
            <span className="mr-2">⚠️</span>
            Important Notes
          </h3>
          <ul className="text-yellow-700 text-sm space-y-1 list-disc list-inside">
            <li>Always preview changes before normalizing</li>
            <li>This operation updates all products in your Firestore database</li>
            <li>Verify data quality after normalization</li>
            <li>Consider backing up your data before major changes</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default NormalizeProducts;
