#!/usr/bin/env ts-node
/**
 * CLI tool for generating components using AI agents
 */

import { Command } from 'commander';
import { ComponentGeneratorAgent } from '../agents/component-generator';
import { DesignReviewerAgent } from '../agents/design-reviewer';
import { QAAgent } from '../agents/qa';
import { LibraryUpdater } from '../core/library-updater';
import { Logger } from '../core/logger';
import * as dotenv from 'dotenv';

dotenv.config();

const program = new Command();
const logger = new Logger('CLI');

program
  .name('generate-component')
  .description('Generate a new design system component using AI')
  .version('1.0.0');

program
  .option('-n, --name <name>', 'Component name (required)')
  .option('-t, --type <type>', 'Component type (e.g., input, overlay, navigation)')
  .option('-d, --description <description>', 'Component description')
  .option('-v, --variants <variants>', 'Comma-separated list of variants')
  .option('-f, --features <features>', 'Comma-separated list of features')
  .option('-p, --platforms <platforms>', 'Comma-separated list of platforms (web,ios,android)', 'web,ios,android')
  .option('--no-review', 'Skip design review')
  .option('--no-qa', 'Skip QA tests')
  .option('--no-update', 'Skip library update')
  .option('--dry-run', 'Generate without writing files')
  .action(async (options) => {
    try {
      // Validate required options
      if (!options.name) {
        logger.error('Component name is required');
        program.help();
        return;
      }

      logger.info(`Generating component: ${options.name}`);

      // Parse options
      const spec = {
        name: options.name,
        type: options.type || 'general',
        description: options.description || `${options.name} component`,
        variants: options.variants?.split(',').map((v: string) => v.trim()),
        features: options.features?.split(',').map((f: string) => f.trim()),
        platforms: options.platforms.split(',').map((p: string) => p.trim()),
        autoWrite: !options.dryRun
      };

      // Initialize generator
      const generator = new ComponentGeneratorAgent({
        openaiApiKey: process.env.OPENAI_API_KEY
      });

      // Generate component
      logger.info('Step 1/4: Generating component...');
      const result = await generator.generateComponent(spec);

      if (!result.success) {
        logger.error('Component generation failed');
        result.errors.forEach(error => {
          logger.error(`  ${error.platform}: ${error.error}`);
        });
        process.exit(1);
      }

      logger.success(`Generated ${result.files.length} files`);
      result.files.forEach(file => {
        logger.info(`  - ${file.path}`);
      });

      // Review component
      if (options.review && result.files.length > 0) {
        logger.info('Step 2/4: Reviewing component...');
        const reviewer = new DesignReviewerAgent({});
        const review = await reviewer.reviewComponent({
          path: result.files[0].path
        });

        if (review.consistent) {
          logger.success(`Design review passed (score: ${review.score}/100)`);
        } else {
          logger.warn(`Design review found ${review.issues.length} issues (score: ${review.score}/100)`);
          review.issues.forEach(issue => {
            logger.warn(`  - [${issue.severity}] ${issue.message}`);
          });
        }
      }

      // Run QA tests
      if (options.qa) {
        logger.info('Step 3/4: Running QA tests...');
        const qa = new QAAgent({});
        const testResult = await qa.testComponent({
          name: spec.name,
          platforms: spec.platforms
        });

        if (testResult.passed) {
          logger.success(`All tests passed (coverage: ${testResult.coverage}%)`);
        } else {
          logger.warn(`Some tests failed (coverage: ${testResult.coverage}%)`);
          testResult.tests.filter(t => !t.passed).forEach(test => {
            logger.warn(`  - ${test.type}: ${test.message}`);
          });
        }
      }

      // Update library
      if (options.update && !options.dryRun) {
        logger.info('Step 4/4: Updating library...');
        const updater = new LibraryUpdater({
          autoCommit: process.env.AUTO_COMMIT === 'true',
          autoVersionBump: process.env.AUTO_VERSION_BUMP as any || 'minor'
        });

        const updateResult = await updater.addComponent({
          name: spec.name,
          description: spec.description,
          files: result.files.map(f => f.path),
          platforms: spec.platforms
        });

        if (updateResult.success) {
          logger.success('Library updated successfully');
          if (updateResult.newVersion) {
            logger.success(`Version bumped to ${updateResult.newVersion}`);
          }
        } else {
          logger.warn('Library update had some issues:');
          updateResult.errors.forEach(error => {
            logger.warn(`  - ${error}`);
          });
        }
      }

      logger.success(`✨ Component ${options.name} generated successfully!`);

    } catch (error: any) {
      logger.error('Failed to generate component', error);
      process.exit(1);
    }
  });

program.parse();
