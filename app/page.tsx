'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Home, 
  CreditCard, 
  Users, 
  BarChart3, 
  Shield, 
  Zap,
  ArrowRight,
  CheckCircle,
  Star,
  Building2,
  Calculator,
  TrendingUp
} from 'lucide-react'
import Link from 'next/link'
import VideoHero from './components/VideoHero'

export default function HomePage() {
  const [activeTab, setActiveTab] = useState('landlord')

  const features = [
    {
      icon: <CreditCard className="w-8 h-8 text-primary-600" />,
      title: 'Automated Rent Collection',
      description: 'Set up recurring payments and never worry about late rent again.'
    },
    {
      icon: <BarChart3 className="w-8 h-8 text-primary-600" />,
      title: 'AI-Powered Analytics',
      description: 'Get insights into payment patterns and property performance.'
    },
    {
      icon: <Shield className="w-8 h-8 text-primary-600" />,
      title: 'Secure Payments',
      description: 'Bank-level security with Stripe integration for peace of mind.'
    },
    {
      icon: <Users className="w-8 h-8 text-primary-600" />,
      title: 'Tenant Management',
      description: 'Manage multiple properties and tenants from one dashboard.'
    },
    {
      icon: <Zap className="w-8 h-8 text-primary-600" />,
      title: 'Instant Notifications',
      description: 'Real-time updates on payments, maintenance, and more.'
    },
    {
      icon: <Building2 className="w-8 h-8 text-primary-600" />,
      title: 'Property Portfolio',
      description: 'Track all your properties and their financial performance.'
    }
  ]

  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'Property Manager',
      company: 'Urban Properties',
      content: 'RentAgent has transformed how we manage our 50+ properties. The AI insights are game-changing!',
      rating: 5
    },
    {
      name: 'Michael Chen',
      role: 'Landlord',
      company: 'Chen Real Estate',
      content: 'Finally, a platform that makes rent collection effortless. My tenants love the convenience.',
      rating: 5
    },
    {
      name: 'Emily Rodriguez',
      role: 'Tenant',
      company: 'Downtown Apartments',
      content: 'Paying rent has never been easier. The app is intuitive and saves me time every month.',
      rating: 5
    }
  ]

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
              <a href="#features" className="text-gray-600 hover:text-primary-600 transition-colors">Features</a>
                             <Link href="/pricing" className="text-gray-600 hover:text-primary-600 transition-colors">Pricing</Link>
              <a href="#about" className="text-gray-600 hover:text-primary-600 transition-colors">About</a>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/auth/login" className="btn-secondary">
                Sign In
              </Link>
              <Link href="/auth/register" className="btn-primary">
                Get Started
              </Link>
              <Link href="/admin" className="btn-secondary">
                Admin Panel
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
          <div className="text-center">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-5xl md:text-6xl font-bold text-gray-900 mb-6"
            >
              AI-Powered
              <span className="text-gradient block">Rent Collection</span>
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto"
            >
              Streamline your property management with intelligent rent collection, 
              AI-powered insights, and seamless payment processing. 
              Perfect for landlords, tenants, and property managers.
            </motion.p>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Link href="/auth/register" className="btn-primary text-lg px-8 py-3">
                Start Free Trial
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
              <Link href="#demo" className="btn-secondary text-lg px-8 py-3">
                Watch Demo
              </Link>
            </motion.div>
          </div>
        </div>

        {/* Floating Elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-primary-100 rounded-full opacity-20 animate-bounce-gentle"></div>
        <div className="absolute top-40 right-20 w-16 h-16 bg-secondary-100 rounded-full opacity-20 animate-bounce-gentle" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-20 left-1/4 w-12 h-12 bg-success-100 rounded-full opacity-20 animate-bounce-gentle" style={{ animationDelay: '2s' }}></div>
      </section>

      {/* Video Hero Section */}
      <VideoHero
        videoUrl="/videos/rentagent-demo.mp4"
        posterUrl="/images/video-poster.jpg"
        title="See RentAgent AI in Action"
        subtitle="Watch how artificial intelligence transforms property management and rent collection for landlords and property managers"
        features={[
          "AI-Powered Tenant Screening",
          "Automated Rent Collection",
          "Smart Property Analytics",
          "Predictive Maintenance Alerts",
          "Market Rent Optimization",
          "Real-Time Financial Insights"
        ]}
      />

      {/* Role Selection */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Choose Your Role
            </h2>
            <p className="text-gray-600">
              Get started with the right dashboard for your needs
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { id: 'landlord', title: 'Landlord', icon: <Building2 className="w-8 h-8" />, description: 'Manage properties and collect rent' },
              { id: 'tenant', title: 'Tenant', icon: <Home className="w-8 h-8" />, description: 'Pay rent and manage payments' },
              { id: 'manager', title: 'Property Manager', icon: <Users className="w-8 h-8" />, description: 'Oversee multiple properties' }
            ].map((role) => (
              <motion.div
                key={role.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`p-6 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                  activeTab === role.id 
                    ? 'border-primary-500 bg-primary-50' 
                    : 'border-gray-200 hover:border-primary-300'
                }`}
                onClick={() => setActiveTab(role.id)}
              >
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-4">
                    {role.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{role.title}</h3>
                  <p className="text-gray-600">{role.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Powerful Features
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Everything you need to manage rent collection efficiently and intelligently
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="card hover:shadow-soft transition-shadow duration-300"
              >
                <div className="mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              What Our Users Say
            </h2>
            <p className="text-xl text-gray-600">
              Join thousands of satisfied landlords, tenants, and property managers
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="card"
              >
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 mb-4 italic">"{testimonial.content}"</p>
                <div>
                  <p className="font-semibold text-gray-900">{testimonial.name}</p>
                  <p className="text-gray-600 text-sm">{testimonial.role} at {testimonial.company}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary-600 to-secondary-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Transform Your Rent Collection?
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
                <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition-colors">API</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
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
