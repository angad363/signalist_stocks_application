<!-- PROJECT BANNER -->
<p align="center">
  <img src="public/assets/images/logo.png" alt="Signalist Banner" width="100%" />
</p>

<h1 align="center">📈 Signalist — Real-Time Stock Tracker Application</h1>

<p align="center">
  <strong>Track live stock prices, AI-powered insights, personalized alerts, and interactive charts — built with Next.js, Better Auth, and Inngest.</strong>
</p>

<p align="center">
  <!-- Badges -->
  <a href="https://nextjs.org/"><img src="https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=next.js&logoColor=white" alt="Next.js Badge" /></a>
  <a href="https://www.typescriptlang.org/"><img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript Badge" /></a>
  <a href="https://better-auth.com/"><img src="https://img.shields.io/badge/Better_Auth-7C3AED?style=for-the-badge&logo=auth0&logoColor=white" alt="Better Auth Badge" /></a>
  <a href="https://www.inngest.com/"><img src="https://img.shields.io/badge/Inngest-0A7FFF?style=for-the-badge&logo=workflow&logoColor=white" alt="Inngest Badge" /></a>
  <a href="LICENSE"><img src="https://img.shields.io/badge/License-MIT-green?style=for-the-badge" alt="MIT License Badge" /></a>
</p>

## 🚀 Overview

**Signalist** is a powerful real-time stock tracking application built for investors, traders, and market enthusiasts. It delivers **live stock prices**, **AI-driven insights**, **personalized alerts**, and **interactive charts**, all wrapped in a sleek, modern UI powered by **Next.js**, **Better Auth**, and **Inngest** for automation.

---

## 🚀 Features

### 🔐 Authentication & Authorization
- **Seamless login and registration** flow powered by [Better Auth](https://better-auth.com).
- Secure and scalable authentication layer for managing user sessions and protected routes.

### 📊 Live Stock Data & Interactive Widgets
- Integrated with **TradingView APIs** to display:
  - Real-time **price charts**
  - **Heatmaps**
  - **Market news**
  - **Watchlists** and performance summaries
- Interactive and responsive trading components for an engaging user experience.

### 🔍 Stock Search
- Quickly **search any stock** listed in major markets.
- Fast, accurate, and responsive results with key stock data summaries.

### ⭐ Watchlist Management
- **Add and track** your favorite stocks.
- Stay updated on **real-time price changes** for your selected symbols.

### 🧠 AI-Powered Insights
- Each stock’s profile page includes **AI-driven analysis** and recommendations.
- **Multiple chart types** (candlestick, line, bar) for in-depth visual insights.

### 📰 Daily AI News Summary
- Receive a **daily news digest**, summarized by AI and delivered automatically.
- **Inngest** workflows handle automation for seamless background tasks.

---

## 🏗️ Tech Stack

| Technology | Purpose |
|-------------|----------|
| **Next.js** | Frontend framework for server-rendered React apps |
| **Better Auth** | Authentication and authorization layer |
| **Inngest** | Event-driven background automation |
| **TradingView API** | Real-time financial data and charts |
| **TypeScript** | Strongly typed codebase for scalability |
| **Coderabbit.ai** | Automated PR reviews and code quality checks |

---

## ⚙️ Production-Ready Development Practices

- ✅ **Clean Git Repository Structure**
- 🌿 **Feature-based branching**
- 🔄 **Pull Request workflow** for every new feature
- 🤖 **Automated code reviews** powered by [Coderabbit.ai](https://www.coderabbit.ai)
- 🧩 **Consistent commit messages** and CI/CD readiness

---

## 📸 Screenshots

<img width="1666" height="912" alt="1" src="https://github.com/user-attachments/assets/8d4b9b06-51ea-4a69-ba29-e6c03ec8d0e3" />
<img width="1578" height="901" alt="2" src="https://github.com/user-attachments/assets/28665982-045b-445a-b83c-eaa2a0931b73" />
<img width="1593" height="898" alt="3" src="https://github.com/user-attachments/assets/b7ad6cdd-545b-4e22-bdd5-8bb386de29a9" />
<img width="1129" height="904" alt="4" src="https://github.com/user-attachments/assets/2b56d3f6-27bd-4712-8d1e-83e0a2f5c23d" />

---

## 🧠 Environment Variables

Create a `.env.local` file in your project root and include the following keys:

```bash
MONGODB_URI=your_mongodb_connection_string
BETTER_AUTH_SECRET=your_better_auth_secret
BETTER_AUTH_URL=https://your-app-url.com
GEMINI_API_KEY=your_gemini_api_key
NODEMAILER_EMAIL=your_email@example.com
NODEMAILER_PASSWORD=your_email_password
NEXT_PUBLIC_FINNHUB_API_KEY=your_finnhub_api_key
```
## 🧩 Installation & Setup

Follow these steps to get started locally:

```bash
# Clone the repository
git clone https://github.com/angad363/signalist_stocks_application.git
cd signalist_stocks_application

# Install dependencies
npm install

# Add environment variables
cp .env.example .env.local
# Fill in your API keys, Better Auth credentials, etc.

# Run the development server
npm run dev
```
