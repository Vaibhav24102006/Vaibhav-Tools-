import React, { useState } from 'react';
import { populateFirestoreData } from '../utils/populateFirestore';

const AdminDataPopulator = () => {
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState('');
  const [result, setResult] = useState(null);

  const handlePopulateData = async () => {
    setLoading(true);
    setProgress('');
    setResult(null);

    try {
      const result = await populateFirestoreData((message) => {
        setProgress(message);
      });

      setResult(result);
      
      if (result.success) {
        setTimeout(() => {
          setProgress('');
          setResult(null);
        }, 5000);
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

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Firestore Data Populator</h2>
      
      <div className="mb-6">
        <p className="text-gray-600 mb-4">
          This tool will populate your Firestore database with comprehensive product data including:
        </p>
        <ul className="list-disc list-inside text-gray-600 space-y-1">
          <li>12 Product Categories (Drill Machines, Grinders, Paint Guns, etc.)</li>
          <li>Multiple Brands for each category (Bosch, Taparia, Ingco, etc.)</li>
          <li>Detailed product information with specifications</li>
          <li>Amazon links and product images</li>
        </ul>
      </div>

      <div className="mb-6">
        <button
          onClick={handlePopulateData}
          disabled={loading}
          className={`w-full py-3 px-6 rounded-lg font-semibold text-white transition-colors ${
            loading
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800'
          }`}
        >
          {loading ? 'Populating Database...' : 'Populate Firestore Database'}
        </button>
      </div>

      {progress && (
        <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-blue-800">{progress}</p>
        </div>
      )}

      {result && (
        <div
          className={`p-4 rounded-lg ${
            result.success
              ? 'bg-green-50 border border-green-200'
              : 'bg-red-50 border border-red-200'
          }`}
        >
          <p
            className={`font-semibold ${
              result.success ? 'text-green-800' : 'text-red-800'
            }`}
          >
            {result.success ? '✅ Success!' : '❌ Error!'}
          </p>
          <p
            className={result.success ? 'text-green-700' : 'text-red-700'}
          >
            {result.success ? result.message : result.error}
          </p>
        </div>
      )}

      <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <p className="text-yellow-800 text-sm">
          <strong>Warning:</strong> This will clear all existing product, category, and brand data 
          before adding new data. Make sure you have a backup if needed.
        </p>
      </div>
    </div>
  );
};

export default AdminDataPopulator;