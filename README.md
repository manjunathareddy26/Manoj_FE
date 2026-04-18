# Farmer Marketplace Frontend

React-based frontend for the Farmer-to-Consumer Marketplace.

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation

```bash
cd frontend
npm install
```

### Environment Setup

Create a `.env` file in the frontend directory:

```
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_GOOGLE_CLIENT_ID=YOUR_GOOGLE_CLIENT_ID_HERE
```

### Running the Application

**Development:**
```bash
npm start
```

Visit `http://localhost:3000`

**Production Build:**
```bash
npm run build
```

## Features

### For Farmers (किसान)
- ✅ Simple registration with WhatsApp and location
- ✅ Add products with name, bags, weight, and price
- ✅ View all orders received
- ✅ Confirm or reject orders
- ✅ Track order payments
- ✅ Dashboard with sales statistics

### For Consumers/Buyers (खरीदार)
- ✅ Browse all available products
- ✅ View farmer details and WhatsApp contact
- ✅ Buy by bags or weight
- ✅ Shopping cart with quantity management
- ✅ Place orders from multiple farmers
- ✅ Choose payment method (COD or Online)
- ✅ Track order status
- ✅ Order history

## Design Philosophy

**Farmer-Friendly Interface:**
- Large, clear buttons and text
- Hindi and English support
- Visual icons for easy navigation
- Minimal complex interactions
- Mobile-responsive design
- Simple form validation

## Folder Structure

```
frontend/
├── public/           # Static files
├── src/
│   ├── components/   # Reusable components
│   ├── pages/        # Page components
│   ├── context/      # Auth context
│   ├── services/     # API service
│   ├── styles/       # CSS styles
│   ├── App.js        # Main app
│   └── index.js      # Entry point
├── .env              # Environment variables
└── package.json      # Dependencies
```

## Key Components

- **HomePage**: Role selection and feature overview
- **AuthPages**: Login and signup with Google support
- **FarmerDashboard**: Product and order management
- **ConsumerDashboard**: Shopping and order tracking
- **ProductsPage**: Browse and add to cart
- **CartPage**: Manage cart before checkout
- **OrdersPage**: Track orders
- **PaymentPage**: Choose payment method

## API Integration

The frontend communicates with the backend API at:
- Base URL: `http://localhost:5000/api`

All requests include JWT token in headers for authentication.

## Styling

- Modern, clean design
- Green color scheme (#4CAF50) for primary actions
- Responsive grid system
- CSS utilities for common patterns
- Material-inspired shadows and elevation

## Farmer-Friendly Features

1. **Bilingual Support**: Hindi and English for accessibility
2. **Large Touch Targets**: Buttons and inputs sized for easy clicking
3. **Clear Visual Feedback**: Color-coded status indicators
4. **Simplified Forms**: Only essential fields required
5. **Direct Communication**: WhatsApp links for farmer-buyer communication
6. **Icon-Heavy**: Visual representations for quick understanding

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers

## Responsive Breakpoints

- **Desktop**: 1200px and above
- **Tablet**: 768px to 1199px
- **Mobile**: Below 768px

## Building for Production

```bash
npm run build
```

The build folder is ready for deployment.

## Environment Variables

```
REACT_APP_API_URL      - Backend API URL
REACT_APP_GOOGLE_CLIENT_ID - Google OAuth Client ID
```

## Future Enhancements

- [ ] Razorpay payment integration
- [ ] Product reviews and ratings
- [ ] Advanced search and filters
- [ ] Bulk ordering
- [ ] Delivery tracking
- [ ] Farmer analytics
- [ ] Push notifications

## Support

For issues or questions, contact the development team.
