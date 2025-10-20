# Screen Designs and Mockups

Complete screen designs for all platforms with responsive layouts.

## Screen Categories

### Authentication Screens
- Login
- Sign Up / Registration
- Forgot Password
- Reset Password
- Email Verification
- Two-Factor Authentication

### Dashboard / Home
- Main Dashboard (Web/Desktop)
- Mobile Home Screen
- Tablet Home View
- Statistics Overview
- Quick Actions Panel

### Content Screens
- List View (Grid and Table)
- Detail View
- Create/Edit Form
- Settings & Preferences
- Profile / Account

### Communication
- Chat Interface
- Conversation List
- Message Thread
- Notifications Center
- Activity Feed

### E-commerce (if applicable)
- Product List
- Product Detail
- Shopping Cart
- Checkout Flow
- Order Confirmation

## Platform-Specific Designs

### Web Responsive

#### Desktop (1920x1080, 1440x900)
- Full navigation sidebar
- Multi-column layouts
- Hover interactions
- Keyboard shortcuts
- Context menus

#### Tablet (1024x768, 768x1024)
- Collapsible sidebar
- 2-column layouts
- Touch-friendly targets
- Responsive navigation

#### Mobile Web (375x667, 414x896)
- Single-column layout
- Bottom navigation or hamburger menu
- Stacked cards
- Full-width forms
- Swipe gestures

### iOS

#### iPhone (375x812, 390x844, 428x926)
- Bottom tab bar navigation
- Navigation bar with back button
- Swipe gestures (back, actions)
- Pull-to-refresh
- Native system components

#### iPad (834x1112, 1024x1366)
- Split view layouts
- Sidebar navigation
- Multi-column displays
- Contextual toolbars
- Keyboard shortcuts support

### Android

#### Mobile (360x800, 412x915)
- Bottom navigation or drawer
- Floating Action Button (FAB)
- Material Design components
- Swipe actions
- System back button

#### Tablet (800x1280, 1280x800)
- Navigation rail or drawer
- Multi-pane layouts
- Adaptive navigation
- Large screen optimizations

## Screen Specifications

### Login Screen

#### Layout Structure
```
┌─────────────────────────────┐
│                             │
│         [LOGO]              │
│                             │
│    Welcome Back             │
│    Sign in to continue      │
│                             │
│    [Email Input]            │
│    [Password Input]         │
│                             │
│    ☐ Remember me            │
│    Forgot password? →       │
│                             │
│    [Sign In Button]         │
│                             │
│    ──────  OR  ──────       │
│                             │
│    [Sign in with Google]    │
│    [Sign in with Apple]     │
│                             │
│    Don't have an account?   │
│    Sign up →                │
│                             │
└─────────────────────────────┘
```

#### Components Used
- DSTextField (email, password)
- DSButton (primary, social)
- DSCheckbox (remember me)
- DSLink (forgot password, sign up)
- Logo asset
- Divider component

#### Responsive Behavior
- **Desktop**: Center card (400px max-width), background image
- **Tablet**: Full-width card with margins
- **Mobile**: Full-screen with logo at top

### Dashboard Screen

#### Layout Structure
```
Desktop:
┌────────────────────────────────────────┐
│  [Header: Logo, Search, User Menu]    │
├──────┬─────────────────────────────────┤
│      │  Main Dashboard                 │
│ Nav  │  ┌──────┐ ┌──────┐ ┌──────┐   │
│ Bar  │  │ Stat │ │ Stat │ │ Stat │   │
│      │  └──────┘ └──────┘ └──────┘   │
│      │                                │
│      │  ┌──────────────┬────────────┐ │
│      │  │   Chart      │   Recent   │ │
│      │  │              │   Activity │ │
│      │  └──────────────┴────────────┘ │
└──────┴─────────────────────────────────┘
```

```
Mobile:
┌────────────────────┐
│ [Header: Logo]     │
├────────────────────┤
│  [Search Bar]      │
├────────────────────┤
│  ┌──────┐ ┌──────┐│
│  │ Stat │ │ Stat ││
│  └──────┘ └──────┘│
│  ┌──────┐ ┌──────┐│
│  │ Stat │ │ Stat ││
│  └──────┘ └──────┘│
├────────────────────┤
│  [Chart]           │
├────────────────────┤
│  [Recent Activity] │
├────────────────────┤
│ [Tab Bar Nav]      │
└────────────────────┘
```

#### Components Used
- DSNavigationBar / DSTabBar
- DSCard (stat cards, chart card)
- DSStatCard (custom variant)
- DSSearchInput
- DSChart / DSTable
- DSList (recent activity)

### Chat / Conversation Screen

#### Layout Structure
```
Desktop:
┌──────────┬─────────────────┬──────────┐
│          │                 │          │
│ Conver-  │   Messages      │  Info    │
│ sation   │   ┌─────────┐   │  Panel   │
│ List     │   │ Other   │   │          │
│          │   └─────────┘   │  [Avatar]│
│ [Search] │                 │  Name    │
│          │   ┌─────────┐   │  Status  │
│ ┌──────┐ │   │   Me    │   │          │
│ │Conv 1│ │   └─────────┘   │  Files   │
│ └──────┘ │                 │  Links   │
│ ┌──────┐ │   ┌─────────┐   │  Media   │
│ │Conv 2│ │   │ Other   │   │          │
│ └──────┘ │   └─────────┘   │          │
│          │                 │          │
│          │ [Message Input] │          │
└──────────┴─────────────────┴──────────┘
```

```
Mobile:
Conversation List:
┌────────────────────┐
│ [Header: Chats]    │
│ [Search]           │
├────────────────────┤
│ [Conv 1] →         │
│ [Conv 2] →         │
│ [Conv 3] →         │
└────────────────────┘

Message Thread:
┌────────────────────┐
│ ← Name        ⋮    │
├────────────────────┤
│   ┌─────────┐      │
│   │ Other   │      │
│   └─────────┘      │
│      ┌─────────┐   │
│      │   Me    │   │
│      └─────────┘   │
├────────────────────┤
│ [Message Input] →  │
└────────────────────┘
```

#### Components Used
- DSNavigationBar
- DSList (conversation list)
- DSChatBubble (custom component)
- DSTextField (message input)
- DSAvatar
- DSIconButton (send, attach, more)

### Settings Screen

#### Layout Structure
```
┌────────────────────────────────┐
│  Settings                      │
├────────────────────────────────┤
│  Profile                       │
│  ┌─────────────────────┐       │
│  │ [Avatar] Name       │       │
│  │ email@example.com   │  →   │
│  └─────────────────────┘       │
├────────────────────────────────┤
│  Preferences                   │
│  ┌─────────────────────┐       │
│  │ Notifications    ⚙️  │  →   │
│  └─────────────────────┘       │
│  ┌─────────────────────┐       │
│  │ Appearance       🎨  │  →   │
│  └─────────────────────┘       │
│  ┌─────────────────────┐       │
│  │ Language         🌐  │  →   │
│  └─────────────────────┘       │
├────────────────────────────────┤
│  Account                       │
│  ┌─────────────────────┐       │
│  │ Privacy & Security  │  →   │
│  └─────────────────────┘       │
│  ┌─────────────────────┐       │
│  │ Sign Out            │       │
│  └─────────────────────┘       │
└────────────────────────────────┘
```

#### Components Used
- DSList / DSListItem
- DSAvatar
- DSIcon
- DSNavigationBar
- DSDivider

## Design Handoff Files

### Figma Organization
```
VibeCaaS Design System/
├── 📄 Cover Page
├── 🎨 Design Tokens
│   ├── Colors
│   ├── Typography
│   ├── Spacing
│   └── Effects
├── 🧩 Components
│   ├── Buttons
│   ├── Inputs
│   ├── Cards
│   ├── Navigation
│   └── ... (all components)
├── 📱 Screens - Mobile
│   ├── iOS
│   │   ├── iPhone Pro Max
│   │   ├── iPhone
│   │   └── iPhone SE
│   └── Android
│       ├── Large Phone
│       └── Compact Phone
├── 📱 Screens - Tablet
│   ├── iPad Pro
│   ├── iPad
│   └── Android Tablet
└── 💻 Screens - Web
    ├── Desktop (1920x1080)
    ├── Laptop (1440x900)
    └── Mobile Web (375x667)
```

### Export Specifications

#### Images and Assets
- **Format**: PNG for raster, SVG for icons/logos
- **Resolution**: @1x, @2x, @3x for iOS/Android
- **Naming**: `screen-name_platform_size@2x.png`
- **Example**: `login_ios_iphone@3x.png`

#### Developer Handoff
```
screens/
├── web/
│   ├── desktop/
│   │   ├── login.png
│   │   ├── dashboard.png
│   │   └── settings.png
│   ├── tablet/
│   └── mobile/
├── ios/
│   ├── iphone/
│   │   ├── login@3x.png
│   │   ├── dashboard@3x.png
│   │   └── settings@3x.png
│   └── ipad/
└── android/
    ├── phone/
    │   ├── drawable-xxxhdpi/
    │   ├── drawable-xxhdpi/
    │   └── drawable-xhdpi/
    └── tablet/
```

## Screen Flow Diagrams

### Authentication Flow
```
┌─────────┐
│  Start  │
└────┬────┘
     │
     ▼
┌─────────┐      Yes   ┌──────────┐
│ Logged  ├───────────►│Dashboard │
│   In?   │            └──────────┘
└────┬────┘
     │ No
     ▼
┌─────────┐
│  Login  │────┬───────────────┐
└────┬────┘    │               │
     │         │               │
     │      Forgot         Sign Up
     │         │               │
     ▼         ▼               ▼
┌─────────┐ ┌─────────┐  ┌──────────┐
│Dashboard│ │  Reset  │  │ Register │
└─────────┘ │Password │  └─────┬────┘
            └─────────┘        │
                               ▼
                          ┌──────────┐
                          │  Verify  │
                          │  Email   │
                          └────┬─────┘
                               │
                               ▼
                          ┌──────────┐
                          │Dashboard │
                          └──────────┘
```

### Main App Flow
```
Dashboard ──┬──► Chat
            ├──► Profile
            ├──► Settings
            └──► Content
                   │
                   ├──► List View
                   ├──► Detail View
                   ├──► Create/Edit
                   └──► Delete (confirm)
```

## Responsive Breakpoint Examples

### Login Screen Breakpoints

#### Desktop (≥1024px)
- Center card (400px width)
- Background image/gradient
- Social buttons side-by-side
- Large logo (80px)

#### Tablet (768px - 1023px)
- Full-width card with margins (600px max)
- Background visible
- Social buttons stacked
- Medium logo (60px)

#### Mobile (<768px)
- Full-screen layout
- No background image
- Social buttons stacked
- Small logo (48px)
- Larger touch targets

## Animation Specifications

### Page Transitions
- **Web**: Fade + slide (300ms)
- **iOS**: Push from right (350ms)
- **Android**: Material motion (300ms)

### Component Animations
- **Modal**: Fade + scale (200ms ease-out)
- **Drawer**: Slide in/out (300ms ease-out)
- **Toast**: Slide from top (200ms ease-out)
- **Loading**: Skeleton shimmer (1500ms loop)

## Best Practices

### Do ✓
- Design for smallest screen first (mobile-first)
- Use consistent spacing and alignment
- Maintain visual hierarchy
- Follow platform conventions
- Test on real devices
- Provide multiple screen sizes
- Document interactions and states
- Include error states and edge cases

### Don't ✗
- Design for only one platform
- Use platform-specific patterns on wrong platform
- Ignore accessibility requirements
- Forget loading and error states
- Use inconsistent spacing
- Hide important functionality
- Make assumptions about screen sizes

## Related Documentation
- [Component Library](../components/README.md)
- [Platform Implementations](../platforms/README.md)
- [Conversion Scripts](../automation/README.md)
