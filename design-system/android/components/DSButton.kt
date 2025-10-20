package com.designsystem.components

import androidx.compose.animation.core.animateFloatAsState
import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.scale
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.painter.Painter
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.TextUnit
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.designsystem.theme.DSColors
import com.designsystem.theme.DSTypography

// Button Variants
enum class DSButtonVariant {
    PRIMARY,
    SECONDARY,
    TERTIARY,
    GHOST,
    DANGER
}

// Button Sizes
enum class DSButtonSize {
    SMALL,
    MEDIUM,
    LARGE
}

// Icon Position
enum class IconPosition {
    LEADING,
    TRAILING
}

// Button Size Properties
data class ButtonSizeProperties(
    val height: Dp,
    val fontSize: TextUnit,
    val horizontalPadding: Dp,
    val iconSize: Dp,
    val minWidth: Dp
)

// Get size properties for button
private fun getButtonSizeProperties(size: DSButtonSize): ButtonSizeProperties {
    return when (size) {
        DSButtonSize.SMALL -> ButtonSizeProperties(
            height = 32.dp,
            fontSize = 14.sp,
            horizontalPadding = 12.dp,
            iconSize = 16.dp,
            minWidth = 64.dp
        )
        DSButtonSize.MEDIUM -> ButtonSizeProperties(
            height = 40.dp,
            fontSize = 16.sp,
            horizontalPadding = 16.dp,
            iconSize = 20.dp,
            minWidth = 80.dp
        )
        DSButtonSize.LARGE -> ButtonSizeProperties(
            height = 48.dp,
            fontSize = 18.sp,
            horizontalPadding = 24.dp,
            iconSize = 24.dp,
            minWidth = 96.dp
        )
    }
}

// Get colors for button variant
private fun getButtonColors(variant: DSButtonVariant): ButtonColors {
    return when (variant) {
        DSButtonVariant.PRIMARY -> ButtonDefaults.buttonColors(
            containerColor = DSColors.Primary500,
            contentColor = Color.White,
            disabledContainerColor = DSColors.Primary500.copy(alpha = 0.5f),
            disabledContentColor = Color.White.copy(alpha = 0.5f)
        )
        DSButtonVariant.SECONDARY -> ButtonDefaults.buttonColors(
            containerColor = DSColors.Secondary500,
            contentColor = Color.White,
            disabledContainerColor = DSColors.Secondary500.copy(alpha = 0.5f),
            disabledContentColor = Color.White.copy(alpha = 0.5f)
        )
        DSButtonVariant.TERTIARY -> ButtonDefaults.outlinedButtonColors(
            containerColor = Color.Transparent,
            contentColor = DSColors.Primary600,
            disabledContentColor = DSColors.Primary600.copy(alpha = 0.5f)
        )
        DSButtonVariant.GHOST -> ButtonDefaults.textButtonColors(
            containerColor = Color.Transparent,
            contentColor = DSColors.TextPrimary,
            disabledContentColor = DSColors.TextPrimary.copy(alpha = 0.5f)
        )
        DSButtonVariant.DANGER -> ButtonDefaults.buttonColors(
            containerColor = DSColors.ErrorMain,
            contentColor = Color.White,
            disabledContainerColor = DSColors.ErrorMain.copy(alpha = 0.5f),
            disabledContentColor = Color.White.copy(alpha = 0.5f)
        )
    }
}

// Main Button Composable
@Composable
fun DSButton(
    text: String? = null,
    onClick: () -> Unit,
    modifier: Modifier = Modifier,
    variant: DSButtonVariant = DSButtonVariant.PRIMARY,
    size: DSButtonSize = DSButtonSize.MEDIUM,
    enabled: Boolean = true,
    loading: Boolean = false,
    fullWidth: Boolean = false,
    icon: Painter? = null,
    iconPosition: IconPosition = IconPosition.LEADING
) {
    val sizeProperties = getButtonSizeProperties(size)
    val colors = getButtonColors(variant)
    var isPressed by remember { mutableStateOf(false) }
    val scale by animateFloatAsState(if (isPressed) 0.98f else 1f)
    
    val buttonModifier = modifier
        .scale(scale)
        .then(
            if (fullWidth) Modifier.fillMaxWidth()
            else Modifier.defaultMinSize(minWidth = sizeProperties.minWidth)
        )
        .height(sizeProperties.height)
    
    val border = if (variant == DSButtonVariant.TERTIARY) {
        BorderStroke(1.dp, DSColors.Primary600)
    } else null
    
    Button(
        onClick = {
            if (!loading && enabled) {
                onClick()
            }
        },
        modifier = buttonModifier,
        enabled = enabled && !loading,
        colors = colors,
        shape = RoundedCornerShape(6.dp),
        border = border,
        contentPadding = PaddingValues(horizontal = sizeProperties.horizontalPadding)
    ) {
        if (loading) {
            CircularProgressIndicator(
                modifier = Modifier.size(sizeProperties.iconSize),
                color = LocalContentColor.current,
                strokeWidth = 2.dp
            )
        } else {
            Row(
                horizontalArrangement = Arrangement.Center,
                verticalAlignment = Alignment.CenterVertically
            ) {
                if (icon != null && iconPosition == IconPosition.LEADING) {
                    Icon(
                        painter = icon,
                        contentDescription = null,
                        modifier = Modifier.size(sizeProperties.iconSize)
                    )
                    if (text != null) {
                        Spacer(modifier = Modifier.width(8.dp))
                    }
                }
                
                if (text != null) {
                    Text(
                        text = text,
                        fontSize = sizeProperties.fontSize,
                        fontWeight = FontWeight.Medium,
                        maxLines = 1
                    )
                }
                
                if (icon != null && iconPosition == IconPosition.TRAILING) {
                    if (text != null) {
                        Spacer(modifier = Modifier.width(8.dp))
                    }
                    Icon(
                        painter = icon,
                        contentDescription = null,
                        modifier = Modifier.size(sizeProperties.iconSize)
                    )
                }
            }
        }
    }
}

// Button Group Composable
@Composable
fun DSButtonGroup(
    modifier: Modifier = Modifier,
    orientation: Orientation = Orientation.HORIZONTAL,
    spacing: Dp = 8.dp,
    content: @Composable () -> Unit
) {
    when (orientation) {
        Orientation.HORIZONTAL -> {
            Row(
                modifier = modifier,
                horizontalArrangement = Arrangement.spacedBy(spacing)
            ) {
                content()
            }
        }
        Orientation.VERTICAL -> {
            Column(
                modifier = modifier,
                verticalArrangement = Arrangement.spacedBy(spacing)
            ) {
                content()
            }
        }
    }
}

enum class Orientation {
    HORIZONTAL,
    VERTICAL
}

// Icon-only Button Composable
@Composable
fun DSIconButton(
    icon: Painter,
    onClick: () -> Unit,
    modifier: Modifier = Modifier,
    variant: DSButtonVariant = DSButtonVariant.PRIMARY,
    size: DSButtonSize = DSButtonSize.MEDIUM,
    enabled: Boolean = true,
    contentDescription: String? = null
) {
    val sizeProperties = getButtonSizeProperties(size)
    val colors = getButtonColors(variant)
    
    val buttonSize = when (size) {
        DSButtonSize.SMALL -> 32.dp
        DSButtonSize.MEDIUM -> 40.dp
        DSButtonSize.LARGE -> 48.dp
    }
    
    if (variant == DSButtonVariant.GHOST) {
        IconButton(
            onClick = onClick,
            modifier = modifier.size(buttonSize),
            enabled = enabled
        ) {
            Icon(
                painter = icon,
                contentDescription = contentDescription,
                modifier = Modifier.size(sizeProperties.iconSize),
                tint = colors.contentColor
            )
        }
    } else {
        FilledIconButton(
            onClick = onClick,
            modifier = modifier.size(buttonSize),
            enabled = enabled,
            colors = IconButtonDefaults.filledIconButtonColors(
                containerColor = colors.containerColor,
                contentColor = colors.contentColor,
                disabledContainerColor = colors.disabledContainerColor,
                disabledContentColor = colors.disabledContentColor
            ),
            shape = RoundedCornerShape(6.dp)
        ) {
            Icon(
                painter = icon,
                contentDescription = contentDescription,
                modifier = Modifier.size(sizeProperties.iconSize)
            )
        }
    }
}