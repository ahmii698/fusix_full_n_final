<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Statistic;
use Illuminate\Http\Request;

class StatisticController extends Controller
{
    // GET /api/statistics - Saare statistics lao
    public function index()
    {
        $stats = Statistic::active()
                    ->ordered()
                    ->get();
        
        return response()->json([
            'success' => true,
            'data' => $stats
        ]);
    }
    
    // GET /api/statistics/{id} - Ek specific statistic
    public function show($id)
    {
        $stat = Statistic::find($id);
        
        if(!$stat) {
            return response()->json([
                'success' => false,
                'message' => 'Statistic not found'
            ], 404);
        }
        
        return response()->json([
            'success' => true,
            'data' => $stat
        ]);
    }

    // POST /api/statistics - Naya statistic create karo
    public function store(Request $request)
    {
        try {
            $stat = Statistic::create($request->all());
            
            return response()->json([
                'success' => true,
                'message' => 'Statistic created successfully',
                'data' => $stat
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => $e->getMessage()
            ], 500);
        }
    }

    // PUT /api/statistics/{id} - Statistic update karo
    public function update(Request $request, $id)
    {
        try {
            $stat = Statistic::find($id);
            
            if(!$stat) {
                return response()->json([
                    'success' => false,
                    'message' => 'Statistic not found'
                ], 404);
            }
            
            $stat->update($request->all());
            
            return response()->json([
                'success' => true,
                'message' => 'Statistic updated successfully',
                'data' => $stat
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => $e->getMessage()
            ], 500);
        }
    }

    // DELETE /api/statistics/{id} - Statistic delete karo
    public function destroy($id)
    {
        try {
            $stat = Statistic::find($id);
            
            if(!$stat) {
                return response()->json([
                    'success' => false,
                    'message' => 'Statistic not found'
                ], 404);
            }
            
            $stat->delete();
            
            return response()->json([
                'success' => true,
                'message' => 'Statistic deleted successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => $e->getMessage()
            ], 500);
        }
    }
}