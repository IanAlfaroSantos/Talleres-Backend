import { verifyFirebaseToken } from '../../configs/firebase.js';

export async function validarFirebaseToken(req, res, next) {
  try {
    const authorization = req.header('authorization') || req.header('Authorization') || '';
    const token = authorization.startsWith('Bearer ') ? authorization.slice(7).trim() : '';
    if (!token) {
      return res.status(401).json({ success: false, message: 'No se recibió un token válido de Firebase' });
    }
    const profile = await verifyFirebaseToken(token);
    req.firebaseToken = token;
    req.firebaseUser = profile;
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Sesión inválida o expirada', error: error.message });
  }
}
