import { S3Client, CreateBucketCommand } from '@aws-sdk/client-s3'

const s3Client = new S3Client({
  region: 'us-east-1',
  endpoint: 'http://localhost:4566',
  credentials: {
    accessKeyId: 'test',
    secretAccessKey: 'test',
  },
  forcePathStyle: true, // Required for LocalStack
})

async function createBucket() {
  await s3Client.send(new CreateBucketCommand({ Bucket: 'my-bucket' }))
  console.log('Bucket created')
}

createBucket()
