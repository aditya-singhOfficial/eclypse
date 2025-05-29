// services/authService.js
import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt    from 'jsonwebtoken';

export async function register({ name, email, password }) {
    const existing = await User.findOne({ email });
    if (existing) throw new Error('Email already in use');
    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashed });
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET);
    return { user, token };
}

export async function login({ email, password }) {
    const user = await User.findOne({ email });
    if (!user) throw new Error('Invalid credentials');
    const match = await bcrypt.compare(password, user.password);
    if (!match) throw new Error('Invalid credentials');
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET);
    return { user, token };
}
