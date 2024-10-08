<?php

use App\Controllers\AuthController;
use App\Middlewares\AuthMiddleware;


$authController = new AuthController();

$router->post('/auth/register', function () use ($authController) {
    echo $authController->register();
});

$router->post('/auth/resend-otp', function () use ($authController) {
    echo $authController->resendOtp();
});
$router->get('/auth/orders', function () use ($authController) {
    echo $authController->getOrders();
})->addMiddleware(new AuthMiddleware());
$router->post('/auth/verify-otp', function () use ($authController) {
    echo $authController->verifyOtp();
});

$router->post('/auth/login', function () use ($authController) {
    echo $authController->login();
});

$router->post('/auth/refresh', function () use ($authController) {
    echo $authController->refresh();
});

$router->post('/auth/reset-password', function () use ($authController) {
    echo $authController->resetPassword();
});

$router->post('/auth/logout', function () use ($authController) {
    echo $authController->logout();
});

$router->patch('/auth/profile', function () use ($authController) {
    echo $authController->updateProfile();
})->addMiddleware(new AuthMiddleware());

$router->patch('/auth/password', function () use ($authController) {
    echo $authController->changePassword();
})->addMiddleware(new AuthMiddleware(false, true));

$router->patch('/users/address', function () use ($authController) {
    echo $authController->updateAddress();
})->addMiddleware(new AuthMiddleware());
$router->get('/users/current-address', function () use ($authController) {
    echo $authController->getAddress();
})->addMiddleware(new AuthMiddleware());
