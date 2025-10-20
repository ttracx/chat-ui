/**
 * Component Generator Agent
 * Uses OpenAI API to generate new components based on design system patterns
 */

import OpenAI from 'openai';
import { DesignSystemContext } from '../mcp/context';
import { Logger } from '../core/logger';
import { promises as fs } from 'fs';
import path from 'path';

export class ComponentGeneratorAgent {
  private openai: OpenAI;
  private context: DesignSystemContext;
  private logger: Logger;

  constructor(config: ComponentGeneratorConfig) {
    this.openai = new OpenAI({
      apiKey: config.openaiApiKey || process.env.OPENAI_API_KEY
    });
    
    this.context = config.context || new DesignSystemContext({
      designSystemPath: config.designSystemPath || '../'
    });
    
    this.logger = new Logger('ComponentGenerator');
  }

  /**
   * Generate a new component for all platforms
   */
  public async generateComponent(spec: ComponentSpec): Promise<GenerationResult> {
    this.logger.info(`Generating component: ${spec.name}`);

    try {
      // Get design system context
      const dsContext = await this.context.getFullContext(true);
      
      // Get similar components for reference
      const similarComponents = await this.findSimilarComponents(spec, dsContext);
      
      // Generate component for each platform
      const results: GenerationResult = {
        component: spec.name,
        files: [],
        documentation: '',
        success: true,
        errors: []
      };

      // Generate documentation first
      results.documentation = await this.generateDocumentation(spec, dsContext);
      results.files.push({
        path: `components/${spec.name}.md`,
        content: results.documentation,
        platform: 'all'
      });

      // Generate for each requested platform
      for (const platform of spec.platforms || ['web', 'ios', 'android']) {
        try {
          const platformCode = await this.generatePlatformCode(
            spec,
            platform,
            dsContext,
            similarComponents
          );
          
          results.files.push({
            path: this.getPlatformPath(spec.name, platform),
            content: platformCode,
            platform
          });
        } catch (error: any) {
          this.logger.error(`Failed to generate ${platform} code`, error);
          results.errors.push({
            platform,
            error: error.message
          });
        }
      }

      // Write files
      if (spec.autoWrite !== false) {
        await this.writeFiles(results.files);
      }

      results.success = results.errors.length === 0;
      return results;

    } catch (error: any) {
      this.logger.error('Component generation failed', error);
      return {
        component: spec.name,
        files: [],
        documentation: '',
        success: false,
        errors: [{ platform: 'all', error: error.message }]
      };
    }
  }

  /**
   * Generate component documentation
   */
  private async generateDocumentation(
    spec: ComponentSpec,
    context: any
  ): Promise<string> {
    this.logger.info('Generating documentation');

    const prompt = this.buildDocumentationPrompt(spec, context);
    
    const response = await this.openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [
        {
          role: 'system',
          content: 'You are an expert technical writer creating design system documentation. Follow the design system standards and include all required sections: Purpose, Variants, Sizes, States, Accessibility, Code Examples, and Best Practices.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 4000
    });

    return response.choices[0].message.content || '';
  }

  /**
   * Generate platform-specific code
   */
  private async generatePlatformCode(
    spec: ComponentSpec,
    platform: string,
    context: any,
    similarComponents: string[]
  ): Promise<string> {
    this.logger.info(`Generating ${platform} code`);

    const prompt = this.buildPlatformPrompt(spec, platform, context, similarComponents);
    
    const response = await this.openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [
        {
          role: 'system',
          content: this.getPlatformSystemMessage(platform)
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 4000
    });

    return response.choices[0].message.content || '';
  }

  /**
   * Build documentation prompt for OpenAI
   */
  private buildDocumentationPrompt(spec: ComponentSpec, context: any): string {
    return `
Create comprehensive documentation for a new design system component.

**Component Specification**:
- Name: ${spec.name}
- Type: ${spec.type}
- Description: ${spec.description}
- Variants: ${spec.variants?.join(', ') || 'default'}
- Features: ${spec.features?.join(', ') || 'standard'}
- Platforms: ${spec.platforms?.join(', ') || 'web, ios, android'}

**Design System Context**:
- Design Tokens Available: ${JSON.stringify(Object.keys(context.tokens))}
- Similar Components: ${Object.keys(context.components).slice(0, 5).join(', ')}
- Design Principles: ${context.guidelines?.principles?.join(', ')}

**Documentation Structure Required**:
1. # Component Name
2. Brief description and purpose
3. ## Variants (with descriptions)
4. ## Sizes (small, medium, large)
5. ## States (normal, hover, pressed, focus, disabled, loading, error, success)
6. ## Accessibility (ARIA attributes, keyboard navigation, WCAG compliance)
7. ## Code Examples (for Web, iOS, Android)
8. ## Best Practices (Do's and Don'ts)
9. ## Related Components

Use markdown formatting. Include specific color tokens from the design system (e.g., primary.500, neutral.0). Include all accessibility requirements.

Generate the complete documentation now:
`;
  }

  /**
   * Build platform-specific code generation prompt
   */
  private buildPlatformPrompt(
    spec: ComponentSpec,
    platform: string,
    context: any,
    similarComponents: string[]
  ): string {
    const platformExamples = similarComponents.length > 0
      ? `\n**Similar Components for Reference**:\n${similarComponents.join('\n\n')}`
      : '';

    return `
Generate ${platform} code for a new design system component.

**Component Specification**:
- Name: ${spec.name}
- Type: ${spec.type}
- Description: ${spec.description}
- Variants: ${spec.variants?.join(', ') || 'default'}
- Features: ${spec.features?.join(', ') || 'standard'}

**Design Tokens to Use**:
${JSON.stringify(context.tokens, null, 2)}

**Requirements**:
1. Use design system tokens (DSColor, DSSpacing, etc.)
2. Support all variants: ${spec.variants?.join(', ')}
3. Include all states: normal, hover, pressed, disabled, loading, error
4. Add accessibility attributes (ARIA, content descriptions)
5. Follow ${platform} platform conventions
6. Include comprehensive documentation comments
7. Support dark mode
8. Make component reusable and configurable

**Platform**: ${platform}
${this.getPlatformSpecificRequirements(platform)}

${platformExamples}

Generate the complete, production-ready ${platform} code now:
`;
  }

  /**
   * Get system message for platform-specific generation
   */
  private getPlatformSystemMessage(platform: string): string {
    const messages: Record<string, string> = {
      web: 'You are an expert Svelte/React developer creating design system components. Write clean, accessible, performant code following web standards and best practices. Use TypeScript when applicable.',
      ios: 'You are an expert SwiftUI developer creating design system components for iOS. Write clean, idiomatic Swift code following Apple Human Interface Guidelines and SwiftUI best practices.',
      android: 'You are an expert Android developer creating design system components with Jetpack Compose. Write clean, idiomatic Kotlin code following Material Design guidelines and Jetpack Compose best practices.'
    };

    return messages[platform] || 'You are an expert software developer creating design system components.';
  }

  /**
   * Get platform-specific requirements
   */
  private getPlatformSpecificRequirements(platform: string): string {
    const requirements: Record<string, string> = {
      web: `
**Web-Specific Requirements**:
- Component as Svelte component (.svelte file)
- Export as default
- Use TypeScript for prop types
- Include CSS using design tokens (CSS variables)
- Support responsive design
- Add proper event handlers (on:click, on:change, etc.)
- Include accessibility (aria-* attributes, semantic HTML)
`,
      ios: `
**iOS-Specific Requirements**:
- SwiftUI View struct
- Use @State, @Binding appropriately
- Follow SF Symbols for icons
- Support Dynamic Type
- VoiceOver compatibility
- iPad adaptive layouts
- Support light and dark modes
`,
      android: `
**Android-Specific Requirements**:
- Jetpack Compose @Composable function
- Use Material 3 components as base
- Follow Material Design guidelines
- Support configuration changes
- TalkBack compatibility
- Tablet adaptive layouts
- Support light and dark themes
`
    };

    return requirements[platform] || '';
  }

  /**
   * Find similar components for reference
   */
  private async findSimilarComponents(
    spec: ComponentSpec,
    context: any
  ): Promise<string[]> {
    const examples: string[] = [];
    
    // Get component examples for reference
    if (spec.basedOn) {
      const baseComponent = await this.context.getComponentContext(spec.basedOn);
      examples.push(baseComponent.specification);
    }

    return examples;
  }

  /**
   * Get file path for platform code
   */
  private getPlatformPath(componentName: string, platform: string): string {
    const paths: Record<string, string> = {
      web: `platforms/web/components/${componentName}.svelte`,
      ios: `platforms/ios/Components/DS${componentName}.swift`,
      android: `platforms/android/components/DS${componentName}.kt`
    };

    return paths[platform] || `platforms/${platform}/${componentName}`;
  }

  /**
   * Write generated files to disk
   */
  private async writeFiles(files: GeneratedFile[]): Promise<void> {
    for (const file of files) {
      const filePath = path.join(process.cwd(), '..', file.path);
      const dirPath = path.dirname(filePath);

      // Create directory if it doesn't exist
      await fs.mkdir(dirPath, { recursive: true });

      // Write file
      await fs.writeFile(filePath, file.content, 'utf-8');
      this.logger.success(`Created: ${file.path}`);
    }
  }
}

// Types
export interface ComponentGeneratorConfig {
  openaiApiKey?: string;
  context?: DesignSystemContext;
  designSystemPath?: string;
}

export interface ComponentSpec {
  name: string;
  type: string;
  description: string;
  variants?: string[];
  features?: string[];
  platforms?: string[];
  basedOn?: string;
  autoWrite?: boolean;
}

export interface GenerationResult {
  component: string;
  files: GeneratedFile[];
  documentation: string;
  success: boolean;
  errors: GenerationError[];
}

export interface GeneratedFile {
  path: string;
  content: string;
  platform: string;
}

export interface GenerationError {
  platform: string;
  error: string;
}

export default ComponentGeneratorAgent;
