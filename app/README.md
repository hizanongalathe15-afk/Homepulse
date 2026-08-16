# App

Flutter mobile application for HomePulse.

## Stack
- Flutter
- Dart
- Provider / Riverpod state management
- Mapbox
- Socket.io client

## Setup
```bash
cd app
flutter pub get
flutter run
```

## Structure
```
lib/
├── main.dart                       # App entry point
├── app.dart                        # Root widget
├── core/
│   ├── config/                     # Environment, constants, Mapbox, M-Pesa configs
│   ├── l10n/                       # Localization (English, Swahili)
│   ├── network/                    # API client, exceptions, socket client
│   ├── routing/                    # App router / navigation
│   ├── theme/                      # App colors & theme
│   └── utils/                      # Formatters, validators, QR generator, location utils
├── features/
│   ├── auth/                       # Login, register, forgot password, OTP, ID verify
│   ├── dashboard/                  # Home dashboard widgets
│   ├── feed/                       # Property feed
│   ├── landlord/                   # Landlord tools (properties, QR, escrow, analytics)
│   ├── map/                        # Map view with property pins & overlays
│   ├── messages/                   # Chat, calls, video pre-call verify
│   ├── payments/                   # M-Pesa, Stripe, escrow, invoices
│   ├── profile/                    # User profile
│   ├── property_detail/            # Property details, gallery, Q&A, booking
│   ├── qr_scanner/                 # QR scanner & history
│   ├── roommates/                  # Roommate matching & quiz
│   └── search/                     # Property search, alerts, saved searches
├── models/                         # Data models
├── services/                       # API service layer
├── state/                          # Global state providers
└── widgets/                        # Reusable UI widgets
```

## Key Features
- Property search & filtering
- QR code scanning & generation
- M-Pesa / Stripe payments & escrow
- Chat & video pre-call verification
- Safety scores & SOS alerts
- Roommate matching
- Referral program
- Banner ads
- Community groups & events
- Review & rating system

## Testing
```bash
flutter test
```

## Build
```bash
flutter build apk   # Android
flutter build ios   # iOS
```
