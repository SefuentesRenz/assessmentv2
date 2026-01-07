export default function Home() {
  const features = [
    {
      title: 'Customer Management',
      description: 'Add, edit, and manage customer information',
      icon: '👥',
      color: 'bg-blue-500'
    },
    {
      title: 'Cashier Management',
      description: 'Track and manage cashier records',
      icon: '💼',
      color: 'bg-green-500'
    },
    {
      title: 'Supplier Management',
      description: 'Maintain supplier database and relationships',
      icon: '🏭',
      color: 'bg-purple-500'
    },
    {
      title: 'Product Catalog',
      description: 'Manage products and supplier associations',
      icon: '📦',
      color: 'bg-yellow-500'
    },
    {
      title: 'Sales Transactions',
      description: 'Process and track sales transactions',
      icon: '🛒',
      color: 'bg-red-500'
    },
    {
      title: 'Sales Reports',
      description: 'Generate comprehensive sales reports',
      icon: '📊',
      color: 'bg-indigo-500'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-5xl font-extrabold text-slate-900 mb-4">
          Welcome to Product Sales System
        </h1>
        <p className="text-xl text-slate-600 max-w-2xl mx-auto">
          A comprehensive solution for managing products, sales, customers, and suppliers
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {features.map((feature, index) => (
          <div
            key={index}
            className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300 border border-slate-200"
          >
            <div className={`w-16 h-16 ${feature.color} rounded-full flex items-center justify-center text-3xl mb-4`}>
              {feature.icon}
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">{feature.title}</h3>
            <p className="text-slate-600">{feature.description}</p>
          </div>
        ))}
      </div>

      
    </div>
  );
}
