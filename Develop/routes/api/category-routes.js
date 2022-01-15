const { Router } = require('express');

const { Category, Product } = require('../../models');

// The `/api/categories` endpoint

const router = Router();

router.get('/', async (req, res) => {
  try {
    const getCategories = await Category.findAll({
      include: {
        model: Product,
        attributes: ["id", "product_name", "price", "stock", "category_id"],
      },
    });

    if (!getCategories) {
      return res.status(404).json({message: "can not find category"})
    }
    return res.json(getCategories)
  });
  

  


router.get('/:id', (req, res) => {
  // find one category by its `id` value
  // be sure to include its associated Products
});

router.post('/', (req, res) => {
  // create a new category
});

router.put('/:id', (req, res) => {
  // update a category by its `id` value
});

router.delete('/:id', (req, res) => {
  // delete a category by its `id` value
});

module.exports = router;
