# Accessibility Standards

WCAG 2.1 AA compliant accessibility guidelines for inclusive design.

## Overview

All components and screens must meet **WCAG 2.1 Level AA** standards to ensure accessible experiences for users with disabilities.

## Color and Contrast

### Contrast Ratios

#### Text
- **Normal text** (< 18px / < 14pt bold): **4.5:1** minimum
- **Large text** (≥ 18px / ≥ 14pt bold): **3:1** minimum
- **Icons and graphics**: **3:1** minimum

#### Examples
```
✓ PASS: #111827 on #FFFFFF (16.05:1)
✓ PASS: #0EA5E9 on #FFFFFF (3.94:1) - Large text only
✗ FAIL: #9CA3AF on #FFFFFF (2.85:1) - Below minimum
```

### Color Independence

#### Do Not Rely on Color Alone
```html
<!-- Bad: Color only -->
<span style="color: red;">Error</span>

<!-- Good: Color + icon + text -->
<span class="error">
  <icon>⚠️</icon>
  Error: Invalid email address
</span>
```

#### Success/Error States
- Always include icons
- Provide descriptive text
- Use patterns/textures if needed
- Support color blind users

### Dark Mode
- Maintain contrast ratios in dark theme
- Test with color blindness simulators
- Provide theme toggle option

## Typography and Readability

### Font Sizes

#### Minimum Sizes
- **Body text**: 16px (1rem) minimum
- **Small text**: 14px absolute minimum
- **Touch targets**: Label at least 14px

#### Line Height
- **Body text**: 1.5 (150%) minimum
- **Headings**: 1.2-1.3
- **Small text**: 1.4 minimum

#### Line Length
- **Optimal**: 50-75 characters per line
- **Maximum**: 80 characters
- Use max-width for readability

### Text Scaling

#### Dynamic Type Support
```css
/* Use relative units */
body {
  font-size: 1rem; /* Scales with user preference */
}

h1 {
  font-size: 3rem; /* Scales proportionally */
}

/* Avoid fixed sizes for text */
.text {
  font-size: 16px; /* ❌ Doesn't scale */
}
```

#### Allow Zoom
- Support 200% zoom minimum
- Don't disable pinch-to-zoom
- Test layout at 200% zoom

## Keyboard Navigation

### Focus Indicators

#### Visible Focus
```css
*:focus {
  outline: 2px solid var(--color-primary-500);
  outline-offset: 2px;
}

/* Never remove outline without replacement */
*:focus {
  outline: none; /* ❌ NEVER DO THIS */
}

/* If custom focus, make it visible */
*:focus {
  outline: none;
  box-shadow: 0 0 0 3px rgba(14, 165, 233, 0.3); /* ✓ Custom but visible */
}
```

#### Focus Order
- Follow logical reading order (top to bottom, left to right)
- Skip links for main content
- Trap focus in modals
- Return focus after modal closes

### Keyboard Shortcuts

#### Standard Shortcuts
- **Tab**: Next focusable element
- **Shift+Tab**: Previous element
- **Enter**: Activate button/link
- **Space**: Activate button, toggle checkbox
- **Escape**: Close modal/dropdown
- **Arrow keys**: Navigate within component

#### Custom Shortcuts
```html
<button
  aria-label="Save (Ctrl+S)"
  accesskey="s"
>
  Save
</button>
```

## Screen Reader Support

### Semantic HTML

#### Use Proper Elements
```html
<!-- Good: Semantic HTML -->
<nav>
  <ul>
    <li><a href="/home">Home</a></li>
  </ul>
</nav>

<button type="button">Click Me</button>

<main>
  <article>
    <h1>Article Title</h1>
    <p>Content...</p>
  </article>
</main>

<!-- Bad: Div soup -->
<div class="nav">
  <div class="link" onclick="navigate()">Home</div>
</div>

<div class="button" onclick="handleClick()">Click Me</div>
```

### ARIA Attributes

#### Labels and Descriptions
```html
<!-- Label for form inputs -->
<label for="email" id="email-label">Email Address</label>
<input
  id="email"
  type="email"
  aria-labelledby="email-label"
  aria-describedby="email-help email-error"
  aria-required="true"
  aria-invalid="false"
/>
<span id="email-help">We'll never share your email</span>
<span id="email-error" role="alert">Please enter a valid email</span>

<!-- Icon-only button -->
<button aria-label="Close dialog">
  <svg aria-hidden="true">
    <use href="#icon-close" />
  </svg>
</button>

<!-- Decorative image -->
<img src="decoration.png" alt="" role="presentation" />

<!-- Meaningful image -->
<img src="chart.png" alt="Bar chart showing 50% increase in revenue" />
```

#### Roles
```html
<!-- Navigation -->
<nav role="navigation" aria-label="Main navigation">...</nav>

<!-- Modal -->
<div role="dialog" aria-modal="true" aria-labelledby="modal-title">
  <h2 id="modal-title">Confirm Action</h2>
</div>

<!-- Alert -->
<div role="alert">
  Your changes have been saved.
</div>

<!-- Status (less assertive) -->
<div role="status" aria-live="polite">
  Loading results...
</div>

<!-- Tab panel -->
<div role="tabpanel" aria-labelledby="tab1">...</div>
```

#### States and Properties
```html
<!-- Expanded/collapsed -->
<button
  aria-expanded="false"
  aria-controls="menu"
>
  Menu
</button>

<!-- Selected -->
<button
  role="tab"
  aria-selected="true"
>
  Tab 1
</button>

<!-- Pressed (toggle) -->
<button
  aria-pressed="false"
  onclick="toggle()"
>
  Follow
</button>

<!-- Hidden -->
<div aria-hidden="true">Decorative content</div>

<!-- Busy -->
<button aria-busy="true">Loading...</button>
```

### Live Regions

#### Announcements
```html
<!-- Polite: Wait for user to pause -->
<div role="status" aria-live="polite" aria-atomic="true">
  3 new messages
</div>

<!-- Assertive: Interrupt immediately -->
<div role="alert" aria-live="assertive">
  Error: Connection lost
</div>

<!-- Off: Don't announce -->
<div aria-live="off">
  Silent update
</div>
```

## Touch and Pointer

### Touch Target Sizes

#### Minimum Sizes
- **Mobile**: 44x44pt (iOS) / 48x48dp (Android)
- **Desktop**: 24x24px (pointer) / 44x44px (touch)

#### Spacing
```css
/* Adequate spacing between targets */
.button-group button {
  min-width: 44px;
  min-height: 44px;
  margin: 4px; /* At least 8px total spacing */
}
```

### Pointer Events
```css
/* Support various input methods */
@media (hover: hover) {
  /* Hover effects only for devices that support hover */
  .button:hover {
    background: var(--color-primary-600);
  }
}

@media (pointer: coarse) {
  /* Larger targets for touch */
  .button {
    min-height: 48px;
    padding: 12px 24px;
  }
}

@media (pointer: fine) {
  /* Smaller targets acceptable for mouse */
  .button {
    min-height: 36px;
    padding: 8px 16px;
  }
}
```

## Forms

### Labels and Instructions

#### Always Provide Labels
```html
<!-- Visible label -->
<label for="name">Full Name</label>
<input id="name" type="text" />

<!-- Visually hidden label (use sparingly) -->
<label for="search" class="sr-only">Search</label>
<input id="search" type="search" placeholder="Search..." />
```

#### Required Fields
```html
<!-- Indicate required fields -->
<label for="email">
  Email Address
  <span aria-label="required">*</span>
</label>
<input
  id="email"
  type="email"
  required
  aria-required="true"
/>

<!-- Or use aria-label -->
<input
  type="email"
  aria-label="Email Address (required)"
  required
/>
```

#### Instructions and Help
```html
<label for="password">Password</label>
<input
  id="password"
  type="password"
  aria-describedby="password-requirements"
/>
<div id="password-requirements">
  Must be at least 8 characters with 1 number and 1 special character
</div>
```

### Error Handling

#### Error Messages
```html
<label for="email">Email</label>
<input
  id="email"
  type="email"
  aria-invalid="true"
  aria-describedby="email-error"
/>
<span id="email-error" role="alert">
  Please enter a valid email address
</span>
```

#### Error Summary
```html
<!-- At top of form after submission -->
<div role="alert" class="error-summary">
  <h2>There are 2 errors in this form:</h2>
  <ul>
    <li><a href="#email">Email: Please enter a valid email address</a></li>
    <li><a href="#password">Password: Password is required</a></li>
  </ul>
</div>
```

## Media

### Images

#### Alt Text
```html
<!-- Informative image -->
<img src="chart.png" alt="Bar chart showing revenue growth of 45% in Q3" />

<!-- Decorative image -->
<img src="decoration.svg" alt="" role="presentation" />

<!-- Linked image -->
<a href="/profile">
  <img src="avatar.jpg" alt="View John's profile" />
</a>

<!-- Complex image -->
<figure>
  <img src="infographic.png" alt="Customer satisfaction infographic" />
  <figcaption>
    Full description: [detailed text description]
  </figcaption>
</figure>
```

### Video and Audio

#### Captions and Transcripts
```html
<!-- Video with captions -->
<video controls>
  <source src="video.mp4" type="video/mp4" />
  <track
    kind="captions"
    src="captions.vtt"
    srclang="en"
    label="English"
    default
  />
</video>

<!-- Audio with transcript -->
<audio controls>
  <source src="podcast.mp3" type="audio/mpeg" />
</audio>
<details>
  <summary>Transcript</summary>
  <p>[Full text transcript]</p>
</details>
```

### Animation and Motion

#### Respect Reduce Motion
```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}

/* Or provide alternative */
@media (prefers-reduced-motion: reduce) {
  .animated-element {
    animation: none;
    opacity: 1; /* Final state */
  }
}
```

#### Pause/Stop Controls
```html
<!-- Auto-playing carousel -->
<div class="carousel">
  <button aria-label="Pause carousel">
    <svg>...</svg>
  </button>
  <!-- Carousel content -->
</div>
```

## Testing

### Automated Testing
```javascript
// Example with jest-axe
import { axe } from 'jest-axe';

test('should not have accessibility violations', async () => {
  const { container } = render(<Component />);
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});
```

### Manual Testing

#### Keyboard Only
- Unplug mouse
- Navigate entire app with keyboard
- Verify all functionality accessible

#### Screen Reader
- **VoiceOver** (macOS/iOS): Cmd+F5
- **NVDA** (Windows): Free download
- **TalkBack** (Android): Settings > Accessibility
- Test all major flows

#### Color Contrast
- Use browser DevTools
- [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)
- [Colour Contrast Analyser](https://www.tpgi.com/color-contrast-checker/)

#### Zoom and Text Scaling
- Test at 200% zoom
- Test with browser text size increased
- Verify no horizontal scroll
- Check layout doesn't break

### Color Blindness Simulation
- Chrome DevTools: Rendering > Emulate vision deficiencies
- Test with Protanopia, Deuteranopia, Tritanopia
- Verify information still accessible

## Accessibility Checklist

### General
- [ ] Semantic HTML used throughout
- [ ] Keyboard navigation works for all interactions
- [ ] Focus indicators visible
- [ ] Skip links provided
- [ ] Page title descriptive and unique
- [ ] Language attribute set (`<html lang="en">`)
- [ ] Landmarks used (header, nav, main, footer)

### Color and Contrast
- [ ] Text contrast ≥ 4.5:1 (normal) or ≥ 3:1 (large)
- [ ] UI component contrast ≥ 3:1
- [ ] Color not sole indicator of information
- [ ] Dark mode maintains contrast ratios

### Typography
- [ ] Font size ≥ 16px for body text
- [ ] Line height ≥ 1.5 for body text
- [ ] Text scales to 200% without loss of content
- [ ] Line length ≤ 80 characters

### Images and Media
- [ ] All images have alt text
- [ ] Decorative images have empty alt or role="presentation"
- [ ] Videos have captions
- [ ] Audio has transcripts
- [ ] Complex images have long descriptions

### Forms
- [ ] All inputs have labels
- [ ] Required fields indicated
- [ ] Error messages clear and descriptive
- [ ] Errors announced to screen readers
- [ ] Field instructions provided
- [ ] Autocomplete attributes used

### Interactive Elements
- [ ] All functionality keyboard accessible
- [ ] Touch targets ≥ 44x44pt/px
- [ ] Adequate spacing between targets
- [ ] Loading states communicated
- [ ] Error states communicated
- [ ] Success states communicated

### ARIA
- [ ] ARIA used to enhance, not replace semantics
- [ ] aria-label/aria-labelledby on all interactive elements
- [ ] aria-live regions for dynamic content
- [ ] States and properties accurate
- [ ] Roles appropriate

### Motion
- [ ] Respects prefers-reduced-motion
- [ ] Auto-playing content can be paused
- [ ] Animations ≤ 500ms or can be stopped
- [ ] No flashing content (< 3 flashes/sec)

## Resources

### Tools
- [WAVE Browser Extension](https://wave.webaim.org/extension/)
- [axe DevTools](https://www.deque.com/axe/devtools/)
- [Lighthouse](https://developers.google.com/web/tools/lighthouse)
- [Color Contrast Checker](https://webaim.org/resources/contrastchecker/)

### Guidelines
- [WCAG 2.1](https://www.w3.org/WAI/WCAG21/quickref/)
- [MDN Accessibility](https://developer.mozilla.org/en-US/docs/Web/Accessibility)
- [A11y Project Checklist](https://www.a11yproject.com/checklist/)
- [Inclusive Components](https://inclusive-components.design/)

### Screen Readers
- [VoiceOver Guide](https://www.apple.com/accessibility/voiceover/)
- [NVDA](https://www.nvaccess.org/)
- [JAWS](https://www.freedomscientific.com/products/software/jaws/)
- [TalkBack](https://support.google.com/accessibility/android/answer/6283677)

## Related Documentation
- [Interaction Patterns](./interaction-patterns.md)
- [Component Library](../components/README.md)
- [Design Tokens](../tokens/README.md)
