<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Testimonial;
use Illuminate\Http\Request;

class TestimonialController extends Controller
{
    // GET /api/testimonials - Admin ke liye saare, public ke liye sirf approved
    public function index(Request $request)
    {
        // Check if request is from admin (has token)
        $token = $request->bearerToken();
        $isAdmin = !empty($token);
        
        if ($isAdmin) {
            // Admin ko saare testimonials dikhao (pending + approved)
            $testimonials = Testimonial::active()
                        ->ordered()
                        ->get();
        } else {
            // Public ko sirf approved testimonials dikhao
            $testimonials = Testimonial::approved()
                        ->active()
                        ->ordered()
                        ->get();
        }
        
        return response()->json([
            'success' => true,
            'data' => $testimonials
        ]);
    }

    // GET /api/testimonials/{id}
    public function show($id)
    {
        $testimonial = Testimonial::find($id);
        
        if (!$testimonial) {
            return response()->json([
                'success' => false,
                'error' => 'Testimonial not found'
            ], 404);
        }
        
        return response()->json([
            'success' => true,
            'data' => $testimonial
        ]);
    }

    // POST /api/testimonials - User se testimonial submit karne ke liye (is_approved = false)
    public function store(Request $request)
    {
        try {
            // User se aane wale testimonial ko default is_approved = false
            $data = $request->all();
            $data['is_approved'] = false;  // ✅ Pending approval
            
            $testimonial = Testimonial::create($data);
            
            return response()->json([
                'success' => true,
                'message' => 'Testimonial submitted successfully! It will be published after review.',
                'data' => $testimonial
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => $e->getMessage()
            ], 500);
        }
    }

    // PUT /api/testimonials/{id} - Admin se update karne ke liye
    public function update(Request $request, $id)
    {
        try {
            $testimonial = Testimonial::find($id);
            
            if (!$testimonial) {
                return response()->json([
                    'success' => false,
                    'error' => 'Testimonial not found'
                ], 404);
            }
            
            $testimonial->update($request->all());
            
            return response()->json([
                'success' => true,
                'message' => 'Testimonial updated successfully',
                'data' => $testimonial
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => $e->getMessage()
            ], 500);
        }
    }

    // DELETE /api/testimonials/{id}
    public function destroy($id)
    {
        try {
            $testimonial = Testimonial::find($id);
            
            if (!$testimonial) {
                return response()->json([
                    'success' => false,
                    'error' => 'Testimonial not found'
                ], 404);
            }
            
            $testimonial->delete();
            
            return response()->json([
                'success' => true,
                'message' => 'Testimonial deleted successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => $e->getMessage()
            ], 500);
        }
    }
    
    // Admin ke liye pending testimonials fetch karne ka route
    public function pending()
    {
        $testimonials = Testimonial::where('is_approved', false)
                    ->active()
                    ->ordered()
                    ->get();
        
        return response()->json([
            'success' => true,
            'data' => $testimonials
        ]);
    }
    
    // Admin ke liye approve karne ka route
    public function approve($id)
    {
        try {
            $testimonial = Testimonial::find($id);
            
            if (!$testimonial) {
                return response()->json([
                    'success' => false,
                    'error' => 'Testimonial not found'
                ], 404);
            }
            
            $testimonial->update(['is_approved' => true]);
            
            return response()->json([
                'success' => true,
                'message' => 'Testimonial approved successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => $e->getMessage()
            ], 500);
        }
    }
}