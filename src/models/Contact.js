import mongoose from 'mongoose';

const ContactSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true,
        maxlength: [100, 'Name cannot exceed 100 characters']
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        trim: true,
        lowercase: true,
        match: [
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            'Please provide a valid email address'
        ],
        maxlength: [255, 'Email cannot exceed 255 characters']
    },
    phone: {
        type: String,
        trim: true,
        maxlength: [20, 'Phone number cannot exceed 20 characters'],
        match: [
            /^[\+]?[1-9][\d]{0,15}$/,
            'Please provide a valid phone number'
        ]
    },
    group: {
        type: String,
        enum: ['Friends', 'Work', 'Family', 'Other'],
        default: 'Other',
        trim: true
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Create indexes for better performance
ContactSchema.index({ name: 1 });
ContactSchema.index({ email: 1 }, { unique: true });
ContactSchema.index({ group: 1 });

// Virtual for formatted phone display
ContactSchema.virtual('formattedPhone').get(function () {
    if (!this.phone) return '';
    // Simple formatting for display
    const cleaned = this.phone.replace(/\D/g, '');
    if (cleaned.length === 10) {
        return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
    }
    return this.phone;
});

// Pre-save middleware to ensure email uniqueness
ContactSchema.pre('save', async function (next) {
    if (this.isModified('email')) {
        const existingContact = await this.constructor.findOne({
            email: this.email,
            _id: { $ne: this._id }
        });
        if (existingContact) {
            const error = new Error('Email already exists');
            error.code = 11000;
            return next(error);
        }
    }
    next();
});

export default mongoose.models.Contact || mongoose.model('Contact', ContactSchema);