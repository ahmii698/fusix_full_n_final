<!DOCTYPE html>
<html>
<head>
    <title>New Appointment Booking</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            border: 1px solid #ddd;
            border-radius: 5px;
        }
        .header {
            background-color: #4CAF50;
            color: white;
            padding: 10px;
            text-align: center;
            border-radius: 5px 5px 0 0;
        }
        .content {
            padding: 20px;
        }
        .details {
            background-color: #f9f9f9;
            padding: 15px;
            border-left: 4px solid #4CAF50;
            margin: 15px 0;
        }
        .footer {
            text-align: center;
            padding: 10px;
            font-size: 12px;
            color: #777;
            border-top: 1px solid #ddd;
            margin-top: 20px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h2>New Appointment Booking</h2>
        </div>
        
        <div class="content">
            <p>Hello Admin,</p>
            <p>A new appointment has been booked. Here are the details:</p>
            
            <div class="details">
                <p><strong>Customer Name:</strong> {{ $appointment['full_name'] }}</p>
                <p><strong>Email:</strong> {{ $appointment['email'] }}</p>
                <p><strong>Phone:</strong> {{ $appointment['phone'] }}</p>
                <p><strong>Date:</strong> {{ $appointment['appointment_date'] }}</p>
                <p><strong>Time:</strong> {{ $appointment['appointment_time'] }}</p>
                @if(isset($appointment['message']) && $appointment['message'])
                <p><strong>Message:</strong> {{ $appointment['message'] }}</p>
                @endif
            </div>
            
            <p>Please review and confirm the appointment.</p>
        </div>
        
        <div class="footer">
            <p>This is an automated message. Please do not reply to this email.</p>
        </div>
    </div>
</body>
</html>