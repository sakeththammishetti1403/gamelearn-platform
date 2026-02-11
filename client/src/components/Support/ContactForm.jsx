import React, { useState } from 'react';
import axios from 'axios';
import { API_URL } from '../../services/api';

const ContactForm = ({ onBack, initialSubject = 'General Inquiry', initialMessage = '' }) => {
    const [formData, setFormData] = useState({
        email: '',
        subject: initialSubject,
        message: initialMessage
    });
    const [status, setStatus] = useState('idle'); // idle, sending, success, error

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus('sending');
        try {
            await axios.post(`${API_URL}/support/email`, formData);
            setStatus('success');
        } catch (err) {
            console.error(err);
            setStatus('error');
        }
    };

    return (
        <div style={{ padding: '0 20px', height: '100%', display: 'flex', flexDirection: 'column' }}>
            <div style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '16px' }}>
                <button
                    onClick={onBack}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '24px', color: '#2E3A59' }}
                >
                    ←
                </button>
                <h2 style={{ margin: 0, fontSize: '24px', color: '#2E3A59' }}>Email Support</h2>
            </div>

            {status === 'success' ? (
                <div style={{ textAlign: 'center', padding: '40px 20px' }}>
                    <div style={{ fontSize: '48px', marginBottom: '16px' }}>✅</div>
                    <h3 style={{ color: '#2E3A59', marginBottom: '8px' }}>Message Sent!</h3>
                    <p style={{ color: '#7A859E' }}>We have received your ticket and will get back to you shortly.</p>
                    <button
                        onClick={onBack}
                        style={{ marginTop: '24px', padding: '12px 24px', backgroundColor: '#4F7DF3', color: 'white', border: 'none', borderRadius: '12px', cursor: 'pointer' }}
                    >
                        Back to Menu
                    </button>
                </div>
            ) : (
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div>
                        <label style={{ display: 'block', color: '#2E3A59', marginBottom: '8px', fontWeight: '600' }}>Email Address</label>
                        <input
                            type="email"
                            required
                            style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid #E5E9F2', fontSize: '14px' }}
                            placeholder="your@email.com"
                            value={formData.email}
                            onChange={e => setFormData({ ...formData, email: e.target.value })}
                        />
                    </div>
                    <div>
                        <label style={{ display: 'block', color: '#2E3A59', marginBottom: '8px', fontWeight: '600' }}>Subject</label>
                        <select
                            style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid #E5E9F2', fontSize: '14px' }}
                            value={formData.subject}
                            onChange={e => setFormData({ ...formData, subject: e.target.value })}
                        >
                            <option>General Inquiry</option>
                            <option>Technical Issue</option>
                            <option>Course Content</option>
                            <option>Account Help</option>
                        </select>
                    </div>
                    <div>
                        <label style={{ display: 'block', color: '#2E3A59', marginBottom: '8px', fontWeight: '600' }}>Message</label>
                        <textarea
                            required
                            rows="5"
                            style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid #E5E9F2', fontSize: '14px', resize: 'none' }}
                            placeholder="Describe your issue..."
                            value={formData.message}
                            onChange={e => setFormData({ ...formData, message: e.target.value })}
                        />
                    </div>

                    {status === 'error' && <p style={{ color: '#FF5252', fontSize: '14px' }}>Failed to send message. Please try again.</p>}

                    <button
                        type="submit"
                        disabled={status === 'sending'}
                        style={{
                            padding: '16px',
                            backgroundColor: '#4F7DF3',
                            color: 'white',
                            border: 'none',
                            borderRadius: '16px',
                            fontWeight: '700',
                            cursor: status === 'sending' ? 'not-allowed' : 'pointer',
                            opacity: status === 'sending' ? 0.7 : 1
                        }}
                    >
                        {status === 'sending' ? 'Sending...' : 'Send Message'}
                    </button>
                </form>
            )}
        </div>
    );
};

export default ContactForm;
