# Interaction Patterns

Standardized interaction models for consistent user experiences.

## Touch and Gesture Interactions

### Touch Targets

#### Minimum Sizes
- **Mobile (iOS/Android)**: 44x44pt (iOS) / 48x48dp (Android)
- **Tablet**: 40x40pt/dp minimum
- **Web**: 44x44px minimum (desktop), 48x48px (mobile)

#### Spacing
- **Between targets**: Minimum 8px/pt/dp
- **From edges**: Minimum 16px/pt/dp
- **Dense UI**: Allow smaller targets with adequate spacing

### Gestures

#### Tap/Click
- **Single tap**: Primary action
- **Duration**: < 200ms
- **Feedback**: Visual change (color, scale)
- **Delay**: Immediate response

#### Long Press
- **Duration**: 500ms hold
- **Feedback**: Haptic + visual indicator
- **Use cases**: Context menus, drag handles, additional options

#### Swipe
- **Horizontal swipe**: 
  - Left: Delete, archive (list items)
  - Right: Mark complete, favorite
  - Distance threshold: 50% of item width
  
- **Vertical swipe**:
  - Down: Refresh content (pull-to-refresh)
  - Up: Load more content
  - Distance threshold: 60px minimum

#### Drag and Drop
- **Initiation**: Long press (500ms) or drag handle
- **Visual feedback**: Lift effect, shadow increase
- **Drop zones**: Highlighted when dragging over
- **Cancellation**: Drag outside valid drop zone

#### Pinch to Zoom
- **Platform**: Mobile/tablet only
- **Content**: Images, maps, zoomable content
- **Range**: 50% to 400% of original size
- **Animation**: Smooth, follows gesture speed

### Hover States (Desktop/Tablet with Pointer)

#### Mouse Hover
```css
.interactive-element {
  transition: all 200ms ease-out;
}

.interactive-element:hover {
  background-color: var(--color-neutral-100);
  transform: translateY(-1px);
  box-shadow: var(--shadow-md);
  cursor: pointer;
}
```

#### Cursor Types
- **Default**: Standard pointer
- **Pointer**: Interactive elements (buttons, links)
- **Text**: Text inputs, editable content
- **Grab/Grabbing**: Draggable items
- **Not-allowed**: Disabled elements
- **Wait**: Loading/processing
- **Help**: Tooltips, help content

## Navigation Patterns

### Page Navigation

#### Forward Navigation
- **Links**: Standard text/icon links
- **Buttons**: Primary/secondary actions
- **Cards**: Tappable cards
- **Animation**: Slide left (new content from right)

#### Backward Navigation
- **Back button**: Top-left (iOS) / Top-left or bottom (Android)
- **Swipe**: Right swipe from edge
- **Breadcrumb**: Click previous level
- **Animation**: Slide right (reveal previous content)

#### Tab Navigation
- **Position**: Top or bottom
- **Selection**: Tap to switch
- **Indicator**: Underline or background highlight
- **Animation**: Fade or slide between tabs

### Modal Navigation

#### Opening
- **Trigger**: Button, link, or automatic
- **Animation**: Fade in + scale up (200-300ms)
- **Focus**: First interactive element
- **Backdrop**: Dim background (overlay)

#### Closing
- **Methods**: 
  - Close button (X)
  - Cancel button
  - Backdrop click (configurable)
  - Escape key
  - Back gesture (mobile)
- **Animation**: Fade out + scale down (100-200ms)
- **Focus**: Return to trigger element

### Drawer/Sidebar Navigation

#### Opening
- **Trigger**: Hamburger menu, swipe from edge
- **Animation**: Slide in from left/right (300ms)
- **Width**: 280px (mobile), 320px (desktop)
- **Backdrop**: Semi-transparent overlay

#### Closing
- **Methods**:
  - Close button
  - Backdrop click
  - Swipe away
  - Select navigation item
- **Animation**: Slide out (200ms)

## Form Interactions

### Input Focus

#### On Focus
```css
input:focus {
  border-color: var(--color-primary-500);
  border-width: 2px;
  outline: none;
  box-shadow: 0 0 0 3px rgba(14, 165, 233, 0.1);
}
```

#### Label Animation
```css
/* Floating label */
.input-wrapper.focused label {
  transform: translateY(-24px) scale(0.875);
  color: var(--color-primary-500);
}
```

### Validation

#### On Blur
- Validate when user leaves field
- Show error message below input
- Change border color to error state
- Display error icon

#### On Submit
- Validate all fields
- Scroll to first error
- Focus first error field
- Show summary of errors

#### Real-time (Specific Cases)
- Password strength: Show strength meter
- Username availability: Debounced check (500ms)
- Character count: Live update

### Auto-complete

#### Behavior
- **Trigger**: After 2-3 characters typed
- **Delay**: 300ms debounce
- **Display**: Dropdown below input
- **Navigation**: Arrow keys to select, Enter to choose
- **Dismiss**: Escape or click outside

## Feedback Patterns

### Loading States

#### Button Loading
```css
.button.loading {
  opacity: 0.8;
  cursor: wait;
  pointer-events: none;
}

.button.loading .spinner {
  display: inline-block;
  animation: spin 1s linear infinite;
}
```

#### Skeleton Loading
- Show placeholder content
- Shimmer animation (2-3s loop)
- Maintain layout (prevent shift)
- Replace with real content smoothly

#### Progress Indicators
- **Determinate**: Show percentage (0-100%)
- **Indeterminate**: Continuous animation
- **With text**: "Loading... 45%"
- **Timeout**: Show error after 30s

### Success Feedback

#### Toast Notification
- **Duration**: 3-5 seconds
- **Position**: Top-right (desktop), top (mobile)
- **Animation**: Slide in from top
- **Dismissible**: X button or auto-dismiss
- **Color**: Success green background

#### Inline Success
- **Icon**: Checkmark (green)
- **Message**: "Changes saved successfully"
- **Duration**: Fade out after 3s
- **Position**: Near affected element

#### Modal Confirmation
- **Title**: "Success!"
- **Icon**: Large checkmark
- **Message**: Descriptive text
- **Action**: "OK" or "Continue"

### Error Feedback

#### Inline Errors
```html
<div class="input-error">
  <input class="error" />
  <span class="error-message">
    <icon>⚠️</icon>
    Please enter a valid email address
  </span>
</div>
```

#### Toast Errors
- **Duration**: 5-7 seconds (longer than success)
- **Color**: Error red background
- **Icon**: Error/warning icon
- **Dismissible**: Required (X button)

#### Error Pages
- **404**: "Page not found" with navigation
- **500**: "Something went wrong" with retry
- **Offline**: "No internet connection" with refresh

## Microinteractions

### Button Press
```css
.button:active {
  transform: scale(0.98);
  box-shadow: var(--shadow-sm);
  transition: all 50ms ease-out;
}
```

### Checkbox/Toggle
```css
.checkbox {
  transition: all 200ms ease-out;
}

.checkbox:checked {
  background-color: var(--color-primary-500);
  transform: scale(1.05);
}

.checkbox:checked::after {
  animation: checkmark 200ms ease-out;
}

@keyframes checkmark {
  0% {
    transform: scale(0) rotate(45deg);
  }
  50% {
    transform: scale(1.2) rotate(45deg);
  }
  100% {
    transform: scale(1) rotate(45deg);
  }
}
```

### Icon Animation
```css
.icon.favorite {
  transition: transform 200ms ease-out;
}

.icon.favorite.active {
  fill: var(--color-error-500);
  animation: heartbeat 300ms ease-out;
}

@keyframes heartbeat {
  0%, 100% {
    transform: scale(1);
  }
  25% {
    transform: scale(1.3);
  }
  50% {
    transform: scale(1.1);
  }
}
```

### Pull to Refresh
1. **Pull down**: Show refresh indicator
2. **Threshold (60px)**: Release to refresh
3. **Release**: Spin animation
4. **Loading**: Fetch new data
5. **Complete**: Collapse indicator

## Scroll Interactions

### Infinite Scroll
- **Trigger**: 200px from bottom
- **Loading**: Show spinner at bottom
- **Error handling**: Show "Load more" button
- **End of content**: "No more items"

### Sticky Headers
```css
.sticky-header {
  position: sticky;
  top: 0;
  z-index: 100;
  background: white;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}
```

### Scroll to Top
- **Trigger**: Show after scrolling 300px
- **Position**: Bottom-right
- **Animation**: Smooth scroll (500ms)
- **Icon**: Up arrow in circle

## Search Interactions

### Search Input
- **Auto-focus**: On page load (if primary action)
- **Clear button**: Show when text entered
- **Suggestions**: Dropdown with recent/popular
- **Debounce**: 300ms delay before search

### Search Results
- **Live update**: As user types (debounced)
- **Highlight**: Match text in results
- **Empty state**: "No results for 'query'"
- **Filters**: Toggle filters without losing search

## Context Menus

### Right-Click Menu (Desktop)
```javascript
element.addEventListener('contextmenu', (e) => {
  e.preventDefault();
  showContextMenu(e.clientX, e.clientY);
});
```

### Long-Press Menu (Mobile)
- **Trigger**: 500ms hold
- **Haptic**: Vibration on trigger
- **Menu**: Modal bottom sheet (Android) or popover (iOS)
- **Dismiss**: Tap outside or select item

## Tooltip Interactions

### Hover Tooltip (Desktop)
- **Trigger**: Mouse hover (500ms delay)
- **Position**: Above element (or below if no space)
- **Dismiss**: Mouse out
- **Max width**: 250px

### Tap Tooltip (Mobile)
- **Trigger**: Tap info icon
- **Display**: Popover or modal
- **Dismiss**: Tap outside or close button

## Accessibility Interactions

### Keyboard Navigation
- **Tab**: Next focusable element
- **Shift+Tab**: Previous focusable element
- **Enter**: Activate button/link
- **Space**: Toggle checkbox, activate button
- **Escape**: Close modal/dropdown
- **Arrow keys**: Navigate within component

### Screen Reader
- **Focus**: Announce element label and role
- **State change**: Announce new state
- **Live regions**: Announce dynamic content
- **Skip links**: "Skip to main content"

## Best Practices

### Do ✓
- Provide immediate visual feedback
- Use consistent interaction patterns
- Support keyboard navigation
- Include haptic feedback (mobile)
- Show loading states for async actions
- Animate state transitions smoothly
- Make touch targets adequately sized
- Provide clear affordances

### Don't ✗
- Use hover states as only indicator (mobile)
- Block interactions during animations
- Use long animations (>500ms)
- Hide important actions in gestures
- Forget to handle edge cases
- Ignore platform conventions
- Make gestures too complex
- Omit error recovery options

## Platform-Specific Patterns

### iOS
- **Swipe**: Back gesture from left edge
- **Pull down**: Dismiss modal
- **3D Touch**: Quick actions (if supported)
- **Haptics**: Use system haptics

### Android
- **Back button**: Navigate back
- **FAB**: Floating action button for primary action
- **Swipe**: Drawer from left edge
- **Long press**: Context menu

### Web
- **Hover**: Show additional info/actions
- **Right-click**: Context menu
- **Scroll**: Infinite scroll or pagination
- **Keyboard shortcuts**: Ctrl/Cmd + shortcuts

## Related Documentation
- [Animation Guidelines](./animations.md)
- [Accessibility Standards](./accessibility.md)
- [Component Library](../components/README.md)
