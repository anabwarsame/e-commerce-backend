const { Router } = require("express");

const { Product, Category, Tag, ProductTag } = require("../../models");

// The `/api/products` endpoint

const router = Router();

// get all products
router.get("/", async (req, res) => {
  try {
    const getProducts = await Product.findAll({
      include: [
        {
          model: Category,
        },
        {
          model: Tag,
          through: ProductTag,
        },
      ],
    });

    if (!getProducts) {
      return res.status(404).json({ message: "can not find products" });
    }
    return res.json(getProducts);
  } catch (error) {
    console.error(`[ERROR]: failed to render products | ${error.message}`);
    return res.status(500).json({ error: "failed to render products" });
  }
});

// get one product
router.get("/:id", async (req, res) => {
  try {
    const renderSingleProduct = await Product.findByPk(req.params.id, {
      include: [
        {
          model: Category,
        },
        {
          model: Tag,
          through: ProductTag,
        },
      ],
    });

    if (!renderSingleProduct) {
      return res
        .status(404)
        .json({ message: "could not render product by id" });
    }
    return res.json(renderSingleProduct);
  } catch (error) {
    console.error(`[ERROR]: failed to render product by id | ${error.message}`);
    return res.status(500).json({ error: "failed to render product by id" });
  }
});

router.post("/", async (req, res) =>
  Product.create(req.body)
    .then((product) => {
      // if there's product tags, we need to create pairings to bulk create in the ProductTag model
      if (req.body.tagIds.length) {
        const productTagIdArr = req.body.tagIds.map((tag_id) => {
          return {
            product_id: product.id,
            tag_id,
          };
        });
        return ProductTag.bulkCreate(productTagIdArr);
      }
      // if no product tags, just respond
      res.status(200).json(product);
    })
    .then((productTagIds) => res.status(200).json(productTagIds))
    .catch((err) => {
      console.log(err);
      res.status(400).json(err);
    })
);

// update product
router.put("/:id", (req, res) => {
  // update product data
  Product.update(req.body, {
    where: {
      id: req.params.id,
    },
  })
    .then((product) => {
      // find all associated tags from ProductTag
      return ProductTag.findAll({ where: { product_id: req.params.id } });
    })
    .then((productTags) => {
      // get list of current tag_ids
      const productTagIds = productTags.map(({ tag_id }) => tag_id);
      // create filtered list of new tag_ids
      const newProductTags = req.body.tagIds
        .filter((tag_id) => !productTagIds.includes(tag_id))
        .map((tag_id) => {
          return {
            product_id: req.params.id,
            tag_id,
          };
        });
      // figure out which ones to remove
      const productTagsToRemove = productTags
        .filter(({ tag_id }) => !req.body.tagIds.includes(tag_id))
        .map(({ id }) => id);

      // run both actions
      return Promise.all([
        ProductTag.destroy({ where: { id: productTagsToRemove } }),
        ProductTag.bulkCreate(newProductTags),
      ]);
    })
    .then((updatedProductTags) => res.json(updatedProductTags))
    .catch((err) => {
      // console.log(err);
      res.status(400).json(err);
    });
});

router.delete("/:id", async (req, res) => {
  try {
    const deleteProduct = await Product.findByPk(req.params.id);

    if (!deleteProduct) {
      return res.status(404).json({ message: "could not find Product" });
    }
    await Product.destroy({
      where: {
        id: req.params.id,
      },
    });
    return res.json({ message: " deleted Product" });
  } catch (error) {
    console.error(
      `[ERROR]: failed to delete categories by id | ${error.message}`
    );
    return res.status(500).json({ error: "failed to delete categories by id" });
  }
});

module.exports = router;
