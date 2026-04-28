const mongoose = require('mongoose');

function getInitials(name = '') {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    phone: {
      type: String,
      required: true,
      trim: true,
      index: true
    },
    role: {
      type: String,
      enum: ['patient', 'doctor'],
      required: true
    },
    initials: {
      type: String,
      trim: true
    },
    email: {
      type: String,
      trim: true,
      default: ''
    },
    age: Number,
    gender: {
      type: String,
      trim: true,
      default: ''
    },
    specialization: {
      type: String,
      trim: true,
      default: ''
    },
    experience: {
      type: String,
      trim: true,
      default: ''
    },
    fee: {
      type: Number,
      default: 0
    },
    rating: {
      type: Number,
      default: 0
    },
    reviews: {
      type: Number,
      default: 0
    },
    lastSeenAt: {
      type: Date,
      default: null
    }
  },
  {
    timestamps: true
  }
);

userSchema.pre('save', function setInitials(next) {
  if (!this.initials) {
    this.initials = getInitials(this.name);
  }

  next();
});

module.exports = mongoose.models.User || mongoose.model('User', userSchema);
