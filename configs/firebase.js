import axios from 'axios';

export const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID
};

const FIRESTORE_BASE_URL = `https://firestore.googleapis.com/v1/projects/${firebaseConfig.projectId}/databases/(default)/documents`;
const ACCOUNTS_LOOKUP_URL = `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${firebaseConfig.apiKey}`;

const fireHeaders = (idToken) => ({
  Authorization: `Bearer ${idToken}`,
  'Content-Type': 'application/json'
});

const toFirestoreValue = (value) => {
  if (value === null || value === undefined) return { nullValue: null };
  if (Array.isArray(value)) return { arrayValue: { values: value.map(toFirestoreValue) } };
  if (typeof value === 'string') return { stringValue: value };
  if (typeof value === 'boolean') return { booleanValue: value };
  if (typeof value === 'number') return Number.isInteger(value) ? { integerValue: String(value) } : { doubleValue: value };
  if (typeof value === 'object') return { mapValue: { fields: Object.fromEntries(Object.entries(value).map(([key, current]) => [key, toFirestoreValue(current)])) } };
  return { stringValue: String(value) };
};

const fromFirestoreValue = (value) => {
  if (!value || typeof value !== 'object') return null;
  if ('stringValue' in value) return value.stringValue;
  if ('booleanValue' in value) return value.booleanValue;
  if ('integerValue' in value) return Number(value.integerValue);
  if ('doubleValue' in value) return Number(value.doubleValue);
  if ('nullValue' in value) return null;
  if ('arrayValue' in value) return (value.arrayValue.values || []).map(fromFirestoreValue);
  if ('mapValue' in value) return Object.fromEntries(Object.entries(value.mapValue.fields || {}).map(([key, current]) => [key, fromFirestoreValue(current)]));
  return null;
};

const toFirestoreFields = (payload) => Object.fromEntries(Object.entries(payload).map(([key, value]) => [key, toFirestoreValue(value)]));
const fromFirestoreFields = (fields = {}) => Object.fromEntries(Object.entries(fields).map(([key, value]) => [key, fromFirestoreValue(value)]));

export async function verifyFirebaseToken(idToken) {
  const response = await axios.post(ACCOUNTS_LOOKUP_URL, { idToken }, { headers: { 'Content-Type': 'application/json' } });
  const user = response.data?.users?.[0];
  if (!user?.localId) throw new Error('No se pudo validar la sesión con Firebase');
  return {
    uid: user.localId,
    email: user.email || '',
    displayName: user.displayName || '',
    phoneNumber: user.phoneNumber || '',
    photoUrl: user.photoUrl || ''
  };
}

export async function getWorkshopDocument(idToken, uid) {
  const url = `${FIRESTORE_BASE_URL}/workshops/${uid}`;
  const response = await axios.get(url, { headers: fireHeaders(idToken), validateStatus: (status) => status === 200 || status === 404 });
  if (response.status === 404) return null;
  return fromFirestoreFields(response.data?.fields || {});
}

export async function saveWorkshopDocument(idToken, uid, payload) {
  const url = `${FIRESTORE_BASE_URL}/workshops/${uid}`;
  const response = await axios.patch(url, { fields: toFirestoreFields(payload) }, { headers: fireHeaders(idToken) });
  return fromFirestoreFields(response.data?.fields || {});
}
