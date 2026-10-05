<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\FAQ;
use Illuminate\Http\Request;

class FAQController extends Controller
{
    // GET /api/faqs - Saare FAQs lao
    public function index(Request $request)
    {
        $query = FAQ::active()->ordered();
        
        // Filter by category
        if($request->has('category')) {
            $query->ofCategory($request->category);
        }
        
        $faqs = $query->get();
        
        return response()->json([
            'success' => true,
            'data' => $faqs
        ]);
    }
    
    // GET /api/faqs/{id} - Ek specific FAQ
    public function show($id)
    {
        $faq = FAQ::find($id);
        
        if(!$faq) {
            return response()->json([
                'success' => false,
                'message' => 'FAQ not found'
            ], 404);
        }
        
        return response()->json([
            'success' => true,
            'data' => $faq
        ]);
    }

    // POST /api/faqs - Naya FAQ create karo
    public function store(Request $request)
    {
        try {
            $faq = FAQ::create($request->all());
            
            return response()->json([
                'success' => true,
                'message' => 'FAQ created successfully',
                'data' => $faq
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => $e->getMessage()
            ], 500);
        }
    }

    // PUT /api/faqs/{id} - FAQ update karo
    public function update(Request $request, $id)
    {
        try {
            $faq = FAQ::find($id);
            
            if(!$faq) {
                return response()->json([
                    'success' => false,
                    'message' => 'FAQ not found'
                ], 404);
            }
            
            $faq->update($request->all());
            
            return response()->json([
                'success' => true,
                'message' => 'FAQ updated successfully',
                'data' => $faq
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => $e->getMessage()
            ], 500);
        }
    }

    // DELETE /api/faqs/{id} - FAQ delete karo
    public function destroy($id)
    {
        try {
            $faq = FAQ::find($id);
            
            if(!$faq) {
                return response()->json([
                    'success' => false,
                    'message' => 'FAQ not found'
                ], 404);
            }
            
            $faq->delete();
            
            return response()->json([
                'success' => true,
                'message' => 'FAQ deleted successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => $e->getMessage()
            ], 500);
        }
    }
}