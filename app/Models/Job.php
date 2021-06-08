<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Job extends Model
{
    use HasFactory;

    public function qualifications()
    {
        return $this->belongsToMany(Qualification::class);
    }

    public function skills()
    {
        return $this->belongsToMany(Skill::class);
    }

    public function location()
    {
        return $this->belongsTo(Location::class);
    }
}
