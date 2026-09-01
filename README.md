# Pingly

Pingly is a modern chat application built with Next.js, TypeScript, and Firebase. It provides users with a seamless messaging experience through a clean, intuitive interface.

## Features

- User Authentication: Secure login and registration with phone verification
- Real-time Chat: Direct messaging with other users
- User Profiles: Manage user information and preferences
- Responsive Design: Works seamlessly across desktop and mobile devices
- Modern UI: Built with shadcn/ui components for a polished user experience

## Tech Stack

- **Framework**: Next.js 16
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database & Auth**: Firebase
- **UI Components**: shadcn/ui
- **Notifications**: Sonner
- **Code Quality**: ESLint

## Project Structure

```
pingly/
├── app/                    # Next.js app directory
│   ├── (auth)/            # Authentication routes
│   │   ├── login/         # Login page
│   │   ├── register/      # Registration page
│   │   └── phoneVerifying/# Phone verification
│   └── (screens)/         # Main application screens
│       └── chatDashboard/ # Chat interface
├── components/            # Reusable React components
│   ├── auth/             # Authentication components
│   ├── chat/             # Chat-related components
│   ├── skeletons/        # Loading skeletons
│   └── ui/               # UI component library
├── context/              # React context providers
├── lib/                  # Utilities and Firebase config
├── services/             # API and business logic services
├── types/                # TypeScript type definitions
└── public/               # Static assets
```


