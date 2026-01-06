import { useState, useEffect } from 'react';
import Modal from '../components/Modal';
import Table from '../components/Table';

const API_URL = 'http://localhost:4000/api';

export default function Products() {
  const [products, setProducts] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    ProdDesc: '',
    supplierIDs: []
  });

  useEffect(() => {
    fetchProducts();
    fetchSuppliers();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/products`);
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      alert('Error fetching products: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchSuppliers = async () => {
    try {
      const response = await fetch(`${API_URL}/suppliers`);
      const data = await response.json();
      setSuppliers(data);
    } catch (error) {
      alert('Error fetching suppliers: ' + error.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const url = editingProduct
        ? `${API_URL}/products/${editingProduct.productID}`
        : `${API_URL}/products`;
      
      const response = await fetch(url, {
        method: editingProduct ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (!response.ok) throw new Error('Failed to save product');

      await fetchProducts();
      setIsModalOpen(false);
      setEditingProduct(null);
      setFormData({ ProdDesc: '', supplierIDs: [] });
    } catch (error) {
      alert('Error saving product: ' + error.message);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this product?')) return;

    try {
      const response = await fetch(`${API_URL}/products/${id}`, {
        method: 'DELETE'
      });

      if (!response.ok) throw new Error('Failed to delete product');

      await fetchProducts();
    } catch (error) {
      alert('Error deleting product: ' + error.message);
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      ProdDesc: product.ProdDesc,
      supplierIDs: product.suppliers.map(s => s.supplierID)
    });
    setIsModalOpen(true);
  };

  const handleAdd = () => {
    setEditingProduct(null);
    setFormData({ ProdDesc: '', supplierIDs: [] });
    setIsModalOpen(true);
  };

  const filteredProducts = products.filter(product =>
    product.ProdDesc.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.productID.toString().includes(searchTerm)
  );

  const columns = [
    { key: 'productID', label: 'Product ID' },
    { key: 'ProdDesc', label: 'Description' },
    { 
      key: 'suppliers', 
      label: 'Suppliers',
      render: (product) => (
        <div className="flex flex-wrap gap-1">
          {product.suppliers.map(s => (
            <span key={s.supplier.supplierID} className="px-2 py-1 bg-purple-100 text-purple-800 rounded text-xs">
              {s.supplier.supplierDesc}
            </span>
          ))}
        </div>
      )
    }
  ];

  return (
    <div className="max-w-6xl mx-auto">
      <div className="bg-white rounded-xl shadow-lg p-6 border border-slate-200">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-slate-800">Product Management</h2>
          <button
            onClick={handleAdd}
            className="px-6 py-3 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-all duration-200 shadow-md hover:shadow-lg font-medium"
          >
            + Add Product
          </button>
        </div>

        <div className="mb-6">
          <input
            type="text"
            placeholder="🔍 Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
          />
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-600"></div>
            <p className="mt-4 text-slate-600">Loading products...</p>
          </div>
        ) : (
          <Table
            columns={columns}
            data={filteredProducts}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        )}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingProduct(null);
          setFormData({ ProdDesc: '', supplierIDs: [] });
        }}
        title={editingProduct ? 'Edit Product' : 'Add Product'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Product Description *
            </label>
            <input
              type="text"
              value={formData.ProdDesc}
              onChange={(e) => setFormData({ ...formData, ProdDesc: e.target.value })}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Suppliers
            </label>
            <div className="border border-slate-300 rounded-lg p-3 max-h-48 overflow-y-auto">
              {suppliers.map(supplier => (
                <label key={supplier.supplierID} className="flex items-center gap-2 py-2 hover:bg-slate-50 px-2 rounded cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.supplierIDs.includes(supplier.supplierID)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setFormData({
                          ...formData,
                          supplierIDs: [...formData.supplierIDs, supplier.supplierID]
                        });
                      } else {
                        setFormData({
                          ...formData,
                          supplierIDs: formData.supplierIDs.filter(id => id !== supplier.supplierID)
                        });
                      }
                    }}
                    className="w-4 h-4 text-yellow-600 rounded focus:ring-yellow-500"
                  />
                  <span className="text-sm">{supplier.supplierDesc}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors font-medium"
            >
              {editingProduct ? 'Update' : 'Create'}
            </button>
            <button
              type="button"
              onClick={() => {
                setIsModalOpen(false);
                setEditingProduct(null);
                setFormData({ ProdDesc: '', supplierIDs: [] });
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
