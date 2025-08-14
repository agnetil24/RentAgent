'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Home, 
  CreditCard, 
  Users, 
  BarChart3, 
  Building2, 
  DollarSign,
  TrendingUp,
  TrendingDown,
  Calendar,
  AlertCircle,
  CheckCircle,
  Clock,
  Eye,
  Plus,
  Filter,
  Search,
  Bell,
  Settings,
  LogOut
} from 'lucide-react'
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import Link from 'next/link'

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState('overview')
  const [userRole] = useState('landlord') // This would come from auth context

  // Sample data for charts
  const rentCollectionData = [
    { month: 'Jan', collected: 45000, expected: 50000, late: 5000 },
    { month: 'Feb', collected: 48000, expected: 50000, late: 2000 },
    { month: 'Mar', collected: 52000, expected: 50000, late: 0 },
    { month: 'Apr', collected: 49000, expected: 50000, late: 1000 },
    { month: 'May', collected: 51000, expected: 50000, late: 0 },
    { month: 'Jun', collected: 53000, expected: 50000, late: 0 },
  ]

  const propertyPerformance = [
    { name: 'Downtown Apt', occupancy: 95, rentCollected: 98, maintenance: 85 },
    { name: 'Suburban House', occupancy: 100, rentCollected: 100, maintenance: 90 },
    { name: 'City Loft', occupancy: 88, rentCollected: 92, maintenance: 78 },
  ]

  const recentTransactions = [
    { id: 1, tenant: 'John Smith', property: 'Downtown Apt', amount: 2500, status: 'paid', date: '2024-01-15' },
    { id: 2, tenant: 'Sarah Johnson', property: 'Suburban House', amount: 3200, status: 'paid', date: '2024-01-14' },
    { id: 3, tenant: 'Mike Wilson', property: 'City Loft', amount: 2800, status: 'pending', date: '2024-01-13' },
    { id: 4, tenant: 'Emily Davis', property: 'Downtown Apt', amount: 2500, status: 'late', date: '2024-01-12' },
  ]

  const aiInsights = [
    {
      type: 'success',
      title: 'Rent Collection Improved',
      description: 'Your collection rate has improved by 15% this month compared to last month.',
      icon: <TrendingUp className="w-5 h-5 text-success-600" />
    },
    {
      type: 'warning',
      title: 'Maintenance Alert',
      description: 'Property "City Loft" shows increased maintenance requests. Consider proactive inspection.',
      icon: <AlertCircle className="w-5 h-5 text-warning-600" />
    },
    {
      type: 'info',
      title: 'Market Opportunity',
      description: 'Based on current market trends, you could increase rent by 3-5% on renewals.',
      icon: <BarChart3 className="w-5 h-5 text-primary-600" />
    }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'text-success-600 bg-success-50'
      case 'pending': return 'text-warning-600 bg-warning-50'
      case 'late': return 'text-danger-600 bg-danger-50'
      default: return 'text-gray-600 bg-gray-50'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'paid': return <CheckCircle className="w-4 h-4" />
      case 'pending': return <Clock className="w-4 h-4" />
      case 'late': return <AlertCircle className="w-4 h-4" />
      default: return <Clock className="w-4 h-4" />
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Home className="w-8 h-8 text-primary-600" />
                <span className="text-2xl font-bold text-gradient">RentAgent</span>
              </div>
              <div className="hidden md:flex items-center space-x-1 text-sm text-gray-500">
                <span>•</span>
                <span className="capitalize">{userRole} Dashboard</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <button className="p-2 text-gray-400 hover:text-gray-600 relative">
                <Bell className="w-5 h-5" />
                <span className="absolute top-0 right-0 w-2 h-2 bg-danger-500 rounded-full"></span>
              </button>
              <button className="p-2 text-gray-400 hover:text-gray-600">
                <Settings className="w-5 h-5" />
              </button>
              <button className="p-2 text-gray-400 hover:text-gray-600">
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white border-r border-gray-200 min-h-screen">
          <nav className="p-4 space-y-2">
            {[
              { id: 'overview', label: 'Overview', icon: <BarChart3 className="w-5 h-5" /> },
              { id: 'properties', label: 'Properties', icon: <Building2 className="w-5 h-5" /> },
              { id: 'tenants', label: 'Tenants', icon: <Users className="w-5 h-5" /> },
              { id: 'payments', label: 'Payments', icon: <CreditCard className="w-5 h-5" /> },
              { id: 'maintenance', label: 'Maintenance', icon: <Home className="w-5 h-5" /> },
              { id: 'reports', label: 'Reports', icon: <BarChart3 className="w-5 h-5" /> },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`sidebar-item w-full ${activeTab === item.id ? 'active' : ''}`}
              >
                {item.icon}
                <span className="ml-3">{item.label}</span>
              </button>
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Page Header */}
              <div className="flex justify-between items-center">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">Dashboard Overview</h1>
                  <p className="text-gray-600">Welcome back! Here's what's happening with your properties.</p>
                </div>
                <div className="flex space-x-3">
                  <button className="btn-secondary flex items-center">
                    <Filter className="w-4 h-4 mr-2" />
                    Filter
                  </button>
                  <button className="btn-primary flex items-center">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Property
                  </button>
                </div>
              </div>

              {/* Key Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="dashboard-stat"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                      <p className="text-2xl font-bold text-gray-900">$298,000</p>
                    </div>
                    <div className="p-3 bg-success-100 rounded-full">
                      <DollarSign className="w-6 h-6 text-success-600" />
                    </div>
                  </div>
                  <div className="mt-4 flex items-center text-sm">
                    <TrendingUp className="w-4 h-4 text-success-600 mr-1" />
                    <span className="text-success-600">+12.5%</span>
                    <span className="text-gray-500 ml-1">from last month</span>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  className="dashboard-stat"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Properties</p>
                      <p className="text-2xl font-bold text-gray-900">12</p>
                    </div>
                    <div className="p-3 bg-primary-100 rounded-full">
                      <Building2 className="w-6 h-6 text-primary-600" />
                    </div>
                  </div>
                  <div className="mt-4 flex items-center text-sm">
                    <TrendingUp className="w-4 h-4 text-primary-600 mr-1" />
                    <span className="text-primary-600">+2</span>
                    <span className="text-gray-500 ml-1">new this year</span>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="dashboard-stat"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Occupancy Rate</p>
                      <p className="text-2xl font-bold text-gray-900">94.2%</p>
                    </div>
                    <div className="p-3 bg-secondary-100 rounded-full">
                      <Users className="w-6 h-6 text-secondary-600" />
                    </div>
                  </div>
                  <div className="mt-4 flex items-center text-sm">
                    <TrendingUp className="w-4 h-4 text-success-600 mr-1" />
                    <span className="text-success-600">+2.1%</span>
                    <span className="text-gray-500 ml-1">from last month</span>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="dashboard-stat"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Collection Rate</p>
                      <p className="text-2xl font-bold text-gray-900">96.8%</p>
                    </div>
                    <div className="p-3 bg-warning-100 rounded-full">
                      <CreditCard className="w-6 h-6 text-warning-600" />
                    </div>
                  </div>
                  <div className="mt-4 flex items-center text-sm">
                    <TrendingUp className="w-4 h-4 text-success-600 mr-1" />
                    <span className="text-success-600">+1.3%</span>
                    <span className="text-gray-500 ml-1">from last month</span>
                  </div>
                </motion.div>
              </div>

              {/* Charts Row */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Rent Collection Chart */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  className="card"
                >
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Rent Collection Trend</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={rentCollectionData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Area type="monotone" dataKey="collected" stackId="1" stroke="#0ea5e9" fill="#0ea5e9" fillOpacity={0.6} />
                      <Area type="monotone" dataKey="late" stackId="1" stroke="#ef4444" fill="#ef4444" fillOpacity={0.6} />
                    </AreaChart>
                  </ResponsiveContainer>
                </motion.div>

                {/* Property Performance */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                  className="card"
                >
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Property Performance</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={propertyPerformance}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="occupancy" fill="#0ea5e9" />
                      <Bar dataKey="rentCollected" fill="#22c55e" />
                      <Bar dataKey="maintenance" fill="#f59e0b" />
                    </BarChart>
                  </ResponsiveContainer>
                </motion.div>
              </div>

              {/* AI Insights and Recent Transactions */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* AI Insights */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.6 }}
                  className="card"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">AI Insights</h3>
                    <span className="text-sm text-primary-600 font-medium">Powered by AI</span>
                  </div>
                  <div className="space-y-4">
                    {aiInsights.map((insight, index) => (
                      <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                        {insight.icon}
                        <div>
                          <h4 className="font-medium text-gray-900">{insight.title}</h4>
                          <p className="text-sm text-gray-600">{insight.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>

                {/* Recent Transactions */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.7 }}
                  className="card"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">Recent Transactions</h3>
                    <Link href="/dashboard/payments" className="text-sm text-primary-600 hover:text-primary-500">
                      View all
                    </Link>
                  </div>
                  <div className="space-y-3">
                    {recentTransactions.map((transaction) => (
                      <div key={transaction.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className={`p-2 rounded-full ${getStatusColor(transaction.status)}`}>
                            {getStatusIcon(transaction.status)}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{transaction.tenant}</p>
                            <p className="text-sm text-gray-600">{transaction.property}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-gray-900">${transaction.amount}</p>
                          <p className="text-sm text-gray-500">{transaction.date}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              </div>
            </div>
          )}

          {/* Other tabs would be implemented here */}
          {activeTab !== 'overview' && (
            <div className="text-center py-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Coming Soon</h2>
              <p className="text-gray-600">This feature is under development.</p>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
