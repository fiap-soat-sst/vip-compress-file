export interface IQueueConsumerGateway {
  receiveMessages(): Promise<any>
  deleteMessage(receiptHandle?: string): Promise<any>
}
