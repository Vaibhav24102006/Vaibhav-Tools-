import React, { useEffect, useState } from 'react';
import { db } from '../firebase';
import { collection, getDocs, limit, orderBy, query } from 'firebase/firestore';

function DebugDB() {
  const [data, setData] = useState({ products: [], reviews: [], users: [] });
  const [error, setError] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const pull = async (name) => {
          try {
            const q = query(collection(db, name), orderBy('createdAt', 'desc'), limit(10));
            const snap = await getDocs(q);
            return snap.docs.map(d => ({ id: d.id, ...d.data() }));
          } catch (e) {
            const snap = await getDocs(collection(db, name));
            return snap.docs.map(d => ({ id: d.id, ...d.data() }));
          }
        };
        const [products, reviews, users] = await Promise.all([
          pull('products'), pull('reviews'), pull('users')
        ]);
        // eslint-disable-next-line no-console
        console.log('[DebugDB] products', products);
        // eslint-disable-next-line no-console
        console.log('[DebugDB] reviews', reviews);
        // eslint-disable-next-line no-console
        console.log('[DebugDB] users', users);
        setData({ products, reviews, users });
      } catch (e) {
        setError(e.message || 'Failed to pull Firestore data');
      }
    })();
  }, []);

  return (
    <div className="p-4 text-white">
      <h2 className="text-xl font-bold mb-2">Debug Firestore</h2>
      {error && <div className="text-red-400 mb-3">{error}</div>}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <pre className="bg-gray-900 p-3 rounded overflow-auto max-h-96"><strong>products</strong>\n{JSON.stringify(data.products, null, 2)}</pre>
        <pre className="bg-gray-900 p-3 rounded overflow-auto max-h-96"><strong>reviews</strong>\n{JSON.stringify(data.reviews, null, 2)}</pre>
        <pre className="bg-gray-900 p-3 rounded overflow-auto max-h-96"><strong>users</strong>\n{JSON.stringify(data.users, null, 2)}</pre>
      </div>
    </div>
  );
}

export default DebugDB;


