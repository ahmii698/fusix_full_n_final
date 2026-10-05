<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Banner;
use Illuminate\Http\Request;

class BannerController extends Controller
{
    // GET /api/banners - Saare banners lao
    public function index()
    {
        $banners = Banner::active()
                    ->ordered()
                    ->get();
        
        return response()->json([
            'success' => true,
            'data' => $banners
        ]);
    }
    
    // GET /api/banners/{id} - Ek specific banner
    public function show($id)
    {
        $banner = Banner::find($id);
        
        if(!$banner) {
            return response()->json([
                'success' => false,
                'message' => 'Banner not found'
            ], 404);
        }
        
        return response()->json([
            'success' => true,
            'data' => $banner
        ]);
    }

    // POST /api/banners - Naya banner create karo
    public function store(Request $request)
    {
        try {
            $banner = Banner::create($request->all());
            
            return response()->json([
                'success' => true,
                'message' => 'Banner created successfully',
                'data' => $banner
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => $e->getMessage()
            ], 500);
        }
    }

    // PUT /api/banners/{id} - Banner update karo
    public function update(Request $request, $id)
    {
        try {
            $banner = Banner::find($id);
            
            if(!$banner) {
                return response()->json([
                    'success' => false,
                    'message' => 'Banner not found'
                ], 404);
            }
            
            $banner->update($request->all());
            
            return response()->json([
                'success' => true,
                'message' => 'Banner updated successfully',
                'data' => $banner
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => $e->getMessage()
            ], 500);
        }
    }

    // DELETE /api/banners/{id} - Banner delete karo
    public function destroy($id)
    {
        try {
            $banner = Banner::find($id);
            
            if(!$banner) {
                return response()->json([
                    'success' => false,
                    'message' => 'Banner not found'
                ], 404);
            }
            
            $banner->delete();
            
            return response()->json([
                'success' => true,
                'message' => 'Banner deleted successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => $e->getMessage()
            ], 500);
        }
    }
}