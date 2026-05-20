/**
 * Email Service for Salley's Jar
 * Sends professional order notifications to seller via EmailJS
 */

export async function sendOrderNotificationEmail(orderData) {
    try {
        const formData = new FormData();

        // EmailJS required parameters
        const serviceId = process.env.SERVICE_ID;
        const templateId = process.env.TEMPLATE_ID;
        const publicKey = process.env.PUBLIC_KEY;
        const privateKey = process.env.PRIVATE_KEY;
        const sellerEmail = process.env.SELLER_EMAIL;

        // Validate credentials exist
        if (!serviceId || !templateId || !publicKey || !sellerEmail) {
            throw new Error('Missing required EmailJS configuration in .env');
        }

        formData.append('service_id', serviceId);
        formData.append('template_id', templateId);
        formData.append('user_id', publicKey);
        if (privateKey) {
            formData.append('accessToken', privateKey);
        }

        // Format delivery date properly
        const deliveryDate = orderData.deliveryDate
            ? new Date(orderData.deliveryDate).toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            })
            : 'Not specified';

        // Seller-focused template variables
        formData.append('to_email', sellerEmail);
        formData.append('order_id', orderData.id || 'N/A');
        formData.append('order_date', new Date(orderData.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }));
        formData.append('order_time', new Date(orderData.createdAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }));

        // Customer Information
        formData.append('customer_name', orderData.buyer?.fullName || 'Customer');
        formData.append('customer_email', orderData.buyer?.email || 'N/A');
        formData.append('customer_phone', orderData.buyer?.phone || 'N/A');

        // Delivery Information
        formData.append('delivery_mode', orderData.deliveryMode === 'delivery' ? 'Delivery' : 'Pickup');
        formData.append('delivery_address', orderData.buyer?.address || 'Pickup Location');
        formData.append('delivery_city', orderData.buyer?.city || 'N/A');
        formData.append('delivery_date', deliveryDate);
        formData.append('delivery_time', orderData.deliveryTime || 'Not specified');

        // Format items as simple text - works better with EmailJS
        let itemsHTML = '<table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;"><thead><tr style="background-color: #f9f9f9; border-bottom: 2px solid #E7E5E4;"><th style="padding: 12px; text-align: left; font-weight: 600; font-size: 13px; color: #1C1917; text-transform: uppercase;">Item</th><th style="padding: 12px; text-align: center; font-weight: 600; font-size: 13px; color: #1C1917; text-transform: uppercase;">Qty</th><th style="padding: 12px; text-align: right; font-weight: 600; font-size: 13px; color: #1C1917; text-transform: uppercase;">Unit Price</th><th style="padding: 12px; text-align: right; font-weight: 600; font-size: 13px; color: #1C1917; text-transform: uppercase;">Total</th></tr></thead><tbody>';

        if (orderData.items && orderData.items.length > 0) {
            orderData.items.forEach((item) => {
                const itemTotal = item.price * item.quantity;
                itemsHTML += `<tr style="border-bottom: 1px solid #f0f0f0;"><td style="padding: 12px; text-align: left; font-size: 13px; color: #333;">${item.name}</td><td style="padding: 12px; text-align: center; font-size: 13px; color: #333;">${item.quantity}</td><td style="padding: 12px; text-align: right; font-size: 13px; color: #333;">₦${item.price?.toLocaleString() || 0}</td><td style="padding: 12px; text-align: right; font-size: 13px; color: #333; font-weight: 600;">₦${itemTotal?.toLocaleString() || 0}</td></tr>`;
            });
        } else {
            itemsHTML += '<tr><td colspan="4" style="padding: 12px; text-align: center; color: #999;">No items</td></tr>';
        }
        itemsHTML += '</tbody></table>';

        formData.append('items_table_html', itemsHTML);

        // Order Summary
        formData.append('subtotal', `₦${orderData.subtotal?.toLocaleString() || 0}`);
        formData.append('delivery_fee', orderData.deliveryMode === 'delivery'
            ? `₦${orderData.deliveryFee?.toLocaleString() || 0}`
            : '₦0 (Pickup)');
        formData.append('total', `₦${orderData.total?.toLocaleString() || 0}`);

        // Payment Information
        formData.append('payment_method', (orderData.paymentMethod || 'Not specified').charAt(0).toUpperCase() + (orderData.paymentMethod || 'not specified').slice(1));
        formData.append('special_notes', orderData.notes || 'No special notes');

        console.log('📧 Sending order notification to:', sellerEmail, '| Order:', orderData.id);

        // Send email via EmailJS API
        const response = await fetch('https://api.emailjs.com/api/v1.0/email/send-form', {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) {
            const error = await response.text();
            console.error('EmailJS error response:', error);
            throw new Error(`EmailJS failed: ${response.status} - ${error}`);
        }

        console.log(`✅ Order notification email sent successfully for order ${orderData.id}`);
        return { success: true, message: 'Email sent to seller' };
    } catch (error) {
        // Log error but don't block order creation
        console.error('❌ Failed to send order notification email:', error.message);
        return { success: false, error: error.message };
    }
}
