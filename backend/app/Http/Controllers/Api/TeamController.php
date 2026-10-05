<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\TeamMember;
use Illuminate\Http\Request;

class TeamController extends Controller
{
    // GET /api/team - Saare team members lao
    public function index()
    {
        $team = TeamMember::active()
                    ->ordered()
                    ->get();
        
        return response()->json([
            'success' => true,
            'data' => $team
        ]);
    }
      
    // GET /api/team/{id} - Ek specific team member
    public function show($id)
    {
        $member = TeamMember::find($id);
        
        if(!$member) {
            return response()->json([
                'success' => false,
                'message' => 'Team member not found'
            ], 404);
        }
        
        return response()->json([
            'success' => true,
            'data' => $member
        ]);
    }

    // POST /api/team - Naya team member create karo
    public function store(Request $request)
    {
        try {
            $member = TeamMember::create($request->all());
            
            return response()->json([
                'success' => true,
                'message' => 'Team member created successfully',
                'data' => $member
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => $e->getMessage()
            ], 500);
        }
    }

    // PUT /api/team/{id} - Team member update karo
    public function update(Request $request, $id)
    {
        try {
            $member = TeamMember::find($id);
            
            if(!$member) {
                return response()->json([
                    'success' => false,
                    'message' => 'Team member not found'
                ], 404);
            }
            
            $member->update($request->all());
            
            return response()->json([
                'success' => true,
                'message' => 'Team member updated successfully',
                'data' => $member
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => $e->getMessage()
            ], 500);
        }
    }

    // DELETE /api/team/{id} - Team member delete karo
    public function destroy($id)
    {
        try {
            $member = TeamMember::find($id);
            
            if(!$member) {
                return response()->json([
                    'success' => false,
                    'message' => 'Team member not found'
                ], 404);
            }
            
            $member->delete();
            
            return response()->json([
                'success' => true,
                'message' => 'Team member deleted successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => $e->getMessage()
            ], 500);
        }
    }
}