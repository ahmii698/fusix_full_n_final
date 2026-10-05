<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\About4Principle;
use Illuminate\Http\Request;

class About4PrincipleController extends Controller
{
    /**
     * PUBLIC WEBSITE ke liye
     * GET /api/about-4-principles  (hyphen)
     * Returns: heading (alag se) + saare cards
     */
    public function index()
    {
        // Saare cards display_order ke hisaab se
        $data = About4Principle::orderBy('display_order', 'asc')->get();

        // Heading alag se nikal lein (pehli row se)
        $heading = About4Principle::select('section_tag', 'main_heading_white', 'main_heading_yellow')->first();

        return response()->json([
            'success' => true,
            'message' => 'About 4 principles fetched successfully',
            'heading' => $heading,
            'data' => $data
        ], 200);
    }

    /**
     * Ek single record lene ke liye (GET /api/about_4_principles/{id})
     */
    public function show($id)
    {
        $data = About4Principle::find($id);

        if (!$data) {
            return response()->json([
                'success' => false,
                'message' => 'About 4 principle not found'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $data
        ], 200);
    }

    /**
     * Naya record banane ke liye (POST /api/about_4_principles)
     */
    public function store(Request $request)
    {
        try {
            $data = About4Principle::create([
                'section_tag' => $request->section_tag,
                'main_heading_white' => $request->main_heading_white,
                'main_heading_yellow' => $request->main_heading_yellow,
                'icon_class' => $request->icon_class,
                'card_title' => $request->card_title,
                'card_description' => $request->card_description,
                'is_highlighted' => $request->is_highlighted ?? 0,
                'display_order' => $request->display_order ?? 0,
            ]);

            return response()->json([
                'success' => true,
                'message' => 'About 4 principle created successfully',
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
     * Record update karne ke liye (PUT /api/about_4_principles/{id})
     */
    public function update(Request $request, $id)
    {
        try {
            $data = About4Principle::find($id);

            if (!$data) {
                return response()->json([
                    'success' => false,
                    'message' => 'About 4 principle not found'
                ], 404);
            }

            $data->update([
                'section_tag' => $request->section_tag ?? $data->section_tag,
                'main_heading_white' => $request->main_heading_white ?? $data->main_heading_white,
                'main_heading_yellow' => $request->main_heading_yellow ?? $data->main_heading_yellow,
                'icon_class' => $request->icon_class ?? $data->icon_class,
                'card_title' => $request->card_title ?? $data->card_title,
                'card_description' => $request->card_description ?? $data->card_description,
                'is_highlighted' => $request->is_highlighted ?? $data->is_highlighted,
                'display_order' => $request->display_order ?? $data->display_order,
            ]);

            return response()->json([
                'success' => true,
                'message' => 'About 4 principle updated successfully',
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
     * Record delete karne ke liye (DELETE /api/about_4_principles/{id})
     */
    public function destroy($id)
    {
        try {
            $data = About4Principle::find($id);

            if (!$data) {
                return response()->json([
                    'success' => false,
                    'message' => 'About 4 principle not found'
                ], 404);
            }

            $data->delete();

            return response()->json([
                'success' => true,
                'message' => 'About 4 principle deleted successfully'
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => $e->getMessage()
            ], 500);
        }
    }
}