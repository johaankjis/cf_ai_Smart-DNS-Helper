/**
 * Cloudflare Agent Base Class
 * Inspired by https://agents.cloudflare.com/
 */

import type { AgentState, AgentEnv, AgentConfig, ScheduleConfig } from "./agent-types"

export abstract class Agent<
  Env extends AgentEnv = AgentEnv,
  State extends AgentState = AgentState
> {
  public name: string
  public description?: string
  public version: string
  protected state: State
  protected env: Env
  private schedules: ScheduleConfig[] = []

  constructor(config: AgentConfig, env: Env, initialState: State) {
    this.name = config.name
    this.description = config.description
    this.version = config.version || "1.0.0"
    this.env = env
    this.state = initialState
    
    // Call onStart lifecycle hook
    this.onStart()
  }

  /**
   * Lifecycle hook called when agent is initialized
   * Use this to set up schedules or initialize resources
   */
  protected onStart(): void {
    // Override in subclasses
  }

  /**
   * Schedule a method to run at specific intervals
   * @param schedule - Cron-like schedule string (e.g., "weekdays at 11:30am", "daily at 5pm")
   * @param methodName - Name of the method to execute
   */
  protected schedule(schedule: string, methodName: string): void {
    this.schedules.push({ schedule, method: methodName })
  }

  /**
   * Get the current state of the agent
   */
  public getState(): State {
    return { ...this.state }
  }

  /**
   * Update the agent's state
   * @param newState - New state or partial state update
   */
  public setState(newState: Partial<State>): void {
    this.state = { ...this.state, ...newState }
  }

  /**
   * Get all scheduled tasks
   */
  public getSchedules(): ScheduleConfig[] {
    return [...this.schedules]
  }

  /**
   * Get agent metadata
   */
  public getMetadata() {
    return {
      name: this.name,
      description: this.description,
      version: this.version,
      schedules: this.schedules,
    }
  }

  /**
   * Execute a callable method by name
   */
  public async executeMethod(methodName: string, ...args: any[]): Promise<any> {
    const method = (this as any)[methodName]
    if (typeof method === "function") {
      return await method.apply(this, args)
    }
    throw new Error(`Method ${methodName} not found or not callable`)
  }
}
