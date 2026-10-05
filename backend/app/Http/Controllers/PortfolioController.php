<?php

namespace App\Http\Controllers;

use App\Models\PlanPurchase;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class PlanPurchaseController extends Controller
{
    public function store(Request $request)
    {
        // Validate request
        $validator = Validator::make($request->all(), [
            'plan_id' => 'required',
            'plan_name' => 'required',
            'price' => 'required',
            'period' => 'required',
            'customer_name' => 'required|string|max:255',
            'customer_email' => 'required|email|max:255',
            'customer_phone' => 'required|string|max:20',
            'message' => 'nullable|string',
            'status' => 'required|in:pending,completed,cancelled'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            // Save to database
            $purchase = PlanPurchase::create($request->all());

            return response()->json([
                'success' => true,
                'message' => 'Plan purchase request submitted successfully',
                'data' => $purchase
            ], 201);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to submit request',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}