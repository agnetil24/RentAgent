import { NextRequest, NextResponse } from 'next/server'
import { createSubscription, createCustomer } from '@/app/lib/stripe'
import { connectToDatabase } from '@/app/lib/db'
import { verifyToken } from '@/app/lib/auth'
import User from '@/app/models/User'

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
    const { priceId, plan } = body

    if (!priceId || !plan) {
      return NextResponse.json({ error: 'Price ID and plan are required' }, { status: 400 })
    }

    // Connect to database
    await connectToDatabase()

    // Get user details
    const user = await User.findById(decoded.userId)
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
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

    // Create Stripe subscription
    const subscription = await createSubscription(stripeCustomerId, priceId, {
      userId: user._id.toString(),
      plan,
      email: user.email
    })

    // Update user subscription details
    await User.findByIdAndUpdate(user._id, {
      'subscription.stripeSubscriptionId': subscription.id,
      'subscription.plan': plan,
      'subscription.status': subscription.status,
      'subscription.currentPeriodEnd': new Date(subscription.current_period_end * 1000)
    })

    return NextResponse.json({
      subscriptionId: subscription.id,
      clientSecret: subscription.latest_invoice?.payment_intent?.client_secret,
      status: subscription.status
    })

  } catch (error) {
    console.error('Error creating subscription:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
