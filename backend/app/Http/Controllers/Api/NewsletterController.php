<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class NewsletterController extends Controller
{
    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'email' => 'required|email|unique:newsletter_subscribers,email'
            ]);

            DB::table('newsletter_subscribers')->insert([
                'email' => $request->email,
                'is_active' => 1,
                'subscribed_at' => now()
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Subscribed successfully!'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 500);
        }
    }
}