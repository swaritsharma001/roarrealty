import express from "express";
import Page from "../models/Page.js";
import upload from "../jwt/upload.js";
import { verifyAdmin } from "../jwt/jwt.js";
import Job from "../models/Career.js";
import Contact from "../models/Contact.js"
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const page = await Page.findOne();
    res.status(200).json(page);
  } catch (error) {
    res.status(500).json({ message: "SOMETHING WENT WRONG" });
  }
});


router.post("/statistics", verifyAdmin, async (req, res) => {
  try {
    const { PropertiesSold, happyClient, Experience, Satisfaction } = req.body;
    if (!PropertiesSold || !happyClient || !Experience || !Satisfaction) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const page = await Page.findOneAndUpdate(
      {},
      { PropertiesSold, happyClient, Experience, Satisfaction },
      { new: true, upsert: true }
    );
    res.status(200).json(page);
  } catch (error) {
    res.status(500).json({ message: "SOMETHING WENT WRONG" });
  }
});

router.post("/contact", verifyAdmin, async (req, res) => {
  try {
    const { primaryEmail, supportEmail, PhoneNumber, Address, BuyPhone } = req.body;
    if (!primaryEmail || !supportEmail || !PhoneNumber || !Address) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const page = await Page.findOneAndUpdate(
      {},
      { primaryEmail, supportEmail, PhoneNumber, Address, BuyPhone },
      { new: true, upsert: true }
    );
    res.status(200).json(page);
  } catch (error) {
    res.status(500).json({ message: "SOMETHING WENT WRONG" });
  }
});

router.post("/links", verifyAdmin, async (req, res) => {
  try {
    const { Facebook, Instagram, Twitter, LinkedIn } = req.body;
    if (!Facebook || !Instagram || !Twitter || !LinkedIn) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const page = await Page.findOneAndUpdate(
      {},
      { Facebook, Instagram, Twitter, LinkedIn },
      { new: true, upsert: true }
    );
    res.status(200).json(page);
  } catch (error) {
    res.status(500).json({ message: "SOMETHING WENT WRONG" });
  }
});

router.post("/site", verifyAdmin, async (req, res) => {
  try {
    const { SiteName, HeroTitle, HeroSubtitle } = req.body;
    if (!SiteName || !HeroTitle || !HeroSubtitle) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const page = await Page.findOneAndUpdate(
      {},
      { SiteName, HeroTitle, HeroSubtitle },
      { new: true, upsert: true }
    );
    res.status(200).json(page);
  } catch (error) {
    res.status(500).json({ message: "SOMETHING WENT WRONG" });
  }
});

router.post("/image", verifyAdmin, upload.single("HeroImage"), async (req, res) => {
  try {
    const img = req.file?.path;
    if (!img) return res.status(400).json({ message: "Image is required" });
    const page = await Page.findOneAndUpdate(
      {},
      { HeroImage: img },
      { new: true, upsert: true }
    );
    res.status(200).json(page);
  } catch (error) {
    res.status(500).json({ message: "SOMETHING WENT WRONG" });
  }
});

router.post("/careers", verifyAdmin, async (req, res) => {
  try {
    const {
      title,
      department,
      location,
      type,
      salary,
      salaryMin,
      salaryMax,
      description,
      requirements,
      responsibilities,
      postedDate,
      applyUrl,
      contactEmail,
      experience,
      benefits,
      remote,
    } = req.body;

    if (!title || !description) {
      return res.status(400).json({ message: "Title and description are required" });
    }

    const newJob = await Job.create({
      title,
      department,
      location,
      type,
      salary,
      salaryMin,
      salaryMax,
      description,
      requirements: requirements || [],
      responsibilities: responsibilities || [],
      postedDate: postedDate ? new Date(postedDate) : Date.now(),
      applyUrl: applyUrl || '',
      contactEmail: contactEmail || '',
      experience: experience || '',
      benefits: benefits || [],
      remote: remote || false,
      createdBy: req.user._id,
    });

    res.status(201).json({ message: "Job created successfully", job: newJob });
  } catch (error) {
    console.error("POST /careers ERROR:", error);
    res.status(500).json({ message: "SOMETHING WENT WRONG" });
  }
});

router.get("/careers", async (req, res) => {
  try {
    const jobs = await Job.find({ isActive: true })
      .sort({ postedDate: -1 })
      .select('-createdBy -__v');

    res.status(200).json({ 
      message: "Jobs fetched successfully", 
      jobs,
      count: jobs.length 
    });
  } catch (error) {
    console.error("GET /careers ERROR:", error);
    res.status(500).json({ message: "SOMETHING WENT WRONG" });
  }
});

router.post("/contactUser", async (req, res) => {
  try {
    const { name, email, phone, message, language } = req.body;
    if (!name || !email || !phone || !message || !language) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const newContact = await Contact.create({ name, email, phone, message, language });
    res.status(201).json({ success: true, contact: newContact });
  } catch {
    res.status(500).json({ success: false, message: "Server error" });
  }
});

router.get("/contact", async (req, res) => {
  try {
    const contacts = await Contact.find();
    res.status(200).json({ success: true, contacts });
  } catch {
    res.status(500).json({ success: false, message: "Server error" });
  }
});

router.delete("/contact/:id", async (req, res) => {
  try {
    const deleted = await Contact.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Contact not found" });
    res.status(200).json({ success: true, message: "Deleted successfully" });
  } catch {
    res.status(500).json({ success: false, message: "Server error" });
  }
});
export default router;