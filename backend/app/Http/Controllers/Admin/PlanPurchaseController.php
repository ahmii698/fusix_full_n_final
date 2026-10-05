<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;

class PlanPurchaseController extends Controller
{
    public function index()
    {
        $purchases = DB::table('plan_purchases')
                      ->orderBy('created_at', 'desc')
                      ->get();
        
        return response()->json(['data' => $purchases]);
    }

    public function update(Request $request, $id)
    {
        DB::table('plan_purchases')
          ->where('id', $id)
          ->update([
              'status' => $request->status,
              'updated_at' => now()
          ]);
        
        return response()->json(['success' => true]);
    }



    public function store(Request $request)
    {
        // ✅ Validation
        $request->validate([
            'plan_id' => 'required|integer',
            'plan_name' => 'required|string|max:255',
            'price' => 'required|string|max:50',
            'period' => 'required|string|max:50',
            'customer_name' => 'required|string|max:255',
            'customer_email' => 'required|email|max:255',
            'customer_phone' => 'nullable|string|max:50',
            'message' => 'nullable|string',
        ]);

        // ✅ Insert into DB
        DB::table('plan_purchases')->insert([
            'plan_id' => $request->plan_id,
            'plan_name' => $request->plan_name,
            'price' => $request->price,
            'period' => $request->period,
            'customer_name' => $request->customer_name,
            'customer_email' => $request->customer_email,
            'customer_phone' => $request->customer_phone,
            'message' => $request->message,
            'status' => 'pending', // default
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Plan purchase submitted successfully'
        ]);
    }



}