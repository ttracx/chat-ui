# Web Platform Implementation

Design system implementation for web applications (React, Svelte, Vue).

## Installation

### NPM Package
```bash
npm install @vibecaas/design-system
# or
yarn add @vibecaas/design-system
# or
pnpm add @vibecaas/design-system
```

### CSS Import
```javascript
// Import base styles
import '@vibecaas/design-system/styles/base.css';

// Import component styles
import '@vibecaas/design-system/styles/components.css';

// Or import everything
import '@vibecaas/design-system/styles/index.css';
```

## Framework Implementations

### Svelte
```svelte
<script>
  import { Button, Input, Card } from '@vibecaas/design-system/svelte';
  
  let email = '';
  
  function handleSubmit() {
    console.log('Email:', email);
  }
</script>

<Card>
  <h2>Sign Up</h2>
  
  <Input
    type="email"
    label="Email Address"
    bind:value={email}
    placeholder="you@example.com"
    required
  />
  
  <Button variant="primary" on:click={handleSubmit}>
    Submit
  </Button>
</Card>
```

### React
```jsx
import { Button, Input, Card } from '@vibecaas/design-system/react';
import { useState } from 'react';

function SignUpForm() {
  const [email, setEmail] = useState('');
  
  const handleSubmit = () => {
    console.log('Email:', email);
  };
  
  return (
    <Card>
      <h2>Sign Up</h2>
      
      <Input
        type="email"
        label="Email Address"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="you@example.com"
        required
      />
      
      <Button variant="primary" onClick={handleSubmit}>
        Submit
      </Button>
    </Card>
  );
}
```

### Vue
```vue
<template>
  <Card>
    <h2>Sign Up</h2>
    
    <Input
      type="email"
      label="Email Address"
      v-model="email"
      placeholder="you@example.com"
      required
    />
    
    <Button variant="primary" @click="handleSubmit">
      Submit
    </Button>
  </Card>
</template>

<script>
import { Button, Input, Card } from '@vibecaas/design-system/vue';
import { ref } from 'vue';

export default {
  components: { Button, Input, Card },
  setup() {
    const email = ref('');
    
    const handleSubmit = () => {
      console.log('Email:', email.value);
    };
    
    return { email, handleSubmit };
  }
};
</script>
```

## Design Tokens in Web

### CSS Custom Properties
```css
/* Automatically available when importing styles */
:root {
  /* Colors */
  --color-primary-500: #0EA5E9;
  --color-primary-600: #0284C7;
  --color-neutral-0: #FFFFFF;
  --color-neutral-900: #111827;
  
  /* Typography */
  --font-family-primary: 'Inter', sans-serif;
  --font-size-base: 1rem;
  --font-weight-regular: 400;
  --font-weight-semibold: 600;
  
  /* Spacing */
  --spacing-1: 0.25rem;
  --spacing-4: 1rem;
  --spacing-6: 1.5rem;
  
  /* Border Radius */
  --radius-md: 0.375rem;
  --radius-lg: 0.5rem;
  
  /* Shadows */
  --shadow-sm: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  
  /* Transitions */
  --duration-fast: 100ms;
  --duration-normal: 200ms;
  --easing-ease-out: cubic-bezier(0, 0, 0.2, 1);
}
```

### JavaScript/TypeScript
```typescript
import { tokens } from '@vibecaas/design-system';

// Access tokens in JS
const primaryColor = tokens.colors.primary[500];
const spacing = tokens.spacing[4];
const borderRadius = tokens.effects.borderRadius.md;

// Use in styled components
const Button = styled.button`
  background-color: ${tokens.colors.primary[500]};
  padding: ${tokens.spacing[3]} ${tokens.spacing[6]};
  border-radius: ${tokens.effects.borderRadius.md};
  font-family: ${tokens.typography.fontFamilies.primary};
`;
```

### Tailwind CSS Integration
```javascript
// tailwind.config.js
const { tokens } = require('@vibecaas/design-system');

module.exports = {
  theme: {
    extend: {
      colors: {
        primary: tokens.colors.primary,
        secondary: tokens.colors.secondary,
        neutral: tokens.colors.neutral,
        success: tokens.colors.semantic.success,
        error: tokens.colors.semantic.error,
      },
      fontFamily: {
        sans: tokens.typography.fontFamilies.primary.split(','),
        mono: tokens.typography.fontFamilies.mono.split(','),
      },
      fontSize: tokens.typography.fontSizes,
      spacing: tokens.spacing,
      borderRadius: tokens.effects.borderRadius,
      boxShadow: tokens.effects.shadows,
    },
  },
};
```

## Component Usage

### Button Component
```svelte
<!-- All variants -->
<Button variant="primary">Primary</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="tertiary">Tertiary</Button>
<Button variant="destructive">Delete</Button>

<!-- Sizes -->
<Button size="small">Small</Button>
<Button size="medium">Medium</Button>
<Button size="large">Large</Button>

<!-- With icons -->
<Button icon="action-add">Add Item</Button>
<Button icon="navigation-arrow-right" iconPosition="right">
  Next
</Button>

<!-- States -->
<Button disabled>Disabled</Button>
<Button loading>Loading...</Button>

<!-- Full width -->
<Button fullWidth>Full Width Button</Button>
```

### Input Component
```svelte
<Input
  id="email"
  type="email"
  label="Email Address"
  placeholder="you@example.com"
  bind:value={email}
  error={emailError}
  helperText="We'll never share your email"
  required
  on:blur={validateEmail}
/>

<!-- With icon -->
<Input
  icon="interface-search"
  placeholder="Search..."
  bind:value={searchQuery}
/>

<!-- Textarea -->
<Textarea
  label="Message"
  placeholder="Enter your message"
  rows={5}
  bind:value={message}
/>
```

### Card Component
```svelte
<Card variant="elevated">
  <CardHeader>
    <h3>Card Title</h3>
    <p>Subtitle or description</p>
  </CardHeader>
  
  <CardContent>
    <p>Card body content goes here...</p>
  </CardContent>
  
  <CardFooter>
    <Button variant="secondary">Cancel</Button>
    <Button variant="primary">Save</Button>
  </CardFooter>
</Card>

<!-- Interactive card -->
<Card href="/details" variant="interactive">
  <h3>Clickable Card</h3>
  <p>Click anywhere on this card</p>
</Card>
```

### Modal Component
```svelte
<script>
  let showModal = false;
</script>

<Button on:click={() => showModal = true}>
  Open Modal
</Button>

<Modal
  bind:open={showModal}
  title="Confirm Action"
  size="medium"
  on:close={() => showModal = false}
>
  <ModalBody>
    <p>Are you sure you want to continue?</p>
  </ModalBody>
  
  <ModalFooter>
    <Button variant="secondary" on:click={() => showModal = false}>
      Cancel
    </Button>
    <Button variant="primary" on:click={handleConfirm}>
      Confirm
    </Button>
  </ModalFooter>
</Modal>
```

### Table Component
```svelte
<script>
  const columns = [
    { key: 'name', title: 'Name', sortable: true },
    { key: 'email', title: 'Email', sortable: true },
    { key: 'role', title: 'Role', sortable: false },
  ];
  
  const data = [
    { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Admin' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'User' },
  ];
</script>

<Table {columns} {data} selectable sortable>
  <svelte:fragment slot="cell" let:column let:row>
    {#if column.key === 'actions'}
      <Button size="small" icon="action-edit">Edit</Button>
      <Button size="small" variant="destructive" icon="action-delete">
        Delete
      </Button>
    {:else}
      {row[column.key]}
    {/if}
  </svelte:fragment>
</Table>
```

## Styling & Customization

### CSS Variables Override
```css
/* custom-theme.css */
:root {
  /* Override primary color */
  --color-primary-500: #8B5CF6;
  --color-primary-600: #7C3AED;
  
  /* Override border radius for more rounded */
  --radius-md: 0.5rem;
  --radius-lg: 0.75rem;
  
  /* Override font */
  --font-family-primary: 'Poppins', sans-serif;
}
```

### Component-Level Styling
```svelte
<Button class="custom-button">
  Custom Styled Button
</Button>

<style>
  :global(.custom-button) {
    background: linear-gradient(to right, #667eea, #764ba2);
    border: none;
  }
</style>
```

## Dark Mode

### Implementation
```svelte
<script>
  import { darkMode } from '@vibecaas/design-system/stores';
  
  function toggleDarkMode() {
    darkMode.update(v => !v);
  }
</script>

<Button on:click={toggleDarkMode}>
  Toggle Dark Mode
</Button>
```

### CSS
```css
/* Automatic dark mode support */
[data-theme="dark"] {
  --color-neutral-0: #0F172A;
  --color-neutral-900: #F8FAFC;
  --color-primary-500: #38BDF8;
  /* All color tokens inverted */
}

@media (prefers-color-scheme: dark) {
  /* Respect system preference */
  :root {
    /* Dark mode tokens */
  }
}
```

## Responsive Design

### Breakpoint Utilities
```svelte
<script>
  import { breakpoint } from '@vibecaas/design-system/utils';
  
  // Reactive breakpoint
  $: isMobile = $breakpoint === 'xs' || $breakpoint === 'sm';
  $: isTablet = $breakpoint === 'md';
  $: isDesktop = $breakpoint === 'lg' || $breakpoint === 'xl';
</script>

{#if isMobile}
  <MobileLayout />
{:else if isTablet}
  <TabletLayout />
{:else}
  <DesktopLayout />
{/if}
```

### CSS Media Queries
```css
/* Mobile first approach */
.container {
  padding: var(--spacing-4);
}

@media (min-width: 768px) {
  .container {
    padding: var(--spacing-6);
  }
}

@media (min-width: 1024px) {
  .container {
    padding: var(--spacing-8);
    max-width: 1200px;
    margin: 0 auto;
  }
}
```

## Accessibility

### Focus Management
```svelte
<script>
  import { trapFocus } from '@vibecaas/design-system/utils';
  
  let modalElement;
  
  function openModal() {
    trapFocus(modalElement);
  }
</script>
```

### Keyboard Navigation
```svelte
<script>
  import { handleKeyboard } from '@vibecaas/design-system/utils';
</script>

<div
  role="button"
  tabindex="0"
  on:click={handleClick}
  on:keydown={handleKeyboard(handleClick)}
>
  Custom Interactive Element
</div>
```

## Performance

### Tree Shaking
```javascript
// Import only what you need
import { Button, Input } from '@vibecaas/design-system/svelte';

// Avoid importing everything
// import * from '@vibecaas/design-system'; // ❌
```

### Code Splitting
```javascript
// Lazy load heavy components
const Table = () => import('@vibecaas/design-system/svelte/Table');
const Chart = () => import('@vibecaas/design-system/svelte/Chart');
```

## Testing

### Component Testing
```typescript
import { render, fireEvent } from '@testing-library/svelte';
import { Button } from '@vibecaas/design-system/svelte';

test('button click', async () => {
  const { getByText } = render(Button, {
    props: { variant: 'primary' },
    slots: { default: 'Click Me' }
  });
  
  const button = getByText('Click Me');
  await fireEvent.click(button);
  
  expect(button).toHaveClass('button--primary');
});
```

## Best Practices

### Do ✓
- Use semantic HTML elements
- Leverage design tokens for consistency
- Follow component API conventions
- Test accessibility with screen readers
- Optimize images and assets
- Use responsive utilities
- Implement error boundaries

### Don't ✗
- Override core styles unnecessarily
- Mix component libraries
- Ignore accessibility warnings
- Hard-code colors/spacing values
- Skip prop validation
- Forget to test edge cases

## Related Documentation
- [Component Library](../../components/README.md)
- [Design Tokens](../../tokens/README.md)
- [Accessibility Guidelines](../../guidelines/accessibility.md)
