import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { auth, db } from '../firebase';
import { getIdTokenResult } from 'firebase/auth';
import {
  collection,
  getDocs,
  deleteDoc,
  doc,
  query,
  orderBy
} from 'firebase/firestore';
import firebaseService from '../services/firebaseService';

function Admin() {
  const navigate = useNavigate();
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [error, setError] = useState('');

  // Products state
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: '',
    price: '',
    category: '',
    brand: '',
    image: '',
    inStock: true
  });

  // Reviews state
  const [reviews, setReviews] = useState([]);
  const [loadingReviews, setLoadingReviews] = useState(false);

  useEffect(() => {
    const checkAdmin = async () => {
      try {
        const user = auth.currentUser;
        if (!user) {
          navigate('/signin');
          return;
        }
        const token = await getIdTokenResult(user, true);
        const hasAdmin = Boolean(token.claims && token.claims.admin);
        setIsAdmin(hasAdmin);
        if (!hasAdmin) {
          setError('Forbidden: Admin access required');
        }
      } catch (e) {
        setError('Failed to verify admin access');
      } finally {
        setIsCheckingAuth(false);
      }
    };
    checkAdmin();
  }, [navigate]);

  useEffect(() => {
    if (!isAdmin) return;
    const load = async () => {
      try {
        setLoadingProducts(true);
        const data = await firebaseService.getProducts();
        setProducts(data);
      } finally {
        setLoadingProducts(false);
      }
    };
    load();
  }, [isAdmin]);

  useEffect(() => {
    if (!isAdmin) return;
    const loadReviews = async () => {
      try {
        setLoadingReviews(true);
        const q = query(collection(db, 'reviews'), orderBy('createdAt', 'desc'));
        const snap = await getDocs(q);
        const list = [];
        snap.forEach((d) => list.push({ id: d.id, ...d.data() }));
        setReviews(list);
      } finally {
        setLoadingReviews(false);
      }
    };
    loadReviews();
  }, [isAdmin]);

  const productCount = useMemo(() => products.length, [products]);

  const handleAddProduct = async () => {
    try {
      const { name, price } = newProduct;
      if (!name || !price) {
        alert('Name and price are required');
        return;
      }
      const id = await firebaseService.addProduct({
        ...newProduct,
        price: Number(newProduct.price)
      });
      setProducts((prev) => [{ id, ...newProduct, price: Number(newProduct.price) }, ...prev]);
      setNewProduct({ name: '', price: '', category: '', brand: '', image: '', inStock: true });
    } catch (e) {
      alert('Failed to add product');
    }
  };

  const handleToggleAvailability = async (id, current) => {
    try {
      await firebaseService.updateProduct(id, { inStock: !current });
      setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, inStock: !current } : p)));
    } catch (e) {
      alert('Failed to update product');
    }
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm('Delete this product?')) return;
    try {
      await firebaseService.deleteProduct(id);
      setProducts((prev) => prev.filter((p) => p.id !== id));
    } catch (e) {
      alert('Failed to delete product');
    }
  };

  const handleDeleteReview = async (id) => {
    if (!window.confirm('Delete this review?')) return;
    try {
      await deleteDoc(doc(db, 'reviews', id));
      setReviews((prev) => prev.filter((r) => r.id !== id));
    } catch (e) {
      alert('Failed to delete review');
    }
  };

  if (isCheckingAuth) {
    return (
      <div className="w-full min-h-screen bg-black pt-20 flex items-center justify-center">
        <div className="text-white">Checking access…</div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="w-full min-h-screen bg-black pt-20 flex items-center justify-center">
        <div className="text-red-400 bg-red-900/30 border border-red-700 px-6 py-4 rounded-lg">{error || 'Access denied'}</div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-black pt-20 px-4 text-white">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-gray-900/80 border border-gray-800 rounded-xl p-6">
            <div className="text-gray-400 text-sm">Products</div>
            <div className="text-3xl font-bold">{productCount}</div>
          </div>
        </div>

        <div className="bg-gray-900/80 border border-gray-800 rounded-xl p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Add Product</h2>
          <div className="grid grid-cols-1 md:grid-cols-6 gap-3">
            <input className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2" placeholder="Name" value={newProduct.name} onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })} />
            <input className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2" placeholder="Price" type="number" value={newProduct.price} onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })} />
            <input className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2" placeholder="Category" value={newProduct.category} onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })} />
            <input className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2" placeholder="Brand" value={newProduct.brand} onChange={(e) => setNewProduct({ ...newProduct, brand: e.target.value })} />
            <input className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2" placeholder="Image URL" value={newProduct.image} onChange={(e) => setNewProduct({ ...newProduct, image: e.target.value })} />
            <button onClick={handleAddProduct} className="bg-red-600 hover:bg-white hover:text-red-600 border border-transparent hover:border-red-600 rounded-lg px-3 py-2">Add</button>
          </div>
        </div>

        <div className="bg-gray-900/80 border border-gray-800 rounded-xl p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Products</h2>
            {loadingProducts && <div className="text-gray-400 text-sm">Loading…</div>}
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead>
                <tr className="text-gray-400 border-b border-gray-800">
                  <th className="py-2 pr-4">Name</th>
                  <th className="py-2 pr-4">Price</th>
                  <th className="py-2 pr-4">Category</th>
                  <th className="py-2 pr-4">Brand</th>
                  <th className="py-2 pr-4">Stock</th>
                  <th className="py-2 pr-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr key={p.id} className="border-b border-gray-800">
                    <td className="py-2 pr-4">{p.name}</td>
                    <td className="py-2 pr-4">₹{Number(p.price || 0).toFixed(2)}</td>
                    <td className="py-2 pr-4">{p.category || '-'}</td>
                    <td className="py-2 pr-4">{p.brand || '-'}</td>
                    <td className="py-2 pr-4">{p.inStock ? 'Available' : 'Out of Stock'}</td>
                    <td className="py-2 pr-4 space-x-2">
                      <button onClick={() => handleToggleAvailability(p.id, p.inStock)} className="px-3 py-1 rounded bg-gray-800 hover:bg-gray-700">Toggle</button>
                      <button onClick={() => handleDeleteProduct(p.id)} className="px-3 py-1 rounded bg-red-700 hover:bg-red-600">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-gray-900/80 border border-gray-800 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Reviews</h2>
            {loadingReviews && <div className="text-gray-400 text-sm">Loading…</div>}
          </div>
          {reviews.length === 0 ? (
            <div className="text-gray-400">No reviews yet.</div>
          ) : (
            <div className="space-y-3">
              {reviews.map((r) => (
                <div key={r.id} className="border border-gray-800 rounded-lg p-4">
                  <div className="text-sm text-gray-400 mb-1">{r.userEmail || r.userId || 'Anonymous'}</div>
                  <div className="font-semibold">{r.productName || r.productId}</div>
                  <div className="text-gray-300 mt-1">{r.comment}</div>
                  <div className="mt-2 text-sm text-yellow-400">Rating: {r.rating || '-'}</div>
                  <div className="mt-3">
                    <button onClick={() => handleDeleteReview(r.id)} className="px-3 py-1 rounded bg-red-700 hover:bg-red-600">Delete</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Admin;


