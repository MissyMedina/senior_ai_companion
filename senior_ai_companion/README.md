# FamilyConnect AI

A comprehensive multi-agent AI system that reconnects families across generations through elderly care coordination, featuring Grace (elderly companion) and Alex (family coordinator) agents with integrated voice interfaces, sleep scheduling, and digital picture frames.

## 🎯 Project Overview

FamilyConnect AI bridges the gap between elderly users and their families through intelligent AI agents that provide emotional support, coordinate care, and facilitate meaningful connections. The system includes:

- **Grace Agent**: Warm, patient AI companion designed for elderly users
- **Alex Agent**: Family coordinator focused on caregivers and planning
- **Voice Interface**: Browser-based speech recognition and synthesis
- **Care Coordination**: Automatic family notifications for medical appointments
- **Sleep Schedule**: Personalized bedtime routines with binaural beats
- **Digital Picture Frame**: Family photo sharing to connected devices

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Modern web browser with microphone access (for voice features)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd familyconnect-ai
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   # Create .env file in root directory
   echo "OPENAI_API_KEY=your_openai_api_key_here" > .env
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Access the application**
   - Open your browser to `http://localhost:5000`
   - Grace Interface: `http://localhost:5000/grace`
   - Alex Dashboard: `http://localhost:5000/alex`

## 🏗️ Architecture

### Frontend (React + TypeScript)
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for client-side routing
- **State Management**: TanStack Query for server state
- **UI Components**: Radix UI primitives with shadcn/ui
- **Styling**: Tailwind CSS with custom themes
- **Build Tool**: Vite for development and production

### Backend (Node.js + Express)
- **Runtime**: Node.js with Express.js server
- **Language**: TypeScript with ES modules
- **API**: RESTful endpoints with WebSocket support
- **Database**: In-memory storage (production-ready PostgreSQL schema included)
- **AI Integration**: OpenAI GPT-4 for natural language processing

### Key Features

#### 🤖 AI Agent System
- **Grace Agent**: Elderly companion with warm, patient personality
- **Alex Agent**: Family coordinator for caregivers and planning
- **Inter-Agent Communication**: Coordinated messaging between agents
- **Emotional State Tracking**: AI monitors and responds to emotional context
- **Memory Formation**: Conversations create lasting family memories

#### 🏥 Care Coordination
- **Medical Appointments**: Automatic family notifications
- **Assistance Coordination**: Transportation and support needs
- **Priority Levels**: Urgency classification (low, normal, high, emergency)
- **Care Provider Integration**: Facility details and provider information
- **Real-time Notifications**: Immediate family updates

#### 😴 Sleep Schedule & Brain Stimulation
- **Personalized Schedules**: Customizable bedtime with duration settings
- **Binaural Beats**: Real-time audio generation using Web Audio API
- **Brain Wave Frequencies**: Delta (4Hz), Theta (8Hz), Alpha (10Hz), Beta (14Hz), Gamma (40Hz)
- **Music Integration**: Nature sounds, classical, instrumental playlists
- **Sleep Goals**: Deep sleep, memory consolidation, relaxation
- **Volume Control**: Adjustable audio with real-time preview

#### 📸 Digital Picture Frame
- **Auto-Rotating Display**: Customizable timing (5-120 seconds per photo)
- **Smart Controls**: Play/pause, manual navigation, photo counter
- **Brightness Control**: Adjustable brightness for optimal viewing
- **Smooth Transitions**: Fade effects with caption overlays
- **Real-time Sync**: WebSocket notifications for instant updates
- **Family Engagement**: Easy photo sharing tools

## 📁 Project Structure

```
familyconnect-ai/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── hooks/          # Custom React hooks
│   │   ├── lib/            # Utility functions
│   │   ├── pages/          # Route components
│   │   └── App.tsx         # Main app component
│   └── index.html          # HTML template
├── server/                 # Express backend
│   ├── services/           # Business logic
│   ├── index.ts           # Server entry point
│   ├── routes.ts          # API routes
│   ├── storage.ts         # Data storage layer
│   └── vite.ts            # Vite integration
├── shared/                 # Shared types and schemas
│   └── schema.ts          # Database schema and types
├── components.json         # shadcn/ui configuration
├── package.json           # Dependencies and scripts
├── tailwind.config.ts     # Tailwind configuration
├── tsconfig.json          # TypeScript configuration
├── vite.config.ts         # Vite configuration
└── README.md              # This file
```

## 🔧 Configuration

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `OPENAI_API_KEY` | OpenAI API key for AI agents | Yes |
| `NODE_ENV` | Environment (development/production) | No |
| `PORT` | Server port (defaults to 5000) | No |

### Getting OpenAI API Key

1. Visit [OpenAI Platform](https://platform.openai.com/)
2. Create an account or sign in
3. Navigate to API Keys section
4. Generate a new API key
5. Add to your `.env` file

## 🎮 Usage Guide

### Grace Interface (Elderly Users)

1. **Voice Interaction**
   - Click microphone button to start voice conversation
   - Grace responds with warm, patient tone
   - Text-to-speech reads responses aloud

2. **Digital Picture Frame**
   - View rotating family photos
   - Control playback with play/pause buttons
   - Adjust brightness and display duration

3. **Sleep Schedule**
   - Set personalized bedtime routine
   - Choose from nature sounds, classical music
   - Select brain wave frequencies for sleep goals

4. **Care Notifications**
   - View upcoming medical appointments
   - See assistance coordination alerts
   - Family notifications for care events

### Alex Dashboard (Family Coordinators)

1. **Family Overview**
   - Monitor family wellbeing scores
   - View recent activity and communications
   - Track engagement metrics

2. **Photo Sharing**
   - Send photos to connected picture frames
   - Add captions and messages
   - View photo engagement stats

3. **Care Coordination**
   - Schedule medical appointments
   - Request family assistance
   - Set priority levels for notifications

4. **Agent Communications**
   - View inter-agent messages
   - Monitor AI conversation insights
   - Track family interaction patterns

## 🛠️ Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run type-check` - Run TypeScript checks

### Adding New Features

1. **Database Schema**: Update `shared/schema.ts` first
2. **Storage Layer**: Add methods to `server/storage.ts`
3. **API Routes**: Implement in `server/routes.ts`
4. **UI Components**: Create in `client/src/components/`
5. **Pages**: Add routes in `client/src/pages/`

### Testing

The application includes sample data for immediate testing:
- Pre-configured users (Grace: ID 1, Alex: ID 2)
- Sample family connections and memories
- Demo care notifications and reminders
- Test photos for picture frame functionality

## 🚀 Production Deployment

### Database Setup

For production, replace in-memory storage with PostgreSQL:

1. **Install PostgreSQL**
2. **Create database and tables** using schema in `shared/schema.ts`
3. **Update storage layer** to use database connection
4. **Set DATABASE_URL** environment variable

### Environment Configuration

```bash
# Production environment variables
NODE_ENV=production
OPENAI_API_KEY=your_production_key
DATABASE_URL=postgresql://username:password@host:port/database
PORT=3000
```

### Build and Deploy

```bash
# Build the application
npm run build

# Start production server
npm start
```

## 🔐 Security Considerations

- **API Keys**: Never commit API keys to version control
- **Environment Variables**: Use secure environment variable management
- **Data Validation**: All inputs are validated using Zod schemas
- **Rate Limiting**: Implement rate limiting for API endpoints
- **HTTPS**: Use HTTPS in production for secure communication

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For questions or issues:
1. Check the documentation in `replit.md`
2. Review the sample data in `server/storage.ts`
3. Test API endpoints using the provided curl examples
4. Verify WebSocket connections are working properly

## 🔄 Recent Updates

- **January 2025**: Complete multi-agent system implementation
- **Care Coordination**: Medical appointment management with family notifications
- **Sleep Schedule**: Binaural beats and personalized bedtime routines
- **Digital Picture Frame**: Family photo sharing with real-time sync
- **Voice Interface**: Browser-based speech recognition and synthesis
- **Real-time Features**: WebSocket communication for live updates

---

Built with ❤️ for connecting families across generations.