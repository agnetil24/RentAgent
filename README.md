# rentagent.ai - AI-Powered Rent Collection Platform

A modern, intelligent platform for landlords, tenants, and property managers to streamline rent collection with AI-powered insights and seamless payment processing.

## 🚀 Features

### Core Functionality
- **Automated Rent Collection** - Set up recurring payments and never worry about late rent
- **AI-Powered Analytics** - Get insights into payment patterns and property performance
- **Secure Payments** - Bank-level security with Stripe integration
- **Tenant Management** - Manage multiple properties and tenants from one dashboard
- **Instant Notifications** - Real-time updates on payments, maintenance, and more
- **Property Portfolio** - Track all your properties and their financial performance

### User Roles
- **Landlords** - Manage properties and collect rent efficiently
- **Tenants** - Pay rent and manage payments with ease
- **Property Managers** - Oversee multiple properties with comprehensive tools

### AI Features
- Payment pattern analysis
- Maintenance request prediction
- Market trend insights
- Risk assessment and alerts
- Performance optimization recommendations

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS, Framer Motion
- **Charts**: Recharts for data visualization
- **Payments**: Stripe integration
- **Authentication**: NextAuth.js
- **Database**: MongoDB with Mongoose
- **Icons**: Lucide React
- **Forms**: React Hook Form
- **Notifications**: React Hot Toast

## 📋 Prerequisites

- Node.js 18+ 
- npm or yarn
- MongoDB database
- Stripe account (for payment processing)

## 🚀 Getting Started

### 1. Clone the Repository
```bash
git clone <your-repo-url>
cd RentAgent
```

### 2. Install Dependencies
```bash
npm install
# or
yarn install
```

### 3. Environment Setup
Create a `.env.local` file in the root directory:

```env
# Stripe Configuration
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key

# Database
MONGODB_URI=your_mongodb_connection_string

# Authentication
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=http://localhost:3000
```

### 4. Run the Development Server
```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🏗️ Project Structure

```
RentAgent/
├── app/                    # Next.js 13+ app directory
│   ├── auth/              # Authentication pages
│   │   ├── login/         # Login page
│   │   └── register/      # Registration page
│   ├── dashboard/         # Main dashboard
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/             # Reusable components
├── lib/                    # Utility functions
├── public/                 # Static assets
├── styles/                 # Additional styles
├── package.json            # Dependencies
├── tailwind.config.js      # Tailwind configuration
├── tsconfig.json           # TypeScript configuration
└── README.md               # This file
```

## 🎨 Design System

### Colors
- **Primary**: Blue (#0ea5e9) - Main brand color
- **Secondary**: Purple (#d946ef) - Accent color
- **Success**: Green (#22c55e) - Positive actions
- **Warning**: Yellow (#f59e0b) - Caution states
- **Danger**: Red (#ef4444) - Error states

### Components
- Modern card designs with subtle shadows
- Responsive grid layouts
- Interactive hover states
- Smooth animations with Framer Motion
- Consistent spacing and typography

## 📱 Responsive Design

The platform is fully responsive and works seamlessly on:
- Desktop computers
- Tablets
- Mobile phones
- All modern browsers

## 🔒 Security Features

- Secure authentication with NextAuth.js
- Encrypted data transmission
- Stripe's PCI-compliant payment processing
- Role-based access control
- Secure API endpoints

## 🚀 Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables
4. Deploy automatically

### Other Platforms
- Netlify
- AWS Amplify
- DigitalOcean App Platform

## 📊 Analytics & Monitoring

- Real-time performance metrics
- User behavior tracking
- Payment success rates
- Property performance analytics
- AI-powered insights and recommendations

## 🔧 Customization

### Adding New Features
1. Create new components in the `components/` directory
2. Add new pages in the `app/` directory
3. Update the navigation in the dashboard
4. Add new API routes as needed

### Styling
- Modify `tailwind.config.js` for theme changes
- Update `app/globals.css` for custom styles
- Use the existing design system classes

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Create an issue in the GitHub repository
- Contact the development team
- Check the documentation

## 🔮 Roadmap

### Phase 1 (Current)
- ✅ Basic authentication
- ✅ Dashboard overview
- ✅ Property management
- ✅ Basic analytics

### Phase 2 (Next)
- [ ] Advanced payment processing
- [ ] Maintenance request system
- [ ] Tenant portal
- [ ] Mobile app

### Phase 3 (Future)
- [ ] AI-powered tenant screening
- [ ] Predictive maintenance
- [ ] Advanced reporting
- [ ] Integration marketplace

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- Tailwind CSS for the utility-first CSS framework
- Stripe for secure payment processing
- All contributors and supporters

---

Built with ❤️ for the property management community
