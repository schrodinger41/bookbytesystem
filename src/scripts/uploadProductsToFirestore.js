// Migration script to upload products from Product.jsx to Firestore
// Run this once to populate your Firestore database with book data

import { initializeApp } from 'firebase/app';
import { getFirestore, collection, doc, setDoc } from 'firebase/firestore';
import Products from '../components/product/Product.jsx';

// Firebase configuration (same as your main config)
const firebaseConfig = {
    apiKey: "AIzaSyBJCiHJnmZvZLNPPLWPNMWUdVGPxmGOzjg",
    authDomain: "labubu-store.firebaseapp.com",
    projectId: "labubu-store",
    storageBucket: "labubu-store.firebasestorage.app",
    messagingSenderId: "1095131734166",
    appId: "1:1095131734166:web:e6f8e7a6e0a7c2e1f8b9c0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function uploadProducts() {
    console.log('Starting product upload to Firestore...');
    console.log(`Total products to upload: ${Products.length}`);

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
            console.log(`✓ Uploaded: ${product.productName} (ID: ${product.id})`);
        } catch (error) {
            errorCount++;
            console.error(`✗ Failed to upload ${product.productName} (ID: ${product.id}):`, error);
        }
    }

    console.log('\n=== Upload Summary ===');
    console.log(`Successfully uploaded: ${successCount} products`);
    console.log(`Failed: ${errorCount} products`);
    console.log('======================\n');
}

// Run the upload
uploadProducts()
    .then(() => {
        console.log('Migration complete!');
        process.exit(0);
    })
    .catch((error) => {
        console.error('Migration failed:', error);
        process.exit(1);
    });
