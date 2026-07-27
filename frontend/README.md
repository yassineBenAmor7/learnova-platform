# Learnova - Intelligent E-Learning Platform

Learnova is a modern, intelligent e-learning platform designed to provide structured online education with advanced features including course management, progress tracking, gamification, and AI-powered learning experiences.

## 🚀 Features

### Core Functionality
- **User Management**: Registration, authentication, and role-based access control
- **Course Management**: Browse, enroll, and track progress across multiple courses
- **Learning Path**: Structured sessions with videos and text content
- **Quiz & Assessment**: Interactive quizzes with automatic scoring and feedback
- **Certification**: Automatic certificate generation with QR code verification
- **Exam Mode**: Timed, full-screen examination mode for formal assessments

### Advanced Features
- **Dashboard**: Comprehensive user dashboard with statistics and progress tracking
- **Gamification**: Points, badges, levels, and streak system to enhance engagement
- **Admin Panel**: Complete administrative interface for platform management
- **Profile Management**: Enhanced user profile with statistics and settings
- **Support Pages**: Help Center, Contact, FAQ, and Terms of Service

### Technical Features
- **Responsive Design**: Mobile-first approach for optimal user experience
- **Performance Optimized**: Lazy loading and code splitting for faster load times
- **SEO Friendly**: Meta tags and semantic HTML for better search visibility
- **Accessibility**: WCAG compliant design patterns
- **Modern UI**: Professional design with glassmorphism and smooth animations

## 🛠️ Tech Stack

- **Frontend**: React.js with Vite
- **Backend**: NestJS
- **Database**: PostgreSQL with Prisma ORM
- **Styling**: CSS with custom design system
- **Icons**: Lucide React
- **Routing**: React Router v6
- **State Management**: React Context API

## 📁 Project Structure

```
frontend/
├── public/              # Static assets
├── src/
│   ├── components/      # Reusable UI components
│   │   ├── Navbar/     # Navigation bar
│   │   ├── Footer/     # Footer component
│   │   ├── Sidebar/    # Learning path sidebar
│   │   ├── ProgressBar/# Progress indicator
│   │   ├── Badge/      # Gamification badges
│   │   └── Level/      # User level display
│   ├── pages/          # Page components
│   │   ├── Home/       # Landing page
│   │   ├── Login/      # Authentication
│   │   ├── Register/   # User registration
│   │   ├── Dashboard/  # User dashboard
│   │   ├── Courses/    # Course listing
│   │   ├── CourseDetails/# Course information
│   │   ├── LearningPath/# Course sessions
│   │   ├── Quiz/       # Quiz interface
│   │   ├── Exam/       # Exam mode
│   │   ├── Certificates/# Certificate management
│   │   ├── Profile/    # User profile
│   │   ├── Admin/      # Admin dashboard
│   │   ├── Help/       # Help center
│   │   ├── Contact/    # Contact form
│   │   ├── FAQ/        # Frequently asked questions
│   │   └── Terms/      # Terms of service
│   ├── services/       # API service layer
│   ├── context/        # React context providers
│   ├── routes/         # Route configuration
│   ├── App.jsx         # Main application component
│   └── main.jsx        # Application entry point
├── index.html          # HTML template
├── package.json        # Dependencies
└── vite.config.js      # Vite configuration
```

## 🚦 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- PostgreSQL database
- Backend API running

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yassineBenAmor7/learnova-platform.git
cd learnova-platform/frontend
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:
```bash
cp .env.example .env
# Edit .env with your configuration
```

4. Start the development server:
```bash
npm run dev
```

5. Build for production:
```bash
npm run build
```

6. Preview production build:
```bash
npm run preview
```

## 🎨 Design System

### Color Palette
- **Primary Blue**: Corporate professional blue (#1e40af)
- **Secondary Blue**: Lighter blue for accents (#3b82f6)
- **Success Green**: For positive feedback (#16a34a)
- **Danger Red**: For errors and warnings (#dc2626)
- **Warning Yellow**: For alerts (#f59e0b)

### Typography
- **Headings**: Modern sans-serif font family
- **Body**: Clean, readable font for content
- **Monospace**: For code and technical content

### Components
- **Cards**: Glassmorphism effect with subtle shadows
- **Buttons**: Gradient backgrounds with hover effects
- **Forms**: Clean inputs with focus states
- **Navigation**: Responsive with mobile menu

## 📱 Responsive Breakpoints

- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

## 🔐 Authentication

The application uses JWT-based authentication with role-based access control:
- **Learner**: Access to courses, quizzes, and personal dashboard
- **Admin**: Full platform management capabilities

## 🎯 Key Features Implementation

### Learning Path
- Progressive session unlocking
- Video and text content support
- Progress tracking
- Session completion validation

### Gamification
- Points system for activities
- Badge achievements
- Level progression
- Streak tracking for consistency

### Certification
- Automatic certificate generation
- Unique certificate IDs
- QR code verification
- Downloadable PDF format

### Admin Dashboard
- User management
- Course administration
- Quiz oversight
- Certificate verification
- Platform statistics

## 🧪 Testing

```bash
# Run unit tests
npm test

# Run with coverage
npm test -- --coverage

# Run E2E tests
npm run test:e2e
```

## 📊 Performance

- **Lazy Loading**: Code splitting for optimal load times
- **Image Optimization**: Responsive images with WebP support
- **Bundle Size**: Optimized production builds
- **Caching**: Strategic caching for static assets

## 🔒 Security

- **HTTPS**: Secure data transmission
- **Input Validation**: Client and server-side validation
- **XSS Protection**: Content security policies
- **CSRF Protection**: Token-based request validation

## 🌐 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## 📝 License

This project is licensed under the MIT License.

## 👥 Team

- **Developer**: Ben Amor Yassine
- **Supervisor**: M. Achraf Makhloufi
- **Organization**: ISSAT Sousse
- **Company**: Vaerdia

## 🙏 Acknowledgments

- React.js community
- Vite build tool
- Lucide icons
- NestJS framework
- Prisma ORM

---

**Note**: This is the frontend application. For the complete Learnova platform, please also set up the backend API and PostgreSQL database.
