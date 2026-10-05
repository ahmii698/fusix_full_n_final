<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class TechnologyController extends Controller
{
    public function index()
    {
        try {
            $technologies = DB::table('technologies')->orderBy('display_order')->get();
            return response()->json([
                'success' => true,
                'data' => $technologies
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function getActiveTechnologies()
    {
        try {
            $technologies = DB::table('technologies')
                ->where('is_active', 1)
                ->orderBy('display_order')
                ->get()
                ->groupBy('category');
            
            return response()->json([
                'success' => true,
                'data' => $technologies
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function store(Request $request)
    {
        try {
            $id = DB::table('technologies')->insertGetId([
                'name' => $request->name,
                'icon' => $request->icon,
                'category' => $request->category,
                'display_order' => $request->display_order ?? 0,
                'is_active' => $request->is_active ?? 1
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Technology created successfully',
                'data' => ['id' => $id]
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function show($id)
    {
        try {
            $technology = DB::table('technologies')->where('id', $id)->first();
            if (!$technology) {
                return response()->json([
                    'success' => false,
                    'message' => 'Technology not found'
                ], 404);
            }
            return response()->json([
                'success' => true,
                'data' => $technology
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function update(Request $request, $id)
    {
        try {
            $technology = DB::table('technologies')->where('id', $id)->first();
            if (!$technology) {
                return response()->json([
                    'success' => false,
                    'message' => 'Technology not found'
                ], 404);
            }
            
            $updateData = [];
            if ($request->has('name')) $updateData['name'] = $request->name;
            if ($request->has('icon')) $updateData['icon'] = $request->icon;
            if ($request->has('category')) $updateData['category'] = $request->category;
            if ($request->has('display_order')) $updateData['display_order'] = $request->display_order;
            if ($request->has('is_active')) $updateData['is_active'] = $request->is_active;
            
            DB::table('technologies')->where('id', $id)->update($updateData);

            return response()->json([
                'success' => true,
                'message' => 'Technology updated successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function destroy($id)
    {
        try {
            $technology = DB::table('technologies')->where('id', $id)->first();
            if (!$technology) {
                return response()->json([
                    'success' => false,
                    'message' => 'Technology not found'
                ], 404);
            }
            DB::table('technologies')->where('id', $id)->delete();
            return response()->json([
                'success' => true,
                'message' => 'Technology deleted successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function toggleStatus($id)
    {
        try {
            $technology = DB::table('technologies')->where('id', $id)->first();
            if (!$technology) {
                return response()->json([
                    'success' => false,
                    'message' => 'Technology not found'
                ], 404);
            }
            $newStatus = $technology->is_active ? 0 : 1;
            DB::table('technologies')->where('id', $id)->update(['is_active' => $newStatus]);
            return response()->json([
                'success' => true,
                'message' => 'Status updated successfully',
                'is_active' => $newStatus == 1
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function getCategories()
    {
        try {
            $categories = DB::table('technologies')
                ->select('category')
                ->distinct()
                ->orderBy('category')
                ->pluck('category');
            return response()->json([
                'success' => true,
                'data' => $categories
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => $e->getMessage()
            ], 500);
        }
    }
}