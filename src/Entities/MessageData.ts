import { Video } from './video'

export class MessageData {
  private _email: string
  private _video: Video
  constructor(data: any) {
    this._email = data.email
    this._video = data.video
  }

  public get email(): string {
    return this._email
  }

  public get video(): Video {
    return this._video
  }

  public toJSON(): any {
    return {
      email: this._email,
      video: this._video,
    }
  }
}
