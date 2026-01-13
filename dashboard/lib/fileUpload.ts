import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { isValidImageType, isValidImageSize } from './utils';

// Define the maximum file size (5MB in bytes)
const MAX_FILE_SIZE = 5 * 1024 * 1024;

// Function to save uploaded file and return the path
export async function saveUploadedFile(file: File, uploadDir: string = 'public/images'): Promise<string> {
  // Validate file type
  if (!isValidImageType(file)) {
    throw new Error('Invalid file type. Only image files are allowed.');
  }

  // Validate file size
  // For team member photos, use 2MB limit; for other images, use 5MB limit
  const maxSize = uploadDir.includes('team') ? 2 : 5;
  if (!isValidImageSize(file, maxSize)) {
    throw new Error(`File size exceeds ${maxSize}MB limit.`);
  }

  // Create upload directory if it doesn't exist
  await mkdir(path.join(process.cwd(), uploadDir), { recursive: true });

  // Generate unique filename
  const timestamp = Date.now();
  const fileExtension = path.extname(file.name) || '.jpg'; // Default to .jpg if no extension
  const fileName = `${timestamp}-${file.name.replace(/\s+/g, '-')}`;
  const filePath = path.join(process.cwd(), uploadDir, fileName);

  // Convert file to buffer and save
  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(filePath, buffer);

  // Return the relative path from public directory
  return path.join(uploadDir.replace('public/', ''), fileName);
}