<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('customer_wares', function (Blueprint $table) {
            $table->string('category_id')->nullable();
            $table->string('subcategory_id');
            $table->string('perceived_weight')->nullable();


        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('customer_wares');
    }
};
