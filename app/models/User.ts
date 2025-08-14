import mongoose, { Schema, Document } from 'mongoose'
import bcrypt from 'bcryptjs'

export interface IUser extends Document {
  email: string
  password: string
  firstName: string
  lastName: string
  role: 'landlord' | 'tenant' | 'manager'
  companyName?: string
  phone?: string
  avatar?: string
  isVerified: boolean
  isActive: boolean
  lastLogin?: Date
  preferences: {
    notifications: boolean
    emailUpdates: boolean
    theme: 'light' | 'dark'
    language: string
  }
  subscription: {
    plan: string
    status: 'active' | 'inactive' | 'cancelled'
    startDate?: Date
    endDate?: Date
    stripeCustomerId?: string
    stripeSubscriptionId?: string
    currentPeriodEnd?: Date
  }
  createdAt: Date
  updatedAt: Date
  comparePassword(candidatePassword: string): Promise<boolean>
}

const userSchema = new Schema<IUser>({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  password: {
    type: String,
    required: true,
    minlength: 8
  },
  firstName: {
    type: String,
    required: true,
    trim: true
  },
  lastName: {
    type: String,
    required: true,
    trim: true
  },
  role: {
    type: String,
    enum: ['landlord', 'tenant', 'manager'],
    required: true
  },
  companyName: {
    type: String,
    trim: true,
    required: function() {
      return this.role === 'landlord' || this.role === 'manager'
    }
  },
  phone: {
    type: String,
    trim: true
  },
  avatar: {
    type: String
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastLogin: {
    type: Date
  },
  preferences: {
    notifications: {
      type: Boolean,
      default: true
    },
    emailUpdates: {
      type: Boolean,
      default: true
    },
    theme: {
      type: String,
      enum: ['light', 'dark'],
      default: 'light'
    },
    language: {
      type: String,
      default: 'en'
    }
  },
  subscription: {
    plan: {
      type: String,
      default: 'free'
    },
    status: {
      type: String,
      enum: ['active', 'inactive', 'cancelled'],
      default: 'inactive'
    },
    startDate: Date,
    endDate: Date,
    stripeCustomerId: String,
    stripeSubscriptionId: String,
    currentPeriodEnd: Date
  }
}, {
  timestamps: true
})

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next()
  
  try {
    const salt = await bcrypt.genSalt(12)
    this.password = await bcrypt.hash(this.password, salt)
    next()
  } catch (error) {
    next(error as Error)
  }
})

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password)
}

// Virtual for full name
userSchema.virtual('fullName').get(function() {
  return `${this.firstName} ${this.lastName}`
})

// Ensure virtual fields are serialized
userSchema.set('toJSON', {
  virtuals: true,
  transform: function(doc, ret) {
    delete ret.password
    return ret
  }
})

export default mongoose.models.User || mongoose.model<IUser>('User', userSchema)
