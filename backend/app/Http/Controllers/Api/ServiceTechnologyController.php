<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ServiceTechnology;
use Illuminate\Http\Request;

class ServiceTechnologyController extends Controller
{
    /**
     * Saari technologies lene ke liye (Admin + Public)
     * GET /api/technologies
     */
    public function index()
    {
        $technologies = ServiceTechnology::orderBy('display_order', 'asc')->get();
        
        return response()->json([
            'success' => true,
            'message' => 'Technologies fetched successfully',
            'data' => $technologies
        ], 200);
    }

    /**
     * Sirf active technologies lene ke liye (Public website ke liye)
     * GET /api/technologies/active
     */
    public function getActiveTechnologies()
    {
        $technologies = ServiceTechnology::where('is_active', 1)
                                         ->orderBy('display_order', 'asc')
                                         ->get();
        
        return response()->json([
            'success' => true,
            'message' => 'Active technologies fetched successfully',
            'data' => $technologies
        ], 200);
    }

    /**
     * Categories ki list lene ke liye
     * GET /api/technologies/categories
     */
    public function getCategories()
    {
        $categories = ServiceTechnology::select('category')
                                       ->distinct()
                                       ->orderBy('category', 'asc')
                                       ->pluck('category');
        
        return response()->json([
            'success' => true,
            'message' => 'Categories fetched successfully',
            'data' => $categories
        ], 200);
    }

    /**
     * Ek single technology lene ke liye
     * GET /api/technologies/{id}
     */
    public function show($id)
    {
        $technology = ServiceTechnology::find($id);
        
        if (!$technology) {
            return response()->json([
                'success' => false,
                'message' => 'Technology not found'
            ], 404);
        }
        
        return response()->json([
            'success' => true,
            'message' => 'Technology fetched successfully',
            'data' => $technology
        ], 200);
    }

    /**
     * Nayi technology add karne ke liye
     * POST /api/technologies
     */
    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'name' => 'required|string|max:255',
                'icon' => 'nullable|string|max:255',
                'category' => 'required|string|max:100',
                'display_order' => 'nullable|integer',
                'is_active' => 'nullable|integer|in:0,1'
            ]);

            $technology = ServiceTechnology::create([
                'name' => $validated['name'],
                'icon' => $validated['icon'] ?? null,
                'category' => $validated['category'],
                'display_order' => $validated['display_order'] ?? 0,
                'is_active' => $validated['is_active'] ?? 1,
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Technology created successfully',
                'data' => $technology
            ], 201);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Technology update karne ke liye
     * PUT /api/technologies/{id}
     */
    public function update(Request $request, $id)
    {
        try {
            $technology = ServiceTechnology::find($id);
            
            if (!$technology) {
                return response()->json([
                    'success' => false,
                    'message' => 'Technology not found'
                ], 404);
            }

            $technology->update([
                'name' => $request->name ?? $technology->name,
                'icon' => $request->icon ?? $technology->icon,
                'category' => $request->category ?? $technology->category,
                'display_order' => $request->display_order ?? $technology->display_order,
                'is_active' => $request->is_active ?? $technology->is_active,
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Technology updated successfully',
                'data' => $technology
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Technology delete karne ke liye
     * DELETE /api/technologies/{id}
     */
    public function destroy($id)
    {
        try {
            $technology = ServiceTechnology::find($id);
            
            if (!$technology) {
                return response()->json([
                    'success' => false,
                    'message' => 'Technology not found'
                ], 404);
            }

            $technology->delete();

            return response()->json([
                'success' => true,
                'message' => 'Technology deleted successfully'
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Active/Inactive toggle karne ke liye
     * PATCH /api/technologies/{id}/toggle-status
     */
    public function toggleStatus($id)
    {
        try {
            $technology = ServiceTechnology::find($id);
            
            if (!$technology) {
                return response()->json([
                    'success' => false,
                    'message' => 'Technology not found'
                ], 404);
            }

            $technology->is_active = $technology->is_active == 1 ? 0 : 1;
            $technology->save();

            return response()->json([
                'success' => true,
                'message' => 'Status toggled successfully',
                'data' => $technology
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => $e->getMessage()
            ], 500);
        }
    }
}