import { ImageController } from './Controllers/ImageController.ts'
import cron from 'node-cron'
import * as dotenv from 'dotenv'
dotenv.config()

cron.schedule('* * * * *', async () => {
  const imageController = new ImageController()
  await imageController.run()
})
