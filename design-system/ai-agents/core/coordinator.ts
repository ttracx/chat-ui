/**
 * Agent Coordinator
 * Orchestrates multiple AI agents to complete complex tasks
 */

import { DesignSystemContext } from '../mcp/context';
import { ComponentGeneratorAgent } from '../agents/component-generator';
import { DesignReviewerAgent } from '../agents/design-reviewer';
import { QAAgent } from '../agents/qa';
import { LibraryUpdater } from './library-updater';
import { Logger } from './logger';
import EventEmitter from 'events';

export class AgentCoordinator extends EventEmitter {
  private context: DesignSystemContext;
  private logger: Logger;
  private maxConcurrent: number;
  private activeAgents: Map<string, any>;
  private taskQueue: CoordinationTask[];
  private metrics: CoordinatorMetrics;

  constructor(config: CoordinatorConfig) {
    super();
    this.context = config.context;
    this.logger = new Logger('AgentCoordinator');
    this.maxConcurrent = config.maxConcurrent || 3;
    this.activeAgents = new Map();
    this.taskQueue = [];
    this.metrics = {
      tasksCompleted: 0,
      tasksSuccess: 0,
      tasksFailed: 0,
      averageDuration: 0,
      agentUsage: {}
    };
  }

  /**
   * Execute a coordinated task with multiple agents
   */
  public async execute(task: CoordinationTask): Promise<CoordinationResult> {
    this.logger.info(`Executing task: ${task.task}`, { agents: task.agents });

    const startTime = Date.now();
    const result: CoordinationResult = {
      task: task.task,
      success: true,
      results: {},
      errors: [],
      duration: 0
    };

    try {
      // Execute task based on type
      switch (task.task) {
        case 'generate-component':
          result.results = await this.handleGenerateComponent(task);
          break;
          
        case 'review-component':
          result.results = await this.handleReviewComponent(task);
          break;
          
        case 'update-library':
          result.results = await this.handleUpdateLibrary(task);
          break;
          
        case 'create-feature':
          result.results = await this.handleCreateFeature(task);
          break;
          
        default:
          result.results = await this.handleGenericTask(task);
      }

      // Update metrics
      this.metrics.tasksCompleted++;
      this.metrics.tasksSuccess++;

    } catch (error: any) {
      this.logger.error(`Task failed: ${task.task}`, error);
      result.success = false;
      result.errors.push(error.message);
      this.metrics.tasksFailed++;
    } finally {
      result.duration = Date.now() - startTime;
      this.updateMetrics(result.duration);
      this.emit('task-complete', result);
    }

    return result;
  }

  /**
   * Handle component generation with review and QA
   */
  private async handleGenerateComponent(task: CoordinationTask): Promise<any> {
    const config = task.config;
    
    // Step 1: Generate component
    this.logger.info('Step 1: Generating component');
    const generator = this.getAgent('component-generator') as ComponentGeneratorAgent;
    const generationResult = await generator.generateComponent(config);

    if (!generationResult.success) {
      throw new Error(`Component generation failed: ${generationResult.errors.map(e => e.error).join(', ')}`);
    }

    // Step 2: Review design consistency
    if (task.agents.includes('design-reviewer')) {
      this.logger.info('Step 2: Reviewing design consistency');
      const reviewer = this.getAgent('design-reviewer') as DesignReviewerAgent;
      const reviewResult = await reviewer.reviewComponent({
        path: generationResult.files[0].path
      });

      if (!reviewResult.consistent) {
        this.logger.warn('Design review found issues', { issues: reviewResult.issues });
      }

      generationResult.review = reviewResult;
    }

    // Step 3: Run QA tests
    if (task.agents.includes('qa')) {
      this.logger.info('Step 3: Running QA tests');
      const qa = this.getAgent('qa') as QAAgent;
      const qaResult = await qa.testComponent({
        name: config.name,
        platforms: config.platforms || ['web', 'ios', 'android']
      });

      generationResult.qa = qaResult;
    }

    // Step 4: Update library
    if (task.config.autoUpdate !== false) {
      this.logger.info('Step 4: Updating library');
      const updater = this.getAgent('library-updater') as LibraryUpdater;
      const updateResult = await updater.addComponent({
        name: config.name,
        description: config.description,
        files: generationResult.files.map(f => f.path),
        platforms: config.platforms
      });

      generationResult.libraryUpdate = updateResult;
    }

    return generationResult;
  }

  /**
   * Handle component review
   */
  private async handleReviewComponent(task: CoordinationTask): Promise<any> {
    const reviewer = this.getAgent('design-reviewer') as DesignReviewerAgent;
    return await reviewer.reviewComponent(task.config);
  }

  /**
   * Handle library update
   */
  private async handleUpdateLibrary(task: CoordinationTask): Promise<any> {
    const updater = this.getAgent('library-updater') as LibraryUpdater;
    return await updater.addComponent(task.config);
  }

  /**
   * Handle complex feature creation
   */
  private async handleCreateFeature(task: CoordinationTask): Promise<any> {
    const { feature, description, components } = task.config;
    const results: any[] = [];

    this.logger.info(`Creating feature: ${feature}`);

    // Generate each component in the feature
    for (const component of components || []) {
      const componentResult = await this.execute({
        task: 'generate-component',
        agents: ['component-generator', 'design-reviewer', 'qa'],
        config: component
      });

      results.push(componentResult);
    }

    return {
      feature,
      components: results,
      success: results.every(r => r.success)
    };
  }

  /**
   * Handle generic tasks
   */
  private async handleGenericTask(task: CoordinationTask): Promise<any> {
    const results: any = {};

    for (const agentType of task.agents) {
      const agent = this.getAgent(agentType);
      
      if (agent && typeof agent.execute === 'function') {
        results[agentType] = await agent.execute(task.config);
      }
    }

    return results;
  }

  /**
   * Get or create an agent instance
   */
  private getAgent(type: string): any {
    if (this.activeAgents.has(type)) {
      return this.activeAgents.get(type);
    }

    let agent: any;
    const config = {
      context: this.context,
      openaiApiKey: process.env.OPENAI_API_KEY
    };

    switch (type) {
      case 'component-generator':
        agent = new ComponentGeneratorAgent(config);
        break;
      case 'design-reviewer':
        agent = new DesignReviewerAgent(config);
        break;
      case 'qa':
        agent = new QAAgent(config);
        break;
      case 'library-updater':
        agent = new LibraryUpdater({
          autoCommit: true,
          autoVersionBump: 'minor'
        });
        break;
      default:
        throw new Error(`Unknown agent type: ${type}`);
    }

    this.activeAgents.set(type, agent);
    this.trackAgentUsage(type);

    return agent;
  }

  /**
   * Get coordinator status
   */
  public getStatus(): CoordinatorStatus {
    return {
      activeAgents: Array.from(this.activeAgents.keys()),
      queuedTasks: this.taskQueue.length,
      metrics: this.metrics
    };
  }

  /**
   * Get performance metrics
   */
  public async getMetrics(): Promise<CoordinatorMetrics> {
    return { ...this.metrics };
  }

  /**
   * Update metrics
   */
  private updateMetrics(duration: number): void {
    const total = this.metrics.tasksCompleted;
    this.metrics.averageDuration = 
      ((this.metrics.averageDuration * (total - 1)) + duration) / total;
  }

  /**
   * Track agent usage
   */
  private trackAgentUsage(agentType: string): void {
    if (!this.metrics.agentUsage[agentType]) {
      this.metrics.agentUsage[agentType] = 0;
    }
    this.metrics.agentUsage[agentType]++;
  }

  /**
   * Queue a task for later execution
   */
  public queueTask(task: CoordinationTask): void {
    this.taskQueue.push(task);
    this.emit('task-queued', task);
  }

  /**
   * Process queued tasks
   */
  public async processQueue(): Promise<void> {
    while (this.taskQueue.length > 0) {
      const task = this.taskQueue.shift();
      if (task) {
        await this.execute(task);
      }
    }
  }

  /**
   * Cancel all active tasks
   */
  public cancelAll(): void {
    this.taskQueue = [];
    this.activeAgents.clear();
    this.logger.info('All tasks cancelled');
  }
}

// Types
export interface CoordinatorConfig {
  context: DesignSystemContext;
  maxConcurrent?: number;
}

export interface CoordinationTask {
  task: string;
  agents: string[];
  config: any;
}

export interface CoordinationResult {
  task: string;
  success: boolean;
  results: any;
  errors: string[];
  duration: number;
}

export interface CoordinatorStatus {
  activeAgents: string[];
  queuedTasks: number;
  metrics: CoordinatorMetrics;
}

export interface CoordinatorMetrics {
  tasksCompleted: number;
  tasksSuccess: number;
  tasksFailed: number;
  averageDuration: number;
  agentUsage: Record<string, number>;
}

export default AgentCoordinator;
