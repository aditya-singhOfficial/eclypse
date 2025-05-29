// services/userService.js
import User from '../models/User.js';

export const getUserById = id => User.findById(id).select('-password');
export const updateUser   = (id, data) => User.findByIdAndUpdate(id, data, { new: true });
export const deleteUser   = id => User.findByIdAndDelete(id);
