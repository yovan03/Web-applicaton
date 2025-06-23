const express = require('express');
const router = express.Router();
const { getAllHeritage, getSingleHeritage, getAllHeritageByKeyword, 
    createHeritage, updateHeritage, deleteHeritage } = require('../controllers/searchController');
const { protect } = require('../middleware/authMiddleware');
const { adminOnly } = require('../middleware/roleMiddleware');

// Рута за добивање на сите објекти
router.get('/', getAllHeritage);

// Рута за добивање на објекти според клучен збор
router.get('/keyword', getAllHeritageByKeyword);

// Рута за добивање на еден објект по ID
router.get('/:id', getSingleHeritage);

//-------------
//САМО ЗА АДМИН
//------
// Рута за додавање на еден објект 
router.post('/', protect, adminOnly, createHeritage);
// Рута за ажурирање на еден објект 
router.put('/:id', protect, adminOnly, updateHeritage);
// Рута за бришења на еден објект 
router.delete('/:id', protect, adminOnly, deleteHeritage);

module.exports = router;
