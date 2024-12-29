import React, { useState } from 'react';
import { Book, Plus, Pencil, Trash2, Check, X } from 'lucide-react';
import { useAddressBook } from '../hooks/useAddressBook';

interface Props {
  onSelect?: (address: string) => void;
}

export function AddressBook({ onSelect }: Props) {
  const { addresses, saveAddress, removeAddress, editAddress } = useAddressBook();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      editAddress(editingId, name, address);
      setEditingId(null);
    } else {
      saveAddress(name, address);
    }
    setName('');
    setAddress('');
    setShowForm(false);
  };

  const startEdit = (id: string) => {
    const addr = addresses.find(a => a.id === id);
    if (addr) {
      setEditingId(id);
      setName(addr.name);
      setAddress(addr.address);
      setShowForm(true);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Book className="w-5 h-5 text-green-400" />
          <h2 className="text-lg font-medium text-green-400">Address Book</h2>
        </div>
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-1 px-2 py-1 text-sm text-green-400 bg-green-500/10 rounded-lg hover:bg-green-500/20"
          >
            <Plus className="w-4 h-4" />
            Add Address
          </button>
        )}
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-gray-800/30 p-4 rounded-lg space-y-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1">Name</label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full bg-gray-900 text-green-400 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-green-500"
              placeholder="e.g. My Wallet"
              required
            />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Address</label>
            <input
              type="text"
              value={address}
              onChange={e => setAddress(e.target.value)}
              className="w-full bg-gray-900 text-green-400 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-green-500"
              placeholder="0x..."
              required
            />
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => {
                setShowForm(false);
                setEditingId(null);
                setName('');
                setAddress('');
              }}
              className="px-3 py-1 text-sm text-gray-400 hover:text-gray-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-3 py-1 text-sm bg-green-500 text-white rounded-lg hover:bg-green-600"
            >
              {editingId ? 'Update' : 'Save'}
            </button>
          </div>
        </form>
      )}

      <div className="space-y-2">
        {addresses.map(addr => (
          <div
            key={addr.id}
            className="bg-gray-800/30 p-3 rounded-lg flex items-center justify-between group"
          >
            <div 
              className="flex-1 cursor-pointer"
              onClick={() => onSelect?.(addr.address)}
            >
              <p className="text-green-400 font-medium">{addr.name}</p>
              <p className="text-sm text-gray-400 font-mono">{addr.address}</p>
            </div>
            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={() => startEdit(addr.id)}
                className="p-1 text-gray-400 hover:text-green-400"
                title="Edit"
              >
                <Pencil className="w-4 h-4" />
              </button>
              <button
                onClick={() => removeAddress(addr.id)}
                className="p-1 text-gray-400 hover:text-red-400"
                title="Remove"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}