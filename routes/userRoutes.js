const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getUserProfile, updatePassword, deleteUser,
    getAllUsers, updateUserRole, banUser, resetPassword, searchUsers } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');
const { adminOnly } = require('../middleware/roleMiddleware');

//-------
//Јавни рути
//-------
// Регистрација на корисник
router.post('/register', registerUser);
// Најава на корисник
router.post('/login', loginUser);

//-------
// За најавени корисници
//-------
// Добивање на профил на најавен корисник
router.get('/profile', protect, getUserProfile);
// Ажурирање пассворд
router.put('/password', protect, updatePassword);
// Бришење на профил на корисник
router.delete('/:id', protect, deleteUser);
// Reset password преку email
router.put('/reset-password', resetPassword); // Може да биде без protect

//-------
// Само за Admin
//-------
// Добивање листа со корисници
router.get('/all', protect, adminOnly, getAllUsers);
// Промена на улога на корисник
router.put('/role/:id', protect, adminOnly, updateUserRole);
// Времено отсранување на корисник
router.put('/ban/:id', protect, adminOnly, banUser);
// Пребарување корисник по клучен збор
router.get('/search', protect, adminOnly, searchUsers);




module.exports = router;
