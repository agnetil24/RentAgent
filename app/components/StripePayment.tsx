'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { CreditCard, Lock, CheckCircle, AlertCircle } from 'lucide-react'
import toast from 'react-hot-toast'

interface StripePaymentProps {
  amount: number
  propertyName: string
  tenantName: string
  onSuccess?: () => void
  onCancel?: () => void
}

export default function StripePayment({ 
  amount, 
  propertyName, 
  tenantName, 
  onSuccess, 
  onCancel 
}: StripePaymentProps) {
  const [isProcessing, setIsProcessing] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState('card')
  const [cardDetails, setCardDetails] = useState({
    number: '',
    expiry: '',
    cvc: '',
    name: ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsProcessing(true)

    try {
      // Simulate Stripe payment processing
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // In a real implementation, this would call Stripe's API
      // const { error } = await stripe.confirmPayment({
      //   elements,
      //   confirmParams: {
      //     return_url: `${window.location.origin}/payment-success`,
      //   },
      // })

      toast.success('Payment successful! Rent has been collected.')
      onSuccess?.()
    } catch (error) {
      toast.error('Payment failed. Please try again.')
    } finally {
      setIsProcessing(false)
    }
  }

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '')
    const matches = v.match(/\d{4,16}/g)
    const match = matches && matches[0] || ''
    const parts = []
    
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4))
    }
    
    if (parts.length) {
      return parts.join(' ')
    } else {
      return v
    }
  }

  const formatExpiry = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '')
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4)
    }
    return v
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-md mx-auto"
    >
      <div className="card">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-4">
            <CreditCard className="w-8 h-8 text-primary-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Pay Rent</h2>
          <p className="text-gray-600">Secure payment powered by Stripe</p>
        </div>

        {/* Payment Summary */}
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-gray-600">Property:</span>
            <span className="font-medium text-gray-900">{propertyName}</span>
          </div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-gray-600">Tenant:</span>
            <span className="font-medium text-gray-900">{tenantName}</span>
          </div>
          <div className="flex justify-between items-center border-t pt-2">
            <span className="text-lg font-medium text-gray-900">Total Amount:</span>
            <span className="text-2xl font-bold text-primary-600">${amount.toLocaleString()}</span>
          </div>
        </div>

        {/* Payment Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Payment Method Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Payment Method
            </label>
            <div className="grid grid-cols-2 gap-3">
              {[
                { id: 'card', label: 'Credit Card', icon: <CreditCard className="w-4 h-4" /> },
                { id: 'bank', label: 'Bank Transfer', icon: <CreditCard className="w-4 h-4" /> }
              ].map((method) => (
                <button
                  key={method.id}
                  type="button"
                  onClick={() => setPaymentMethod(method.id)}
                  className={`p-3 border-2 rounded-lg flex items-center justify-center space-x-2 transition-colors ${
                    paymentMethod === method.id
                      ? 'border-primary-500 bg-primary-50 text-primary-600'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  {method.icon}
                  <span className="text-sm font-medium">{method.label}</span>
                </button>
              ))}
            </div>
          </div>

          {paymentMethod === 'card' && (
            <>
              {/* Card Number */}
              <div>
                <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700 mb-2">
                  Card Number
                </label>
                <div className="relative">
                  <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    id="cardNumber"
                    type="text"
                    value={cardDetails.number}
                    onChange={(e) => setCardDetails(prev => ({ ...prev, number: formatCardNumber(e.target.value) }))}
                    className="input-field pl-10"
                    placeholder="1234 5678 9012 3456"
                    maxLength={19}
                    required
                  />
                </div>
              </div>

              {/* Card Details Row */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="expiry" className="block text-sm font-medium text-gray-700 mb-2">
                    Expiry Date
                  </label>
                  <input
                    id="expiry"
                    type="text"
                    value={cardDetails.expiry}
                    onChange={(e) => setCardDetails(prev => ({ ...prev, expiry: formatExpiry(e.target.value) }))}
                    className="input-field"
                    placeholder="MM/YY"
                    maxLength={5}
                    required
                  />
                </div>
                <div>
                  <label htmlFor="cvc" className="block text-sm font-medium text-gray-700 mb-2">
                    CVC
                  </label>
                  <input
                    id="cvc"
                    type="text"
                    value={cardDetails.cvc}
                    onChange={(e) => setCardDetails(prev => ({ ...prev, cvc: e.target.value.replace(/\D/g, '').slice(0, 4) }))}
                    className="input-field"
                    placeholder="123"
                    maxLength={4}
                    required
                  />
                </div>
              </div>

              {/* Cardholder Name */}
              <div>
                <label htmlFor="cardName" className="block text-sm font-medium text-gray-700 mb-2">
                  Cardholder Name
                </label>
                <input
                  id="cardName"
                  type="text"
                  value={cardDetails.name}
                  onChange={(e) => setCardDetails(prev => ({ ...prev, name: e.target.value }))}
                  className="input-field"
                  placeholder="John Doe"
                  required
                />
              </div>
            </>
          )}

          {/* Security Notice */}
          <div className="flex items-center space-x-2 text-sm text-gray-600 bg-blue-50 p-3 rounded-lg">
            <Lock className="w-4 h-4 text-blue-600" />
            <span>Your payment information is encrypted and secure</span>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onCancel}
              className="btn-secondary flex-1"
              disabled={isProcessing}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isProcessing}
              className="btn-primary flex-1 flex items-center justify-center"
            >
              {isProcessing ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Processing...
                </>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Pay ${amount.toLocaleString()}
                </>
              )}
            </button>
          </div>
        </form>

        {/* Stripe Badge */}
        <div className="text-center mt-6 pt-6 border-t border-gray-200">
          <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
            <span>Secured by</span>
            <div className="flex items-center space-x-1">
              <div className="w-8 h-4 bg-gray-200 rounded"></div>
              <span className="font-medium">Stripe</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
