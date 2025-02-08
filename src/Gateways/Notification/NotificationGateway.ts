import axios from 'axios'
import { Either, Left, Right } from "../../@Shared/Either";
import { INotificationGateway, InputNotificationDTO } from './INotificationGateway';
import dotenv from 'dotenv';
dotenv.config();


export class NotificationGateway implements INotificationGateway {
  private readonly endpoint: string;
  constructor() {
    this.endpoint = process.env.NOTIFICATION_ENDPOINT || '';
  }

  async sendEmail(input: InputNotificationDTO): Promise<Either<Error, string>> {
    const { type, videoId, email, message } = input;

    try {
      await axios.post(this.endpoint + '/send-email', {
        type,
        videoId,
        email,
        message,
      });
      return Right('Email sent successfully');
    } catch (error: any) {
      return Left(new Error('Error sending email, error message: ' + error.message));
    }
  }
}
