import { authenticateDbAccess } from "../middlewares/authentication.js";
import express from 'express'

const router = express.Router();

router.post('', authenticateDbAccess());
router.put('', authenticateDbAccess());
router.get('', async (req, res, next) => {
	const now = new Date();
	const expires = new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours() + 1, 0, 0);
	res.set('Expires', expires.toUTCString());
	res.set('Cache-Control', 'public, max-age=3600'); // Cache for 1 hour
	next();
})

export default router;