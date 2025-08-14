import mongoose, { Schema, Document } from 'mongoose'

export interface IPayment extends Document {
  tenant: mongoose.Types.ObjectId // Reference to User (tenant)
  property: mongoose.Types.ObjectId // Reference to Property
  landlord: mongoose.Types.ObjectId // Reference to User (landlord)
  amount: number
  type: 'rent' | 'security_deposit' | 'late_fee' | 'maintenance' | 'other'
  status: 'pending' | 'completed' | 'failed' | 'cancelled' | 'refunded'
  dueDate: Date
  paidDate?: Date
  lateFee?: number
  stripePaymentIntentId?: string
  stripeChargeId?: string
  method: 'stripe' | 'bank_transfer' | 'check' | 'cash' | 'other'
  description?: string
  notes?: string
  receipt?: string
  recurring: boolean
  recurringId?: string
  metadata: {
    month?: string
    year?: number
    leasePeriod?: string
    previousBalance?: number
    adjustments?: number
  }
  createdAt: Date
  updatedAt: Date
}

const paymentSchema = new Schema<IPayment>({
  tenant: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  property: {
    type: Schema.Types.ObjectId,
    ref: 'Property',
    required: true
  },
  landlord: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  type: {
    type: String,
    enum: ['rent', 'security_deposit', 'late_fee', 'maintenance', 'other'],
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'cancelled', 'refunded'],
    default: 'pending'
  },
  dueDate: {
    type: Date,
    required: true
  },
  paidDate: Date,
  lateFee: {
    type: Number,
    min: 0,
    default: 0
  },
  stripePaymentIntentId: String,
  stripeChargeId: String,
  method: {
    type: String,
    enum: ['stripe', 'bank_transfer', 'check', 'cash', 'other'],
    default: 'stripe'
  },
  description: String,
  notes: String,
  receipt: String,
  recurring: {
    type: Boolean,
    default: false
  },
  recurringId: String,
  metadata: {
    month: String,
    year: Number,
    leasePeriod: String,
    previousBalance: Number,
    adjustments: Number
  }
}, {
  timestamps: true
})

// Indexes for better query performance
paymentSchema.index({ tenant: 1 })
paymentSchema.index({ property: 1 })
paymentSchema.index({ landlord: 1 })
paymentSchema.index({ status: 1 })
paymentSchema.index({ dueDate: 1 })
paymentSchema.index({ paidDate: 1 })
paymentSchema.index({ type: 1 })
paymentSchema.index({ stripePaymentIntentId: 1 })

// Virtual for total amount (including late fees)
paymentSchema.virtual('totalAmount').get(function() {
  return this.amount + (this.lateFee || 0)
})

// Virtual for days overdue
paymentSchema.virtual('daysOverdue').get(function() {
  if (this.status === 'completed' || this.paidDate) {
    return 0
  }
  const now = new Date()
  const due = new Date(this.dueDate)
  const diffTime = now.getTime() - due.getTime()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  return Math.max(0, diffDays)
})

// Virtual for is overdue
paymentSchema.virtual('isOverdue').get(function() {
  return this.daysOverdue > 0
})

// Pre-save middleware to calculate late fees
paymentSchema.pre('save', function(next) {
  if (this.isModified('status') && this.status === 'completed' && !this.paidDate) {
    this.paidDate = new Date()
  }
  
  // Calculate late fees for overdue rent payments
  if (this.type === 'rent' && this.status === 'pending' && this.isOverdue) {
    const daysOverdue = this.daysOverdue
    if (daysOverdue > 0) {
      // Standard late fee calculation (5% of rent after 5 days)
      if (daysOverdue > 5) {
        this.lateFee = Math.round(this.amount * 0.05 * 100) / 100
      }
    }
  }
  
  next()
})

// Static method to get payment statistics
paymentSchema.statics.getPaymentStats = async function(landlordId: string, startDate?: Date, endDate?: Date) {
  const match: any = { landlord: landlordId }
  
  if (startDate && endDate) {
    match.dueDate = { $gte: startDate, $lte: endDate }
  }
  
  const stats = await this.aggregate([
    { $match: match },
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 },
        totalAmount: { $sum: '$amount' },
        totalLateFees: { $sum: '$lateFee' }
      }
    }
  ])
  
  return stats
}

// Static method to get overdue payments
paymentSchema.statics.getOverduePayments = async function(landlordId: string) {
  const now = new Date()
  return this.find({
    landlord: landlordId,
    status: 'pending',
    dueDate: { $lt: now },
    type: 'rent'
  }).populate('tenant property')
}

export default mongoose.models.Payment || mongoose.model<IPayment>('Payment', paymentSchema)
