/**
 * Model Context Server (MCP)
 * Central hub for AI agents to access design system knowledge
 */

import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import { DesignSystemContext } from './context';
import { AgentCoordinator } from '../core/coordinator';
import { ComponentGeneratorAgent } from '../agents/component-generator';
import { DesignReviewerAgent } from '../agents/design-reviewer';
import { QAAgent } from '../agents/qa';
import { Logger } from '../core/logger';

export class MCPServer {
  private app: Express;
  private context: DesignSystemContext;
  private coordinator: AgentCoordinator;
  private logger: Logger;
  private port: number;

  constructor(config: MCPConfig) {
    this.app = express();
    this.port = config.port || 3001;
    this.logger = new Logger('MCP-Server');
    
    this.context = new DesignSystemContext({
      designSystemPath: config.designSystemPath || '../',
      cacheEnabled: config.cacheEnabled ?? true,
      cacheTTL: config.cacheTTL || 3600
    });

    this.coordinator = new AgentCoordinator({
      context: this.context,
      maxConcurrent: config.maxConcurrentAgents || 3
    });

    this.setupMiddleware();
    this.setupRoutes();
  }

  private setupMiddleware(): void {
    this.app.use(cors());
    this.app.use(express.json({ limit: '10mb' }));
    this.app.use(express.urlencoded({ extended: true }));
    
    // Request logging
    this.app.use((req: Request, res: Response, next) => {
      this.logger.info(`${req.method} ${req.path}`, {
        ip: req.ip,
        userAgent: req.get('user-agent')
      });
      next();
    });
  }

  private setupRoutes(): void {
    // Health check
    this.app.get('/health', (req: Request, res: Response) => {
      res.json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        version: '1.0.0',
        uptime: process.uptime()
      });
    });

    // Get design system context
    this.app.get('/api/context/design-system', async (req: Request, res: Response) => {
      try {
        const fullContext = req.query.full === 'true';
        const context = await this.context.getFullContext(fullContext);
        
        res.json({
          success: true,
          data: context,
          cached: this.context.isCached()
        });
      } catch (error) {
        this.handleError(error, res);
      }
    });

    // Get component context
    this.app.get('/api/context/component/:name', async (req: Request, res: Response) => {
      try {
        const { name } = req.params;
        const context = await this.context.getComponentContext(name);
        
        res.json({
          success: true,
          data: context
        });
      } catch (error) {
        this.handleError(error, res);
      }
    });

    // Get design tokens
    this.app.get('/api/context/tokens', async (req: Request, res: Response) => {
      try {
        const tokens = await this.context.getTokens();
        
        res.json({
          success: true,
          data: tokens
        });
      } catch (error) {
        this.handleError(error, res);
      }
    });

    // Generate component
    this.app.post('/api/generate/component', async (req: Request, res: Response) => {
      try {
        const spec = req.body;
        
        this.logger.info('Generating component', { name: spec.name });
        
        const result = await this.coordinator.execute({
          task: 'generate-component',
          agents: ['component-generator', 'design-reviewer', 'qa'],
          config: spec
        });
        
        res.json({
          success: true,
          data: result
        });
      } catch (error) {
        this.handleError(error, res);
      }
    });

    // Review component
    this.app.post('/api/review/component', async (req: Request, res: Response) => {
      try {
        const { componentPath, checkAccessibility, checkTokens } = req.body;
        
        const reviewer = new DesignReviewerAgent({
          context: this.context
        });
        
        const review = await reviewer.reviewComponent({
          path: componentPath,
          checkAccessibility: checkAccessibility ?? true,
          checkTokens: checkTokens ?? true
        });
        
        res.json({
          success: true,
          data: review
        });
      } catch (error) {
        this.handleError(error, res);
      }
    });

    // Update library
    this.app.post('/api/update/library', async (req: Request, res: Response) => {
      try {
        const { component, version, autoCommit } = req.body;
        
        const result = await this.coordinator.execute({
          task: 'update-library',
          agents: ['library-updater'],
          config: { component, version, autoCommit }
        });
        
        res.json({
          success: true,
          data: result
        });
      } catch (error) {
        this.handleError(error, res);
      }
    });

    // Coordinate multiple agents
    this.app.post('/api/agent/coordinate', async (req: Request, res: Response) => {
      try {
        const { task, agents, config } = req.body;
        
        this.logger.info('Coordinating agents', { task, agents });
        
        const result = await this.coordinator.execute({
          task,
          agents,
          config
        });
        
        res.json({
          success: true,
          data: result
        });
      } catch (error) {
        this.handleError(error, res);
      }
    });

    // Get agent status
    this.app.get('/api/agents/status', (req: Request, res: Response) => {
      const status = this.coordinator.getStatus();
      
      res.json({
        success: true,
        data: status
      });
    });

    // Get metrics
    this.app.get('/api/metrics', async (req: Request, res: Response) => {
      try {
        const metrics = await this.coordinator.getMetrics();
        
        res.json({
          success: true,
          data: metrics
        });
      } catch (error) {
        this.handleError(error, res);
      }
    });

    // Clear cache
    this.app.post('/api/cache/clear', async (req: Request, res: Response) => {
      try {
        await this.context.clearCache();
        
        res.json({
          success: true,
          message: 'Cache cleared successfully'
        });
      } catch (error) {
        this.handleError(error, res);
      }
    });

    // Update context
    this.app.post('/api/context/update', async (req: Request, res: Response) => {
      try {
        await this.context.refresh();
        
        res.json({
          success: true,
          message: 'Context updated successfully'
        });
      } catch (error) {
        this.handleError(error, res);
      }
    });

    // WebSocket endpoint for real-time updates
    this.setupWebSocket();
  }

  private setupWebSocket(): void {
    // WebSocket implementation for real-time agent updates
    // This would use ws or socket.io for real-time communication
    this.logger.info('WebSocket endpoints configured');
  }

  private handleError(error: any, res: Response): void {
    this.logger.error('Request error', error);
    
    const statusCode = error.statusCode || 500;
    const message = error.message || 'Internal server error';
    
    res.status(statusCode).json({
      success: false,
      error: {
        message,
        code: error.code || 'INTERNAL_ERROR',
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined
      }
    });
  }

  public async start(): Promise<void> {
    return new Promise((resolve) => {
      this.app.listen(this.port, () => {
        this.logger.success(`MCP Server started on port ${this.port}`);
        this.logger.info(`Health check: http://localhost:${this.port}/health`);
        this.logger.info(`API docs: http://localhost:${this.port}/api-docs`);
        resolve();
      });
    });
  }

  public async stop(): Promise<void> {
    this.logger.info('Shutting down MCP Server');
    // Cleanup and shutdown logic
  }
}

// Types
export interface MCPConfig {
  port?: number;
  host?: string;
  designSystemPath?: string;
  cacheEnabled?: boolean;
  cacheTTL?: number;
  maxConcurrentAgents?: number;
  openaiApiKey?: string;
}

// Start server if run directly
if (require.main === module) {
  const config: MCPConfig = {
    port: parseInt(process.env.MCP_PORT || '3001'),
    host: process.env.MCP_HOST || 'localhost',
    designSystemPath: process.env.DESIGN_SYSTEM_PATH || '../',
    cacheEnabled: process.env.CACHE_ENABLED !== 'false',
    cacheTTL: parseInt(process.env.CACHE_TTL || '3600'),
    maxConcurrentAgents: parseInt(process.env.MAX_CONCURRENT_AGENTS || '3'),
    openaiApiKey: process.env.OPENAI_API_KEY
  };

  const server = new MCPServer(config);
  
  server.start().catch((error) => {
    console.error('Failed to start MCP Server:', error);
    process.exit(1);
  });

  // Graceful shutdown
  process.on('SIGTERM', async () => {
    await server.stop();
    process.exit(0);
  });
}

export default MCPServer;
