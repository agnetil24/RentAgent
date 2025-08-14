import mongoose, { Schema, Document } from 'mongoose'

export interface IProperty extends Document {
  name: string
  type: 'apartment' | 'house' | 'condo' | 'townhouse' | 'commercial' | 'other'
  address: {
    street: string
    city: string
    state: string
    zipCode: string
    country: string
    coordinates?: {
      lat: number
      lng: number
    }
  }
  owner: mongoose.Types.ObjectId // Reference to User (landlord)
  manager?: mongoose.Types.ObjectId // Reference to User (property manager)
  tenants: mongoose.Types.ObjectId[] // Array of User references (tenants)
  details: {
    bedrooms: number
    bathrooms: number
    squareFootage: number
    yearBuilt?: number
    parkingSpaces?: number
    amenities: string[]
    description: string
    images: string[]
  }
  financial: {
    purchasePrice?: number
    currentValue?: number
    monthlyRent: number
    securityDeposit: number
    propertyTax?: number
    insurance?: number
    utilities?: number
    maintenance?: number
    hoaFees?: number
  }
  status: 'available' | 'occupied' | 'maintenance' | 'unavailable'
  occupancy: {
    currentTenants: number
    maxTenants: number
    leaseStartDate?: Date
    leaseEndDate?: Date
    renewalDate?: Date
  }
  maintenance: {
    lastInspection?: Date
    nextInspection?: Date
    outstandingIssues: number
    totalSpent: number
  }
  documents: {
    leaseAgreement?: string
    propertyPhotos?: string[]
    inspectionReports?: string[]
    maintenanceRecords?: string[]
  }
  aiInsights: {
    rentOptimization?: {
      suggestedRent: number
      marketComparison: string
      confidence: number
    }
    maintenancePrediction?: {
      nextMaintenance: Date
      estimatedCost: number
      priority: 'low' | 'medium' | 'high'
    }
    occupancyTrends?: {
      averageOccupancy: number
      vacancyRisk: 'low' | 'medium' | 'high'
      seasonalPatterns: string[]
    }
  }
  createdAt: Date
  updatedAt: Date
}

const propertySchema = new Schema<IProperty>({
  name: {
    type: String,
    required: true,
    trim: true
  },
  type: {
    type: String,
    enum: ['apartment', 'house', 'condo', 'townhouse', 'commercial', 'other'],
    required: true
  },
  address: {
    street: {
      type: String,
      required: true,
      trim: true
    },
    city: {
      type: String,
      required: true,
      trim: true
    },
    state: {
      type: String,
      required: true,
      trim: true
    },
    zipCode: {
      type: String,
      required: true,
      trim: true
    },
    country: {
      type: String,
      required: true,
      default: 'USA'
    },
    coordinates: {
      lat: Number,
      lng: Number
    }
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  manager: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  tenants: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
  details: {
    bedrooms: {
      type: Number,
      required: true,
      min: 0
    },
    bathrooms: {
      type: Number,
      required: true,
      min: 0
    },
    squareFootage: {
      type: Number,
      required: true,
      min: 0
    },
    yearBuilt: Number,
    parkingSpaces: Number,
    amenities: [String],
    description: {
      type: String,
      trim: true
    },
    images: [String]
  },
  financial: {
    purchasePrice: Number,
    currentValue: Number,
    monthlyRent: {
      type: Number,
      required: true,
      min: 0
    },
    securityDeposit: {
      type: Number,
      required: true,
      min: 0
    },
    propertyTax: Number,
    insurance: Number,
    utilities: Number,
    maintenance: Number,
    hoaFees: Number
  },
  status: {
    type: String,
    enum: ['available', 'occupied', 'maintenance', 'unavailable'],
    default: 'available'
  },
  occupancy: {
    currentTenants: {
      type: Number,
      default: 0,
      min: 0
    },
    maxTenants: {
      type: Number,
      required: true,
      min: 1
    },
    leaseStartDate: Date,
    leaseEndDate: Date,
    renewalDate: Date
  },
  maintenance: {
    lastInspection: Date,
    nextInspection: Date,
    outstandingIssues: {
      type: Number,
      default: 0,
      min: 0
    },
    totalSpent: {
      type: Number,
      default: 0,
      min: 0
    }
  },
  documents: {
    leaseAgreement: String,
    propertyPhotos: [String],
    inspectionReports: [String],
    maintenanceRecords: [String]
  },
  aiInsights: {
    rentOptimization: {
      suggestedRent: Number,
      marketComparison: String,
      confidence: Number
    },
    maintenancePrediction: {
      nextMaintenance: Date,
      estimatedCost: Number,
      priority: {
        type: String,
        enum: ['low', 'medium', 'high']
      }
    },
    occupancyTrends: {
      averageOccupancy: Number,
      vacancyRisk: {
        type: String,
        enum: ['low', 'medium', 'high']
      },
      seasonalPatterns: [String]
    }
  }
}, {
  timestamps: true
})

// Indexes for better query performance
propertySchema.index({ owner: 1 })
propertySchema.index({ manager: 1 })
propertySchema.index({ tenants: 1 })
propertySchema.index({ 'address.city': 1, 'address.state': 1 })
propertySchema.index({ status: 1 })
propertySchema.index({ 'financial.monthlyRent': 1 })

// Virtual for occupancy rate
propertySchema.virtual('occupancyRate').get(function() {
  if (this.occupancy.maxTenants === 0) return 0
  return (this.occupancy.currentTenants / this.occupancy.maxTenants) * 100
})

// Virtual for total monthly expenses
propertySchema.virtual('totalMonthlyExpenses').get(function() {
  const expenses = [
    this.financial.propertyTax || 0,
    this.financial.insurance || 0,
    this.financial.utilities || 0,
    this.financial.maintenance || 0,
    this.financial.hoaFees || 0
  ]
  return expenses.reduce((sum, expense) => sum + expense, 0)
})

// Virtual for net monthly income
propertySchema.virtual('netMonthlyIncome').get(function() {
  return this.financial.monthlyRent - this.totalMonthlyExpenses
})

// Ensure virtual fields are serialized
propertySchema.set('toJSON', {
  virtuals: true
})

export default mongoose.models.Property || mongoose.model<IProperty>('Property', propertySchema)
