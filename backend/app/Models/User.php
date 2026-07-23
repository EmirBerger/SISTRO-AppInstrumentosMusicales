<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Carbon;

class User extends Authenticatable
{
    use HasFactory, Notifiable, HasApiTokens;

    /**
     * El fillable ahora incluye tus campos y el 'rol' para los permisos.
     * Quitamos la propiedad $primaryKey para que use el 'id' estándar por defecto.
     *
     * @var array<int, string>
     */
    const MAX_HEARTS = 5;
    const MINUTES_PER_HEART = 10;

    protected $fillable = [
        'name',
        'last_name',
        'email',
        'password',
        'rol',
        'hearts',
        'hearts_updated_at',
        'plan',
    ];

    /**
     * Los atributos que se ocultan cuando mandás el JSON a React.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * El casteo de tipos nativo de Laravel 11.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at'   => 'datetime',
            'hearts_updated_at'   => 'datetime',
            'password'            => 'hashed',
        ];
    }

    public function regenerateHearts(): void
    {
        if ($this->hearts >= self::MAX_HEARTS || $this->plan !== 'free') {
            return;
        }

        $since = $this->hearts_updated_at ?? $this->created_at ?? Carbon::now();
        $minutesElapsed = (int) $since->diffInMinutes(Carbon::now());
        $heartsToAdd = (int) floor($minutesElapsed / self::MINUTES_PER_HEART);

        if ($heartsToAdd <= 0) {
            return;
        }

        $newHearts = min($this->hearts + $heartsToAdd, self::MAX_HEARTS);
        $minutesUsed = $heartsToAdd * self::MINUTES_PER_HEART;

        $this->hearts = $newHearts;
        $this->hearts_updated_at = $newHearts >= self::MAX_HEARTS
            ? null
            : $since->copy()->addMinutes($minutesUsed);
        $this->save();
    }

    /**
     * RELACIÓN: Un usuario tiene muchas lecciones completadas en su historial.
     * Conecta con la tabla intermedia del mapa estilo Duolingo.
     */
    public function progress(): HasMany
    {
        return $this->hasMany(UserProgress::class, 'user_id');
    }
}