import { NextResponse, type NextRequest } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import { jwtVerify } from 'jose';

// Configure Cloudinary using environment variables
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const JWT_SECRET = process.env.JWT_SECRET;

export async function POST(request: NextRequest) {
    // Check for server-side configurations
    const isCloudinaryConfigured = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET;

    if (!JWT_SECRET || !isCloudinaryConfigured) {
        console.error('Server configuration error: JWT_SECRET or one or more Cloudinary environment variables (NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET) are missing.');
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
        const dataUri = `data:${file.type};base64,${buffer.toString('base64')}`;
        
        const result = await cloudinary.uploader.upload(dataUri, {
            folder: 'fablefront-products', // Optional: organize uploads in a folder
            resource_type: 'image',
        });

        return NextResponse.json({ url: result.secure_url, public_id: result.public_id });

    } catch (error) {
        console.error('Upload to Cloudinary failed:', error);
        return NextResponse.json({ message: 'Upload failed.' }, { status: 500 });
    }
}
