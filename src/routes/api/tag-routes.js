const { Router } = require("express");

const { Tag, Product, ProductTag } = require("../../models");

// The `/api/tags` endpoint

const router = Router();

router.get("/", async (req, res) => {
  try {
    const getTags = await Category.findAll({
      include: {
        model: Tag,
        attributes: ["id", "product_name", "price", "stock", "category_id"],
      },
    });

    if (!getTags) {
      return res.status(404).json({ message: "can not find tag" });
    }
    return res.json(getTags);
  } catch (error) {
    console.error(`[ERROR]: failed to render tags | ${error.message}`);
    return res.status(500).json({ error: "failed to render tags" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const renderSingleTag = await Category.findByPk(req.params.id, {
      include: [
        {
          model: Product,
          attributes: ["id", "product_name", "price", "stock", "category_id"],
        },
      ],
    });

    if (!renderSingleTag) {
      return res.status(404).json({ message: "could not render tag by id" });
    }
    return res.json(renderSingleTag);
  } catch (error) {
    console.error(`[ERROR]: failed to render tag by id | ${error.message}`);
    return res.status(500).json({ error: "failed to render tag by id" });
  }
});

router.post("/", async (req, res) => {
  try {
    const createTag = await Category.create(req.body);
    return res.json(createTag);
  } catch (error) {
    console.error(`[ERROR]: failed to create tag  | ${error.message}`);
    return res.status(500).json({ error: "failed to create tag" });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const updateTag = await Category.findByPk(req.params.id);

    if (!updateTag) {
      return res.status(404).json({ message: "can not update category" });
    }

    await Tag.update(req.body, {
      where: {
        id: req.params.id,
      },
    });

    return res.json({ message: "updated tag" });
  } catch (error) {
    console.error(`[ERROR]: failed to update tag by id | ${error.message}`);
    return res.status(500).json({ error: "failed to update tag by id" });
  }
});

router.delete("/:id", (req, res) => {
  try {
    const deleteTag = await Category.findByPk(req.params.id);

    if (!deleteTag) {
      return res.status(404).json({ message: "could not find tag" });
    }
    await Tag.destroy({
      where: {
        id: req.params.id,
      },
    });
    return res.json({ message: " deleted tag" });
  } catch (error) {
    console.error(`[ERROR]: failed to delete tag by id | ${error.message}`);
    return res.status(500).json({ error: "failed to delete tag by id" });
  }
});

module.exports = router;
