<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\PortfolioProject;
use Illuminate\Http\Request;

class PortfolioProjectController extends Controller
{
    public function index()
    {
        $projects = PortfolioProject::where('is_active', 1)
            ->orderBy('order_number', 'asc')
            ->get();
        
        return response()->json([
            'success' => true,
            'data' => $projects
        ]);
    }
    
    public function show($id)
    {
        $project = PortfolioProject::find($id);
        
        if (!$project) {
            return response()->json([
                'success' => false,
                'message' => 'Project not found'
            ], 404);
        }
        
        return response()->json([
            'success' => true,
            'data' => $project
        ]);
    }
    
    public function store(Request $request)
    {
        try {
            $technologies = $request->technologies;
            if (is_string($technologies)) {
                $technologies = json_decode($technologies, true);
            }
            
            $project = PortfolioProject::create([
                'title' => $request->title,
                'description' => $request->description,
                'technologies' => json_encode($technologies),
                'image_1' => $request->image_1,
                'image_2' => $request->image_2,
                'image_3' => $request->image_3,
                'order_number' => $request->order_number ?? 0,
                'is_active' => $request->is_active ?? 1
            ]);
            
            return response()->json([
                'success' => true,
                'message' => 'Project created successfully',
                'data' => $project
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => $e->getMessage()
            ], 500);
        }
    }
    
    public function update(Request $request, $id)
    {
        try {
            $project = PortfolioProject::find($id);
            
            if (!$project) {
                return response()->json([
                    'success' => false,
                    'message' => 'Project not found'
                ], 404);
            }
            
            if ($request->has('title')) $project->title = $request->title;
            if ($request->has('description')) $project->description = $request->description;
            if ($request->has('technologies')) {
                $technologies = $request->technologies;
                if (is_string($technologies)) {
                    $technologies = json_decode($technologies, true);
                }
                $project->technologies = json_encode($technologies);
            }
            if ($request->has('image_1')) $project->image_1 = $request->image_1;
            if ($request->has('image_2')) $project->image_2 = $request->image_2;
            if ($request->has('image_3')) $project->image_3 = $request->image_3;
            if ($request->has('order_number')) $project->order_number = $request->order_number;
            if ($request->has('is_active')) $project->is_active = $request->is_active;
            
            $project->save();
            
            return response()->json([
                'success' => true,
                'message' => 'Project updated successfully',
                'data' => $project
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => $e->getMessage()
            ], 500);
        }
    }
    
    public function destroy($id)
    {
        try {
            $project = PortfolioProject::find($id);
            
            if (!$project) {
                return response()->json([
                    'success' => false,
                    'message' => 'Project not found'
                ], 404);
            }
            
            $project->delete();
            
            return response()->json([
                'success' => true,
                'message' => 'Project deleted successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => $e->getMessage()
            ], 500);
        }
    }
}