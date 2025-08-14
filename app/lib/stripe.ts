import Stripe from 'stripe'

// Initialize Stripe with your secret key
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-12-18.acacia',
  typescript: true,
})

// Get publishable key for client-side
export const getStripePublishableKey = () => {
  return process.env.STRIPE_PUBLISHABLE_KEY!
}

// Create a payment intent for rent collection
export const createPaymentIntent = async (amount: number, currency: string = 'usd', metadata: any = {}) => {
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency,
      metadata,
      automatic_payment_methods: {
        enabled: true,
      },
    })
    
    return paymentIntent
  } catch (error) {
    console.error('Error creating payment intent:', error)
    throw error
  }
}

// Create a customer in Stripe
export const createCustomer = async (email: string, name: string, metadata: any = {}) => {
  try {
    const customer = await stripe.customers.create({
      email,
      name,
      metadata,
    })
    
    return customer
  } catch (error) {
    console.error('Error creating customer:', error)
    throw error
  }
}

// Create a subscription for premium plans
export const createSubscription = async (customerId: string, priceId: string, metadata: any = {}) => {
  try {
    const subscription = await stripe.subscriptions.create({
      customer: customerId,
      items: [{ price: priceId }],
      metadata,
      payment_behavior: 'default_incomplete',
      payment_settings: { save_default_payment_method: 'on_subscription' },
      expand: ['latest_invoice.payment_intent'],
    })
    
    return subscription
  } catch (error) {
    console.error('Error creating subscription:', error)
    throw error
  }
}

// Handle webhook events
export const constructWebhookEvent = (payload: string | Buffer, signature: string) => {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!
  
  try {
    return stripe.webhooks.constructEvent(payload, signature, webhookSecret)
  } catch (error) {
    console.error('Webhook signature verification failed:', error)
    throw error
  }
}

// Get payment methods for a customer
export const getCustomerPaymentMethods = async (customerId: string) => {
  try {
    const paymentMethods = await stripe.paymentMethods.list({
      customer: customerId,
      type: 'card',
    })
    
    return paymentMethods
  } catch (error) {
    console.error('Error getting payment methods:', error)
    throw error
  }
}

// Create a refund
export const createRefund = async (paymentIntentId: string, amount?: number, reason?: string) => {
  try {
    const refund = await stripe.refunds.create({
      payment_intent: paymentIntentId,
      amount: amount ? Math.round(amount * 100) : undefined,
      reason: reason as any,
    })
    
    return refund
  } catch (error) {
    console.error('Error creating refund:', error)
    throw error
  }
}

// Get payment intent details
export const getPaymentIntent = async (paymentIntentId: string) => {
  try {
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId)
    return paymentIntent
  } catch (error) {
    console.error('Error retrieving payment intent:', error)
    throw error
  }
}

// Update payment intent metadata
export const updatePaymentIntent = async (paymentIntentId: string, metadata: any) => {
  try {
    const paymentIntent = await stripe.paymentIntents.update(paymentIntentId, {
      metadata,
    })
    
    return paymentIntent
  } catch (error) {
    console.error('Error updating payment intent:', error)
    throw error
  }
}
