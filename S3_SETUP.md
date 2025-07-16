# S3 Image Upload Setup Guide

## Required Environment Variables

Add these to your `.env.local` file:

```env
# AWS S3 Configuration for Image Uploads
AWS_ACCESS_KEY_ID=your_aws_access_key_here
AWS_SECRET_ACCESS_KEY=your_aws_secret_key_here
AWS_REGION=us-east-1
AWS_S3_BUCKET_NAME=your-bucket-name
```

## AWS S3 Bucket Setup

1. **Create an S3 Bucket:**
   - Go to AWS S3 Console
   - Create a new bucket with a unique name
   - Choose your preferred region (e.g., us-east-1)

2. **Configure Bucket Permissions:**
   - Enable public read access for uploaded images
   - Add the following bucket policy:

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "PublicReadGetObject",
            "Effect": "Allow",
            "Principal": "*",
            "Action": "s3:GetObject",
            "Resource": "arn:aws:s3:::your-bucket-name/*"
        }
    ]
}
```

3. **Create IAM User:**
   - Go to IAM Console
   - Create a new user for programmatic access
   - Attach the following policy:

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "s3:PutObject",
                "s3:GetObject",
                "s3:DeleteObject"
            ],
            "Resource": "arn:aws:s3:::your-bucket-name/*"
        }
    ]
}
```

4. **Get Access Keys:**
   - After creating the user, generate access keys
   - Copy the Access Key ID and Secret Access Key
   - Add them to your `.env.local` file

## Features Implemented

✅ **S3 Image Upload**: Direct upload to your S3 bucket
✅ **Image Gallery**: View all uploaded images in a dedicated gallery
✅ **Image Display**: Images show in menu item cards
✅ **Navigation**: Back button to switch between menu and gallery views
✅ **File Validation**: Only allows image files (5MB max)
✅ **Automatic URL Saving**: Image URLs are automatically saved to database

## How to Use

1. **Upload Images:**
   - Click on any menu item's image placeholder
   - Select an image file from your device
   - Image will be uploaded to S3 and URL saved automatically

2. **View Gallery:**
   - Click the Images icon in the header
   - See all uploaded images in a grid layout
   - Each image shows the menu item name and tags

3. **Navigate:**
   - Use the back arrow to return to menu view
   - Toggle between menu and gallery views

## File Structure

- `/api/menu-items/[id]/upload-image/route.ts` - Upload endpoint
- `/lib/s3.ts` - S3 configuration and utilities
- `/components/ui/MenuItemCard.tsx` - Image display and upload
- `/app/menus/[id]/edit/page.tsx` - Gallery and navigation

## Troubleshooting

- Make sure your S3 bucket has correct permissions
- Verify your AWS credentials are valid
- Check that your bucket name is unique and accessible
- Ensure CORS is configured if needed for cross-origin requests 