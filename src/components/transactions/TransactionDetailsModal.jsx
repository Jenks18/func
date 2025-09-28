import React from 'react';
import { format } from 'date-fns';
import { Dialog } from '../ui/dialog';
import { Badge } from '../ui/badge';
import { ScrollArea } from '../ui/scroll-area';

const TransactionDetailsModal = ({ transaction, isOpen, onClose }) => {
  if (!transaction) return null;

  const formatDate = (dateString) => {
    return format(new Date(dateString), 'MMM dd, yyyy HH:mm:ss');
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <Dialog.Content className="sm:max-w-[600px]">
        <Dialog.Header>
          <Dialog.Title>Transaction Details</Dialog.Title>
          <Dialog.Description>
            Transaction ID: {transaction.id}
          </Dialog.Description>
        </Dialog.Header>

        <div className="space-y-6 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="text-sm font-medium text-gray-500">Amount</h4>
              <p className="mt-1 text-sm font-semibold">
                {formatCurrency(transaction.amount)}
              </p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-500">Status</h4>
              <Badge 
                variant={transaction.status === 'completed' ? 'success' : 
                        transaction.status === 'pending' ? 'warning' : 'destructive'}
                className="mt-1"
              >
                {transaction.status.toUpperCase()}
              </Badge>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-500">Date</h4>
              <p className="mt-1 text-sm">{formatDate(transaction.date)}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-500">Payment Method</h4>
              <p className="mt-1 text-sm">{transaction.paymentMethod?.toUpperCase() || 'N/A'}</p>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-medium text-gray-500">Description</h4>
            <p className="mt-1 text-sm">{transaction.description || 'No description provided'}</p>
          </div>

          <div>
            <h4 className="text-sm font-medium text-gray-500">References</h4>
            <div className="mt-1 space-y-1">
              {transaction.propertyId && (
                <p className="text-sm">Property ID: {transaction.propertyId}</p>
              )}
              {transaction.tenantId && (
                <p className="text-sm">Tenant ID: {transaction.tenantId}</p>
              )}
              {transaction.leaseId && (
                <p className="text-sm">Lease ID: {transaction.leaseId}</p>
              )}
            </div>
          </div>

          <div>
            <h4 className="text-sm font-medium text-gray-500">Audit Trail</h4>
            <ScrollArea className="h-[200px] mt-2 rounded-md border p-4">
              {transaction.auditTrail?.map((entry, index) => (
                <div key={index} className="mb-3 last:mb-0">
                  <p className="text-sm font-medium">{entry.action}</p>
                  <p className="text-xs text-gray-500">
                    {formatDate(entry.timestamp)} by {entry.userId}
                  </p>
                </div>
              ))}
            </ScrollArea>
          </div>
        </div>

        <Dialog.Footer>
          <Dialog.Close>Close</Dialog.Close>
        </Dialog.Footer>
      </Dialog.Content>
    </Dialog>
  );
};

export default TransactionDetailsModal;
