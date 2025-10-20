# Design System Usage Guide

## Getting Started

### Installation

#### Web (React)
```bash
npm install @company/design-system-web
# or
yarn add @company/design-system-web
```

#### iOS (SwiftUI)
```swift
// Package.swift
dependencies: [
    .package(url: "https://github.com/company/design-system-ios.git", from: "1.0.0")
]
```

#### Android (Jetpack Compose)
```gradle
dependencies {
    implementation 'com.company:design-system-android:1.0.0'
}
```

## Core Concepts

### Design Tokens

Design tokens are the foundation of our design system. They define the visual properties that maintain consistency across all platforms.

```javascript
// Using design tokens in React
import { colors, spacing, typography } from '@company/design-system-web';

const StyledComponent = styled.div`
  color: ${colors.primary500};
  padding: ${spacing.medium};
  font-family: ${typography.fontFamily.sans};
`;
```

```swift
// Using design tokens in SwiftUI
import DesignSystem

struct MyView: View {
    var body: some View {
        Text("Hello")
            .foregroundColor(DSColors.primary500)
            .padding(DSSpacing.medium)
            .font(DSTypography.heading1)
    }
}
```

```kotlin
// Using design tokens in Compose
import com.company.designsystem.theme.*

@Composable
fun MyComponent() {
    Text(
        text = "Hello",
        color = DSColors.Primary500,
        modifier = Modifier.padding(DSSpacing.medium),
        style = DSTypography.heading1
    )
}
```

## Component Usage

### Button Component

#### Basic Usage

```jsx
// React
import { Button } from '@company/design-system-web';

function MyComponent() {
  return (
    <Button 
      variant="primary" 
      size="medium"
      onClick={() => console.log('Clicked!')}
    >
      Click Me
    </Button>
  );
}
```

```swift
// SwiftUI
import DesignSystem

struct MyView: View {
    var body: some View {
        DSButton(
            title: "Click Me",
            variant: .primary,
            size: .medium
        ) {
            print("Clicked!")
        }
    }
}
```

```kotlin
// Jetpack Compose
import com.company.designsystem.components.*

@Composable
fun MyComponent() {
    DSButton(
        text = "Click Me",
        variant = DSButtonVariant.PRIMARY,
        size = DSButtonSize.MEDIUM,
        onClick = { println("Clicked!") }
    )
}
```

#### Advanced Usage

```jsx
// React - Button with icon and loading state
<Button
  variant="primary"
  size="large"
  icon={<SaveIcon />}
  iconPosition="leading"
  loading={isSaving}
  disabled={!isValid}
  fullWidth
>
  Save Changes
</Button>
```

### Form Components

#### Input Fields

```jsx
// React - Text input with validation
<Input
  type="email"
  label="Email Address"
  placeholder="john@example.com"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
  error={emailError}
  helperText="We'll never share your email"
  required
/>
```

```swift
// SwiftUI - Text field with validation
DSTextField(
    label: "Email Address",
    text: $email,
    placeholder: "john@example.com",
    type: .email,
    error: emailError,
    helperText: "We'll never share your email"
)
```

#### Select Dropdown

```jsx
// React
<Select
  label="Country"
  value={country}
  onChange={setCountry}
  options={[
    { value: 'us', label: 'United States' },
    { value: 'uk', label: 'United Kingdom' },
    { value: 'ca', label: 'Canada' }
  ]}
  placeholder="Select a country"
/>
```

### Layout Components

#### Card Component

```jsx
// React - Card with sections
<Card variant="elevated" size="medium">
  <Card.Header>
    <h3>Card Title</h3>
    <Button variant="ghost" size="small">
      <MoreIcon />
    </Button>
  </Card.Header>
  
  <Card.Body>
    <p>Card content goes here...</p>
  </Card.Body>
  
  <Card.Footer>
    <Button variant="tertiary">Cancel</Button>
    <Button variant="primary">Save</Button>
  </Card.Footer>
</Card>
```

#### Grid System

```jsx
// React - Responsive grid
<Grid container spacing={3}>
  <Grid item xs={12} sm={6} md={4}>
    <Card>Content 1</Card>
  </Grid>
  <Grid item xs={12} sm={6} md={4}>
    <Card>Content 2</Card>
  </Grid>
  <Grid item xs={12} sm={12} md={4}>
    <Card>Content 3</Card>
  </Grid>
</Grid>
```

### Navigation Components

#### Tab Navigation

```jsx
// React
<Tabs value={activeTab} onChange={setActiveTab}>
  <Tab label="Overview" value="overview" />
  <Tab label="Details" value="details" />
  <Tab label="Settings" value="settings" />
</Tabs>

<TabPanel value={activeTab} index="overview">
  <OverviewContent />
</TabPanel>
<TabPanel value={activeTab} index="details">
  <DetailsContent />
</TabPanel>
<TabPanel value={activeTab} index="settings">
  <SettingsContent />
</TabPanel>
```

## Theming

### Creating Custom Themes

```javascript
// React - Custom theme
import { createTheme, ThemeProvider } from '@company/design-system-web';

const customTheme = createTheme({
  colors: {
    primary500: '#007AFF',
    secondary500: '#5856D6',
  },
  typography: {
    fontFamily: {
      sans: 'Inter, system-ui, sans-serif',
    },
  },
  spacing: {
    unit: 8,
  },
});

function App() {
  return (
    <ThemeProvider theme={customTheme}>
      <YourApp />
    </ThemeProvider>
  );
}
```

### Dark Mode Support

```javascript
// React - Dark mode toggle
import { useTheme } from '@company/design-system-web';

function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  
  return (
    <Switch
      checked={theme === 'dark'}
      onChange={toggleTheme}
      label="Dark Mode"
    />
  );
}
```

## Responsive Design

### Breakpoints

```javascript
// Breakpoint values
const breakpoints = {
  xs: 0,     // Extra small devices
  sm: 640,   // Small devices
  md: 768,   // Medium devices
  lg: 1024,  // Large devices
  xl: 1280,  // Extra large devices
  '2xl': 1536 // 2X large devices
};
```

### Responsive Components

```jsx
// React - Responsive visibility
<Box
  display={{ xs: 'none', md: 'block' }}
  padding={{ xs: 2, sm: 3, md: 4 }}
>
  <Content />
</Box>
```

## Accessibility

### Focus Management

```jsx
// React - Focus trap for modals
<Modal open={isOpen} onClose={handleClose}>
  <FocusTrap>
    <div role="dialog" aria-modal="true" aria-labelledby="modal-title">
      <h2 id="modal-title">Modal Title</h2>
      <ModalContent />
    </div>
  </FocusTrap>
</Modal>
```

### Screen Reader Support

```jsx
// React - Accessible form
<form aria-label="Contact Form">
  <Input
    label="Name"
    aria-required="true"
    aria-describedby="name-error"
  />
  {nameError && (
    <span id="name-error" role="alert">
      {nameError}
    </span>
  )}
</form>
```

## Animation & Transitions

### Using Animations

```jsx
// React - Animated component
import { motion } from 'framer-motion';

const AnimatedCard = motion(Card);

<AnimatedCard
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.3 }}
  whileHover={{ scale: 1.02 }}
>
  <CardContent />
</AnimatedCard>
```

### Respecting Motion Preferences

```css
/* CSS - Reduced motion */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

## Testing

### Component Testing

```javascript
// React - Testing with Jest and React Testing Library
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from '@company/design-system-web';

test('Button calls onClick when clicked', () => {
  const handleClick = jest.fn();
  
  render(
    <Button onClick={handleClick}>
      Click Me
    </Button>
  );
  
  fireEvent.click(screen.getByText('Click Me'));
  expect(handleClick).toHaveBeenCalledTimes(1);
});
```

### Accessibility Testing

```javascript
// React - Accessibility testing
import { axe, toHaveNoViolations } from 'jest-axe';

expect.extend(toHaveNoViolations);

test('Button is accessible', async () => {
  const { container } = render(
    <Button>Accessible Button</Button>
  );
  
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});
```

## Performance

### Code Splitting

```javascript
// React - Lazy loading components
import { lazy, Suspense } from 'react';

const HeavyComponent = lazy(() => 
  import('@company/design-system-web/HeavyComponent')
);

function App() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <HeavyComponent />
    </Suspense>
  );
}
```

### Optimization Tips

1. **Use memo for expensive components**
```jsx
const ExpensiveComponent = React.memo(({ data }) => {
  // Component logic
}, (prevProps, nextProps) => {
  return prevProps.data.id === nextProps.data.id;
});
```

2. **Virtualize long lists**
```jsx
import { VirtualList } from '@company/design-system-web';

<VirtualList
  items={largeDataSet}
  itemHeight={60}
  renderItem={(item) => <ListItem {...item} />}
/>
```

3. **Optimize images**
```jsx
<Image
  src="image.jpg"
  alt="Description"
  loading="lazy"
  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
/>
```

## Migration Guide

### Migrating from v1 to v2

1. **Update imports**
```javascript
// Old (v1)
import Button from '@company/design-system/Button';

// New (v2)
import { Button } from '@company/design-system-web';
```

2. **Update prop names**
```jsx
// Old (v1)
<Button type="primary" size="md">

// New (v2)
<Button variant="primary" size="medium">
```

3. **Update theme structure**
```javascript
// Old (v1)
const theme = {
  primaryColor: '#007AFF'
};

// New (v2)
const theme = {
  colors: {
    primary500: '#007AFF'
  }
};
```

## Troubleshooting

### Common Issues

#### Issue: Components not styling correctly
**Solution:** Ensure CSS is imported:
```javascript
import '@company/design-system-web/styles.css';
```

#### Issue: TypeScript errors
**Solution:** Install type definitions:
```bash
npm install --save-dev @types/@company/design-system-web
```

#### Issue: SSR hydration mismatch
**Solution:** Use dynamic imports for client-only components:
```javascript
import dynamic from 'next/dynamic';

const ClientOnlyComponent = dynamic(
  () => import('@company/design-system-web/ClientOnlyComponent'),
  { ssr: false }
);
```

## Support

- **Documentation**: https://design.company.com
- **GitHub**: https://github.com/company/design-system
- **Slack**: #design-system
- **Email**: design-system@company.com