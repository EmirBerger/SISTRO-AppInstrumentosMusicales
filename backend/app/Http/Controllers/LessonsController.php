<?php

namespace App\Http\Controllers;

use App\Models\Lesson;
use App\Models\LessonBlock;
use App\Models\Instrument;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;

class LessonsController extends Controller
{
    protected array $validationRules = [
        'module_id'      => 'required|integer|exists:modules,module_id',
        'title'          => 'required|string|max:255',
        'theory_content' => 'nullable|string',
        'order'          => 'required|integer',
    ];

    protected array $validationMessages = [
        'module_id.required' => 'El ID del módulo es requerido.',
        'module_id.exists'   => 'El módulo seleccionado no existe.',
        'title.required'     => 'El título es requerido.',
        'order.required'     => 'El número de orden es requerido.',
    ];

    public function getInstrumentMap(int $id, Request $request): JsonResponse
    {
        $instrument = Instrument::where('instrument_id', $id)
            ->with(['modules.lessons'])
            ->first();

        if (!$instrument) {
            return response()->json([
                'status'  => 'error',
                'message' => 'El instrumento solicitado no existe en la base de datos.'
            ], 404);
        }

        $user = $request->user();
        if ($user && $user->plan === 'free') {
            $user->regenerateHearts();
        }
        $clasesCompletadas = $user ? $user->progress()->pluck('lesson_id')->toArray() : [];

        return response()->json([
            'status' => 'success',
            'data'   => [
                'instrument_id'     => $instrument->instrument_id,
                'name'              => $instrument->name,
                'user_hearts'       => $user ? $user->hearts : 5,
                'user_plan'         => $user ? $user->plan : 'free',
                'completed_lessons' => $clasesCompletadas,
                'map'               => $instrument->modules
            ]
        ], 200);
    }

    public function startLesson(int $id, Request $request): JsonResponse
    {
        $lesson = Lesson::with('blocks')->findOrFail($id);
        // $user = $request->user(); // HEARTS: desactivado temporalmente
        // if ($user->rol === 1) {
        //     return response()->json([
        //         'status'      => 'success',
        //         'message'     => 'Modo Administrador: Acceso concedido sin gastar energía.',
        //         'hearts_left' => 'Infinito',
        //         'data'        => $lesson
        //     ], 200);
        // }
        //
        // if ($user->plan === 'free') {
        //     $user->regenerateHearts();
        //
        //     if ($user->hearts <= 0) {
        //         return response()->json([
        //             'status'  => 'error',
        //             'message' => 'No tenés suficiente energía. ¡Esperá a que se recarguen tus vidas o pasate a Premium! 💔'
        //         ], 403);
        //     }
        //
        //     $newHearts = $user->hearts - 1;
        //     $user->hearts = $newHearts;
        //     $user->hearts_updated_at = now();
        //     $user->save();
        // }

        return response()->json([
            'status'      => 'success',
            'message'     => 'Clase iniciada correctamente.',
            'hearts_left' => null, // HEARTS: desactivado temporalmente
            'data'        => $lesson
        ], 200);
    }

    public function getLesson(int $id): JsonResponse
    {
        $lesson = Lesson::with('blocks')->findOrFail($id);

        return response()->json([
            'status' => 'success',
            'data'   => $lesson
        ], 200);
    }

    public function createLesson(Request $request): JsonResponse
    {
        if ($request->user()->rol !== 1) {
            return response()->json(['message' => 'No autorizado.'], 403);
        }

        $request->validate($this->validationRules, $this->validationMessages);
        $input = $request->only(['module_id', 'title', 'theory_content', 'order']);

        try {
            DB::beginTransaction();
            $lesson = Lesson::create($input);
            DB::commit();

            return response()->json(['message' => 'Clase agregada con éxito', 'lesson_id' => $lesson->lesson_id], 201);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Ocurrió un error, clase no agregada',
                'error'   => $e->getMessage()
            ], 500);
        }
    }

    public function editLesson(int $id, Request $request): JsonResponse
    {
        if ($request->user()->rol !== 1) {
            return response()->json(['message' => 'No autorizado.'], 403);
        }

        $request->validate($this->validationRules, $this->validationMessages);
        $lesson = Lesson::findOrFail($id);
        $input  = $request->only(['module_id', 'title', 'theory_content', 'order']);

        try {
            DB::beginTransaction();
            $lesson->update($input);
            DB::commit();

            return response()->json(['message' => 'Clase editada con éxito'], 200);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Ocurrió un error, clase no editada',
                'error'   => $e->getMessage()
            ], 500);
        }
    }

    public function saveBlocks(int $id, Request $request): JsonResponse
    {
        if ($request->user()->rol !== 1) {
            return response()->json(['message' => 'No autorizado.'], 403);
        }

        Lesson::findOrFail($id);

        $request->validate([
            'blocks'         => 'present|array',
            'blocks.*.type'  => 'required|string|in:text,image,tip,key_concepts',
            'blocks.*.content' => 'required',
            'blocks.*.order' => 'required|integer',
        ]);

        try {
            DB::beginTransaction();
            LessonBlock::where('lesson_id', $id)->delete();
            foreach ($request->blocks as $block) {
                LessonBlock::create([
                    'lesson_id' => $id,
                    'type'      => $block['type'],
                    'content'   => $block['content'],
                    'order'     => $block['order'],
                ]);
            }
            DB::commit();
            return response()->json(['message' => 'Bloques guardados con éxito'], 200);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => 'Error al guardar bloques', 'error' => $e->getMessage()], 500);
        }
    }

    public function deleteLesson(int $id, Request $request): JsonResponse
    {
        if ($request->user()->rol !== 1) {
            return response()->json(['message' => 'No autorizado.'], 403);
        }

        $lesson = Lesson::findOrFail($id);

        try {
            DB::beginTransaction();
            $lesson->delete();
            DB::commit();

            return response()->json(['message' => 'Clase eliminada con éxito'], 200);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Ocurrió un error, clase no eliminada',
                'error'   => $e->getMessage()
            ], 500);
        }
    }
}
