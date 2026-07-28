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
        'image'             => 'required|image|mimes:jpeg,png,jpg|max:2048',
        'image_description' => 'required',
        'is_active'         => 'boolean'
    ];

    protected array $validationRules = [
        'name'              => 'required',
        'image'             => 'nullable|image|mimes:jpeg,png,jpg|max:2048',
        'image_description' => 'required',
        'is_active'         => 'boolean'
    ];

    protected array $validationMessages = [
        'name.required'              => 'El nombre del instrumento es requerido.',
        'name.unique'                => 'El instrumento ya está cargado.',
        'image.required'             => 'La imagen del instrumento es requerida.',
        'image.image'                => 'El archivo debe ser una imagen válida.',
        'image_description.required' => 'La descripción es requerida.'
    ];

    public function getInstruments(): JsonResponse
    {
        $instruments = Instrument::all();

        return response()->json([
            'status' => 'success',
            'data'   => $instruments
        ], 200);
    }

    public function createInstrument(Request $request): JsonResponse
    {
        if ($request->user()->rol !== 1) {
            return response()->json(['message' => 'No autorizado.'], 403);
        }

        $request->validate($this->createValidationRules, $this->validationMessages);
        $input = $request->except('image');

        try {
            DB::beginTransaction();

            if ($request->hasFile('image')) {
                $input['image'] = $request->file('image')->store('sistroFiles/imageInstrument', 'cloudinary');
            }

            Instrument::create($input);

            DB::commit();
            return response()->json(['message' => 'Instrumento agregado con éxito.'], 201);

        } catch (\Exception $e) {
            DB::rollBack();
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

        $input    = $request->only('name', 'image_description', 'is_active');
        $oldImage = $instrument->image;

        try {
            DB::beginTransaction();

            if ($request->hasFile('image')) {
                $input['image'] = $request->file('image')->store('sistroFiles/imageInstrument', 'cloudinary');
            }

            $instrument->update($input);

            DB::commit();

            if ($request->hasFile('image') && $oldImage) {
                Storage::disk('cloudinary')->delete($oldImage);
            }

            return response()->json(['message' => 'Instrumento editado con éxito.'], 200);

        } catch (\Exception $e) {
            DB::rollBack();
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
