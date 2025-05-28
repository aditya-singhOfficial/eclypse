import mongoose, {model, Schema} from 'mongoose';

const userSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
}, {
    timestamps: true
});

// Check if the model already exists to prevent overwrite issues
const User = mongoose.models.User || model('User', userSchema);

export default User;
