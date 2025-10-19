import { supabase } from './supabaseClient';

// ============================================
// TRANSACTIONS SERVICE
// For Income & Expenses pages
// ============================================

/**
 * Fetch all transactions for an organization
 * @param {string} orgId - Organization ID
 * @param {Object} filters - Filter options
 * @returns {Promise<Array>} Array of transactions
 */
export const fetchTransactions = async (orgId, filters = {}) => {
  let query = supabase
    .from('transactions')
    .select(`
      *,
      tenant:tenants(id, first_name, last_name, email, phone),
      property:properties(id, name, address, city, state),
      unit:units(id, unit_number)
    `)
    .eq('organization_id', orgId);
  
  // Apply filters
  if (filters.type) {
    query = query.eq('type', filters.type);
  }
  
  if (filters.category) {
    query = query.eq('category', filters.category);
  }
  
  if (filters.status) {
    query = query.eq('status', filters.status);
  }
  
  if (filters.propertyId) {
    query = query.eq('property_id', filters.propertyId);
  }
  
  if (filters.tenantId) {
    query = query.eq('tenant_id', filters.tenantId);
  }
  
  if (filters.startDate) {
    query = query.gte('date', filters.startDate);
  }
  
  if (filters.endDate) {
    query = query.lte('date', filters.endDate);
  }
  
  query = query.order('date', { ascending: false });
  
  const { data, error } = await query;
  
  if (error) throw error;
  return data;
};

/**
 * Fetch income transactions (for Income page)
 * @param {string} orgId - Organization ID
 * @param {Object} filters - Filter options
 * @returns {Promise<Array>} Array of income transactions
 */
export const fetchIncome = async (orgId, filters = {}) => {
  return fetchTransactions(orgId, { ...filters, type: 'income' });
};

/**
 * Fetch expense transactions (for Expenses page)
 * @param {string} orgId - Organization ID
 * @param {Object} filters - Filter options
 * @returns {Promise<Array>} Array of expense transactions
 */
export const fetchExpenses = async (orgId, filters = {}) => {
  return fetchTransactions(orgId, { ...filters, type: 'expense' });
};

/**
 * Create a new transaction
 * @param {Object} transaction - Transaction data
 * @returns {Promise<Object>} Created transaction
 */
export const createTransaction = async (transaction) => {
  const { data, error } = await supabase
    .from('transactions')
    .insert(transaction)
    .select(`
      *,
      tenant:tenants(id, first_name, last_name, email),
      property:properties(id, name, address)
    `)
    .single();
  
  if (error) throw error;
  return data;
};

/**
 * Update a transaction
 * @param {string} id - Transaction ID
 * @param {Object} updates - Fields to update
 * @returns {Promise<Object>} Updated transaction
 */
export const updateTransaction = async (id, updates) => {
  const { data, error } = await supabase
    .from('transactions')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

/**
 * Delete a transaction
 * @param {string} id - Transaction ID
 * @returns {Promise<void>}
 */
export const deleteTransaction = async (id) => {
  const { error } = await supabase
    .from('transactions')
    .delete()
    .eq('id', id);
  
  if (error) throw error;
};

/**
 * Calculate P/L Report data
 * @param {string} orgId - Organization ID
 * @param {string} startDate - Start date
 * @param {string} endDate - End date
 * @returns {Promise<Object>} P/L report data
 */
export const calculatePL = async (orgId, startDate, endDate) => {
  // Fetch income
  const { data: incomeData, error: incomeError } = await supabase
    .from('transactions')
    .select('amount, category')
    .eq('organization_id', orgId)
    .eq('type', 'income')
    .eq('status', 'completed')
    .gte('date', startDate)
    .lte('date', endDate);
  
  if (incomeError) throw incomeError;
  
  // Fetch expenses
  const { data: expenseData, error: expenseError } = await supabase
    .from('transactions')
    .select('amount, category')
    .eq('organization_id', orgId)
    .eq('type', 'expense')
    .eq('status', 'completed')
    .gte('date', startDate)
    .lte('date', endDate);
  
  if (expenseError) throw expenseError;
  
  // Calculate totals
  const totalIncome = incomeData.reduce((sum, t) => sum + parseFloat(t.amount), 0);
  const totalExpenses = expenseData.reduce((sum, t) => sum + parseFloat(t.amount), 0);
  
  // Group by category
  const incomeByCategory = incomeData.reduce((acc, t) => {
    acc[t.category] = (acc[t.category] || 0) + parseFloat(t.amount);
    return acc;
  }, {});
  
  const expensesByCategory = expenseData.reduce((acc, t) => {
    acc[t.category] = (acc[t.category] || 0) + parseFloat(t.amount);
    return acc;
  }, {});
  
  return {
    income: {
      total: totalIncome,
      count: incomeData.length,
      byCategory: incomeByCategory
    },
    expenses: {
      total: totalExpenses,
      count: expenseData.length,
      byCategory: expensesByCategory
    },
    netProfit: totalIncome - totalExpenses
  };
};

/**
 * Get transaction summary for dashboard
 * @param {string} orgId - Organization ID
 * @returns {Promise<Object>} Summary data
 */
export const getTransactionSummary = async (orgId) => {
  const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM
  
  const { data, error } = await supabase
    .from('transactions')
    .select('type, amount, status, date')
    .eq('organization_id', orgId)
    .gte('date', `${currentMonth}-01`);
  
  if (error) throw error;
  
  const collected = data.filter(t => t.type === 'income' && t.status === 'completed')
    .reduce((sum, t) => sum + parseFloat(t.amount), 0);
  
  const overdue = data.filter(t => t.type === 'income' && t.status === 'pending' && new Date(t.date) < new Date())
    .reduce((sum, t) => sum + parseFloat(t.amount), 0);
  
  const processing = data.filter(t => t.type === 'income' && t.status === 'pending')
    .reduce((sum, t) => sum + parseFloat(t.amount), 0);
  
  const comingDue = data.filter(t => t.type === 'income' && t.status === 'pending' && new Date(t.date) > new Date())
    .reduce((sum, t) => sum + parseFloat(t.amount), 0);
  
  return {
    collected,
    overdue,
    processing,
    comingDue,
    totalIncome: collected + processing + comingDue,
    totalExpenses: data.filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + parseFloat(t.amount), 0)
  };
};

export default {
  fetchTransactions,
  fetchIncome,
  fetchExpenses,
  createTransaction,
  updateTransaction,
  deleteTransaction,
  calculatePL,
  getTransactionSummary
};
