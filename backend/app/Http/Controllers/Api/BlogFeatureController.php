<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\BlogFeature;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class BlogFeatureController extends Controller
{
    /**
     * Image ko public/storage/uploads mein save karta hai
     * aur sirf file ka naam return karta hai
     */
    private function saveImage(Request $request)
    {
        if ($request->hasFile('image') && $request->file('image')->isValid()) {
            $file = $request->file('image');
            $folder = public_path('storage/uploads');

            if (!is_dir($folder)) {
                mkdir($folder, 0755, true);
            }

            $fileName = 'img-' . time() . '-' . Str::random(10) . '.' . $file->getClientOriginalExtension();
            $file->move($folder, $fileName);

            return $fileName;
        }

        return null;
    }

    // PUBLIC WEBSITE + ADMIN PANEL ke liye (saare records)
    public function index()
    {
        $data = BlogFeature::orderBy('display_order', 'asc')->get();

        // Heading alag se nikal lein (pehli row se)
        $heading = BlogFeature::select('section_icon', 'heading_white', 'heading_yellow')->first();

        return response()->json([
            'success' => true,
            'message' => 'Blog features fetched successfully',
            'heading' => $heading,
            'data' => $data
        ], 200);
    }

    public function show($id)
    {
        $data = BlogFeature::find($id);
        if (!$data) {
            return response()->json(['success' => false, 'message' => 'Not found'], 404);
        }
        return response()->json(['success' => true, 'data' => $data], 200);
    }

    public function store(Request $request)
    {
        try {
            $uploaded = $this->saveImage($request);

            $data = BlogFeature::create([
                'section_icon' => $request->section_icon,
                'heading_white' => $request->heading_white,
                'heading_yellow' => $request->heading_yellow,
                'category' => $request->category,
                'image' => $uploaded ?? (is_string($request->image) ? $request->image : null),
                'post_date' => $request->post_date,
                'read_time' => $request->read_time,
                'title' => $request->title,
                'description' => $request->description,
                'author_name' => $request->author_name,
                'author_role' => $request->author_role,
                'author_initial' => $request->author_initial,
                'display_order' => $request->display_order ?? 0,
            ]);
            return response()->json(['success' => true, 'message' => 'Created', 'data' => $data], 201);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'error' => $e->getMessage()], 500);
        }
    }

    public function update(Request $request, $id)
    {
        try {
            $data = BlogFeature::find($id);
            if (!$data) {
                return response()->json(['success' => false, 'message' => 'Not found'], 404);
            }

            $uploaded = $this->saveImage($request);

            $data->update([
                'section_icon' => $request->section_icon ?? $data->section_icon,
                'heading_white' => $request->heading_white ?? $data->heading_white,
                'heading_yellow' => $request->heading_yellow ?? $data->heading_yellow,
                'category' => $request->category ?? $data->category,
                'image' => $uploaded ?? (is_string($request->image) ? $request->image : null) ?? $data->image,
                'post_date' => $request->post_date ?? $data->post_date,
                'read_time' => $request->read_time ?? $data->read_time,
                'title' => $request->title ?? $data->title,
                'description' => $request->description ?? $data->description,
                'author_name' => $request->author_name ?? $data->author_name,
                'author_role' => $request->author_role ?? $data->author_role,
                'author_initial' => $request->author_initial ?? $data->author_initial,
                'display_order' => $request->display_order ?? $data->display_order,
            ]);
            return response()->json(['success' => true, 'message' => 'Updated', 'data' => $data], 200);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'error' => $e->getMessage()], 500);
        }
    }

    public function destroy($id)
    {
        try {
            $data = BlogFeature::find($id);
            if (!$data) {
                return response()->json(['success' => false, 'message' => 'Not found'], 404);
            }
            $data->delete();
            return response()->json(['success' => true, 'message' => 'Deleted'], 200);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'error' => $e->getMessage()], 500);
        }
    }
}