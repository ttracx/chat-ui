#!/usr/bin/env node

/**
 * SwiftUI Component Generator
 * Converts design system components to SwiftUI code
 */

const fs = require('fs');
const path = require('path');

class SwiftUIGenerator {
  constructor() {
    this.components = new Map();
    this.imports = new Set(['SwiftUI']);
  }

  /**
   * Generate SwiftUI view from component specification
   */
  generateComponent(spec) {
    const { name, type, props, children } = spec;
    
    switch (type) {
      case 'screen':
        return this.generateScreen(spec);
      case 'button':
        return this.generateButton(props);
      case 'input':
        return this.generateInput(props);
      case 'card':
        return this.generateCard(props, children);
      case 'list':
        return this.generateList(props, children);
      case 'navigation':
        return this.generateNavigation(props, children);
      default:
        return this.generateContainer(props, children);
    }
  }

  /**
   * Generate complete SwiftUI screen
   */
  generateScreen(spec) {
    const { name, layout, components } = spec;
    
    return `
import SwiftUI

struct ${name}View: View {
    @StateObject private var viewModel = ${name}ViewModel()
    
    var body: some View {
        ${this.generateLayout(layout, components)}
            .navigationTitle("${spec.title || name}")
            .navigationBarTitleDisplayMode(.${spec.titleMode || 'large'})
    }
}

// MARK: - ViewModel
class ${name}ViewModel: ObservableObject {
    @Published var isLoading = false
    @Published var errorMessage: String?
    
    func loadData() {
        isLoading = true
        // Implement data loading
        isLoading = false
    }
}

// MARK: - Preview
struct ${name}View_Previews: PreviewProvider {
    static var previews: some View {
        NavigationView {
            ${name}View()
        }
        .previewDevice("iPhone 14 Pro")
    }
}`;
  }

  /**
   * Generate layout structure
   */
  generateLayout(layout, components) {
    switch (layout) {
      case 'vertical':
        return `
        ScrollView {
            VStack(spacing: DSSpacing.medium) {
                ${components.map(c => this.generateComponent(c)).join('\n                ')}
            }
            .padding()
        }`;
      
      case 'horizontal':
        return `
        ScrollView(.horizontal, showsIndicators: false) {
            HStack(spacing: DSSpacing.medium) {
                ${components.map(c => this.generateComponent(c)).join('\n                ')}
            }
            .padding()
        }`;
      
      case 'grid':
        return `
        ScrollView {
            LazyVGrid(columns: [
                GridItem(.flexible()),
                GridItem(.flexible())
            ], spacing: DSSpacing.medium) {
                ${components.map(c => this.generateComponent(c)).join('\n                ')}
            }
            .padding()
        }`;
      
      default:
        return `
        ZStack {
            ${components.map(c => this.generateComponent(c)).join('\n            ')}
        }`;
    }
  }

  /**
   * Generate Button component
   */
  generateButton(props) {
    const { text, variant, size, action, icon, fullWidth } = props;
    
    let buttonCode = `
DSButton(
    title: "${text || 'Button'}"`;
    
    if (icon) {
      buttonCode += `,
    icon: Image(systemName: "${icon}")`;
    }
    
    if (variant) {
      buttonCode += `,
    variant: .${variant.toLowerCase()}`;
    }
    
    if (size) {
      buttonCode += `,
    size: .${size.toLowerCase()}`;
    }
    
    if (fullWidth) {
      buttonCode += `,
    isFullWidth: true`;
    }
    
    buttonCode += `
) {
    ${action || '// Action here'}
}`;
    
    return buttonCode;
  }

  /**
   * Generate Input component
   */
  generateInput(props) {
    const { placeholder, type, label, binding } = props;
    
    if (label) {
      return `
VStack(alignment: .leading, spacing: 4) {
    Text("${label}")
        .font(.caption)
        .foregroundColor(.secondary)
    ${this.generateInputField(props)}
}`;
    }
    
    return this.generateInputField(props);
  }

  generateInputField(props) {
    const { placeholder, type, binding } = props;
    const bindingName = binding || 'text';
    
    switch (type) {
      case 'password':
        return `SecureField("${placeholder || ''}", text: $viewModel.${bindingName})
    .textFieldStyle(DSTextFieldStyle())`;
      
      case 'multiline':
        return `TextEditor(text: $viewModel.${bindingName})
    .frame(minHeight: 100)
    .padding(8)
    .overlay(
        RoundedRectangle(cornerRadius: 6)
            .stroke(DSColors.borderDefault, lineWidth: 1)
    )`;
      
      default:
        return `TextField("${placeholder || ''}", text: $viewModel.${bindingName})
    .textFieldStyle(DSTextFieldStyle())`;
    }
  }

  /**
   * Generate Card component
   */
  generateCard(props, children = []) {
    const { title, subtitle, image, variant } = props;
    
    let cardContent = '';
    
    if (image) {
      cardContent += `
            Image("${image}")
                .resizable()
                .aspectRatio(contentMode: .fill)
                .frame(height: 200)
                .clipped()
            `;
    }
    
    cardContent += `
            VStack(alignment: .leading, spacing: 8) {`;
    
    if (title) {
      cardContent += `
                Text("${title}")
                    .font(.headline)`;
    }
    
    if (subtitle) {
      cardContent += `
                Text("${subtitle}")
                    .font(.subheadline)
                    .foregroundColor(.secondary)`;
    }
    
    if (children.length > 0) {
      cardContent += `
                ${children.map(c => this.generateComponent(c)).join('\n                ')}`;
    }
    
    cardContent += `
            }
            .padding()`;
    
    return `
DSCard(variant: .${variant || 'elevated'}) {
    VStack(alignment: .leading, spacing: 0) {${cardContent}
    }
}`;
  }

  /**
   * Generate List component
   */
  generateList(props, children = []) {
    const { items, style } = props;
    
    if (style === 'grouped') {
      return `
List {
    ${children.map((section, i) => `
    Section(header: Text("${section.title || `Section ${i + 1}`}")) {
        ${section.items.map(item => this.generateListItem(item)).join('\n        ')}
    }`).join('\n    ')}
}
.listStyle(InsetGroupedListStyle())`;
    }
    
    return `
List {
    ${children.map(item => this.generateListItem(item)).join('\n    ')}
}
.listStyle(PlainListStyle())`;
  }

  generateListItem(item) {
    if (item.type === 'custom') {
      return this.generateComponent(item.content);
    }
    
    return `
    HStack {
        ${item.icon ? `Image(systemName: "${item.icon}")
            .foregroundColor(.accentColor)` : ''}
        VStack(alignment: .leading) {
            Text("${item.title || ''}")
            ${item.subtitle ? `Text("${item.subtitle}")
                .font(.caption)
                .foregroundColor(.secondary)` : ''}
        }
        Spacer()
        ${item.accessory ? this.generateAccessory(item.accessory) : ''}
    }
    .padding(.vertical, 4)`;
  }

  generateAccessory(accessory) {
    switch (accessory.type) {
      case 'disclosure':
        return `Image(systemName: "chevron.right")
            .foregroundColor(.secondary)`;
      case 'toggle':
        return `Toggle("", isOn: $viewModel.${accessory.binding})
            .labelsHidden()`;
      case 'text':
        return `Text("${accessory.value}")
            .foregroundColor(.secondary)`;
      default:
        return '';
    }
  }

  /**
   * Generate Navigation component
   */
  generateNavigation(props, children = []) {
    const { type, items } = props;
    
    if (type === 'tab') {
      return this.generateTabView(items);
    }
    
    return this.generateNavigationStack(children);
  }

  generateTabView(items) {
    return `
TabView {
    ${items.map(item => `
    ${item.view}()
        .tabItem {
            Label("${item.title}", systemImage: "${item.icon}")
        }
        .tag(${items.indexOf(item)})`).join('\n    ')}
}`;
  }

  generateNavigationStack(children) {
    return `
NavigationStack {
    ${children.map(c => this.generateComponent(c)).join('\n    ')}
}`;
  }

  /**
   * Generate generic container
   */
  generateContainer(props, children = []) {
    const { type, spacing, padding } = props;
    
    const containerType = type === 'horizontal' ? 'HStack' : 'VStack';
    const spacingValue = spacing || 'DSSpacing.medium';
    
    let containerCode = `
${containerType}(spacing: ${spacingValue}) {
    ${children.map(c => this.generateComponent(c)).join('\n    ')}
}`;
    
    if (padding) {
      containerCode += `
.padding(${padding})`;
    }
    
    return containerCode;
  }

  /**
   * Generate complete SwiftUI file with imports and helpers
   */
  generateFile(screens) {
    const imports = Array.from(this.imports).join('\n');
    const screenCode = screens.map(s => this.generateComponent(s)).join('\n\n');
    
    return `${imports}
import Foundation

// MARK: - Generated Screens
${screenCode}

// MARK: - Helpers
extension View {
    func DSTextFieldStyle() -> some ViewModifier {
        DSTextFieldModifier()
    }
}

struct DSTextFieldModifier: ViewModifier {
    func body(content: Content) -> some View {
        content
            .padding()
            .background(Color(.systemGray6))
            .cornerRadius(8)
            .overlay(
                RoundedRectangle(cornerRadius: 8)
                    .stroke(Color(.systemGray4), lineWidth: 1)
            )
    }
}

// MARK: - Spacing Constants
struct DSSpacing {
    static let small: CGFloat = 8
    static let medium: CGFloat = 16
    static let large: CGFloat = 24
    static let xlarge: CGFloat = 32
}`;
  }

  /**
   * Convert JSON specification to SwiftUI
   */
  convertFromJSON(jsonPath, outputPath) {
    try {
      const jsonContent = fs.readFileSync(jsonPath, 'utf8');
      const specification = JSON.parse(jsonContent);
      
      const swiftUICode = this.generateFile(specification.screens);
      
      fs.writeFileSync(outputPath, swiftUICode);
      console.log(`✅ SwiftUI code generated successfully: ${outputPath}`);
      
      return swiftUICode;
    } catch (error) {
      console.error(`❌ Error generating SwiftUI code: ${error.message}`);
      throw error;
    }
  }
}

// CLI Usage
if (require.main === module) {
  const args = process.argv.slice(2);
  
  if (args.length < 2) {
    console.log('Usage: node swiftui-generator.js <input.json> <output.swift>');
    process.exit(1);
  }
  
  const generator = new SwiftUIGenerator();
  generator.convertFromJSON(args[0], args[1]);
}

module.exports = SwiftUIGenerator;