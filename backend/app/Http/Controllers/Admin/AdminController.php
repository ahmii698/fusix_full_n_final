<?php

namespace App\Http\Controllers\Admin;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;
use App\Http\Controllers\Controller;

class AdminController extends Controller
{
    public function index($table)
    {
        try {
            $data = DB::table($table)->get();

            return response()->json([
                'success' => true,
                'data' => $data
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => 'Table not found: ' . $table
            ], 404);
        }
    }

    public function show($table, $id)
    {
        try {
            $data = DB::table($table)->where('id', $id)->first();

            if (!$data) {
                return response()->json([
                    'success' => false,
                    'error' => 'Record not found'
                ], 404);
            }

            return response()->json([
                'success' => true,
                'data' => $data
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => 'Table not found: ' . $table
            ], 404);
        }
    }

    public function store(Request $request, $table)
    {
        try {
            // Get table columns
            $columns = DB::getSchemaBuilder()->getColumnListing($table);
            
            // Remove system fields
            $data = $request->all();
            unset($data['id']);
            unset($data['created_at']);
            unset($data['updated_at']);
            unset($data['_method']);
            
            // Only keep fields that exist in table
            $filteredData = [];
            foreach ($data as $key => $value) {
                if (in_array($key, $columns) && $value !== null && $value !== '') {
                    $filteredData[$key] = $value;
                }
            }
            
            $id = DB::table($table)->insertGetId($filteredData);

            return response()->json([
                "success" => true,
                "message" => "Record Created",
                "id" => $id
            ]);

        } catch (\Exception $e) {
            return response()->json([
                "success" => false,
                "error" => $e->getMessage()
            ], 500);
        }
    }

    public function update(Request $request, $table, $id)
    {
        try {
            // Check if record exists
            $existing = DB::table($table)->where('id', $id)->first();
            if (!$existing) {
                return response()->json([
                    "success" => false,
                    "error" => "Record not found"
                ], 404);
            }
            
            // Get actual table columns
            $columns = DB::getSchemaBuilder()->getColumnListing($table);
            
            // Remove system fields
            $data = $request->all();
            unset($data['id']);
            unset($data['created_at']);
            unset($data['updated_at']);
            unset($data['_method']);
            
            // Only keep fields that exist in the table and have values
            $filteredData = [];
            foreach ($data as $key => $value) {
                // Skip if key is not a column in the table
                if (!in_array($key, $columns)) {
                    continue;
                }
                // Skip null or empty values (optional - remove this if you want to allow empty values)
                if ($value === null || $value === '') {
                    continue;
                }
                $filteredData[$key] = $value;
            }
            
            // If no data to update
            if (empty($filteredData)) {
                return response()->json([
                    "success" => false,
                    "error" => "No valid data to update"
                ], 400);
            }
            
            // Add updated_at timestamp
            $filteredData['updated_at'] = now();
            
            // Perform update
            DB::table($table)->where('id', $id)->update($filteredData);

            return response()->json([
                "success" => true,
                "message" => "Record Updated successfully"
            ]);

        } catch (\Exception $e) {
            return response()->json([
                "success" => false,
                "error" => $e->getMessage()
            ], 500);
        }
    }

    public function destroy($table, $id)
    {
        try {
            // Check if record exists
            $existing = DB::table($table)->where('id', $id)->first();
            if (!$existing) {
                return response()->json([
                    "success" => false,
                    "error" => "Record not found"
                ], 404);
            }
            
            DB::table($table)->where('id', $id)->delete();

            return response()->json([
                "success" => true,
                "message" => "Record Deleted successfully"
            ]);

        } catch (\Exception $e) {
            return response()->json([
                "success" => false,
                "error" => $e->getMessage()
            ], 500);
        }
    }

    public function uploadImage(Request $request)
    {
        try {
            if ($request->hasFile('image')) {
                $file = $request->file('image');
                $filename = time() . '_' . preg_replace('/[^a-zA-Z0-9._-]/', '', $file->getClientOriginalName());
                $path = $file->storeAs('uploads', $filename, 'public');

                return response()->json([
                    'success' => true,
                    'url' => '/storage/' . $path
                ]);
            }

            return response()->json([
                'success' => false,
                'error' => 'No image file'
            ], 400);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function sendEmail(Request $request)
    {
        try {
            $name = $request->name ?? 'User';
            $email = $request->email ?? null;
            $messageText = $request->message ?? 'No Message';

            if (!$email) {
                return response()->json([
                    'success' => false,
                    'error' => 'Email is required'
                ], 400);
            }

            Mail::raw(
                "Hello $name,\n\nThank you for contacting us!\n\nWe received your message:\n$messageText\n\nOur team will contact you soon.\n\n- TopTech Team",
                function ($message) use ($email) {
                    $message->to($email)
                            ->subject('Thank You for Contacting Us');
                }
            );

            return response()->json([
                'success' => true,
                'message' => 'Email sent to user successfully'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => $e->getMessage()
            ], 500);
        }
    }
}