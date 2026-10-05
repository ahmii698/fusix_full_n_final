<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\About2;
use Illuminate\Http\Request;

class About2Controller extends Controller
{
    /**
     * Saara data lene ke liye
     * GET /api/about-2   (Public website)
     * GET /api/about_2   (Admin panel)
     */
    public function index()
    {
        $data = About2::orderBy('display_order', 'asc')->get();

        return response()->json([
            'success' => true,
            'message' => 'About 2 stats fetched successfully',
            'data' => $data
        ], 200);
    }

    /**
     * Ek single record lene ke liye (GET /api/about_2/{id})
     */
    public function show($id)
    {
        $data = About2::find($id);

        if (!$data) {
            return response()->json([
                'success' => false,
                'message' => 'About 2 stat not found'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $data
        ], 200);
    }

    /**
     * Naya record banane ke liye (POST /api/about_2)
     */
    public function store(Request $request)
    {
        try {
            $data = About2::create([
                'stat_number' => $request->stat_number,
                'stat_label' => $request->stat_label,
                'display_order' => $request->display_order ?? 0,
            ]);

            return response()->json([
                'success' => true,
                'message' => 'About 2 stat created successfully',
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
     * Record update karne ke liye (PUT /api/about_2/{id})
     */
    public function update(Request $request, $id)
    {
        try {
            $data = About2::find($id);

            if (!$data) {
                return response()->json([
                    'success' => false,
                    'message' => 'About 2 stat not found'
                ], 404);
            }

            $data->update([
                'stat_number' => $request->stat_number ?? $data->stat_number,
                'stat_label' => $request->stat_label ?? $data->stat_label,
                'display_order' => $request->display_order ?? $data->display_order,
            ]);

            return response()->json([
                'success' => true,
                'message' => 'About 2 stat updated successfully',
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
     * Record delete karne ke liye (DELETE /api/about_2/{id})
     */
    public function destroy($id)
    {
        try {
            $data = About2::find($id);

            if (!$data) {
                return response()->json([
                    'success' => false,
                    'message' => 'About 2 stat not found'
                ], 404);
            }

            $data->delete();

            return response()->json([
                'success' => true,
                'message' => 'About 2 stat deleted successfully'
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => $e->getMessage()
            ], 500);
        }
    }
}