import { useState, useEffect } from 'react';
import Modal from '../components/Modal';
import Table from '../components/Table';

const API_URL = 'http://localhost:4000/api';

export default function Sales() {
  const [sales, setSales] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [cashiers, setCashiers] = useState([]);
  const [products, setProducts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSale, setEditingSale] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    custID: '',
    cashierID: '',
    salesDate: new Date().toISOString().split('T')[0],
    items: [{ productID: '', quantity: 1, unitPrice: 0 }]
  });

  useEffect(() => {
    fetchSales();
    fetchCustomers();
    fetchCashiers();
    fetchProducts();
  }, []);

  const fetchSales = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/sales`);
      const data = await response.json();
      setSales(data);
    } catch (error) {
      alert('Error fetching sales: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchCustomers = async () => {
    try {
      const response = await fetch(`${API_URL}/customers`);
      const data = await response.json();
      setCustomers(data);
    } catch (error) {
      alert('Error fetching customers: ' + error.message);
    }
  };

  const fetchCashiers = async () => {
    try {
      const response = await fetch(`${API_URL}/cashiers`);
      const data = await response.json();
      setCashiers(data);
    } catch (error) {
      alert('Error fetching cashiers: ' + error.message);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await fetch(`${API_URL}/products`);
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      alert('Error fetching products: ' + error.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.custID || !formData.cashierID || formData.items.length === 0) {
      alert('Please fill all required fields and add at least one item');
      return;
    }

    try {
      const url = editingSale
        ? `${API_URL}/sales/${editingSale.salesID}`
        : `${API_URL}/sales`;
      
      const response = await fetch(url, {
        method: editingSale ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (!response.ok) throw new Error('Failed to save sale');

      await fetchSales();
      setIsModalOpen(false);
      setEditingSale(null);
      resetForm();
    } catch (error) {
      alert('Error saving sale: ' + error.message);
    }
  };

  const resetForm = () => {
    setFormData({
      custID: '',
      cashierID: '',
      salesDate: new Date().toISOString().split('T')[0],
      items: [{ productID: '', quantity: 1, unitPrice: 0 }]
    });
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this sale?')) return;

    try {
      const response = await fetch(`${API_URL}/sales/${id}`, {
        method: 'DELETE'
      });

      if (!response.ok) throw new Error('Failed to delete sale');

      await fetchSales();
    } catch (error) {
      alert('Error deleting sale: ' + error.message);
    }
  };

  const handleEdit = (sale) => {
    setEditingSale(sale);
    setFormData({
      custID: sale.custID,
      cashierID: sale.cashierID,
      salesDate: new Date(sale.salesDate).toISOString().split('T')[0],
      items: sale.salesItems.map(item => ({
        productID: item.productID,
        quantity: item.quantity,
        unitPrice: parseFloat(item.unitPrice)
      }))
    });
    setIsModalOpen(true);
  };

  const handleAdd = () => {
    setEditingSale(null);
    resetForm();
    setIsModalOpen(true);
  };

  const addItem = () => {
    setFormData({
      ...formData,
      items: [...formData.items, { productID: '', quantity: 1, unitPrice: 0 }]
    });
  };

  const removeItem = (index) => {
    setFormData({
      ...formData,
      items: formData.items.filter((_, i) => i !== index)
    });
  };

  const updateItem = (index, field, value) => {
    const newItems = [...formData.items];
    newItems[index][field] = value;
    setFormData({ ...formData, items: newItems });
  };

  const filteredSales = sales.filter(sale =>
    sale.salesID.toString().includes(searchTerm) ||
    sale.customer.firstFName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sale.customer.lastLName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sale.cashier.cashierFName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const columns = [
    { key: 'salesID', label: 'Sale ID' },
    { 
      key: 'customer', 
      label: 'Customer',
      render: (sale) => `${sale.customer.firstFName} ${sale.customer.lastLName}`
    },
    { 
      key: 'cashier', 
      label: 'Cashier',
      render: (sale) => `${sale.cashier.cashierFName} ${sale.cashier.cashierLName}`
    },
    { 
      key: 'salesDate', 
      label: 'Date',
      render: (sale) => new Date(sale.salesDate).toLocaleDateString()
    },
    { 
      key: 'items', 
      label: 'Items',
      render: (sale) => (
        <span className="font-semibold">{sale.salesItems.length} item(s)</span>
      )
    },
    { 
      key: 'total', 
      label: 'Total',
      render: (sale) => {
        const total = sale.salesItems.reduce((sum, item) => 
          sum + (parseFloat(item.unitPrice) * parseInt(item.quantity)), 0
        );
        return <span className="font-semibold text-green-600">₱{total.toFixed(2)}</span>;
      }
    }
  ];

  return (
    <div className="max-w-7xl mx-auto">
      <div className="bg-white rounded-xl shadow-lg p-6 border border-slate-200">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-slate-800">Sales Management</h2>
          <button
            onClick={handleAdd}
            className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all duration-200 shadow-md hover:shadow-lg font-medium"
          >
            + New Sale
          </button>
        </div>

        <div className="mb-6">
          <input
            type="text"
            placeholder="🔍 Search sales..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
          />
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
            <p className="mt-4 text-slate-600">Loading sales...</p>
          </div>
        ) : (
          <Table
            columns={columns}
            data={filteredSales}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        )}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingSale(null);
          resetForm();
        }}
        title={editingSale ? 'Edit Sale' : 'New Sale'}
        size="large"
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Customer *
              </label>
              <select
                value={formData.custID}
                onChange={(e) => setFormData({ ...formData, custID: e.target.value })}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                required
              >
                <option value="">Select Customer</option>
                {customers.map(customer => (
                  <option key={customer.custID} value={customer.custID}>
                    {customer.firstFName} {customer.lastLName}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Cashier *
              </label>
              <select
                value={formData.cashierID}
                onChange={(e) => setFormData({ ...formData, cashierID: e.target.value })}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                required
              >
                <option value="">Select Cashier</option>
                {cashiers.map(cashier => (
                  <option key={cashier.cashierID} value={cashier.cashierID}>
                    {cashier.cashierFName} {cashier.cashierLName}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Date *
              </label>
              <input
                type="date"
                value={formData.salesDate}
                onChange={(e) => setFormData({ ...formData, salesDate: e.target.value })}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                required
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-3">
              <label className="block text-sm font-medium text-slate-700">
                Items *
              </label>
              <button
                type="button"
                onClick={addItem}
                className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700"
              >
                + Add Item
              </button>
            </div>

            <div className="space-y-3 max-h-96 overflow-y-auto">
              {formData.items.map((item, index) => (
                <div key={index} className="flex gap-3 items-start bg-slate-50 p-3 rounded-lg">
                  <div className="flex-1">
                    <select
                      value={item.productID}
                      onChange={(e) => updateItem(index, 'productID', e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                      required
                    >
                      <option value="">Select Product</option>
                      {products.map(product => (
                        <option key={product.productID} value={product.productID}>
                          {product.ProdDesc}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="w-24">
                    <input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) => updateItem(index, 'quantity', e.target.value)}
                      placeholder="Qty"
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                      required
                    />
                  </div>
                  <div className="w-32">
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={item.unitPrice}
                      onChange={(e) => updateItem(index, 'unitPrice', e.target.value)}
                      placeholder="Price"
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                      required
                    />
                  </div>
                  {formData.items.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeItem(index)}
                      className="px-3 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 text-sm"
                    >
                      ✕
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-3 pt-4 border-t">
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
            >
              {editingSale ? 'Update Sale' : 'Create Sale'}
            </button>
            <button
              type="button"
              onClick={() => {
                setIsModalOpen(false);
                setEditingSale(null);
                resetForm();
              }}
              className="flex-1 px-4 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 transition-colors font-medium"
            >
              Cancel
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
