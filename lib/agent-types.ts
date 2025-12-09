/**
 * Cloudflare Agents SDK Types
 * Based on https://agents.cloudflare.com/
 */

export interface AgentState {
  [key: string]: any
}

export interface AgentEnv {
  AI?: any
  [key: string]: any
}

export interface CallableMetadata {
  propertyKey: string
  descriptor: PropertyDescriptor
}

export interface ScheduleConfig {
  schedule: string
  method: string
}

export interface AgentConfig {
  name: string
  description?: string
  version?: string
}

export interface AgentCallResult<T = any> {
  success: boolean
  data?: T
  error?: string
  timestamp: Date
}

/**
 * Decorator for marking methods as callable by external systems
 */
export function callable() {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ): void {
    if (!target.constructor._callableMethods) {
      target.constructor._callableMethods = []
    }
    target.constructor._callableMethods.push({
      name: propertyKey,
      method: descriptor.value,
    })
  }
}

/**
 * Get all callable methods from an agent instance
 */
export function getCallableMethods(agent: any): string[] {
  const constructor = agent.constructor
  if (!constructor._callableMethods) {
    return []
  }
  return constructor._callableMethods.map((m: any) => m.name)
}
