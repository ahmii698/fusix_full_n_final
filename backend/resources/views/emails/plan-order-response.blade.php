<!DOCTYPE html>
<html>
<head>
    <title>{{ $data['subject'] }}</title>
</head>
<body>
    <h2>Hello {{ $data['to_name'] }}!</h2>
    
    <p>Thank you for your order. Here are your order details:</p>
    
    <p><strong>Plan:</strong> {{ $data['plan_name'] }}</p>
    <p><strong>Price:</strong> {{ $data['price'] }}</p>
    
    <h3>Response from Admin:</h3>
    <p>{{ $data['response_message'] }}</p>
    
    <br>
    <p>Best regards,<br>{{ config('app.name') }} Team</p>
</body>
</html>