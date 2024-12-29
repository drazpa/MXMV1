import { useState, useEffect } from 'react';
import { SavedAddress } from '../types/blockchain';

const STORAGE_KEY = 'wallet_addressbook';

export function useAddressBook() {
  const [addresses, setAddresses] = useState<SavedAddress[]>([]);

  // Load addresses from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      setAddresses(JSON.parse(stored));
    }
  }, []);

  // Save address
  const saveAddress = (name: string, address: string) => {
    const newAddress: SavedAddress = {
      id: crypto.randomUUID(),
      name,
      address,
      createdAt: Date.now()
    };
    
    setAddresses(prev => {
      const updated = [...prev, newAddress];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  // Remove address
  const removeAddress = (id: string) => {
    setAddresses(prev => {
      const updated = prev.filter(addr => addr.id !== id);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  // Edit address
  const editAddress = (id: string, name: string, address: string) => {
    setAddresses(prev => {
      const updated = prev.map(addr => 
        addr.id === id ? { ...addr, name, address } : addr
      );
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  return {
    addresses,
    saveAddress,
    removeAddress,
    editAddress
  };
}