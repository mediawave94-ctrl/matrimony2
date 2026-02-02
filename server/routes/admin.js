const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const auth = require('../middleware/auth');
const adminAuth = require('../middleware/adminAuth');

// All routes here require Auth AND Admin rights
// But wait, logPayment might be used by a user payment callback? 
// For now, let's keep all these purely admin-facing or admin-privileged.
// Actually, logPayment in this controller is for manual admin entry. 
// Real payment callbacks would be in a separate paymentRoutes.

router.use(auth);
router.use(adminAuth);

router.get('/stats', adminController.getStats);
router.get('/users', adminController.getAllUsers);
router.delete('/users/:id', adminController.deleteUser);
router.post('/pay-manual', adminController.logPayment); // Admin giving free premium

module.exports = router;
