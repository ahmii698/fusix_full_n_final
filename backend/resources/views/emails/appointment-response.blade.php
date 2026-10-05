<!DOCTYPE html>
<html>
<head>
    <title>{{ $data['subject'] }}</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #4CAF50; color: white; padding: 10px; text-align: center; }
        .content { padding: 20px; background: #f9f9f9; }
        .details { background: white; padding: 15px; margin: 15px 0; border-left: 4px solid #4CAF50; }
        .footer { text-align: center; padding: 10px; font-size: 12px; color: #777; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h2>Appointment Update</h2>
        </div>
        
        <div class="content">
            <h3>Hello {{ $data['to_name'] }},</h3>
            
            <p>Thank you for booking an appointment with us. Here's the update regarding your appointment:</p>
            
            <div class="details">
                <p><strong>Appointment Date:</strong> {{ $data['appointment_date'] }}</p>
                <p><strong>Appointment Time:</strong> {{ $data['appointment_time'] }}</p>
                <p><strong>Status:</strong> {{ ucfirst($data['status']) }}</p>
            </div>
            
            <h4>Admin Response:</h4>
            <p>{{ $data['message_body'] }}</p>
            
            <p>If you have any questions, please feel free to contact us.</p>
        </div>
        
        <div class="footer">
            <p>Best regards,<br>{{ config('app.name') }} Team</p>
        </div>
    </div>
</body>
</html>