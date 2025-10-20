# Icon System

Comprehensive, scalable icon library for all platforms.

## Icon Specifications

### Sizes
- **xs**: 12px
- **sm**: 16px
- **md**: 20px (default)
- **lg**: 24px
- **xl**: 32px
- **2xl**: 48px

### Grid System
- Icons designed on 24x24px grid
- 2px padding on all sides
- 20px active drawing area
- Pixel-perfect at base size

### Stroke Width
- **Outline icons**: 1.5px stroke (default)
- **Bold icons**: 2px stroke
- **Thin icons**: 1px stroke

### Style
- **Outline**: Default style, stroke-based
- **Filled**: Solid fill for active states
- **Duotone**: Two-color variation

## Categories

### Interface Icons
- Navigation (chevrons, arrows, hamburger)
- Actions (add, edit, delete, save, close)
- Media controls (play, pause, stop, volume)
- File operations (upload, download, folder, file)

### Communication
- Messages, mail, notifications
- Phone, video call, chat
- Share, send, forward

### User & Account
- User, profile, avatar
- Login, logout, authentication
- Settings, preferences

### Content
- Text formatting (bold, italic, list)
- Alignment, layout
- Image, video, document

### Status & Feedback
- Success, error, warning, info
- Loading, progress
- Check, close, alert

### Commerce
- Cart, bag, shopping
- Payment, credit card
- Star, heart (favorites)

## Naming Convention

### Format
```
{category}-{name}-{variant}
```

### Examples
- `navigation-arrow-right`
- `action-edit-outline`
- `status-check-filled`
- `user-profile-duotone`

### Rules
- Use kebab-case
- Be descriptive and consistent
- Avoid abbreviations
- Include variant suffix

## File Format

### SVG Requirements
```xml
<svg
  xmlns="http://www.w3.org/2000/svg"
  width="24"
  height="24"
  viewBox="0 0 24 24"
  fill="none"
  stroke="currentColor"
  stroke-width="1.5"
  stroke-linecap="round"
  stroke-linejoin="round"
>
  <!-- Icon paths -->
</svg>
```

### Optimization
- Remove unnecessary attributes
- Combine paths where possible
- Use `currentColor` for stroke/fill
- Minify with SVGO

### Export Settings
- **Format**: SVG
- **Artboard**: 24x24px
- **Precision**: 2 decimal places
- **Outline strokes**: No (keep as strokes)
- **Responsive**: Yes (remove width/height in code)

## Platform Implementations

### Web
```svelte
<!-- Svelte component -->
<script>
  export let name = '';
  export let size = 'md';
  export let color = 'currentColor';
</script>

<svg
  class="icon icon-{size}"
  width={sizeMap[size]}
  height={sizeMap[size]}
  style="color: {color}"
>
  <use href="/icons/sprite.svg#{name}" />
</svg>
```

### iOS (SwiftUI)
```swift
// SF Symbols preferred, custom for brand icons
Image(systemName: "arrow.right")
    .font(.system(size: 24))
    .foregroundColor(.primary)

// Custom icons
Image("custom-icon-name")
    .resizable()
    .aspectRatio(contentMode: .fit)
    .frame(width: 24, height: 24)
```

### Android (Jetpack Compose)
```kotlin
// Material Icons preferred
Icon(
    imageVector = Icons.Default.ArrowForward,
    contentDescription = "Next",
    modifier = Modifier.size(24.dp),
    tint = Primary600
)

// Custom icons
Icon(
    painter = painterResource(id = R.drawable.custom_icon),
    contentDescription = "Custom",
    modifier = Modifier.size(24.dp)
)
```

## Icon Components

All components support these icons in appropriate contexts.

### Button Icons
```svelte
<Button icon="action-add">Add Item</Button>
<Button iconPosition="right" icon="navigation-arrow-right">Next</Button>
<IconButton icon="action-delete" aria-label="Delete" />
```

### Input Icons
```svelte
<Input
  icon="interface-search"
  placeholder="Search..."
/>
```

### Status Icons
```svelte
<Alert type="success" icon="status-check-filled">
  Changes saved successfully
</Alert>
```

## Accessibility

### Requirements
- **aria-hidden="true"**: For decorative icons
- **aria-label**: For icon-only buttons
- **title**: For hover tooltips
- **currentColor**: Inherits text color for consistency
- **Minimum size**: 16px for tap targets

### Examples
```html
<!-- Decorative icon (next to text) -->
<button>
  <svg aria-hidden="true">...</svg>
  <span>Save</span>
</button>

<!-- Icon-only button -->
<button aria-label="Close dialog">
  <svg aria-hidden="true">...</svg>
</button>

<!-- With tooltip -->
<svg aria-hidden="true" role="img" aria-label="Information">
  <title>More information</title>
  ...
</svg>
```

## Icon Library

### Navigation Icons
- `navigation-arrow-left`
- `navigation-arrow-right`
- `navigation-arrow-up`
- `navigation-arrow-down`
- `navigation-chevron-left`
- `navigation-chevron-right`
- `navigation-chevron-up`
- `navigation-chevron-down`
- `navigation-menu-hamburger`
- `navigation-menu-dots-vertical`
- `navigation-menu-dots-horizontal`
- `navigation-home`
- `navigation-back`

### Action Icons
- `action-add`
- `action-add-circle`
- `action-edit`
- `action-delete`
- `action-trash`
- `action-save`
- `action-copy`
- `action-paste`
- `action-cut`
- `action-undo`
- `action-redo`
- `action-refresh`
- `action-search`
- `action-filter`
- `action-sort`
- `action-settings`
- `action-more`
- `action-close`
- `action-close-circle`

### User Icons
- `user-profile`
- `user-profile-circle`
- `user-group`
- `user-add`
- `user-remove`
- `user-check`
- `user-settings`

### Communication Icons
- `communication-mail`
- `communication-mail-open`
- `communication-message`
- `communication-chat`
- `communication-notification`
- `communication-notification-off`
- `communication-phone`
- `communication-video`
- `communication-send`
- `communication-share`

### Status Icons
- `status-check`
- `status-check-circle`
- `status-close`
- `status-close-circle`
- `status-info`
- `status-info-circle`
- `status-warning`
- `status-warning-triangle`
- `status-error`
- `status-error-circle`
- `status-success`
- `status-loading`

### Media Icons
- `media-play`
- `media-pause`
- `media-stop`
- `media-skip-forward`
- `media-skip-back`
- `media-volume-high`
- `media-volume-low`
- `media-volume-mute`
- `media-image`
- `media-video`
- `media-music`
- `media-microphone`
- `media-camera`

### File Icons
- `file-document`
- `file-folder`
- `file-folder-open`
- `file-upload`
- `file-download`
- `file-pdf`
- `file-image`
- `file-video`
- `file-audio`
- `file-zip`
- `file-code`

### Commerce Icons
- `commerce-cart`
- `commerce-bag`
- `commerce-card`
- `commerce-star`
- `commerce-star-filled`
- `commerce-heart`
- `commerce-heart-filled`
- `commerce-tag`
- `commerce-ticket`
- `commerce-gift`

### Interface Icons
- `interface-calendar`
- `interface-clock`
- `interface-map`
- `interface-location`
- `interface-bookmark`
- `interface-bookmark-filled`
- `interface-flag`
- `interface-eye`
- `interface-eye-off`
- `interface-lock`
- `interface-unlock`
- `interface-link`
- `interface-external-link`

## Usage Guidelines

### Do ✓
- Use consistent icon style throughout app
- Size icons appropriately for context
- Provide labels for icon-only buttons
- Use filled variants for active states
- Test icons at target size
- Provide sufficient color contrast

### Don't ✗
- Mix outline and filled styles randomly
- Make icons too small (<16px for interactive)
- Use icons without clear meaning
- Forget aria-labels for screen readers
- Use too many custom icons
- Rely solely on color to convey meaning

## Custom Icon Creation

### Design Process
1. **Sketch**: Draw on 24x24px grid
2. **Refine**: Align to pixel grid, consistent stroke
3. **Export**: SVG with proper attributes
4. **Optimize**: Run through SVGO
5. **Test**: View at all sizes
6. **Document**: Add to library with description

### Quality Checklist
- [ ] Fits 24x24px grid
- [ ] 2px padding on all sides
- [ ] Consistent stroke width
- [ ] Pixel-perfect at base size
- [ ] Uses `currentColor`
- [ ] Optimized file size
- [ ] Descriptive name
- [ ] Accessible markup

## Icon Sprite Generation

### Build Script
```javascript
// scripts/build-icon-sprite.js
import { readdir, writeFile } from 'fs/promises';
import { join } from 'path';

async function buildSprite() {
  const iconDir = 'design-system/assets/icons';
  const files = await readdir(iconDir);
  const svgFiles = files.filter(f => f.endsWith('.svg'));
  
  let sprite = '<svg xmlns="http://www.w3.org/2000/svg">\n';
  
  for (const file of svgFiles) {
    const content = await readFile(join(iconDir, file), 'utf-8');
    const id = file.replace('.svg', '');
    const symbol = content
      .replace('<svg', `<symbol id="${id}"`)
      .replace('</svg>', '</symbol>');
    sprite += symbol + '\n';
  }
  
  sprite += '</svg>';
  
  await writeFile('static/icons/sprite.svg', sprite);
}
```

## Related Documentation
- [Component Library](../components/README.md)
- [Design Tokens](../tokens/README.md)
- [Accessibility Guidelines](../guidelines/accessibility.md)
