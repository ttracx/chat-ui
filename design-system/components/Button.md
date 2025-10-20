# Button Component

Primary interactive element for user actions.

## Variants

### Primary Button
- **Purpose**: Main call-to-action, high emphasis
- **Usage**: One primary button per screen section
- **Background**: `primary.500`
- **Text**: `neutral.0` (white)
- **Border**: None

### Secondary Button
- **Purpose**: Secondary actions, medium emphasis
- **Background**: Transparent
- **Text**: `primary.600`
- **Border**: `2px solid primary.600`

### Tertiary Button
- **Purpose**: Low emphasis actions, auxiliary functions
- **Background**: Transparent
- **Text**: `primary.600`
- **Border**: None

### Destructive Button
- **Purpose**: Dangerous or irreversible actions
- **Background**: `semantic.error.500`
- **Text**: `neutral.0`
- **Border**: None

## Sizes

### Large
- **Height**: 48px (3rem)
- **Padding**: 16px 32px (`spacing.4` x `spacing.8`)
- **Font**: `textStyles.button` at 18px
- **Usage**: Hero CTAs, primary landing page actions

### Medium (Default)
- **Height**: 40px (2.5rem)
- **Padding**: 12px 24px (`spacing.3` x `spacing.6`)
- **Font**: `textStyles.button` at 16px
- **Usage**: Standard buttons throughout app

### Small
- **Height**: 32px (2rem)
- **Padding**: 8px 16px (`spacing.2` x `spacing.4`)
- **Font**: `textStyles.button` at 14px
- **Usage**: Compact interfaces, table actions

## States

### Normal
```css
background: primary.500 (#0EA5E9)
color: neutral.0 (#FFFFFF)
border-radius: borderRadius.md (6px)
shadow: shadows.sm
transition: all duration.fast easing.easeOut
```

### Hover
```css
background: primary.600 (#0284C7)
shadow: shadows.md
transform: translateY(-1px)
cursor: pointer
```

### Pressed/Active
```css
background: primary.700 (#0369A1)
shadow: shadows.sm
transform: translateY(0) scale(0.98)
```

### Focus
```css
outline: 2px solid primary.300
outline-offset: 2px
/* Maintains normal appearance otherwise */
```

### Disabled
```css
background: neutral.300 (#D1D5DB)
color: neutral.500 (#6B7280)
cursor: not-allowed
opacity: 0.6
pointer-events: none
```

### Loading
```css
/* Same as normal but with spinner */
cursor: wait
opacity: 0.8
pointer-events: none
/* Spinner icon animates with spin keyframe */
```

## Accessibility

### ARIA Attributes
```html
<button
  type="button"
  role="button"
  aria-label="Descriptive action"
  aria-disabled="false"
  aria-busy="false"
>
```

### Keyboard Navigation
- **Tab**: Focus on button
- **Enter/Space**: Activate button
- **Shift+Tab**: Focus previous element

### Requirements
- Minimum touch target: 44x44px (iOS) / 48x48px (Android)
- Color contrast ratio: 4.5:1 minimum (WCAG AA)
- Focus indicator: Visible 2px outline
- Screen reader: Descriptive label, state announcements

## Icon Buttons

### With Icon
- Icon left: 16px icon + 8px gap + text
- Icon right: text + 8px gap + 16px icon
- Icon only: 40x40px minimum, aria-label required

## Code Examples

### Web (Svelte)
```svelte
<script>
  import { Button } from '$lib/components/design-system';
  
  let loading = false;
  
  function handleClick() {
    loading = true;
    // Perform action
  }
</script>

<Button 
  variant="primary" 
  size="medium"
  {loading}
  disabled={false}
  on:click={handleClick}
>
  Submit
</Button>
```

### iOS (SwiftUI)
```swift
Button(action: {
    // Perform action
}) {
    Text("Submit")
        .font(.body)
        .fontWeight(.semibold)
        .foregroundColor(.white)
        .frame(height: 40)
        .padding(.horizontal, 24)
        .background(Color("Primary500"))
        .cornerRadius(6)
}
.buttonStyle(PrimaryButtonStyle())
```

### Android (Jetpack Compose)
```kotlin
Button(
    onClick = { /* Perform action */ },
    modifier = Modifier
        .height(40.dp)
        .padding(horizontal = 24.dp),
    colors = ButtonDefaults.buttonColors(
        containerColor = Primary500
    ),
    shape = RoundedCornerShape(6.dp)
) {
    Text(
        "Submit",
        style = MaterialTheme.typography.button
    )
}
```

## Best Practices

### Do ✓
- Use clear, action-oriented labels ("Save Changes", "Send Message")
- Provide loading feedback for async actions
- Maintain consistent button hierarchy per screen
- Use primary buttons sparingly (one per section)
- Include icon for better scannability when appropriate

### Don't ✗
- Use multiple primary buttons in close proximity
- Make buttons too small (below minimum touch target)
- Use vague labels ("OK", "Submit", "Click Here")
- Disable buttons without explanation
- Override focus states (accessibility issue)

## Related Components
- **IconButton**: Button with icon only
- **ButtonGroup**: Multiple buttons in a group
- **FAB**: Floating action button (mobile)
- **Link**: Text-only navigation links
