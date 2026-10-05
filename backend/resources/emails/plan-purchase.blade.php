<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>New Plan Purchase</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #4f46e5; color: white; padding: 20px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .plan-details { background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px; }
        .plan-name { font-size: 24px; font-weight: bold; color: #4f46e5; margin-bottom: 10px; }
        .price { font-size: 20px; color: #10b981; font-weight: 600; }
        .customer-info { background: white; padding: 20px; border-radius: 8px; }
        .info-row { display: flex; margin-bottom: 10px; border-bottom: 1px solid #eee; padding-bottom: 10px; }
        .label { width: 120px; font-weight: bold; color: #666; }
        .value { flex: 1; color: #333; }
        .message-box { background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin-top: 15px; }
        .footer { text-align: center; margin-top: 20px; color: #999; font-size: 12px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🚀 New Plan Purchase Request</h1>
        </div>
        
        <div class="content">
            <div class="plan-details">
                <div class="plan-name">{{ $purchase['plan_name'] }}</div>
                <div class="price">{{ $purchase['price'] }} / {{ $purchase['period'] }}</div>
            </div>

            <div class="customer-info">
                <h3>Customer Details</h3>
                
                <div class="info-row">
                    <span class="label">Name:</span>
                    <span class="value">{{ $purchase['customer_name'] }}</span>
                </div>

                <div class="info-row">
                    <span class="label">Email:</span>
                    <span class="value">{{ $purchase['customer_email'] }}</span>
                </div>

                @if($purchase['customer_phone'])
                <div class="info-row">
                    <span class="label">Phone:</span>
                    <span class="value">{{ $purchase['customer_phone'] }}</span>
                </div>
                @endif

                @if($purchase['message'])
                <div class="message-box">
                    <strong>Message:</strong>
                    <p>{{ $purchase['message'] }}</p>
                </div>
                @endif
            </div>
        </div>

        <div class="footer">
            <p>This email was sent from your website. Customer is waiting for your response.</p>
            <p>© {{ date('Y') }} Your Company. All rights reserved.</p>
        </div>
    </div>
</body>
</html>