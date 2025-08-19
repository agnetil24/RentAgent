import { NextRequest, NextResponse } from 'next/server'
import { constructWebhookEvent } from '@/app/lib/stripe'
import dbConnect from '@/app/lib/db'
import Payment from '@/app/models/Payment'
import User from '@/app/models/User'
import Property from '@/app/models/Property'

export async function POST(request: NextRequest) {
  const body = await request.text()
  const signature = request.headers.get('stripe-signature')

  if (!signature) {
    return NextResponse.json({ error: 'No signature' }, { status: 400 })
  }

  try {
    // Verify webhook signature
    const event = constructWebhookEvent(body, signature)
    
    // Connect to database
    await dbConnect()

    // Handle different event types
    switch (event.type) {
      case 'payment_intent.succeeded':
        await handlePaymentSuccess(event.data.object)
        break
        
      case 'payment_intent.payment_failed':
        await handlePaymentFailure(event.data.object)
        break
        
      case 'customer.subscription.created':
        await handleSubscriptionCreated(event.data.object)
        break
        
      case 'customer.subscription.updated':
        await handleSubscriptionUpdated(event.data.object)
        break
        
      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(event.data.object)
        break
        
      case 'invoice.payment_succeeded':
        await handleInvoicePaymentSucceeded(event.data.object)
        break
        
      case 'invoice.payment_failed':
        await handleInvoicePaymentFailed(event.data.object)
        break
        
      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })

  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json(
      { error: 'Webhook signature verification failed' },
      { status: 400 }
    )
  }
}

// Handle successful payment
async function handlePaymentSuccess(paymentIntent: any) {
  try {
    const { id, amount, metadata, customer } = paymentIntent
    
    // Update payment record
    await Payment.findOneAndUpdate(
      { stripePaymentIntentId: id },
      {
        status: 'completed',
        paidDate: new Date(),
        stripeCustomerId: customer,
        amount: amount / 100, // Convert from cents
      },
      { new: true }
    )

    // Update property occupancy if this is rent payment
    if (metadata.propertyId && metadata.tenantId) {
      await Property.findByIdAndUpdate(
        metadata.propertyId,
        {
          $inc: { 'occupancy.currentTenants': 1 },
          status: 'occupied'
        }
      )
    }

    console.log(`Payment succeeded: ${id}`)
  } catch (error) {
    console.error('Error handling payment success:', error)
  }
}

// Handle failed payment
async function handlePaymentFailure(paymentIntent: any) {
  try {
    const { id, last_payment_error } = paymentIntent
    
    await Payment.findOneAndUpdate(
      { stripePaymentIntentId: id },
      {
        status: 'failed',
        notes: `Payment failed: ${last_payment_error?.message || 'Unknown error'}`
      },
      { new: true }
    )

    console.log(`Payment failed: ${id}`)
  } catch (error) {
    console.error('Error handling payment failure:', error)
  }
}

// Handle subscription creation
async function handleSubscriptionCreated(subscription: any) {
  try {
    const { id, customer, metadata, status } = subscription
    
    // Update user subscription
    if (metadata.userId) {
      await User.findByIdAndUpdate(
        metadata.userId,
        {
          'subscription.stripeSubscriptionId': id,
          'subscription.status': status,
          'subscription.plan': metadata.plan || 'professional'
        },
        { new: true }
      )
    }

    console.log(`Subscription created: ${id}`)
  } catch (error) {
    console.error('Error handling subscription creation:', error)
  }
}

// Handle subscription updates
async function handleSubscriptionUpdated(subscription: any) {
  try {
    const { id, status, metadata } = subscription
    
    if (metadata.userId) {
      await User.findByIdAndUpdate(
        metadata.userId,
        {
          'subscription.status': status
        },
        { new: true }
      )
    }

    console.log(`Subscription updated: ${id}`)
  } catch (error) {
    console.error('Error handling subscription update:', error)
  }
}

// Handle subscription deletion
async function handleSubscriptionDeleted(subscription: any) {
  try {
    const { id, metadata } = subscription
    
    if (metadata.userId) {
      await User.findByIdAndUpdate(
        metadata.userId,
        {
          'subscription.status': 'canceled',
          'subscription.plan': 'free'
        },
        { new: true }
      )
    }

    console.log(`Subscription deleted: ${id}`)
  } catch (error) {
    console.error('Error handling subscription deletion:', error)
  }
}

// Handle successful invoice payment
async function handleInvoicePaymentSucceeded(invoice: any) {
  try {
    const { id, subscription, customer, amount_paid } = invoice
    
    // Create payment record for subscription
    if (subscription && customer) {
      await Payment.create({
        stripeInvoiceId: id,
        stripeSubscriptionId: subscription,
        stripeCustomerId: customer,
        amount: amount_paid / 100,
        type: 'subscription',
        status: 'completed',
        dueDate: new Date(),
        paidDate: new Date(),
        description: 'Subscription payment'
      })
    }

    console.log(`Invoice payment succeeded: ${id}`)
  } catch (error) {
    console.error('Error handling invoice payment success:', error)
  }
}

// Handle failed invoice payment
async function handleInvoicePaymentFailed(invoice: any) {
  try {
    const { id, subscription, customer } = invoice
    
    if (subscription && customer) {
      await Payment.create({
        stripeInvoiceId: id,
        stripeSubscriptionId: subscription,
        stripeCustomerId: customer,
        type: 'subscription',
        status: 'failed',
        dueDate: new Date(),
        description: 'Subscription payment failed'
      })
    }

    console.log(`Invoice payment failed: ${id}`)
  } catch (error) {
    console.error('Error handling invoice payment failure:', error)
  }
}
