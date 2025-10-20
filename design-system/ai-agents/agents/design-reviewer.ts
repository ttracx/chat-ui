/**
 * Design Reviewer Agent
 * Validates component designs for consistency and quality
 */

import OpenAI from 'openai';
import { DesignSystemContext } from '../mcp/context';
import { Logger } from '../core/logger';
import { promises as fs } from 'fs';

export class DesignReviewerAgent {
  private openai: OpenAI;
  private context: DesignSystemContext;
  private logger: Logger;

  constructor(config: DesignReviewerConfig) {
    this.openai = new OpenAI({
      apiKey: config.openaiApiKey || process.env.OPENAI_API_KEY
    });
    
    this.context = config.context || new DesignSystemContext({
      designSystemPath: config.designSystemPath || '../'
    });
    
    this.logger = new Logger('DesignReviewer');
  }

  /**
   * Review a component for design consistency
   */
  public async reviewComponent(config: ReviewConfig): Promise<ReviewResult> {
    this.logger.info(`Reviewing component: ${config.path}`);

    try {
      // Load component specification
      const spec = await fs.readFile(config.path, 'utf-8');
      
      // Get design system context
      const dsContext = await this.context.getFullContext(true);

      // Run various checks
      const checks: ReviewCheck[] = [];

      // Check design tokens usage
      if (config.checkTokens !== false) {
        checks.push(await this.checkTokenUsage(spec, dsContext));
      }

      // Check accessibility compliance
      if (config.checkAccessibility !== false) {
        checks.push(await this.checkAccessibility(spec));
      }

      // Check platform coverage
      checks.push(await this.checkPlatformCoverage(spec, config.platforms));

      // Check documentation completeness
      checks.push(await this.checkDocumentation(spec));

      // Use AI to validate design consistency
      const aiReview = await this.performAIReview(spec, dsContext);

      // Compile results
      const issues = checks.flatMap(check => check.issues);
      const warnings = checks.flatMap(check => check.warnings || []);

      return {
        component: config.path,
        consistent: issues.length === 0,
        score: this.calculateScore(checks),
        issues,
        warnings,
        suggestions: aiReview.suggestions,
        checks,
        timestamp: new Date().toISOString()
      };

    } catch (error: any) {
      this.logger.error('Review failed', error);
      return {
        component: config.path,
        consistent: false,
        score: 0,
        issues: [{ category: 'error', message: error.message, severity: 'critical' }],
        warnings: [],
        suggestions: [],
        checks: [],
        timestamp: new Date().toISOString()
      };
    }
  }

  /**
   * Check if component uses design tokens properly
   */
  private async checkTokenUsage(spec: string, context: any): Promise<ReviewCheck> {
    const issues: ReviewIssue[] = [];
    const warnings: ReviewIssue[] = [];

    // Check for hard-coded colors
    const hexColorRegex = /#[0-9A-Fa-f]{6}/g;
    const hexMatches = spec.match(hexColorRegex);
    
    if (hexMatches && hexMatches.length > 0) {
      // Filter out colors that are in design tokens
      const validTokens = this.extractTokenValues(context.tokens.colors);
      const invalidColors = hexMatches.filter(hex => !validTokens.includes(hex.toUpperCase()));
      
      if (invalidColors.length > 0) {
        issues.push({
          category: 'tokens',
          message: `Found hard-coded colors not in design tokens: ${invalidColors.join(', ')}`,
          severity: 'high',
          suggestion: 'Use design token colors (e.g., primary.500, neutral.0)'
        });
      }
    }

    // Check for hard-coded spacing values
    const pxRegex = /padding:|margin:|gap:|spacing:/gi;
    if (pxRegex.test(spec) && !spec.includes('spacing.') && !spec.includes('DSSpacing')) {
      warnings.push({
        category: 'tokens',
        message: 'Consider using spacing tokens instead of hard-coded values',
        severity: 'medium',
        suggestion: 'Use spacing tokens (e.g., spacing.4, DSSpacing.spacing4)'
      });
    }

    return {
      name: 'Token Usage',
      passed: issues.length === 0,
      issues,
      warnings
    };
  }

  /**
   * Check accessibility compliance
   */
  private async checkAccessibility(spec: string): Promise<ReviewCheck> {
    const issues: ReviewIssue[] = [];
    const warnings: ReviewIssue[] = [];

    // Check for ARIA attributes
    if (!spec.includes('aria-') && !spec.includes('accessibilityLabel')) {
      issues.push({
        category: 'accessibility',
        message: 'Missing ARIA attributes or accessibility labels',
        severity: 'high',
        suggestion: 'Add aria-label, aria-describedby, or platform-specific accessibility attributes'
      });
    }

    // Check for keyboard navigation
    if (!spec.includes('keyboard') && !spec.toLowerCase().includes('tab')) {
      warnings.push({
        category: 'accessibility',
        message: 'No keyboard navigation documentation found',
        severity: 'medium',
        suggestion: 'Document keyboard shortcuts (Tab, Enter, Escape, Arrow keys)'
      });
    }

    // Check for screen reader support
    if (!spec.includes('screen reader') && !spec.includes('VoiceOver') && !spec.includes('TalkBack')) {
      warnings.push({
        category: 'accessibility',
        message: 'No screen reader documentation found',
        severity: 'medium',
        suggestion: 'Document screen reader support and testing'
      });
    }

    // Check for WCAG mention
    if (!spec.includes('WCAG') && !spec.includes('AA')) {
      warnings.push({
        category: 'accessibility',
        message: 'No WCAG compliance level specified',
        severity: 'low',
        suggestion: 'Specify WCAG 2.1 AA compliance'
      });
    }

    return {
      name: 'Accessibility',
      passed: issues.length === 0,
      issues,
      warnings
    };
  }

  /**
   * Check platform coverage
   */
  private async checkPlatformCoverage(spec: string, requiredPlatforms?: string[]): Promise<ReviewCheck> {
    const issues: ReviewIssue[] = [];
    const platforms = requiredPlatforms || ['web', 'ios', 'android'];

    for (const platform of platforms) {
      const platformHeaders: Record<string, string> = {
        web: '### Web',
        ios: '### iOS',
        android: '### Android'
      };

      if (!spec.includes(platformHeaders[platform])) {
        issues.push({
          category: 'platform',
          message: `Missing ${platform.toUpperCase()} implementation`,
          severity: 'high',
          suggestion: `Add ${platformHeaders[platform]} section with code example`
        });
      }
    }

    return {
      name: 'Platform Coverage',
      passed: issues.length === 0,
      issues,
      warnings: []
    };
  }

  /**
   * Check documentation completeness
   */
  private async checkDocumentation(spec: string): Promise<ReviewCheck> {
    const issues: ReviewIssue[] = [];
    const warnings: ReviewIssue[] = [];

    const requiredSections = [
      { name: 'Variants', regex: /##\s*Variants?/i },
      { name: 'States', regex: /##\s*States?/i },
      { name: 'Accessibility', regex: /##\s*Accessibility/i },
      { name: 'Code Examples', regex: /##\s*(Code\s*)?Examples?/i },
      { name: 'Best Practices', regex: /##\s*Best\s*Practices/i }
    ];

    for (const section of requiredSections) {
      if (!section.regex.test(spec)) {
        issues.push({
          category: 'documentation',
          message: `Missing required section: ${section.name}`,
          severity: 'medium',
          suggestion: `Add ## ${section.name} section`
        });
      }
    }

    // Check for usage examples
    const codeBlockCount = (spec.match(/```/g) || []).length / 2;
    if (codeBlockCount < 3) {
      warnings.push({
        category: 'documentation',
        message: 'Insufficient code examples',
        severity: 'low',
        suggestion: 'Add more code examples (at least 3: web, iOS, Android)'
      });
    }

    return {
      name: 'Documentation',
      passed: issues.length === 0,
      issues,
      warnings
    };
  }

  /**
   * Perform AI-powered design review
   */
  private async performAIReview(spec: string, context: any): Promise<AIReviewResult> {
    const prompt = `
Review this design system component specification for consistency and quality.

**Component Specification**:
${spec.substring(0, 3000)}

**Design System Context**:
- Design Principles: ${context.guidelines?.principles?.join(', ')}
- Existing Components: ${Object.keys(context.components).slice(0, 10).join(', ')}

**Review Criteria**:
1. Design consistency with existing components
2. Proper use of design tokens
3. Completeness of documentation
4. Accessibility compliance
5. Cross-platform considerations
6. Best practices adherence

Provide specific, actionable suggestions for improvement.
`;

    try {
      const response = await this.openai.chat.completions.create({
        model: 'gpt-4-turbo-preview',
        messages: [
          {
            role: 'system',
            content: 'You are a design system expert reviewing component specifications for quality and consistency. Provide specific, actionable feedback.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.5,
        max_tokens: 1500
      });

      const suggestions = this.parseAISuggestions(response.choices[0].message.content || '');

      return { suggestions };
    } catch (error) {
      this.logger.warn('AI review failed, continuing with manual checks');
      return { suggestions: [] };
    }
  }

  /**
   * Parse AI suggestions from response
   */
  private parseAISuggestions(response: string): string[] {
    const suggestions: string[] = [];
    const lines = response.split('\n');

    for (const line of lines) {
      const trimmed = line.trim();
      if (trimmed.match(/^[-*•]\s+/) || trimmed.match(/^\d+\.\s+/)) {
        suggestions.push(trimmed.replace(/^[-*•]\s+/, '').replace(/^\d+\.\s+/, ''));
      }
    }

    return suggestions;
  }

  /**
   * Extract token values from token object
   */
  private extractTokenValues(obj: any, values: string[] = []): string[] {
    for (const [key, value] of Object.entries(obj)) {
      if (typeof value === 'object' && value !== null) {
        if ('value' in value) {
          values.push((value as any).value.toUpperCase());
        } else {
          this.extractTokenValues(value, values);
        }
      }
    }
    return values;
  }

  /**
   * Calculate overall score
   */
  private calculateScore(checks: ReviewCheck[]): number {
    const totalChecks = checks.length;
    const passedChecks = checks.filter(c => c.passed).length;
    
    // Calculate score from 0-100
    const baseScore = (passedChecks / totalChecks) * 100;
    
    // Deduct points for issues
    const allIssues = checks.flatMap(c => c.issues);
    const criticalCount = allIssues.filter(i => i.severity === 'critical').length;
    const highCount = allIssues.filter(i => i.severity === 'high').length;
    const mediumCount = allIssues.filter(i => i.severity === 'medium').length;
    
    const deduction = (criticalCount * 20) + (highCount * 10) + (mediumCount * 5);
    
    return Math.max(0, Math.round(baseScore - deduction));
  }
}

// Types
export interface DesignReviewerConfig {
  openaiApiKey?: string;
  context?: DesignSystemContext;
  designSystemPath?: string;
}

export interface ReviewConfig {
  path: string;
  checkTokens?: boolean;
  checkAccessibility?: boolean;
  checkDocumentation?: boolean;
  platforms?: string[];
}

export interface ReviewResult {
  component: string;
  consistent: boolean;
  score: number;
  issues: ReviewIssue[];
  warnings: ReviewIssue[];
  suggestions: string[];
  checks: ReviewCheck[];
  timestamp: string;
}

export interface ReviewCheck {
  name: string;
  passed: boolean;
  issues: ReviewIssue[];
  warnings: ReviewIssue[];
}

export interface ReviewIssue {
  category: string;
  message: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  suggestion?: string;
}

export interface AIReviewResult {
  suggestions: string[];
}

export default DesignReviewerAgent;
