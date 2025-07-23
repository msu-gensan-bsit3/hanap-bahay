# 🏠 Hanap Bahay - AI-Powered Real Estate Platform

[![Svelte](https://img.shields.io/badge/svelte-%23f1413d.svg?style=for-the-badge&logo=svelte&logoColor=white)](https://svelte.dev/)
[![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![PostgreSQL](https://img.shields.io/badge/postgresql-%23316192.svg?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)

**Hanap Bahay** (Filipino for "House Hunting") is a comprehensive AI-powered real estate platform that addresses three critical aspects of the real estate industry: property discovery, transaction automation, and intelligent market insights.

## 🚀 Hackathon Challenge Solutions

This project tackles all three problem sets:

### 1. 🌐 Well-Known Real Estate Website

- **Modern Property Listings**: Advanced search and filtering capabilities
- **Interactive Property Maps**: Location-based property discovery
- **User Authentication**: Secure buyer/seller/agent accounts
- **Property Management**: Upload, edit, and manage property listings
- **Responsive Design**: Mobile-first approach with TailwindCSS

### 2. 🤖 Transaction Automation for Agents/Brokers/Developers

- **Document Generation**: Automated contract and agreement creation
- **Pipeline Management**: Track leads, viewings, and deals
- **Client Communication**: Automated email sequences and reminders
- **Financial Calculations**: Mortgage, commission, and tax calculators
- **Compliance Tracking**: Regulatory requirement automation

### 3. 🧠 AI-Based Real Estate Intelligence

- **Smart Property Valuation**: ML-powered price predictions
- **Market Trend Analysis**: AI-driven market insights and forecasts
- **Recommendation Engine**: Personalized property suggestions
- **Natural Language Search**: "Find me a 3-bedroom house near schools"
- **Virtual Assistant**: AI chatbot for property inquiries

## ✨ Key Features

### For Property Seekers

- 🔍 **Advanced Search**: Filter by price, location, amenities, and more
- 📱 **Mobile App**: Progressive Web App for on-the-go browsing
- 💬 **AI Assistant**: Natural language property search and recommendations
- 📊 **Market Insights**: Price trends and neighborhood analytics
- 💰 **Financial Tools**: Mortgage calculators and affordability assessments

### For Real Estate Professionals

- 📋 **CRM Integration**: Comprehensive client relationship management
- 📄 **Document Automation**: Auto-generate contracts and legal documents
- 📈 **Analytics Dashboard**: Performance metrics and market analysis
- 🔄 **Workflow Automation**: Streamlined transaction processes
- 📧 **Communication Hub**: Automated client follow-ups and notifications

### For Developers & Investors

- 📊 **Market Analysis**: Investment opportunity identification
- 🏗️ **Project Management**: Development pipeline tracking
- 💹 **ROI Calculators**: Investment return projections
- 📍 **Location Intelligence**: Demographic and development data

## 🛠️ Tech Stack

### Frontend

- **SvelteKit 5**: Modern web framework with server-side rendering
- **TypeScript**: Type-safe development
- **TailwindCSS 4**: Utility-first CSS framework
- **Vite**: Lightning-fast build tool

### Backend

- **Node.js**: Server runtime
- **PostgreSQL**: Robust relational database
- **Drizzle ORM**: Type-safe database interactions
- **Lucia Auth**: Secure authentication system

### AI & ML

- **OpenAI GPT**: Natural language processing
- **TensorFlow.js**: Client-side machine learning
- **Mapbox API**: Interactive maps and geocoding
- **Real Estate APIs**: MLS data integration

### DevOps & Tools

- **pnpm**: Fast package manager
- **ESLint**: Code linting
- **Prettier**: Code formatting
- **Vitest**: Unit testing
- **Playwright**: End-to-end testing

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- PostgreSQL 14+
- pnpm (recommended) or npm

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/msu-gensan-bsit3/hanap-bahay.git
   cd hanap-bahay
   ```

2. **Install dependencies**

   ```bash
   pnpm install
   ```

3. **Set up environment variables**

   ```bash
   cp .env.example .env
   # Edit .env with your database and API credentials
   ```

4. **Set up the database**

   ```bash
   pnpm db:push
   ```

5. **Start the development server**

   ```bash
   pnpm dev
   ```

6. **Open your browser**
   Navigate to `http://localhost:5173`

## 📦 Available Scripts

```bash
# Development
pnpm dev                 # Start development server
pnpm dev -- --open      # Start dev server and open browser

# Building
pnpm build              # Build for production
pnpm preview            # Preview production build

# Database
pnpm db:push            # Push schema changes to database
pnpm db:migrate         # Run database migrations
pnpm db:studio          # Open Drizzle Studio

# Code Quality
pnpm lint               # Lint code
pnpm format             # Format code
pnpm check              # Type checking

# Testing
pnpm test               # Run unit tests
pnpm test:unit          # Run unit tests in watch mode
```

## 🏗️ Project Structure

```
src/
├── lib/
│   ├── components/     # Reusable Svelte components
│   ├── server/
│   │   ├── auth.ts    # Authentication logic
│   │   └── db/        # Database schema and connections
│   └── utils/         # Utility functions
├── routes/            # SvelteKit pages and API routes
│   ├── +layout.svelte # Root layout
│   ├── +page.svelte   # Homepage
│   ├── properties/    # Property listing pages
│   ├── dashboard/     # Agent/broker dashboard
│   └── api/          # API endpoints
└── app.html          # HTML template
```

## 🎯 Hackathon Implementation Roadmap

### Phase 1: Core Platform (Day 1-2)

- [x] Project setup and authentication
- [ ] Property listing CRUD operations
- [ ] Basic search and filtering
- [ ] User dashboard

### Phase 2: Automation Features (Day 2-3)

- [ ] Document generation system
- [ ] Transaction pipeline management
- [ ] Automated communication workflows
- [ ] Financial calculators

### Phase 3: AI Integration (Day 3-4)

- [ ] Property valuation ML model
- [ ] Natural language search
- [ ] Recommendation engine
- [ ] AI chatbot integration

### Phase 4: Polish & Demo (Day 4-5)

- [ ] UI/UX improvements
- [ ] Performance optimization
- [ ] Demo preparation
- [ ] Documentation completion

## 🤝 Contributing

This is a hackathon project, but contributions and suggestions are welcome!

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🏆 Team

- **Team Name**: MSU GenSan BSIT3
- **Project**: Hanap Bahay - AI-Powered Real Estate Platform
- **Hackathon**: [Hackathon Name] 2025

## 📞 Support

For questions or support during the hackathon:

- Create an issue in this repository
- Contact the team through hackathon communication channels

---

Built with ❤️ using SvelteKit and modern web technologies
