<?php

namespace App\Http\Controllers;

use App\Models\Instrument;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class InstrumentController extends Controller
{
    protected array $createValidationRules = [
        'name'              => 'required|unique:instruments,name',
        'icon'              => 'required|string',
        'image_description' => 'nullable',
        'is_active'         => 'boolean'
    ];

    protected array $validationRules = [
        'name'              => 'required',
        'icon'              => 'required|string',
        'image_description' => 'nullable',
        'is_active'         => 'boolean'
    ];

    protected array $validationMessages = [
        'name.required' => 'El nombre del instrumento es requerido.',
        'name.unique'   => 'El instrumento ya está cargado.',
        'icon.required' => 'El icono del instrumento es requerido.'
    ];

    public function getInstruments(Request $request): JsonResponse
    {
        $user = $request->user('sanctum');

        $query = Instrument::query();

        // El admin ve todos los instrumentos; el alumno solo los activos.
        if (!($user && $user->rol === 1)) {
            $query->where('is_active', true);
        }

        return response()->json([
            'status' => 'success',
            'data'   => $query->get()
        ], 200);
    }

    public function createInstrument(Request $request): JsonResponse
    {
        if ($request->user()->rol !== 1) {
            return response()->json(['message' => 'No autorizado.'], 403);
        }

        $request->validate($this->createValidationRules, $this->validationMessages);
        $input = $request->only('name', 'icon', 'image_description', 'is_active');

        try {
            Instrument::create($input);

            return response()->json(['message' => 'Instrumento agregado con éxito.'], 201);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Ocurrió un error, instrumento no agregado.',
                'error'   => $e->getMessage()
            ], 500);
        }
    }

    public function editInstrument(int $id, Request $request): JsonResponse
    {
        if ($request->user()->rol !== 1) {
            return response()->json(['message' => 'No autorizado.'], 403);
        }

        $request->validate($this->validationRules, $this->validationMessages);

        $instrument = Instrument::findOrFail($id);

        $input = $request->only('name', 'icon', 'image_description', 'is_active');

        try {
            $instrument->update($input);

            return response()->json(['message' => 'Instrumento editado con éxito.'], 200);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Ocurrió un error, instrumento no editado.',
                'error'   => $e->getMessage()
            ], 500);
        }
    }

    public function deleteInstrument(int $id, Request $request): JsonResponse
    {
        if ($request->user()->rol !== 1) {
            return response()->json(['message' => 'No autorizado.'], 403);
        }

        $instrument = Instrument::findOrFail($id);
        $imagePath  = $instrument->image;

        try {
            DB::beginTransaction();
            $instrument->delete();
            DB::commit();

            if ($imagePath && Storage::disk('cloudinary')->exists($imagePath)) {
                Storage::disk('cloudinary')->delete($imagePath);
            }

            return response()->json(['message' => 'Instrumento eliminado con éxito.'], 200);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Ocurrió un error, instrumento no eliminado.',
                'error'   => $e->getMessage()
            ], 500);
        }
    }
}
