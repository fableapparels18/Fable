'use client';

import { useState, useEffect } from 'react';
import { useFormContext } from 'react-hook-form';
import Image from 'next/image';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Trash2, Upload } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FormField, FormItem, FormMessage } from '@/components/ui/form';

export function ImageUploader() {
  const { control, getValues, setValue, formState: { isSubmitting } } = useFormContext();
  const { toast } = useToast();
  
  // This state holds the array of image URLs
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  // Initialize state from form on component mount
  useEffect(() => {
    const existingImages = getValues('images');
    if (typeof existingImages === 'string' && existingImages) {
      // Filter out empty strings that might result from splitting
      setImageUrls(existingImages.split(',').map(url => url.trim()).filter(Boolean));
    }
  }, [getValues]);
  
  // Helper to update the hidden form value
  const updateFormValue = (urls: string[]) => {
      setValue('images', urls.join(', '), { shouldValidate: true, shouldDirty: true });
  }

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Basic file type validation
    if (!file.type.startsWith('image/')) {
        toast({ variant: 'destructive', title: 'Invalid File Type', description: 'Please upload an image file.'});
        return;
    }

    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Upload failed');
      }

      const { url } = await response.json();
      const newImageUrls = [...imageUrls, url];
      setImageUrls(newImageUrls);
      updateFormValue(newImageUrls);
      
      toast({
        title: 'Success!',
        description: 'Image uploaded successfully.',
      });

    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Upload Failed',
        description: error.message,
      });
    } finally {
      setIsUploading(false);
      // Reset file input to allow uploading the same file again
      if(event.target) {
        event.target.value = '';
      }
    }
  };
  
  const handleRemoveImage = (urlToRemove: string) => {
      const newImageUrls = imageUrls.filter(url => url !== urlToRemove);
      setImageUrls(newImageUrls);
      updateFormValue(newImageUrls);
  }

  return (
    <Card>
        <CardHeader>
            <CardTitle>Product Images</CardTitle>
            <CardDescription>Upload images for the product one by one. The first image will be the main display image.</CardDescription>
        </CardHeader>
      <CardContent className="grid gap-6">
          <div className="grid gap-2">
            <Label htmlFor="image-upload">Upload Image</Label>
            <div className="flex items-center gap-2">
                <Button asChild variant="outline" disabled={isUploading || isSubmitting}>
                    <label htmlFor="image-upload" className="cursor-pointer">
                        {isUploading ? (
                             <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                            <Upload className="mr-2 h-4 w-4" />
                        )}
                        {isUploading ? 'Uploading...' : 'Choose File'}
                    </label>
                </Button>
                 <Input
                    id="image-upload"
                    type="file"
                    accept="image/png, image/jpeg, image/webp"
                    onChange={handleFileUpload}
                    disabled={isUploading || isSubmitting}
                    className="sr-only"
                />
            </div>
             {/* This hidden field is technically not needed since we use setValue,
                 but it helps with react-hook-form's state tracking and validation triggering. */}
            <FormField
                control={control}
                name="images"
                render={({ field }) => (
                    <FormItem className="hidden">
                        <Input {...field} />
                        <FormMessage />
                    </FormItem>
                )}
            />
        </div>
        
        {imageUrls.length > 0 ? (
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4">
                {imageUrls.map((url, index) => (
                    <div key={index} className="relative group aspect-square">
                        <Image
                            src={url}
                            alt={`Product image ${index + 1}`}
                            fill
                            sizes="(max-width: 768px) 33vw, (max-width: 1200px) 20vw, 15vw"
                            className="object-cover rounded-md border"
                        />
                         <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-md">
                            <Button
                                type="button"
                                variant="destructive"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => handleRemoveImage(url)}
                                disabled={isSubmitting}
                            >
                                <Trash2 className="h-4 w-4" />
                                <span className="sr-only">Remove image</span>
                            </Button>
                        </div>
                    </div>
                ))}
            </div>
        ) : (
            <div className="text-center text-muted-foreground border-2 border-dashed rounded-lg p-8">
                <p>No images uploaded yet.</p>
            </div>
        )}
      </CardContent>
    </Card>
  );
}
