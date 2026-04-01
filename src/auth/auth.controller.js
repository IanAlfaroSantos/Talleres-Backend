export function getSession(req, res) {
  return res.json({ success: true, user: req.firebaseUser });
}
