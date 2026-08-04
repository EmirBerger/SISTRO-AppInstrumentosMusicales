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

        // No usamos la regla "image" porque rechaza los SVG (no tienen dimensiones raster).
        $request->validate([
            'image' => 'required|file|max:8192',
        ], [
            'image.required' => 'El archivo es requerido.',
            'image.max'      => 'El archivo no puede superar los 8 MB.',
        ]);

        $file      = $request->file('image');
        $extension = strtolower($file->getClientOriginalExtension());
        $allowed   = ['jpeg', 'jpg', 'png', 'webp', 'svg'];

        if (!in_array($extension, $allowed, true)) {
            return response()->json([
                'message' => 'Formato no permitido. Usá JPG, PNG, WEBP o SVG.',
            ], 422);
        }

        // Los SVG se suben como "raw" para no depender de la config de entrega de SVG de Cloudinary.
        if ($extension === 'svg') {
            $result = cloudinary()->uploadApi()->upload(
                $file->getRealPath(),
                ['folder' => 'sistroFiles/blocks', 'resource_type' => 'raw']
            );
            $url = $result['secure_url'];
        } else {
            /** @var \Illuminate\Filesystem\FilesystemAdapter $disk */
            $disk = Storage::disk('cloudinary');
            $path = $file->store('sistroFiles/blocks', 'cloudinary');
            $url  = $disk->url($path);
        }

        return response()->json(['url' => $url], 200);
    }
}
