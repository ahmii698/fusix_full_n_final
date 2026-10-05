<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Service3;
use Illuminate\Http\Request;

class Service3Controller extends Controller
{
    /**
     * PUBLIC WEBSITE ke liye
     * GET /api/service-3  (hyphen)
     * Returns: heading + saare steps
     */
    public function index()
    {
        $data = Service3::orderBy('display_order', 'asc')->get();

        // Heading alag se nikal lein (pehli row se)
        $heading = Service3::select('section_tag', 'heading_white', 'heading_yellow', 'sub_description')->first();

        return response()->json([
            'success' => true,
            'message' => 'Service 3 process fetched successfully',
            'heading' => $heading,
            'data' => $data
        ], 200);
    }

    /**
     * ADMIN PANEL ke liye
     * GET /api/service_3  (underscore)
     * Returns: sirf saare steps (table ki tarah)
     */
    public function adminIndex()
    {
        $data = Service3::orderBy('display_order', 'asc')->get();

        return response()->json([
            'success' => true,
            'message' => 'Service 3 process fetched successfully',
            'data' => $data
        ], 200);
    }

    /**
     * Ek single record lene ke liye (GET /api/service_3/{id})
     */
    public function show($id)
    {
        $data = Service3::find($id);

        if (!$data) {
            return response()->json([
                'success' => false,
                'message' => 'Service 3 step not found'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $data
        ], 200);
    }

    /**
     * Naya record banane ke liye (POST /api/service_3)
     */
    public function store(Request $request)
    {
        try {
            $data = Service3::create([
                'section_tag' => $request->section_tag,
                'heading_white' => $request->heading_white,
                'heading_yellow' => $request->heading_yellow,
                'sub_description' => $request->sub_description,
                'step_number' => $request->step_number,
                'card_title' => $request->card_title,
                'card_description' => $request->card_description,
                'display_order' => $request->display_order ?? 0,
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Service 3 step created successfully',
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
     * Record update karne ke liye (PUT /api/service_3/{id})
     */
    public function update(Request $request, $id)
    {
        try {
            $data = Service3::find($id);

            if (!$data) {
                return response()->json([
                    'success' => false,
                    'message' => 'Service 3 step not found'
                ], 404);
            }

            $data->update([
                'section_tag' => $request->section_tag ?? $data->section_tag,
                'heading_white' => $request->heading_white ?? $data->heading_white,
                'heading_yellow' => $request->heading_yellow ?? $data->heading_yellow,
                'sub_description' => $request->sub_description ?? $data->sub_description,
                'step_number' => $request->step_number ?? $data->step_number,
                'card_title' => $request->card_title ?? $data->card_title,
                'card_description' => $request->card_description ?? $data->card_description,
                'display_order' => $request->display_order ?? $data->display_order,
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Service 3 step updated successfully',
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
     * Record delete karne ke liye (DELETE /api/service_3/{id})
     */
    public function destroy($id)
    {
        try {
            $data = Service3::find($id);

            if (!$data) {
                return response()->json([
                    'success' => false,
                    'message' => 'Service 3 step not found'
                ], 404);
            }

            $data->delete();

            return response()->json([
                'success' => true,
                'message' => 'Service 3 step deleted successfully'
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => $e->getMessage()
            ], 500);
        }
    }
}