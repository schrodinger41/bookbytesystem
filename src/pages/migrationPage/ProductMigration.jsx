// Migration script to upload products from Product.jsx to Firestore
// This is a React component that you can temporarily add to your app

import React, { useState } from 'react';
import { collection, doc, setDoc } from 'firebase/firestore';
import { db } from '../../config/firebase.js';
import Products from '../../components/product/Product';

function ProductMigration() {
    const [status, setStatus] = useState('');
    const [uploading, setUploading] = useState(false);
    const [results, setResults] = useState({ success: 0, failed: 0 });

    const uploadProducts = async () => {
        setUploading(true);
        setStatus('Starting upload...');

        let successCount = 0;
        let errorCount = 0;

        for (const product of Products) {
            try {
                // Extract only text data (exclude image and imageBack)
                const productData = {
                    id: product.id,
                    price: product.price,
                    type: product.type,
                    series: product.series,
                    name: product.name,
                    brand: product.brand,
                    author: product.author,
                    synopsis: product.synopsis,
                    quantity: product.quantity,
                    pages: product.pages,
                    language: product.language,
                    productType: product.productType,
                    productName: product.productName,
                };

                // Upload to Firestore using the product ID as the document ID
                await setDoc(doc(db, 'Products', product.id.toString()), productData);

                successCount++;
                setStatus(`Uploaded: ${product.productName} (${successCount}/${Products.length})`);
            } catch (error) {
                errorCount++;
                console.error(`Failed to upload ${product.productName}:`, error);
            }
        }

        setResults({ success: successCount, failed: errorCount });
        setStatus('Upload complete!');
        setUploading(false);
    };

    return (
        <div style={{ padding: '2rem', maxWidth: '600px', margin: '100px auto' }}>
            <h1>Product Migration Tool</h1>
            <p>This will upload all {Products.length} products to Firestore.</p>

            <button
                onClick={uploadProducts}
                disabled={uploading}
                style={{
                    padding: '1rem 2rem',
                    fontSize: '1rem',
                    backgroundColor: uploading ? '#ccc' : '#8d27ae',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: uploading ? 'not-allowed' : 'pointer',
                    marginTop: '1rem'
                }}
            >
                {uploading ? 'Uploading...' : 'Start Upload'}
            </button>

            {status && (
                <div style={{ marginTop: '2rem', padding: '1rem', backgroundColor: '#f0f0f0', borderRadius: '8px' }}>
                    <p><strong>Status:</strong> {status}</p>
                    {results.success > 0 && (
                        <div style={{ marginTop: '1rem' }}>
                            <p>✅ Successfully uploaded: {results.success}</p>
                            <p>❌ Failed: {results.failed}</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

export default ProductMigration;
