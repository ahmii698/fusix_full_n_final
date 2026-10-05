<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\MainBlog;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class MainBlogController extends Controller
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

    /**
     * PUBLIC WEBSITE + ADMIN PANEL ke liye (saare blog posts)
     * GET /api/main-blog  (hyphen)
     * GET /api/main_blog  (underscore)
     */
    public function index()
    {
        $data = MainBlog::orderBy('display_order', 'asc')->get();

        return response()->json([
            'success' => true,
            'message' => 'Main blog posts fetched successfully',
            'data' => $data
        ], 200);
    }

    /**
     * Categories lene ke liye (unique, with counts)
     * GET /api/blog-categories
     */
    public function getCategories()
    {
        $categories = MainBlog::select('category', \DB::raw('count(*) as count'))
            ->groupBy('category')
            ->orderBy('category', 'asc')
            ->get();

        $totalCount = MainBlog::count();

        return response()->json([
            'success' => true,
            'message' => 'Categories fetched successfully',
            'total' => $totalCount,
            'data' => $categories
        ], 200);
    }

    /**
     * Ek single record lene ke liye
     */
    public function show($id)
    {
        $data = MainBlog::find($id);
        if (!$data) {
            return response()->json(['success' => false, 'message' => 'Not found'], 404);
        }
        return response()->json(['success' => true, 'data' => $data], 200);
    }

    /**
     * Naya blog post banane ke liye
     */
    public function store(Request $request)
    {
        try {
            $uploaded = $this->saveImage($request);

            $data = MainBlog::create([
                'category' => $request->category,
                'image' => $uploaded ?? (is_string($request->image) ? $request->image : null),
                'post_date' => $request->post_date,
                'read_time' => $request->read_time,
                'title' => $request->title,
                'description' => $request->description,
                'author_name' => $request->author_name,
                'author_initial' => $request->author_initial,
                'views' => $request->views ?? 0,
                'likes' => $request->likes ?? 0,
                'comments' => $request->comments ?? 0,
                'tags' => $request->tags,
                'is_featured' => $request->is_featured ?? 0,
                'display_order' => $request->display_order ?? 0,
            ]);
            return response()->json(['success' => true, 'message' => 'Created', 'data' => $data], 201);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'error' => $e->getMessage()], 500);
        }
    }

    /**
     * Record update karne ke liye
     */
    public function update(Request $request, $id)
    {
        try {
            $data = MainBlog::find($id);
            if (!$data) {
                return response()->json(['success' => false, 'message' => 'Not found'], 404);
            }

            $uploaded = $this->saveImage($request);

            $data->update([
                'category' => $request->category ?? $data->category,
                'image' => $uploaded ?? (is_string($request->image) ? $request->image : null) ?? $data->image,
                'post_date' => $request->post_date ?? $data->post_date,
                'read_time' => $request->read_time ?? $data->read_time,
                'title' => $request->title ?? $data->title,
                'description' => $request->description ?? $data->description,
                'author_name' => $request->author_name ?? $data->author_name,
                'author_initial' => $request->author_initial ?? $data->author_initial,
                'views' => $request->views ?? $data->views,
                'likes' => $request->likes ?? $data->likes,
                'comments' => $request->comments ?? $data->comments,
                'tags' => $request->tags ?? $data->tags,
                'is_featured' => $request->is_featured ?? $data->is_featured,
                'display_order' => $request->display_order ?? $data->display_order,
            ]);
            return response()->json(['success' => true, 'message' => 'Updated', 'data' => $data], 200);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'error' => $e->getMessage()], 500);
        }
    }

    /**
     * Record delete karne ke liye
     */
    public function destroy($id)
    {
        try {
            $data = MainBlog::find($id);
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