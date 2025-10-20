/**
 * Design System Context
 * Provides AI agents with comprehensive design system knowledge
 */

import { promises as fs } from 'fs';
import path from 'path';
import { Logger } from '../core/logger';

export class DesignSystemContext {
  private logger: Logger;
  private designSystemPath: string;
  private cache: Map<string, any>;
  private cacheEnabled: boolean;
  private cacheTTL: number;
  private lastRefresh: Date | null;

  constructor(config: ContextConfig) {
    this.logger = new Logger('DesignSystemContext');
    this.designSystemPath = path.resolve(config.designSystemPath);
    this.cache = new Map();
    this.cacheEnabled = config.cacheEnabled ?? true;
    this.cacheTTL = config.cacheTTL || 3600000; // 1 hour
    this.lastRefresh = null;
  }

  /**
   * Get full design system context for AI agents
   */
  public async getFullContext(detailed: boolean = false): Promise<DesignSystemContextData> {
    const cacheKey = `full-context-${detailed}`;
    
    if (this.cacheEnabled && this.cache.has(cacheKey)) {
      const cached = this.cache.get(cacheKey);
      if (Date.now() - cached.timestamp < this.cacheTTL) {
        this.logger.debug('Returning cached context');
        return cached.data;
      }
    }

    this.logger.info('Building design system context');

    const context: DesignSystemContextData = {
      version: await this.getVersion(),
      tokens: await this.getTokens(),
      components: await this.getComponents(detailed),
      guidelines: await this.getGuidelines(),
      patterns: await this.getPatterns(),
      platforms: await this.getPlatforms(),
      assets: await this.getAssets(),
      metadata: {
        lastUpdated: new Date().toISOString(),
        totalComponents: 0,
        totalTokens: 0,
        supportedPlatforms: ['web', 'ios', 'android']
      }
    };

    // Calculate metadata
    context.metadata.totalComponents = Object.keys(context.components).length;
    context.metadata.totalTokens = this.countTokens(context.tokens);

    if (this.cacheEnabled) {
      this.cache.set(cacheKey, {
        data: context,
        timestamp: Date.now()
      });
    }

    this.lastRefresh = new Date();
    return context;
  }

  /**
   * Get design tokens (colors, typography, spacing, etc.)
   */
  public async getTokens(): Promise<DesignTokens> {
    const tokensPath = path.join(this.designSystemPath, 'tokens');
    
    const tokens: DesignTokens = {
      colors: await this.loadJSON(path.join(tokensPath, 'colors.json')),
      typography: await this.loadJSON(path.join(tokensPath, 'typography.json')),
      spacing: await this.loadJSON(path.join(tokensPath, 'spacing.json')),
      breakpoints: await this.loadJSON(path.join(tokensPath, 'breakpoints.json')),
      effects: await this.loadJSON(path.join(tokensPath, 'effects.json')),
      animations: await this.loadJSON(path.join(tokensPath, 'animations.json'))
    };

    return tokens;
  }

  /**
   * Get component specifications
   */
  public async getComponents(detailed: boolean = false): Promise<ComponentRegistry> {
    const componentsPath = path.join(this.designSystemPath, 'components');
    const files = await fs.readdir(componentsPath);
    
    const components: ComponentRegistry = {};

    for (const file of files) {
      if (file.endsWith('.md') && file !== 'README.md') {
        const componentName = file.replace('.md', '');
        const filePath = path.join(componentsPath, file);
        const content = await fs.readFile(filePath, 'utf-8');
        
        components[componentName] = {
          name: componentName,
          path: filePath,
          specification: detailed ? content : this.extractSummary(content),
          variants: this.extractVariants(content),
          states: this.extractStates(content),
          platforms: this.extractPlatforms(content),
          accessibility: this.extractAccessibility(content)
        };
      }
    }

    return components;
  }

  /**
   * Get specific component context
   */
  public async getComponentContext(componentName: string): Promise<ComponentContext> {
    const componentPath = path.join(
      this.designSystemPath,
      'components',
      `${componentName}.md`
    );

    try {
      const spec = await fs.readFile(componentPath, 'utf-8');
      const tokens = await this.getTokens();

      return {
        name: componentName,
        specification: spec,
        variants: this.extractVariants(spec),
        states: this.extractStates(spec),
        relatedComponents: await this.findRelatedComponents(componentName),
        tokens: this.extractUsedTokens(spec, tokens),
        examples: this.extractExamples(spec),
        platforms: this.extractPlatforms(spec)
      };
    } catch (error) {
      throw new Error(`Component ${componentName} not found`);
    }
  }

  /**
   * Get design guidelines
   */
  public async getGuidelines(): Promise<DesignGuidelines> {
    const guidelinesPath = path.join(this.designSystemPath, 'guidelines');
    
    return {
      accessibility: await this.loadMarkdown(
        path.join(guidelinesPath, 'accessibility.md')
      ),
      interactionPatterns: await this.loadMarkdown(
        path.join(guidelinesPath, 'interaction-patterns.md')
      ),
      principles: this.extractDesignPrinciples()
    };
  }

  /**
   * Get common patterns and best practices
   */
  public async getPatterns(): Promise<DesignPatterns> {
    return {
      navigation: this.extractNavigationPatterns(),
      forms: this.extractFormPatterns(),
      feedback: this.extractFeedbackPatterns(),
      responsive: this.extractResponsivePatterns()
    };
  }

  /**
   * Get platform-specific information
   */
  public async getPlatforms(): Promise<PlatformInfo[]> {
    const platformsPath = path.join(this.designSystemPath, 'platforms');
    const platforms = ['web', 'ios', 'android'];
    
    const info: PlatformInfo[] = [];

    for (const platform of platforms) {
      const readme = await this.loadMarkdown(
        path.join(platformsPath, platform, 'README.md')
      );
      
      info.push({
        name: platform,
        framework: this.getPlatformFramework(platform),
        guide: readme,
        conventions: this.extractPlatformConventions(readme)
      });
    }

    return info;
  }

  /**
   * Get available assets (icons, images, fonts)
   */
  public async getAssets(): Promise<AssetRegistry> {
    const assetsPath = path.join(this.designSystemPath, 'assets');
    
    return {
      icons: await this.getIconsList(),
      fonts: await this.getFontsList(),
      images: []
    };
  }

  /**
   * Get examples of existing components for learning
   */
  public async getComponentExamples(platform: string): Promise<ComponentExample[]> {
    const examples: ComponentExample[] = [];
    const components = await this.getComponents(true);

    for (const [name, component] of Object.entries(components)) {
      if (component.specification) {
        const platformExample = this.extractPlatformExample(
          component.specification,
          platform
        );
        
        if (platformExample) {
          examples.push({
            name,
            platform,
            code: platformExample,
            description: this.extractDescription(component.specification)
          });
        }
      }
    }

    return examples;
  }

  /**
   * Refresh context cache
   */
  public async refresh(): Promise<void> {
    this.logger.info('Refreshing design system context');
    this.cache.clear();
    await this.getFullContext(true);
    this.lastRefresh = new Date();
  }

  /**
   * Clear cache
   */
  public async clearCache(): Promise<void> {
    this.logger.info('Clearing context cache');
    this.cache.clear();
  }

  /**
   * Check if context is cached
   */
  public isCached(): boolean {
    return this.cache.size > 0;
  }

  // Private helper methods

  private async loadJSON(filePath: string): Promise<any> {
    try {
      const content = await fs.readFile(filePath, 'utf-8');
      return JSON.parse(content);
    } catch (error) {
      this.logger.warn(`Failed to load JSON: ${filePath}`);
      return {};
    }
  }

  private async loadMarkdown(filePath: string): Promise<string> {
    try {
      return await fs.readFile(filePath, 'utf-8');
    } catch (error) {
      this.logger.warn(`Failed to load markdown: ${filePath}`);
      return '';
    }
  }

  private extractSummary(content: string): string {
    // Extract first paragraph after title
    const lines = content.split('\n');
    let summary = '';
    let foundTitle = false;

    for (const line of lines) {
      if (line.startsWith('# ')) {
        foundTitle = true;
        continue;
      }
      if (foundTitle && line.trim()) {
        summary = line.trim();
        break;
      }
    }

    return summary;
  }

  private extractVariants(content: string): string[] {
    const variants: string[] = [];
    const variantRegex = /##\s*Variants?\s*\n([\s\S]*?)(?=\n##|\n###|$)/i;
    const match = content.match(variantRegex);

    if (match) {
      const variantSection = match[1];
      const variantLines = variantSection.match(/###\s*(.+)/g);
      
      if (variantLines) {
        variants.push(...variantLines.map(v => v.replace(/###\s*/, '').trim()));
      }
    }

    return variants;
  }

  private extractStates(content: string): string[] {
    const states: string[] = [];
    const stateRegex = /##\s*States?\s*\n([\s\S]*?)(?=\n##|$)/i;
    const match = content.match(stateRegex);

    if (match) {
      const stateSection = match[1];
      const stateLines = stateSection.match(/###\s*(.+)/g);
      
      if (stateLines) {
        states.push(...stateLines.map(s => s.replace(/###\s*/, '').trim()));
      }
    }

    return states;
  }

  private extractPlatforms(content: string): string[] {
    const platforms: string[] = [];
    
    if (content.includes('### Web') || content.includes('Svelte') || content.includes('React')) {
      platforms.push('web');
    }
    if (content.includes('### iOS') || content.includes('SwiftUI')) {
      platforms.push('ios');
    }
    if (content.includes('### Android') || content.includes('Jetpack Compose')) {
      platforms.push('android');
    }

    return platforms;
  }

  private extractAccessibility(content: string): AccessibilityInfo {
    const ariaMatch = content.match(/ARIA\s+Attributes?\s*\n```(?:html)?\n([\s\S]*?)```/i);
    const keyboardMatch = content.match(/Keyboard\s+Navigation\s*\n([\s\S]*?)(?=\n##|\n###|$)/i);

    return {
      ariaAttributes: ariaMatch ? ariaMatch[1].trim() : '',
      keyboardNavigation: keyboardMatch ? keyboardMatch[1].trim() : '',
      wcagCompliant: content.includes('WCAG') || content.includes('AA')
    };
  }

  private async findRelatedComponents(componentName: string): Promise<string[]> {
    // Logic to find related components based on type, category, etc.
    return [];
  }

  private extractUsedTokens(spec: string, tokens: DesignTokens): any {
    // Extract which tokens are referenced in the component
    return {};
  }

  private extractExamples(content: string): string[] {
    const examples: string[] = [];
    const codeBlocks = content.match(/```[\s\S]*?```/g);
    
    if (codeBlocks) {
      examples.push(...codeBlocks);
    }

    return examples;
  }

  private extractDesignPrinciples(): string[] {
    return [
      'Consistency across platforms',
      'Accessibility first',
      'Responsive by default',
      'Performance optimized',
      'Developer-friendly API'
    ];
  }

  private extractNavigationPatterns(): any {
    return {};
  }

  private extractFormPatterns(): any {
    return {};
  }

  private extractFeedbackPatterns(): any {
    return {};
  }

  private extractResponsivePatterns(): any {
    return {};
  }

  private getPlatformFramework(platform: string): string {
    const frameworks: Record<string, string> = {
      web: 'Svelte/React/Vue',
      ios: 'SwiftUI',
      android: 'Jetpack Compose'
    };
    return frameworks[platform] || 'Unknown';
  }

  private extractPlatformConventions(readme: string): string[] {
    return [];
  }

  private async getIconsList(): Promise<string[]> {
    try {
      const iconsPath = path.join(this.designSystemPath, 'assets', 'icons');
      const files = await fs.readdir(iconsPath);
      return files.filter(f => f.endsWith('.svg'));
    } catch {
      return [];
    }
  }

  private async getFontsList(): Promise<string[]> {
    return ['Inter', 'JetBrains Mono', 'Lexend'];
  }

  private extractPlatformExample(spec: string, platform: string): string | null {
    const platformHeaders: Record<string, string> = {
      web: '### Web',
      ios: '### iOS',
      android: '### Android'
    };

    const header = platformHeaders[platform];
    if (!header) return null;

    const regex = new RegExp(`${header}[\\s\\S]*?\`\`\`[\\s\\S]*?\`\`\``);
    const match = spec.match(regex);
    
    return match ? match[0] : null;
  }

  private extractDescription(spec: string): string {
    return this.extractSummary(spec);
  }

  private countTokens(tokens: DesignTokens): number {
    let count = 0;
    
    for (const category of Object.values(tokens)) {
      if (typeof category === 'object') {
        count += this.countObjectKeys(category);
      }
    }
    
    return count;
  }

  private countObjectKeys(obj: any): number {
    let count = 0;
    
    for (const value of Object.values(obj)) {
      if (typeof value === 'object' && value !== null) {
        count += this.countObjectKeys(value);
      } else {
        count++;
      }
    }
    
    return count;
  }

  private async getVersion(): Promise<string> {
    try {
      const changelog = await this.loadMarkdown(
        path.join(this.designSystemPath, 'CHANGELOG.md')
      );
      const versionMatch = changelog.match(/##\s*\[(\d+\.\d+\.\d+)\]/);
      return versionMatch ? versionMatch[1] : '1.0.0';
    } catch {
      return '1.0.0';
    }
  }
}

// Types
export interface ContextConfig {
  designSystemPath: string;
  cacheEnabled?: boolean;
  cacheTTL?: number;
}

export interface DesignSystemContextData {
  version: string;
  tokens: DesignTokens;
  components: ComponentRegistry;
  guidelines: DesignGuidelines;
  patterns: DesignPatterns;
  platforms: PlatformInfo[];
  assets: AssetRegistry;
  metadata: ContextMetadata;
}

export interface DesignTokens {
  colors: any;
  typography: any;
  spacing: any;
  breakpoints: any;
  effects: any;
  animations: any;
}

export interface ComponentRegistry {
  [componentName: string]: ComponentInfo;
}

export interface ComponentInfo {
  name: string;
  path: string;
  specification: string;
  variants: string[];
  states: string[];
  platforms: string[];
  accessibility: AccessibilityInfo;
}

export interface ComponentContext {
  name: string;
  specification: string;
  variants: string[];
  states: string[];
  relatedComponents: string[];
  tokens: any;
  examples: string[];
  platforms: string[];
}

export interface AccessibilityInfo {
  ariaAttributes: string;
  keyboardNavigation: string;
  wcagCompliant: boolean;
}

export interface DesignGuidelines {
  accessibility: string;
  interactionPatterns: string;
  principles: string[];
}

export interface DesignPatterns {
  navigation: any;
  forms: any;
  feedback: any;
  responsive: any;
}

export interface PlatformInfo {
  name: string;
  framework: string;
  guide: string;
  conventions: string[];
}

export interface AssetRegistry {
  icons: string[];
  fonts: string[];
  images: string[];
}

export interface ComponentExample {
  name: string;
  platform: string;
  code: string;
  description: string;
}

export interface ContextMetadata {
  lastUpdated: string;
  totalComponents: number;
  totalTokens: number;
  supportedPlatforms: string[];
}

export default DesignSystemContext;
