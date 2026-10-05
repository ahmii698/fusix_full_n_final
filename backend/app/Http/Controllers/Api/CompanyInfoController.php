<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class CompanyInfoController extends Controller
{
    public function index()
    {
        $info = DB::table('company_info')->first();
        return response()->json([
            'success' => true,
            'data' => $info
        ]);
    }
    
    public function show($id)
    {
        $info = DB::table('company_info')->where('id', $id)->first();
        if(!$info) {
            return response()->json([
                'success' => false,
                'message' => 'Company info not found'
            ], 404);
        }
        return response()->json([
            'success' => true,
            'data' => $info
        ]);
    }

    public function store(Request $request)
    {
        $id = DB::table('company_info')->insertGetId([
            'address' => $request->address,
            'phone' => $request->phone,
            'email' => $request->email,
            'business_hours' => $request->business_hours,
            'map_embed_url' => $request->map_embed_url,
            'facebook_url' => $request->facebook_url,
            'twitter_url' => $request->twitter_url,
            'instagram_url' => $request->instagram_url,
            'linkedin_url' => $request->linkedin_url,
            'created_at' => now(),
            'updated_at' => now()
        ]);
        
        return response()->json([
            'success' => true,
            'message' => 'Company info created successfully',
            'data' => ['id' => $id]
        ]);
    }

    public function update(Request $request, $id)
{
    $info = DB::table('company_info')->where('id', $id)->first();

    if (!$info) {
        return response()->json([
            'success' => false,
            'message' => 'Company info not found'
        ], 404);
    }

    DB::table('company_info')->where('id', $id)->update([
        'address' => $request->address ?? $info->address,
        'phone' => $request->phone ?? $info->phone,
        'email' => $request->email ?? $info->email,
        'business_hours' => $request->business_hours ?? $info->business_hours,
        'map_embed_url' => $request->map_embed_url ?? $info->map_embed_url,
        'facebook_url' => $request->facebook_url ?? $info->facebook_url,
        'twitter_url' => $request->twitter_url ?? $info->twitter_url,
        'instagram_url' => $request->instagram_url ?? $info->instagram_url,
        'linkedin_url' => $request->linkedin_url ?? $info->linkedin_url,
        'updated_at' => now()
    ]);

    return response()->json([
        'success' => true,
        'message' => 'Updated successfully'
    ]);
}

    public function destroy($id)
    {
        $info = DB::table('company_info')->where('id', $id)->first();
        if(!$info) {
            return response()->json([
                'success' => false,
                'message' => 'Company info not found'
            ], 404);
        }
        DB::table('company_info')->where('id', $id)->delete();
        return response()->json([
            'success' => true,
            'message' => 'Company info deleted successfully'
        ]);
    }
}