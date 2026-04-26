import { useEffect, useState } from 'react';
import { Navbar } from '../components/Navbar';
import { usersApi } from '../lib/api';
import { useToast } from '../components/Toast';
import type { User, UserRole } from '../types';
import { Users, Loader2, ShieldCheck, ShieldOff, Edit3, Check, X } from 'lucide-react';

export function AdminUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<string | null>(null);
  const [editData, setEditData] = useState<{ name: string; email: string; role: UserRole }>({
    name: '', email: '', role: 'user',
  });
  const { toast } = useToast();

  useEffect(() => {
    usersApi.getAll()
      .then(setUsers)
      .catch((err) => toast((err as Error).message, 'error'))
      .finally(() => setLoading(false));
  }, []);

  function startEdit(user: User) {
    setEditing(user.id);
    setEditData({ name: user.name, email: user.email, role: user.role });
  }

  function cancelEdit() {
    setEditing(null);
  }

  async function saveEdit(userId: string) {
    try {
      const updated = await usersApi.adminUpdate(userId, editData);
      setUsers((prev) => prev.map((u) => (u.id === userId ? updated : u)));
      setEditing(null);
      toast('User updated successfully!');
    } catch (err) {
      toast((err as Error).message || 'Update failed', 'error');
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2 mb-6">
          <Users className="w-6 h-6 text-indigo-600" />
          Manage Users
        </h1>

        {loading && (
          <div className="flex justify-center py-20">
            <Loader2 className="w-10 h-10 text-indigo-500 animate-spin" />
          </div>
        )}

        {!loading && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">User</th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Email</th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Role</th>
                    <th className="text-right px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {users.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50/50 transition-colors">
                      {editing === user.id ? (
                        <>
                          <td className="px-6 py-3">
                            <input
                              type="text"
                              value={editData.name}
                              onChange={(e) => setEditData((d) => ({ ...d, name: e.target.value }))}
                              className="w-full px-3 py-1.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
                            />
                          </td>
                          <td className="px-6 py-3">
                            <input
                              type="email"
                              value={editData.email}
                              onChange={(e) => setEditData((d) => ({ ...d, email: e.target.value }))}
                              className="w-full px-3 py-1.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
                            />
                          </td>
                          <td className="px-6 py-3">
                            <select
                              value={editData.role}
                              onChange={(e) => setEditData((d) => ({ ...d, role: e.target.value as UserRole }))}
                              className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white"
                            >
                              <option value="user">user</option>
                              <option value="admin">admin</option>
                            </select>
                          </td>
                          <td className="px-6 py-3">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => saveEdit(user.id)}
                                className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition"
                              >
                                <Check className="w-3.5 h-3.5" /> Save
                              </button>
                              <button
                                onClick={cancelEdit}
                                className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition"
                              >
                                <X className="w-3.5 h-3.5" /> Cancel
                              </button>
                            </div>
                          </td>
                        </>
                      ) : (
                        <>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-xs font-bold shrink-0">
                                {user.name.split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase()}
                              </div>
                              <span className="font-medium text-gray-900">{user.name}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-gray-500">{user.email}</td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ${
                              user.role === 'admin'
                                ? 'bg-purple-100 text-purple-700'
                                : 'bg-gray-100 text-gray-600'
                            }`}>
                              {user.role === 'admin' ? <ShieldCheck className="w-3 h-3" /> : <ShieldOff className="w-3 h-3" />}
                              {user.role}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex justify-end">
                              <button
                                onClick={() => startEdit(user)}
                                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-indigo-600 hover:bg-indigo-50 rounded-lg transition"
                              >
                                <Edit3 className="w-3.5 h-3.5" /> Edit
                              </button>
                            </div>
                          </td>
                        </>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="px-6 py-3 border-t border-gray-50 bg-gray-50/50">
              <p className="text-xs text-gray-400">{users.length} user{users.length !== 1 ? 's' : ''} total</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
