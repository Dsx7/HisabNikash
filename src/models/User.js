import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
    uid: { type: String, required: true, unique: true }, // Firebase UID
    email: { type: String, required: true },
    displayName: String,
    photoURL: String,
    role: { type: String, default: 'user', enum: ['user', 'admin'] },
    createdAt: { type: Date, default: Date.now }
});

// Check if model exists before compiling (Prevents Next.js hot-reload error)
const User = mongoose.models.User || mongoose.model('User', UserSchema);

export default User;