# Accessibility Guidelines

## Overview

Our design system is built with accessibility as a core principle, ensuring that all users, regardless of their abilities, can effectively interact with our applications.

## WCAG 2.1 Compliance

All components meet or exceed WCAG 2.1 Level AA standards:

### Color Contrast Requirements

#### Text Contrast
- **Normal Text**: Minimum 4.5:1 contrast ratio
- **Large Text** (18pt+ or 14pt+ bold): Minimum 3:1 contrast ratio
- **UI Components**: Minimum 3:1 contrast ratio for interactive elements

#### Color Usage
- Never use color as the only means of conveying information
- Provide additional visual indicators (icons, underlines, borders)
- Support both light and dark modes with appropriate contrast

### Keyboard Navigation

#### Focus Management
- All interactive elements must be keyboard accessible
- Logical tab order following visual layout
- Clear focus indicators with minimum 2px outline
- Focus trap for modals and overlays
- Skip links for repetitive navigation

#### Keyboard Shortcuts
- `Tab` / `Shift+Tab`: Navigate between elements
- `Enter`: Activate buttons and links
- `Space`: Toggle checkboxes, activate buttons
- `Arrow Keys`: Navigate within components (menus, tabs, etc.)
- `Escape`: Close modals, cancel operations

### Screen Reader Support

#### Semantic HTML
- Use proper HTML elements (`button`, `nav`, `main`, `article`)
- Implement ARIA labels and descriptions where needed
- Provide alternative text for all images
- Use heading hierarchy (h1-h6) correctly

#### ARIA Attributes
```html
<!-- Button States -->
<button aria-pressed="false" aria-disabled="false">Toggle</button>

<!-- Loading States -->
<div aria-busy="true" aria-live="polite">Loading content...</div>

<!-- Error Messages -->
<input aria-invalid="true" aria-describedby="error-message" />
<span id="error-message" role="alert">Please enter a valid email</span>

<!-- Navigation -->
<nav aria-label="Main navigation">...</nav>

<!-- Modals -->
<div role="dialog" aria-modal="true" aria-labelledby="modal-title">...</div>
```

### Touch Targets

#### Minimum Sizes
- **Mobile**: 44x44px minimum touch target
- **Desktop**: 24x24px minimum click target
- **Spacing**: 8px minimum between interactive elements

#### Touch-Friendly Design
- Adequate padding around interactive elements
- Clear hover and active states
- Gesture alternatives for complex interactions
- Support for both tap and swipe gestures

## Component-Specific Guidelines

### Buttons
- Clear, descriptive labels
- Disabled state with `aria-disabled`
- Loading state with `aria-busy`
- Icon-only buttons require `aria-label`

### Forms
- Associated labels for all inputs
- Clear error messages with `role="alert"`
- Required fields marked with `aria-required`
- Fieldset and legend for grouped inputs
- Descriptive placeholder text

### Navigation
- Skip to main content link
- Breadcrumbs with `aria-label="Breadcrumb"`
- Current page indication with `aria-current="page"`
- Mobile menu with proper ARIA states

### Modals & Dialogs
- Focus trap when open
- Return focus to trigger element on close
- `aria-modal="true"` for screen readers
- Escape key to close

### Tables
- Proper table headers with `scope` attribute
- Caption for table description
- Summary for complex tables
- Responsive alternatives for mobile

## Testing Checklist

### Automated Testing
- [ ] Axe DevTools scan passes
- [ ] WAVE evaluation shows no errors
- [ ] Lighthouse accessibility score > 95
- [ ] ESLint accessibility rules pass

### Manual Testing
- [ ] Keyboard-only navigation works
- [ ] Screen reader announces content correctly
- [ ] Focus indicators are visible
- [ ] Color contrast meets requirements
- [ ] Zoom to 200% maintains usability
- [ ] Motion can be disabled
- [ ] Time limits can be extended

### Screen Reader Testing
Test with multiple screen readers:
- **Windows**: NVDA, JAWS
- **macOS**: VoiceOver
- **iOS**: VoiceOver
- **Android**: TalkBack

## Motion & Animation

### Respecting User Preferences
```css
/* Reduce motion for users who prefer it */
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

### Animation Guidelines
- Provide pause/play controls for auto-playing content
- Limit flashing to less than 3 times per second
- Offer alternatives to gesture-based interactions
- Keep animations subtle and purposeful

## Content Guidelines

### Language & Readability
- Use clear, simple language
- Aim for 8th-grade reading level
- Define technical terms
- Provide context for abbreviations
- Use consistent terminology

### Text Alternatives
- Alt text for informative images
- Captions for videos
- Transcripts for audio content
- Descriptions for complex diagrams

## Platform-Specific Considerations

### Web
- Progressive enhancement approach
- Support for browser zoom
- Responsive design for all viewports
- Semantic HTML structure

### iOS
- VoiceOver gestures support
- Dynamic Type support
- Reduce Motion setting respect
- Voice Control compatibility

### Android
- TalkBack gestures support
- Font scaling support
- Color inversion compatibility
- Switch Access support

## Resources

### Tools
- [Axe DevTools](https://www.deque.com/axe/devtools/)
- [WAVE](https://wave.webaim.org/)
- [Stark](https://www.getstark.co/)
- [Accessibility Insights](https://accessibilityinsights.io/)

### References
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/)
- [WebAIM Resources](https://webaim.org/resources/)
- [A11y Project Checklist](https://www.a11yproject.com/checklist/)

## Contact

For accessibility questions or concerns, contact the Design System team at accessibility@company.com