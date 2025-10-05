# Portfolio - Modern Full Stack Developer Portfolio

A modern, production-ready portfolio website built with Next.js 15.5.3, featuring glass morphism design, 3D animations with Three.js, and a comprehensive admin dashboard powered by Firebase.

## ✨ Features

### Public Portfolio
- 🎨 **Glass Morphism Design** - Modern UI with transparent cards and backdrop blur
- 🌓 **Dark/Light/System Theme** - Full theme support with smooth transitions
- 🎭 **3D Animations** - Interactive Three.js background with performance optimization
- 📱 **Fully Responsive** - Mobile-first design that works on all devices
- ♿ **Accessible** - WCAG compliant with keyboard navigation support
- 📧 **Contact Form** - Spam-protected form with email notifications and reCAPTCHA
- 📄 **Resume Management** - PDF resume viewer with download tracking

### Admin Dashboard
- 🔐 **Firebase Authentication** - Secure admin access with email/password
- 📊 **Real-time Dashboard** - Live stats from Firestore
- 🎯 **Project Management** - Full CRUD with image upload to Firebase Storage
- 💼 **Experience Management** - Timeline management with rich content
- 🛠️ **Skills Management** - Category-based skill organization
- 💬 **Message Management** - Contact form submissions with status tracking
- 📄 **Resume Management** - PDF upload with version control

### Security & Performance
- 🛡️ **Rate Limiting** - IP-based protection (3 submissions/15min on contact form)
- 🤖 **reCAPTCHA v3** - Invisible bot protection with server-side verification
- 🍯 **Honeypot Fields** - Additional spam protection
- 📧 **Email Notifications** - Admin alerts and user confirmations
- ⚡ **Optimized Performance** - Code splitting and lazy loading
- 🎯 **TypeScript** - Full type safety with strict mode

## 🚀 Tech Stack

- **Framework**: Next.js 15.5.3 (App Router, Turbopack)
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 4
- **3D Graphics**: Three.js, React Three Fiber, Drei
- **Animations**: Framer Motion
- **Backend**: Firebase (Auth, Firestore, Storage, Hosting)
- **Forms**: React Hook Form + Yup validation
- **Email**: Nodemailer (SMTP)
- **Security**: Google reCAPTCHA v3

## 📋 Prerequisites

- Node.js 18+ and npm
- Firebase project (free tier works)
- Gmail account (or other SMTP provider) for email notifications
- Google reCAPTCHA v3 keys

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd portfolio
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**

   Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

4. **Set up Firebase** (see [Firebase Setup Guide](./documentation/firebase-setup-guide.md))
   - Create Firebase project
   - Enable Authentication, Firestore, and Storage
   - Add your Firebase config to `.env.local`
   - Deploy security rules

5. **Configure Email** (see [Contact Form Setup Guide](./documentation/contact-form-setup-guide.md))
   - Set up SMTP credentials (Gmail, SendGrid, or Mailgun)
   - Add email configuration to `.env.local`

6. **Configure reCAPTCHA** (optional but recommended)
   - Get keys from [Google reCAPTCHA](https://www.google.com/recaptcha/admin)
   - Add site key and secret to `.env.local`

## 🏃 Running Locally

```bash
# Development mode with Turbopack
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Type checking
npm run typecheck

# Linting
npm run lint
```

Open [http://localhost:3000](http://localhost:3000) to view the portfolio.

## 📁 Project Structure

```
portfolio/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── (public)/          # Public pages
│   │   ├── admin/             # Admin dashboard
│   │   ├── api/               # API routes
│   │   └── contact/           # Contact pages
│   ├── components/
│   │   ├── admin/             # Admin components
│   │   ├── layout/            # Layout components (Navbar, Footer)
│   │   ├── providers/         # Context providers
│   │   ├── sections/          # Page sections (Hero, About, etc.)
│   │   ├── three/             # Three.js 3D components
│   │   └── ui/                # Reusable UI components
│   ├── context/               # React contexts (Auth, Theme)
│   ├── hooks/                 # Custom React hooks
│   ├── lib/                   # Utilities and services
│   │   ├── firebase/          # Firebase configuration
│   │   ├── services/          # Database services
│   │   └── three/             # Three.js utilities
│   └── types/                 # TypeScript type definitions
├── documentation/             # Project documentation
└── public/                    # Static assets
```

## 🔐 Admin Access

1. **Create Admin User**
   ```bash
   # In Firebase Console > Authentication
   # Add user with email/password
   # Copy the user UID
   ```

2. **Configure Admin UID**
   ```bash
   # Add to .env.local
   NEXT_PUBLIC_ADMIN_UID=your_user_uid_here
   ```

3. **Access Admin Dashboard**
   ```
   Navigate to: http://localhost:3000/admin/login
   ```

## 📧 Contact Form Setup

The contact form includes:
- ✅ Email notifications (admin + user confirmation)
- ✅ Rate limiting (3 submissions per 15 minutes)
- ✅ reCAPTCHA v3 verification
- ✅ Honeypot spam protection
- ✅ Form validation with Yup

See [Contact Form Setup Guide](./documentation/contact-form-setup-guide.md) for detailed configuration.

## 🎨 Theme Customization

The portfolio supports three theme modes:
- 🌙 **Dark Mode** - Default dark theme
- ☀️ **Light Mode** - Light theme variant
- 🔄 **System Mode** - Follows OS preference

Theme persists across sessions and applies to all components including Three.js scenes.

## 📚 Documentation

- [Development Roadmap](./documentation/roadmap.md) - Project phases and progress
- [Firebase Setup Guide](./documentation/firebase-setup-guide.md) - Firebase configuration
- [Contact Form Setup](./documentation/contact-form-setup-guide.md) - Email and reCAPTCHA setup
- [Phase 7.2 Summary](./documentation/phase-7.2-contact-form-integration.md) - Contact form implementation
- [CLAUDE.md](./CLAUDE.md) - Project architecture and guidelines

## 🚢 Deployment

### Firebase Hosting (Recommended)

1. **Install Firebase CLI**
   ```bash
   npm install -g firebase-tools
   ```

2. **Login to Firebase**
   ```bash
   firebase login
   ```

3. **Initialize Firebase Hosting**
   ```bash
   firebase init hosting
   ```

4. **Build and Deploy**
   ```bash
   npm run build
   firebase deploy
   ```

### Vercel (Alternative)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

See [deployment documentation](./documentation/roadmap.md#phase-8-polish--deployment-week-8) for detailed instructions.

## 🧪 Testing

```bash
# Type checking
npm run typecheck

# Linting
npm run lint

# Build verification
npm run build
```

## 📈 Performance

- ⚡ Lighthouse Score: 90+ (target)
- 🎯 First Contentful Paint: < 1.5s
- 🚀 Time to Interactive: < 3.5s
- 📦 Initial Bundle: < 500KB
- 🎮 3D Performance: 60fps desktop, 30fps mobile

## 🔒 Security Features

- Rate limiting on contact form (IP-based)
- reCAPTCHA v3 bot protection
- Honeypot fields for spam prevention
- Firebase security rules
- Environment variable protection
- Input validation (client + server)
- TypeScript type safety

## 🤝 Contributing

This is a personal portfolio project, but suggestions and feedback are welcome!

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- Firebase for backend infrastructure
- Three.js for 3D graphics capabilities
- Framer Motion for smooth animations
- Tailwind CSS for utility-first styling

## 📞 Support

For issues and questions:
- Check [documentation](./documentation/)
- Review [Firebase setup guide](./documentation/firebase-setup-guide.md)
- See [contact form setup](./documentation/contact-form-setup-guide.md)

---

Built with ❤️ using Next.js, TypeScript, and Firebase
