# Android Platform Implementation

Design system implementation for Android applications using Jetpack Compose.

## Installation

### Gradle
```kotlin
// settings.gradle.kts
dependencyResolutionManagement {
    repositories {
        maven { url = uri("https://maven.vibecaas.com/releases") }
    }
}

// app/build.gradle.kts
dependencies {
    implementation("com.vibecaas:design-system:1.0.0")
    
    // Jetpack Compose dependencies
    implementation(platform("androidx.compose:compose-bom:2024.01.00"))
    implementation("androidx.compose.ui:ui")
    implementation("androidx.compose.material3:material3")
    implementation("androidx.compose.ui:ui-tooling-preview")
}
```

## Setup

### Theme Configuration
```kotlin
// MainActivity.kt
class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            DSTheme {
                // Your app content
                AppContent()
            }
        }
    }
}
```

### Material 3 Integration
```kotlin
// DSTheme.kt
@Composable
fun DSTheme(
    darkTheme: Boolean = isSystemInDarkTheme(),
    content: @Composable () -> Unit
) {
    val colorScheme = if (darkTheme) {
        darkColorScheme(
            primary = Primary500,
            onPrimary = Neutral0,
            secondary = Secondary500,
            background = DarkBackground,
            surface = DarkSurface,
            // ... more colors
        )
    } else {
        lightColorScheme(
            primary = Primary500,
            onPrimary = Neutral0,
            secondary = Secondary500,
            background = Neutral0,
            surface = Neutral0,
            // ... more colors
        )
    }
    
    MaterialTheme(
        colorScheme = colorScheme,
        typography = DSTypography,
        shapes = DSShapes,
        content = content
    )
}
```

## Design Tokens

### Colors
```kotlin
// Access design system colors
val primary = DSColor.Primary500
val neutral = DSColor.Neutral900
val success = DSColor.SemanticSuccess

// In Compose
Box(
    modifier = Modifier.background(DSColor.Primary500)
)

// Using Material Theme (recommended)
Box(
    modifier = Modifier.background(MaterialTheme.colorScheme.primary)
)
```

### Typography
```kotlin
// Typography definitions
val DSTypography = Typography(
    displayLarge = TextStyle(
        fontFamily = FontFamily.Default,
        fontWeight = FontWeight.Bold,
        fontSize = 57.sp,
        lineHeight = 64.sp,
    ),
    headlineSmall = TextStyle(
        fontFamily = FontFamily.Default,
        fontWeight = FontWeight.SemiBold,
        fontSize = 24.sp,
        lineHeight = 32.sp,
    ),
    bodyLarge = TextStyle(
        fontFamily = FontFamily.Default,
        fontWeight = FontWeight.Normal,
        fontSize = 16.sp,
        lineHeight = 24.sp,
    ),
    // ... more styles
)

// Usage
Text(
    "Heading",
    style = MaterialTheme.typography.headlineSmall
)

Text(
    "Body text",
    style = MaterialTheme.typography.bodyLarge
)
```

### Spacing
```kotlin
// Spacing values
object DSSpacing {
    val spacing1 = 4.dp
    val spacing2 = 8.dp
    val spacing3 = 12.dp
    val spacing4 = 16.dp
    val spacing6 = 24.dp
    val spacing8 = 32.dp
}

// Usage
Column(
    modifier = Modifier.padding(DSSpacing.spacing6),
    verticalArrangement = Arrangement.spacedBy(DSSpacing.spacing4)
) {
    Text("Item 1")
    Text("Item 2")
}
```

### Effects
```kotlin
// Shapes
val DSShapes = Shapes(
    small = RoundedCornerShape(4.dp),
    medium = RoundedCornerShape(6.dp),
    large = RoundedCornerShape(8.dp),
    extraLarge = RoundedCornerShape(12.dp)
)

// Elevation/Shadows
Card(
    elevation = CardDefaults.cardElevation(
        defaultElevation = 4.dp
    )
) {
    // Content
}
```

## Components

### DSButton
```kotlin
@Composable
fun DSButton(
    text: String,
    onClick: () -> Unit,
    modifier: Modifier = Modifier,
    variant: ButtonVariant = ButtonVariant.Primary,
    size: ButtonSize = ButtonSize.Medium,
    icon: ImageVector? = null,
    iconPosition: IconPosition = IconPosition.Left,
    loading: Boolean = false,
    enabled: Boolean = true,
    fullWidth: Boolean = false
) {
    val colors = when (variant) {
        ButtonVariant.Primary -> ButtonDefaults.buttonColors(
            containerColor = Primary500,
            contentColor = Neutral0
        )
        ButtonVariant.Secondary -> ButtonDefaults.outlinedButtonColors(
            contentColor = Primary600
        )
        ButtonVariant.Destructive -> ButtonDefaults.buttonColors(
            containerColor = Error500
        )
    }
    
    val height = when (size) {
        ButtonSize.Small -> 32.dp
        ButtonSize.Medium -> 40.dp
        ButtonSize.Large -> 48.dp
    }
    
    Button(
        onClick = onClick,
        modifier = modifier
            .height(height)
            .then(if (fullWidth) Modifier.fillMaxWidth() else Modifier),
        colors = colors,
        enabled = enabled && !loading,
        shape = RoundedCornerShape(6.dp)
    ) {
        if (loading) {
            CircularProgressIndicator(
                modifier = Modifier.size(20.dp),
                color = if (variant == ButtonVariant.Secondary) 
                    Primary600 else Neutral0,
                strokeWidth = 2.dp
            )
        } else {
            if (icon != null && iconPosition == IconPosition.Left) {
                Icon(
                    imageVector = icon,
                    contentDescription = null,
                    modifier = Modifier.size(20.dp)
                )
                Spacer(modifier = Modifier.width(8.dp))
            }
            
            Text(
                text = text,
                style = MaterialTheme.typography.labelLarge
            )
            
            if (icon != null && iconPosition == IconPosition.Right) {
                Spacer(modifier = Modifier.width(8.dp))
                Icon(
                    imageVector = icon,
                    contentDescription = null,
                    modifier = Modifier.size(20.dp)
                )
            }
        }
    }
}

// Usage
DSButton(
    text = "Submit",
    onClick = { handleSubmit() },
    variant = ButtonVariant.Primary,
    size = ButtonSize.Medium
)

DSButton(
    text = "Add Item",
    onClick = { handleAdd() },
    icon = Icons.Default.Add,
    loading = isLoading
)
```

### DSTextField
```kotlin
@Composable
fun DSTextField(
    value: String,
    onValueChange: (String) -> Unit,
    modifier: Modifier = Modifier,
    label: String,
    placeholder: String = "",
    error: String? = null,
    helperText: String? = null,
    leadingIcon: ImageVector? = null,
    keyboardType: KeyboardType = KeyboardType.Text,
    visualTransformation: VisualTransformation = VisualTransformation.None,
    enabled: Boolean = true
) {
    Column(modifier = modifier) {
        // Label
        Text(
            text = label.uppercase(),
            style = MaterialTheme.typography.labelMedium,
            color = Neutral700,
            modifier = Modifier.padding(bottom = 8.dp)
        )
        
        // Text field
        TextField(
            value = value,
            onValueChange = onValueChange,
            modifier = Modifier.fillMaxWidth(),
            placeholder = { Text(placeholder) },
            leadingIcon = leadingIcon?.let {
                { Icon(it, contentDescription = null) }
            },
            isError = error != null,
            enabled = enabled,
            visualTransformation = visualTransformation,
            keyboardOptions = KeyboardOptions(
                keyboardType = keyboardType
            ),
            shape = RoundedCornerShape(6.dp),
            colors = TextFieldDefaults.colors(
                focusedIndicatorColor = Primary500,
                unfocusedIndicatorColor = Neutral300,
                errorIndicatorColor = Error500
            )
        )
        
        // Helper text or error
        if (error != null) {
            Text(
                text = error,
                style = MaterialTheme.typography.bodySmall,
                color = Error600,
                modifier = Modifier.padding(top = 4.dp)
            )
        } else if (helperText != null) {
            Text(
                text = helperText,
                style = MaterialTheme.typography.bodySmall,
                color = Neutral600,
                modifier = Modifier.padding(top = 4.dp)
            )
        }
    }
}

// Usage
var email by remember { mutableStateOf("") }
var emailError by remember { mutableStateOf<String?>(null) }

DSTextField(
    value = email,
    onValueChange = { email = it },
    label = "Email Address",
    placeholder = "you@example.com",
    error = emailError,
    helperText = "We'll never share your email",
    leadingIcon = Icons.Default.Email,
    keyboardType = KeyboardType.Email
)
```

### DSCard
```kotlin
@Composable
fun DSCard(
    modifier: Modifier = Modifier,
    variant: CardVariant = CardVariant.Elevated,
    onClick: (() -> Unit)? = null,
    content: @Composable ColumnScope.() -> Unit
) {
    val elevation = when (variant) {
        CardVariant.Basic -> 2.dp
        CardVariant.Elevated -> 4.dp
        CardVariant.Outlined -> 0.dp
    }
    
    Card(
        modifier = modifier
            .fillMaxWidth()
            .then(
                if (onClick != null) {
                    Modifier.clickable { onClick() }
                } else {
                    Modifier
                }
            ),
        shape = RoundedCornerShape(8.dp),
        elevation = CardDefaults.cardElevation(
            defaultElevation = elevation
        ),
        border = if (variant == CardVariant.Outlined) {
            BorderStroke(1.dp, Neutral200)
        } else null
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
DSCard(
    variant = CardVariant.Elevated,
    onClick = { handleCardClick() }
) {
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
    
    Row(
        modifier = Modifier.fillMaxWidth(),
        horizontalArrangement = Arrangement.End
    ) {
        DSButton(
            text = "Action",
            onClick = { handleAction() },
            variant = ButtonVariant.Primary
        )
    }
}
```

### DSModal (Dialog)
```kotlin
@Composable
fun DSModal(
    isOpen: Boolean,
    onDismiss: () -> Unit,
    title: String,
    confirmText: String = "Confirm",
    cancelText: String = "Cancel",
    onConfirm: () -> Unit,
    content: @Composable () -> Unit
) {
    if (isOpen) {
        Dialog(
            onDismissRequest = onDismiss,
            properties = DialogProperties(
                dismissOnBackPress = true,
                dismissOnClickOutside = true,
                usePlatformDefaultWidth = false
            )
        ) {
            Card(
                modifier = Modifier
                    .fillMaxWidth(0.9f)
                    .wrapContentHeight(),
                shape = RoundedCornerShape(12.dp),
                elevation = CardDefaults.cardElevation(20.dp)
            ) {
                Column {
                    // Header
                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(24.dp),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Text(
                            text = title,
                            style = MaterialTheme.typography.titleLarge,
                            fontWeight = FontWeight.SemiBold
                        )
                        
                        IconButton(onClick = onDismiss) {
                            Icon(
                                imageVector = Icons.Default.Close,
                                contentDescription = "Close"
                            )
                        }
                    }
                    
                    Divider()
                    
                    // Body
                    Box(
                        modifier = Modifier
                            .verticalScroll(rememberScrollState())
                            .padding(24.dp)
                    ) {
                        content()
                    }
                    
                    Divider()
                    
                    // Footer
                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(24.dp),
                        horizontalArrangement = Arrangement.End,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        TextButton(onClick = onDismiss) {
                            Text(cancelText)
                        }
                        
                        Spacer(modifier = Modifier.width(12.dp))
                        
                        DSButton(
                            text = confirmText,
                            onClick = {
                                onConfirm()
                                onDismiss()
                            },
                            variant = ButtonVariant.Primary
                        )
                    }
                }
            }
        }
    }
}

// Usage
var showModal by remember { mutableStateOf(false) }

DSButton(
    text = "Open Modal",
    onClick = { showModal = true }
)

DSModal(
    isOpen = showModal,
    onDismiss = { showModal = false },
    title = "Confirm Action",
    onConfirm = { handleConfirm() }
) {
    Text("Are you sure you want to continue?")
}
```

### DSBottomNavigation
```kotlin
@Composable
fun DSBottomNavigation(
    selectedTab: Int,
    onTabSelected: (Int) -> Unit,
    items: List<BottomNavItem>
) {
    NavigationBar(
        modifier = Modifier.height(56.dp),
        containerColor = Color.White,
        contentColor = Primary600
    ) {
        items.forEachIndexed { index, item ->
            NavigationBarItem(
                selected = selectedTab == index,
                onClick = { onTabSelected(index) },
                icon = {
                    Icon(
                        imageVector = item.icon,
                        contentDescription = item.label
                    )
                },
                label = { Text(item.label) },
                colors = NavigationBarItemDefaults.colors(
                    selectedIconColor = Primary600,
                    selectedTextColor = Primary600,
                    unselectedIconColor = Neutral500,
                    unselectedTextColor = Neutral500,
                    indicatorColor = Primary50
                )
            )
        }
    }
}

data class BottomNavItem(
    val icon: ImageVector,
    val label: String
)

// Usage
val navItems = listOf(
    BottomNavItem(Icons.Default.Home, "Home"),
    BottomNavItem(Icons.Default.Search, "Search"),
    BottomNavItem(Icons.Default.Notifications, "Alerts"),
    BottomNavItem(Icons.Default.Person, "Profile")
)

var selectedTab by remember { mutableStateOf(0) }

Scaffold(
    bottomBar = {
        DSBottomNavigation(
            selectedTab = selectedTab,
            onTabSelected = { selectedTab = it },
            items = navItems
        )
    }
) { paddingValues ->
    // Content
}
```

## Layouts

### Responsive Grid
```kotlin
@Composable
fun DSGrid(
    columns: Int = 2,
    spacing: Dp = DSSpacing.spacing4,
    content: @Composable () -> Unit
) {
    LazyVerticalGrid(
        columns = GridCells.Fixed(columns),
        horizontalArrangement = Arrangement.spacedBy(spacing),
        verticalArrangement = Arrangement.spacedBy(spacing),
        contentPadding = PaddingValues(DSSpacing.spacing4)
    ) {
        items(content)
    }
}
```

## Animations

### Transitions
```kotlin
@Composable
fun AnimatedContent(
    visible: Boolean,
    content: @Composable () -> Unit
) {
    AnimatedVisibility(
        visible = visible,
        enter = fadeIn(animationSpec = tween(200)) + 
                slideInVertically(animationSpec = tween(200)),
        exit = fadeOut(animationSpec = tween(100)) + 
               slideOutVertically(animationSpec = tween(100))
    ) {
        content()
    }
}
```

## Accessibility

### Content Descriptions
```kotlin
Icon(
    imageVector = Icons.Default.Delete,
    contentDescription = "Delete item",
    modifier = Modifier.clickable { handleDelete() }
)
```

### Semantic Properties
```kotlin
Text(
    "Important message",
    modifier = Modifier.semantics {
        contentDescription = "Important: Message for user"
        heading()
    }
)
```

## Best Practices

### Do ✓
- Follow Material Design 3 guidelines
- Use Jetpack Compose best practices
- Support dark theme
- Implement accessibility features
- Test on multiple screen sizes
- Use state hoisting
- Leverage remember and rememberSaveable
- Follow single source of truth principle

### Don't ✗
- Hard-code colors or dimensions
- Ignore accessibility
- Skip edge-to-edge layout
- Forget to handle configuration changes
- Block the main thread
- Create deeply nested layouts
- Ignore platform conventions

## Related Documentation
- [Component Library](../../components/README.md)
- [Design Tokens](../../tokens/README.md)
- [Material Design 3](https://m3.material.io/)
- [Jetpack Compose Documentation](https://developer.android.com/jetpack/compose)
