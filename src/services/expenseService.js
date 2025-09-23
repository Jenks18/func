// Expense Service
// Handles all expense-related database operations

import database from './database';

class ExpenseService {
  async createExpense(expenseData) {
    try {
      const expense = {
        id: crypto.randomUUID(),
        ...expenseData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      await database.add('expenses', expense);
      return expense;
    } catch (error) {
      console.error('Error creating expense:', error);
      throw error;
    }
  }

  async getAllExpenses() {
    try {
      const expenses = await database.getAll('expenses');
      
      // Load property information for each expense
      const propertiesMap = new Map();
      for (const expense of expenses) {
        if (expense.propertyId && !propertiesMap.has(expense.propertyId)) {
          try {
            const property = await database.get('properties', expense.propertyId);
            if (property) {
              propertiesMap.set(expense.propertyId, property);
            }
          } catch (err) {
            console.warn(`Could not load property ${expense.propertyId}:`, err);
          }
        }
      }

      // Attach property data to expenses
      return expenses.map(expense => ({
        ...expense,
        property: propertiesMap.get(expense.propertyId) || null
      }));
    } catch (error) {
      console.error('Error fetching expenses:', error);
      throw error;
    }
  }

  async getExpenseById(expenseId) {
    try {
      const expense = await database.get('expenses', expenseId);
      if (!expense) {
        throw new Error('Expense not found');
      }

      // Load property information
      if (expense.propertyId) {
        try {
          const property = await database.get('properties', expense.propertyId);
          expense.property = property;
        } catch (err) {
          console.warn(`Could not load property for expense ${expenseId}:`, err);
          expense.property = null;
        }
      }

      return expense;
    } catch (error) {
      console.error('Error fetching expense:', error);
      throw error;
    }
  }

  async updateExpense(expenseId, updateData) {
    try {
      const existingExpense = await database.get('expenses', expenseId);
      if (!existingExpense) {
        throw new Error('Expense not found');
      }

      const updatedExpense = {
        ...existingExpense,
        ...updateData,
        updatedAt: new Date().toISOString()
      };

      await database.update('expenses', updatedExpense);
      return updatedExpense;
    } catch (error) {
      console.error('Error updating expense:', error);
      throw error;
    }
  }

  async deleteExpense(expenseId) {
    try {
      await database.delete('expenses', expenseId);
      return true;
    } catch (error) {
      console.error('Error deleting expense:', error);
      throw error;
    }
  }

  async getExpensesByProperty(propertyId) {
    try {
      const allExpenses = await database.getAll('expenses');
      return allExpenses.filter(expense => expense.propertyId === propertyId);
    } catch (error) {
      console.error('Error fetching expenses by property:', error);
      throw error;
    }
  }

  async getExpensesByCategory(category) {
    try {
      const allExpenses = await database.getAll('expenses');
      return allExpenses.filter(expense => expense.category === category);
    } catch (error) {
      console.error('Error fetching expenses by category:', error);
      throw error;
    }
  }

  async getExpensesByDateRange(startDate, endDate) {
    try {
      const allExpenses = await database.getAll('expenses');
      return allExpenses.filter(expense => {
        const expenseDate = new Date(expense.date);
        return expenseDate >= new Date(startDate) && expenseDate <= new Date(endDate);
      });
    } catch (error) {
      console.error('Error fetching expenses by date range:', error);
      throw error;
    }
  }

  async getTaxDeductibleExpenses() {
    try {
      const allExpenses = await database.getAll('expenses');
      return allExpenses.filter(expense => expense.taxDeductible === true);
    } catch (error) {
      console.error('Error fetching tax deductible expenses:', error);
      throw error;
    }
  }

  async getRecurringExpenses() {
    try {
      const allExpenses = await database.getAll('expenses');
      return allExpenses.filter(expense => expense.recurring === true);
    } catch (error) {
      console.error('Error fetching recurring expenses:', error);
      throw error;
    }
  }

  async getExpenseStats() {
    try {
      const allExpenses = await database.getAll('expenses');
      
      const stats = {
        totalExpenses: allExpenses.length,
        totalAmount: allExpenses.reduce((sum, expense) => sum + (expense.amount || 0), 0),
        avgAmount: 0,
        byCategory: {},
        byProperty: {},
        taxDeductibleTotal: 0,
        recurringTotal: 0
      };

      if (stats.totalExpenses > 0) {
        stats.avgAmount = stats.totalAmount / stats.totalExpenses;
      }

      // Group by category
      allExpenses.forEach(expense => {
        const category = expense.category || 'Uncategorized';
        if (!stats.byCategory[category]) {
          stats.byCategory[category] = { count: 0, total: 0 };
        }
        stats.byCategory[category].count++;
        stats.byCategory[category].total += expense.amount || 0;
      });

      // Group by property
      allExpenses.forEach(expense => {
        const propertyId = expense.propertyId || 'No Property';
        if (!stats.byProperty[propertyId]) {
          stats.byProperty[propertyId] = { count: 0, total: 0 };
        }
        stats.byProperty[propertyId].count++;
        stats.byProperty[propertyId].total += expense.amount || 0;
      });

      // Calculate tax deductible and recurring totals
      stats.taxDeductibleTotal = allExpenses
        .filter(expense => expense.taxDeductible)
        .reduce((sum, expense) => sum + (expense.amount || 0), 0);

      stats.recurringTotal = allExpenses
        .filter(expense => expense.recurring)
        .reduce((sum, expense) => sum + (expense.amount || 0), 0);

      return stats;
    } catch (error) {
      console.error('Error calculating expense stats:', error);
      throw error;
    }
  }
}

export default new ExpenseService();
