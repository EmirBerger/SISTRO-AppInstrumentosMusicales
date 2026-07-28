<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Storage;

class UploadController extends Controller
{
    public function uploadImage(Request $request): JsonResponse
    {
        if ($request->user()->rol !== 1) {
            return response()->json(['message' => 'No autorizado.'], 403);
        }

        $request->validate([
            'image' => 'required|image|mimes:jpeg,png,jpg,webp|max:8192',
        ]);

        $path = $request->file('image')->store('sistroFiles/blocks', 'cloudinary');
        $url  = Storage::disk('cloudinary')->url($path);

        return response()->json(['url' => $url], 200);
    }
}
