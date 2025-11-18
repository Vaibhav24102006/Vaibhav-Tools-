import React from 'react';
import AdminDataPopulator from '../components/AdminDataPopulator';

const PopulateData = () => {
  return (
    <div className="min-h-screen bg-gray-100 py-12">
      <div className="container mx-auto px-4">
        <AdminDataPopulator />
      </div>
    </div>
  );
};

export default PopulateData;