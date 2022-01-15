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

router.get("/:id", (req, res) => {
  // find a single tag by its `id`
  // be sure to include its associated Product data
});

router.post("/", (req, res) => {
  // create a new tag
});

router.put("/:id", (req, res) => {
  // update a tag's name by its `id` value
});

router.delete("/:id", (req, res) => {
  // delete on tag by its `id` value
});

module.exports = router;
