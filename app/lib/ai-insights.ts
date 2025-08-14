import Property from '@/app/models/Property'
import Payment from '@/app/models/Payment'
import Maintenance from '@/app/models/Maintenance'

export interface RentOptimizationInsight {
  suggestedRent: number
  marketComparison: string
  confidence: number
  factors: string[]
}

export interface MaintenancePrediction {
  nextMaintenance: Date
  estimatedCost: number
  priority: 'low' | 'medium' | 'high'
  reasoning: string
}

export interface OccupancyTrend {
  averageOccupancy: number
  vacancyRisk: 'low' | 'medium' | 'high'
  seasonalPatterns: string[]
  recommendations: string[]
}

export class AIInsightsService {
  // Analyze rent optimization based on market data and property features
  static async analyzeRentOptimization(propertyId: string): Promise<RentOptimizationInsight> {
    try {
      const property = await Property.findById(propertyId)
      if (!property) {
        throw new Error('Property not found')
      }

      // Get similar properties in the same area
      const similarProperties = await Property.find({
        'address.city': property.address.city,
        'address.state': property.address.state,
        type: property.type,
        'details.bedrooms': property.details.bedrooms,
        'details.bathrooms': property.details.bathrooms,
        _id: { $ne: propertyId }
      }).limit(10)

      if (similarProperties.length === 0) {
        // Fallback to basic calculation
        const baseRent = property.financial.monthlyRent
        const suggestedRent = Math.round(baseRent * 1.05) // 5% increase
        return {
          suggestedRent,
          marketComparison: 'Insufficient market data for comparison',
          confidence: 0.3,
          factors: ['Property type', 'Location', 'Size']
        }
      }

      // Calculate average rent for similar properties
      const avgRent = similarProperties.reduce((sum, prop) => sum + prop.financial.monthlyRent, 0) / similarProperties.length
      
      // Adjust based on property features
      let adjustment = 0
      const factors: string[] = []

      // Square footage adjustment
      if (property.details.squareFootage > avgRent * 0.8) {
        adjustment += 0.1
        factors.push('Above average square footage')
      }

      // Amenities adjustment
      if (property.details.amenities.length > 3) {
        adjustment += 0.05
        factors.push('Rich amenities')
      }

      // Year built adjustment (newer properties)
      if (property.details.yearBuilt && property.details.yearBuilt > 2000) {
        adjustment += 0.08
        factors.push('Modern construction')
      }

      const suggestedRent = Math.round(avgRent * (1 + adjustment))
      const confidence = Math.min(0.9, 0.5 + (similarProperties.length * 0.04))

      return {
        suggestedRent,
        marketComparison: `Based on ${similarProperties.length} similar properties in ${property.address.city}`,
        confidence,
        factors
      }

    } catch (error) {
      console.error('Rent optimization analysis failed:', error)
      throw error
    }
  }

  // Predict next maintenance needs
  static async predictMaintenance(propertyId: string): Promise<MaintenancePrediction> {
    try {
      const property = await Property.findById(propertyId)
      if (!property) {
        throw new Error('Property not found')
      }

      // Get maintenance history
      const maintenanceHistory = await Maintenance.find({
        property: propertyId,
        status: 'completed'
      }).sort({ completedDate: -1 }).limit(20)

      // Get current outstanding issues
      const outstandingIssues = await Maintenance.find({
        property: propertyId,
        status: { $in: ['pending', 'assigned', 'in_progress'] }
      })

      let nextMaintenance = new Date()
      let estimatedCost = 0
      let priority: 'low' | 'medium' | 'high' = 'low'
      let reasoning = ''

      // Analyze maintenance patterns
      if (maintenanceHistory.length > 0) {
        const avgDaysBetweenMaintenance = 90 // Default 3 months
        const lastMaintenance = maintenanceHistory[0].completedDate
        if (lastMaintenance) {
          nextMaintenance = new Date(lastMaintenance.getTime() + avgDaysBetweenMaintenance * 24 * 60 * 60 * 1000)
        }
      }

      // Calculate estimated cost based on property type and size
      const baseCost = property.details.squareFootage * 0.5
      estimatedCost = Math.round(baseCost)

      // Determine priority based on outstanding issues and property age
      if (outstandingIssues.length > 3) {
        priority = 'high'
        reasoning = 'Multiple outstanding maintenance issues'
      } else if (property.details.yearBuilt && property.details.yearBuilt < 1980) {
        priority = 'medium'
        reasoning = 'Older property requiring regular maintenance'
      } else {
        priority = 'low'
        reasoning = 'Property in good condition'
      }

      return {
        nextMaintenance,
        estimatedCost,
        priority,
        reasoning
      }

    } catch (error) {
      console.error('Maintenance prediction failed:', error)
      throw error
    }
  }

  // Analyze occupancy trends
  static async analyzeOccupancyTrends(propertyId: string): Promise<OccupancyTrend> {
    try {
      const property = await Property.findById(propertyId)
      if (!property) {
        throw new Error('Property not found')
      }

      // Get payment history for occupancy analysis
      const payments = await Payment.find({
        property: propertyId,
        type: 'rent',
        status: 'completed'
      }).sort({ paidDate: -1 }).limit(24) // Last 2 years

      let averageOccupancy = property.occupancy.currentTenants / property.occupancy.maxTenants * 100
      let vacancyRisk: 'low' | 'medium' | 'high' = 'low'
      const seasonalPatterns: string[] = []
      const recommendations: string[] = []

      // Analyze seasonal patterns
      if (payments.length > 12) {
        const monthlyOccupancy = new Array(12).fill(0)
        const monthlyCount = new Array(12).fill(0)

        payments.forEach(payment => {
          if (payment.paidDate) {
            const month = payment.paidDate.getMonth()
            monthlyOccupancy[month] += 1
            monthlyCount[month] += 1
          }
        })

        // Find seasonal patterns
        const avgMonthlyOccupancy = monthlyOccupancy.reduce((sum, count) => sum + count, 0) / 12
        for (let i = 0; i < 12; i++) {
          if (monthlyCount[i] > 0) {
            const occupancy = monthlyOccupancy[i] / monthlyCount[i]
            if (occupancy < avgMonthlyOccupancy * 0.8) {
              const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 
                                'July', 'August', 'September', 'October', 'November', 'December']
              seasonalPatterns.push(`Lower occupancy in ${monthNames[i]}`)
            }
          }
        }
      }

      // Determine vacancy risk
      if (averageOccupancy < 70) {
        vacancyRisk = 'high'
        recommendations.push('Consider reducing rent or improving property amenities')
        recommendations.push('Implement aggressive marketing strategies')
      } else if (averageOccupancy < 85) {
        vacancyRisk = 'medium'
        recommendations.push('Monitor market conditions for rent adjustments')
        recommendations.push('Consider property improvements to increase appeal')
      } else {
        vacancyRisk = 'low'
        recommendations.push('Maintain current rent levels and property condition')
        recommendations.push('Focus on tenant retention strategies')
      }

      // Add market-based recommendations
      if (property.financial.monthlyRent > 0) {
        const marketData = await this.getMarketData(property.address.city, property.address.state)
        if (marketData) {
          if (property.financial.monthlyRent > marketData.averageRent * 1.2) {
            recommendations.push('Rent is significantly above market average - consider adjustment')
          } else if (property.financial.monthlyRent < marketData.averageRent * 0.8) {
            recommendations.push('Rent is below market average - potential for increase')
          }
        }
      }

      return {
        averageOccupancy,
        vacancyRisk,
        seasonalPatterns,
        recommendations
      }

    } catch (error) {
      console.error('Occupancy trend analysis failed:', error)
      throw error
    }
  }

  // Get market data for a specific location
  private static async getMarketData(city: string, state: string) {
    try {
      // This would typically integrate with external real estate APIs
      // For now, return mock data
      const mockMarketData = {
        averageRent: 2500,
        marketTrend: 'increasing',
        daysOnMarket: 15,
        pricePerSqFt: 2.5
      }

      return mockMarketData
    } catch (error) {
      console.error('Market data retrieval failed:', error)
      return null
    }
  }

  // Generate comprehensive property insights
  static async generatePropertyInsights(propertyId: string) {
    try {
      const [rentOptimization, maintenancePrediction, occupancyTrends] = await Promise.all([
        this.analyzeRentOptimization(propertyId),
        this.predictMaintenance(propertyId),
        this.analyzeOccupancyTrends(propertyId)
      ])

      return {
        rentOptimization,
        maintenancePrediction,
        occupancyTrends,
        generatedAt: new Date(),
        summary: this.generateSummary(rentOptimization, maintenancePrediction, occupancyTrends)
      }
    } catch (error) {
      console.error('Property insights generation failed:', error)
      throw error
    }
  }

  // Generate summary of insights
  private static generateSummary(
    rentOptimization: RentOptimizationInsight,
    maintenancePrediction: MaintenancePrediction,
    occupancyTrends: OccupancyTrend
  ) {
    const summary = []

    // Rent summary
    if (rentOptimization.confidence > 0.7) {
      summary.push(`Rent optimization: Consider adjusting to $${rentOptimization.suggestedRent}/month`)
    }

    // Maintenance summary
    if (maintenancePrediction.priority === 'high') {
      summary.push('High priority maintenance required - schedule inspection soon')
    }

    // Occupancy summary
    if (occupancyTrends.vacancyRisk === 'high') {
      summary.push('High vacancy risk - implement retention strategies')
    }

    return summary
  }
}
