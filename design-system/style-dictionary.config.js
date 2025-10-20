module.exports = {
  source: ['core/tokens/**/*.json'],
  platforms: {
    // Web - CSS Variables
    css: {
      transformGroup: 'css',
      buildPath: 'web/styles/',
      prefix: 'ds',
      files: [{
        destination: 'variables.css',
        format: 'css/variables',
        options: {
          outputReferences: true
        }
      }]
    },
    // Web - SCSS Variables
    scss: {
      transformGroup: 'scss',
      buildPath: 'web/styles/',
      prefix: 'ds',
      files: [{
        destination: '_variables.scss',
        format: 'scss/variables',
        options: {
          outputReferences: true
        }
      }]
    },
    // Web - JavaScript/TypeScript
    js: {
      transformGroup: 'js',
      buildPath: 'web/tokens/',
      files: [{
        destination: 'index.js',
        format: 'javascript/es6'
      }]
    },
    typescript: {
      transformGroup: 'js',
      buildPath: 'web/tokens/',
      files: [{
        destination: 'index.d.ts',
        format: 'typescript/es6-declarations'
      }]
    },
    // iOS - Swift
    ios: {
      transformGroup: 'ios-swift',
      buildPath: 'ios/Sources/DesignSystem/Tokens/',
      prefix: 'DS',
      files: [
        {
          destination: 'Colors.swift',
          format: 'ios-swift/class.swift',
          filter: {
            attributes: {
              category: 'color'
            }
          }
        },
        {
          destination: 'Typography.swift',
          format: 'ios-swift/class.swift',
          filter: {
            attributes: {
              category: 'font'
            }
          }
        },
        {
          destination: 'Spacing.swift',
          format: 'ios-swift/class.swift',
          filter: {
            attributes: {
              category: 'spacing'
            }
          }
        }
      ]
    },
    // iOS - SwiftUI
    iosSwiftUI: {
      transformGroup: 'ios-swift-separate',
      buildPath: 'ios/Sources/DesignSystem/SwiftUI/',
      prefix: 'DS',
      files: [{
        destination: 'Tokens.swift',
        format: 'ios-swift/enum.swift',
        options: {
          imports: ['SwiftUI'],
          accessControl: 'public'
        }
      }]
    },
    // Android - Compose
    androidCompose: {
      transformGroup: 'compose',
      buildPath: 'android/src/main/java/com/designsystem/tokens/',
      files: [
        {
          destination: 'Colors.kt',
          format: 'compose/object',
          filter: {
            attributes: {
              category: 'color'
            }
          },
          options: {
            packageName: 'com.designsystem.tokens',
            objectName: 'DSColors'
          }
        },
        {
          destination: 'Typography.kt',
          format: 'compose/object',
          filter: {
            attributes: {
              category: 'font'
            }
          },
          options: {
            packageName: 'com.designsystem.tokens',
            objectName: 'DSTypography'
          }
        },
        {
          destination: 'Spacing.kt',
          format: 'compose/object',
          filter: {
            attributes: {
              category: 'spacing'
            }
          },
          options: {
            packageName: 'com.designsystem.tokens',
            objectName: 'DSSpacing'
          }
        }
      ]
    },
    // Android - XML Resources
    androidResources: {
      transformGroup: 'android',
      buildPath: 'android/src/main/res/',
      files: [
        {
          destination: 'values/colors.xml',
          format: 'android/colors',
          filter: {
            attributes: {
              category: 'color'
            }
          }
        },
        {
          destination: 'values/dimens.xml',
          format: 'android/dimens',
          filter: {
            attributes: {
              category: 'spacing'
            }
          }
        },
        {
          destination: 'values/font_dimens.xml',
          format: 'android/fontDimens',
          filter: {
            attributes: {
              category: 'font',
              type: 'size'
            }
          }
        }
      ]
    },
    // Documentation - JSON
    json: {
      transformGroup: 'js',
      buildPath: 'documentation/tokens/',
      files: [{
        destination: 'all-tokens.json',
        format: 'json/nested'
      }]
    },
    // Documentation - Markdown
    markdown: {
      transformGroup: 'js',
      buildPath: 'documentation/tokens/',
      files: [{
        destination: 'tokens.md',
        format: 'markdown/detailed',
        options: {
          title: 'Design System Tokens',
          description: 'Complete reference of all design tokens'
        }
      }]
    }
  }
};