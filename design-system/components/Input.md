# Input Component

Text input fields for forms and data entry.

## Variants

### Text Input
- **Purpose**: Single-line text entry
- **Type**: `text`, `email`, `password`, `tel`, `url`, `number`

### Text Area
- **Purpose**: Multi-line text entry
- **Rows**: Minimum 3, expandable

### Search Input
- **Purpose**: Search queries
- **Icon**: Search icon (left)
- **Clear**: Clear button (right, when filled)

## Sizes

### Large
- **Height**: 48px
- **Padding**: 12px 16px
- **Font**: 18px
- **Usage**: Hero sections, primary forms

### Medium (Default)
- **Height**: 40px
- **Padding**: 10px 12px
- **Font**: 16px
- **Usage**: Standard forms

### Small
- **Height**: 32px
- **Padding**: 6px 10px
- **Font**: 14px
- **Usage**: Compact forms, filters

## States

### Normal (Empty)
```css
background: neutral.0 (#FFFFFF)
border: 1px solid neutral.300 (#D1D5DB)
border-radius: borderRadius.md (6px)
color: neutral.900 (#111827)
placeholder-color: neutral.400 (#9CA3AF)
```

### Hover
```css
border-color: neutral.400 (#9CA3AF)
cursor: text
```

### Focus
```css
border-color: primary.500 (#0EA5E9)
border-width: 2px
outline: none
box-shadow: 0 0 0 3px rgba(14, 165, 233, 0.1)
/* Padding adjusts to compensate for border width change */
```

### Filled (With Value)
```css
/* Same as normal */
color: neutral.900 (#111827)
```

### Disabled
```css
background: neutral.100 (#F3F4F6)
border-color: neutral.300 (#D1D5DB)
color: neutral.500 (#6B7280)
cursor: not-allowed
```

### Error
```css
border-color: semantic.error.500 (#EF4444)
border-width: 2px
/* Optional error icon on right */
```

### Success
```css
border-color: semantic.success.500 (#22C55E)
border-width: 2px
/* Optional success icon on right */
```

### Read-Only
```css
background: neutral.50 (#F9FAFB)
border-color: neutral.200 (#E5E7EB)
cursor: default
```

## Components

### Label
```css
font: textStyles.label (14px, medium, uppercase)
color: neutral.700 (#374151)
margin-bottom: spacing.2 (8px)
/* Required indicator (*) in error.500 if required */
```

### Helper Text
```css
font: textStyles.caption (12px)
color: neutral.600 (#4B5563)
margin-top: spacing.1 (4px)
```

### Error Message
```css
font: textStyles.caption (12px)
color: semantic.error.600 (#DC2626)
margin-top: spacing.1 (4px)
/* Display with error icon */
```

### Character Counter
```css
font: textStyles.caption (12px)
color: neutral.500 (#6B7280)
margin-top: spacing.1 (4px)
text-align: right
/* Example: "24/100" */
```

## Icons

### Left Icon
- **Size**: 20px
- **Position**: 12px from left edge
- **Color**: `neutral.500`
- **Input padding-left**: 44px (to account for icon)

### Right Icon
- **Size**: 20px
- **Position**: 12px from right edge
- **Color**: `neutral.500`
- **Input padding-right**: 44px

### Clear Button
- **Visibility**: Only when input has value
- **Icon**: X icon (20px)
- **Action**: Clear input value
- **Interactive**: Hover changes color to neutral.700

## Accessibility

### ARIA Attributes
```html
<div class="input-group">
  <label for="email" id="email-label">
    Email Address <span aria-label="required">*</span>
  </label>
  <input
    id="email"
    type="email"
    aria-labelledby="email-label"
    aria-describedby="email-helper email-error"
    aria-required="true"
    aria-invalid="false"
    autocomplete="email"
  />
  <span id="email-helper" class="helper-text">
    We'll never share your email
  </span>
  <span id="email-error" class="error-message" role="alert">
    Please enter a valid email address
  </span>
</div>
```

### Keyboard Navigation
- **Tab**: Focus on input
- **Shift+Tab**: Focus previous element
- **Escape**: Clear input (if clearable)
- **Arrow keys**: Navigate text cursor

### Requirements
- Label associated with input (for/id or aria-label)
- Error messages announced to screen readers (role="alert")
- Autocomplete attributes for common fields
- Color contrast: 4.5:1 for text, 3:1 for borders

## Input Types

### Email
```html
<input type="email" autocomplete="email" inputmode="email" />
```

### Password
```html
<input type="password" autocomplete="current-password" />
<!-- Toggle visibility button (eye icon) -->
```

### Phone
```html
<input type="tel" autocomplete="tel" inputmode="tel" />
```

### Number
```html
<input type="number" inputmode="numeric" />
<!-- Optional step buttons -->
```

### URL
```html
<input type="url" inputmode="url" />
```

## Code Examples

### Web (Svelte)
```svelte
<script>
  import { Input } from '$lib/components/design-system';
  
  let email = '';
  let error = '';
  
  function validateEmail() {
    if (!email.includes('@')) {
      error = 'Please enter a valid email address';
    } else {
      error = '';
    }
  }
</script>

<Input
  id="email"
  type="email"
  label="Email Address"
  bind:value={email}
  {error}
  helperText="We'll never share your email"
  required
  placeholder="you@example.com"
  on:blur={validateEmail}
/>
```

### iOS (SwiftUI)
```swift
struct DSInput: View {
    @Binding var text: String
    let label: String
    let placeholder: String
    @State private var isFocused = false
    
    var body: some View {
        VStack(alignment: .leading, spacing: 8) {
            Text(label.uppercased())
                .font(.caption)
                .fontWeight(.medium)
                .foregroundColor(Color("Neutral700"))
            
            TextField(placeholder, text: $text)
                .padding(10)
                .background(Color.white)
                .cornerRadius(6)
                .overlay(
                    RoundedRectangle(cornerRadius: 6)
                        .stroke(isFocused ? Color("Primary500") : Color("Neutral300"), lineWidth: isFocused ? 2 : 1)
                )
        }
    }
}
```

### Android (Jetpack Compose)
```kotlin
@Composable
fun DSInput(
    value: String,
    onValueChange: (String) -> Unit,
    label: String,
    placeholder: String = "",
    error: String? = null,
    modifier: Modifier = Modifier
) {
    Column(modifier = modifier) {
        Text(
            text = label.uppercase(),
            style = MaterialTheme.typography.caption,
            color = Neutral700
        )
        Spacer(modifier = Modifier.height(8.dp))
        TextField(
            value = value,
            onValueChange = onValueChange,
            placeholder = { Text(placeholder) },
            isError = error != null,
            modifier = Modifier.fillMaxWidth(),
            shape = RoundedCornerShape(6.dp),
            colors = TextFieldDefaults.colors(
                focusedIndicatorColor = Primary500,
                unfocusedIndicatorColor = Neutral300
            )
        )
        if (error != null) {
            Text(
                text = error,
                style = MaterialTheme.typography.caption,
                color = Error500,
                modifier = Modifier.padding(top = 4.dp)
            )
        }
    }
}
```

## Best Practices

### Do ✓
- Always include visible labels
- Provide clear placeholder text as examples
- Show inline validation (on blur)
- Use appropriate input types and autocomplete
- Provide helpful error messages with solutions
- Use character counters for length-limited fields

### Don't ✗
- Use placeholder as the only label
- Validate while user is still typing
- Hide error messages on re-focus
- Use generic error messages ("Invalid input")
- Make required fields unclear
- Use too many required fields

## Validation

### On Blur (Recommended)
- Validate when user leaves the field
- Immediate feedback without interruption
- Best user experience

### On Submit
- Validate all fields on form submission
- Scroll to first error
- Focus on first error field

### Real-time (Use Sparingly)
- Only for specific cases (username availability, password strength)
- Don't show errors while typing
- Show success states progressively

## Related Components
- **Select**: Dropdown selection
- **Textarea**: Multi-line input
- **SearchInput**: Search-specific input
- **DatePicker**: Date selection input
- **FileUpload**: File upload input
