import { NextResponse, type NextRequest } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import { jwtVerify } from 'jose';
import { Readable } from 'stream';

// Configure Cloudinary using environment variables
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Helper function to upload a buffer stream to Cloudinary
async function uploadStream(buffer: Buffer, options: any): Promise<any> {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(options, (error, result) => {
      if (error) {
        return reject(error);
      }
      resolve(result);
    });
    // Convert buffer to a readable stream
    Readable.from(buffer).pipe(stream);
  });
}

const JWT_SECRET = process.env.JWT_SECRET;

export async function POST(request: NextRequest) {
    // Check for server-side configurations
    if (!JWT_SECRET || !process.env.CLOUDINARY_CLOUD_NAME) {
        console.error('Server configuration error: JWT_SECRET or Cloudinary config is missing.');
        return NextResponse.json({ message: 'Server configuration error.' }, { status: 500 });
    }

    // Protect the route: only admins can upload
    const adminToken = request.cookies.get('admin-token')?.value;
    if (!adminToken) {
        return NextResponse.json({ message: 'Unauthorized: No admin token provided.' }, { status: 401 });
    }
    try {
        await jwtVerify(adminToken, new TextEncoder().encode(JWT_SECRET));
    } catch (err) {
        return NextResponse.json({ message: 'Unauthorized: Invalid token.' }, { status: 401 });
    }

    // Handle file upload
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
        return NextResponse.json({ message: 'No file found.' }, { status: 400 });
    }
    
    try {
        const buffer = Buffer.from(await file.arrayBuffer());
        
        const result = await uploadStream(buffer, {
            folder: 'fablefront-products', // Optional: organize uploads in a folder
            resource_type: 'image',
        });

        return NextResponse.json({ url: result.secure_url, public_id: result.public_id });

    } catch (error) {
        console.error('Upload to Cloudinary failed:', error);
        return NextResponse.json({ message: 'Upload failed.' }, { status: 500 });
    }
}
