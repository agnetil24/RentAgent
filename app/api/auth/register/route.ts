import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/app/lib/db'
import User from '@/app/models/User'
import jwt from 'jsonwebtoken'

export async function POST(request: NextRequest) {
  try {
    await dbConnect()

    const body = await request.json()
    const { firstName, lastName, email, password, role, companyName } = body

    // Validation
    if (!firstName || !lastName || !email || !password || !role) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters long' },
        { status: 400 }
      )
    }

    if (!['landlord', 'tenant', 'manager'].includes(role)) {
      return NextResponse.json(
        { error: 'Invalid role specified' },
        { status: 400 }
      )
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() })
    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 409 }
      )
    }

    // Create user
    const userData: any = {
      firstName,
      lastName,
      email: email.toLowerCase(),
      password,
      role
    }

    // Add company name for landlords and managers
    if ((role === 'landlord' || role === 'manager') && companyName) {
      userData.companyName = companyName
    }

    const user = new User(userData)
    await user.save()

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, email: user.email, role: user.role },
      process.env.NEXTAUTH_SECRET!,
      { expiresIn: '7d' }
    )

    // Return user data (without password) and token
    const userResponse = {
      id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
      companyName: user.companyName,
      isVerified: user.isVerified,
      subscription: user.subscription,
      createdAt: user.createdAt
    }

    return NextResponse.json({
      message: 'User registered successfully',
      user: userResponse,
      token
    }, { status: 201 })

  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
