import SwiftUI

// MARK: - Design System Colors
public struct DSColors {
    // MARK: - Base Colors
    public static let white = Color(hex: "#FFFFFF")
    public static let black = Color(hex: "#000000")
    
    // MARK: - Gray Scale
    public static let gray50 = Color(hex: "#F9FAFB")
    public static let gray100 = Color(hex: "#F3F4F6")
    public static let gray200 = Color(hex: "#E5E7EB")
    public static let gray300 = Color(hex: "#D1D5DB")
    public static let gray400 = Color(hex: "#9CA3AF")
    public static let gray500 = Color(hex: "#6B7280")
    public static let gray600 = Color(hex: "#4B5563")
    public static let gray700 = Color(hex: "#374151")
    public static let gray800 = Color(hex: "#1F2937")
    public static let gray900 = Color(hex: "#111827")
    public static let gray950 = Color(hex: "#030712")
    
    // MARK: - Primary Colors
    public static let primary50 = Color(hex: "#EFF6FF")
    public static let primary100 = Color(hex: "#DBEAFE")
    public static let primary200 = Color(hex: "#BFDBFE")
    public static let primary300 = Color(hex: "#93C5FD")
    public static let primary400 = Color(hex: "#60A5FA")
    public static let primary500 = Color(hex: "#3B82F6")
    public static let primary600 = Color(hex: "#2563EB")
    public static let primary700 = Color(hex: "#1D4ED8")
    public static let primary800 = Color(hex: "#1E40AF")
    public static let primary900 = Color(hex: "#1E3A8A")
    public static let primary950 = Color(hex: "#172554")
    
    // MARK: - Secondary Colors
    public static let secondary50 = Color(hex: "#F0FDF4")
    public static let secondary100 = Color(hex: "#DCFCE7")
    public static let secondary200 = Color(hex: "#BBF7D0")
    public static let secondary300 = Color(hex: "#86EFAC")
    public static let secondary400 = Color(hex: "#4ADE80")
    public static let secondary500 = Color(hex: "#22C55E")
    public static let secondary600 = Color(hex: "#16A34A")
    public static let secondary700 = Color(hex: "#15803D")
    public static let secondary800 = Color(hex: "#166534")
    public static let secondary900 = Color(hex: "#14532D")
    public static let secondary950 = Color(hex: "#052E16")
    
    // MARK: - Accent Colors
    public static let accent50 = Color(hex: "#FFF7ED")
    public static let accent100 = Color(hex: "#FFEDD5")
    public static let accent200 = Color(hex: "#FED7AA")
    public static let accent300 = Color(hex: "#FDBA74")
    public static let accent400 = Color(hex: "#FB923C")
    public static let accent500 = Color(hex: "#F97316")
    public static let accent600 = Color(hex: "#EA580C")
    public static let accent700 = Color(hex: "#C2410C")
    public static let accent800 = Color(hex: "#9A3412")
    public static let accent900 = Color(hex: "#7C2D12")
    public static let accent950 = Color(hex: "#431407")
    
    // MARK: - Semantic Colors
    public static let errorLight = Color(hex: "#FEE2E2")
    public static let errorMain = Color(hex: "#EF4444")
    public static let errorDark = Color(hex: "#991B1B")
    
    public static let warningLight = Color(hex: "#FEF3C7")
    public static let warningMain = Color(hex: "#F59E0B")
    public static let warningDark = Color(hex: "#92400E")
    
    public static let successLight = Color(hex: "#D1FAE5")
    public static let successMain = Color(hex: "#10B981")
    public static let successDark = Color(hex: "#065F46")
    
    public static let infoLight = Color(hex: "#DBEAFE")
    public static let infoMain = Color(hex: "#3B82F6")
    public static let infoDark = Color(hex: "#1E40AF")
    
    // MARK: - Background Colors
    public static let backgroundPrimary = white
    public static let backgroundSecondary = gray50
    public static let backgroundTertiary = gray100
    public static let backgroundElevated = white
    public static let backgroundOverlay = Color.black.opacity(0.5)
    
    // MARK: - Text Colors
    public static let textPrimary = gray900
    public static let textSecondary = gray600
    public static let textTertiary = gray400
    public static let textDisabled = gray300
    public static let textInverse = white
    public static let textLink = primary600
    
    // MARK: - Border Colors
    public static let borderLight = gray200
    public static let borderDefault = gray300
    public static let borderDark = gray400
    public static let borderFocus = primary500
    public static let borderError = errorMain
}

// MARK: - Color Extension for Hex Support
extension Color {
    init(hex: String) {
        let hex = hex.trimmingCharacters(in: CharacterSet.alphanumerics.inverted)
        var int: UInt64 = 0
        Scanner(string: hex).scanHexInt64(&int)
        let a, r, g, b: UInt64
        switch hex.count {
        case 3: // RGB (12-bit)
            (a, r, g, b) = (255, (int >> 8) * 17, (int >> 4 & 0xF) * 17, (int & 0xF) * 17)
        case 6: // RGB (24-bit)
            (a, r, g, b) = (255, int >> 16, int >> 8 & 0xFF, int & 0xFF)
        case 8: // ARGB (32-bit)
            (a, r, g, b) = (int >> 24, int >> 16 & 0xFF, int >> 8 & 0xFF, int & 0xFF)
        default:
            (a, r, g, b) = (255, 0, 0, 0)
        }
        
        self.init(
            .sRGB,
            red: Double(r) / 255,
            green: Double(g) / 255,
            blue: Double(b) / 255,
            opacity: Double(a) / 255
        )
    }
}