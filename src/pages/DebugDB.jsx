import React, { useEffect, useState } from 'react';
import firebaseService from '../services/firebaseService';
import { normalizeStock } from '../utils/productHelpers';

export default function DebugDB() {
  const [data, setData] = useState({ products: [], error: null });

  useEffect(() => {
    firebaseService.getProducts()
      .then(p => setData({ products: p, error: null }))
      .catch(e => setData({ products: [], error: e.message || String(e) }));
  }, []);

  const categoryCounts = data.products.reduce((acc, p) => {
    const key = p.category || 'uncategorized';
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});

  // Stock field analysis
  const stockAnalysis = {
    total: data.products.length,
    withStock: data.products.filter(p => p.stock !== undefined && p.stock !== null).length,
    withStockCount: data.products.filter(p => p.stockCount !== undefined && p.stockCount !== null).length,
    withQuantity: data.products.filter(p => p.quantity !== undefined && p.quantity !== null).length,
    missingAll: data.products.filter(p => !p.stock && !p.stockCount && !p.quantity).length,
    stringValues: data.products.filter(p => 
      typeof p.stock === 'string' || typeof p.stockCount === 'string' || typeof p.quantity === 'string'
    ).length,
    inStock: data.products.filter(p => normalizeStock(p) > 0).length,
    outOfStock: data.products.filter(p => normalizeStock(p) === 0).length,
  };

  return (
    <div style={{ padding: 20, paddingTop: 100 }}>
      <h2 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: 20 }}>🔍 Database Debug View</h2>
      
      {data.error && (
        <div style={{ color: '#f87171', background: '#7f1d1d', padding: 12, borderRadius: 8, marginBottom: 20 }}>❌ Error: {data.error}</div>
      )}

      <div style={{ marginBottom: 30 }}>
        <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: 12 }}>📊 Stock Field Analysis</h3>
        <div style={{ background: '#1f2937', padding: 16, borderRadius: 8, marginBottom: 12 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16 }}>
            <div>
              <div style={{ color: '#10b981', fontSize: '1.5rem', fontWeight: 'bold' }}>{stockAnalysis.inStock}</div>
              <div style={{ color: '#9ca3af', fontSize: '0.875rem' }}>Products In Stock (stock &gt; 0)</div>
            </div>
            <div>
              <div style={{ color: '#ef4444', fontSize: '1.5rem', fontWeight: 'bold' }}>{stockAnalysis.outOfStock}</div>
              <div style={{ color: '#9ca3af', fontSize: '0.875rem' }}>Products Out of Stock (stock = 0)</div>
            </div>
            <div>
              <div style={{ color: '#f59e0b', fontSize: '1.5rem', fontWeight: 'bold' }}>{stockAnalysis.stringValues}</div>
              <div style={{ color: '#9ca3af', fontSize: '0.875rem' }}>Products with String Stock Values</div>
            </div>
            <div>
              <div style={{ color: '#eab308', fontSize: '1.5rem', fontWeight: 'bold' }}>{stockAnalysis.missingAll}</div>
              <div style={{ color: '#9ca3af', fontSize: '0.875rem' }}>Products Missing All Stock Fields</div>
            </div>
          </div>
        </div>
        <div style={{ background: '#111827', padding: 16, borderRadius: 8 }}>
          <div style={{ marginBottom: 8 }}><strong>Field Usage:</strong></div>
          <div style={{ color: '#9ca3af' }}>• <strong>{stockAnalysis.withStock}</strong> products have 'stock' field</div>
          <div style={{ color: '#9ca3af' }}>• <strong>{stockAnalysis.withStockCount}</strong> products have 'stockCount' field</div>
          <div style={{ color: '#9ca3af' }}>• <strong>{stockAnalysis.withQuantity}</strong> products have 'quantity' field</div>
        </div>
      </div>

      <div style={{ marginBottom: 20 }}>
        <strong>Total products:</strong> {data.products.length}
      </div>
      <div style={{ marginBottom: 20 }}>
        <strong>Counts by category:</strong> {JSON.stringify(categoryCounts)}
      </div>
      
      <div style={{ marginBottom: 12 }}>
        <strong>Sample Products with Stock Info (first 10):</strong>
      </div>
      <table style={{ width: '100%', background: '#111827', color: '#e5e7eb', borderRadius: 8, overflow: 'hidden', marginBottom: 20 }}>
        <thead style={{ background: '#1f2937' }}>
          <tr>
            <th style={{ padding: 12, textAlign: 'left', borderBottom: '1px solid #374151' }}>ID</th>
            <th style={{ padding: 12, textAlign: 'left', borderBottom: '1px solid #374151' }}>Name</th>
            <th style={{ padding: 12, textAlign: 'left', borderBottom: '1px solid #374151' }}>stock</th>
            <th style={{ padding: 12, textAlign: 'left', borderBottom: '1px solid #374151' }}>stockCount</th>
            <th style={{ padding: 12, textAlign: 'left', borderBottom: '1px solid #374151' }}>quantity</th>
            <th style={{ padding: 12, textAlign: 'left', borderBottom: '1px solid #374151' }}>Normalized</th>
          </tr>
        </thead>
        <tbody>
          {data.products.slice(0, 10).map((p, i) => {
            const normalized = normalizeStock(p);
            const hasIssue = typeof p.stock === 'string' || typeof p.stockCount === 'string' || (!p.stock && !p.stockCount && !p.quantity);
            return (
              <tr key={i} style={{ background: hasIssue ? '#7f1d1d40' : 'transparent' }}>
                <td style={{ padding: 12, borderBottom: '1px solid #374151', fontSize: '0.75rem', fontFamily: 'monospace' }}>{p.id.substring(0, 8)}...</td>
                <td style={{ padding: 12, borderBottom: '1px solid #374151' }}>{p.name || 'Unnamed'}</td>
                <td style={{ padding: 12, borderBottom: '1px solid #374151', color: typeof p.stock === 'string' ? '#f59e0b' : '#e5e7eb' }}>
                  {p.stock !== undefined && p.stock !== null ? `${p.stock} (${typeof p.stock})` : '—'}
                </td>
                <td style={{ padding: 12, borderBottom: '1px solid #374151', color: typeof p.stockCount === 'string' ? '#f59e0b' : '#e5e7eb' }}>
                  {p.stockCount !== undefined && p.stockCount !== null ? `${p.stockCount} (${typeof p.stockCount})` : '—'}
                </td>
                <td style={{ padding: 12, borderBottom: '1px solid #374151', color: typeof p.quantity === 'string' ? '#f59e0b' : '#e5e7eb' }}>
                  {p.quantity !== undefined && p.quantity !== null ? `${p.quantity} (${typeof p.quantity})` : '—'}
                </td>
                <td style={{ padding: 12, borderBottom: '1px solid #374151', fontWeight: 'bold', color: normalized > 0 ? '#10b981' : '#ef4444' }}>
                  {normalized}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <div style={{ marginBottom: 12 }}>
        <strong>Full Raw Data (first 20 products):</strong>
      </div>
      <pre style={{ background: '#111827', color: '#e5e7eb', padding: 12, borderRadius: 8, overflow: 'auto' }}>
        {JSON.stringify(data.products.slice(0, 20), null, 2)}
      </pre>

      <div style={{ background: '#1e3a8a', padding: 16, borderRadius: 8, marginTop: 20 }}>
        <h3 style={{ fontWeight: 'bold', marginBottom: 8 }}>🔧 Fix Data Inconsistencies</h3>
        <p style={{ marginBottom: 12, fontSize: '0.875rem' }}>
          If you see products with missing fields, string values, or inconsistent field names, run the migration script:
        </p>
        <div style={{ background: '#000', padding: 12, borderRadius: 4, fontFamily: 'monospace', fontSize: '0.875rem' }}>
          <div style={{ color: '#10b981', marginBottom: 8 }}># With backup (recommended):</div>
          <div style={{ color: '#fbbf24' }}>CREATE_BACKUP=yes CONFIRM_MIGRATION=yes node scripts/normalize-stock.js</div>
        </div>
      </div>
    </div>
  );
}
