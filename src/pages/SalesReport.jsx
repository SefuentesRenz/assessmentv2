import { useState, useEffect } from 'react';

const API_URL = 'http://localhost:4000/api';

export default function SalesReport() {
  const [report, setReport] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState('salesID');
  const [sortOrder, setSortOrder] = useState('desc');

  useEffect(() => {
    fetchReport();
  }, []);

  const fetchReport = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/sales-report`);
      const data = await response.json();
      setReport(data);
    } catch (error) {
      alert('Error fetching report: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const filteredReport = report.filter(row =>
    row.salesID.toString().includes(searchTerm) ||
    row.custFName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    row.custLName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    row.prodDesc.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (row.supplierDesc && row.supplierDesc.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const sortedReport = [...filteredReport].sort((a, b) => {
    let aVal = a[sortField];
    let bVal = b[sortField];
    
    if (sortField === 'salesDate') {
      aVal = new Date(aVal);
      bVal = new Date(bVal);
    }
    
    if (aVal < bVal) return sortOrder === 'asc' ? -1 : 1;
    if (aVal > bVal) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });

  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const exportToCSV = () => {
    const headers = ['SalesID', 'CustID', 'CustFName', 'CustLName', 'ProductID', 'ProdDesc', 'SalesDate', 'CashierID', 'CashierFName', 'CashierLName', 'SupplierID', 'SupplierDesc'];
    const csvContent = [
      headers.join(','),
      ...sortedReport.map(row => [
        row.salesID,
        row.custID,
        row.custFName,
        row.custLName,
        row.productID,
        `"${row.prodDesc}"`,
        new Date(row.salesDate).toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: '2-digit' }),
        row.cashierID,
        row.cashierFName,
        row.cashierLName,
        row.supplierID || '',
        row.supplierDesc ? `"${row.supplierDesc}"` : ''
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sales-report-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="bg-white rounded-xl shadow-lg p-6 border border-slate-200">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-3xl font-bold text-slate-800">Sales Report</h2>
            <p className="text-slate-600 mt-1">Comprehensive sales transaction report</p>
          </div>
          <button
            onClick={exportToCSV}
            className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all duration-200 shadow-md hover:shadow-lg font-medium flex items-center gap-2"
          >
            <span>📥</span>
            Export CSV
          </button>
        </div>

        <div className="mb-6">
          <input
            type="text"
            placeholder="🔍 Search report..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            <p className="mt-4 text-slate-600">Loading report...</p>
          </div>
        ) : sortedReport.length === 0 ? (
          <div className="text-center py-12 text-slate-500">
            <div className="text-6xl mb-4">📊</div>
            <p className="text-lg">No sales data available</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-100">
                <tr>
                  <th className="px-3 py-3 text-left font-semibold text-slate-700 cursor-pointer hover:bg-slate-200" onClick={() => handleSort('salesID')}>
                    SalesID {sortField === 'salesID' && (sortOrder === 'asc' ? '↑' : '↓')}
                  </th>
                  <th className="px-3 py-3 text-left font-semibold text-slate-700">
                    CustID
                  </th>
                  <th className="px-3 py-3 text-left font-semibold text-slate-700">
                    CustFName
                  </th>
                  <th className="px-3 py-3 text-left font-semibold text-slate-700">
                    CustLName
                  </th>
                  <th className="px-3 py-3 text-left font-semibold text-slate-700">
                    ProductID
                  </th>
                  <th className="px-3 py-3 text-left font-semibold text-slate-700">
                    ProdDesc
                  </th>
                  <th className="px-3 py-3 text-left font-semibold text-slate-700 cursor-pointer hover:bg-slate-200" onClick={() => handleSort('salesDate')}>
                    SalesDate {sortField === 'salesDate' && (sortOrder === 'asc' ? '↑' : '↓')}
                  </th>
                  <th className="px-3 py-3 text-left font-semibold text-slate-700">
                    CashierID
                  </th>
                  <th className="px-3 py-3 text-left font-semibold text-slate-700">
                    CashierFName
                  </th>
                  <th className="px-3 py-3 text-left font-semibold text-slate-700">
                    CashierLName
                  </th>
                  <th className="px-3 py-3 text-left font-semibold text-slate-700">
                    SupplierID
                  </th>
                  <th className="px-3 py-3 text-left font-semibold text-slate-700">
                    SupplierDesc
                  </th>
                </tr>
              </thead>
              <tbody>
                {sortedReport.map((row, index) => (
                  <tr key={index} className="border-b border-slate-200 hover:bg-slate-50">
                    <td className="px-3 py-3">{row.salesID}</td>
                    <td className="px-3 py-3">{row.custID}</td>
                    <td className="px-3 py-3">{row.custFName}</td>
                    <td className="px-3 py-3">{row.custLName}</td>
                    <td className="px-3 py-3">{row.productID}</td>
                    <td className="px-3 py-3">{row.prodDesc}</td>
                    <td className="px-3 py-3">
                      {new Date(row.salesDate).toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: '2-digit' })}
                    </td>
                    <td className="px-3 py-3">{row.cashierID}</td>
                    <td className="px-3 py-3">{row.cashierFName}</td>
                    <td className="px-3 py-3">{row.cashierLName}</td>
                    <td className="px-3 py-3">{row.supplierID || ''}</td>
                    <td className="px-3 py-3">{row.supplierDesc || ''}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
