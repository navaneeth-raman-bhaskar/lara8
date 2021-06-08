<?php

namespace App\Http\Controllers;

use App\Models\Job;
use Illuminate\Http\Request;

class JobController extends Controller
{
    protected function index()
    {
        $jobs = Job::all();
        return view('job.index')->with(compact('jobs'));
    }

    protected function show(Request $request, Job $job)
    {
        $job->load('');
    }

    protected function apply()
    {

    }

    protected function applied()
    {

    }
}
