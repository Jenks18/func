import { useState, useEffect } from 'react';
import { useAuthenticatedSupabase } from '../../hooks/useAuthenticatedSupabase';
import { SupabaseLeaseService } from '../../services/supabaseLeaseService';

export function useLeases() {
  const { supabase, isReady } = useAuthenticatedSupabase();
  const [leaseService, setLeaseService] = useState(null);
  const [isLoadingLeases, setIsLoadingLeases] = useState(true);
  const [leasesError, setLeasesError] = useState(null);
  const [createdLeases, setCreatedLeases] = useState([]);

  // Initialize lease service when Supabase is ready
  useEffect(() => {
    if (isReady && supabase) {
      setLeaseService(new SupabaseLeaseService(supabase));
    }
  }, [isReady, supabase]);

  // Fetch leases from Supabase when lease service is ready
  useEffect(() => {
    const fetchLeases = async () => {
      if (!leaseService) return;

      try {
        setIsLoadingLeases(true);
        setLeasesError(null);
        const leases = await leaseService.getAllLeases();
        setCreatedLeases(leases);
      } catch (error) {
        setLeasesError(error.message);
        // Fallback mock data
        setCreatedLeases([
          {
            id: 1,
            property: "Main Street Lofts",
            unit: "201",
            status: "Active",
            start: "Jan 1, 2024",
            end: "Jun 30, 2024",
            tenants: 1,
            rent: "$1,200.00",
            deposit: "$2,500.00",
            address: "101 Main St, Milford Oaks 45140"
          }
        ]);
      } finally {
        setIsLoadingLeases(false);
      }
    };

    fetchLeases();
  }, [leaseService]);

  return {
    createdLeases,
    isLoadingLeases,
    leasesError,
    leaseService
  };
}

export function useSorting(data) {
  const [sortField, setSortField] = useState(null);
  const [sortDirection, setSortDirection] = useState('asc');

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const sortedData = [...data].sort((a, b) => {
    if (!sortField) return 0;
    
    let aValue = a[sortField];
    let bValue = b[sortField];
    
    if (sortField === 'start' || sortField === 'end') {
      aValue = new Date(aValue);
      bValue = new Date(bValue);
    }
    
    if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  return {
    sortedData,
    sortField,
    sortDirection,
    handleSort
  };
}
