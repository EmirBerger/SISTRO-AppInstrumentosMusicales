<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('lesson_blocks', function (Blueprint $table) {
            $table->bigIncrements('block_id');
            $table->foreignId('lesson_id')->constrained('lessons', 'lesson_id')->onDelete('cascade');
            $table->string('type'); // text | image | tip | key_concepts
            $table->json('content');
            $table->integer('order');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('lesson_blocks');
    }
};
