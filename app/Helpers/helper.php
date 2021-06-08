<?php

function jsonResponse($message, $data, $code)
{
    $title = '';
    if (is_array($message)) {
        $title = $message[1];
        $message = $message[0];
    }
    $response = [
        'title' => $title,
        'message' => $message,
        'data' => $data,
    ];

    return response()->json($response, $code);
}

function successResponse($message = 'Successfully Submitted', $data = [], $code = 200)
{
    return jsonResponse($message, $data, $code);
}

function errorResponse($message = 'Error while processing data', $data = [], $code = 400)
{
    return jsonResponse($message, $data, $code);
}


