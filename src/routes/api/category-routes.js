const { Router } = require("express");

const { Category, Product } = require("../../models");

// The `/api/categories` endpoint

const router = Router();

router.get("/", async (req, res) => {
  try {
    const getCategories = await Category.findAll({
      include: {
        model: Product,
        attributes: ["id", "product_name", "price", "stock", "category_id"],
      },
    });

    if (!getCategories) {
      return res.status(404).json({ message: "can not find category" });
    }
    return res.json(getCategories);
  } catch (error) {
    console.error(`[ERROR]: failed to render categories | ${error.message}`);
    return res.status(500).json({ error: "failed to render categories" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const renderSingleCategory = await Category.findByPk(req.params.id, {
      include: [
        {
          model: Product,
          attributes: ["id", "product_name", "price", "stock", "category_id"],
        },
      ],
    });

    if (!renderSingleCategory) {
      return res
        .status(404)
        .json({ message: "could not render category by id" });
    }
    return res.json(renderSingleCategory);
  } catch (error) {
    console.error(
      `[ERROR]: failed to render categories by id | ${error.message}`
    );
    return res.status(500).json({ error: "failed to render categories by id" });
  }
});

router.post("/", async (req, res) => {
  try {
    const createCategory = await Category.create(req.body);
    return res.json(createCategory);
  } catch (error) {
    console.error(`[ERROR]: failed to create categories  | ${error.message}`);
    return res.status(500).json({ error: "failed to create categories" });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const updateCategory = await Category.findByPk(req.params.id);

    if (!updateCategory) {
      return res.status(404).json({ message: "can not update category" });
    }

    await Category.update(req.body, {
      where: {
        id: req.params.id,
      },
    });

    return res.json({ message: "updated category" });
  } catch (error) {
    console.error(
      `[ERROR]: failed to update categories by id | ${error.message}`
    );
    return res.status(500).json({ error: "failed to update categories by id" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const deleteCategory = await Category.findByPk(req.params.id);

    if (!deleteCategory) {
      return res.status(404).json({ message: "could not find category" });
    }
    await Category.destroy({
      where: {
        id: req.params.id,
      },
    });
    return res.json({ message: " deleted category" });
  } catch (error) {
    console.error(
      `[ERROR]: failed to delete categories by id | ${error.message}`
    );
    return res.status(500).json({ error: "failed to delete categories by id" });
  }
});

module.exports = router;
