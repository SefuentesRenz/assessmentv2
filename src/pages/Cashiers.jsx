import { useState, useEffect } from 'react';
import Modal from '../components/Modal';
import Table from '../components/Table';
import Form from '../components/Form';

const API_URL = 'http://localhost:4000/api';

export default function Cashiers() {
  const [cashiers, setCashiers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCashier, setEditingCashier] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCashiers();
  }, []);

  const fetchCashiers = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/cashiers`);
      const data = await response.json();
      setCashiers(data);
    } catch (error) {
      alert('Error fetching cashiers: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (formData) => {
    try {
      const url = editingCashier
        ? `${API_URL}/cashiers/${editingCashier.cashierID}`
        : `${API_URL}/cashiers`;
      
      const response = await fetch(url, {
        method: editingCashier ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (!response.ok) throw new Error('Failed to save cashier');

      await fetchCashiers();
      setIsModalOpen(false);
      setEditingCashier(null);
    } catch (error) {
      alert('Error saving cashier: ' + error.message);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this cashier?')) return;

    try {
      const response = await fetch(`${API_URL}/cashiers/${id}`, {
        method: 'DELETE'
      });

      if (!response.ok) throw new Error('Failed to delete cashier');

      await fetchCashiers();
    } catch (error) {
      alert('Error deleting cashier: ' + error.message);
    }
  };

  const handleEdit = (cashier) => {
    setEditingCashier(cashier);
    setIsModalOpen(true);
  };

  const handleAdd = () => {
    setEditingCashier(null);
    setIsModalOpen(true);
  };

  const filteredCashiers = cashiers.filter(cashier =>
    cashier.cashierFName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cashier.cashierLName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cashier.cashierID.toString().includes(searchTerm)
  );

  const columns = [
    { key: 'cashierID', label: 'Cashier ID' },
    { key: 'cashierFName', label: 'First Name' },
    { key: 'cashierLName', label: 'Last Name' }
  ];

  const formFields = [
    { name: 'cashierFName', label: 'First Name', type: 'text', required: true },
    { name: 'cashierLName', label: 'Last Name', type: 'text', required: true }
  ];

  return (
    <div className="max-w-6xl mx-auto">
      <div className="bg-white rounded-xl shadow-lg p-6 border border-slate-200">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-slate-800">Cashier Management</h2>
          <button
            onClick={handleAdd}
            className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all duration-200 shadow-md hover:shadow-lg font-medium"
          >
            + Add Cashier
          </button>
        </div>

        <div className="mb-6">
          <input
            type="text"
            placeholder="🔍 Search cashiers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
            <p className="mt-4 text-slate-600">Loading cashiers...</p>
          </div>
        ) : (
          <Table
            columns={columns}
            data={filteredCashiers}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        )}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingCashier(null);
        }}
        title={editingCashier ? 'Edit Cashier' : 'Add Cashier'}
      >
        <Form
          fields={formFields}
          initialData={editingCashier}
          onSubmit={handleSubmit}
          onCancel={() => {
            setIsModalOpen(false);
            setEditingCashier(null);
          }}
        />
      </Modal>
    </div>
  );
}
