

import { useEffect, useState } from 'react';
import propertyService from '../services/propertyService';
import tenantService from '../services/tenantService';
import leaseService from '../services/leaseService';
import SendReminderModal from '../components/modals/SendReminderModal';
import RecordPaymentModal from '../components/modals/RecordPaymentModal';

const DashboardPage = ({ onNavigate }) => {
  // Only render the main dashboard grid layout (Collection Stats, Occupancy, Maintenance, Unsigned Leases, Applications Processing)
			const [properties, setProperties] = useState([]);
			const [tenants, setTenants] = useState([]);
			const [leases, setLeases] = useState([]);
			const [loading, setLoading] = useState(true);

			useEffect(() => {
				async function fetchData() {
					setLoading(true);
					const [props, tens, leas] = await Promise.all([
						propertyService.getAllProperties(),
						tenantService.getAllTenants(),
						leaseService.getAllLeases(),
					]);
					setProperties(props || []);
					setTenants(tens || []);
					setLeases(leas || []);
					setLoading(false);
				}
				fetchData();
			}, []);

			// Example calculations (replace with real logic as needed)
			const totalCollected = leases.reduce((sum, l) => sum + (l.totalPayments || 0), 0);
			const totalOverdue = leases.reduce((sum, l) => sum + (l.overdueAmount || 0), 0);
			const totalProcessing = leases.reduce((sum, l) => sum + (l.processingAmount || 0), 0);
			const totalComingDue = leases.reduce((sum, l) => sum + (l.comingDueAmount || 0), 0);
			const totalAmount = totalCollected + totalOverdue + totalProcessing + totalComingDue;
			const percentCollected = totalAmount ? (totalCollected / totalAmount) * 100 : 0;
			const percentOverdue = totalAmount ? (totalOverdue / totalAmount) * 100 : 0;
			const percentProcessing = totalAmount ? (totalProcessing / totalAmount) * 100 : 0;
			const percentComingDue = totalAmount ? (totalComingDue / totalAmount) * 100 : 0;

			// Occupancy
			const totalUnits = properties.reduce((sum, p) => sum + (p.unitDetails ? p.unitDetails.length : (p.units || 1)), 0);
			const occupiedUnits = leases.filter(l => (l.status || '').toLowerCase() === 'active').length;
			const vacantUnits = Math.max(0, totalUnits - occupiedUnits);
			const occupancyPercent = totalUnits ? Math.round((occupiedUnits / totalUnits) * 100) : 0;

			// Overdue units
			const unitsWithOverdue = leases.filter(l => (l.overdueAmount || 0) > 0).length;

		// Derived lists for UI
		const unsignedLeases = leases.filter(l => {
			const sigs = l.signatures;
			return !sigs || Object.keys(sigs || {}).length === 0;
		});

		const applicationsProcessing = tenants.filter(t => t.applicationStatus && t.applicationStatus !== 'No Applied Yet');

		// Modal states
		const [reminderModal, setReminderModal] = useState({ isOpen: false, tenant: null });
		const [paymentModal, setPaymentModal] = useState({ isOpen: false, tenant: null });			const handleAddTenant = () => {
				if (onNavigate) onNavigate('Tenants');
			};

		const handleRecordPayment = (tenant = null) => {
			setPaymentModal({ isOpen: true, tenant });
		};

		const handleViewOverdue = () => {
			if (onNavigate) onNavigate('Income');
		};

		const handleSignLease = (leaseId = null) => {
			if (onNavigate) {
				if (leaseId) {
					// Navigate with lease ID for direct editing
					onNavigate('LeasesFiles', { leaseId });
				} else {
					onNavigate('LeasesFiles');
				}
			}
		};

		const handleSendReminder = (tenant) => {
			setReminderModal({ isOpen: true, tenant });
		};

		const handleReminderSent = async (reminderData) => {
			try {
				await tenantService.addReminder(reminderData);
				setReminderModal({ isOpen: false, tenant: null });
				// Optionally show success message
			} catch (error) {
				console.error('Failed to send reminder:', error);
			}
		};

		const handlePaymentRecorded = async (paymentData) => {
			try {
				await tenantService.addTenantPayment(paymentData.tenantId, paymentData);
				setPaymentModal({ isOpen: false, tenant: null });
				// Refresh data after payment
				const [updatedProps, updatedTenants, updatedLeases] = await Promise.all([
					propertyService.getAllProperties(),
					tenantService.getAllTenants(),
					leaseService.getAllLeases(),
				]);
				setProperties(updatedProps || []);
				setTenants(updatedTenants || []);
				setLeases(updatedLeases || []);
			} catch (error) {
				console.error('Failed to record payment:', error);
				throw error;
			}
		};

		const handleTenantClick = (tenantId) => {
			if (onNavigate) onNavigate('Tenants', { selectedTenantId: tenantId });
		};

		const handleLeaseClick = (leaseId) => {
			if (onNavigate) onNavigate('LeasesFiles', { selectedLeaseId: leaseId });
		};			if (loading) {
				return (
					<div style={{ padding: 32, color: '#64748b' }}>Loading dashboard...</div>
				);
			}

			return (
				<div style={{ padding: 32 }}>
				{/* Top right action buttons */}
				<div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginBottom: 20 }}>
					<button
						onClick={handleRecordPayment}
						style={{
							background: '#f3f4f6',
							color: '#222',
							border: '1px solid #e5e7eb',
							borderRadius: '8px',
							padding: '10px 18px',
							fontSize: '15px',
							fontWeight: 500,
							cursor: 'pointer',
							marginRight: 4
						}}
					>
						🧾 Record Payment
					</button>
					<button
						onClick={handleAddTenant}
						style={{
							background: '#10b981',
							color: 'white',
							border: 'none',
							borderRadius: '8px',
							padding: '10px 18px',
							fontSize: '15px',
							fontWeight: 500,
							cursor: 'pointer',
							marginLeft: 4
						}}
					>
						👤 Add Tenant
					</button>
				</div>
				<div
					style={{
						display: 'grid',
						gridTemplateColumns: '2.5fr 1fr',
						gap: '24px',
						marginBottom: '32px',
						alignItems: 'start',
					}}
				>
				{/* Left: Collection Stats Card */}
						<div style={{
							background: 'white',
							borderRadius: '16px',
							boxShadow: '0 4px 16px 0 rgba(0,0,0,0.08)',
							border: '1px solid #e5e7eb',
							padding: '32px',
							minHeight: 320,
						}}>
							<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
								<div style={{ fontSize: 20, fontWeight: 600, color: '#222' }}>Collection Stats</div>
								<select style={{ border: '1px solid #e2e8f0', borderRadius: '6px', padding: '6px 12px', fontSize: '15px', background: 'white', color: '#334155' }}>
									<option>May 2023</option>
								</select>
							</div>
							<div style={{ display: 'flex', alignItems: 'center', gap: '32px', justifyContent: 'space-between' }}>
								{/* Donut Chart + Total */}
								<div style={{ position: 'relative', width: 180, height: 180, margin: '0 8px' }}>
									<svg width="180" height="180" style={{ transform: 'rotate(-90deg)' }}>
										<circle cx="90" cy="90" r="80" fill="none" stroke="#f3f4f6" strokeWidth="18" />
										<circle
											cx="90" cy="90" r="80" fill="none" stroke="#10b981" strokeWidth="18"
											strokeDasharray="502.65"
											strokeDashoffset={(502.65 * (1 - percentCollected / 100)).toFixed(2)}
											strokeLinecap="round"
										/>
									</svg>
									<div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center' }}>
										<div style={{ fontSize: '18px', color: '#10b981', fontWeight: 700 }}>Total</div>
										<div style={{ fontSize: '24px', color: '#10b981', fontWeight: 700 }}>${totalAmount.toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits:2})}</div>
									</div>
								</div>
								{/* Stat Columns */}
								<div style={{ display: 'flex', flex: 1, justifyContent: 'space-between', gap: 24 }}>
									<div style={{ minWidth: 120, textAlign: 'center' }}>
										<div style={{ fontSize: '15px', color: '#10b981', fontWeight: 700, marginBottom: 4 }}>Collected</div>
										<div style={{ fontSize: '22px', fontWeight: 700, color: '#10b981', marginBottom: 2 }}>${totalCollected.toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits:2})}</div>
										<div style={{ fontSize: '14px', color: '#10b981', fontWeight: 600 }}>{percentCollected.toFixed(1)}%</div>
									</div>
									<div style={{ minWidth: 120, textAlign: 'center' }}>
										<div style={{ fontSize: '15px', color: '#ef4444', fontWeight: 700, marginBottom: 4 }}>Overdue</div>
										<div style={{ fontSize: '22px', fontWeight: 700, color: '#ef4444', marginBottom: 2 }}>${totalOverdue.toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits:2})}</div>
										<div style={{ fontSize: '14px', color: '#ef4444', fontWeight: 600 }}>{percentOverdue.toFixed(1)}%</div>
									</div>
									<div style={{ minWidth: 120, textAlign: 'center' }}>
										<div style={{ fontSize: '15px', color: '#f59e42', fontWeight: 700, marginBottom: 4 }}>Processing</div>
										<div style={{ fontSize: '22px', fontWeight: 700, color: '#f59e42', marginBottom: 2 }}>${totalProcessing.toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits:2})}</div>
										<div style={{ fontSize: '14px', color: '#f59e42', fontWeight: 600 }}>{percentProcessing.toFixed(1)}%</div>
									</div>
									<div style={{ minWidth: 120, textAlign: 'center' }}>
										<div style={{ fontSize: '15px', color: '#0ea5e9', fontWeight: 700, marginBottom: 4 }}>Coming Due</div>
										<div style={{ fontSize: '22px', fontWeight: 700, color: '#0ea5e9', marginBottom: 2 }}>${totalComingDue.toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits:2})}</div>
										<div style={{ fontSize: '14px', color: '#0ea5e9', fontWeight: 600 }}>{percentComingDue.toFixed(1)}%</div>
									</div>
								</div>
								{/* Units with Overdue Balance */}
								<div style={{ minWidth: 120, textAlign: 'center', borderLeft: '1px solid #e5e7eb', paddingLeft: 24 }}>
									<div style={{ fontSize: 15, color: '#64748b', marginBottom: 8 }}>Units with Overdue Balance</div>
									<div style={{ fontSize: 22, fontWeight: 700, color: '#ef4444' }}>{unitsWithOverdue}/{leases.length}</div>
									<div onClick={handleViewOverdue} style={{ marginTop: 8, fontSize: 13, color: '#3b82f6', cursor: 'pointer' }}>View All</div>
								</div>
							</div>
							{/* Past Overdue Row */}
							<div style={{ marginTop: 24, background: '#f8fafc', borderRadius: 8, padding: '12px 20px', color: '#ef4444', fontWeight: 600, fontSize: 15 }}>
								Past Overdue: $0.00
							</div>
						</div>
				{/* Right: Occupancy and Maintenance stacked */}
				<div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
					{/* Occupancy Statistics */}
					<div style={{
						background: 'white',
						borderRadius: '12px',
						boxShadow: '0 2px 8px 0 rgba(0,0,0,0.04)',
						padding: '20px',
						display: 'flex',
						flexDirection: 'column',
						alignItems: 'center',
						minHeight: 120
					}}>
									<div style={{ fontSize: 15, color: '#64748b', marginBottom: 8 }}>Occupancy Statistics</div>
									<div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
										<div style={{ textAlign: 'center' }}>
											<div style={{ fontSize: 22, fontWeight: 700, color: '#ef4444' }}>{vacantUnits}</div>
											<div style={{ fontSize: 12, color: '#6b7280' }}>Vacant</div>
										</div>
										<div style={{ textAlign: 'center' }}>
											<div style={{ fontSize: 22, fontWeight: 700, color: '#10b981' }}>{occupiedUnits}</div>
											<div style={{ fontSize: 12, color: '#6b7280' }}>Occupied</div>
										</div>
										<div style={{ width: 48, height: 48, position: 'relative' }}>
											<svg width="48" height="48" style={{ transform: 'rotate(-90deg)' }}>
												<circle cx="24" cy="24" r="20" fill="none" stroke="#f3f4f6" strokeWidth="6" />
												<circle cx="24" cy="24" r="20" fill="none" stroke="#10b981" strokeWidth="6" strokeDasharray="125.66" strokeDashoffset={(125.66 * (1 - occupancyPercent / 100)).toFixed(2)} strokeLinecap="round" />
											</svg>
											<div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', fontSize: 11, fontWeight: 600, color: '#374151' }}>{occupancyPercent}</div>
										</div>
									</div>
					</div>
					{/* Open Maintenance Requests */}
					<div style={{
						background: 'white',
						borderRadius: '12px',
						boxShadow: '0 2px 8px 0 rgba(0,0,0,0.04)',
						padding: '20px',
						display: 'flex',
						flexDirection: 'column',
						alignItems: 'center',
						minHeight: 120
					}}>
						<div style={{ fontSize: 15, color: '#64748b', marginBottom: 8 }}>Open Maintenance Requests</div>
						<div style={{ fontSize: 22, color: '#10b981', fontWeight: 700 }}>1 Open</div>
						<div style={{ fontSize: 22, color: '#f59e42', fontWeight: 700 }}>1 Scheduled</div>
						<div style={{ fontSize: 14, color: '#9ca3af', marginTop: 8 }}>By Category</div>
						<div style={{ width: '100%', height: 40, background: '#f3f4f6', borderRadius: 6, marginTop: 4, display: 'flex', alignItems: 'flex-end', justifyContent: 'center', gap: 8 }}>
							<div style={{ width: 12, height: 20, background: '#10b981', borderRadius: 3 }}></div>
							<div style={{ width: 12, height: 10, background: '#f59e42', borderRadius: 3 }}></div>
							<div style={{ width: 12, height: 5, background: '#ef4444', borderRadius: 3 }}></div>
							<div style={{ width: 12, height: 0, background: '#0ea5e9', borderRadius: 3 }}></div>
						</div>
					</div>
				</div>
			</div>
					{/* Bottom Grid: Unsigned Leases & Applications Processing */}
					<div style={{
						display: 'grid',
						gridTemplateColumns: '1fr 1fr',
						gap: '24px',
						marginBottom: '32px',
					}}>
						{/* Unsigned Leases */}
						<div style={{
							background: 'white',
							borderRadius: '12px',
							boxShadow: '0 2px 8px 0 rgba(0,0,0,0.04)',
							padding: '24px',
							display: 'flex',
							flexDirection: 'column',
							minHeight: 120
						}}>
							<div style={{ fontSize: 18, fontWeight: 600, color: '#374151', marginBottom: 16 }}>📄 UNSIGNED LEASES</div>
							{unsignedLeases.length === 0 && (
								<div style={{ color: '#64748b', fontSize: 13 }}>No unsigned leases</div>
							)}
							{unsignedLeases.slice(0, 4).map((lease) => (
								<div key={lease.id} style={{
									display: 'flex',
									alignItems: 'center',
									justifyContent: 'space-between',
									width: '100%',
									padding: '12px 0',
									borderBottom: '1px solid #f3f4f6',
									gap: 12
								}}>
									<div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
										<span style={{ fontSize: 24, color: '#60a5fa' }}>🏠</span>
										<div>
											<div 
												onClick={() => handleLeaseClick(lease.id)}
												style={{ fontWeight: 600, color: '#3b82f6', fontSize: 15, cursor: 'pointer' }}
											>
												{lease.property?.name || lease.unit?.unitNumber || 'Unknown Property'}
											</div>
											<div style={{ fontSize: 13, color: '#64748b' }}>
												{lease.signatures && Object.keys(lease.signatures || {}).length || 0}/{lease.tenants?.length || 1} tenants signed.
											</div>
										</div>
									</div>
									<div style={{ display: 'flex', gap: 8 }}>
										<button 
											onClick={() => handleSendReminder(lease.tenant)} 
											style={{ background: '#f3f4f6', color: '#222', border: '1px solid #e5e7eb', borderRadius: 6, padding: '6px 12px', fontSize: 13, fontWeight: 500, cursor: 'pointer' }}
										>
											Send Reminder
										</button>
										<button 
											onClick={() => handleSignLease(lease.id)} 
											style={{ background: '#10b981', color: 'white', border: 'none', borderRadius: 6, padding: '6px 12px', fontSize: 13, fontWeight: 500, cursor: 'pointer' }}
										>
											Sign Lease
										</button>
									</div>
								</div>
							))}
						</div>
						{/* Applications Processing */}
						<div style={{
							background: 'white',
							borderRadius: '12px',
							boxShadow: '0 2px 8px 0 rgba(0,0,0,0.04)',
							padding: '24px',
							display: 'flex',
							flexDirection: 'column',
							minHeight: 120
						}}>
							<div style={{ fontSize: 18, fontWeight: 600, color: '#374151', marginBottom: 16 }}>📋 APPLICATIONS PROCESSING</div>
							{applicationsProcessing.length === 0 && (
								<div style={{ color: '#64748b', fontSize: 13 }}>No applications in process</div>
							)}
							{applicationsProcessing.slice(0, 6).map((app) => (
								<div key={app.id} style={{ padding: '10px 0', borderBottom: '1px solid #f3f4f6', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
									<div style={{ flex: 1 }}>
										<div 
											style={{ fontWeight: 600, color: '#3b82f6', fontSize: 15, cursor: 'pointer' }} 
											onClick={() => handleTenantClick(app.id)}
										>
											{app.firstName} {app.lastName}
										</div>
										<div style={{ fontSize: 13, color: '#64748b' }}>
											{app.applicationDate || app.appliedOn || 'Applied recently'}
										</div>
									</div>
									<div style={{ display: 'flex', gap: 8 }}>
										<button 
											onClick={() => handleSendReminder(app)} 
											style={{ background: '#f59e0b', color: 'white', border: 'none', borderRadius: 4, padding: '4px 8px', fontSize: 12, fontWeight: 500, cursor: 'pointer' }}
										>
											Follow Up
										</button>
									</div>
								</div>
							))}
						</div>
					</div>

			{/* Modals */}
			<SendReminderModal
				isOpen={reminderModal.isOpen}
				onClose={() => setReminderModal({ isOpen: false, tenant: null })}
				tenant={reminderModal.tenant}
				onSendReminder={handleReminderSent}
			/>

			<RecordPaymentModal
				isOpen={paymentModal.isOpen}
				onClose={() => setPaymentModal({ isOpen: false, tenant: null })}
				tenant={paymentModal.tenant}
				onPaymentRecorded={handlePaymentRecorded}
			/>
		</div>
	);
};

export default DashboardPage;
