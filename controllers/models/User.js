const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true, match: /.+\@.+\..+/ },
    password: { type: String, required: true },
    role: { type: String, enum: ['Admin', 'Client'], default: 'Client',},
    isBanned: {type: Boolean, default: false },
    wishlist: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Search',
        }],
        visited: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Search',
        }],
}, { timestamps: true });

// Пред да се сними корисникот, се хешира лозинката
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        return next();
    }
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

// Метод за споредба на внесена лозинка со хешираната
userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);

module.exports = User;