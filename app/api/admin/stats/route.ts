import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/app/lib/db'
import User from '@/app/models/User'
import Property from '@/app/models/Property'
import Payment from '@/app/models/Payment'
import { verifyToken } from '@/app/lib/auth'

export async function GET(request: NextRequest) {
  try {
    // Verify admin authentication
    const token = request.headers.get('authorization')?.replace('Bearer ', '')
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const decoded = verifyToken(token)
    if (!decoded) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    // Connect to database
    await dbConnect()

    // Get current date and calculate date ranges
    const now = new Date()
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    const startOfYear = new Date(now.getFullYear(), 0, 1)
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0)

    // Fetch all statistics in parallel for better performance
    const [
      totalUsers,
      totalProperties,
      activeUsers,
      newUsersThisMonth,
      newUsersLastMonth,
      propertiesByStatus,
      totalRevenue,
      monthlyRevenue,
      lastMonthRevenue,
      subscriptionStats,
      userRoleStats,
      propertyTypeStats
    ] = await Promise.all([
      // User statistics
      User.countDocuments(),
      Property.countDocuments(),
      User.countDocuments({ isActive: true }),
      User.countDocuments({ createdAt: { $gte: startOfMonth } }),
      User.countDocuments({ createdAt: { $gte: lastMonth, $lt: startOfMonth } }),
      
      // Property statistics
      Property.aggregate([
        {
          $group: {
            _id: '$status',
            count: { $sum: 1 }
          }
        }
      ]),
      
      // Revenue statistics
      Payment.aggregate([
        { $match: { status: 'completed' } },
        { $group: { _id: null, total: { $sum: '$amount' } } }
      ]),
      
      Payment.aggregate([
        { 
          $match: { 
            status: 'completed',
            paidDate: { $gte: startOfMonth }
          }
        },
        { $group: { _id: null, total: { $sum: '$amount' } } }
      ]),
      
      Payment.aggregate([
        { 
          $match: { 
            status: 'completed',
            paidDate: { $gte: lastMonth, $lt: startOfMonth }
          }
        },
        { $group: { _id: null, total: { $sum: '$amount' } } }
      ]),
      
      // Subscription statistics
      User.aggregate([
        {
          $group: {
            _id: '$subscription.plan',
            count: { $sum: 1 },
            active: {
              $sum: {
                $cond: [
                  { $eq: ['$subscription.status', 'active'] },
                  1,
                  0
                ]
              }
            }
          }
        }
      ]),
      
      // User role statistics
      User.aggregate([
        {
          $group: {
            _id: '$role',
            count: { $sum: 1 }
          }
        }
      ]),
      
      // Property type statistics
      Property.aggregate([
        {
          $group: {
            _id: '$type',
            count: { $sum: 1 }
          }
        }
      ])
    ])

    // Process the results
    const totalRevenueAmount = totalRevenue[0]?.total || 0
    const monthlyRevenueAmount = monthlyRevenue[0]?.total || 0
    const lastMonthRevenueAmount = lastMonthRevenue[0]?.total || 0
    
    // Calculate growth percentages
    const userGrowth = lastMonthRevenueAmount > 0 
      ? ((newUsersThisMonth - newUsersLastMonth) / newUsersLastMonth * 100).toFixed(1)
      : newUsersThisMonth > 0 ? '100' : '0'
    
    const revenueGrowth = lastMonthRevenueAmount > 0
      ? ((monthlyRevenueAmount - lastMonthRevenueAmount) / lastMonthRevenueAmount * 100).toFixed(1)
      : monthlyRevenueAmount > 0 ? '100' : '0'

    // Convert property status array to object
    const propertyStatusMap = propertiesByStatus.reduce((acc: any, item: any) => {
      acc[item._id] = item.count
      return acc
    }, {})

    // Convert subscription stats to object
    const subscriptionMap = subscriptionStats.reduce((acc: any, item: any) => {
      acc[item._id] = { count: item.count, active: item.active }
      return acc
    }, {})

    // Convert user role stats to object
    const userRoleMap = userRoleStats.reduce((acc: any, item: any) => {
      acc[item._id] = item.count
      return acc
    }, {})

    // Convert property type stats to object
    const propertyTypeMap = propertyTypeStats.reduce((acc: any, item: any) => {
      acc[item._id] = item.count
      return acc
    }, {})

    return NextResponse.json({
      overview: {
        totalUsers,
        totalProperties,
        activeUsers,
        totalRevenue: totalRevenueAmount,
        monthlyRevenue: monthlyRevenueAmount
      },
      growth: {
        newUsersThisMonth,
        newUsersLastMonth,
        userGrowth: `${userGrowth}%`,
        revenueGrowth: `${revenueGrowth}%`
      },
      properties: {
        byStatus: propertyStatusMap,
        byType: propertyTypeMap,
        available: propertyStatusMap.available || 0,
        occupied: propertyStatusMap.occupied || 0,
        maintenance: propertyStatusMap.maintenance || 0
      },
      users: {
        byRole: userRoleMap,
        landlords: userRoleMap.landlord || 0,
        tenants: userRoleMap.tenant || 0,
        managers: userRoleMap.manager || 0
      },
      subscriptions: {
        byPlan: subscriptionMap,
        active: Object.values(subscriptionMap).reduce((sum: any, plan: any) => sum + plan.active, 0),
        total: Object.values(subscriptionMap).reduce((sum: any, plan: any) => sum + plan.count, 0)
      },
      revenue: {
        total: totalRevenueAmount,
        monthly: monthlyRevenueAmount,
        lastMonth: lastMonthRevenueAmount,
        averageMonthly: monthlyRevenueAmount > 0 ? monthlyRevenueAmount : 0
      }
    })

  } catch (error) {
    console.error('Error fetching admin statistics:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
