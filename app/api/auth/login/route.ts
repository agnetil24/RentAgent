import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/app/lib/db'
import User from '@/app/models/User'
import jwt from 'jsonwebtoken'

export async function POST(request: NextRequest) {
  try {
    await dbConnect()

    const body = await request.json()
    const { email, password } = body

    // Validation
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      )
    }

    // Find user by email
    const user = await User.findOne({ email: email.toLowerCase() })
    if (!user) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      )
    }

    // Check if user is active
    if (!user.isActive) {
      return NextResponse.json(
        { error: 'Account is deactivated' },
        { status: 401 }
      )
    }

    // Verify password
    const isPasswordValid = await user.comparePassword(password)
    if (!isPasswordValid) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      )
    }

    // Update last login
    user.lastLogin = new Date()
    await user.save()

    // Generate JWT token
    const token = jwt.sign(
      { 
        userId: user._id, 
        email: user.email, 
        role: user.role,
        firstName: user.firstName,
        lastName: user.lastName
      },
      process.env.NEXTAUTH_SECRET!,
      { expiresIn: '7d' }
    )

    // Return user data and token
    const userResponse = {
      id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
      companyName: user.companyName,
      isVerified: user.isVerified,
      subscription: user.subscription,
      preferences: user.preferences,
      lastLogin: user.lastLogin,
      createdAt: user.createdAt
    }

    return NextResponse.json({
      message: 'Login successful',
      user: userResponse,
      token
    })

  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
