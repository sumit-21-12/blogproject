

const mongoose = require('mongoose');
require('dotenv').config();
const mu = process.env.MONGODB_URI;
mongoose.connect(mu)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

const UserSchema= new mongoose.Schema({
    name:{
        type:String,
        required:true,
    
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    }
    });
    
const BlogSchema=new mongoose.Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
    tags: [String],
    status: { type: String, enum: ['draft', 'published'], default: 'draft' },
    user:{type:mongoose.Schema.Types.ObjectId, ref:'User'},
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now }
});
const User = mongoose.model("User", UserSchema);
const Blog = mongoose.model("Blog", BlogSchema);

module.exports = { User, Blog };