import { describe, it, expect, vi } from 'vitest'
import cron from 'node-cron'
import { CronGateway } from '../../src/External/cron/node-cron'

// Mock node-cron
vi.mock('node-cron', () => ({
  default: {
    schedule: vi.fn(),
  },
}))

describe('CronGateway', () => {
  it('should schedule a cron job', () => {
    const cronGateway = new CronGateway()
    const mockMethod = vi.fn()
    const cronRule = '0 * * * *'

    cronGateway.schedule(cronRule, mockMethod)

    expect(cron.schedule).toHaveBeenCalledWith(cronRule, mockMethod)
  })
})
