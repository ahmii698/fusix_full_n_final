import React, { useState } from 'react';
import axios from 'axios';

interface EmailModalProps {
    isOpen: boolean;
    onClose: () => void;
    item: any;
    type: string;
    onSuccess?: () => void;
}

const EmailModal: React.FC<EmailModalProps> = ({ isOpen, onClose, item, type, onSuccess }) => {
    const [formData, setFormData] = useState({
        subject: '',
        response_message: '',
        status: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const token = localStorage.getItem('token');
            
            // Send email to customer
            const response = await axios.post(
                `/api/admin/appointments/${item.id}/send-email`,
                formData,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            if (response.data.success) {
                alert('✅ Email sent successfully to ' + item.email);
                if (onSuccess) onSuccess();
                onClose();
                setFormData({ subject: '', response_message: '', status: '' });
            }
        } catch (err: any) {
            console.error('Error sending email:', err);
            setError(err.response?.data?.message || 'Failed to send email. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
                <div className="flex justify-between items-center p-4 border-b">
                    <h2 className="text-xl font-bold text-gray-800">
                        Send Email to {item.full_name}
                    </h2>
                    <button 
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700 text-2xl"
                    >
                        ×
                    </button>
                </div>

                <div className="p-4 bg-gray-50 border-b">
                    <p className="text-sm text-gray-600">
                        <strong>Email:</strong> {item.email}
                    </p>
                    <p className="text-sm text-gray-600">
                        <strong>Phone:</strong> {item.phone}
                    </p>
                    <p className="text-sm text-gray-600">
                        <strong>Appointment:</strong> {item.appointment_date} at {item.appointment_time}
                    </p>
                </div>

                {error && (
                    <div className="mx-4 mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="p-4">
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Subject *
                        </label>
                        <input
                            type="text"
                            name="subject"
                            value={formData.subject}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                            placeholder="e.g., Appointment Confirmation"
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Message *
                        </label>
                        <textarea
                            name="response_message"
                            value={formData.response_message}
                            onChange={handleChange}
                            rows={6}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                            placeholder="Type your response here..."
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Update Status (Optional)
                        </label>
                        <select
                            name="status"
                            value={formData.status}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="">Keep Current Status</option>
                            <option value="confirmed">✅ Confirmed</option>
                            <option value="pending">⏳ Pending</option>
                            <option value="cancelled">❌ Cancelled</option>
                            <option value="completed">✔️ Completed</option>
                        </select>
                    </div>

                    <div className="flex justify-end gap-2 mt-6">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition"
                            disabled={loading}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition disabled:opacity-50"
                        >
                            {loading ? 'Sending...' : '📧 Send Email'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EmailModal;