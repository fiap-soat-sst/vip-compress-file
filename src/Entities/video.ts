export class Video {
  private _id: string
  private _name: string
  private _size: number
  private _contentType: string
  private _hash: string
  private _managerService: { url: string }
  private _processService: { images: { url: string }[] }
  constructor(data: any) {
    this._id = data.id
    this._name = data.name
    this._size = data.size
    this._contentType = data.contentType
    this._hash = data.hash
    this._managerService = data.managerService
    this._processService = data.processService
  }

  public get id(): string {
    return this._id
  }

  public get name(): string {
    return this._name
  }

  public get hash(): string {
    return this._hash
  }

  public get processService(): { images: { url: string }[] } {
    return this._processService
  }

  public toJSON(): any {
    return {
      id: this._id,
      name: this._name,
      size: this._size,
      contentType: this._contentType,
      hash: this._hash,
      managerService: this._managerService,
      processService: this._processService,
    }
  }
}
