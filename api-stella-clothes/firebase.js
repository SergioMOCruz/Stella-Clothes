var admin = require('firebase-admin');
const { getStorage } = require('firebase-admin/storage');

// Load the service account key JSON file
var serviceAccount = require('./firebase-key.json');

// Initialize Firebase
const connectFirebase = () => {
  try {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      storageBucket: 'loja-online-979c4.appspot.com',
    });
    console.log('Firebase Admin Connected');
    const bucket = getStorage().bucket();
    console.log('Firebase Storage Connected');
  } catch (error) {
    console.error('Firebase Connection Error:', error.message);
    process.exit(1);
  }
};

module.exports = connectFirebase;
