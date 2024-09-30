// Load environment variables from .env
require("dotenv").config();
const admin = require("firebase-admin");
const serviceAccount = require("../config/serviceAccountKey.json");

// Firebase service account configuration using environment variables
// const firebaseConfig = {
//   type: "service_account",
//   project_id: process.env.FIREBASE_PROJECT_ID,
//   private_key: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"), // Important: replace `\n` with newlines
//   client_email: process.env.FIREBASE_CLIENT_EMAIL,
// };

try {
  // Initialize Firebase Admin SDK
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: process.env.FIREBASE_DATABASE_URL,
  });
  console.log("🎯 Firebase Admin SDK initialized successfully.");
} catch (error) {
  console.error("Error initializing Firebase Admin SDK:", error.message);
}

module.exports = admin;
