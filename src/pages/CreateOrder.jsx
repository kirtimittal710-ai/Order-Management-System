import React, { useState, useEffect } from 'react';
import { ArrowLeft, ArrowRight, Check, AlertCircle, User, Package, FileText } from 'lucide-react';
import { teamMembers } from '../data/mockData';

const steps = [
  { id: 1, label: 'Customer', icon: User },
  { id: 2, label: 'Product', icon: Package },
  { id: 3, label: 'Review', icon: FileText },
];

const FormField = ({ label, error, children }) => (
  <div>
    <label className="text-xs font-semibold uppercase tracking-wider block mb-2"
      style={{ color: 'var(--text-muted)' }}>{label}</label>
    {children}
    {error && (
      <p className="text-xs mt-1 flex items-center gap-1" style={{ color: 'var(--accent-rose)' }}>
        <AlertCircle size={11} /> {error}
      </p>
    )}
  </div>
);

export default function CreateOrder({ onBack, onAddOrder, editingOrder, onEditOrder }) {
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const isEditMode = !!editingOrder;

  const [form, setForm] = useState({
    customerName: '', email: '', phone: '',
    product: '', amount: '', priority: 'medium',
    assignedTo: '', dueDate: '', notes: ''
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (editingOrder) {
      setForm({
        customerName: editingOrder.customer.name,
        email: editingOrder.customer.email,
        phone: editingOrder.customer.phone,
        product: editingOrder.product,
        amount: editingOrder.amount,
        priority: editingOrder.priority,
        assignedTo: editingOrder.assignedTo,
        dueDate: editingOrder.dueDate,
        notes: editingOrder.notes || ''
      });
    }
  }, [editingOrder]);

  const set = (k, v) => {
    setForm(f => ({ ...f, [k]: v }));
    setErrors(e => ({ ...e, [k]: undefined }));
  };

  const validateStep1 = () => {
    const e = {};
    if (!form.customerName.trim()) e.customerName = 'Customer name is required';
    if (!form.email.trim()) e.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Enter a valid email';
    if (!form.phone.trim()) e.phone = 'Phone number is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const validateStep2 = () => {
    const e = {};
    if (!form.product.trim()) e.product = 'Product name is required';
    if (!form.amount) e.amount = 'Amount is required';
    else if (isNaN(form.amount) || Number(form.amount) <= 0) e.amount = 'Enter a valid amount';
    if (!form.dueDate) e.dueDate = 'Due date is required';
    if (!form.assignedTo) e.assignedTo = 'Please assign to a team member';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleNext = () => {
    if (step === 1 && !validateStep1()) return;
    if (step === 2 && !validateStep2()) return;
    setStep(s => s + 1);
  };

  const handleSubmit = () => {
    if (isEditMode) {
      const updatedOrder = {
        ...editingOrder,
        customer: {
          ...editingOrder.customer,
          name: form.customerName,
          email: form.email,
          phone: form.phone,
          avatar: form.customerName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
        },
        product: form.product,
        amount: Number(form.amount),
        priority: form.priority,
        dueDate: form.dueDate,
        assignedTo: form.assignedTo,
        notes: form.notes,
        items: [{ name: form.product, qty: 1, price: Number(form.amount) }],
      };
      onEditOrder(updatedOrder);
    } else {
      const newOrder = {
        id: `ORD-2024-00${Date.now().toString().slice(-3)}`,
        customer: {
          name: form.customerName,
          email: form.email,
          phone: form.phone,
          avatar: form.customerName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
        },
        product: form.product,
        amount: Number(form.amount),
        status: 'pending',
        priority: form.priority,
        date: new Date().toISOString().split('T')[0],
        dueDate: form.dueDate,
        assignedTo: form.assignedTo,
        notes: form.notes,
        items: [{ name: form.product, qty: 1, price: Number(form.amount) }],
        timeline: [
          { status: 'Order Placed', time: new Date().toLocaleString('en-IN'), done: true },
          { status: 'Payment Verified', time: '', done: false },
          { status: 'Processing', time: '', done: false },
          { status: 'Shipped', time: '', done: false },
          { status: 'Delivered', time: '', done: false },
        ]
      };
      onAddOrder(newOrder);
      setSubmitted(true);
    }
  };

  if (submitted) return (
    <div className="p-6 flex flex-col items-center justify-center min-h-96 page-enter text-center">
      <div className="w-20 h-20 rounded-full flex items-center justify-center mb-4"
        style={{ background: 'linear-gradient(135deg, #00e5a0, #00b8d4)', boxShadow: '0 0 32px rgba(0,229,160,0.3)' }}>
        <Check size={36} color="white" />
      </div>
      <h2 className="text-2xl font-bold mb-2" style={{ fontFamily: 'Syne' }}>Order Created!</h2>
      <p className="text-sm mb-6" style={{ color: 'var(--text-secondary)' }}>
        Order for <strong>{form.customerName}</strong> has been successfully placed.
      </p>
      <div className="flex gap-3">
        <button onClick={onBack} className="btn-primary">View Orders</button>
        <button onClick={() => {
          setSubmitted(false); setStep(1);
          setForm({ customerName: '', email: '', phone: '', product: '', amount: '', priority: 'medium', assignedTo: '', dueDate: '', notes: '' });
        }} className="btn-ghost">Create Another</button>
      </div>
    </div>
  );

  return (
    <div className="p-4 md:p-6 page-enter max-w-2xl mx-auto">
      <button onClick={onBack}
        className="flex items-center gap-2 text-sm mb-6 hover:opacity-80 transition-opacity"
        style={{ color: 'var(--text-secondary)' }}>
        <ArrowLeft size={16} /> Back to Orders
      </button>

      <h2 className="text-2xl font-bold mb-6" style={{ fontFamily: 'Syne' }}>
        {isEditMode ? `Edit Order — ${editingOrder.id}` : 'Create New Order'}
      </h2>

      <div className="flex items-center mb-8">
        {steps.map((s, i) => (
          <React.Fragment key={s.id}>
            <div className="flex flex-col items-center gap-1.5">
              <div className={`step-circle ${step > s.id ? 'done' : step === s.id ? 'active' : ''}`}>
                {step > s.id ? <Check size={14} /> : <s.icon size={14} />}
              </div>
              <span className="text-xs font-medium"
                style={{ color: step >= s.id ? 'var(--text-primary)' : 'var(--text-muted)' }}>
                {s.label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div className="flex-1 h-px mx-3 mb-5"
                style={{ background: step > s.id ? 'var(--accent-violet)' : 'var(--border)' }} />
            )}
          </React.Fragment>
        ))}
      </div>

      {step === 1 && (
        <div className="glass-card p-6 space-y-4 page-enter">
          <h3 className="font-bold text-lg mb-2" style={{ fontFamily: 'Syne' }}>Customer Details</h3>
          <FormField label="Customer Name" error={errors.customerName}>
            <input className={`input-field ${errors.customerName ? 'error' : ''}`}
              placeholder="e.g. Arjun Sharma"
              value={form.customerName} onChange={e => set('customerName', e.target.value)} />
          </FormField>
          <FormField label="Email Address" error={errors.email}>
            <input type="email" className={`input-field ${errors.email ? 'error' : ''}`}
              placeholder="customer@email.com"
              value={form.email} onChange={e => set('email', e.target.value)} />
          </FormField>
          <FormField label="Phone Number" error={errors.phone}>
            <input className={`input-field ${errors.phone ? 'error' : ''}`}
              placeholder="+91 98765 43210"
              value={form.phone} onChange={e => set('phone', e.target.value)} />
          </FormField>
        </div>
      )}

      {step === 2 && (
        <div className="glass-card p-6 space-y-4 page-enter">
          <h3 className="font-bold text-lg mb-2" style={{ fontFamily: 'Syne' }}>Order Details</h3>
          <FormField label="Product / Service" error={errors.product}>
            <input className={`input-field ${errors.product ? 'error' : ''}`}
              placeholder="e.g. Enterprise License Pack"
              value={form.product} onChange={e => set('product', e.target.value)} />
          </FormField>
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Amount (₹)" error={errors.amount}>
              <input type="number" className={`input-field ${errors.amount ? 'error' : ''}`}
                placeholder="0"
                value={form.amount} onChange={e => set('amount', e.target.value)} />
            </FormField>
            <FormField label="Due Date" error={errors.dueDate}>
              <input type="date" className={`input-field ${errors.dueDate ? 'error' : ''}`}
                value={form.dueDate} onChange={e => set('dueDate', e.target.value)} />
            </FormField>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Priority">
              <select className="input-field" value={form.priority}
                onChange={e => set('priority', e.target.value)}>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </FormField>
            <FormField label="Assign To" error={errors.assignedTo}>
              <select className={`input-field ${errors.assignedTo ? 'error' : ''}`}
                value={form.assignedTo} onChange={e => set('assignedTo', e.target.value)}>
                <option value="">Select member</option>
                {teamMembers.map(m => <option key={m} value={m}>{m}</option>)}
              </select>
            </FormField>
          </div>
          <FormField label="Notes (Optional)">
            <textarea className="input-field" rows={3}
              placeholder="Any special instructions or remarks..."
              value={form.notes} onChange={e => set('notes', e.target.value)} />
          </FormField>
        </div>
      )}

      {step === 3 && (
        <div className="glass-card p-6 page-enter space-y-4">
          <h3 className="font-bold text-lg mb-2" style={{ fontFamily: 'Syne' }}>Review & Confirm</h3>
          <div className="space-y-3">
            {[
              { label: 'Customer', val: form.customerName },
              { label: 'Email', val: form.email },
              { label: 'Phone', val: form.phone },
              { label: 'Product', val: form.product },
              { label: 'Amount', val: `₹${Number(form.amount).toLocaleString('en-IN')}` },
              { label: 'Due Date', val: form.dueDate },
              { label: 'Priority', val: form.priority },
              { label: 'Assigned To', val: form.assignedTo },
            ].map(({ label, val }) => (
              <div key={label} className="flex justify-between py-2.5"
                style={{ borderBottom: '1px solid var(--border)' }}>
                <span className="text-sm" style={{ color: 'var(--text-muted)' }}>{label}</span>
                <span className="text-sm font-medium capitalize">{val}</span>
              </div>
            ))}
            {form.notes && (
              <div className="py-2.5" style={{ borderBottom: '1px solid var(--border)' }}>
                <span className="text-sm block mb-1" style={{ color: 'var(--text-muted)' }}>Notes</span>
                <span className="text-sm">{form.notes}</span>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="flex justify-between mt-6">
        <button onClick={() => step === 1 ? onBack() : setStep(s => s - 1)}
          className="btn-ghost">
          <ArrowLeft size={15} /> {step === 1 ? 'Cancel' : 'Back'}
        </button>
        {step < 3 ? (
          <button onClick={handleNext} className="btn-primary">
            Next <ArrowRight size={15} />
          </button>
        ) : (
          <button onClick={handleSubmit} className="btn-primary">
            <Check size={15} /> {isEditMode ? 'Save Changes' : 'Confirm Order'}
          </button>
        )}
      </div>
    </div>
  );
}