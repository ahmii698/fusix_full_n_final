<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class ImageUploadController extends Controller
{
    public function upload(Request $request)
    {
        try {
            if (!$request->hasFile('image')) {
                return response()->json([
                    'success' => false,
                    'error' => 'No image file provided'
                ], 400);
            }
            
            $file = $request->file('image');
            
            // Validate image
            if (!$file->isValid()) {
                return response()->json([
                    'success' => false,
                    'error' => 'Invalid image file'
                ], 400);
            }
            
            // Generate unique filename
            $extension = $file->getClientOriginalExtension();
            $filename = 'img-' . time() . '-' . Str::random(10) . '.' . $extension;
            
            // Store in public/uploads
            $path = $file->storeAs('uploads', $filename, 'public');
            
            return response()->json([
                'success' => true,
                'url' => '/storage/' . $path,
                'path' => '/storage/' . $path,
                'filename' => $filename
            ]);
            
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => $e->getMessage()
            ], 500);
        }
    }
}