import { useState, useEffect } from 'react';
import Modal from '../components/Modal';
import Table from '../components/Table';
import Form from '../components/Form';

const API_URL = 'http://localhost:4000/api';

export default function Customers() {
  const [customers, setCustomers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/customers`);
      const data = await response.json();
      setCustomers(data);
    } catch (error) {
      alert('Error fetching customers: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (formData) => {
    try {
      const url = editingCustomer
        ? `${API_URL}/customers/${editingCustomer.custID}`
        : `${API_URL}/customers`;
      
      const response = await fetch(url, {
        method: editingCustomer ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (!response.ok) throw new Error('Failed to save customer');

      await fetchCustomers();
      setIsModalOpen(false);
      setEditingCustomer(null);
    } catch (error) {
      alert('Error saving customer: ' + error.message);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this customer?')) return;

    try {
      const response = await fetch(`${API_URL}/customers/${id}`, {
        method: 'DELETE'
      });

      if (!response.ok) throw new Error('Failed to delete customer');

      await fetchCustomers();
    } catch (error) {
      alert('Error deleting customer: ' + error.message);
    }
  };

  const handleEdit = (customer) => {
    setEditingCustomer(customer);
    setIsModalOpen(true);
  };

  const handleAdd = () => {
    setEditingCustomer(null);
    setIsModalOpen(true);
  };

  const filteredCustomers = customers.filter(customer =>
    customer.firstFName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.lastLName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.custID.toString().includes(searchTerm)
  );

  const columns = [
    { key: 'custID', label: 'Customer ID' },
    { key: 'firstFName', label: 'First Name' },
    { key: 'lastLName', label: 'Last Name' }
  ];

  const formFields = [
    { name: 'firstFName', label: 'First Name', type: 'text', required: true },
    { name: 'lastLName', label: 'Last Name', type: 'text', required: true }
  ];

  return (
    <div className="max-w-6xl mx-auto">
      <div className="bg-white rounded-xl shadow-lg p-6 border border-slate-200">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-slate-800">Customer Management</h2>
          <button
            onClick={handleAdd}
            className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all duration-200 shadow-md hover:shadow-lg font-medium"
          >
            + Add Customer
          </button>
        </div>

        <div className="mb-6">
          <input
            type="text"
            placeholder="🔍 Search customers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            <p className="mt-4 text-slate-600">Loading customers...</p>
          </div>
        ) : (
          <Table
            columns={columns}
            data={filteredCustomers}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        )}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingCustomer(null);
        }}
        title={editingCustomer ? 'Edit Customer' : 'Add Customer'}
      >
        <Form
          fields={formFields}
          initialData={editingCustomer}
          onSubmit={handleSubmit}
          onCancel={() => {
            setIsModalOpen(false);
            setEditingCustomer(null);
          }}
        />
      </Modal>
    </div>
  );
}
