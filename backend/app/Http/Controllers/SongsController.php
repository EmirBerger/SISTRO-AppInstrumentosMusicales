<?php

namespace App\Http\Controllers;

use App\Models\Song;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class SongsController extends Controller
{
    protected array $validationRules = [
        'instrument_id' => 'required|integer|exists:instruments,instrument_id',
        'title'         => 'required|string|max:255',
        'artist'        => 'required|string|max:255',
        'difficulty'    => 'required|in:Easy,Medium,Hard',
        'file_url'      => 'required|file|max:5120',
        'image'         => 'nullable|image|mimes:jpeg,png,jpg|max:8192',
    ];

    protected array $validationMessages = [
        'instrument_id.required' => 'El ID del instrumento es requerido.',
        'instrument_id.exists'   => 'El instrumento seleccionado no existe.',
        'title.required'         => 'El título de la canción es requerido.',
        'artist.required'        => 'El artista/autor de la canción es requerido.',
        'difficulty.required'    => 'La dificultad es requerida.',
        'file_url.required'      => 'El archivo de la partitura es requerido.',
        'file_url.file'          => 'Debe subir un archivo musical válido.',
        'image.image'            => 'El archivo debe ser una imagen válida.',
    ];

    public function getAllSongs(): JsonResponse
    {
        $songs = Song::all();

        return response()->json([
            'status' => 'success',
            'data'   => $songs
        ], 200);
    }

    public function getSongsByInstrument(int $instrumentId): JsonResponse
    {
        $songs = Song::where('instrument_id', $instrumentId)->get();

        return response()->json([
            'status' => 'success',
            'data'   => $songs
        ], 200);
    }

    public function getSong(int $id): JsonResponse
    {
        $song = Song::findOrFail($id);

        if (!str_starts_with($song->file_url, 'http')) {
            $song->file_url = Storage::disk('cloudinary')->url($song->file_url);
        }

        return response()->json([
            'status' => 'success',
            'data'   => $song
        ], 200);
    }

    public function streamSheet(int $id): \Illuminate\Http\Response
    {
        $song = Song::findOrFail($id);
        $disk = Storage::disk('cloudinary');
        $content = $disk->get($song->file_url);
        $mime = str_ends_with($song->file_url, '.mxl') ? 'application/vnd.recordare.musicxml' : 'application/xml';

        return response($content, 200)
            ->header('Content-Type', $mime)
            ->header('Access-Control-Allow-Origin', '*');
    }

    public function createSong(Request $request): JsonResponse
    {
        if ($request->user()->rol !== 1) {
            return response()->json(['message' => 'No autorizado.'], 403);
        }

        $request->validate($this->validationRules, $this->validationMessages);
        $input = $request->except(['file_url', 'image']);

        try {
            DB::beginTransaction();

            if ($request->hasFile('file_url')) {
                $result = cloudinary()->upload(
                    $request->file('file_url')->getRealPath(),
                    ['folder' => 'sistroFiles/sheetMusic', 'resource_type' => 'raw']
                );
                $input['file_url'] = $result->getSecureUrl();
            }

            if ($request->hasFile('image')) {
                $input['image'] = $request->file('image')->store('sistroFiles/imageSong', 'cloudinary');
            }

            Song::create($input);

            DB::commit();
            return response()->json(['message' => 'Canción y partitura agregada con éxito.'], 201);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Ocurrió un error, canción no agregada.',
                'error'   => $e->getMessage()
            ], 500);
        }
    }

    public function editSong(int $id, Request $request): JsonResponse
    {
        if ($request->user()->rol !== 1) {
            return response()->json(['message' => 'No autorizado.'], 403);
        }

        $editRules              = $this->validationRules;
        $editRules['file_url']  = 'nullable|file|max:5120';

        $request->validate($editRules, $this->validationMessages);

        $song     = Song::findOrFail($id);
        $input    = $request->only(['instrument_id', 'title', 'artist', 'difficulty']);
        $oldFile  = $song->file_url;
        $oldImage = $song->image;

        try {
            DB::beginTransaction();

            if ($request->hasFile('file_url')) {
                $result = cloudinary()->upload(
                    $request->file('file_url')->getRealPath(),
                    ['folder' => 'sistroFiles/sheetMusic', 'resource_type' => 'raw']
                );
                $input['file_url'] = $result->getSecureUrl();
            }

            if ($request->hasFile('image')) {
                $input['image'] = $request->file('image')->store('sistroFiles/imageSong', 'cloudinary');
            }

            $song->update($input);

            DB::commit();

            if ($request->hasFile('file_url') && $oldFile) {
                Storage::disk('cloudinary')->delete($oldFile);
            }

            if ($request->hasFile('image') && $oldImage) {
                Storage::disk('cloudinary')->delete($oldImage);
            }

            return response()->json(['message' => 'Canción editada con éxito.'], 200);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Ocurrió un error, canción no editada.',
                'error'   => $e->getMessage()
            ], 500);
        }
    }

    public function deleteSong(int $id, Request $request): JsonResponse
    {
        if ($request->user()->rol !== 1) {
            return response()->json(['message' => 'No autorizado.'], 403);
        }

        $song      = Song::findOrFail($id);
        $filePath  = $song->file_url;
        $imagePath = $song->image;

        try {
            DB::beginTransaction();
            $song->delete();
            DB::commit();

            if ($filePath && Storage::disk('cloudinary')->exists($filePath)) {
                Storage::disk('cloudinary')->delete($filePath);
            }

            if ($imagePath && Storage::disk('cloudinary')->exists($imagePath)) {
                Storage::disk('cloudinary')->delete($imagePath);
            }

            return response()->json(['message' => 'Canción eliminada con éxito.'], 200);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Ocurrió un error, canción no eliminada.',
                'error'   => $e->getMessage()
            ], 500);
        }
    }
}
