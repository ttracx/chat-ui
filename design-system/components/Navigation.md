# Navigation Components

Top-level and contextual navigation patterns.

## Navigation Bar (Header)

### Desktop Navigation
- **Height**: 64px
- **Padding**: `spacing.4` (16px) horizontal
- **Background**: `neutral.0` or `primary.600`
- **Shadow**: `shadows.sm`
- **Position**: Fixed or sticky

### Anatomy
```
[Logo] [Nav Links] [Spacer] [Search] [User Menu]
```

### Elements

#### Logo/Brand
- **Size**: 32px height
- **Position**: Left-aligned
- **Link**: Home page
- **Padding**: 16px

#### Navigation Links
- **Font**: `textStyles.body` (16px, medium)
- **Spacing**: 24px between items
- **States**: Normal, Hover, Active, Focus

#### User Menu
- **Position**: Right-aligned
- **Elements**: Notifications, Avatar, Dropdown
- **Avatar**: 36px circle

### States

#### Nav Link - Normal
```css
color: neutral.700
text-decoration: none
padding: spacing.2 spacing.4
border-radius: borderRadius.md
```

#### Nav Link - Hover
```css
background: neutral.100
color: primary.600
```

#### Nav Link - Active
```css
color: primary.600
font-weight: semibold
border-bottom: 3px solid primary.600
```

#### Nav Link - Focus
```css
outline: 2px solid primary.300
outline-offset: 2px
```

## Mobile Navigation

### Hamburger Menu
- **Icon**: ☰ (24px)
- **Position**: Top-left or top-right
- **Action**: Opens drawer/menu

### Mobile Drawer
- **Width**: 280px or 80% of screen
- **Animation**: Slide in from left/right
- **Backdrop**: `overlay.medium`
- **Items**: Vertical stack with icons

## Tab Bar (Bottom Navigation - Mobile)

### Anatomy
- **Height**: 56px
- **Items**: 3-5 items (optimal: 4)
- **Position**: Fixed bottom
- **Background**: `neutral.0`
- **Shadow**: `shadows.md` (inverted)

### Tab Item
```css
/* Normal */
.tab-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: spacing.1;
  padding: spacing.2;
  color: neutral.500;
}

/* Active */
.tab-item.active {
  color: primary.600;
  
  .icon {
    /* Fill icon instead of outline */
  }
}

/* Icon */
.tab-icon {
  size: 24px;
}

/* Label */
.tab-label {
  font-size: 12px;
  font-weight: medium;
}
```

## Breadcrumb

### Structure
```
Home > Category > Subcategory > Current Page
```

### Styling
```css
.breadcrumb {
  display: flex;
  align-items: center;
  gap: spacing.2;
  font-size: 14px;
  color: neutral.600;
}

.breadcrumb-item {
  color: neutral.600;
  
  &:hover {
    color: primary.600;
    text-decoration: underline;
  }
  
  &.active {
    color: neutral.900;
    font-weight: medium;
    pointer-events: none;
  }
}

.breadcrumb-separator {
  color: neutral.400;
  user-select: none;
}
```

## Sidebar Navigation

### Layout
- **Width**: 240px (collapsed: 64px)
- **Position**: Fixed left
- **Background**: `neutral.50`
- **Border-right**: `1px solid neutral.200`

### Nav Item
```css
.sidebar-item {
  display: flex;
  align-items: center;
  gap: spacing.3;
  padding: spacing.3 spacing.4;
  color: neutral.700;
  border-radius: borderRadius.md;
  margin: spacing.1 spacing.2;
  
  /* Icon */
  .icon {
    size: 20px;
    flex-shrink: 0;
  }
  
  /* Label */
  .label {
    font-size: 14px;
    font-weight: medium;
  }
  
  /* Hover */
  &:hover {
    background: neutral.100;
    color: primary.600;
  }
  
  /* Active */
  &.active {
    background: primary.50;
    color: primary.600;
    border-left: 3px solid primary.600;
  }
}
```

### Collapsible Groups
```css
.nav-group {
  margin-bottom: spacing.4;
  
  .group-title {
    font-size: 12px;
    font-weight: semibold;
    color: neutral.500;
    text-transform: uppercase;
    padding: spacing.2 spacing.4;
    margin-bottom: spacing.1;
  }
}
```

## Accessibility

### Navigation Bar
```html
<nav role="navigation" aria-label="Main navigation">
  <ul role="list">
    <li>
      <a href="/" aria-current="page">Home</a>
    </li>
    <li>
      <a href="/products">Products</a>
    </li>
  </ul>
</nav>
```

### Tab Bar
```html
<nav role="tablist" aria-label="Primary navigation">
  <a
    href="/home"
    role="tab"
    aria-selected="true"
    aria-label="Home"
  >
    <svg aria-hidden="true">...</svg>
    <span>Home</span>
  </a>
</nav>
```

### Breadcrumb
```html
<nav aria-label="Breadcrumb">
  <ol role="list">
    <li>
      <a href="/">Home</a>
    </li>
    <li aria-hidden="true">/</li>
    <li>
      <a href="/category">Category</a>
    </li>
    <li aria-hidden="true">/</li>
    <li aria-current="page">Current Page</li>
  </ol>
</nav>
```

### Keyboard Navigation
- **Tab**: Next nav item
- **Shift+Tab**: Previous nav item
- **Enter/Space**: Activate link
- **Arrow keys**: Navigate within menu (for dropdowns)
- **Escape**: Close dropdown/drawer

## Code Examples

### Web (Svelte)
```svelte
<script>
  import { page } from '$app/stores';
  import { Nav, NavLink, UserMenu } from '$lib/components/design-system';
  
  const navItems = [
    { label: 'Home', href: '/' },
    { label: 'Products', href: '/products' },
    { label: 'About', href: '/about' },
    { label: 'Contact', href: '/contact' }
  ];
</script>

<Nav>
  <a href="/" class="logo">
    <img src="/logo.svg" alt="VibeCaaS" />
  </a>
  
  <ul class="nav-links">
    {#each navItems as item}
      <li>
        <NavLink
          href={item.href}
          active={$page.url.pathname === item.href}
        >
          {item.label}
        </NavLink>
      </li>
    {/each}
  </ul>
  
  <div class="nav-actions">
    <SearchInput />
    <UserMenu />
  </div>
</Nav>
```

### iOS (SwiftUI)
```swift
struct DSTabBar: View {
    @Binding var selectedTab: Tab
    
    enum Tab {
        case home, search, notifications, profile
    }
    
    var body: some View {
        HStack(spacing: 0) {
            TabBarItem(
                icon: "house",
                label: "Home",
                isSelected: selectedTab == .home
            ) {
                selectedTab = .home
            }
            
            TabBarItem(
                icon: "magnifyingglass",
                label: "Search",
                isSelected: selectedTab == .search
            ) {
                selectedTab = .search
            }
            
            TabBarItem(
                icon: "bell",
                label: "Notifications",
                isSelected: selectedTab == .notifications
            ) {
                selectedTab = .notifications
            }
            
            TabBarItem(
                icon: "person",
                label: "Profile",
                isSelected: selectedTab == .profile
            ) {
                selectedTab = .profile
            }
        }
        .frame(height: 56)
        .background(Color.white)
        .shadow(radius: 8)
    }
}

struct TabBarItem: View {
    let icon: String
    let label: String
    let isSelected: Bool
    let action: () -> Void
    
    var body: some View {
        Button(action: action) {
            VStack(spacing: 4) {
                Image(systemName: isSelected ? "\(icon).fill" : icon)
                    .font(.system(size: 24))
                
                Text(label)
                    .font(.caption2)
                    .fontWeight(.medium)
            }
            .frame(maxWidth: .infinity)
            .foregroundColor(isSelected ? Color("Primary600") : Color("Neutral500"))
        }
    }
}
```

### Android (Jetpack Compose)
```kotlin
@Composable
fun DSBottomNavigation(
    selectedTab: Int,
    onTabSelected: (Int) -> Unit,
    modifier: Modifier = Modifier
) {
    NavigationBar(
        modifier = modifier.height(56.dp),
        containerColor = Color.White,
        contentColor = Primary600
    ) {
        NavigationBarItem(
            selected = selectedTab == 0,
            onClick = { onTabSelected(0) },
            icon = {
                Icon(
                    imageVector = Icons.Default.Home,
                    contentDescription = "Home"
                )
            },
            label = { Text("Home") },
            colors = NavigationBarItemDefaults.colors(
                selectedIconColor = Primary600,
                selectedTextColor = Primary600,
                unselectedIconColor = Neutral500,
                unselectedTextColor = Neutral500
            )
        )
        
        NavigationBarItem(
            selected = selectedTab == 1,
            onClick = { onTabSelected(1) },
            icon = {
                Icon(
                    imageVector = Icons.Default.Search,
                    contentDescription = "Search"
                )
            },
            label = { Text("Search") }
        )
        
        // More items...
    }
}
```

## Best Practices

### Do ✓
- Keep navigation consistent across pages
- Indicate current location clearly
- Use descriptive labels (not "Click here")
- Provide keyboard navigation
- Group related items
- Use icons with labels (mobile)
- Make logo/brand clickable (home link)
- Show user's location in hierarchy (breadcrumb)

### Don't ✗
- Use too many top-level nav items (max 7)
- Hide primary navigation on scroll (unless mobile)
- Use ambiguous labels
- Change nav structure between pages
- Use dropdown menus unnecessarily
- Make clickable areas too small
- Forget mobile navigation
- Use icons without labels (unless universal)

## Responsive Patterns

### Desktop (>1024px)
- Full horizontal navigation bar
- All links visible
- Dropdowns for sub-navigation

### Tablet (768px - 1024px)
- Condensed navigation
- Some items in "More" menu
- Hamburger menu optional

### Mobile (<768px)
- Hamburger menu + drawer
- Bottom tab bar for primary actions
- Simplified structure

## Related Components
- **Drawer**: Side panel navigation
- **Menu**: Dropdown navigation
- **Tabs**: Section navigation
- **Breadcrumb**: Hierarchical navigation
