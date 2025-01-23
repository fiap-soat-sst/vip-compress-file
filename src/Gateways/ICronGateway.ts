export interface ICronGateway {
  schedule(cron: string, methodToCall: () => void): void
}
