import { useState, useEffect } from 'react';
import Modal from '../components/Modal';
import Table from '../components/Table';
import Form from '../components/Form';

const API_URL = 'http://localhost:4000/api';

export default function Suppliers() {
  const [suppliers, setSuppliers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const fetchSuppliers = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/suppliers`);
      const data = await response.json();
      setSuppliers(data);
    } catch (error) {
      alert('Error fetching suppliers: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (formData) => {
    try {
      const url = editingSupplier
        ? `${API_URL}/suppliers/${editingSupplier.supplierID}`
        : `${API_URL}/suppliers`;
      
      const response = await fetch(url, {
        method: editingSupplier ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (!response.ok) throw new Error('Failed to save supplier');

      await fetchSuppliers();
      setIsModalOpen(false);
      setEditingSupplier(null);
    } catch (error) {
      alert('Error saving supplier: ' + error.message);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this supplier?')) return;

    try {
      const response = await fetch(`${API_URL}/suppliers/${id}`, {
        method: 'DELETE'
      });

      if (!response.ok) throw new Error('Failed to delete supplier');

      await fetchSuppliers();
    } catch (error) {
      alert('Error deleting supplier: ' + error.message);
    }
  };

  const handleEdit = (supplier) => {
    setEditingSupplier(supplier);
    setIsModalOpen(true);
  };

  const handleAdd = () => {
    setEditingSupplier(null);
    setIsModalOpen(true);
  };

  const filteredSuppliers = suppliers.filter(supplier =>
    supplier.supplierDesc.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (supplier.supplierType && supplier.supplierType.toLowerCase().includes(searchTerm.toLowerCase())) ||
    supplier.supplierID.toString().includes(searchTerm)
  );

  const columns = [
    { key: 'supplierID', label: 'Supplier ID' },
    { key: 'supplierDesc', label: 'Description' },
    { key: 'supplierType', label: 'Type' }
  ];

  const formFields = [
    { name: 'supplierDesc', label: 'Supplier Description', type: 'text', required: true },
    { name: 'supplierType', label: 'Supplier Type', type: 'text', required: false }
  ];

  return (
    <div className="max-w-6xl mx-auto">
      <div className="bg-white rounded-xl shadow-lg p-6 border border-slate-200">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-slate-800">Supplier Management</h2>
          <button
            onClick={handleAdd}
            className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all duration-200 shadow-md hover:shadow-lg font-medium"
          >
            + Add Supplier
          </button>
        </div>

        <div className="mb-6">
          <input
            type="text"
            placeholder="🔍 Search suppliers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
            <p className="mt-4 text-slate-600">Loading suppliers...</p>
          </div>
        ) : (
          <Table
            columns={columns}
            data={filteredSuppliers}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        )}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingSupplier(null);
        }}
        title={editingSupplier ? 'Edit Supplier' : 'Add Supplier'}
      >
        <Form
          fields={formFields}
          initialData={editingSupplier}
          onSubmit={handleSubmit}
          onCancel={() => {
            setIsModalOpen(false);
            setEditingSupplier(null);
          }}
        />
      </Modal>
    </div>
  );
}
