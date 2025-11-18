import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Edit2, Trash2, Plus, X, Check } from 'lucide-react';

const CategoryBrandManager = ({ items, title, onUpdate, onDelete, onAdd }) => {
  const [editingItem, setEditingItem] = useState(null);
  const [editValue, setEditValue] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [newValue, setNewValue] = useState('');

  const handleEdit = (item) => {
    setEditingItem(item);
    setEditValue(item);
  };

  const handleSaveEdit = async () => {
    if (editValue.trim() && editValue !== editingItem) {
      await onUpdate(editingItem, editValue.trim());
    }
    setEditingItem(null);
    setEditValue('');
  };

  const handleCancelEdit = () => {
    setEditingItem(null);
    setEditValue('');
  };

  const handleAdd = async () => {
    if (newValue.trim()) {
      await onAdd(newValue.trim());
      setNewValue('');
      setIsAdding(false);
    }
  };

  const handleDelete = async (item) => {
    if (window.confirm(`Are you sure you want to delete "${item}"? This will remove it from all products.`)) {
      await onDelete(item);
    }
  };

  return (
    <div className="bg-gray-900/80 border border-gray-800 rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-white">{title}</h2>
        <button
          onClick={() => setIsAdding(true)}
          className="flex items-center gap-2 px-3 py-2 bg-primary-red hover:bg-red-700 text-white rounded-lg transition-colors"
        >
          <Plus size={18} />
          Add New
        </button>
      </div>

      {/* Add New Item Form */}
      {isAdding && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="mb-4 p-4 bg-gray-800 rounded-lg border border-gray-700"
        >
          <div className="flex gap-2">
            <input
              type="text"
              value={newValue}
              onChange={(e) => setNewValue(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAdd()}
              placeholder={`Enter new ${title.toLowerCase().slice(0, -1)}`}
              className="flex-1 px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-primary-red focus:border-transparent"
              autoFocus
            />
            <button
              onClick={handleAdd}
              className="p-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
            >
              <Check size={20} />
            </button>
            <button
              onClick={() => {
                setIsAdding(false);
                setNewValue('');
              }}
              className="p-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        </motion.div>
      )}

      {/* Items List */}
      <div className="space-y-2">
        {items.length === 0 ? (
          <p className="text-gray-400 text-center py-8">No {title.toLowerCase()} found</p>
        ) : (
          items.map((item) => (
            <motion.div
              key={item}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center justify-between p-3 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors"
            >
              {editingItem === item ? (
                <div className="flex-1 flex gap-2">
                  <input
                    type="text"
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSaveEdit()}
                    className="flex-1 px-3 py-1 bg-gray-900 border border-gray-700 rounded text-white focus:ring-2 focus:ring-primary-red focus:border-transparent"
                    autoFocus
                  />
                  <button
                    onClick={handleSaveEdit}
                    className="p-2 bg-green-600 hover:bg-green-700 text-white rounded transition-colors"
                  >
                    <Check size={16} />
                  </button>
                  <button
                    onClick={handleCancelEdit}
                    className="p-2 bg-gray-700 hover:bg-gray-600 text-white rounded transition-colors"
                  >
                    <X size={16} />
                  </button>
                </div>
              ) : (
                <>
                  <span className="text-white font-medium">{item}</span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(item)}
                      className="p-2 hover:bg-gray-600 rounded transition-colors"
                      title="Edit"
                    >
                      <Edit2 size={16} className="text-blue-400" />
                    </button>
                    <button
                      onClick={() => handleDelete(item)}
                      className="p-2 hover:bg-gray-600 rounded transition-colors"
                      title="Delete"
                    >
                      <Trash2 size={16} className="text-red-400" />
                    </button>
                  </div>
                </>
              )}
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
};

export default CategoryBrandManager;
