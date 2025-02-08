import { describe, it, expect } from 'vitest'
import { MessageData } from '../../src/Entities/MessageData'
import { Video } from '../../src/Entities/video'

describe('MessageData Entity', () => {
  const videoData = {
    id: 'video-id',
    name: 'video-name',
    size: 100,
    contentType: 'video/mp4',
    hash: 'folder-to-zip',
    managerService: { url: 'manager-service-url' },
    processService: { images: [{ url: 'image-url' }] },
  }

  const messageDataInput = {
    email: 'user@example.com',
    video: new Video(videoData),
  }

  it('should correctly initialize with provided data', () => {
    const messageData = new MessageData(messageDataInput)

    expect(messageData.email).toBe(messageDataInput.email)
    expect(messageData.video).toBeInstanceOf(Video)
    expect(messageData.video.id).toBe(videoData.id)
  })

  it('should return a valid JSON representation', () => {
    const messageData = new MessageData(messageDataInput)
    expect(messageData.toJSON()).toEqual(messageDataInput)
  })
})
