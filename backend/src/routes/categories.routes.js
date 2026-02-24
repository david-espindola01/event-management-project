const { Router } = require('express');
const {
  getCategories, getCategoriesAdmin,
  createCategory, updateCategory,
  deleteCategory, restoreCategory,
} = require('../controllers/categories.controller');

const router = Router();

router.get('/',                     getCategories);
router.get('/admin',                getCategoriesAdmin);
router.post('/admin',               createCategory);
router.put('/admin/:id',            updateCategory);
router.delete('/admin/:id',         deleteCategory);
router.patch('/admin/:id/restore',  restoreCategory);

module.exports = router;