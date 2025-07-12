# FamilyConnect AI

## Overview

FamilyConnect AI is a full-stack web application that connects elderly users with their family members through AI-powered agents. The system features two distinct AI personalities - Grace (elderly companion) and Alex (family coordinator) - that facilitate meaningful conversations, manage family connections, provide emotional support, and coordinate care activities with family notifications.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for client-side routing
- **State Management**: TanStack Query for server state management
- **UI Components**: Radix UI primitives with shadcn/ui design system
- **Styling**: Tailwind CSS with CSS custom properties for theming
- **Build Tool**: Vite for development and production builds

### Backend Architecture
- **Runtime**: Node.js with Express.js server
- **Language**: TypeScript with ES modules
- **API Pattern**: RESTful APIs with WebSocket support for real-time communication
- **Database**: PostgreSQL with Drizzle ORM
- **AI Integration**: OpenAI API for natural language processing

### Key Components

#### AI Agent System
- **Grace Agent**: Elderly companion with warm, patient personality designed for senior users
- **Alex Agent**: Family coordinator focused on caregivers and family management
- **Agent Communication**: Inter-agent messaging system for coordinated care
- **Voice Interface**: Speech recognition and text-to-speech capabilities

#### Database Schema
- **Users**: Family members with roles (elderly/caregiver) and preferences
- **Conversations**: Chat history with emotional state tracking
- **Family Connections**: Relationship mapping between family members
- **Memories**: Shared family stories and milestones
- **Reminders**: Task management and gentle prompts with care coordination
- **Care Notifications**: Medical appointments and care events with family notifications
- **Agent Communications**: Inter-agent messaging logs

#### Real-time Features
- **WebSocket Server**: Real-time communication for live chat
- **Voice Processing**: Browser-based speech recognition and synthesis
- **Live Updates**: Real-time family status and agent communications

## Data Flow

1. **User Authentication**: Users access agent interfaces based on their role
2. **Agent Selection**: System routes to appropriate AI personality (Grace/Alex)
3. **Conversation Processing**: 
   - User input → AI agent → OpenAI API → Personalized response
   - Emotional state tracking and memory formation
   - Inter-agent communication when needed
4. **Data Persistence**: All interactions stored in PostgreSQL via Drizzle ORM
5. **Real-time Updates**: WebSocket broadcasts for live family status updates

## External Dependencies

### AI Services
- **OpenAI API**: GPT-4 for natural language processing and conversation generation
- **Speech APIs**: Browser-native Web Speech API for voice interactions

### Database
- **Neon Database**: Serverless PostgreSQL hosting
- **Drizzle ORM**: Type-safe database operations with schema migrations

### UI/UX Libraries
- **Radix UI**: Accessible component primitives
- **Tailwind CSS**: Utility-first styling framework
- **Lucide React**: Icon library for consistent UI elements

### Development Tools
- **Vite**: Fast development server and build tool
- **TypeScript**: Type safety across the full stack
- **ESBuild**: Fast JavaScript bundling for production

## Deployment Strategy

### Development Environment
- **Local Development**: Vite dev server with Express backend
- **Hot Reload**: Vite HMR for frontend, tsx for backend file watching
- **Database**: Development database with schema migrations via Drizzle Kit

### Production Build
- **Frontend**: Vite builds React app to static files
- **Backend**: ESBuild bundles Express server for Node.js deployment
- **Database**: PostgreSQL with connection pooling and environment-based configuration

### Environment Configuration
- **Database**: `DATABASE_URL` environment variable for PostgreSQL connection
- **AI Services**: `OPENAI_API_KEY` for OpenAI API access
- **Build Scripts**: Separate dev/build/start scripts for different environments

The application uses a monorepo structure with shared schemas and utilities, enabling type-safe communication between frontend and backend while maintaining clear separation of concerns.

## Recent Changes

### Bug Fixes and Error Handling (January 2025)
Successfully resolved critical stability issues and improved error handling:

#### System Stability Improvements ✅
- **Fixed Digital Picture Frame API Calls**: Resolved excessive API calls by removing mutation from useEffect dependency array
- **Database Query Fix**: Fixed PostgreSQL syntax error in conversations queries by correcting column references  
- **WebSocket Error Handling**: Added proper connection state checks and error handling for WebSocket communications
- **Voice Service Improvements**: Enhanced error handling for speech recognition and synthesis with proper logging
- **Global Error Handlers**: Added unhandled promise rejection handlers to prevent console errors
- **Server Error Management**: Improved Express error handling to prevent re-throwing after responses sent

#### OpenAI Integration Status ✅
- **API Key Configuration**: Successfully configured OpenAI API key environment variable
- **Quota Management**: OpenAI API key has reached rate limits, system automatically falls back to local AI simulation
- **Local AI Fallback**: Local AI simulation working correctly when OpenAI API unavailable
- **Agent Communication**: Both Grace and Alex agents responding properly with appropriate personalities

### PostgreSQL Database Migration (January 2025)
Successfully migrated from in-memory storage to PostgreSQL for full data persistence:

#### Database Implementation ✅
- **PostgreSQL Integration**: Full database configuration with Neon serverless PostgreSQL
- **Schema Migration**: Complete database schema using Drizzle ORM with all tables created
- **Data Persistence**: All user data, conversations, family connections, and media now persisted
- **Sample Data**: Comprehensive sample data for immediate testing and demonstration
- **API Compatibility**: All existing APIs updated to work with PostgreSQL storage
- **Error Handling**: Proper error handling and data validation for database operations

#### Database Tables ✅
- **Users**: Family members with roles and preferences
- **Conversations**: AI agent chat history with emotional state tracking
- **Family Connections**: Relationship mapping between elderly and caregiver users
- **Memories**: Shared family stories and milestones
- **Reminders**: Task management and gentle prompts
- **Care Notifications**: Medical appointments and care events with family notifications
- **Agent Communications**: Inter-agent messaging logs
- **Sleep Schedules**: Binaural beats and music preferences
- **Picture Frames**: Digital photo display configuration
- **Family Photos**: Photo sharing with captions and metadata

#### Technical Implementation ✅
- **Database Storage Class**: Complete DatabaseStorage implementation adhering to IStorage interface
- **Query Optimization**: Efficient database queries using Drizzle ORM with proper indexing
- **Data Initialization**: Automatic sample data creation for new databases
- **Connection Management**: Proper database connection pooling and error handling
- **Migration System**: Drizzle Kit for schema migrations and updates

### Complete System Implementation (January 2025)
FamilyConnect AI is now a fully functional multi-agent system with comprehensive elderly care features:

### Core AI Agent System ✅
- **Grace Agent**: Elderly companion with warm, patient personality for senior users
- **Alex Agent**: Family coordinator focused on caregivers and family management
- **Inter-Agent Communication**: Coordinated messaging system between agents
- **Voice Interface**: Speech recognition and text-to-speech capabilities
- **Emotional State Tracking**: AI monitors and responds to emotional context
- **Memory Formation**: Conversations create lasting family memories

### Care Coordination System ✅
- **Medical Appointment Management**: Automatic family notifications for care events
- **Assistance Coordination**: System recognizes when family help is needed
- **Real-time Notifications**: Immediate updates to family members about care needs
- **Priority Levels**: Urgency classification (low, normal, high, emergency)
- **Care Provider Integration**: Support for facility details and provider information
- **Transportation Coordination**: Automatic detection of transportation needs
- **Demonstration Interface**: Full demo functionality in Alex dashboard

### Sleep Schedule & Brain Stimulation System ✅
- **Personalized Sleep Schedules**: Customizable bedtime with duration settings
- **Binaural Beats Generator**: Real-time audio generation using Web Audio API
- **Brain Wave Frequencies**: Delta (4Hz), Theta (8Hz), Alpha (10Hz), Beta (14Hz), Gamma (40Hz)
- **Familiar Music Integration**: Nature sounds, classical, instrumental, and custom playlists
- **Sleep Goals**: Deep sleep, memory consolidation, and relaxation targeting
- **Volume Control**: Adjustable volume with real-time audio preview
- **Headphone Optimization**: Designed for optimal binaural beat experience
- **Grace Integration**: Easy access sleep schedule interface for elderly users

### Digital Picture Frame System ✅
- **Auto-Rotating Photo Display**: Customizable timing (5-120 seconds per photo)
- **Smart Controls**: Play/pause, manual navigation, and photo counter
- **Brightness Control**: Adjustable brightness slider for optimal viewing
- **Smooth Transitions**: Fade effects between photos with caption overlays
- **Photo Metadata Tracking**: View status and sender information
- **Real-time Sync**: WebSocket notifications for instant photo updates
- **Family Engagement**: Sample photos and easy sharing tools
- **Grace Integration**: Digital picture frame display in elderly interface
- **Alex Integration**: Photo sharing controls in family coordinator dashboard

### Database & API Architecture ✅
- **Complete Schema**: Users, conversations, family connections, memories, reminders
- **Care Notifications**: Medical appointments and assistance tracking
- **Sleep Schedules**: Music preferences and binaural beat configurations
- **Picture Frames**: Device management and photo rotation settings
- **Family Photos**: Caption support, view tracking, and metadata
- **RESTful APIs**: Full CRUD operations for all data entities
- **WebSocket Support**: Real-time updates for live communication
- **In-Memory Storage**: Fast, robust storage solution for development

### User Interface & Experience ✅
- **Grace Interface**: Elderly-friendly design with large controls and warm colors
- **Alex Dashboard**: Family coordinator with analytics and management tools
- **Voice Interface**: Browser-based speech recognition and synthesis
- **Responsive Design**: Mobile and desktop optimized layouts
- **Real-time Updates**: Live family status and agent communications
- **Sample Data**: Pre-populated examples for immediate testing
- **Accessibility**: High contrast, large text, and intuitive navigation

### Voice Interface System ✅
- **Browser-Based Speech Recognition**: Web Speech API for voice input
- **Text-to-Speech Synthesis**: Natural voice responses from AI agents
- **Agent-Specific Voice Profiles**: Grace uses warm, patient tone; Alex uses professional tone
- **Voice Command Processing**: Natural language understanding for care coordination
- **Real-time Voice Feedback**: Visual animations and waveform displays during listening
- **Local AI Simulation**: Fallback AI responses when OpenAI API not available
- **Voice Activity Detection**: Smart listening states with pulse animations
- **Accessibility Features**: Voice interface works alongside traditional text input
- **Voice Command Examples**: Context-aware suggestions for both Grace and Alex

### Technical Implementation ✅
- **Full-Stack TypeScript**: Type-safe development across frontend and backend
- **React 18**: Modern component architecture with hooks and context
- **Express.js**: Robust API server with middleware support
- **WebSocket Server**: Real-time bidirectional communication
- **OpenAI Integration**: GPT-4 powered natural language processing with local AI fallback
- **Tailwind CSS**: Responsive design system with custom themes
- **Radix UI**: Accessible component primitives
- **TanStack Query**: Efficient server state management
- **Development Tools**: Hot reload, TypeScript compilation, and error handling
- **Local AI Simulation**: Docker-compatible AI responses for hackathon deployment