# 🐷 Oink MVP - Micro-Investing Platform

A React-based micro-investing platform that allows users to add funds, invest when they reach the minimum threshold, and earn points for rewards redemption.

## 🌟 Features

- **🔐 Magic Link Authentication**: Passwordless login using Magic SDK
- **💰 Micro-Investing**: Add funds and invest with a $20 minimum threshold
- **🎯 Points & Rewards System**: Earn 1 point per $10 invested, redeem for rewards
- **📊 Real-time Dashboard**: Live balance and points tracking with Firebase Firestore
- **📱 Responsive Design**: Clean, mobile-friendly interface
- **🔄 Real-time Updates**: Instant data synchronization across sessions

## 🛠️ Tech Stack

- **Frontend**: React 18 + React Router v6
- **Authentication**: Magic SDK (passwordless)
- **Database**: Firebase Firestore
- **Styling**: CSS3 with Flexbox/Grid
- **Payment**: MoonPay integration (currently simulated)
- **Hosting**: Ready for deployment

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ 
- Firebase project with Firestore enabled
- Magic SDK account

### 1. Installation
```bash
# Clone the repository
git clone https://github.com/ThomasCaneday/oink-mvp.git
cd oink-mvp

# Install dependencies
npm install
```

### 2. Environment Setup
```bash

# Edit .env with your actual keys
REACT_APP_FIREBASE_API_KEY=your_firebase_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
REACT_APP_FIREBASE_APP_ID=your_app_id
REACT_APP_MAGIC_PUBLISHABLE_KEY=your_magic_publishable_key
```

### 3. Firebase Setup
1. Create a Firebase project at [console.firebase.google.com](https://console.firebase.google.com)
2. Enable Firestore Database in "test mode"
3. Update Firestore security rules for development:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

### 4. Magic SDK Setup
1. Create account at [magic.link](https://magic.link)
2. Get your publishable API key
3. Add to `.env` file

### 5. Run the Application
```bash
npm start
```
Visit `http://localhost:3000` to see your app!

## 📁 Project Structure

```
src/
├── components/
│   ├── AuthProvider.jsx     # Magic Link authentication context
│   ├── Dashboard.jsx        # Main dashboard with investing features
│   ├── RewardsList.jsx      # Rewards store and redemption
│   └── SignIn.jsx          # Magic Link sign-in page
├── firebase.js             # Firebase configuration
├── App.jsx                 # Main app with routing
├── index.js                # React app entry point
├── App.css                 # Complete styling
└── index.css               # Base styles
```

## 🎮 How to Use

### For Users:
1. **Sign Up/In**: Enter your email to receive a magic link
2. **Add Funds**: Add money to your pending balance ($1 minimum)
3. **Invest**: Once you have $20+, click "Invest Now" to convert balance to points
4. **Earn Points**: Get 1 point for every $10 invested
5. **Redeem Rewards**: Use points to get gift cards and rewards

### For Developers:
- All user data persists in Firebase Firestore
- Authentication state managed by Magic SDK
- Investment and rewards are currently simulated
- Ready for real payment/investment API integration

## 💾 Database Schema

### Users Collection (`users/{publicAddress}`)
```javascript
{
  email: "user@example.com",
  publicAddress: "0x123...",
  pendingBalance: 25.50,
  points: 150,
  createdAt: "2025-01-15T10:30:00Z"
}
```

### Transactions Subcollection (`users/{publicAddress}/transactions/{id}`)
```javascript
{
  amount: 20.00,
  type: "investment",
  pointsEarned: 2,
  timestamp: "2025-01-15T10:35:00Z",
  status: "completed"
}
```

## 🔧 Available Scripts

```bash
npm start          # Run development server
npm test           # Run test suite
npm run build      # Build for production
npm run eject      # Eject from Create React App
```

## 🚧 Current Status

### ✅ Working Features:
- Magic Link authentication (real)
- User registration and login (real)
- Database operations (real)
- Balance tracking (real)
- Points system (real)
- Rewards redemption logic (real)
- Responsive UI (real)

### 🔄 Simulated Features:
- Payment processing (uses mock transactions)
- Investment execution (no real stocks purchased)
- Reward fulfillment (no actual gift cards sent)

### 🎯 Next Steps for Production:
- [ ] Integrate real payment processor (MoonPay, Stripe)
- [ ] Connect to investment platform (Alpaca, TD Ameritrade)
- [ ] Add real rewards API (Tremendous, Rybbon)
- [ ] Implement proper security rules
- [ ] Add comprehensive testing
- [ ] Set up CI/CD pipeline

## 🔒 Security Notes

**⚠️ Important**: Current Firestore rules are permissive for development. Before production:

1. Implement proper authentication-based security rules
2. Add input validation and sanitization
3. Set up monitoring and logging
4. Review all third-party integrations
5. Conduct security audit

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙋‍♂️ Support

For questions or support:
- Create an issue on GitHub
- Email: support@oink-app.com
- Documentation: [Wiki](https://github.com/ThomasCaneday/oink-mvp/wiki)

---

Made with 🩷 by the Oink team
