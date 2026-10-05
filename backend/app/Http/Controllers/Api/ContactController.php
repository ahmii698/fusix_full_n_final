<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class ContactController extends Controller
{
    public function store(Request $request)
    {
        try {
            // Debug: Print request data
            \Log::info('=== CONTACT FORM DATA ===');
            \Log::info($request->all());
            
            // Validate
            $validator = validator($request->all(), [
                'name' => 'required|string|max:100',
                'email' => 'required|email|max:100',
                'message' => 'required|string'
            ]);
            
            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'errors' => $validator->errors()
                ], 422);
            }
            
            // Check table columns
            $columns = DB::getSchemaBuilder()->getColumnListing('appointments');
            \Log::info('Appointments table columns:', $columns);
            
            // Save to appointments
            $data = [
                'full_name' => $request->name,
                'email' => $request->email,
                'message' => $request->message,
                'status' => 'pending',
                'created_at' => now(),
                'updated_at' => now()
            ];
            
            // Add phone if exists in table
            if (in_array('phone', $columns)) {
                $data['phone'] = $request->phone ?? null;
            }
            
            // Add appointment_date if exists in table
            if (in_array('appointment_date', $columns)) {
                $data['appointment_date'] = null;
            }
            
            // Add appointment_time if exists in table
            if (in_array('appointment_time', $columns)) {
                $data['appointment_time'] = null;
            }
            
            $id = DB::table('appointments')->insertGetId($data);
            
            \Log::info('Contact saved with ID: ' . $id);
            
            return response()->json([
                'success' => true,
                'message' => 'Message sent successfully!',
                'data' => ['id' => $id]
            ]);
            
        } catch (\Exception $e) {
            \Log::error('CONTACT ERROR: ' . $e->getMessage());
            \Log::error('Error trace: ' . $e->getTraceAsString());
            
            return response()->json([
                'success' => false,
                'message' => 'Error: ' . $e->getMessage(),
                'trace' => $e->getTraceAsString() // For debugging only
            ], 500);
        }
    }
}