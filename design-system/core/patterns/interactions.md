# Interaction Patterns

## Overview

This document defines standardized interaction patterns for consistent user experiences across all platforms.

## Navigation Patterns

### Primary Navigation

#### Tab Navigation
- **Desktop**: Horizontal tabs below header
- **Mobile**: Bottom tab bar or hamburger menu
- **Tablet**: Adaptive based on orientation

```javascript
// Navigation States
const NavigationStates = {
  IDLE: 'idle',
  LOADING: 'loading',
  TRANSITIONING: 'transitioning',
  ERROR: 'error'
};

// Navigation Transitions
const transitions = {
  duration: 250,
  easing: 'cubic-bezier(0.4, 0, 0.2, 1)'
};
```

#### Breadcrumb Navigation
- Show current location in hierarchy
- Maximum 5 levels deep
- Truncate middle items on mobile
- Home icon for root level

#### Sidebar Navigation
- Collapsible on desktop
- Overlay on mobile
- Nested items with indentation
- Active state indication

### Page Transitions

#### Forward Navigation
- Slide in from right (LTR)
- Fade in with slight scale
- Duration: 250ms

#### Back Navigation
- Slide out to right (LTR)
- Fade out with slight scale
- Duration: 250ms

#### Tab Switches
- Cross-fade between content
- Maintain scroll position
- Duration: 150ms

## Gesture Patterns

### Touch Gestures

#### Tap
- **Action**: Primary interaction
- **Feedback**: Ripple effect or highlight
- **Delay**: < 100ms response time

#### Long Press
- **Action**: Secondary options/context menu
- **Duration**: 500ms hold
- **Feedback**: Haptic feedback on trigger

#### Swipe
- **Horizontal**: Navigate between pages/tabs
- **Vertical**: Scroll content
- **Diagonal**: Follow primary direction

#### Pinch
- **Action**: Zoom in/out
- **Constraints**: Min 50%, Max 300%
- **Feedback**: Smooth scaling with bounds

#### Pull to Refresh
- **Trigger**: Pull down > 80px
- **Feedback**: Loading indicator
- **Spring**: Elastic bounce effect

### Mouse Interactions

#### Hover States
```css
/* Hover Feedback */
.interactive-element {
  transition: all 150ms ease-out;
}

.interactive-element:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}
```

#### Click States
- Immediate visual feedback
- Depressed appearance
- Duration: 100ms

#### Drag and Drop
- Ghost element while dragging
- Drop zones highlighted
- Snap to grid when applicable
- Escape key to cancel

## Feedback Patterns

### Loading States

#### Skeleton Screens
```javascript
// Skeleton Component Structure
const SkeletonScreen = {
  animation: 'pulse',
  duration: 1500,
  elements: [
    { type: 'text', lines: 3 },
    { type: 'image', aspectRatio: '16:9' },
    { type: 'button', width: '120px' }
  ]
};
```

#### Progress Indicators
- **Linear**: For known duration
- **Circular**: For unknown duration
- **Stepped**: For multi-step processes

#### Shimmer Effect
- Left-to-right gradient animation
- 1.5s duration
- Subtle highlight color

### Success States

#### Success Messages
- Green color (#10B981)
- Check icon
- Auto-dismiss after 3 seconds
- Manual dismiss option

#### Completion Animations
- Scale up and fade
- Duration: 300ms
- Haptic feedback on mobile

### Error States

#### Error Messages
- Red color (#EF4444)
- Error icon
- Persistent until resolved
- Clear action to fix

#### Validation Feedback
- Real-time validation
- Debounce: 500ms
- Clear error on correction
- Success checkmark when valid

### Empty States

#### No Content
- Illustrative icon
- Descriptive message
- Action button to add content
- Subtle animation

#### Search No Results
- Search illustration
- Suggestions for better results
- Clear filters option
- Recent searches

## Microinteractions

### Button Interactions

#### Press Feedback
```javascript
const buttonAnimation = {
  pressed: {
    scale: 0.98,
    duration: 100
  },
  released: {
    scale: 1,
    duration: 100
  }
};
```

#### Loading State
- Replace text with spinner
- Maintain button dimensions
- Disable interactions
- Show progress if available

### Form Interactions

#### Field Focus
- Border color change
- Slight elevation
- Label animation (if floating)
- Clear existing errors

#### Input Validation
```javascript
const validationTiming = {
  debounceDelay: 500,
  showError: 'onBlur',
  clearError: 'onChange',
  showSuccess: 'onValid'
};
```

#### Auto-complete
- Dropdown appears on 2+ characters
- Keyboard navigation support
- Highlight matching text
- Max 10 suggestions

### Toggle Interactions

#### Switch Toggle
- Smooth slide animation
- Color change on state
- Duration: 200ms
- Haptic feedback

#### Checkbox Animation
- Check mark draws in
- Duration: 150ms
- Slight bounce effect

## Motion Guidelines

### Animation Principles

#### Duration Scale
```javascript
const durations = {
  instant: 0,
  fast: 150,
  normal: 250,
  slow: 350,
  slower: 500,
  slowest: 700
};
```

#### Easing Functions
```javascript
const easings = {
  linear: 'linear',
  easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
  easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
  easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
  bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)'
};
```

### Enter/Exit Animations

#### Fade
- Opacity: 0 → 1
- Duration: 250ms
- Use for overlays

#### Slide
- Transform: translateX/Y
- Duration: 300ms
- Use for panels

#### Scale
- Transform: scale(0.9) → scale(1)
- Duration: 200ms
- Use for modals

#### Expand
- Height: 0 → auto
- Duration: 350ms
- Use for accordions

### Responsive Animations

#### Reduce Motion
```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

#### Performance Optimization
- Use transform over position
- Avoid animating layout properties
- Hardware acceleration with will-change
- 60fps target frame rate

## Platform-Specific Patterns

### iOS Patterns
- Rubber band scrolling
- 3D Touch/Haptic Touch
- Swipe actions in lists
- Page curl transitions

### Android Patterns
- Material ripple effects
- FAB interactions
- Bottom sheet behavior
- Shared element transitions

### Web Patterns
- Hover states
- Right-click context menus
- Keyboard shortcuts
- Smooth scrolling

## Implementation Examples

### React Implementation
```jsx
import { motion } from 'framer-motion';

const InteractiveCard = ({ children }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -4 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.2 }}
    >
      {children}
    </motion.div>
  );
};
```

### SwiftUI Implementation
```swift
struct InteractiveButton: View {
    @State private var isPressed = false
    
    var body: some View {
        Button(action: {}) {
            Text("Press Me")
        }
        .scaleEffect(isPressed ? 0.98 : 1.0)
        .animation(.easeInOut(duration: 0.1), value: isPressed)
        .onLongPressGesture(
            minimumDuration: 0,
            maximumDistance: .infinity,
            pressing: { pressing in
                isPressed = pressing
            },
            perform: {}
        )
    }
}
```

### Jetpack Compose Implementation
```kotlin
@Composable
fun InteractiveCard(
    onClick: () -> Unit,
    content: @Composable () -> Unit
) {
    val interactionSource = remember { MutableInteractionSource() }
    val isPressed by interactionSource.collectIsPressedAsState()
    
    Card(
        modifier = Modifier
            .scale(if (isPressed) 0.98f else 1f)
            .clickable(
                interactionSource = interactionSource,
                indication = rememberRipple(),
                onClick = onClick
            ),
        content = content
    )
}