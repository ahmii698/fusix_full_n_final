<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ServiceHeader;
use Illuminate\Http\Request;

class ServiceHeaderController extends Controller
{
    /**
     * PUBLIC WEBSITE ke liye (Single record return kare)
     * GET /api/service-header  (hyphen)
     */
    public function index()
    {
        $data = ServiceHeader::first(); // ✅ Single object (frontend ke liye)

        return response()->json([
            'success' => true,
            'message' => 'Service header fetched successfully',
            'data' => $data
        ], 200);
    }

    /**
     * ADMIN PANEL ke liye (Saare records return kare)
     * GET /api/service_header  (underscore)
     */
    public function adminIndex()
    {
        $data = ServiceHeader::all(); // ✅ Array (admin table ke liye)

        return response()->json([
            'success' => true,
            'message' => 'Service header fetched successfully',
            'data' => $data
        ], 200);
    }

    /**
     * Ek single record lene ke liye (GET /api/service_header/{id})
     */
    public function show($id)
    {
        $data = ServiceHeader::find($id);

        if (!$data) {
            return response()->json([
                'success' => false,
                'message' => 'Service header not found'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $data
        ], 200);
    }

    /**
     * Naya record banane ke liye (POST /api/service_header)
     */
    public function store(Request $request)
    {
        try {
            $data = ServiceHeader::create([
                'top_tagline' => $request->top_tagline,
                'main_heading_white' => $request->main_heading_white,
                'main_heading_yellow' => $request->main_heading_yellow,
                'description' => $request->description,
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Service header created successfully',
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
     * Record update karne ke liye (PUT /api/service_header/{id})
     */
    public function update(Request $request, $id)
    {
        try {
            $data = ServiceHeader::find($id);

            if (!$data) {
                return response()->json([
                    'success' => false,
                    'message' => 'Service header not found'
                ], 404);
            }

            $data->update([
                'top_tagline' => $request->top_tagline ?? $data->top_tagline,
                'main_heading_white' => $request->main_heading_white ?? $data->main_heading_white,
                'main_heading_yellow' => $request->main_heading_yellow ?? $data->main_heading_yellow,
                'description' => $request->description ?? $data->description,
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Service header updated successfully',
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
     * Record delete karne ke liye (DELETE /api/service_header/{id})
     */
    public function destroy($id)
    {
        try {
            $data = ServiceHeader::find($id);

            if (!$data) {
                return response()->json([
                    'success' => false,
                    'message' => 'Service header not found'
                ], 404);
            }

            $data->delete();

            return response()->json([
                'success' => true,
                'message' => 'Service header deleted successfully'
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => $e->getMessage()
            ], 500);
        }
    }
}