# Oink Micro‑Investing MVP

Rapidly validate the new Oink concept by letting users sign up, accumulate small "investments" in a pending balance, and execute a MoonPay purchase once the balance hits \$20. Earn points toward mock rewards for each executed investment.

## Table of Contents

* [Core Features](#core-features)
* [Tech Stack](#tech-stack)
* [Data Model](#data-model)
* [Setup & Installation](#setup--installation)
* [Authentication & Firestore](#authentication--firestore)
* [Pending Balance UI](#pending-balance-ui)
* [Invest Flow with MoonPay](#invest-flow-with-moonpay)
* [Rewards Display & Redemption](#rewards-display--redemption)
* [Deployment](#deployment)
* [Next MVP Enhancements](#next-mvp-enhancements)

---

## Core Features

1. **User Authentication**
   Email‑link (Magic) or Firebase Auth.
2. **Pending Balance Dashboard**
   – Displays `pendingBalance` (starts at \$0).
   – “Add Funds” form for contributions ≥ \$1.
3. **Threshold Detection**
   – When `pendingBalance ≥ $20`, enable “Invest Now.”
4. **Automated Purchase Flow**
   – Invest entire `pendingBalance` via MoonPay once threshold met.
   – On success: record transaction, calculate points, reset balance, increment points.
5. **Points & Rewards UI**
   – Show total `points`.
   – Static list of mock rewards with a redeem flow.

---

## Tech Stack

* **Frontend:** React (Create React App or Vite)
* **Hosting:** GitHub Pages (`ThomasCaneday.github.io/oink-mvp`)
* **Auth:** Magic Link SDK **or** Firebase Auth
* **Database:** Firebase Firestore
* **Serverless Logic:** Firebase Functions
* **Crypto On‑Ramp:** MoonPay Web Widget / SDK

---

## Data Model

```js
// users/{uid}
{
  email: string,
  pendingBalance: number,   // e.g. 12.50
  points: number,           // e.g. 0
  createdAt: timestamp
}

// users/{uid}/transactions/{txId}
{
  amountUSD: number,        // e.g. 20.00
  moonpayTxId: string,
  timestamp: timestamp
}
```

---

## Setup & Installation

1. **Initialize Project**

   ```bash
   npx create-react-app oink-mvp
   cd oink-mvp
   git init && git commit -m "Init MVP"
   ```
2. **Install Dependencies**

   ```bash
   npm install magic-sdk firebase moonpay-widget
   ```

---

## Authentication & Firestore

1. **Configure Firebase** in `src/firebase.js`.
2. **Enable Email‑Link Auth** in Firebase console.
3. **Firestore Security Rules**

   ```js
   match /users/{uid} {
     allow read, write: if request.auth.uid == uid;
     match /transactions/{tx} {
       allow create: if request.auth.uid == uid;
     }
   }
   ```
4. **Initialize User Document** on first sign‑in:

   ```js
   // pendingBalance: 0, points: 0
   ```

---

## Pending Balance UI

1. **Dashboard Component**

   * Fetch & display `pendingBalance` and `points`.
   * “Add Funds” form: `<input type="number" min="1" step="0.01" />`.
2. **Add Funds Handler**

   ```js
   const addFunds = async (amount) => {
     const userRef = db.collection('users').doc(user.uid);
     await userRef.update({
       pendingBalance: firebase.firestore.FieldValue.increment(amount)
     });
   };
   ```
3. **Enable Invest Button**

   ```jsx
   <button
     disabled={pendingBalance < 20}
     onClick={handleInvestNow}
   >
     Invest Now (${pendingBalance.toFixed(2)})
   </button>
   ```

---

## Invest Flow with MoonPay

1. **Trigger MoonPay Widget**

   ```jsx
   <MoonPayWidget
     apiKey={MOONPAY_API_KEY}
     walletAddress={userWallet}
     amount={pendingBalance}
     currencyCode="USD"
     onSuccess={processInvestment}
   />
   ```
2. **Process Investment**

   ```js
   const processInvestment = async (tx) => {
     const userRef = db.collection('users').doc(user.uid);
     const batch = db.batch();

     // Record transaction
     const txRef = userRef.collection('transactions').doc(tx.id);
     batch.set(txRef, {
       moonpayTxId: tx.id,
       amountUSD: pendingBalance,
       timestamp: firebase.firestore.FieldValue.serverTimestamp()
     });

     // Calculate points
     const earnedPoints = Math.floor(pendingBalance / 10);

     // Reset balance & increment points
     batch.update(userRef, {
       pendingBalance: 0,
       points: firebase.firestore.FieldValue.increment(earnedPoints)
     });

     await batch.commit();
   };
   ```

---

## Rewards Display & Redemption

```jsx
const mockRewards = [
  { id: 1, name: 'Starbucks $2.50 off', cost: 2 },
  { id: 2, name: 'Amazon $5 off',     cost: 5 },
  // …
];
```

**Redeem Logic (Client‑Side Mock):**

```js
const redeemReward = async (reward) => {
  if (points < reward.cost) return;
  await db.collection('users').doc(user.uid).update({
    points: firebase.firestore.FieldValue.increment(-reward.cost)
  });
  alert(`Redeemed: ${reward.name}!`);
};
```

---

## Deployment

1. Add to `package.json`:

   ```json
   "homepage": "https://ThomasCaneday.github.io/oink-mvp"
   ```
2. Install & configure `gh-pages`:

   ```bash
   npm install --save-dev gh-pages
   ```

   ```json
   "scripts": {
     "predeploy": "npm run build",
     "deploy":   "gh-pages -d build"
   }
   ```
3. Deploy:

   ```bash
   npm run deploy
   ```

---

## Next MVP Enhancements

* **Automated Round‑Ups:** Integrate Plaid to capture spare change.
* **Batch Remainder Logic:** Carry over any excess beyond \$20.
* **Alternative On‑Ramp:** Add Ramp or Transak for sub‑\$20 buys.
* **Email Notifications:** Notify users when investments execute.
