<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Mail;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Cache;

class ForgotPasswordController extends Controller
{
    // 🔐 Send OTP
    public function sendOtp(Request $request)
    {
        $request->validate([
            'email' => 'required|email'
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'Email not found'
            ]);
        }

        // ✅ OTP generate
        $otp = rand(100000, 999999);

        // ✅ Cache store (15 min)
        Cache::put('otp_' . $request->email, $otp, now()->addMinutes(15));

        // ✅ EMAIL SEND (IMPORTANT)
        try {
            Mail::raw("Your OTP for password reset is: $otp", function ($message) use ($request) {
                $message->to($request->email)
                        ->subject('Password Reset OTP');
            });
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Email sending failed',
                'error' => $e->getMessage()
            ]);
        }

        return response()->json([
            'success' => true,
            'message' => 'OTP sent successfully'
        ]);
    }

    // 🔍 Verify OTP
    public function verifyOtp(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'otp' => 'required|string|size:6'
        ]);

        $cachedOtp = Cache::get('otp_' . $request->email);

        if (!$cachedOtp || $cachedOtp != $request->otp) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid or expired OTP'
            ]);
        }

        return response()->json([
            'success' => true,
            'message' => 'OTP verified successfully'
        ]);
    }

    // 🔑 Reset Password
    public function resetPassword(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required|min:6'
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'User not found'
            ]);
        }

        // ✅ Update password
        $user->password = Hash::make($request->password);
        $user->save();

        // ✅ OTP delete
        Cache::forget('otp_' . $request->email);

        return response()->json([
            'success' => true,
            'message' => 'Password reset successfully'
        ]);
    }
}