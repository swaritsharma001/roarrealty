import express from "express";
import Blog from "../models/Blog.js";
import upload from "../jwt/upload.js"
import { verifyAdmin } from "../jwt/jwt.js"
import slugify from "slugify"
const router = express.Router();

router.post("/upload", verifyAdmin, upload.single("cover"), async (req, res) => {
  if (!req.file) return res.status(400).send("No file uploaded");

  const cover = req.file.path;
  const blog = new Blog({
    Title: req.body.Title,
    slug: slugify(req.body.Title, { lower: true }),
    description: req.body.description,
    cover: cover,
    Sorting: Date.now(),
    types: req.body.types,
    createdAt: new Date(),
    uploadedBy: "Admin roarrealty.ae",
  });

  try {
    await blog.save();
    res.status(200).send("Blog uploaded");
  } catch (error) {
    console.log(error)
    res.status(500).send("Internal Server Error");
  }
});

router.get("/allBlogs", async (req, res) => {
  const { page = 1, limit = 10 } = req.query; // Defaults: page 1, 10 blogs per page
  try {
    const parsedLimit = parseInt(limit, 10);

    const allBlogs = await Blog.find()
      .sort({ Sorting: -1 })
 // Sort by Sorting field in descending order
      .skip((page - 1) * parsedLimit)
      .limit(parsedLimit);

    const formattedBlogs = allBlogs.map(({ _doc, createdAt }) => ({
      ..._doc,
      createdAt: new Date(createdAt).toDateString(),
    }));
const totalLength = await Blog.countDocuments();
    
    return res.status(200).json({blogs: formattedBlogs, totalLength});
  } catch (error) {
    console.error("Error fetching blogs:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.post("/UploadImg", verifyAdmin, upload.single("img"), async (req, res)=>{
  if(!req.file) return res.status(400).send("No file Uploaded")
  const img = req.file.path;
  res.json({url: img})
}) 

router.get("/blog/:id", async (req, res)=>{
  try {
    const slug = req.params.id;
    const BlogData = await Blog.findOne({ slug })
    
const UpdateViews = await Blog.findOneAndUpdate({slug}, {views: BlogData.views + 1}, {new: true })
    if(!Blog) return res.status(404).json({message: "Blog not found"})
    res.json(BlogData)
  } catch (error) {
    console.log(error)
    res.status(500).json({message: "Internal Server Error"})
  }
})

router.delete("/delete/:id", verifyAdmin, async(req, res)=>{
  try {
    const BlogData = await Blog.findById(req.params.id)
    if(!BlogData) return res.status(404).json({message: "The Blog you are looking for is not here"})
    await Blog.findByIdAndDelete(req.params.id)
    console.log("hit")
  } catch (error) {
    res.status(500).json({message: "Internal Server Error"})
  }
})

export default router;