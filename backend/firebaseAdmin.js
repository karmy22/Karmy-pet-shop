const fs = require('fs');
const path = require('path');
const admin = require('firebase-admin');

const serviceAccountPath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH;

if (!serviceAccountPath) {
  throw new Error('Missing FIREBASE_SERVICE_ACCOUNT_PATH in backend/.env');
}

const resolvedServiceAccountPath = path.isAbsolute(serviceAccountPath)
  ? serviceAccountPath
  : path.resolve(__dirname, serviceAccountPath);

if (!fs.existsSync(resolvedServiceAccountPath)) {
  throw new Error(`Firebase service account file not found at ${resolvedServiceAccountPath}`);
}

const serviceAccount = require(resolvedServiceAccountPath);

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

const firebaseProjectId = serviceAccount.project_id || process.env.FIREBASE_PROJECT_ID || 'unknown-project';

module.exports = {
  admin,
  auth: admin.auth(),
  firestore: admin.firestore(),
  firebaseProjectId,
};