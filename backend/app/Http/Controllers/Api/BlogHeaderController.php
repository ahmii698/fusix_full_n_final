<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\BlogHeader;
use Illuminate\Http\Request;

class BlogHeaderController extends Controller
{
    // PUBLIC WEBSITE ke liye (single record)
    public function index()
    {
        $data = BlogHeader::first();
        return response()->json([
            'success' => true,
            'message' => 'Blog header fetched successfully',
            'data' => $data
        ], 200);
    }

    // ADMIN PANEL ke liye (saare records)
    public function adminIndex()
    {
        $data = BlogHeader::all();
        return response()->json([
            'success' => true,
            'message' => 'Blog header fetched successfully',
            'data' => $data
        ], 200);
    }

    public function show($id)
    {
        $data = BlogHeader::find($id);
        if (!$data) {
            return response()->json(['success' => false, 'message' => 'Not found'], 404);
        }
        return response()->json(['success' => true, 'data' => $data], 200);
    }

    public function store(Request $request)
    {
        try {
            $data = BlogHeader::create([
                'top_tagline' => $request->top_tagline,
                'main_heading_white' => $request->main_heading_white,
                'main_heading_yellow' => $request->main_heading_yellow,
                'sub_description' => $request->sub_description,
                'search_placeholder' => $request->search_placeholder,
            ]);
            return response()->json(['success' => true, 'message' => 'Created', 'data' => $data], 201);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'error' => $e->getMessage()], 500);
        }
    }

    public function update(Request $request, $id)
    {
        try {
            $data = BlogHeader::find($id);
            if (!$data) {
                return response()->json(['success' => false, 'message' => 'Not found'], 404);
            }
            $data->update([
                'top_tagline' => $request->top_tagline ?? $data->top_tagline,
                'main_heading_white' => $request->main_heading_white ?? $data->main_heading_white,
                'main_heading_yellow' => $request->main_heading_yellow ?? $data->main_heading_yellow,
                'sub_description' => $request->sub_description ?? $data->sub_description,
                'search_placeholder' => $request->search_placeholder ?? $data->search_placeholder,
            ]);
            return response()->json(['success' => true, 'message' => 'Updated', 'data' => $data], 200);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'error' => $e->getMessage()], 500);
        }
    }

    public function destroy($id)
    {
        try {
            $data = BlogHeader::find($id);
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