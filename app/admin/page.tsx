'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  Users,
  Building2,
  CreditCard,
  TrendingUp,
  UserPlus,
  Home,
  DollarSign,
  AlertTriangle,
  CheckCircle,
  Clock,
  Eye,
  Edit,
  Trash2,
  Search,
  Filter,
  Download,
  RefreshCw,
  Video
} from 'lucide-react'
import Link from 'next/link'
import VideoUpload from '../components/VideoUpload'

interface User {
  id: string
  firstName: string
  lastName: string
  email: string
  role: 'landlord' | 'tenant' | 'manager'
  companyName?: string
  isVerified: boolean
  isActive: boolean
  lastLogin?: string
  createdAt: string
  subscription: {
    plan: string
    status: string
  }
}

interface Property {
  id: string
  name: string
  type: string
  address: {
    city: string
    state: string
  }
  status: string
  financial: {
    monthlyRent: number
  }
  occupancy: {
    currentTenants: number
    maxTenants: number
  }
  owner: {
    firstName: string
    lastName: string
  }
}

interface DashboardStats {
  totalUsers: number
  totalProperties: number
  totalRevenue: number
  activeSubscriptions: number
  newUsersThisMonth: number
  propertiesAddedThisMonth: number
}

export default function AdminDashboard() {
  const [users, setUsers] = useState<User[]>([])
  const [properties, setProperties] = useState<Property[]>([])
  const [videos, setVideos] = useState<any[]>([])
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalProperties: 0,
    totalRevenue: 0,
    activeSubscriptions: 0,
    newUsersThisMonth: 0,
    propertiesAddedThisMonth: 0
  })
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [roleFilter, setRoleFilter] = useState('all')
  const [activeTab, setActiveTab] = useState('overview')

  // Mock data for demonstration - replace with real API calls
  useEffect(() => {
    const mockUsers: User[] = [
      {
        id: '1',
        firstName: 'John',
        lastName: 'Smith',
        email: 'john@example.com',
        role: 'landlord',
        companyName: 'Smith Properties',
        isVerified: true,
        isActive: true,
        lastLogin: '2024-01-15T10:30:00Z',
        createdAt: '2024-01-01T00:00:00Z',
        subscription: { plan: 'professional', status: 'active' }
      },
      {
        id: '2',
        firstName: 'Sarah',
        lastName: 'Johnson',
        email: 'sarah@example.com',
        role: 'manager',
        companyName: 'Urban Properties',
        isVerified: true,
        isActive: true,
        lastLogin: '2024-01-14T15:45:00Z',
        createdAt: '2024-01-05T00:00:00Z',
        subscription: { plan: 'enterprise', status: 'active' }
      },
      {
        id: '3',
        firstName: 'Mike',
        lastName: 'Chen',
        email: 'mike@example.com',
        role: 'tenant',
        isVerified: false,
        isActive: true,
        lastLogin: '2024-01-13T09:15:00Z',
        createdAt: '2024-01-10T00:00:00Z',
        subscription: { plan: 'free', status: 'inactive' }
      }
    ]

    const mockProperties: Property[] = [
      {
        id: '1',
        name: 'Downtown Apartment',
        type: 'apartment',
        address: { city: 'New York', state: 'NY' },
        status: 'occupied',
        financial: { monthlyRent: 2500 },
        occupancy: { currentTenants: 2, maxTenants: 2 },
        owner: { firstName: 'John', lastName: 'Smith' }
      },
      {
        id: '2',
        name: 'Suburban House',
        type: 'house',
        address: { city: 'Los Angeles', state: 'CA' },
        status: 'available',
        financial: { monthlyRent: 3500 },
        occupancy: { currentTenants: 0, maxTenants: 4 },
        owner: { firstName: 'Sarah', lastName: 'Johnson' }
      }
    ]

    const mockVideos = [
      {
        id: '1',
        title: 'RentAgent AI Demo - Property Management',
        description: 'See how AI transforms property management with automated rent collection, tenant screening, and predictive analytics.',
        url: '/videos/rentagent-demo.mp4',
        posterUrl: '/images/video-poster.jpg',
        duration: '2:45',
        uploadDate: '2024-01-15T00:00:00Z',
        status: 'active'
      },
      {
        id: '2',
        title: 'Tenant Screening with AI',
        description: 'Learn how our AI-powered tenant screening system works to find the best tenants for your properties.',
        url: '/videos/tenant-screening.mp4',
        posterUrl: '/images/tenant-screening-poster.jpg',
        duration: '1:30',
        uploadDate: '2024-01-10T00:00:00Z',
        status: 'active'
      }
    ]

    const mockStats: DashboardStats = {
      totalUsers: mockUsers.length,
      totalProperties: mockProperties.length,
      totalRevenue: 12500,
      activeSubscriptions: 2,
      newUsersThisMonth: 3,
      propertiesAddedThisMonth: 2
    }

    setUsers(mockUsers)
    setProperties(mockProperties)
    setVideos(mockVideos)
    setStats(mockStats)
    setLoading(false)
  }, [])

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRole = roleFilter === 'all' || user.role === roleFilter
    return matchesSearch && matchesRole
  })

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'landlord': return 'bg-blue-100 text-blue-800'
      case 'manager': return 'bg-purple-100 text-purple-800'
      case 'tenant': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800'
      case 'inactive': return 'bg-red-100 text-red-800'
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 text-primary-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading admin dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <Building2 className="w-8 h-8 text-primary-600" />
              <span className="text-2xl font-bold text-gray-900">RentAgent Admin</span>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/" className="text-gray-600 hover:text-primary-600 transition-colors">
                Back to Website
              </Link>
              <button className="btn-secondary">
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh Data
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            {[
              { id: 'overview', label: 'Overview', icon: <TrendingUp className="w-4 h-4" /> },
              { id: 'users', label: 'Users', icon: <Users className="w-4 h-4" /> },
              { id: 'properties', label: 'Properties', icon: <Building2 className="w-4 h-4" /> },
              { id: 'videos', label: 'Videos', icon: <Video className="w-4 h-4" /> },
              { id: 'analytics', label: 'Analytics', icon: <CreditCard className="w-4 h-4" /> }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
              >
                <div className="flex items-center">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Users className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Users</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.totalUsers}</p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
              >
                <div className="flex items-center">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Building2 className="w-6 h-6 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Properties</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.totalProperties}</p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
              >
                <div className="flex items-center">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <DollarSign className="w-6 h-6 text-purple-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Monthly Revenue</p>
                    <p className="text-2xl font-bold text-gray-900">${stats.totalRevenue.toLocaleString()}</p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
              >
                <div className="flex items-center">
                  <div className="p-2 bg-yellow-100 rounded-lg">
                    <CreditCard className="w-6 h-6 text-yellow-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Active Subscriptions</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.activeSubscriptions}</p>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Recent Activity</h3>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {users.slice(0, 5).map((user, index) => (
                    <div key={user.id} className="flex items-center space-x-4">
                      <div className="flex-shrink-0">
                        <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                          <UserPlus className="w-4 h-4 text-primary-600" />
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900">
                          New {user.role} registered: {user.firstName} {user.lastName}
                        </p>
                        <p className="text-sm text-gray-500">{user.email}</p>
                      </div>
                      <div className="flex-shrink-0 text-sm text-gray-500">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="space-y-6">
            {/* Search and Filters */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search users..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <select
                    value={roleFilter}
                    onChange={(e) => setRoleFilter(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="all">All Roles</option>
                    <option value="landlord">Landlords</option>
                    <option value="manager">Managers</option>
                    <option value="tenant">Tenants</option>
                  </select>
                  <button className="btn-secondary">
                    <Download className="w-4 h-4 mr-2" />
                    Export
                  </button>
                </div>
              </div>
            </div>

            {/* Users Table */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">All Users ({filteredUsers.length})</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subscription</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Login</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredUsers.map((user) => (
                      <tr key={user.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10">
                              <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center">
                                <span className="text-sm font-medium text-primary-600">
                                  {user.firstName[0]}{user.lastName[0]}
                                </span>
                              </div>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {user.firstName} {user.lastName}
                              </div>
                              <div className="text-sm text-gray-500">{user.email}</div>
                              {user.companyName && (
                                <div className="text-xs text-gray-400">{user.companyName}</div>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRoleColor(user.role)}`}>
                            {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center space-x-2">
                            {user.isActive ? (
                              <CheckCircle className="w-4 h-4 text-green-500" />
                            ) : (
                              <AlertTriangle className="w-4 h-4 text-red-500" />
                            )}
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(user.isActive ? 'active' : 'inactive')}`}>
                              {user.isActive ? 'Active' : 'Inactive'}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{user.subscription.plan}</div>
                          <div className="text-sm text-gray-500">{user.subscription.status}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : 'Never'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <button className="text-primary-600 hover:text-primary-900">
                              <Eye className="w-4 h-4" />
                            </button>
                            <button className="text-indigo-600 hover:text-indigo-900">
                              <Edit className="w-4 h-4" />
                            </button>
                            <button className="text-red-600 hover:text-red-900">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'properties' && (
          <div className="space-y-6">
            {/* Properties Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Home className="w-6 h-6 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Available</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {properties.filter(p => p.status === 'available').length}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Users className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Occupied</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {properties.filter(p => p.status === 'occupied').length}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-yellow-100 rounded-lg">
                    <DollarSign className="w-6 h-6 text-yellow-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Avg Rent</p>
                    <p className="text-2xl font-bold text-gray-900">
                      ${(properties.reduce((sum, p) => sum + p.financial.monthlyRent, 0) / properties.length).toFixed(0)}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Properties Table */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">All Properties ({properties.length})</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Property</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Owner</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rent</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Occupancy</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {properties.map((property) => (
                      <tr key={property.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">{property.name}</div>
                            <div className="text-sm text-gray-500">{property.type}</div>
                            <div className="text-xs text-gray-400">{property.address.city}, {property.address.state}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {property.owner.firstName} {property.owner.lastName}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            property.status === 'occupied' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                          }`}>
                            {property.status.charAt(0).toUpperCase() + property.status.slice(1)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          ${property.financial.monthlyRent.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {property.occupancy.currentTenants}/{property.occupancy.maxTenants}
                          </div>
                          <div className="text-xs text-gray-500">
                            {Math.round((property.occupancy.currentTenants / property.occupancy.maxTenants) * 100)}% occupied
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <button className="text-primary-600 hover:text-primary-900">
                              <Eye className="w-4 h-4" />
                            </button>
                            <button className="text-indigo-600 hover:text-indigo-900">
                              <Edit className="w-4 h-4" />
                            </button>
                            <button className="text-red-600 hover:text-red-900">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'videos' && (
          <div className="space-y-6">
            <VideoUpload
              videos={videos}
              onVideoUpload={(file) => {
                console.log('Video upload:', file)
                // Handle video upload logic here
              }}
              onVideoDelete={(videoId) => {
                setVideos(videos.filter(v => v.id !== videoId))
              }}
              onVideoUpdate={(videoId, updates) => {
                setVideos(videos.map(v => v.id === videoId ? { ...v, ...updates } : v))
              }}
            />
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Analytics Dashboard</h3>
              <p className="text-gray-600">Advanced analytics and reporting features coming soon!</p>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
