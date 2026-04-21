import { useForm } from 'react-hook-form';
import { Navbar } from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import { usersApi } from '../lib/api';
import { useToast } from '../components/Toast';
import { User, Mail, Lock, Loader2, Settings } from 'lucide-react';

interface FormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export function ProfileSettings() {
  const { user, updateLocalUser } = useAuth();
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<FormData>({
    defaultValues: { name: user?.name ?? '', email: user?.email ?? '', password: '', confirmPassword: '' },
  });

  const password = watch('password');

  async function onSubmit(data: FormData) {
    const payload: { name?: string; email?: string; password?: string } = {};
    if (data.name !== user?.name) payload.name = data.name;
    if (data.email !== user?.email) payload.email = data.email;
    if (data.password) payload.password = data.password;

    if (Object.keys(payload).length === 0) {
      toast('No changes to save', 'info');
      return;
    }

    try {
      const updated = await usersApi.updateSelf(payload);
      updateLocalUser(updated);
      toast('Profile updated successfully!');
    } catch (err) {
      toast((err as Error).message || 'Update failed', 'error');
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2 mb-6">
          <Settings className="w-6 h-6 text-indigo-600" />
          Profile Settings
        </h1>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
          <div className="flex items-center gap-4 mb-8 pb-6 border-b border-gray-50">
            <div className="w-16 h-16 rounded-2xl bg-indigo-100 text-indigo-700 flex items-center justify-center text-xl font-bold">
              {user?.name.split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase()}
            </div>
            <div>
              <p className="font-bold text-gray-900 text-lg">{user?.name}</p>
              <p className="text-sm text-gray-500">{user?.email}</p>
              <span className={`text-xs font-semibold px-2 py-0.5 rounded-full mt-1 inline-block ${
                user?.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-600'
              }`}>
                {user?.role}
              </span>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Full name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  {...register('name', {
                    required: 'Name is required',
                    minLength: { value: 2, message: 'At least 2 characters' },
                  })}
                  className={`w-full pl-10 pr-4 py-2.5 text-sm border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400 transition ${
                    errors.name ? 'border-red-300 bg-red-50' : 'border-gray-200 bg-gray-50 focus:bg-white'
                  }`}
                />
              </div>
              {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Email address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="email"
                  {...register('email', {
                    required: 'Email is required',
                    pattern: { value: /^\S+@\S+\.\S+$/, message: 'Invalid email' },
                  })}
                  className={`w-full pl-10 pr-4 py-2.5 text-sm border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400 transition ${
                    errors.email ? 'border-red-300 bg-red-50' : 'border-gray-200 bg-gray-50 focus:bg-white'
                  }`}
                />
              </div>
              {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>}
            </div>

            <div className="pt-4 border-t border-gray-50">
              <p className="text-sm font-semibold text-gray-700 mb-4">Change Password <span className="font-normal text-gray-400">(optional)</span></p>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">New password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="password"
                      autoComplete="new-password"
                      placeholder="Leave blank to keep current"
                      {...register('password', {
                        minLength: { value: 6, message: 'Minimum 6 characters' },
                      })}
                      className={`w-full pl-10 pr-4 py-2.5 text-sm border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400 transition ${
                        errors.password ? 'border-red-300 bg-red-50' : 'border-gray-200 bg-gray-50 focus:bg-white'
                      }`}
                    />
                  </div>
                  {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Confirm new password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="password"
                      autoComplete="new-password"
                      placeholder="••••••••"
                      {...register('confirmPassword', {
                        validate: (v) => !password || v === password || 'Passwords do not match',
                      })}
                      className={`w-full pl-10 pr-4 py-2.5 text-sm border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400 transition ${
                        errors.confirmPassword ? 'border-red-300 bg-red-50' : 'border-gray-200 bg-gray-50 focus:bg-white'
                      }`}
                    />
                  </div>
                  {errors.confirmPassword && <p className="mt-1 text-xs text-red-500">{errors.confirmPassword.message}</p>}
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting || !isDirty}
              className="w-full flex items-center justify-center gap-2 bg-indigo-600 text-white py-2.5 rounded-xl font-semibold hover:bg-indigo-700 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
              {isSubmitting ? 'Saving…' : 'Save Changes'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
