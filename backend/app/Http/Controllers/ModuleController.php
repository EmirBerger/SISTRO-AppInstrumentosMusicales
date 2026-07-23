<?php

namespace App\Http\Controllers;

use App\Models\Module;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;

class ModuleController extends Controller
{
    protected array $validationRules = [
        'instrument_id' => 'required|integer|exists:instruments,instrument_id',
        'title'         => 'required|string|max:255',
        'order'         => 'required|integer',
    ];

    protected array $validationMessages = [
        'instrument_id.required' => 'El ID del instrumento es requerido.',
        'instrument_id.exists'   => 'El instrumento seleccionado no existe.',
        'title.required'         => 'El título es requerido.',
        'order.required'         => 'El número de orden es requerido.',
    ];

    public function createModule(Request $request): JsonResponse
    {
        if ($request->user()->rol !== 1) {
            return response()->json(['message' => 'No autorizado.'], 403);
        }

        $request->validate($this->validationRules, $this->validationMessages);
        $input = $request->only(['instrument_id', 'title', 'order']);

        try {
            DB::beginTransaction();
            Module::create($input);
            DB::commit();

            return response()->json(['message' => 'Módulo creado con éxito'], 201);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Ocurrió un error, módulo no creado',
                'error'   => $e->getMessage()
            ], 500);
        }
    }

    public function editModule(int $id, Request $request): JsonResponse
    {
        if ($request->user()->rol !== 1) {
            return response()->json(['message' => 'No autorizado.'], 403);
        }

        $request->validate($this->validationRules, $this->validationMessages);
        $module = Module::findOrFail($id);
        $input  = $request->only(['instrument_id', 'title', 'order']);

        try {
            DB::beginTransaction();
            $module->update($input);
            DB::commit();

            return response()->json(['message' => 'Módulo editado con éxito'], 200);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Ocurrió un error, módulo no editado',
                'error'   => $e->getMessage()
            ], 500);
        }
    }

    public function deleteModule(int $id, Request $request): JsonResponse
    {
        if ($request->user()->rol !== 1) {
            return response()->json(['message' => 'No autorizado.'], 403);
        }

        $module = Module::findOrFail($id);

        try {
            DB::beginTransaction();
            $module->delete();
            DB::commit();

            return response()->json(['message' => 'Módulo eliminado con éxito'], 200);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Ocurrió un error, módulo no eliminado',
                'error'   => $e->getMessage()
            ], 500);
        }
    }
}
