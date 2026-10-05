<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\About3Main;
use Illuminate\Http\Request;

class About3MainController extends Controller
{
    /**
     * Image ko public/storage/uploads mein save karta hai
     * aur sirf file ka naam return karta hai (jaise baaki images ka hota hai)
     */
    private function saveImage(Request $request)
    {
        if ($request->hasFile('image') && $request->file('image')->isValid()) {
            $file = $request->file('image');
            $folder = public_path('storage/uploads');

            if (!is_dir($folder)) {
                mkdir($folder, 0755, true);
            }

            $fileName = 'img-' . time() . '-' . \Illuminate\Support\Str::random(10) . '.' . $file->getClientOriginalExtension();
            $file->move($folder, $fileName);

            return $fileName;
        }

        return null;
    }

    /**
     * PUBLIC WEBSITE ke liye (Single record return kare)
     * GET /api/about-3-main  (hyphen)
     */
    public function index()
    {
        $data = About3Main::first();

        return response()->json([
            'success' => true,
            'message' => 'About 3 main content fetched successfully',
            'data' => $data
        ], 200);
    }

    /**
     * ADMIN PANEL ke liye (Saare records return kare)
     * GET /api/about_3_main  (underscore)
     */
    public function adminIndex()
    {
        $data = About3Main::all();

        return response()->json([
            'success' => true,
            'message' => 'About 3 main content fetched successfully',
            'data' => $data
        ], 200);
    }

    /**
     * Ek single record lene ke liye (GET /api/about_3_main/{id})
     */
    public function show($id)
    {
        $data = About3Main::find($id);

        if (!$data) {
            return response()->json([
                'success' => false,
                'message' => 'About 3 main content not found'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $data
        ], 200);
    }

    /**
     * Naya record banane ke liye (POST /api/about_3_main)
     */
    public function store(Request $request)
    {
        try {
            $uploaded = $this->saveImage($request);

            $data = About3Main::create([
                'section_tag' => $request->section_tag,
                'heading_white' => $request->heading_white,
                'heading_yellow' => $request->heading_yellow,
                'paragraph_1' => $request->paragraph_1,
                'paragraph_2' => $request->paragraph_2,
                'image_path' => $uploaded ?? $request->image_path,
                'feature_1' => $request->feature_1,
                'feature_2' => $request->feature_2,
                'feature_3' => $request->feature_3,
                'feature_4' => $request->feature_4,
            ]);

            return response()->json([
                'success' => true,
                'message' => 'About 3 main content created successfully',
                'data' => $data
            ], 201);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Record update karne ke liye (PUT/POST /api/about_3_main/{id})
     */
    public function update(Request $request, $id)
    {
        try {
            $data = About3Main::find($id);

            if (!$data) {
                return response()->json([
                    'success' => false,
                    'message' => 'About 3 main content not found'
                ], 404);
            }

            $uploaded = $this->saveImage($request);

            $data->update([
                'section_tag' => $request->section_tag ?? $data->section_tag,
                'heading_white' => $request->heading_white ?? $data->heading_white,
                'heading_yellow' => $request->heading_yellow ?? $data->heading_yellow,
                'paragraph_1' => $request->paragraph_1 ?? $data->paragraph_1,
                'paragraph_2' => $request->paragraph_2 ?? $data->paragraph_2,
                'image_path' => $uploaded ?? $request->image_path ?? $data->image_path,
                'feature_1' => $request->feature_1 ?? $data->feature_1,
                'feature_2' => $request->feature_2 ?? $data->feature_2,
                'feature_3' => $request->feature_3 ?? $data->feature_3,
                'feature_4' => $request->feature_4 ?? $data->feature_4,
            ]);

            return response()->json([
                'success' => true,
                'message' => 'About 3 main content updated successfully',
                'data' => $data
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Record delete karne ke liye (DELETE /api/about_3_main/{id})
     */
    public function destroy($id)
    {
        try {
            $data = About3Main::find($id);

            if (!$data) {
                return response()->json([
                    'success' => false,
                    'message' => 'About 3 main content not found'
                ], 404);
            }

            $data->delete();

            return response()->json([
                'success' => true,
                'message' => 'About 3 main content deleted successfully'
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => $e->getMessage()
            ], 500);
        }
    }
}