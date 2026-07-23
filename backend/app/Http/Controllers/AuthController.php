<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    protected array $loginRules = [
        'email' => 'required|email',
        'password' => 'required',
    ];

    protected array $registerRules = [
        'name' => 'required|string|max:255',
        'last_name' => 'required|string|max:255',
        'email' => 'required|string|email|max:255|unique:users',
        'password' => 'required|string|min:6',
    ];

    protected array $validationMessages = [
        'name.required'      => 'El nombre es requerido.',
        'last_name.required' => 'El apellido es requerido.',
        'email.required'     => 'El correo electrónico es requerido.',
        'email.email'        => 'Debe ingresar un formato de correo válido.',
        'email.unique'       => 'Este correo electrónico ya está registrado.',
        'password.required'  => 'La contraseña es requerida.',
        'password.min'       => 'La contraseña debe tener al menos 6 caracteres.',
    ];

    public function register(Request $request): JsonResponse
    {
        $request->validate($this->registerRules, $this->validationMessages);

        $user = User::create([
            'name' => $request->name,
            'last_name' => $request->last_name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'rol' => 0,
        ]);

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'message' => 'Usuario registrado con éxito', 
            'data'=> $user, 
            'access_token' => $token, 
            'token_type' => 'Bearer'
        ], 201,);
    }

    public function login(Request $request)
    {
        $request->validate($this->loginRules, $this->validationMessages);
        $credentials = $request->only(['email', 'password']);

        if(!Auth::attempt($credentials)){
            return response()->json([
                'message' => 'El correo electrónico o la contraseña son incorrectos.'
            ], 401);
        }

        $user = User::where('email', $request->email)->firstOrFail();
        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'message' => 'Sesión Iniciada con éxito',
            'user'=> $user, 
            'access_token' => $token, 
            'token_type' => 'Bearer'
        ], 200);
    
    }
    
    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();
        return response()->json([
            'message' => 'Sesión cerrada correctamente'
        ], 200);
    }

    public function me(Request $request): JsonResponse
    {
        $user = $request->user();
        $user->regenerateHearts();
        return response()->json(['user' => $user], 200);
    }
}
