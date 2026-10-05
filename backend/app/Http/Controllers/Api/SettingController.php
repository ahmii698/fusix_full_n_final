<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\SiteSettings;
use App\Models\HeroSection;
use App\Models\CtaSection;
use Illuminate\Http\Request;

class SettingController extends Controller
{
    // GET /api/settings
    public function index()
    {
        $settings = [
            'site' => SiteSettings::first(),
            'hero' => HeroSection::where('is_active', true)->first(),
            'cta' => CtaSection::where('is_active', true)->first()
        ];
        
        return response()->json([
            'success' => true,
            'data' => $settings
        ]);
    }
}