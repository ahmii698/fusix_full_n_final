<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ProcessStep;
use Illuminate\Http\Request;

class ProcessStepController extends Controller
{
    // GET /api/process-steps - Saare process steps lao
    public function index()
    {
        $steps = ProcessStep::active()
                    ->ordered()
                    ->get();
        
        return response()->json([
            'success' => true,
            'data' => $steps
        ]);
    }
    
    // GET /api/process-steps/{id} - Ek specific step
    public function show($id)
    {
        $step = ProcessStep::find($id);
        
        if(!$step) {
            return response()->json([
                'success' => false,
                'message' => 'Process step not found'
            ], 404);
        }
        
        return response()->json([
            'success' => true,
            'data' => $step
        ]);
    }

    // POST /api/process-steps - Naya process step create karo
    public function store(Request $request)
    {
        try {
            $step = ProcessStep::create($request->all());
            
            return response()->json([
                'success' => true,
                'message' => 'Process step created successfully',
                'data' => $step
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => $e->getMessage()
            ], 500);
        }
    }

    // PUT /api/process-steps/{id} - Process step update karo
    public function update(Request $request, $id)
    {
        try {
            $step = ProcessStep::find($id);
            
            if(!$step) {
                return response()->json([
                    'success' => false,
                    'message' => 'Process step not found'
                ], 404);
            }
            
            $step->update($request->all());
            
            return response()->json([
                'success' => true,
                'message' => 'Process step updated successfully',
                'data' => $step
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => $e->getMessage()
            ], 500);
        }
    }

    // DELETE /api/process-steps/{id} - Process step delete karo
    public function destroy($id)
    {
        try {
            $step = ProcessStep::find($id);
            
            if(!$step) {
                return response()->json([
                    'success' => false,
                    'message' => 'Process step not found'
                ], 404);
            }
            
            $step->delete();
            
            return response()->json([
                'success' => true,
                'message' => 'Process step deleted successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => $e->getMessage()
            ], 500);
        }
    }
}