import { useCookies } from 'react-cookie';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';


const AdminPanel = () => {
  const [cookies, setCookie, removeCookie] = useCookies(['adminToken']);
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [templateStats, setTemplateStats] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [showTemplatesModal, setShowTemplatesModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedUser, setSelectedUser] = useState(null);
  const usersPerPage = 10;

  // 🔐 Fetch Users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = cookies.adminToken;
        if (!token) return console.warn("No admin token in cookies.");

        const response = await axios.get(
          "https://apiresumebbuilder.freewilltech.in/get_users.php",
          {
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true,
          }
        );

        const userData = Array.isArray(response.data)
          ? response.data
          : Array.isArray(response.data.users)
            ? response.data.users
            : [];

        if (userData.length === 0 && !Array.isArray(response.data)) {
          console.warn("Unexpected response:", response.data);
          setError("Invalid user data received.");
        }

        setUsers(userData);
      } catch (err) {
        console.error("Error fetching users:", err);
        setError("Failed to fetch users. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [cookies.adminToken]);

  // 📊 Fetch Template Stats
  useEffect(() => {
  if (!cookies.adminToken) return;

  const fetchTemplateStats = async () => {
    try {
      const response = await axios.get(
        "https://apiresumebbuilder.freewilltech.in/get_template_stats.php",
        {
          headers: { Authorization: `Bearer ${cookies.adminToken}` },
          withCredentials: true
        }
      );

      if (Array.isArray(response.data.stats)) {
        setTemplateStats(response.data.stats);
      }
    } catch (err) {
      console.error("Error fetching template stats:", err);
    }
  };

  fetchTemplateStats();
}, [cookies.adminToken]);

  // 🔍 Filter & Sort Users
  useEffect(() => {
    let filtered = [...users];
    if (searchTerm.trim()) {
      filtered = filtered.filter(user =>
        user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (roleFilter !== 'all') {
      filtered = filtered.filter(user => user.role === roleFilter);
    }
    if (sortBy === 'name') {
      filtered.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === 'date') {
      filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    setFilteredUsers(filtered);
    setCurrentPage(1);
  }, [searchTerm, users, roleFilter, sortBy]);

  // 🚪 Logout
  const handleLogout = () => {
    removeCookie('adminToken');
    removeCookie('userToken');
    removeCookie('role');
    window.location = '/';
  };

  // ❌ Delete User
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await axios.post(
        "https://apiresumebbuilder.freewilltech.in/deleteUser.php",
        { id },
        {
          headers: { Authorization: `Bearer ${cookies.adminToken}` },
          withCredentials: true,
        }
      );
      setUsers(prev => prev.filter(u => u.id !== id));
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  // 📤 Export CSV
  const handleExportCSV = () => {
    const csv = [
      ['ID', 'Name', 'Email', 'Age', 'Role', 'Joined', 'Last Login'],
      ...filteredUsers.map(u => [
        u.id, u.name, u.email, u.age, u.role,
        new Date(u.createdAt).toLocaleDateString(),
        u.lastLogin ? new Date(u.lastLogin).toLocaleString() : "Never"
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'users.csv';
    link.click();
  };

  // 📥 Fetch User's Unlocked Templates
 const fetchTemplates = async (email) => {
  try {
    const token = cookies.adminToken;
    
    const response = await axios.get(
      `https://apiresumebbuilder.freewilltech.in/get_unlocked_templates.php?email=${email}`,
     
    );

    setTemplates(response.data.templates || []);
    setShowTemplatesModal(true);
  } catch (err) {
    console.error("Error fetching templates:", err);
    alert("Failed to fetch templates. Please check console for details.");
  }
};

  // 📄 Pagination
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  // 📊 Role Counts
  const roleCounts = Array.isArray(users)
    ? users.reduce((acc, user) => {
        const role = user.role || "unknown";
        acc[role] = (acc[role] || 0) + 1;
        return acc;
      }, {})
    : {};

  // ⏳ Loading Spinner
  if (loading) {
    return (
      <div className="min-h-screen bg-blue-950 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="text-orange-500 text-4xl"
        >
          <i className="fas fa-spinner"></i>
        </motion.div>
      </div>
    );
  }

  return (
    <motion.div className="min-h-screen bg-blue-950" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
      {/* Header */}
      <header className="bg-blue-900 shadow-lg">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <i className="fas fa-shield-alt text-orange-400 text-2xl mr-3"></i>
            <h1 className="text-xl font-bold text-white">Admin Dashboard</h1>
          </div>
          <motion.button
            onClick={handleLogout}
            className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Logout
          </motion.button>
        </div>
      </header>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="bg-blue-800 rounded-2xl shadow-xl overflow-hidden">
          {/* Top section */}
          <div className="p-6 bg-gradient-to-r from-blue-700 to-blue-800">
            <h2 className="text-2xl font-bold text-white">User Management</h2>
            <p className="text-blue-200">View and manage all registered users</p>
          </div>

          {/* Filters */}
          <div className="p-6 space-y-4">
            <div className="flex flex-wrap justify-between items-center gap-4">
              <input
                type="text"
                placeholder="Search users..."
                className="p-3 rounded-lg bg-blue-700 border border-blue-600 text-white placeholder-blue-400 focus:outline-none w-64"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
              <select value={roleFilter} onChange={e => setRoleFilter(e.target.value)} className="p-2 rounded bg-blue-700 text-white border border-blue-600">
                <option value="all">All Roles</option>
                <option value="student">Student</option>
                <option value="employee">Employee</option>
                <option value="admin">Admin</option>
              </select>
              <select value={sortBy} onChange={e => setSortBy(e.target.value)} className="p-2 rounded bg-blue-700 text-white border border-blue-600">
                <option value="name">Sort by Name</option>
                <option value="date">Sort by Date</option>
              </select>
              <button onClick={handleExportCSV} className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">Export CSV</button>
              <div className="text-blue-200">Total: <span className="font-bold text-orange-400">{filteredUsers.length}</span></div>
            </div>

            {/* Role count badges */}
            <div className="flex gap-4 text-sm text-white">
              {Object.entries(roleCounts).map(([role, count]) => (
                <div key={role} className="bg-blue-700 rounded-full px-3 py-1">
                  {role}: <span className="text-orange-400 font-semibold">{count}</span>
                </div>
              ))}
            </div>

            {/* Template stats */}
            {templateStats.length > 0 && (
              <div className="mt-4 p-4 bg-blue-750 rounded-xl">
                <h3 className="text-lg font-bold text-orange-300 mb-3">Template Popularity</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {templateStats.map((stat, index) => (
                    <motion.div 
                      key={index}
                      className="bg-blue-700 rounded-xl p-3 text-center"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <div className="text-2xl font-bold text-orange-400">{stat.unlock_count}</div>
                      <div className="text-blue-200">Template {stat.template_id}</div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* User table */}
            <div className="overflow-x-auto mt-4">
              <table className="w-full text-white">
                <thead>
                  <tr className="bg-blue-700">
                    <th className="py-3 px-4 text-left">ID</th>
                    <th className="py-3 px-4 text-left">Name</th>
                    <th className="py-3 px-4 text-left">Email</th>
                    <th className="py-3 px-4 text-left">Age</th>
                    <th className="py-3 px-4 text-left">Role</th>
                    <th className="py-3 px-4 text-left">Joined</th>
                    <th className="py-3 px-4 text-left">Last Login</th>
                    <th className="py-3 px-4 text-left">Templates</th>
                    <th className="py-3 px-4 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {currentUsers.map((user, index) => (
                    <motion.tr
                      key={user.id}
                      className={`${index % 2 === 0 ? 'bg-blue-800' : 'bg-blue-850'} hover:bg-blue-750`}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <td className="py-3 px-4 border-b border-blue-700">{user.id}</td>
                      <td className="py-3 px-4 border-b border-blue-700">{user.name}</td>
                      <td className="py-3 px-4 border-b border-blue-700">{user.email}</td>
                      <td className="py-3 px-4 border-b border-blue-700">{user.age}</td>
                      <td className="py-3 px-4 border-b border-blue-700 capitalize">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          user.role === 'student' ? 'bg-blue-600' :
                          user.role === 'employee' ? 'bg-green-600' : 'bg-orange-600'
                        }`}>{user.role}</span>
                      </td>
                      <td className="py-3 px-4 border-b border-blue-700">{new Date(user.createdAt).toLocaleDateString()}</td>
                      <td className="py-3 px-4 border-b border-blue-700">
                        {user.lastLogin ? new Date(user.lastLogin).toLocaleString() : 'Never'}
                      </td>
                      <td className="py-3 px-4 border-b border-blue-700">
                        <button 
                          onClick={() => {
                            setSelectedUser(user);
                             fetchTemplates(user.email);
                          }}
                          className="text-blue-300 hover:text-blue-100"
                        >
                          <i className="fas fa-eye mr-1"></i> View
                        </button>
                      </td>
                      <td className="py-3 px-4 border-b border-blue-700">
                        <button onClick={() => handleDelete(user.id)} className="text-red-400 hover:text-red-600">
                          <i className="fas fa-trash-alt"></i>
                        </button>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="mt-6 flex justify-center flex-wrap gap-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <motion.button
                  key={page}
                  className={`px-4 py-2 rounded-lg ${
                    currentPage === page ? 'bg-orange-500 text-blue-950' : 'bg-blue-700 text-white'
                  }`}
                  onClick={() => setCurrentPage(page)}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  {page}
                </motion.button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Templates Modal */}
      {showTemplatesModal && (
        <motion.div 
          className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={() => setShowTemplatesModal(false)}
        >
          <motion.div 
            className="bg-blue-800 rounded-2xl shadow-xl w-full max-w-3xl max-h-[80vh] overflow-hidden"
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 bg-gradient-to-r from-blue-700 to-blue-800 flex justify-between items-center">
              <h3 className="text-xl font-bold text-white">
                Templates Unlocked for {selectedUser?.name || 'User'}
              </h3>
              <button 
                onClick={() => setShowTemplatesModal(false)}
                className="text-white hover:text-gray-300 text-xl"
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
            
            <div className="p-4 overflow-y-auto max-h-[65vh]">
              {templates.length > 0 ? (
                <table className="w-full text-white">
                  <thead>
                    <tr className="bg-blue-700">
                      <th className="py-2 px-4 text-left">Template ID</th>
                      <th className="py-2 px-4 text-left">Name</th>
                      <th className="py-2 px-4 text-left">Unlocked Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {templates.map((template, idx) => (
                      <tr 
                        key={template.id} 
                        className={idx % 2 === 0 ? 'bg-blue-800' : 'bg-blue-850'}
                      >
                        <td className="py-2 px-4">{template.id}</td>
                        <td className="py-2 px-4">{template.name}</td>
                        <td className="py-2 px-4">
                          {template.unlocked_date 
                            ? new Date(template.unlocked_date).toLocaleDateString() 
                            : 'N/A'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="text-center py-8 text-blue-200">
                  <i className="fas fa-file-exclamation text-4xl mb-3"></i>
                  <p>No templates unlocked yet</p>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default AdminPanel;