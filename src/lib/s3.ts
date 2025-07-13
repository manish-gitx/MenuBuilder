import AWS from 'aws-sdk'
import multer from 'multer'
import multerS3 from 'multer-s3'
import { v4 as uuidv4 } from 'uuid'

// Configure AWS
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION || 'us-east-1'
})

export const s3 = new AWS.S3()

// S3 upload configuration for multer
export const upload = multer({
  storage: multerS3({
    s3: s3 as any,
    bucket: process.env.AWS_S3_BUCKET_NAME || 'menu-catering',
    metadata: function (req: any, file: any, cb: any) {
      cb(null, { fieldName: file.fieldname })
    },
    key: function (req: any, file: any, cb: any) {
      // Generate unique filename with UUID
      const fileExtension = file.originalname.split('.').pop()
      const fileName = `menu-items/${uuidv4()}.${fileExtension}`
      cb(null, fileName)
    }
  }),
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: function (req: any, file: any, cb: any) {
    // Accept only image files
    if (file.mimetype.startsWith('image/')) {
      cb(null, true)
    } else {
      const error = new Error('Only image files are allowed!')
      cb(error, false)
    }
  }
})

// Helper function to delete image from S3
export const deleteImageFromS3 = async (imageUrl: string): Promise<void> => {
  try {
    // Extract key from URL
    const url = new URL(imageUrl)
    const key = url.pathname.substring(1) // Remove leading slash
    
    await s3.deleteObject({
      Bucket: process.env.AWS_S3_BUCKET_NAME || 'menu-catering',
      Key: key
    }).promise()
  } catch (error) {
    console.error('Error deleting image from S3:', error)
    throw error
  }
}

// Helper function to get signed URL for secure access
export const getSignedUrl = (key: string, expires: number = 3600): string => {
  return s3.getSignedUrl('getObject', {
    Bucket: process.env.AWS_S3_BUCKET_NAME || 'menu-catering',
    Key: key,
    Expires: expires
  })
} 