import { NextRequest, NextResponse } from 'next/server'
import { createPaymentIntent, createCustomer } from '@/app/lib/stripe'
import { connectToDatabase } from '@/app/lib/db'
import { verifyToken } from '@/app/lib/auth'
import Payment from '@/app/models/Payment'
import User from '@/app/models/User'
import Property from '@/app/models/Property'

export async function POST(request: NextRequest) {
  try {
    // Verify authentication
    const token = request.headers.get('authorization')?.replace('Bearer ', '')
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const decoded = verifyToken(token)
    if (!decoded) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    const body = await request.json()
    const { amount, type, propertyId, description, currency = 'usd' } = body

    if (!amount || !type) {
      return NextResponse.json({ error: 'Amount and type are required' }, { status: 400 })
    }

    // Connect to database
    await connectToDatabase()

    // Get user details
    const user = await User.findById(decoded.userId)
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Get property details if provided
    let property = null
    if (propertyId) {
      property = await Property.findById(propertyId)
      if (!property) {
        return NextResponse.json({ error: 'Property not found' }, { status: 404 })
      }
    }

    // Create or get Stripe customer
    let stripeCustomerId = user.stripeCustomerId
    if (!stripeCustomerId) {
      const customer = await createCustomer(user.email, `${user.firstName} ${user.lastName}`, {
        userId: user._id.toString(),
        role: user.role
      })
      stripeCustomerId = customer.id
      
      // Update user with Stripe customer ID
      await User.findByIdAndUpdate(user._id, { stripeCustomerId: customer.id })
    }

    // Create payment record in database
    const payment = await Payment.create({
      tenant: user._id,
      property: propertyId,
      landlord: property?.owner || user._id,
      amount,
      type,
      description: description || `${type} payment`,
      dueDate: new Date(),
      status: 'pending'
    })

    // Create Stripe payment intent
    const paymentIntent = await createPaymentIntent(amount, currency, {
      paymentId: payment._id.toString(),
      userId: user._id.toString(),
      propertyId: propertyId || '',
      tenantId: user._id.toString(),
      type,
      description: description || `${type} payment`
    })

    // Update payment record with Stripe details
    await Payment.findByIdAndUpdate(payment._id, {
      stripePaymentIntentId: paymentIntent.id,
      stripeCustomerId: stripeCustomerId
    })

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
      paymentId: payment._id
    })

  } catch (error) {
    console.error('Error creating payment:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
