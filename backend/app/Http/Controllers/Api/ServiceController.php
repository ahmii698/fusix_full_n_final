<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Service;
use App\Models\ServiceFeature;
use Illuminate\Http\Request;

class ServiceController extends Controller
{
    // GET /api/services - Saari services lao
    public function index()
    {
        $services = Service::with('features')
                    ->active()
                    ->ordered()
                    ->get();
        
        return response()->json([
            'success' => true,
            'data' => $services
        ]);
    }
    
    // GET /api/services/{id} - Ek specific service
    public function show($id)
    {
        $service = Service::with('features')->find($id);
        
        if(!$service) {
            return response()->json([
                'success' => false,
                'message' => 'Service not found'
            ], 404);
        }
        
        return response()->json([
            'success' => true,
            'data' => $service
        ]);
    }

    // POST /api/services - Naya service create karo
    public function store(Request $request)
    {
        try {
            $service = Service::create($request->all());
            
            return response()->json([
                'success' => true,
                'message' => 'Service created successfully',
                'data' => $service
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => $e->getMessage()
            ], 500);
        }
    }

    // PUT /api/services/{id} - Service update karo
    public function update(Request $request, $id)
    {
        try {
            $service = Service::find($id);
            
            if(!$service) {
                return response()->json([
                    'success' => false,
                    'message' => 'Service not found'
                ], 404);
            }
            
            $service->update($request->all());
            
            return response()->json([
                'success' => true,
                'message' => 'Service updated successfully',
                'data' => $service
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => $e->getMessage()
            ], 500);
        }
    }

    // DELETE /api/services/{id} - Service delete karo
    public function destroy($id)
    {
        try {
            $service = Service::find($id);
            
            if(!$service) {
                return response()->json([
                    'success' => false,
                    'message' => 'Service not found'
                ], 404);
            }
            
            $service->delete();
            
            return response()->json([
                'success' => true,
                'message' => 'Service deleted successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => $e->getMessage()
            ], 500);
        }
    }
}