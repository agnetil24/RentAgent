# 🗄️ RentAgent Database Setup Guide

This guide will help you set up the complete database infrastructure for your RentAgent platform, enabling real user data storage and AI-powered insights.

## 🚀 **What We've Built**

### **Database Models Created:**
1. **User Model** - Authentication, roles, preferences, subscriptions
2. **Property Model** - Property details, financial data, AI insights
3. **Payment Model** - Rent collection, late fees, payment history
4. **Maintenance Model** - Maintenance requests, repairs, scheduling

### **API Endpoints Created:**
1. **Authentication** - User registration and login
2. **Properties** - CRUD operations for properties
3. **AI Insights** - Intelligent property analysis

## 📋 **Step-by-Step Setup**

### **Step 1: Set Up MongoDB**

#### **Option A: MongoDB Atlas (Recommended - Free)**
1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a free account
3. Create a new cluster (free tier)
4. Set up database access (username/password)
5. Set up network access (allow all IPs: 0.0.0.0/0)
6. Get your connection string

#### **Option B: Local MongoDB**
1. Download [MongoDB Community Server](https://www.mongodb.com/try/download/community)
2. Install and start the service
3. Your connection string will be: `mongodb://localhost:27017/rentagent`

### **Step 2: Update Environment Variables**

Edit your `.env.local` file:

```env
# Database Configuration
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/rentagent?retryWrites=true&w=majority

# Authentication
NEXTAUTH_SECRET=your_super_secret_key_here
NEXTAUTH_URL=http://localhost:3000

# Stripe (for payments)
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
```

### **Step 3: Install Dependencies**

```bash
npm install mongoose bcryptjs jsonwebtoken
```

### **Step 4: Test Database Connection**

Start your development server:

```bash
npm run dev
```

Visit `http://localhost:3000/auth/register` and try to create a user account.

## 🏗️ **Database Schema Overview**

### **User Collection**
```typescript
{
  _id: ObjectId,
  email: String (unique),
  password: String (hashed),
  firstName: String,
  lastName: String,
  role: "landlord" | "tenant" | "manager",
  companyName: String (optional),
  phone: String (optional),
  avatar: String (optional),
  isVerified: Boolean,
  isActive: Boolean,
  lastLogin: Date,
  preferences: {
    notifications: Boolean,
    emailUpdates: Boolean,
    theme: "light" | "dark",
    language: String
  },
  subscription: {
    plan: String,
    status: "active" | "inactive" | "cancelled",
    startDate: Date,
    endDate: Date,
    stripeCustomerId: String,
    stripeSubscriptionId: String
  },
  createdAt: Date,
  updatedAt: Date
}
```

### **Property Collection**
```typescript
{
  _id: ObjectId,
  name: String,
  type: "apartment" | "house" | "condo" | "townhouse" | "commercial" | "other",
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String,
    coordinates: { lat: Number, lng: Number }
  },
  owner: ObjectId (ref: User),
  manager: ObjectId (ref: User, optional),
  tenants: [ObjectId] (ref: User),
  details: {
    bedrooms: Number,
    bathrooms: Number,
    squareFootage: Number,
    yearBuilt: Number,
    parkingSpaces: Number,
    amenities: [String],
    description: String,
    images: [String]
  },
  financial: {
    purchasePrice: Number,
    currentValue: Number,
    monthlyRent: Number,
    securityDeposit: Number,
    propertyTax: Number,
    insurance: Number,
    utilities: Number,
    maintenance: Number,
    hoaFees: Number
  },
  status: "available" | "occupied" | "maintenance" | "unavailable",
  occupancy: {
    currentTenants: Number,
    maxTenants: Number,
    leaseStartDate: Date,
    leaseEndDate: Date,
    renewalDate: Date
  },
  maintenance: {
    lastInspection: Date,
    nextInspection: Date,
    outstandingIssues: Number,
    totalSpent: Number
  },
  aiInsights: {
    rentOptimization: {
      suggestedRent: Number,
      marketComparison: String,
      confidence: Number
    },
    maintenancePrediction: {
      nextMaintenance: Date,
      estimatedCost: Number,
      priority: "low" | "medium" | "high"
    },
    occupancyTrends: {
      averageOccupancy: Number,
      vacancyRisk: "low" | "medium" | "high",
      seasonalPatterns: [String]
    }
  },
  createdAt: Date,
  updatedAt: Date
}
```

### **Payment Collection**
```typescript
{
  _id: ObjectId,
  tenant: ObjectId (ref: User),
  property: ObjectId (ref: Property),
  landlord: ObjectId (ref: User),
  amount: Number,
  type: "rent" | "security_deposit" | "late_fee" | "maintenance" | "other",
  status: "pending" | "completed" | "failed" | "cancelled" | "refunded",
  dueDate: Date,
  paidDate: Date (optional),
  lateFee: Number,
  stripePaymentIntentId: String,
  stripeChargeId: String,
  method: "stripe" | "bank_transfer" | "check" | "cash" | "other",
  description: String (optional),
  notes: String (optional),
  receipt: String (optional),
  recurring: Boolean,
  recurringId: String (optional),
  metadata: {
    month: String,
    year: Number,
    leasePeriod: String,
    previousBalance: Number,
    adjustments: Number
  },
  createdAt: Date,
  updatedAt: Date
}
```

### **Maintenance Collection**
```typescript
{
  _id: ObjectId,
  property: ObjectId (ref: Property),
  tenant: ObjectId (ref: User),
  landlord: ObjectId (ref: User),
  assignedTo: ObjectId (ref: User, optional),
  title: String,
  description: String,
  category: "plumbing" | "electrical" | "hvac" | "appliance" | "structural" | "pest_control" | "cleaning" | "other",
  priority: "low" | "medium" | "high" | "emergency",
  status: "pending" | "assigned" | "in_progress" | "completed" | "cancelled",
  reportedDate: Date,
  scheduledDate: Date (optional),
  completedDate: Date (optional),
  estimatedCost: Number (optional),
  actualCost: Number (optional),
  images: [String],
  notes: [String],
  aiInsights: {
    urgency: "low" | "medium" | "high",
    estimatedTimeToComplete: String,
    recommendedContractor: String,
    similarIssues: [String],
    preventiveMeasures: [String]
  },
  createdAt: Date,
  updatedAt: Date
}
```

## 🤖 **AI Features Enabled**

### **1. Rent Optimization**
- Analyzes similar properties in the area
- Considers property features (size, amenities, age)
- Provides confidence scores and market comparisons
- Suggests optimal rent adjustments

### **2. Maintenance Prediction**
- Tracks maintenance patterns and history
- Predicts next maintenance needs
- Estimates costs based on property characteristics
- Prioritizes issues by urgency

### **3. Occupancy Trend Analysis**
- Analyzes seasonal patterns
- Identifies vacancy risks
- Provides market-based recommendations
- Tracks tenant retention strategies

## 🔐 **Security Features**

- **Password Hashing** - All passwords are securely hashed using bcrypt
- **JWT Authentication** - Secure token-based authentication
- **Role-Based Access** - Different permissions for landlords, tenants, and managers
- **Input Validation** - Comprehensive validation for all user inputs
- **SQL Injection Protection** - MongoDB with Mongoose ODM prevents injection attacks

## 📊 **Sample Data for Testing**

### **Create a Test Landlord Account:**
1. Go to `/auth/register`
2. Select "Landlord" role
3. Fill in details:
   - First Name: John
   - Last Name: Smith
   - Email: john@example.com
   - Company: Smith Properties
   - Password: password123

### **Create a Test Property:**
1. Login with the landlord account
2. Go to dashboard
3. Click "Add Property"
4. Fill in property details:
   - Name: Downtown Apartment
   - Type: Apartment
   - Address: 123 Main St, New York, NY 10001
   - Bedrooms: 2
   - Bathrooms: 1
   - Square Footage: 800
   - Monthly Rent: $2500
   - Security Deposit: $2500

## 🚨 **Troubleshooting**

### **Common Issues:**

1. **"MongoDB connection failed"**
   - Check your MONGODB_URI in .env.local
   - Ensure MongoDB Atlas network access allows your IP
   - Verify username/password are correct

2. **"User registration fails"**
   - Check browser console for errors
   - Verify all required fields are filled
   - Check server logs for validation errors

3. **"Properties not loading"**
   - Ensure user is authenticated
   - Check JWT token in browser storage
   - Verify API routes are working

### **Debug Commands:**
```bash
# Check MongoDB connection
npm run dev

# View server logs in terminal
# Check browser console for errors
# Verify .env.local file exists and has correct values
```

## 🎯 **Next Steps**

Once your database is set up and working:

1. **Test User Registration** - Create accounts for different roles
2. **Add Properties** - Create sample properties to test the system
3. **Test AI Insights** - Generate insights for your properties
4. **Set Up Stripe** - Configure payment processing
5. **Deploy to Production** - Move to a production MongoDB instance

## 📞 **Support**

If you encounter issues:
1. Check the browser console for error messages
2. Review server logs in your terminal
3. Verify all environment variables are set correctly
4. Ensure MongoDB is accessible from your network

Your RentAgent platform now has a complete, production-ready database backend with AI-powered insights! 🎉
