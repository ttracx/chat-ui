package com.designsystem.theme

import androidx.compose.ui.graphics.Color

object DSColors {
    // Base Colors
    val White = Color(0xFFFFFFFF)
    val Black = Color(0xFF000000)
    
    // Gray Scale
    val Gray50 = Color(0xFFF9FAFB)
    val Gray100 = Color(0xFFF3F4F6)
    val Gray200 = Color(0xFFE5E7EB)
    val Gray300 = Color(0xFFD1D5DB)
    val Gray400 = Color(0xFF9CA3AF)
    val Gray500 = Color(0xFF6B7280)
    val Gray600 = Color(0xFF4B5563)
    val Gray700 = Color(0xFF374151)
    val Gray800 = Color(0xFF1F2937)
    val Gray900 = Color(0xFF111827)
    val Gray950 = Color(0xFF030712)
    
    // Primary Colors
    val Primary50 = Color(0xFFEFF6FF)
    val Primary100 = Color(0xFFDBEAFE)
    val Primary200 = Color(0xFFBFDBFE)
    val Primary300 = Color(0xFF93C5FD)
    val Primary400 = Color(0xFF60A5FA)
    val Primary500 = Color(0xFF3B82F6)
    val Primary600 = Color(0xFF2563EB)
    val Primary700 = Color(0xFF1D4ED8)
    val Primary800 = Color(0xFF1E40AF)
    val Primary900 = Color(0xFF1E3A8A)
    val Primary950 = Color(0xFF172554)
    
    // Secondary Colors
    val Secondary50 = Color(0xFFF0FDF4)
    val Secondary100 = Color(0xFFDCFCE7)
    val Secondary200 = Color(0xFFBBF7D0)
    val Secondary300 = Color(0xFF86EFAC)
    val Secondary400 = Color(0xFF4ADE80)
    val Secondary500 = Color(0xFF22C55E)
    val Secondary600 = Color(0xFF16A34A)
    val Secondary700 = Color(0xFF15803D)
    val Secondary800 = Color(0xFF166534)
    val Secondary900 = Color(0xFF14532D)
    val Secondary950 = Color(0xFF052E16)
    
    // Accent Colors
    val Accent50 = Color(0xFFFFF7ED)
    val Accent100 = Color(0xFFFFEDD5)
    val Accent200 = Color(0xFFFED7AA)
    val Accent300 = Color(0xFFFDBA74)
    val Accent400 = Color(0xFFFB923C)
    val Accent500 = Color(0xFFF97316)
    val Accent600 = Color(0xFFEA580C)
    val Accent700 = Color(0xFFC2410C)
    val Accent800 = Color(0xFF9A3412)
    val Accent900 = Color(0xFF7C2D12)
    val Accent950 = Color(0xFF431407)
    
    // Semantic Colors
    val ErrorLight = Color(0xFFFEE2E2)
    val ErrorMain = Color(0xFFEF4444)
    val ErrorDark = Color(0xFF991B1B)
    
    val WarningLight = Color(0xFFFEF3C7)
    val WarningMain = Color(0xFFF59E0B)
    val WarningDark = Color(0xFF92400E)
    
    val SuccessLight = Color(0xFFD1FAE5)
    val SuccessMain = Color(0xFF10B981)
    val SuccessDark = Color(0xFF065F46)
    
    val InfoLight = Color(0xFFDBEAFE)
    val InfoMain = Color(0xFF3B82F6)
    val InfoDark = Color(0xFF1E40AF)
    
    // Background Colors
    val BackgroundPrimary = White
    val BackgroundSecondary = Gray50
    val BackgroundTertiary = Gray100
    val BackgroundElevated = White
    val BackgroundOverlay = Black.copy(alpha = 0.5f)
    
    // Text Colors
    val TextPrimary = Gray900
    val TextSecondary = Gray600
    val TextTertiary = Gray400
    val TextDisabled = Gray300
    val TextInverse = White
    val TextLink = Primary600
    
    // Border Colors
    val BorderLight = Gray200
    val BorderDefault = Gray300
    val BorderDark = Gray400
    val BorderFocus = Primary500
    val BorderError = ErrorMain
}