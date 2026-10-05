<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Appointment;
use Illuminate\Http\Request;

class AppointmentController extends Controller
{
    // Store appointment (public route)
    public function store(Request $request)
    {
        try {
            // Validate request
            $validated = $request->validate([
                'full_name' => 'required|string|max:255',
                'email' => 'required|email|max:255',
                'phone' => 'required|string|max:20',
                'appointment_date' => 'required|date',
                'appointment_time' => 'required',
                'message' => 'nullable|string'
            ]);

            // Create appointment
            $appointment = Appointment::create([
                'full_name' => $validated['full_name'],
                'email' => $validated['email'],
                'phone' => $validated['phone'],
                'appointment_date' => $validated['appointment_date'],
                'appointment_time' => $validated['appointment_time'],
                'message' => $validated['message'] ?? null,
                'status' => 'pending'
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Appointment booked successfully',
                'data' => $appointment
            ], 201);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to book appointment: ' . $e->getMessage()
            ], 500);
        }
    }

    // Get all appointments (admin route)
    public function index()
    {
        $appointments = Appointment::orderBy('created_at', 'desc')->get();
        return response()->json([
            'success' => true,
            'data' => $appointments
        ]);
    }

    // Send email response to customer
    public function sendEmail(Request $request, $id)
    {
        try {
            $appointment = Appointment::findOrFail($id);
            
            $request->validate([
                'subject' => 'required|string',
                'response_message' => 'required|string',
                'status' => 'nullable|string'
            ]);

            // Update status if provided
            if ($request->has('status')) {
                $appointment->status = $request->status;
                $appointment->save();
            }

            return response()->json([
                'success' => true,
                'message' => 'Response saved successfully'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to save response: ' . $e->getMessage()
            ], 500);
        }
    }

    // Other CRUD methods...
    public function update(Request $request, $id)
    {
        try {
            $appointment = Appointment::findOrFail($id);
            $appointment->update($request->all());
            
            return response()->json([
                'success' => true,
                'message' => 'Appointment updated successfully',
                'data' => $appointment
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update appointment'
            ], 500);
        }
    }

    public function destroy($id)
    {
        try {
            $appointment = Appointment::findOrFail($id);
            $appointment->delete();
            
            return response()->json([
                'success' => true,
                'message' => 'Appointment deleted successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete appointment'
            ], 500);
        }
    }
}