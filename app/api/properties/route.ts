import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/app/lib/db'
import Property from '@/app/models/Property'
import { verifyToken } from '@/app/lib/auth'

// GET /api/properties - Get properties for a user
export async function GET(request: NextRequest) {
  try {
    await dbConnect()

    const token = request.headers.get('authorization')?.replace('Bearer ', '')
    if (!token) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const decoded = verifyToken(token)
    if (!decoded) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const role = searchParams.get('role')
    const userId = searchParams.get('userId')

    let query: any = {}

    // Filter properties based on user role
    if (decoded.role === 'landlord') {
      query.owner = decoded.userId
    } else if (decoded.role === 'manager') {
      query.$or = [
        { owner: decoded.userId },
        { manager: decoded.userId }
      ]
    } else if (decoded.role === 'tenant') {
      query.tenants = decoded.userId
    }

    // Additional filters
    if (role) {
      query.role = role
    }
    if (userId) {
      if (decoded.role === 'landlord') {
        query.owner = userId
      } else if (decoded.role === 'manager') {
        query.$or = [
          { owner: userId },
          { manager: userId }
        ]
      }
    }

    const properties = await Property.find(query)
      .populate('owner', 'firstName lastName email')
      .populate('manager', 'firstName lastName email')
      .populate('tenants', 'firstName lastName email')
      .sort({ createdAt: -1 })

    return NextResponse.json({
      properties,
      count: properties.length
    })

  } catch (error) {
    console.error('Get properties error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST /api/properties - Create a new property
export async function POST(request: NextRequest) {
  try {
    await dbConnect()

    const token = request.headers.get('authorization')?.replace('Bearer ', '')
    if (!token) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const decoded = verifyToken(token)
    if (!decoded) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      )
    }

    // Only landlords and managers can create properties
    if (!['landlord', 'manager'].includes(decoded.role)) {
      return NextResponse.json(
        { error: 'Insufficient permissions' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const {
      name,
      type,
      address,
      details,
      financial,
      occupancy
    } = body

    // Validation
    if (!name || !type || !address || !details || !financial || !occupancy) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Create property
    const propertyData = {
      name,
      type,
      address,
      details,
      financial,
      occupancy,
      owner: decoded.userId,
      manager: decoded.role === 'manager' ? decoded.userId : undefined
    }

    const property = new Property(propertyData)
    await property.save()

    const populatedProperty = await Property.findById(property._id)
      .populate('owner', 'firstName lastName email')
      .populate('manager', 'firstName lastName email')
      .populate('tenants', 'firstName lastName email')

    return NextResponse.json({
      message: 'Property created successfully',
      property: populatedProperty
    }, { status: 201 })

  } catch (error) {
    console.error('Create property error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// PUT /api/properties - Update a property
export async function PUT(request: NextRequest) {
  try {
    await dbConnect()

    const token = request.headers.get('authorization')?.replace('Bearer ', '')
    if (!token) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const decoded = verifyToken(token)
    if (!decoded) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { propertyId, updates } = body

    if (!propertyId || !updates) {
      return NextResponse.json(
        { error: 'Property ID and updates are required' },
        { status: 400 }
      )
    }

    // Find property and check permissions
    const property = await Property.findById(propertyId)
    if (!property) {
      return NextResponse.json(
        { error: 'Property not found' },
        { status: 404 }
      )
    }

    // Check if user can modify this property
    if (property.owner.toString() !== decoded.userId && 
        property.manager?.toString() !== decoded.userId) {
      return NextResponse.json(
        { error: 'Insufficient permissions' },
        { status: 403 }
      )
    }

    // Update property
    const updatedProperty = await Property.findByIdAndUpdate(
      propertyId,
      updates,
      { new: true, runValidators: true }
    ).populate('owner', 'firstName lastName email')
     .populate('manager', 'firstName lastName email')
     .populate('tenants', 'firstName lastName email')

    return NextResponse.json({
      message: 'Property updated successfully',
      property: updatedProperty
    })

  } catch (error) {
    console.error('Update property error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// DELETE /api/properties - Delete a property
export async function DELETE(request: NextRequest) {
  try {
    await dbConnect()

    const token = request.headers.get('authorization')?.replace('Bearer ', '')
    if (!token) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const decoded = verifyToken(token)
    if (!decoded) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const propertyId = searchParams.get('id')

    if (!propertyId) {
      return NextResponse.json(
        { error: 'Property ID is required' },
        { status: 400 }
      )
    }

    // Find property and check permissions
    const property = await Property.findById(propertyId)
    if (!property) {
      return NextResponse.json(
        { error: 'Property not found' },
        { status: 404 }
      )
    }

    // Only owners can delete properties
    if (property.owner.toString() !== decoded.userId) {
      return NextResponse.json(
        { error: 'Only property owners can delete properties' },
        { status: 403 }
      )
    }

    // Check if property has active tenants
    if (property.tenants.length > 0) {
      return NextResponse.json(
        { error: 'Cannot delete property with active tenants' },
        { status: 400 }
      )
    }

    await Property.findByIdAndDelete(propertyId)

    return NextResponse.json({
      message: 'Property deleted successfully'
    })

  } catch (error) {
    console.error('Delete property error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
