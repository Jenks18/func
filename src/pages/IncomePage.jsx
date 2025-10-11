import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Filter, Layers } from 'lucide-react';

const StatusBadge = ({ status }) => {
  const map = {
    'Fully Paid': 'badge badge-success',
    'Overdue': 'badge badge-danger',
    'Partially Paid': 'badge badge-warning',
  };
  return <span className={map[status] || 'badge badge-info'}>{status}</span>;
};

export default function IncomePage() {
  const [filterDate, setFilterDate] = useState('Month (Include: Due On)');
  const [groupBy, setGroupBy] = useState('Property');
  const [expandedProperties, setExpandedProperties] = useState({
    'Main Street Lofts': true,
    'Main Street Lofts 2': true,
  });

  const toggleProperty = (property) => {
    setExpandedProperties(prev => ({ ...prev, [property]: !prev[property] }));
  };

  const incomeData = {
    'Main Street Lofts': [
      { id: 3792537, tenant: 'Robert Smith', dueOn: 'May 15, 2023', paidOn: 'May 10, 2023', status: 'Fully Paid', unit: '101', amount: '$750.00', processing: '$0.00', paid: '$750.00', balance: '$0.00' },
      { id: 3792536, tenant: 'Robert Smith', dueOn: 'May 15, 2023', paidOn: 'May 15, 2023', status: 'Fully Paid', unit: '101', amount: '$1,500.00', processing: '$0.00', paid: '$1,500.00', balance: '$0.00' },
    ],
    'Main Street Lofts 2': [
      { id: 3792572, tenant: 'Horatio Jones, Crai...', dueOn: 'May 01, 2023', paidOn: 'May 01, 2023', status: 'Overdue', unit: '301', amount: '$2,050.00', processing: '$0.00', paid: '$1,000.00', balance: '$1,050.00' },
    ],
  };

  const propertyDetails = {
    'Main Street Lofts': '(May 15, 2023 - M to M)',
    'Main Street Lofts 2': '(Apr 01, 2023 - Jun 30, 2024)',
  };

  const totalGroups = Object.keys(incomeData).length;
  const expandedCount = Object.values(expandedProperties).filter(Boolean).length;
  const isOverdue = (inv) => inv.status === 'Overdue';

  const [selectedInvoice, setSelectedInvoice] = useState(incomeData['Main Street Lofts'][1]);

  return (
    <div className="h-full w-full flex flex-col p-4" style={{background:'linear-gradient(180deg,#f8fafc,#eef2f7)'}}>
      <div className="flex items-center justify-between mb-3">
        <h1 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
          <span style={{display:'inline-block',width:6,height:24,background:'var(--brand-primary)',borderRadius:4}} />
          Income
        </h1>
        <div className="flex items-center gap-3">
          <button className="btn">
            Export
          </button>
          <button className="btn btn-primary shadow-sm">
            New Invoice
          </button>
        </div>
      </div>

      <div className="flex gap-5 flex-1 overflow-hidden">
        <div className="flex-1 flex flex-col card overflow-hidden" style={{borderRadius:'0.9rem'}}>
          <div className="flex items-center justify-between px-4 py-3 border-b" style={{background:'#ffffffcc',backdropFilter:'blur(6px) saturate(1.2)'}}>
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Filter size={14} className="text-gray-500" />
                <span className="font-medium">Filter</span>
                <select value={filterDate} onChange={(e)=>setFilterDate(e.target.value)} className="text-sm border px-2 py-1 rounded-md focus:outline-none" style={{background:'#fff'}}>
                  <option>Month (Include: Due On)</option>
                </select>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Layers size={14} className="text-gray-500" />
                <span className="font-medium">Grouped by</span>
                <select value={groupBy} onChange={(e)=>setGroupBy(e.target.value)} className="text-sm border px-2 py-1 rounded-md focus:outline-none" style={{background:'#fff'}}>
                  <option>Property</option>
                </select>
              </div>
            </div>
            <div className="text-xs font-medium text-gray-500 tracking-wide">
              SHOWING {expandedCount} / {totalGroups}
            </div>
          </div>

          <div className="grid grid-cols-10 gap-4 px-4 py-2 table-header text-[11px] uppercase tracking-wide" style={{fontWeight:600}}>
            <div className="col-span-2">Property / Shared By</div>
            <div>Due On</div>
            <div>Paid On</div>
            <div>ID</div>
            <div>Status</div>
            <div>Unit</div>
            <div className="text-right">Amount</div>
            <div className="text-right">Processing</div>
            <div className="text-right">Paid</div>
            <div className="text-right">Balance</div>
          </div>

          <div className="flex-1 overflow-auto custom-scrollbar" style={{background:'#ffffff'}}> 
            {Object.entries(incomeData).map(([property, invoices]) => (
              <div key={property} className="border-b" style={{borderColor:'var(--brand-border)'}}>
                <div
                  className="grid grid-cols-10 gap-4 px-4 py-3 group-row cursor-pointer select-none"
                  onClick={() => toggleProperty(property)}
                >
                  <div className="col-span-10 flex items-center">
                    {expandedProperties[property] ? <ChevronUp size={16} className="text-gray-600"/> : <ChevronDown size={16} className="text-gray-600"/>}
                    <span className="ml-2 text-gray-800" style={{fontWeight:600}}>{property}</span>
                    <span className="text-gray-500 text-xs ml-2" style={{fontWeight:400}}>{propertyDetails[property]}</span>
                  </div>
                </div>
                {expandedProperties[property] && invoices.map(inv => (
                  <div
                    key={inv.id}
                    className={`grid grid-cols-10 gap-4 px-4 py-3 text-sm row-hover cursor-pointer ${selectedInvoice?.id===inv.id ? 'row-selected' : ''}`}
                    style={{borderTop:'1px solid var(--brand-border)',transition:'background .18s'}}
                    onClick={() => setSelectedInvoice(inv)}
                  >
                    <div className="col-span-2 pl-6 text-gray-800" style={{fontWeight:500}}>{inv.tenant}</div>
                    <div className="text-gray-700">{inv.dueOn}</div>
                    <div className="text-gray-700">{inv.paidOn}</div>
                    <div className="text-gray-700">{inv.id}</div>
                    <div><StatusBadge status={inv.status} /></div>
                    <div className="text-gray-700">{inv.unit}</div>
                    <div className={`text-right ${isOverdue(inv)?'text-red-600': ''}`} style={{fontWeight:isOverdue(inv)?600:500}}>{inv.amount}</div>
                    <div className={`text-right ${isOverdue(inv)?'text-red-600': ''}`}>{inv.processing}</div>
                    <div className={`text-right ${isOverdue(inv)?'text-red-600': ''}`}>{inv.paid}</div>
                    <div className={`text-right ${isOverdue(inv)?'text-red-600': ''}`} style={{fontWeight:isOverdue(inv)?600:500}}>{inv.balance}</div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>

        <aside className="w-80 flex flex-col gap-4">
          <div className="card p-4" style={{borderRadius:'0.9rem',position:'relative'}}>
            <h2 className="text-xs font-semibold text-gray-600 tracking-wide mb-2">MAY 1, 23 - MAY 31, 23</h2>
            <div style={{border:'1px solid var(--brand-border)',background:'linear-gradient(135deg,#f8fafc,#eef4fa)',borderRadius:12,padding:'18px 16px',textAlign:'center',boxShadow:'inset 0 0 0 1px rgba(255,255,255,0.4)'}}>
              <div className="text-[10px] font-medium tracking-wide text-gray-500 mb-1">TOTAL INVOICE AMOUNT</div>
              <div className="text-3xl font-bold text-gray-800 leading-none" style={{letterSpacing:'-0.5px'}}>$4,300.00</div>
              <div className="mt-1 text-xs font-semibold text-green-600 uppercase tracking-wide">Fully Paid</div>
            </div>
            {selectedInvoice && (
              <div style={{marginTop:20,position:'relative'}}>
                <div style={{position:'absolute',left:-32,top:0,width:24,height:24,background:'var(--brand-primary)',borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',color:'#fff',fontSize:12,fontWeight:600,boxShadow:'0 4px 10px -2px rgba(59,130,246,0.5)'}}>✓</div>
                <div className="card" style={{padding:16,borderRadius:12,boxShadow:'0 6px 20px -6px rgba(15,23,42,0.18)'}}>
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="text-[11px] uppercase tracking-wide text-gray-500">Due Date</div>
                      <div className="font-medium text-gray-800">{selectedInvoice.dueOn}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-[11px] uppercase tracking-wide text-gray-500">Total Due</div>
                      <div className="font-medium text-gray-800">$0.00</div>
                    </div>
                  </div>
                  <div className="text-[11px] text-gray-500 mb-3">Reminders Sent: 0</div>
                  <div className="space-y-3">
                    <div>
                      <h3 className="text-xs font-semibold text-gray-700 mb-1 tracking-wide uppercase">Invoice Items</h3>
                      <div className="flex justify-between text-sm" style={{fontWeight:500}}>
                        <span>Security Deposit</span>
                        <span>$1,500.00</span>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-xs font-semibold text-gray-700 mb-1 tracking-wide uppercase">Payments Submitted</h3>
                      <div className="flex justify-between text-sm" style={{fontWeight:500}}>
                        <span>Robert Smith By Cash</span>
                        <span>$1,500.00</span>
                      </div>
                      <div className="mt-1 text-[11px] text-gray-500">Bank Account</div>
                      <div className="text-[11px] text-gray-500">N/A</div>
                    </div>
                  </div>
                  <button className="mt-3 text-xs font-semibold" style={{color:'var(--brand-primary)'}}>Edit Invoice</button>
                </div>
              </div>
            )}
          </div>

          <div className="flex flex-col gap-3">
            <div className="card p-3" style={{borderRadius:12}}>
              <div className="text-[11px] tracking-wide text-gray-500 font-medium">PARTIALLY PAID</div>
              <div className="text-lg font-semibold text-gray-800">$1,000.00</div>
            </div>
            <div className="card p-3" style={{borderRadius:12}}>
              <div className="text-[11px] tracking-wide text-gray-500 font-medium">FULLY PAID</div>
              <div className="text-lg font-semibold text-gray-800">$2,250.00</div>
            </div>
            <div className="card p-3" style={{borderRadius:12}}>
              <div className="text-[11px] tracking-wide text-gray-500 font-medium">TOTAL PAID AMOUNT</div>
              <div className="text-lg font-semibold text-gray-800">$3,250.00</div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
