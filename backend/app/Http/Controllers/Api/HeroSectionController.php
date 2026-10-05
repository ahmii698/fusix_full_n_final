<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class HeroSectionController extends Controller
{
    // GET /api/hero_section - Hero section data lao (Array mein return karega)
    public function index()
    {
        $hero = DB::table('hero_section')->first();
        
        // ✅ FIXED: Return as array instead of object
        return response()->json([
            'success' => true,
            'data' => $hero ? [$hero] : []
        ]);
    }
    
    // GET /api/hero_section/{id} - Specific hero section
    public function show($id)
    {
        $hero = DB::table('hero_section')->where('id', $id)->first();
        
        if(!$hero) {
            return response()->json([
                'success' => false,
                'message' => 'Hero section not found'
            ], 404);
        }
        
        return response()->json([
            'success' => true,
            'data' => $hero
        ]);
    }

    // POST /api/hero_section - Naya hero section create karo
    public function store(Request $request)
    {
        try {
            $id = DB::table('hero_section')->insertGetId([
                'subtitle' => $request->subtitle,
                'title' => $request->title,
                'description' => $request->description,
                'button_text' => $request->button_text,
                'button_link' => $request->button_link,
                'is_active' => $request->is_active ?? 1,
                'created_at' => now(),
                'updated_at' => now()
            ]);
            
            return response()->json([
                'success' => true,
                'message' => 'Hero section created successfully',
                'id' => $id
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => $e->getMessage()
            ], 500);
        }
    }

    // PUT /api/hero_section/{id} - Hero section update karo
    public function update(Request $request, $id)
    {
        try {
            $hero = DB::table('hero_section')->where('id', $id)->first();
            
            if(!$hero) {
                return response()->json([
                    'success' => false,
                    'message' => 'Hero section not found'
                ], 404);
            }
            
            DB::table('hero_section')->where('id', $id)->update([
                'subtitle' => $request->subtitle,
                'title' => $request->title,
                'description' => $request->description,
                'button_text' => $request->button_text,
                'button_link' => $request->button_link,
                'is_active' => $request->is_active ?? $hero->is_active,
                'updated_at' => now()
            ]);
            
            return response()->json([
                'success' => true,
                'message' => 'Hero section updated successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => $e->getMessage()
            ], 500);
        }
    }

    // DELETE /api/hero_section/{id} - Hero section delete karo
    public function destroy($id)
    {
        try {
            $hero = DB::table('hero_section')->where('id', $id)->first();
            
            if(!$hero) {
                return response()->json([
                    'success' => false,
                    'message' => 'Hero section not found'
                ], 404);
            }
            
            DB::table('hero_section')->where('id', $id)->delete();
            
            return response()->json([
                'success' => true,
                'message' => 'Hero section deleted successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => $e->getMessage()
            ], 500);
        }
    }
}