<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ContactHeader;
use Illuminate\Http\Request;

class ContactHeaderController extends Controller
{
    /**
     * PUBLIC WEBSITE ke liye (Single record return kare)
     * GET /api/contact-header  (hyphen)
     */
    public function index()
    {
        $data = ContactHeader::first(); // ✅ Single object (frontend ke liye)

        return response()->json([
            'success' => true,
            'message' => 'Contact header fetched successfully',
            'data' => $data
        ], 200);
    }

    /**
     * ADMIN PANEL ke liye (Saare records return kare)
     * GET /api/contact_header  (underscore)
     */
    public function adminIndex()
    {
        $data = ContactHeader::all(); // ✅ Array (admin table ke liye)

        return response()->json([
            'success' => true,
            'message' => 'Contact header fetched successfully',
            'data' => $data
        ], 200);
    }

    /**
     * Ek single record lene ke liye (GET /api/contact_header/{id})
     */
    public function show($id)
    {
        $data = ContactHeader::find($id);

        if (!$data) {
            return response()->json([
                'success' => false,
                'message' => 'Contact header not found'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $data
        ], 200);
    }

    /**
     * Naya record banane ke liye (POST /api/contact_header)
     */
    public function store(Request $request)
    {
        try {
            $data = ContactHeader::create([
                'top_tagline' => $request->top_tagline,
                'main_heading_white_1' => $request->main_heading_white_1,
                'main_heading_yellow' => $request->main_heading_yellow,
                'main_heading_white_2' => $request->main_heading_white_2,
                'description' => $request->description,
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Contact header created successfully',
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
     * Record update karne ke liye (PUT /api/contact_header/{id})
     */
    public function update(Request $request, $id)
    {
        try {
            $data = ContactHeader::find($id);

            if (!$data) {
                return response()->json([
                    'success' => false,
                    'message' => 'Contact header not found'
                ], 404);
            }

            $data->update([
                'top_tagline' => $request->top_tagline ?? $data->top_tagline,
                'main_heading_white_1' => $request->main_heading_white_1 ?? $data->main_heading_white_1,
                'main_heading_yellow' => $request->main_heading_yellow ?? $data->main_heading_yellow,
                'main_heading_white_2' => $request->main_heading_white_2 ?? $data->main_heading_white_2,
                'description' => $request->description ?? $data->description,
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Contact header updated successfully',
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
     * Record delete karne ke liye (DELETE /api/contact_header/{id})
     */
    public function destroy($id)
    {
        try {
            $data = ContactHeader::find($id);

            if (!$data) {
                return response()->json([
                    'success' => false,
                    'message' => 'Contact header not found'
                ], 404);
            }

            $data->delete();

            return response()->json([
                'success' => true,
                'message' => 'Contact header deleted successfully'
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => $e->getMessage()
            ], 500);
        }
    }
}