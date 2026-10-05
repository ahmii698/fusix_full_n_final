<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Feature;
use Illuminate\Http\Request;

class FeatureController extends Controller
{
    // GET /api/features - Saare features lao
    public function index()
    {
        $features = Feature::active()
                    ->ordered()
                    ->get();
        
        return response()->json([
            'success' => true,
            'data' => $features
        ]);
    }
    
    // GET /api/features/{id} - Ek specific feature
    public function show($id)
    {
        $feature = Feature::find($id);
        
        if(!$feature) {
            return response()->json([
                'success' => false,
                'message' => 'Feature not found'
            ], 404);
        }
        
        return response()->json([
            'success' => true,
            'data' => $feature
        ]);
    }

    // POST /api/features - Naya feature create karo
    public function store(Request $request)
    {
        try {
            $feature = Feature::create($request->all());
            
            return response()->json([
                'success' => true,
                'message' => 'Feature created successfully',
                'data' => $feature
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => $e->getMessage()
            ], 500);
        }
    }

    // PUT /api/features/{id} - Feature update karo
    public function update(Request $request, $id)
    {
        try {
            $feature = Feature::find($id);
            
            if(!$feature) {
                return response()->json([
                    'success' => false,
                    'message' => 'Feature not found'
                ], 404);
            }
            
            $feature->update($request->all());
            
            return response()->json([
                'success' => true,
                'message' => 'Feature updated successfully',
                'data' => $feature
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => $e->getMessage()
            ], 500);
        }
    }

    // DELETE /api/features/{id} - Feature delete karo
    public function destroy($id)
    {
        try {
            $feature = Feature::find($id);
            
            if(!$feature) {
                return response()->json([
                    'success' => false,
                    'message' => 'Feature not found'
                ], 404);
            }
            
            $feature->delete();
            
            return response()->json([
                'success' => true,
                'message' => 'Feature deleted successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => $e->getMessage()
            ], 500);
        }
    }
}