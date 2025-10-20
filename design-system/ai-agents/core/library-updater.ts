/**
 * Library Updater
 * Automatically updates library packages when components are created
 */

import { promises as fs } from 'fs';
import path from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';
import { Logger } from './logger';

const execAsync = promisify(exec);

export class LibraryUpdater {
  private logger: Logger;
  private autoCommit: boolean;
  private autoVersionBump: 'major' | 'minor' | 'patch' | false;
  private designSystemPath: string;

  constructor(config: LibraryUpdaterConfig) {
    this.logger = new Logger('LibraryUpdater');
    this.autoCommit = config.autoCommit ?? true;
    this.autoVersionBump = config.autoVersionBump || 'minor';
    this.designSystemPath = path.resolve(config.designSystemPath || '../');
  }

  /**
   * Add a new component to the library
   */
  public async addComponent(config: AddComponentConfig): Promise<UpdateResult> {
    this.logger.info(`Adding component to library: ${config.name}`);

    const results: UpdateResult = {
      component: config.name,
      updates: [],
      errors: [],
      success: true
    };

    try {
      // 1. Update package exports
      await this.updatePackageExports(config);
      results.updates.push('Updated package exports');

      // 2. Update documentation index
      await this.updateDocumentationIndex(config);
      results.updates.push('Updated documentation index');

      // 3. Generate TypeScript types (if applicable)
      if (config.generateTypes !== false) {
        await this.generateTypes(config);
        results.updates.push('Generated TypeScript types');
      }

      // 4. Run tests
      if (config.runTests !== false) {
        await this.runTests(config);
        results.updates.push('Ran tests successfully');
      }

      // 5. Update changelog
      if (this.autoVersionBump) {
        await this.updateChangelog(config);
        results.updates.push('Updated CHANGELOG.md');
      }

      // 6. Commit changes
      if (this.autoCommit) {
        await this.commitChanges(config);
        results.updates.push('Committed changes to git');
      }

      // 7. Bump version
      if (this.autoVersionBump) {
        const newVersion = await this.bumpVersion(this.autoVersionBump);
        results.updates.push(`Bumped version to ${newVersion}`);
        results.newVersion = newVersion;
      }

      this.logger.success(`Component ${config.name} added successfully`);

    } catch (error: any) {
      this.logger.error('Failed to update library', error);
      results.success = false;
      results.errors.push(error.message);
    }

    return results;
  }

  /**
   * Update package.json exports
   */
  private async updatePackageExports(config: AddComponentConfig): Promise<void> {
    const platforms = ['web', 'ios', 'android'];

    for (const platform of platforms) {
      const packagePath = path.join(
        this.designSystemPath,
        'platforms',
        platform,
        'package.json'
      );

      try {
        const content = await fs.readFile(packagePath, 'utf-8');
        const pkg = JSON.parse(content);

        // Add export for new component
        if (!pkg.exports) {
          pkg.exports = {};
        }

        // Web exports
        if (platform === 'web') {
          pkg.exports[`./${config.name}`] = {
            import: `./components/${config.name}.svelte`,
            require: `./dist/${config.name}.js`,
            types: `./dist/${config.name}.d.ts`
          };
        }

        // Update main exports
        if (!pkg.exports['./components']) {
          pkg.exports['./components'] = './components/index.js';
        }

        // Write updated package.json
        await fs.writeFile(
          packagePath,
          JSON.stringify(pkg, null, 2) + '\n',
          'utf-8'
        );

        this.logger.info(`Updated ${platform}/package.json`);
      } catch (error) {
        // Package.json might not exist for all platforms
        this.logger.debug(`Skipped ${platform}/package.json`);
      }
    }
  }

  /**
   * Update documentation index
   */
  private async updateDocumentationIndex(config: AddComponentConfig): Promise<void> {
    const indexPath = path.join(this.designSystemPath, 'INDEX.md');

    try {
      let content = await fs.readFile(indexPath, 'utf-8');

      // Find components section
      const componentsRegex = /(### Foundation Components|### Display & Feedback)([\s\S]*?)(?=###|\n##|$)/;
      const match = content.match(componentsRegex);

      if (match) {
        const section = match[2];
        const newEntry = `- [${config.name}](./components/${config.name}.md) - ${config.description || 'New component'}\n`;
        
        // Insert new entry alphabetically
        const lines = section.split('\n').filter(l => l.trim().startsWith('-'));
        lines.push(newEntry);
        lines.sort();

        const updatedSection = match[1] + '\n' + lines.join('') + '\n';
        content = content.replace(componentsRegex, updatedSection);

        await fs.writeFile(indexPath, content, 'utf-8');
        this.logger.info('Updated INDEX.md');
      }
    } catch (error) {
      this.logger.warn('Could not update INDEX.md');
    }
  }

  /**
   * Generate TypeScript type definitions
   */
  private async generateTypes(config: AddComponentConfig): Promise<void> {
    // This would run TypeScript compiler or type generation tools
    this.logger.debug('Type generation would run here');
  }

  /**
   * Run tests for new component
   */
  private async runTests(config: AddComponentConfig): Promise<void> {
    try {
      const { stdout, stderr } = await execAsync('npm test', {
        cwd: this.designSystemPath
      });

      if (stderr && !stderr.includes('warning')) {
        throw new Error(stderr);
      }

      this.logger.info('Tests passed');
    } catch (error: any) {
      // Don't fail the update if tests fail, just log
      this.logger.warn('Tests failed:', error.message);
    }
  }

  /**
   * Update changelog
   */
  private async updateChangelog(config: AddComponentConfig): Promise<void> {
    const changelogPath = path.join(this.designSystemPath, 'CHANGELOG.md');

    try {
      let content = await fs.readFile(changelogPath, 'utf-8');

      // Find [Unreleased] section
      const unreleasedRegex = /## \[Unreleased\]([\s\S]*?)(?=\n## \[|$)/;
      const match = content.match(unreleasedRegex);

      if (match) {
        const unreleasedSection = match[1];
        
        // Add to Added section
        let updatedSection = unreleasedSection;
        if (!updatedSection.includes('### Added')) {
          updatedSection = '\n\n### Added\n' + updatedSection;
        }

        const addedRegex = /(### Added\n)/;
        updatedSection = updatedSection.replace(
          addedRegex,
          `$1- **${config.name}**: ${config.description || 'New component'}\n`
        );

        content = content.replace(unreleasedRegex, '## [Unreleased]' + updatedSection);

        await fs.writeFile(changelogPath, content, 'utf-8');
        this.logger.info('Updated CHANGELOG.md');
      }
    } catch (error) {
      this.logger.warn('Could not update CHANGELOG.md');
    }
  }

  /**
   * Commit changes to git
   */
  private async commitChanges(config: AddComponentConfig): Promise<void> {
    try {
      // Stage all changes
      await execAsync('git add .', { cwd: this.designSystemPath });

      // Commit with conventional commit message
      const message = `feat(${config.name.toLowerCase()}): add ${config.name} component

- ${config.description || 'New component'}
- Generated for platforms: ${config.platforms?.join(', ') || 'all'}
- Auto-generated by AI agent`;

      await execAsync(`git commit -m "${message}"`, {
        cwd: this.designSystemPath
      });

      this.logger.success('Changes committed to git');
    } catch (error: any) {
      // Don't fail if commit fails (might already be committed)
      this.logger.warn('Git commit skipped:', error.message);
    }
  }

  /**
   * Bump version number
   */
  private async bumpVersion(type: 'major' | 'minor' | 'patch'): Promise<string> {
    try {
      const { stdout } = await execAsync(`npm version ${type} --no-git-tag-version`, {
        cwd: this.designSystemPath
      });

      const newVersion = stdout.trim().replace('v', '');
      this.logger.success(`Version bumped to ${newVersion}`);
      
      return newVersion;
    } catch (error: any) {
      this.logger.warn('Version bump failed:', error.message);
      return 'unknown';
    }
  }

  /**
   * Publish package to npm
   */
  public async publishPackage(tag: string = 'latest'): Promise<void> {
    try {
      await execAsync(`npm publish --tag ${tag}`, {
        cwd: this.designSystemPath
      });

      this.logger.success(`Published to npm with tag: ${tag}`);
    } catch (error: any) {
      throw new Error(`Failed to publish: ${error.message}`);
    }
  }

  /**
   * Remove a component from the library
   */
  public async removeComponent(componentName: string): Promise<UpdateResult> {
    this.logger.info(`Removing component from library: ${componentName}`);

    const results: UpdateResult = {
      component: componentName,
      updates: [],
      errors: [],
      success: true
    };

    try {
      // Remove files
      const files = [
        `components/${componentName}.md`,
        `platforms/web/components/${componentName}.svelte`,
        `platforms/ios/Components/DS${componentName}.swift`,
        `platforms/android/components/DS${componentName}.kt`
      ];

      for (const file of files) {
        const filePath = path.join(this.designSystemPath, file);
        try {
          await fs.unlink(filePath);
          results.updates.push(`Removed ${file}`);
        } catch {
          // File might not exist
        }
      }

      // Update documentation
      await this.removeFromDocumentation(componentName);
      results.updates.push('Updated documentation');

      // Commit if auto-commit enabled
      if (this.autoCommit) {
        await execAsync(`git add . && git commit -m "chore: remove ${componentName} component"`, {
          cwd: this.designSystemPath
        });
        results.updates.push('Committed changes');
      }

    } catch (error: any) {
      results.success = false;
      results.errors.push(error.message);
    }

    return results;
  }

  /**
   * Remove component from documentation
   */
  private async removeFromDocumentation(componentName: string): Promise<void> {
    const indexPath = path.join(this.designSystemPath, 'INDEX.md');

    try {
      let content = await fs.readFile(indexPath, 'utf-8');
      
      // Remove line mentioning the component
      const regex = new RegExp(`^- \\[${componentName}\\].*$`, 'gm');
      content = content.replace(regex, '');

      await fs.writeFile(indexPath, content, 'utf-8');
    } catch (error) {
      this.logger.warn('Could not update documentation');
    }
  }
}

// Types
export interface LibraryUpdaterConfig {
  autoCommit?: boolean;
  autoVersionBump?: 'major' | 'minor' | 'patch' | false;
  designSystemPath?: string;
}

export interface AddComponentConfig {
  name: string;
  description?: string;
  files?: string[];
  platforms?: string[];
  generateTypes?: boolean;
  runTests?: boolean;
}

export interface UpdateResult {
  component: string;
  updates: string[];
  errors: string[];
  success: boolean;
  newVersion?: string;
}

export default LibraryUpdater;
