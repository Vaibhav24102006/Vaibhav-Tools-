import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Upload, FileText, AlertCircle, CheckCircle } from 'lucide-react';

const BulkImportModal = ({ isOpen, onClose, onSuccess }) => {
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null); // { successCount: 0, errors: [] }
    const [error, setError] = useState(null); // General error message

    if (!isOpen) return null;

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            setFile(selectedFile);
            setResult(null);
            setError(null);
        }
    };

    const handleUpload = async () => {
        if (!file) return;

        setLoading(true);
        setResult(null);
        setError(null);

        try {
            // Get the JWT token from localStorage (set by admin login)
            const token = localStorage.getItem("token");
            
            if (!token) {
                throw new Error('User not authenticated. Please login again.');
            }

            const formData = new FormData();
            formData.append('file', file);

            // Use the correct API endpoint
            const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5050'}/api/admin/products/import`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                    // Do NOT set Content-Type header when sending FormData, 
                    // browser sets it automatically with boundary
                },
                body: formData
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Import failed');
            }

            setResult(data);

            // Notify parent to refresh list if some succeeded
            if (data.successCount > 0 && onSuccess) {
                onSuccess();
            }

        } catch (error) {
            console.error('Upload error:', error);
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="bg-gray-900 border border-gray-800 rounded-xl w-full max-w-md shadow-2xl overflow-hidden"
                >
                    {/* Header */}
                    <div className="flex items-center justify-between p-6 border-b border-gray-800">
                        <h2 className="text-xl font-bold text-white">Import Products</h2>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-white transition-colors"
                        >
                            <X size={24} />
                        </button>
                    </div>

                    {/* Body */}
                    <div className="p-6">

                        {/* File Drop / Input Area */}
                        <div className="mb-6">
                            <label className="block w-full cursor-pointer group">
                                <input
                                    type="file"
                                    className="hidden"
                                    accept=".csv,.xlsx,.docx"
                                    onChange={handleFileChange}
                                    disabled={loading}
                                />
                                <div className={`
                  border-2 border-dashed rounded-xl p-8 text-center transition-colors
                  ${file
                                        ? 'border-primary-red/50 bg-primary-red/10'
                                        : 'border-gray-700 hover:border-primary-red hover:bg-gray-800'
                                    }
                `}>
                                    <div className="flex flex-col items-center gap-3">
                                        {file ? (
                                            <FileText size={32} className="text-primary-red" />
                                        ) : (
                                            <Upload size={32} className="text-gray-400 group-hover:text-primary-red" />
                                        )}
                                        <div className="text-sm">
                                            {file ? (
                                                <span className="font-semibold text-white">{file.name}</span>
                                            ) : (
                                                <span className="text-gray-400">
                                                    Click to upload or drag and drop<br />
                                                    <span className="text-xs text-gray-500">(.csv, .xlsx, .docx)</span>
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </label>
                        </div>

                        {/* Template Info */}
                        <div className="mb-6 text-xs text-gray-500 bg-gray-800/50 p-3 rounded-lg">
                            <p className="font-semibold mb-1 text-gray-400">Required Columns (Headers):</p>
                            <p>Name, Category, Price, Brand, Description, Stock</p>
                        </div>

                        {/* Results Display */}
                        {result && (
                            <div className="mb-6 space-y-3">
                                <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg flex items-center gap-3 text-green-500">
                                    <CheckCircle size={20} />
                                    <span className="font-semibold">Successfully imported: {result.successCount}</span>
                                </div>

                                {result.errors && result.errors.length > 0 && (
                                    <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                                        <div className="flex items-center gap-2 text-red-500 mb-2 font-semibold">
                                            <AlertCircle size={18} />
                                            <span>Errors ({result.errors.length})</span>
                                        </div>
                                        <ul className="text-xs text-red-400 max-h-32 overflow-y-auto space-y-1 pl-5 list-disc">
                                            {result.errors.map((err, idx) => (
                                                <li key={idx}>{typeof err === 'string' ? err : JSON.stringify(err)}</li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* General API Error */}
                        {error && (
                            <div className="p-4 rounded-lg mb-6 flex items-start gap-3 text-sm bg-red-500/10 text-red-500">
                                <AlertCircle size={18} />
                                <span>{error}</span>
                            </div>
                        )}

                        {/* Actions */}
                        <div className="flex gap-3">
                            <button
                                onClick={onClose}
                                className="flex-1 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors font-medium"
                                disabled={loading}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleUpload}
                                disabled={!file || loading}
                                className={`flex-1 px-4 py-2 rounded-lg font-medium text-white transition-all flex items-center justify-center gap-2
                  ${!file || loading
                                        ? 'bg-gray-700 cursor-not-allowed text-gray-400'
                                        : 'bg-primary-red hover:bg-red-700 shadow-lg shadow-red-900/20'
                                    }
                `}
                            >
                                {loading && <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
                                {loading ? 'Importing...' : 'Import Products'}
                            </button>
                        </div>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default BulkImportModal;
