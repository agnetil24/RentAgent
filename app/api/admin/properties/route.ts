import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/app/lib/db'
import Property from '@/app/models/Property'
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
    await connectToDatabase()

    // Fetch all properties with pagination and filtering
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '50')
    const status = searchParams.get('status')
    const type = searchParams.get('type')
    const search = searchParams.get('search')

    // Build query
    let query: any = {}
    
    if (status && status !== 'all') {
      query.status = status
    }
    
    if (type && type !== 'all') {
      query.type = type
    }
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { 'address.street': { $regex: search, $options: 'i' } },
        { 'address.city': { $regex: search, $options: 'i' } },
        { 'address.state': { $regex: search, $options: 'i' } }
      ]
    }

    // Execute query with pagination
    const skip = (page - 1) * limit
    
    const [properties, totalProperties] = await Promise.all([
      Property.find(query)
        .populate('owner', 'firstName lastName email')
        .populate('manager', 'firstName lastName email')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Property.countDocuments(query)
    ])

    // Calculate pagination info
    const totalPages = Math.ceil(totalProperties / limit)
    const hasNextPage = page < totalPages
    const hasPrevPage = page > 1

    return NextResponse.json({
      properties,
      pagination: {
        currentPage: page,
        totalPages,
        totalProperties,
        hasNextPage,
        hasPrevPage,
        limit
      }
    })

  } catch (error) {
    console.error('Error fetching properties:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
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

    const body = await request.json()
    const { propertyId, updates } = body

    if (!propertyId || !updates) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Connect to database
    await connectToDatabase()

    // Update property (excluding sensitive fields)
    const allowedUpdates = ['name', 'type', 'address', 'status', 'financial', 'occupancy', 'description']
    const filteredUpdates: any = {}
    
    Object.keys(updates).forEach(key => {
      if (allowedUpdates.includes(key)) {
        filteredUpdates[key] = updates[key]
      }
    })

    const updatedProperty = await Property.findByIdAndUpdate(
      propertyId,
      filteredUpdates,
      { new: true, runValidators: true }
    ).populate('owner', 'firstName lastName email')

    if (!updatedProperty) {
      return NextResponse.json({ error: 'Property not found' }, { status: 404 })
    }

    return NextResponse.json({ property: updatedProperty })

  } catch (error) {
    console.error('Error updating property:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
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

    const { searchParams } = new URL(request.url)
    const propertyId = searchParams.get('propertyId')

    if (!propertyId) {
      return NextResponse.json({ error: 'Property ID required' }, { status: 400 })
    }

    // Connect to database
    await connectToDatabase()

    // Soft delete property (set status to 'deleted' instead of actually deleting)
    const updatedProperty = await Property.findByIdAndUpdate(
      propertyId,
      { status: 'deleted' },
      { new: true }
    )

    if (!updatedProperty) {
      return NextResponse.json({ error: 'Property not found' }, { status: 404 })
    }

    return NextResponse.json({ 
      message: 'Property deleted successfully',
      property: updatedProperty 
    })

  } catch (error) {
    console.error('Error deleting property:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
