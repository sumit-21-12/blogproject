const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const cors = require('cors');

const { authmiddle } = require("../middleware/auth");
const { User, Blog } = require("../models/blog"); 


dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET;

const app = express();
app.use(express.json());

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true // if you're using cookies or Authorization headers
}));


// SIGN UP
app.post("/signup", async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email }); // await was missing

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({ name, email, password: hashedPassword });

    res.status(201).json({ message: "User created", user: newUser });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// SIGN IN
app.post("/signin", async (req, res) => {
  const { email, password } = req.body;

  try {
    const foundUser = await User.findOne({ email }); // await was missing

    if (!foundUser) {
      return res.status(400).json({ message: "Please sign up first" });
    }

    const isMatch = await bcrypt.compare(password, foundUser.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid email or password" });
    }

    const token = jwt.sign({ id: foundUser._id }, JWT_SECRET, { expiresIn: "1h" });
    res.json({ token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// SAVE DRAFT
app.post("/save-draft", authmiddle, async (req, res) => {
    try {
      const { id, title, content, tags } = req.body;
  
      const tagArray = Array.isArray(tags) 
  ? tags 
  : (tags ? tags.split(",").map(t => t.trim()) : []);

  
      let blog;
  
      if (id) {
        // Update existing blog
        blog = await Blog.findByIdAndUpdate(
          id,
          {
            title,
            content,
            tags: tagArray,
            status: "draft",
            updated_at: new Date(),
          },
          { new: true }
        );
      } 
      if (!blog) {
        // Create new blog
        blog = await Blog.create({
          title,
          content,
          tags: tagArray,
          status: "draft",
          user: req.user.id,
          created_at: new Date(),
          updated_at: new Date(),
        });
      }
  
      res.status(200).json(blog);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
  

// PUBLISH
app.post("/publish", authmiddle, async (req, res) => {
  try {
    const { id, title, content, tags } = req.body;
    const tagArray = Array.isArray(tags) 
    ? tags 
    : (tags ? tags.split(",").map(t => t.trim()) : []);
  
    let blog;

    if (id) {
      // ✅ Update only if blog belongs to current user
      blog = await Blog.findOneAndUpdate(
        { _id: id},
        {
          title,
          content,
          tags: tagArray,
          status: "published",
          updated_at: new Date(),
        },
        { new: true }
      );
    }

    if (!blog) {
      // Create new blog
      blog = await Blog.create({
        title,
        content,
        tags: tagArray,
        status: "published",
        user: req.user.id,
        created_at: new Date(),
        updated_at: new Date(),
      });
    }

    res.status(200).json(blog);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// GET ALL BLOGS FOR LOGGED-IN USER
app.get("/", authmiddle, async (req, res) => {
  try {
    const blogs = await Blog.find({ user: req.user.id }).sort({ updated_at: -1 });
    res.json(blogs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET SINGLE BLOG BY ID
app.get("/:id", authmiddle, async (req, res) => {
  try {
    const blog = await Blog.findOne({ _id: req.params.id, user: req.user.id });

    if (!blog) {
      return res.status(404).json({ error: "Not found" });
    }

    res.json(blog);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
