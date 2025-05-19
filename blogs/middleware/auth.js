const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();
const secret = process.env.JWT_SECRET;

 const authmiddle= async (req,res,next)=>{
    const header = req.headers["authorization"];

try{
    const decode= jwt.verify(header,secret);
    req.user=decode;
    next();
}
catch {
    return res.json({
        message:"error"
    })
}
}
module.exports = { authmiddle };