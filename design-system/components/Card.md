# Card Component

Content container for grouping related information.

## Variants

### Basic Card
- **Purpose**: Simple content grouping
- **Background**: `neutral.0` (white)
- **Border**: `1px solid neutral.200`
- **Shadow**: `shadows.sm`

### Elevated Card
- **Purpose**: Emphasized content, raised appearance
- **Background**: `neutral.0`
- **Border**: None
- **Shadow**: `shadows.md`

### Outlined Card
- **Purpose**: Subtle grouping without shadow
- **Background**: `neutral.0`
- **Border**: `2px solid neutral.200`
- **Shadow**: None

### Interactive Card
- **Purpose**: Clickable cards (links, selections)
- **Background**: `neutral.0`
- **Border**: `1px solid neutral.200`
- **Shadow**: `shadows.sm`
- **Cursor**: pointer

### Featured Card
- **Purpose**: Highlighted or premium content
- **Background**: `primary.50`
- **Border**: `2px solid primary.200`
- **Shadow**: `shadows.md`

## Sizes

### Compact
- **Padding**: `spacing.4` (16px)
- **Gap**: `spacing.2` (8px)
- **Usage**: Dense layouts, mobile

### Default
- **Padding**: `spacing.6` (24px)
- **Gap**: `spacing.4` (16px)
- **Usage**: Standard cards

### Spacious
- **Padding**: `spacing.8` (32px)
- **Gap**: `spacing.6` (24px)
- **Usage**: Feature cards, hero sections

## Anatomy

### Card Container
```css
background: neutral.0
border-radius: borderRadius.lg (8px)
padding: spacing.6 (24px)
display: flex
flex-direction: column
gap: spacing.4 (16px)
```

### Card Header
- **Title**: `textStyles.h4` (24px, semibold)
- **Subtitle**: `textStyles.bodySmall` (14px, regular, neutral.600)
- **Action**: Optional action button/icon (right-aligned)

### Card Media
- **Image**: Full-width, rounded corners (top only if first)
- **Aspect Ratio**: 16:9, 4:3, or 1:1
- **Object Fit**: cover

### Card Content
- **Body**: `textStyles.body` (16px)
- **Spacing**: `spacing.4` gap between elements

### Card Footer
- **Alignment**: flex, space-between
- **Actions**: Buttons, links
- **Metadata**: Timestamps, tags

## States

### Normal
```css
background: neutral.0
border: 1px solid neutral.200
shadow: shadows.sm
transition: all duration.fast easing.easeOut
```

### Hover (Interactive)
```css
border-color: neutral.300
shadow: shadows.md
transform: translateY(-2px)
cursor: pointer
```

### Pressed (Interactive)
```css
shadow: shadows.sm
transform: translateY(0) scale(0.99)
```

### Focus (Interactive)
```css
outline: 2px solid primary.300
outline-offset: 2px
```

### Selected
```css
background: primary.50
border: 2px solid primary.500
shadow: shadows.md
```

### Disabled
```css
opacity: 0.6
cursor: not-allowed
pointer-events: none
```

### Loading
```css
/* Skeleton loading state */
/* Content replaced with shimmer placeholders */
```

## Card Types

### Article Card
- Media (image/video)
- Title
- Description
- Author/Date metadata
- Read more link

### Product Card
- Product image
- Title
- Price
- Rating
- Add to cart button

### User Card
- Avatar
- Name
- Role/Title
- Contact actions

### Stat Card
- Icon
- Large number/value
- Label
- Trend indicator (up/down)

## Accessibility

### ARIA Attributes
```html
<!-- Basic card -->
<div class="card" role="article">
  <h3>Card Title</h3>
  <p>Card content...</p>
</div>

<!-- Interactive card -->
<a href="/detail" class="card" role="article">
  <h3>Card Title</h3>
  <p>Card content...</p>
  <span aria-label="Read more about Card Title">
    Read More
  </span>
</a>

<!-- Selectable card -->
<div
  class="card"
  role="button"
  tabindex="0"
  aria-pressed="false"
  onclick="selectCard()"
  onkeypress="handleKeyPress(event)"
>
  <h3>Selectable Card</h3>
</div>
```

### Keyboard Navigation
- **Tab**: Focus on card (if interactive)
- **Enter/Space**: Activate card action
- **Arrow keys**: Navigate between cards in grid

### Requirements
- Clickable area covers entire card
- Focus indicator visible
- Screen reader announces card as single unit
- Meaningful heading structure

## Code Examples

### Web (Svelte)
```svelte
<script>
  import { Card, CardHeader, CardContent, CardFooter } from '$lib/components/design-system';
  
  export let title = '';
  export let description = '';
  export let image = '';
  export let href = undefined;
</script>

<Card {href} variant="elevated">
  {#if image}
    <img src={image} alt="" />
  {/if}
  
  <CardHeader>
    <h3>{title}</h3>
  </CardHeader>
  
  <CardContent>
    <p>{description}</p>
  </CardContent>
  
  <CardFooter>
    <button>Learn More</button>
  </CardFooter>
</Card>
```

### iOS (SwiftUI)
```swift
struct DSCard<Content: View>: View {
    let content: Content
    let variant: CardVariant = .elevated
    var onTap: (() -> Void)?
    
    init(@ViewBuilder content: () -> Content, onTap: (() -> Void)? = nil) {
        self.content = content()
        self.onTap = onTap
    }
    
    var body: some View {
        VStack(alignment: .leading, spacing: 16) {
            content
        }
        .padding(24)
        .background(Color.white)
        .cornerRadius(8)
        .shadow(radius: variant == .elevated ? 4 : 2)
        .onTapGesture {
            onTap?()
        }
    }
}

// Usage
DSCard {
    VStack(alignment: .leading, spacing: 8) {
        Text("Card Title")
            .font(.title3)
            .fontWeight(.semibold)
        
        Text("Card description goes here")
            .font(.body)
            .foregroundColor(Color("Neutral600"))
    }
} onTap: {
    // Handle tap
}
```

### Android (Jetpack Compose)
```kotlin
@Composable
fun DSCard(
    modifier: Modifier = Modifier,
    variant: CardVariant = CardVariant.Elevated,
    onClick: (() -> Unit)? = null,
    content: @Composable ColumnScope.() -> Unit
) {
    Card(
        modifier = modifier
            .fillMaxWidth()
            .clickable(enabled = onClick != null) { onClick?.invoke() },
        shape = RoundedCornerShape(8.dp),
        elevation = CardDefaults.cardElevation(
            defaultElevation = if (variant == CardVariant.Elevated) 4.dp else 2.dp
        ),
        colors = CardDefaults.cardColors(
            containerColor = Color.White
        )
    ) {
        Column(
            modifier = Modifier.padding(24.dp),
            verticalArrangement = Arrangement.spacedBy(16.dp)
        ) {
            content()
        }
    }
}

// Usage
DSCard(onClick = { /* Handle click */ }) {
    Text(
        "Card Title",
        style = MaterialTheme.typography.titleMedium,
        fontWeight = FontWeight.SemiBold
    )
    Text(
        "Card description goes here",
        style = MaterialTheme.typography.bodyMedium,
        color = Neutral600
    )
}
```

## Layouts

### Card Grid
```css
.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: spacing.6 (24px);
}

/* Responsive */
@media (max-width: 768px) {
  .card-grid {
    grid-template-columns: 1fr;
  }
}
```

### Card List
```css
.card-list {
  display: flex;
  flex-direction: column;
  gap: spacing.4 (16px);
}
```

### Horizontal Scroll
```css
.card-carousel {
  display: flex;
  gap: spacing.4 (16px);
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  
  > .card {
    flex: 0 0 300px;
    scroll-snap-align: start;
  }
}
```

## Best Practices

### Do ✓
- Group related content in cards
- Use consistent card sizes in grids
- Provide clear visual hierarchy within cards
- Make entire card clickable (not just title)
- Use appropriate variant for context
- Include meaningful images

### Don't ✗
- Nest cards inside cards (usually)
- Make cards too small or too large
- Use too many different card styles
- Omit padding/spacing inside cards
- Use cards for single pieces of content
- Make non-clickable cards look clickable

## Related Components
- **Modal**: Full-screen overlay card
- **Drawer**: Sliding panel card
- **Accordion**: Collapsible card
- **List**: Simplified card layout
