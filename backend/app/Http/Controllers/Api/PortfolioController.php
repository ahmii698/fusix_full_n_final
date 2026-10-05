<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Portfolio;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class PortfolioController extends Controller
{
    public function index(Request $request)
    {
        try {
            $query = Portfolio::where('is_active', true);
            
            if ($request->has('category') && $request->category != 'all') {
                $query->where('category', $request->category);
            }
            
            $portfolio = $query->orderBy('order_number')->get();
            
            return response()->json([
                'success' => true,
                'data' => $portfolio
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => $e->getMessage()
            ], 500);
        }
    }
    
    public function show($id)
    {
        try {
            $portfolio = Portfolio::find($id);
            
            if (!$portfolio) {
                return response()->json([
                    'success' => false,
                    'message' => 'Portfolio item not found'
                ], 404);
            }
            
            return response()->json([
                'success' => true,
                'data' => $portfolio
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function store(Request $request)
    {
        try {
            $data = $request->except(['id', 'created_at', 'updated_at', 'technologies']);
            
            if ($request->hasFile('image')) {
                $imageFile = $request->file('image');
                $filename = 'img-' . time() . '-' . Str::random(10) . '.' . $imageFile->getClientOriginalExtension();
                $imagePath = $imageFile->storeAs('uploads/portfolio', $filename, 'public');
                $data['image'] = '/storage/' . $imagePath;
            }
            
            $portfolio = Portfolio::create($data);
            
            return response()->json([
                'success' => true,
                'message' => 'Portfolio item created successfully',
                'data' => $portfolio
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => $e->getMessage()
            ], 500);
        }
    }

    // ✅ COMPLETE FIXED UPDATE METHOD
    public function update(Request $request, $id)
    {
        try {
            $portfolio = Portfolio::find($id);
            
            if(!$portfolio) {
                return response()->json([
                    'success' => false,
                    'message' => 'Portfolio item not found'
                ], 404);
            }
            
            // Get all data except unwanted fields
            $data = $request->except(['id', 'created_at', 'updated_at', 'technologies']);
            
            // ✅ HANDLE IMAGE UPLOAD - File upload from admin panel
            if ($request->hasFile('image')) {
                // Delete old image if exists
                if ($portfolio->image && !empty($portfolio->image)) {
                    $oldPath = str_replace('/storage/', '', $portfolio->image);
                    if (Storage::disk('public')->exists($oldPath)) {
                        Storage::disk('public')->delete($oldPath);
                    }
                }
                
                // Store new image
                $imageFile = $request->file('image');
                $filename = 'img-' . time() . '-' . Str::random(10) . '.' . $imageFile->getClientOriginalExtension();
                $imagePath = $imageFile->storeAs('uploads/portfolio', $filename, 'public');
                $data['image'] = '/storage/' . $imagePath;
            }
            
            // Update the portfolio
            $portfolio->update($data);
            
            return response()->json([
                'success' => true,
                'message' => 'Portfolio item updated successfully',
                'data' => $portfolio
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
            $portfolio = Portfolio::find($id);
            
            if(!$portfolio) {
                return response()->json([
                    'success' => false,
                    'message' => 'Portfolio item not found'
                ], 404);
            }
            
            // Delete image file
            if ($portfolio->image && !empty($portfolio->image)) {
                $imagePath = str_replace('/storage/', '', $portfolio->image);
                if (Storage::disk('public')->exists($imagePath)) {
                    Storage::disk('public')->delete($imagePath);
                }
            }
            
            $portfolio->delete();
            
            return response()->json([
                'success' => true,
                'message' => 'Portfolio item deleted successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => $e->getMessage()
            ], 500);
        }
    }
}