<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\PricingPlan;
use Illuminate\Http\Request;

class PricingController extends Controller
{
    // GET /api/pricing - Saare pricing plans lao
    public function index()
    {
        $plans = PricingPlan::with('features')
                    ->active()
                    ->ordered()
                    ->get();
        
        return response()->json([
            'success' => true,
            'data' => $plans
        ]);
    }
    
    // GET /api/pricing/{id} - Ek specific pricing plan
    public function show($id)
    {
        $plan = PricingPlan::with('features')->find($id);
        
        if(!$plan) {
            return response()->json([
                'success' => false,
                'message' => 'Pricing plan not found'
            ], 404);
        }
        
        return response()->json([
            'success' => true,
            'data' => $plan
        ]);
    }

    // POST /api/pricing - Naya pricing plan create karo
    public function store(Request $request)
    {
        try {
            $plan = PricingPlan::create($request->all());
            
            // Handle features relationship if needed
            if ($request->has('features')) {
                $plan->features()->sync($request->features);
            }
            
            return response()->json([
                'success' => true,
                'message' => 'Pricing plan created successfully',
                'data' => $plan->load('features')
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => $e->getMessage()
            ], 500);
        }
    }

    // PUT /api/pricing/{id} - Pricing plan update karo
    public function update(Request $request, $id)
    {
        try {
            $plan = PricingPlan::find($id);
            
            if(!$plan) {
                return response()->json([
                    'success' => false,
                    'message' => 'Pricing plan not found'
                ], 404);
            }
            
            $plan->update($request->all());
            
            // Update features relationship if needed
            if ($request->has('features')) {
                $plan->features()->sync($request->features);
            }
            
            return response()->json([
                'success' => true,
                'message' => 'Pricing plan updated successfully',
                'data' => $plan->load('features')
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => $e->getMessage()
            ], 500);
        }
    }

    // DELETE /api/pricing/{id} - Pricing plan delete karo
    public function destroy($id)
    {
        try {
            $plan = PricingPlan::find($id);
            
            if(!$plan) {
                return response()->json([
                    'success' => false,
                    'message' => 'Pricing plan not found'
                ], 404);
            }
            
            // Detach features first
            $plan->features()->detach();
            $plan->delete();
            
            return response()->json([
                'success' => true,
                'message' => 'Pricing plan deleted successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => $e->getMessage()
            ], 500);
        }
    }
}