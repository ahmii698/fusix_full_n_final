<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;

/*
|--------------------------------------------------------------------------
| API Controllers
|--------------------------------------------------------------------------
*/

use App\Http\Controllers\Api\ServiceController;
use App\Http\Controllers\Api\TeamController;
use App\Http\Controllers\Api\TestimonialController;
use App\Http\Controllers\Api\PortfolioController;
use App\Http\Controllers\Api\PricingController;
use App\Http\Controllers\Api\FAQController;
use App\Http\Controllers\Api\BannerController;
use App\Http\Controllers\Api\FeatureController;
use App\Http\Controllers\Api\ProcessStepController;
use App\Http\Controllers\Api\StatisticController;
use App\Http\Controllers\Api\CompanyInfoController;
use App\Http\Controllers\Api\ContactController;
use App\Http\Controllers\Api\NewsletterController;
use App\Http\Controllers\Api\SettingController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\HeroSectionController;
use App\Http\Controllers\Api\FaqImageController;
use App\Http\Controllers\Api\ServiceFeatureController;
use App\Http\Controllers\Api\PortfolioSettingController;
use App\Http\Controllers\Api\PortfolioProjectController;

// 🔥 ABOUT CONTROLLERS 🔥
use App\Http\Controllers\Api\AboutHeaderController;
use App\Http\Controllers\Api\About2Controller;
use App\Http\Controllers\Api\About3MainController;
use App\Http\Controllers\Api\About4PrincipleController;

// 🔥 SERVICE CONTROLLERS 🔥
use App\Http\Controllers\Api\ServiceHeaderController;
use App\Http\Controllers\Api\Service3Controller;
use App\Http\Controllers\Api\ServiceTechnologyController;

// 🔥 CONTACT HEADER CONTROLLER 🔥
use App\Http\Controllers\Api\ContactHeaderController;

// 🔥 BLOG CONTROLLERS 🔥
use App\Http\Controllers\Api\BlogHeaderController;
use App\Http\Controllers\Api\BlogFeatureController;
use App\Http\Controllers\Api\MainBlogController;

use App\Http\Controllers\Admin\AdminController;
use App\Http\Controllers\Admin\AppointmentController;
use App\Http\Controllers\Admin\PlanPurchaseController;
use App\Http\Controllers\Admin\EmailController;

use App\Http\Controllers\ImageUploadController;

/*
|--------------------------------------------------------------------------
| 🔥 CORS FIX
|--------------------------------------------------------------------------
*/

Route::options('/{any}', function () {
    return response()->json([], 200)
        ->header('Access-Control-Allow-Origin', '*')
        ->header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
        ->header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
})->where('any', '.*');

/*
|--------------------------------------------------------------------------
| 🔥 TEST ROUTE
|--------------------------------------------------------------------------
*/

Route::get('/test', function() {
    return response()->json([
        'success' => true,
        'message' => 'API is working!'
    ]);
});

/*
|--------------------------------------------------------------------------
| 🆕 ABOUT SECTION ROUTES (PUBLIC - HYPHEN)
|--------------------------------------------------------------------------
*/

Route::get('/about-header', [AboutHeaderController::class, 'index']);
Route::get('/about-2', [About2Controller::class, 'index']);
Route::get('/about-3-main', [About3MainController::class, 'index']);
Route::get('/about-4-principles', [About4PrincipleController::class, 'index']);

/*
|--------------------------------------------------------------------------
| 🆕 SERVICE PAGE ROUTES (PUBLIC - HYPHEN)
|--------------------------------------------------------------------------
*/

Route::get('/service-header', [ServiceHeaderController::class, 'index']);
Route::get('/service-3', [Service3Controller::class, 'index']);

/*
|--------------------------------------------------------------------------
| 🆕 CONTACT HEADER ROUTE (PUBLIC - HYPHEN)
|--------------------------------------------------------------------------
*/

Route::get('/contact-header', [ContactHeaderController::class, 'index']);

/*
|--------------------------------------------------------------------------
| 🆕 BLOG ROUTES (PUBLIC - HYPHEN)
|--------------------------------------------------------------------------
*/

// Blog Header (OUR BLOG / Insights & Innovations)
Route::get('/blog-header', [BlogHeaderController::class, 'index']);

// Blog Features (Featured Posts - 3 cards)
Route::get('/blog-features', [BlogFeatureController::class, 'index']);

// Main Blog (Posts grid + categories)
Route::get('/main-blog', [MainBlogController::class, 'index']);

// Blog Categories (automatic - sidebar ke liye)
Route::get('/blog-categories', [MainBlogController::class, 'getCategories']);

/*
|--------------------------------------------------------------------------
| 🔥 HEADER TABLES - FULL CRUD (UNDERSCORE VERSION FOR ADMIN PANEL) 🔥
|--------------------------------------------------------------------------
*/

// About Header - Full CRUD (Admin)
Route::get('/about_header', [AboutHeaderController::class, 'adminIndex']);
Route::get('/about_header/{id}', [AboutHeaderController::class, 'show']);
Route::post('/about_header', [AboutHeaderController::class, 'store']);
Route::put('/about_header/{id}', [AboutHeaderController::class, 'update']);
Route::delete('/about_header/{id}', [AboutHeaderController::class, 'destroy']);

// Service Header - Full CRUD (Admin)
Route::get('/service_header', [ServiceHeaderController::class, 'adminIndex']);
Route::get('/service_header/{id}', [ServiceHeaderController::class, 'show']);
Route::post('/service_header', [ServiceHeaderController::class, 'store']);
Route::put('/service_header/{id}', [ServiceHeaderController::class, 'update']);
Route::delete('/service_header/{id}', [ServiceHeaderController::class, 'destroy']);

// Contact Header - Full CRUD (Admin)
Route::get('/contact_header', [ContactHeaderController::class, 'adminIndex']);
Route::get('/contact_header/{id}', [ContactHeaderController::class, 'show']);
Route::post('/contact_header', [ContactHeaderController::class, 'store']);
Route::put('/contact_header/{id}', [ContactHeaderController::class, 'update']);
Route::delete('/contact_header/{id}', [ContactHeaderController::class, 'destroy']);

// 🔥 Blog Header - Full CRUD (Admin)
Route::get('/blog_header', [BlogHeaderController::class, 'adminIndex']);
Route::get('/blog_header/{id}', [BlogHeaderController::class, 'show']);
Route::post('/blog_header', [BlogHeaderController::class, 'store']);
Route::put('/blog_header/{id}', [BlogHeaderController::class, 'update']);
Route::delete('/blog_header/{id}', [BlogHeaderController::class, 'destroy']);

/*
|--------------------------------------------------------------------------
| 🔥 ABOUT 2 / 3 / 4 - FULL CRUD (UNDERSCORE VERSION FOR ADMIN PANEL) 🔥
|--------------------------------------------------------------------------
*/

// About 2 (Stats) - Full CRUD (Admin)
Route::get('/about_2', [About2Controller::class, 'index']);
Route::get('/about_2/{id}', [About2Controller::class, 'show']);
Route::post('/about_2', [About2Controller::class, 'store']);
Route::put('/about_2/{id}', [About2Controller::class, 'update']);
Route::delete('/about_2/{id}', [About2Controller::class, 'destroy']);

// About 3 Main (Our Story) - Full CRUD (Admin)
Route::get('/about_3_main', [About3MainController::class, 'adminIndex']);
Route::get('/about_3_main/{id}', [About3MainController::class, 'show']);
Route::post('/about_3_main', [About3MainController::class, 'store']);
Route::put('/about_3_main/{id}', [About3MainController::class, 'update']);
Route::delete('/about_3_main/{id}', [About3MainController::class, 'destroy']);

// About 4 Principles (Mission, Vision, Values) - Full CRUD (Admin)
Route::get('/about_4_principles', [About4PrincipleController::class, 'index']);
Route::get('/about_4_principles/{id}', [About4PrincipleController::class, 'show']);
Route::post('/about_4_principles', [About4PrincipleController::class, 'store']);
Route::put('/about_4_principles/{id}', [About4PrincipleController::class, 'update']);
Route::delete('/about_4_principles/{id}', [About4PrincipleController::class, 'destroy']);

/*
|--------------------------------------------------------------------------
| 🔥 SERVICE 3 (Our Process) - FULL CRUD (UNDERSCORE FOR ADMIN) 🔥
|--------------------------------------------------------------------------
*/

Route::get('/service_3', [Service3Controller::class, 'adminIndex']);
Route::get('/service_3/{id}', [Service3Controller::class, 'show']);
Route::post('/service_3', [Service3Controller::class, 'store']);
Route::put('/service_3/{id}', [Service3Controller::class, 'update']);
Route::delete('/service_3/{id}', [Service3Controller::class, 'destroy']);

/*
|--------------------------------------------------------------------------
| 🔥 BLOG FEATURES - FULL CRUD (UNDERSCORE FOR ADMIN) 🔥
|--------------------------------------------------------------------------
*/

Route::get('/blog_features', [BlogFeatureController::class, 'index']);
Route::get('/blog_features/{id}', [BlogFeatureController::class, 'show']);
Route::post('/blog_features', [BlogFeatureController::class, 'store']);
Route::put('/blog_features/{id}', [BlogFeatureController::class, 'update']);
Route::delete('/blog_features/{id}', [BlogFeatureController::class, 'destroy']);

/*
|--------------------------------------------------------------------------
| 🔥 MAIN BLOG - FULL CRUD (UNDERSCORE FOR ADMIN) 🔥
|--------------------------------------------------------------------------
*/

Route::get('/main_blog', [MainBlogController::class, 'index']);
Route::get('/main_blog/{id}', [MainBlogController::class, 'show']);
Route::post('/main_blog', [MainBlogController::class, 'store']);
Route::put('/main_blog/{id}', [MainBlogController::class, 'update']);
Route::delete('/main_blog/{id}', [MainBlogController::class, 'destroy']);

/*
|--------------------------------------------------------------------------
| 🆕 SERVICE TECHNOLOGY ROUTES (Tools & Technologies)
|--------------------------------------------------------------------------
*/

Route::prefix('technologies')->group(function () {
    Route::get('/', [ServiceTechnologyController::class, 'index']);
    Route::get('/active', [ServiceTechnologyController::class, 'getActiveTechnologies']);
    Route::get('/categories', [ServiceTechnologyController::class, 'getCategories']);
    Route::get('/{id}', [ServiceTechnologyController::class, 'show']);
    Route::post('/', [ServiceTechnologyController::class, 'store']);
    Route::put('/{id}', [ServiceTechnologyController::class, 'update']);
    Route::delete('/{id}', [ServiceTechnologyController::class, 'destroy']);
    Route::patch('/{id}/toggle-status', [ServiceTechnologyController::class, 'toggleStatus']);
});

/*
|--------------------------------------------------------------------------
| 🔥 ADMIN EMAIL ROUTES
|--------------------------------------------------------------------------
*/

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/admin/appointments/{id}/send-email', [EmailController::class, 'sendAppointmentEmail']);
    Route::post('/admin/plan-orders/{id}/send-email', [EmailController::class, 'sendPlanOrderEmail']);
});

/*
|--------------------------------------------------------------------------
| ✅ APPOINTMENT BOOKING ROUTE
|--------------------------------------------------------------------------
*/

Route::post('/appointments', [AppointmentController::class, 'store']);

/*
|--------------------------------------------------------------------------
| ADMIN EMAIL ACTION FOR APPOINTMENTS
|--------------------------------------------------------------------------
*/

Route::post('/admin/appointments/{id}/email', [AppointmentController::class, 'sendEmail']);

/*
|--------------------------------------------------------------------------
| PUBLIC WEBSITE API (GET ROUTES ONLY)
|--------------------------------------------------------------------------
*/

Route::get('/services', [ServiceController::class, 'index']);
Route::get('/team', [TeamController::class, 'index']);
Route::get('/testimonials', [TestimonialController::class, 'index']);
Route::get('/portfolio', [PortfolioController::class, 'index']);
Route::get('/pricing', [PricingController::class, 'index']);
Route::get('/faqs', [FAQController::class, 'index']);
Route::get('/banners', [BannerController::class, 'index']);
Route::get('/features', [FeatureController::class, 'index']);
Route::get('/process-steps', [ProcessStepController::class, 'index']);
Route::get('/statistics', [StatisticController::class, 'index']);
Route::get('/company-info', [CompanyInfoController::class, 'index']);
Route::get('/settings', [SettingController::class, 'index']);

/*
|--------------------------------------------------------------------------
| 🔥 FULL CRUD ROUTES FOR PUBLIC TABLES (GET, POST, PUT, DELETE)
|--------------------------------------------------------------------------
*/

// Testimonials - Full CRUD
Route::get('/testimonials/{id}', [TestimonialController::class, 'show']);
Route::post('/testimonials', [TestimonialController::class, 'store']);
Route::put('/testimonials/{id}', [TestimonialController::class, 'update']);
Route::delete('/testimonials/{id}', [TestimonialController::class, 'destroy']);
Route::put('/testimonials/{id}/approve', [TestimonialController::class, 'approve']);
Route::get('/testimonials/pending', [TestimonialController::class, 'pending']);

// Services - Full CRUD
Route::get('/services/{id}', [ServiceController::class, 'show']);
Route::post('/services', [ServiceController::class, 'store']);
Route::put('/services/{id}', [ServiceController::class, 'update']);
Route::delete('/services/{id}', [ServiceController::class, 'destroy']);

// Team - Full CRUD
Route::get('/team/{id}', [TeamController::class, 'show']);
Route::post('/team', [TeamController::class, 'store']);
Route::put('/team/{id}', [TeamController::class, 'update']);
Route::delete('/team/{id}', [TeamController::class, 'destroy']);

// Portfolio - Full CRUD
Route::get('/portfolio/{id}', [PortfolioController::class, 'show']);
Route::post('/portfolio', [PortfolioController::class, 'store']);
Route::put('/portfolio/{id}', [PortfolioController::class, 'update']);
Route::delete('/portfolio/{id}', [PortfolioController::class, 'destroy']);

// FAQs - Full CRUD
Route::get('/faqs/{id}', [FAQController::class, 'show']);
Route::post('/faqs', [FAQController::class, 'store']);
Route::put('/faqs/{id}', [FAQController::class, 'update']);
Route::delete('/faqs/{id}', [FAQController::class, 'destroy']);

// Banners - Full CRUD
Route::get('/banners/{id}', [BannerController::class, 'show']);
Route::post('/banners', [BannerController::class, 'store']);
Route::put('/banners/{id}', [BannerController::class, 'update']);
Route::delete('/banners/{id}', [BannerController::class, 'destroy']);

// Features - Full CRUD
Route::get('/features/{id}', [FeatureController::class, 'show']);
Route::post('/features', [FeatureController::class, 'store']);
Route::put('/features/{id}', [FeatureController::class, 'update']);
Route::delete('/features/{id}', [FeatureController::class, 'destroy']);

// Statistics - Full CRUD
Route::get('/statistics/{id}', [StatisticController::class, 'show']);
Route::post('/statistics', [StatisticController::class, 'store']);
Route::put('/statistics/{id}', [StatisticController::class, 'update']);
Route::delete('/statistics/{id}', [StatisticController::class, 'destroy']);

/*
|--------------------------------------------------------------------------
| 🏢 COMPANY INFO ROUTES (UNDERSCORE VERSION)
|--------------------------------------------------------------------------
*/

Route::get('/company_info', [CompanyInfoController::class, 'index']);
Route::get('/company_info/{id}', [CompanyInfoController::class, 'show']);
Route::post('/company_info', [CompanyInfoController::class, 'store']);
Route::put('/company_info/{id}', [CompanyInfoController::class, 'update']);
Route::delete('/company_info/{id}', [CompanyInfoController::class, 'destroy']);

// Settings - Full CRUD
Route::get('/settings/{id}', [SettingController::class, 'show']);
Route::post('/settings', [SettingController::class, 'store']);
Route::put('/settings/{id}', [SettingController::class, 'update']);
Route::delete('/settings/{id}', [SettingController::class, 'destroy']);

// Pricing - Full CRUD
Route::get('/pricing/{id}', [PricingController::class, 'show']);
Route::post('/pricing', [PricingController::class, 'store']);
Route::put('/pricing/{id}', [PricingController::class, 'update']);
Route::delete('/pricing/{id}', [PricingController::class, 'destroy']);

/*
|--------------------------------------------------------------------------
| 🎯 HERO SECTION - FULL CRUD ROUTES
|--------------------------------------------------------------------------
*/

Route::get('/hero_section', [HeroSectionController::class, 'index']);
Route::get('/hero_section/{id}', [HeroSectionController::class, 'show']);
Route::post('/hero_section', [HeroSectionController::class, 'store']);
Route::put('/hero_section/{id}', [HeroSectionController::class, 'update']);
Route::delete('/hero_section/{id}', [HeroSectionController::class, 'destroy']);

/*
|--------------------------------------------------------------------------
| 🖼️ FAQ IMAGE ROUTES (FULL CRUD) - BOTH HYPHEN AND UNDERSCORE
|--------------------------------------------------------------------------
*/

Route::get('/faq-image', [FaqImageController::class, 'index']);
Route::get('/faq-image/{id}', [FaqImageController::class, 'show']);
Route::post('/faq-image', [FaqImageController::class, 'store']);
Route::put('/faq-image/{id}', [FaqImageController::class, 'update']);
Route::delete('/faq-image/{id}', [FaqImageController::class, 'destroy']);

Route::get('/faq_images', [FaqImageController::class, 'index']);
Route::get('/faq_images/{id}', [FaqImageController::class, 'show']);
Route::post('/faq_images', [FaqImageController::class, 'store']);
Route::put('/faq_images/{id}', [FaqImageController::class, 'update']);
Route::delete('/faq_images/{id}', [FaqImageController::class, 'destroy']);

/*
|--------------------------------------------------------------------------
| 🔥 SERVICE FEATURES - FULL CRUD ROUTES
|--------------------------------------------------------------------------
*/

Route::get('/service-features', [ServiceFeatureController::class, 'index']);
Route::get('/service-features/{id}', [ServiceFeatureController::class, 'show']);
Route::post('/service-features', [ServiceFeatureController::class, 'store']);
Route::put('/service-features/{id}', [ServiceFeatureController::class, 'update']);
Route::delete('/service-features/{id}', [ServiceFeatureController::class, 'destroy']);

Route::get('/service_features', [ServiceFeatureController::class, 'index']);
Route::get('/service_features/{id}', [ServiceFeatureController::class, 'show']);
Route::post('/service_features', [ServiceFeatureController::class, 'store']);
Route::put('/service_features/{service_feature}', [ServiceFeatureController::class, 'update']);
Route::delete('/service_features/{id}', [ServiceFeatureController::class, 'destroy']);

/*
|--------------------------------------------------------------------------
| 📁 PORTFOLIO SETTINGS ROUTES (UNDERSCORE VERSION)
|--------------------------------------------------------------------------
*/

Route::get('/portfolio_settings', [PortfolioSettingController::class, 'index']);
Route::get('/portfolio_settings/{id}', [PortfolioSettingController::class, 'show']);
Route::put('/portfolio_settings/{id}', [PortfolioSettingController::class, 'update']);

/*
|--------------------------------------------------------------------------
| 📁 PORTFOLIO PROJECTS ROUTES (FULL CRUD)
|--------------------------------------------------------------------------
*/

Route::get('/portfolio_projects', [PortfolioProjectController::class, 'index']);
Route::get('/portfolio_projects/{id}', [PortfolioProjectController::class, 'show']);
Route::post('/portfolio_projects', [PortfolioProjectController::class, 'store']);
Route::put('/portfolio_projects/{id}', [PortfolioProjectController::class, 'update']);
Route::delete('/portfolio_projects/{id}', [PortfolioProjectController::class, 'destroy']);

/*
|--------------------------------------------------------------------------
| 👥 TEAM MEMBERS - DIRECT DB ROUTES (FULL CRUD)
|--------------------------------------------------------------------------
*/

Route::get('/team_members', function() {
    $members = DB::table('team_members')
                ->where('is_active', 1)
                ->orderBy('order_number', 'asc')
                ->get();
    return response()->json(['success' => true, 'data' => $members]);
});

Route::get('/team_members/{id}', function($id) {
    $member = DB::table('team_members')->where('id', $id)->first();
    if(!$member) {
        return response()->json(['success' => false, 'message' => 'Not found'], 404);
    }
    return response()->json(['success' => true, 'data' => $member]);
});

Route::post('/team_members', function(Request $request) {
    try {
        $id = DB::table('team_members')->insertGetId([
            'name' => $request->name,
            'role' => $request->role,
            'expertise' => $request->expertise,
            'experience' => $request->experience,
            'about' => $request->about,
            'image' => $request->image,
            'social_linkedin' => $request->social_linkedin,
            'social_twitter' => $request->social_twitter,
            'social_github' => $request->social_github,
            'social_instagram' => $request->social_instagram,
            'order_number' => $request->order_number ?? 0,
            'is_active' => $request->is_active ?? 1,
            'created_at' => now(),
            'updated_at' => now()
        ]);
        return response()->json(['success' => true, 'message' => 'Team member created', 'id' => $id]);
    } catch (\Exception $e) {
        return response()->json(['success' => false, 'error' => $e->getMessage()], 500);
    }
});

Route::put('/team_members/{id}', function(Request $request, $id) {
    try {
        $member = DB::table('team_members')->where('id', $id)->first();
        if(!$member) {
            return response()->json(['success' => false, 'message' => 'Not found'], 404);
        }
        DB::table('team_members')->where('id', $id)->update([
            'name' => $request->name ?? $member->name,
            'role' => $request->role ?? $member->role,
            'expertise' => $request->expertise ?? $member->expertise,
            'experience' => $request->experience ?? $member->experience,
            'about' => $request->about ?? $member->about,
            'image' => $request->image ?? $member->image,
            'social_linkedin' => $request->social_linkedin ?? $member->social_linkedin,
            'social_twitter' => $request->social_twitter ?? $member->social_twitter,
            'social_github' => $request->social_github ?? $member->social_github,
            'social_instagram' => $request->social_instagram ?? $member->social_instagram,
            'order_number' => $request->order_number ?? $member->order_number,
            'is_active' => $request->is_active ?? $member->is_active,
            'updated_at' => now()
        ]);
        return response()->json(['success' => true, 'message' => 'Team member updated']);
    } catch (\Exception $e) {
        return response()->json(['success' => false, 'error' => $e->getMessage()], 500);
    }
});

Route::delete('/team_members/{id}', function($id) {
    try {
        $member = DB::table('team_members')->where('id', $id)->first();
        if(!$member) {
            return response()->json(['success' => false, 'message' => 'Not found'], 404);
        }
        DB::table('team_members')->where('id', $id)->delete();
        return response()->json(['success' => true, 'message' => 'Team member deleted']);
    } catch (\Exception $e) {
        return response()->json(['success' => false, 'error' => $e->getMessage()], 500);
    }
});

/*
|--------------------------------------------------------------------------
| 💰 PRICING PLANS - DIRECT DB ROUTES (FULL CRUD)
|--------------------------------------------------------------------------
*/

Route::get('/pricing_plans', function() {
    $plans = DB::table('pricing_plans')
                ->orderBy('order_number', 'asc')
                ->get();
    return response()->json(['success' => true, 'data' => $plans]);
});

Route::get('/pricing_plans/{id}', function($id) {
    $plan = DB::table('pricing_plans')->where('id', $id)->first();
    if(!$plan) {
        return response()->json(['success' => false, 'message' => 'Not found'], 404);
    }
    return response()->json(['success' => true, 'data' => $plan]);
});

Route::post('/pricing_plans', function(Request $request) {
    try {
        $id = DB::table('pricing_plans')->insertGetId([
            'name' => $request->name,
            'price' => $request->price,
            'period' => $request->period ?? 'project',
            'is_recommended' => $request->is_recommended ?? 0,
            'button_text' => $request->button_text ?? 'Get Started',
            'button_link' => $request->button_link ?? '#',
            'order_number' => $request->order_number ?? 0,
            'is_active' => $request->is_active ?? 1,
            'created_at' => now(),
            'updated_at' => now()
        ]);
        return response()->json(['success' => true, 'message' => 'Pricing plan created', 'id' => $id]);
    } catch (\Exception $e) {
        return response()->json(['success' => false, 'error' => $e->getMessage()], 500);
    }
});

Route::put('/pricing_plans/{id}', function(Request $request, $id) {
    try {
        $plan = DB::table('pricing_plans')->where('id', $id)->first();
        if(!$plan) {
            return response()->json(['success' => false, 'message' => 'Not found'], 404);
        }
        DB::table('pricing_plans')->where('id', $id)->update([
            'name' => $request->name ?? $plan->name,
            'price' => $request->price ?? $plan->price,
            'period' => $request->period ?? $plan->period,
            'is_recommended' => $request->is_recommended ?? $plan->is_recommended,
            'button_text' => $request->button_text ?? $plan->button_text,
            'button_link' => $request->button_link ?? $plan->button_link,
            'order_number' => $request->order_number ?? $plan->order_number,
            'is_active' => $request->is_active ?? $plan->is_active,
            'updated_at' => now()
        ]);
        return response()->json(['success' => true, 'message' => 'Pricing plan updated']);
    } catch (\Exception $e) {
        return response()->json(['success' => false, 'error' => $e->getMessage()], 500);
    }
});

Route::delete('/pricing_plans/{id}', function($id) {
    try {
        $plan = DB::table('pricing_plans')->where('id', $id)->first();
        if(!$plan) {
            return response()->json(['success' => false, 'message' => 'Not found'], 404);
        }
        DB::table('pricing_features')->where('plan_id', $id)->delete();
        DB::table('pricing_plans')->where('id', $id)->delete();
        return response()->json(['success' => true, 'message' => 'Pricing plan deleted']);
    } catch (\Exception $e) {
        return response()->json(['success' => false, 'error' => $e->getMessage()], 500);
    }
});

/*
|--------------------------------------------------------------------------
| 📋 PRICING FEATURES - DIRECT DB ROUTES (FULL CRUD)
|--------------------------------------------------------------------------
*/

Route::get('/pricing_features', function() {
    $features = DB::table('pricing_features')
                ->orderBy('id', 'asc')
                ->get();
    return response()->json(['success' => true, 'data' => $features]);
});

Route::get('/pricing_features/{id}', function($id) {
    $feature = DB::table('pricing_features')->where('id', $id)->first();
    if(!$feature) {
        return response()->json(['success' => false, 'message' => 'Not found'], 404);
    }
    return response()->json(['success' => true, 'data' => $feature]);
});

Route::post('/pricing_features', function(Request $request) {
    try {
        $id = DB::table('pricing_features')->insertGetId([
            'plan_id' => $request->plan_id,
            'feature' => $request->feature,
            'created_at' => now()
        ]);
        return response()->json(['success' => true, 'message' => 'Pricing feature created', 'id' => $id]);
    } catch (\Exception $e) {
        return response()->json(['success' => false, 'error' => $e->getMessage()], 500);
    }
});

Route::put('/pricing_features/{id}', function(Request $request, $id) {
    try {
        $feature = DB::table('pricing_features')->where('id', $id)->first();
        if(!$feature) {
            return response()->json(['success' => false, 'message' => 'Not found'], 404);
        }
        DB::table('pricing_features')->where('id', $id)->update([
            'plan_id' => $request->plan_id ?? $feature->plan_id,
            'feature' => $request->feature ?? $feature->feature
        ]);
        return response()->json(['success' => true, 'message' => 'Pricing feature updated']);
    } catch (\Exception $e) {
        return response()->json(['success' => false, 'error' => $e->getMessage()], 500);
    }
});

Route::delete('/pricing_features/{id}', function($id) {
    try {
        $feature = DB::table('pricing_features')->where('id', $id)->first();
        if(!$feature) {
            return response()->json(['success' => false, 'message' => 'Not found'], 404);
        }
        DB::table('pricing_features')->where('id', $id)->delete();
        return response()->json(['success' => true, 'message' => 'Pricing feature deleted']);
    } catch (\Exception $e) {
        return response()->json(['success' => false, 'error' => $e->getMessage()], 500);
    }
});

/*
|--------------------------------------------------------------------------
| 🔄 PROCESS STEPS - DIRECT DB ROUTES (FULL CRUD)
|--------------------------------------------------------------------------
*/

Route::get('/process_steps', function() {
    $steps = DB::table('process_steps')
                ->where('is_active', 1)
                ->orderBy('order_number', 'asc')
                ->get();
    return response()->json(['success' => true, 'data' => $steps]);
});

Route::get('/process_steps/{id}', function($id) {
    $step = DB::table('process_steps')->where('id', $id)->first();
    if(!$step) {
        return response()->json(['success' => false, 'message' => 'Not found'], 404);
    }
    return response()->json(['success' => true, 'data' => $step]);
});

Route::post('/process_steps', function(Request $request) {
    try {
        $id = DB::table('process_steps')->insertGetId([
            'step_number' => $request->step_number,
            'title' => $request->title,
            'order_number' => $request->order_number ?? 0,
            'is_active' => $request->is_active ?? 1,
            'created_at' => now()
        ]);
        return response()->json(['success' => true, 'message' => 'Process step created', 'id' => $id]);
    } catch (\Exception $e) {
        return response()->json(['success' => false, 'error' => $e->getMessage()], 500);
    }
});

Route::put('/process_steps/{id}', function(Request $request, $id) {
    try {
        $step = DB::table('process_steps')->where('id', $id)->first();
        if(!$step) {
            return response()->json(['success' => false, 'message' => 'Not found'], 404);
        }
        DB::table('process_steps')->where('id', $id)->update([
            'step_number' => $request->step_number ?? $step->step_number,
            'title' => $request->title ?? $step->title,
            'order_number' => $request->order_number ?? $step->order_number,
            'is_active' => $request->is_active ?? $step->is_active
        ]);
        return response()->json(['success' => true, 'message' => 'Process step updated']);
    } catch (\Exception $e) {
        return response()->json(['success' => false, 'error' => $e->getMessage()], 500);
    }
});

Route::delete('/process_steps/{id}', function($id) {
    try {
        $step = DB::table('process_steps')->where('id', $id)->first();
        if(!$step) {
            return response()->json(['success' => false, 'message' => 'Not found'], 404);
        }
        DB::table('process_steps')->where('id', $id)->delete();
        return response()->json(['success' => true, 'message' => 'Process step deleted']);
    } catch (\Exception $e) {
        return response()->json(['success' => false, 'error' => $e->getMessage()], 500);
    }
});

/*
|--------------------------------------------------------------------------
| CONTACT & NEWSLETTER
|--------------------------------------------------------------------------
*/

Route::post('/contact', [ContactController::class, 'store']);
Route::post('/newsletter', [NewsletterController::class, 'store']);

/*
|--------------------------------------------------------------------------
| ADMIN LOGIN
|--------------------------------------------------------------------------
*/

Route::post('/admin-login', [AuthController::class, 'login']);

/*
|--------------------------------------------------------------------------
| 🚨 ADMIN GENERIC CRUD (with /admin prefix)
|--------------------------------------------------------------------------
*/

Route::prefix('admin')->group(function () {
    Route::get('/{table}', [AdminController::class, 'index']);
    Route::get('/{table}/{id}', [AdminController::class, 'show']);
    Route::post('/{table}', [AdminController::class, 'store']);
    Route::put('/{table}/{id}', [AdminController::class, 'update']);
    Route::delete('/{table}/{id}', [AdminController::class, 'destroy']);
});

/*
|--------------------------------------------------------------------------
| 📋 ALL OTHER ADMIN TABLES ROUTES (WITH SORTING FOR APPOINTMENTS)
|--------------------------------------------------------------------------
*/

$otherTables = [
    'newsletter_subscribers', 
    'pages', 
    'portfolio_technologies',
    'users', 
    'plan_purchases',
    'appointments', 
    'service_features',
    'blog_posts', 
    'contact_messages', 
    'cta_section'
];

foreach ($otherTables as $table) {
    if ($table === 'appointments') {
        Route::get('/' . $table, function() {
            $data = DB::table('appointments')->orderBy('created_at', 'desc')->orderBy('id', 'desc')->get();
            return response()->json(['success' => true, 'data' => $data]);
        });
    } else {
        Route::get('/' . $table, [AdminController::class, 'index'])->defaults('table', $table);
    }
    
    Route::get('/' . $table . '/{id}', [AdminController::class, 'show'])->defaults('table', $table);
    Route::post('/' . $table, [AdminController::class, 'store'])->defaults('table', $table);
    Route::put('/' . $table . '/{id}', [AdminController::class, 'update'])->defaults('table', $table);
    Route::delete('/' . $table . '/{id}', [AdminController::class, 'destroy'])->defaults('table', $table);
}

/*
|--------------------------------------------------------------------------
| PRICING DATA
|--------------------------------------------------------------------------
*/

Route::get('/pricing-plans-data', function() {
    $plans = DB::table('pricing_plans')
               ->where('is_active', 1)
               ->orderBy('order_number')
               ->get();
    return response()->json(['data' => $plans]);
});

Route::get('/pricing-features-data', function() {
    $features = DB::table('pricing_features')->get();
    return response()->json(['data' => $features]);
});

/*
|--------------------------------------------------------------------------
| PLAN PURCHASE
|--------------------------------------------------------------------------
*/

Route::post('/plan-purchase', [PlanPurchaseController::class, 'store']);
Route::get('/admin/plan-purchases-list', [PlanPurchaseController::class, 'index']);
Route::put('/admin/plan-purchases-list/{id}', [PlanPurchaseController::class, 'update']);

/*
|--------------------------------------------------------------------------
| FORGOT PASSWORD
|--------------------------------------------------------------------------
*/

Route::post('/forgot-password', [App\Http\Controllers\ForgotPasswordController::class, 'sendOtp']);
Route::post('/verify-otp', [App\Http\Controllers\ForgotPasswordController::class, 'verifyOtp']);
Route::post('/reset-password', [App\Http\Controllers\ForgotPasswordController::class, 'resetPassword']);

/*
|--------------------------------------------------------------------------
| 📧 SEND EMAIL ROUTE
|--------------------------------------------------------------------------
*/

Route::post('/send-email', [App\Http\Controllers\Admin\EmailController::class, 'sendEmail']);

/*
|--------------------------------------------------------------------------
| 🎯 IMAGE UPLOAD ROUTE (USING IMAGEUPLOADCONTROLLER)
|--------------------------------------------------------------------------
*/

Route::post('/upload', [ImageUploadController::class, 'upload']);