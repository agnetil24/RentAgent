'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Check, 
  Home, 
  Building2, 
  Users, 
  CreditCard, 
  BarChart3, 
  Shield, 
  Zap,
  Star,
  ArrowRight
} from 'lucide-react'
import Link from 'next/link'

export default function PricingPage() {
  const [billingCycle, setBillingCycle] = useState('monthly')
  const [userType, setUserType] = useState('landlord')

  const plans = {
    landlord: [
      {
        name: 'Starter',
        price: billingCycle === 'monthly' ? 29 : 290,
        description: 'Perfect for individual landlords with 1-5 properties',
        features: [
          'Up to 5 properties',
          'Basic rent collection',
          'Tenant screening',
          'Payment tracking',
          'Email support',
          'Mobile app access'
        ],
        popular: false,
        cta: 'Start Free Trial'
      },
      {
        name: 'Professional',
        price: billingCycle === 'monthly' ? 79 : 790,
        description: 'Ideal for growing landlords with 6-20 properties',
        features: [
          'Up to 20 properties',
          'Advanced rent collection',
          'AI-powered insights',
          'Automated late fees',
          'Maintenance requests',
          'Priority support',
          'Custom reporting',
          'Stripe integration'
        ],
        popular: true,
        cta: 'Start Free Trial'
      },
      {
        name: 'Enterprise',
        price: billingCycle === 'monthly' ? 199 : 1990,
        description: 'For large portfolios and property management companies',
        features: [
          'Unlimited properties',
          'Full AI suite',
          'Advanced analytics',
          'White-label options',
          'API access',
          'Dedicated account manager',
          'Custom integrations',
          '24/7 phone support'
        ],
        popular: false,
        cta: 'Contact Sales'
      }
    ],
    tenant: [
      {
        name: 'Free',
        price: 0,
        description: 'Basic tenant features for rent payments',
        features: [
          'Rent payment history',
          'Payment reminders',
          'Basic support',
          'Mobile app access'
        ],
        popular: false,
        cta: 'Get Started'
      },
      {
        name: 'Premium',
        price: billingCycle === 'monthly' ? 9 : 90,
        description: 'Enhanced features for better tenant experience',
        features: [
          'All Free features',
          'Priority support',
          'Advanced reporting',
          'Payment scheduling',
          'Maintenance requests',
          'Document storage'
        ],
        popular: true,
        cta: 'Upgrade Now'
      }
    ],
    manager: [
      {
        name: 'Professional',
        price: billingCycle === 'monthly' ? 99 : 990,
        description: 'Complete property management solution',
        features: [
          'Up to 50 properties',
          'Full tenant management',
          'AI-powered insights',
          'Maintenance coordination',
          'Financial reporting',
          'Priority support',
          'Custom workflows',
          'Team collaboration'
        ],
        popular: false,
        cta: 'Start Free Trial'
      },
      {
        name: 'Enterprise',
        price: billingCycle === 'monthly' ? 299 : 2990,
        description: 'Scalable solution for large management companies',
        features: [
          'Unlimited properties',
          'Advanced AI suite',
          'Custom integrations',
          'White-label options',
          'API access',
          'Dedicated support team',
          'Custom training',
          'SLA guarantees'
        ],
        popular: true,
        cta: 'Contact Sales'
      }
    ]
  }

  const currentPlans = plans[userType as keyof typeof plans]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <Home className="w-8 h-8 text-primary-600" />
              <span className="text-2xl font-bold text-gradient">RentAgent</span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <Link href="/" className="text-gray-600 hover:text-primary-600 transition-colors">Home</Link>
              <Link href="/#features" className="text-gray-600 hover:text-primary-600 transition-colors">Features</Link>
              <Link href="/pricing" className="text-primary-600 font-medium">Pricing</Link>
              <Link href="/#about" className="text-gray-600 hover:text-primary-600 transition-colors">About</Link>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/auth/login" className="btn-secondary">
                Sign In
              </Link>
              <Link href="/auth/register" className="btn-primary">
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-4xl md:text-5xl font-bold text-gray-900 mb-6"
          >
            Simple, Transparent
            <span className="text-gradient block">Pricing</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl text-gray-600 mb-8"
          >
            Choose the perfect plan for your needs. Start free, scale as you grow.
          </motion.p>

          {/* User Type Selection */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex justify-center mb-8"
          >
            <div className="bg-white rounded-lg p-1 shadow-sm border">
              {[
                { id: 'landlord', label: 'Landlord', icon: <Building2 className="w-5 h-5" /> },
                { id: 'tenant', label: 'Tenant', icon: <Home className="w-5 h-5" /> },
                { id: 'manager', label: 'Property Manager', icon: <Users className="w-5 h-5" /> }
              ].map((type) => (
                <button
                  key={type.id}
                  onClick={() => setUserType(type.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-all duration-200 ${
                    userType === type.id
                      ? 'bg-primary-500 text-white shadow-md'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {type.icon}
                  <span>{type.label}</span>
                </button>
              ))}
            </div>
          </motion.div>

          {/* Billing Toggle */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex items-center justify-center space-x-4 mb-12"
          >
            <span className={`text-sm ${billingCycle === 'monthly' ? 'text-gray-900' : 'text-gray-500'}`}>
              Monthly
            </span>
            <button
              onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly')}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                billingCycle === 'yearly' ? 'bg-primary-500' : 'bg-gray-200'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  billingCycle === 'yearly' ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
            <span className={`text-sm ${billingCycle === 'yearly' ? 'text-gray-900' : 'text-gray-500'}`}>
              Yearly
              <span className="ml-1 text-primary-600 font-medium">Save 20%</span>
            </span>
          </motion.div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {currentPlans.map((plan, index) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`relative card hover:shadow-soft transition-all duration-300 ${
                  plan.popular ? 'ring-2 ring-primary-500 scale-105' : ''
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-primary-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                      Most Popular
                    </span>
                  </div>
                )}

                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                  <p className="text-gray-600 mb-6">{plan.description}</p>
                  
                  <div className="mb-6">
                    <span className="text-4xl font-bold text-gray-900">
                      ${plan.price}
                    </span>
                    {plan.price > 0 && (
                      <span className="text-gray-500 ml-1">
                        /{billingCycle === 'monthly' ? 'mo' : 'year'}
                      </span>
                    )}
                  </div>

                  <Link
                    href={plan.cta === 'Contact Sales' ? '/contact' : '/auth/register'}
                    className={`w-full py-3 px-6 rounded-lg font-medium transition-colors ${
                      plan.popular
                        ? 'btn-primary'
                        : 'btn-secondary'
                    }`}
                  >
                    {plan.cta}
                    <ArrowRight className="w-4 h-4 ml-2 inline" />
                  </Link>
                </div>

                <div className="space-y-4">
                  <h4 className="font-semibold text-gray-900 mb-4">What's included:</h4>
                  {plan.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-start space-x-3">
                      <Check className="w-5 h-5 text-success-600 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-gray-600">
              Everything you need to know about our pricing
            </p>
          </div>

          <div className="space-y-8">
            {[
              {
                question: 'Can I change my plan at any time?',
                answer: 'Yes! You can upgrade or downgrade your plan at any time. Changes take effect immediately and are prorated.'
              },
              {
                question: 'Is there a free trial?',
                answer: 'Yes, we offer a 14-day free trial on all paid plans. No credit card required to start.'
              },
              {
                question: 'What payment methods do you accept?',
                answer: 'We accept all major credit cards, debit cards, and bank transfers. All payments are processed securely through Stripe.'
              },
              {
                question: 'Can I cancel my subscription?',
                answer: 'Absolutely. You can cancel your subscription at any time with no cancellation fees. Your access continues until the end of your billing period.'
              },
              {
                question: 'Do you offer discounts for nonprofits?',
                answer: 'Yes, we offer special pricing for nonprofit organizations and educational institutions. Contact our sales team for details.'
              }
            ].map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="border-b border-gray-200 pb-6"
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{faq.question}</h3>
                <p className="text-gray-600">{faq.answer}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary-600 to-secondary-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-primary-100 mb-8">
            Join thousands of property professionals who trust RentAgent
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/register" className="bg-white text-primary-600 hover:bg-gray-100 font-semibold py-3 px-8 rounded-lg transition-colors duration-200">
              Start Free Trial
            </Link>
            <Link href="/contact" className="border-2 border-white text-white hover:bg-white hover:text-primary-600 font-semibold py-3 px-8 rounded-lg transition-colors duration-200">
              Contact Sales
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Home className="w-8 h-8 text-primary-400" />
                <span className="text-2xl font-bold">RentAgent</span>
              </div>
              <p className="text-gray-400">
                AI-powered rent collection platform for modern property management.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="/#features" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="/pricing" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition-colors">API</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="/#about" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="/contact" className="hover:text-white transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Status</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 RentAgent. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
