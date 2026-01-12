import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";


export const registerUser = async (req, res) => {
try {
const { name, email, password } = req.body;


const userExists = await User.findOne({ email });
if (userExists) return res.status(400).json({ message: "User already exists" });


const hashedPassword = await bcrypt.hash(password, 10);


const newUser = await User.create({ name, email, password: hashedPassword });


res.json({ success: true, user: newUser });
} catch (err) {
res.status(500).json({ error: err.message });
}
};


export const loginUser = async (req, res) => {
try {
const { email, password } = req.body;


const user = await User.findOne({ email });
if (!user) return res.status(404).json({ message: "User not found" });


const isMatch = await bcrypt.compare(password, user.password);
if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });


const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });


res.json({ success: true, token });
} catch (err) {
res.status(500).json({ error: err.message });
}
};