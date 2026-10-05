<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Models\ServiceFeature;

class ServiceFeatureController extends Controller
{
    public function index()
    {
        try {
            $features = DB::table('service_features')->orderBy('id')->get();
            return response()->json([
                'success' => true,
                'data' => $features
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
            $feature = DB::table('service_features')->where('id', $id)->first();
            if (!$feature) {
                return response()->json([
                    'success' => false,
                    'message' => 'Service feature not found'
                ], 404);
            }
            return response()->json([
                'success' => true,
                'data' => $feature
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
            $id = DB::table('service_features')->insertGetId([
                'service_id' => $request->service_id,
                'feature' => $request->feature,
                'created_at' => now()
            ]);
            
            return response()->json([
                'success' => true,
                'message' => 'Service feature created successfully',
                'data' => ['id' => $id]
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
        $serviceFeature = ServiceFeature::findOrFail($id);

        $serviceFeature->update([
            'feature' => $request->feature,
            'service_id' => $request->service_id
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Updated successfully'
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
            $feature = DB::table('service_features')->where('id', $id)->first();
            if (!$feature) {
                return response()->json([
                    'success' => false,
                    'message' => 'Service feature not found'
                ], 404);
            }
            
            DB::table('service_features')->where('id', $id)->delete();
            
            return response()->json([
                'success' => true,
                'message' => 'Service feature deleted successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => $e->getMessage()
            ], 500);
        }
    }
    
    public function getByService($serviceId)
    {
        try {
            $features = DB::table('service_features')
                ->where('service_id', $serviceId)
                ->get();
            
            return response()->json([
                'success' => true,
                'data' => $features
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => $e->getMessage()
            ], 500);
        }
    }
}