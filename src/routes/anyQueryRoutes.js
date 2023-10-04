const Query = require("../model/anyQuerySchema");
const router = require("express").Router();
const { verifyUser } = require("../middleWares/verify");
const JWT = require("jsonwebtoken");
const User = require("../model/userSchema");

router.post("/create/query", verifyUser, async (req, res) => {
  try {
    const userId = req.user;
    const user = await User.findById(userId);
    const query = req.body.query;
    if (Object.keys(query).length == 0) {
      return res.status(400).send("you have to send any qury");
    }
    const newQuery = new Query({
      userId,
      name: user.name,
      email: user.email,
      query,
    });
    await newQuery.save();
    res.status(200).send({ success: true, data: newQuery });
  } catch (error) {
    console.error("Error creating blog post:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/all/query", async (req, res) => {
  try {
    const allQuery = await Query.find();
    if (!allQuery.length > 0) {
      return res.status(400).send("no query found!");
    }
    // console.log(allQuery);
    res.status(200).send({ success: true, data: allQuery });
  } catch (error) {
    console.error("Error creating blog post:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/delete/query/:id", async (req, res) => {
  try {
    const queryId = req.params.id;
    const deleteQuery = await Query.findByIdAndDelete(queryId);
    if (deleteQuery === null) {
      return res.status(400).send("no query found!");
    }
    res
      .status(200)
      .send({ success: false, message: "Query deleted successfully" });
  } catch (error) {
    console.error("Error creating blog post:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.put("/update/query/:queryId", verifyUser, async (req, res) => {
  try {
    const userId = req.user;
    const queryId = req.params.queryId;

    const query = await Query.findById(queryId);
    if (!query) {
      return res.status(404).json({ error: "Query not found" });
    }

    if (query.userId.toString() !== userId.toString()) {
      return res.status(403).json({ error: "Permission denied" });
    }

    const updatedQuery = req.body.query;

    if (Object.keys(updatedQuery).length === 0) {
      return res.status(400).send("You have to send any update");
    }

    await Query.findByIdAndUpdate(queryId, updatedQuery, { new: true });

    res
      .status(200)
      .json({ success: true, message: "Query updated successfully" });
  } catch (error) {
    console.error("Error updating query:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
