import React, { useState } from 'react';

const SendReminderModal = ({ isOpen, onClose, tenant, onSendReminder }) => {
  const [reminderType, setReminderType] = useState('payment');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async () => {
    setIsLoading(true);
    try {
      await onSendReminder({
        tenantId: tenant.id,
        type: reminderType,
        message: message || getDefaultMessage(),
        sentAt: new Date().toISOString()
      });
      onClose();
    } catch (error) {
      console.error('Failed to send reminder:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getDefaultMessage = () => {
    switch (reminderType) {
      case 'payment':
        return `Dear ${tenant?.firstName} ${tenant?.lastName}, this is a friendly reminder that your rent payment is overdue. Please contact us to arrange payment.`;
      case 'lease':
        return `Dear ${tenant?.firstName} ${tenant?.lastName}, please review and sign your lease agreement at your earliest convenience.`;
      default:
        return `Dear ${tenant?.firstName} ${tenant?.lastName}, this is a reminder regarding your account.`;
    }
  };

  if (!isOpen || !tenant) return null;

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 50
    }}>
      <div style={{
        background: 'white',
        borderRadius: '8px',
        padding: '24px',
        width: '100%',
        maxWidth: '480px'
      }}>
        <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '16px' }}>
          Send Reminder
        </h2>
        
        <div style={{ marginBottom: '16px' }}>
          <p style={{ fontSize: '14px', color: '#64748b', marginBottom: '8px' }}>
            To: {tenant.firstName} {tenant.lastName}
          </p>
          <p style={{ fontSize: '14px', color: '#64748b' }}>
            Email: {tenant.email}
          </p>
        </div>

        <div style={{ marginBottom: '16px' }}>
          <label style={{ 
            display: 'block', 
            fontSize: '14px', 
            fontWeight: '500', 
            color: '#374151', 
            marginBottom: '8px' 
          }}>
            Reminder Type
          </label>
          <select
            value={reminderType}
            onChange={(e) => setReminderType(e.target.value)}
            style={{
              width: '100%',
              padding: '8px',
              border: '1px solid #d1d5db',
              borderRadius: '6px'
            }}
          >
            <option value="payment">Payment Reminder</option>
            <option value="lease">Lease Signing</option>
            <option value="general">General Reminder</option>
          </select>
        </div>

        <div style={{ marginBottom: '16px' }}>
          <label style={{ 
            display: 'block', 
            fontSize: '14px', 
            fontWeight: '500', 
            color: '#374151', 
            marginBottom: '8px' 
          }}>
            Custom Message (optional)
          </label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={getDefaultMessage()}
            style={{
              width: '100%',
              padding: '8px',
              border: '1px solid #d1d5db',
              borderRadius: '6px',
              height: '96px',
              resize: 'none'
            }}
          />
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
          <button
            onClick={onClose}
            disabled={isLoading}
            style={{
              padding: '8px 16px',
              color: '#64748b',
              border: '1px solid #d1d5db',
              borderRadius: '6px',
              background: 'white',
              cursor: 'pointer'
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleSend}
            disabled={isLoading}
            style={{
              padding: '8px 16px',
              background: '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              opacity: isLoading ? 0.5 : 1
            }}
          >
            {isLoading ? 'Sending...' : 'Send Reminder'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SendReminderModal;
