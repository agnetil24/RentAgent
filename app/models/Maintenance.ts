import mongoose, { Schema, Document } from 'mongoose'

export interface IMaintenance extends Document {
  property: mongoose.Types.ObjectId // Reference to Property
  tenant: mongoose.Types.ObjectId // Reference to User (tenant who reported)
  landlord: mongoose.Types.ObjectId // Reference to User (landlord)
  assignedTo?: mongoose.Types.ObjectId // Reference to User (maintenance worker/manager)
  title: string
  description: string
  category: 'plumbing' | 'electrical' | 'hvac' | 'appliance' | 'structural' | 'pest_control' | 'cleaning' | 'other'
  priority: 'low' | 'medium' | 'high' | 'emergency'
  status: 'pending' | 'assigned' | 'in_progress' | 'completed' | 'cancelled'
  reportedDate: Date
  scheduledDate?: Date
  completedDate?: Date
  estimatedCost?: number
  actualCost?: number
  images: string[]
  notes: string[]
  aiInsights?: {
    urgency: 'low' | 'medium' | 'high'
    estimatedTimeToComplete: string
    recommendedContractor?: string
    similarIssues: string[]
    preventiveMeasures: string[]
  }
  createdAt: Date
  updatedAt: Date
}

const maintenanceSchema = new Schema<IMaintenance>({
  property: {
    type: Schema.Types.ObjectId,
    ref: 'Property',
    required: true
  },
  tenant: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  landlord: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  assignedTo: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    enum: ['plumbing', 'electrical', 'hvac', 'appliance', 'structural', 'pest_control', 'cleaning', 'other'],
    required: true
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'emergency'],
    default: 'medium'
  },
  status: {
    type: String,
    enum: ['pending', 'assigned', 'in_progress', 'completed', 'cancelled'],
    default: 'pending'
  },
  reportedDate: {
    type: Date,
    default: Date.now
  },
  scheduledDate: Date,
  completedDate: Date,
  estimatedCost: {
    type: Number,
    min: 0
  },
  actualCost: {
    type: Number,
    min: 0
  },
  images: [String],
  notes: [String],
  aiInsights: {
    urgency: {
      type: String,
      enum: ['low', 'medium', 'high']
    },
    estimatedTimeToComplete: String,
    recommendedContractor: String,
    similarIssues: [String],
    preventiveMeasures: [String]
  }
}, {
  timestamps: true
})

// Indexes for better query performance
maintenanceSchema.index({ property: 1 })
maintenanceSchema.index({ tenant: 1 })
maintenanceSchema.index({ landlord: 1 })
maintenanceSchema.index({ assignedTo: 1 })
maintenanceSchema.index({ status: 1 })
maintenanceSchema.index({ priority: 1 })
maintenanceSchema.index({ category: 1 })
maintenanceSchema.index({ reportedDate: 1 })
maintenanceSchema.index({ scheduledDate: 1 })

// Virtual for days since reported
maintenanceSchema.virtual('daysSinceReported').get(function() {
  const now = new Date()
  const reported = new Date(this.reportedDate)
  const diffTime = now.getTime() - reported.getTime()
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
})

// Virtual for is overdue
maintenanceSchema.virtual('isOverdue').get(function() {
  if (this.status === 'completed' || this.status === 'cancelled') {
    return false
  }
  
  // High priority should be addressed within 24 hours
  if (this.priority === 'high' || this.priority === 'emergency') {
    return this.daysSinceReported > 1
  }
  
  // Medium priority should be addressed within 3 days
  if (this.priority === 'medium') {
    return this.daysSinceReported > 3
  }
  
  // Low priority should be addressed within 7 days
  return this.daysSinceReported > 7
})

// Virtual for cost variance
maintenanceSchema.virtual('costVariance').get(function() {
  if (!this.estimatedCost || !this.actualCost) return null
  return this.actualCost - this.estimatedCost
})

// Pre-save middleware to update status timestamps
maintenanceSchema.pre('save', function(next) {
  if (this.isModified('status')) {
    if (this.status === 'completed' && !this.completedDate) {
      this.completedDate = new Date()
    }
  }
  next()
})

// Static method to get maintenance statistics
maintenanceSchema.statics.getMaintenanceStats = async function(landlordId: string, startDate?: Date, endDate?: Date) {
  const match: any = { landlord: landlordId }
  
  if (startDate && endDate) {
    match.reportedDate = { $gte: startDate, $lte: endDate }
  }
  
  const stats = await this.aggregate([
    { $match: match },
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 },
        totalEstimatedCost: { $sum: '$estimatedCost' },
        totalActualCost: { $sum: '$actualCost' }
      }
    }
  ])
  
  return stats
}

// Static method to get overdue maintenance
maintenanceSchema.statics.getOverdueMaintenance = async function(landlordId: string) {
  const now = new Date()
  const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000)
  const threeDaysAgo = new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000)
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
  
  return this.find({
    landlord: landlordId,
    status: { $nin: ['completed', 'cancelled'] },
    $or: [
      { priority: { $in: ['high', 'emergency'] }, reportedDate: { $lt: oneDayAgo } },
      { priority: 'medium', reportedDate: { $lt: threeDaysAgo } },
      { priority: 'low', reportedDate: { $lt: sevenDaysAgo } }
    ]
  }).populate('property tenant assignedTo')
}

export default mongoose.models.Maintenance || mongoose.model<IMaintenance>('Maintenance', maintenanceSchema)
