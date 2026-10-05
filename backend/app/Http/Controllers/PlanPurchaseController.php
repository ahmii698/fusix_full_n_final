<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;
use App\Mail\PlanPurchaseMail;

class PlanPurchaseController extends Controller
{
    public function store(Request $request)
    {
        
        $request->validate([
            'plan_id' => 'required|integer',
            'plan_name' => 'required|string',
            'price' => 'required|string',
            'period' => 'required|string',
            'customer_name' => 'required|string',
            'customer_email' => 'required|email',
            'customer_phone' => 'nullable|string',
            'message' => 'nullable|string'
        ]);

        $id = DB::table('plan_purchases')->insertGetId([
            'plan_id' => $request->plan_id,
            'plan_name' => $request->plan_name,
            'price' => $request->price,
            'period' => $request->period,
            'customer_name' => $request->customer_name,
            'customer_email' => $request->customer_email,
            'customer_phone' => $request->customer_phone,
            'message' => $request->message,
            'status' => 'pending',
            'created_at' => now(),
            'updated_at' => now()
        ]);

        // Send email to admin (apni email dalo)
        try {
            Mail::to('admin@yourdomain.com')->send(new PlanPurchaseMail($request->all()));
        } catch (\Exception $e) {
            // Email fail bhi hui to data save ho chuka hai
        }

        return response()->json([
            'success' => true,
            'message' => 'Thank you! We will contact you soon.',
            'id' => $id
        ]);
    }
}