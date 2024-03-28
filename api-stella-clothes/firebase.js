var admin = require('firebase-admin');

// Load the service account key JSON file
var serviceAccount = require('./firebase-key.json');

// Initialize Firebase
const connectFirebase = () => {
  try {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
    console.log('Firebase Connected');
  } catch (error) {
    console.error('Firebase Connection Error:', error.message);
    process.exit(1);
  }
};

module.exports = connectFirebase;
