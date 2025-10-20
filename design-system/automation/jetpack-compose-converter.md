# Jetpack Compose Conversion Guide and Prompts

Automated conversion of designs to Jetpack Compose code for Android applications.

## Overview

This document provides prompts and scripts for converting design system components and screens into production-ready Jetpack Compose code.

## Design-to-Code Conversion Prompts

### Component Conversion Prompt

```markdown
Convert the following design specification to Jetpack Compose code following these requirements:

**Component**: [Component Name]
**Variant**: [e.g., Primary Button, Text Input, Card]

**Design Specifications**:
- Colors: [List colors from design tokens]
- Typography: [Font family, size, weight]
- Spacing: [Padding, margins, gaps]
- Border Radius: [Corner radius values]
- Elevation: [Shadow/elevation values]
- States: [Normal, pressed, disabled, error, etc.]

**Requirements**:
1. Use Material 3 components as base
2. Apply design system tokens (DSColor, DSSpacing, etc.)
3. Support all interaction states with animations
4. Include accessibility (contentDescription, semantics)
5. Follow Jetpack Compose best practices
6. Make reusable with clear parameters
7. Add KDoc documentation
8. Support dark theme
9. Include usage example

**Expected Output**:
- @Composable function
- Required parameters with defaults
- All state variations
- Accessibility support
- Usage example with preview
```

### Screen Conversion Prompt

```markdown
Convert the following screen design to Jetpack Compose implementation:

**Screen**: [Screen Name, e.g., Login, Dashboard]
**Platform**: Android
**Layout**: [Describe layout structure]

**Screen Components**:
[List all components used: TopAppBar, TextField, Button, Card, etc.]

**Layout Structure**:
```
[Provide ASCII layout or description]
```

**State Management**:
- ViewModel: [List required state]
- UI State: [List UI state data class]
- Events: [List user events]

**Interactions**:
[List all user interactions: click, swipe, navigation, etc.]

**Navigation**:
[Describe navigation: NavController, arguments, back stack]

**Requirements**:
1. Use design system components (DS prefix)
2. Implement proper state hoisting
3. Handle loading and error states
4. Support tablet with adaptive layout
5. Include navigation setup
6. Add content descriptions
7. Support dark theme
8. Follow Material Design guidelines

**Expected Output**:
- Main composable screen
- ViewModel (if needed)
- UI state data class
- Navigation setup
- Complete, runnable code
```

## Conversion Scripts

### Token Extractor for Kotlin

```python
#!/usr/bin/env python3
"""
Extract design tokens from JSON and generate Kotlin objects.

Usage: python3 extract_tokens_android.py tokens/colors.json > DSColor.kt
"""

import json
import sys

def hex_to_compose_color(hex_value):
    """Convert hex color to Compose Color format"""
    hex_clean = hex_value.replace('#', '')
    return f"Color(0xFF{hex_clean})"

def generate_compose_colors(colors_json):
    """Generate Jetpack Compose Color objects from colors.json"""
    
    with open(colors_json, 'r') as f:
        data = json.load(f)
    
    output = """package com.vibecaas.designsystem

import androidx.compose.ui.graphics.Color

/**
 * Design System Colors
 * Auto-generated from design tokens
 * Do not edit manually
 */
object DSColor {
    // Primary Colors
"""
    
    # Primary colors
    for shade, info in data['colors']['primary'].items():
        color_name = f"Primary{shade.title()}"
        hex_value = info['value']
        compose_color = hex_to_compose_color(hex_value)
        output += f"    val {color_name} = {compose_color}\n"
    
    output += "\n    // Neutral Colors\n"
    
    # Neutral colors
    for shade, info in data['colors']['neutral'].items():
        color_name = f"Neutral{shade.title()}"
        hex_value = info['value']
        compose_color = hex_to_compose_color(hex_value)
        output += f"    val {color_name} = {compose_color}\n"
    
    output += "\n    // Semantic Colors\n"
    
    # Semantic colors
    for category, shades in data['colors']['semantic'].items():
        category_title = category.title()
        for shade, hex_value in shades.items():
            if shade != 'description' and shade != 'contrast':
                color_name = f"{category_title}{shade.title()}"
                compose_color = hex_to_compose_color(hex_value)
                output += f"    val {color_name} = {compose_color}\n"
    
    output += "}\n"
    
    return output

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python3 extract_tokens_android.py tokens/colors.json")
        sys.exit(1)
    
    print(generate_compose_colors(sys.argv[1]))
```

### Component Generator for Compose

```python
#!/usr/bin/env python3
"""
Generate Jetpack Compose component from specification.

Usage: python3 generate_compose_component.py button.spec.json > DSButton.kt
"""

import json
import sys

def generate_button_component(spec):
    """Generate Jetpack Compose button component from spec"""
    
    return """package com.vibecaas.designsystem.components

import androidx.compose.foundation.layout.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import com.vibecaas.designsystem.DSColor
import com.vibecaas.designsystem.DSSpacing

/**
 * Design System Button Component
 *
 * @param text Button label text
 * @param onClick Click handler
 * @param modifier Modifier to be applied to the button
 * @param variant Button variant (Primary, Secondary, Tertiary, Destructive)
 * @param size Button size (Small, Medium, Large)
 * @param icon Optional icon
 * @param iconPosition Icon position (Left or Right)
 * @param loading Loading state
 * @param enabled Whether button is enabled
 * @param fullWidth Whether button should take full width
 */
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
            containerColor = DSColor.Primary500,
            contentColor = DSColor.Neutral0
        )
        ButtonVariant.Secondary -> ButtonDefaults.outlinedButtonColors(
            contentColor = DSColor.Primary600
        )
        ButtonVariant.Tertiary -> ButtonDefaults.textButtonColors(
            contentColor = DSColor.Primary600
        )
        ButtonVariant.Destructive -> ButtonDefaults.buttonColors(
            containerColor = DSColor.Error500,
            contentColor = DSColor.Neutral0
        )
    }
    
    val height = when (size) {
        ButtonSize.Small -> 32.dp
        ButtonSize.Medium -> 40.dp
        ButtonSize.Large -> 48.dp
    }
    
    val horizontalPadding = when (size) {
        ButtonSize.Small -> 16.dp
        ButtonSize.Medium -> 24.dp
        ButtonSize.Large -> 32.dp
    }
    
    val iconSize = when (size) {
        ButtonSize.Small -> 16.dp
        ButtonSize.Medium -> 20.dp
        ButtonSize.Large -> 24.dp
    }
    
    val buttonModifier = modifier
        .height(height)
        .then(if (fullWidth) Modifier.fillMaxWidth() else Modifier)
    
    when (variant) {
        ButtonVariant.Primary, ButtonVariant.Destructive -> {
            Button(
                onClick = onClick,
                modifier = buttonModifier,
                colors = colors,
                enabled = enabled && !loading,
                contentPadding = PaddingValues(horizontal = horizontalPadding, vertical = 0.dp)
            ) {
                ButtonContent(
                    text = text,
                    icon = icon,
                    iconPosition = iconPosition,
                    iconSize = iconSize,
                    loading = loading,
                    loadingColor = DSColor.Neutral0
                )
            }
        }
        ButtonVariant.Secondary -> {
            OutlinedButton(
                onClick = onClick,
                modifier = buttonModifier,
                colors = colors,
                enabled = enabled && !loading,
                contentPadding = PaddingValues(horizontal = horizontalPadding, vertical = 0.dp)
            ) {
                ButtonContent(
                    text = text,
                    icon = icon,
                    iconPosition = iconPosition,
                    iconSize = iconSize,
                    loading = loading,
                    loadingColor = DSColor.Primary600
                )
            }
        }
        ButtonVariant.Tertiary -> {
            TextButton(
                onClick = onClick,
                modifier = buttonModifier,
                colors = colors,
                enabled = enabled && !loading,
                contentPadding = PaddingValues(horizontal = horizontalPadding, vertical = 0.dp)
            ) {
                ButtonContent(
                    text = text,
                    icon = icon,
                    iconPosition = iconPosition,
                    iconSize = iconSize,
                    loading = loading,
                    loadingColor = DSColor.Primary600
                )
            }
        }
    }
}

@Composable
private fun ButtonContent(
    text: String,
    icon: ImageVector?,
    iconPosition: IconPosition,
    iconSize: Dp,
    loading: Boolean,
    loadingColor: Color
) {
    if (loading) {
        CircularProgressIndicator(
            modifier = Modifier.size(20.dp),
            color = loadingColor,
            strokeWidth = 2.dp
        )
    } else {
        Row(
            horizontalArrangement = Arrangement.spacedBy(8.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            if (icon != null && iconPosition == IconPosition.Left) {
                Icon(
                    imageVector = icon,
                    contentDescription = null,
                    modifier = Modifier.size(iconSize)
                )
            }
            
            Text(
                text = text,
                style = MaterialTheme.typography.labelLarge
            )
            
            if (icon != null && iconPosition == IconPosition.Right) {
                Icon(
                    imageVector = icon,
                    contentDescription = null,
                    modifier = Modifier.size(iconSize)
                )
            }
        }
    }
}

enum class ButtonVariant {
    Primary, Secondary, Tertiary, Destructive
}

enum class ButtonSize {
    Small, Medium, Large
}

enum class IconPosition {
    Left, Right
}

@Preview(showBackground = true)
@Composable
private fun DSButtonPreview() {
    Column(
        modifier = Modifier.padding(16.dp),
        verticalArrangement = Arrangement.spacedBy(16.dp)
    ) {
        DSButton(
            text = "Primary Button",
            onClick = {},
            variant = ButtonVariant.Primary
        )
        
        DSButton(
            text = "Secondary Button",
            onClick = {},
            variant = ButtonVariant.Secondary
        )
        
        DSButton(
            text = "With Icon",
            onClick = {},
            variant = ButtonVariant.Primary,
            icon = Icons.Default.Add
        )
        
        DSButton(
            text = "Loading",
            onClick = {},
            variant = ButtonVariant.Primary,
            loading = true
        )
        
        DSButton(
            text = "Disabled",
            onClick = {},
            variant = ButtonVariant.Primary,
            enabled = false
        )
        
        // Sizes
        DSButton(text = "Small", onClick = {}, size = ButtonSize.Small)
        DSButton(text = "Medium", onClick = {}, size = ButtonSize.Medium)
        DSButton(text = "Large", onClick = {}, size = ButtonSize.Large)
    }
}
"""

if __name__ == "__main__":
    print(generate_button_component(None))
```

## AI Conversion Prompts

### Complete Screen to Jetpack Compose

```
I need to convert a [SCREEN_NAME] screen design to Jetpack Compose. Here are the details:

**Layout**:
[Paste layout description or ASCII diagram]

**Components**:
1. TopAppBar with title "[TITLE]" and [actions]
2. [List all components]

**Color Scheme**:
- Background: [color]
- Primary: [color]
- Text: [color]

**State Management**:
- [List all state variables]
- [List all events/actions]

**Functionality**:
- [List all interactions]
- [List all state changes]
- [List all navigation flows]

Please generate:
1. Main @Composable screen function
2. UI state data class
3. ViewModel with state and events
4. Navigation setup with NavController
5. All sub-composables
6. Preview functions with sample data
7. Accessibility content descriptions
8. Tablet layout adaptations

Use the VibeCaaS Design System components (DSButton, DSTextField, DSCard, etc.) and follow Jetpack Compose best practices including state hoisting and unidirectional data flow.
```

### Figma to Jetpack Compose Conversion

```
Convert this Figma design to Jetpack Compose:

**Figma Link**: [URL]
**Frame**: [Frame name]
**Platform**: Android (Phone/Tablet)

**Design Tokens to Use**:
- Colors: From design-system/tokens/colors.json
- Typography: From design-system/tokens/typography.json
- Spacing: From design-system/tokens/spacing.json

**Requirements**:
1. Extract all colors, text styles, and spacing from design
2. Map to design system tokens (DSColor, DSTypography, DSSpacing)
3. Create composables using Material 3 and DS components
4. Implement all states visible in Figma
5. Add transition animations
6. Support dark theme
7. Include accessibility semantics
8. Support landscape orientation

Output format:
- Package structure
- All Kotlin files
- Resource files needed (if any)
- Integration instructions
```

## Usage Examples

### Convert Tokens
```bash
# Extract colors
python3 automation/extract_tokens_android.py design-system/tokens/colors.json > android/app/src/main/java/com/vibecaas/designsystem/DSColor.kt

# Generate button component
python3 automation/generate_compose_component.py design-system/components/button.spec.json > android/app/src/main/java/com/vibecaas/designsystem/components/DSButton.kt
```

### AI-Assisted Conversion
```
Using ChatGPT/Claude:

1. Provide this document as context
2. Share screen design (image or Figma link)
3. Use conversion prompt above
4. Review and refine generated code
5. Test on emulator/device
6. Integrate into project
```

## Best Practices

### Do ✓
- Use design system components
- Follow Material Design 3 guidelines
- Support all screen sizes
- Include content descriptions
- Add preview functions
- Document complex composables
- Use proper state hoisting
- Support dark theme
- Handle configuration changes

### Don't ✗
- Hard-code colors or dimensions
- Skip accessibility semantics
- Forget tablet layouts
- Ignore platform guidelines
- Create deeply nested composables
- Skip error handling
- Use deprecated APIs
- Block recomposition

## Related Documentation
- [Android Platform Guide](../platforms/android/README.md)
- [Component Library](../components/README.md)
- [Design Tokens](../tokens/README.md)
