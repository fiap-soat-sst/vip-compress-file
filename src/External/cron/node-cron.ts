import cron from 'node-cron'
import { ICronGateway } from '../../Gateways/ICronGateway'

export class CronGateway implements ICronGateway {
  schedule(cronRule: string, methodToCall: () => void) {
    cron.schedule(cronRule, methodToCall)
  }
}
