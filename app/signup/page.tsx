'use client';
import { useFormik } from 'formik';
import { useState } from 'react';
import * as Yup from 'yup';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Loader } from 'lucide-react';
import { toast } from 'sonner';

const AuthSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Required'),
  password: Yup.string().min(6, 'Too short!').required('Required'),
  first_name: Yup.string().when('isLogin', {
    is: false,
    then: (schema) => schema.required('First name is required'),
  }),
  last_name: Yup.string().when('isLogin', {
    is: false,
    then: (schema) => schema.required('Last name is required'),
  }),
  role: Yup.string().when('isLogin', {
    is: false,
    then: (schema) => schema.required('Role is required'),
  }),
});

export default function Auth() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
      first_name: '',
      last_name: '',
      role: 'user', // Default role
    },
    validationSchema: AuthSchema,
    onSubmit: async (values) => {
      setLoading(true);
      const endpoint = isLogin ? '/api/auth/login' : '/api/auth/signup';
      const body = isLogin
        ? { email: values.email, password: values.password }
        : { ...values, role: values.role }; // Include the selected role

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const { user, error } = await response.json();
      setLoading(false);

      if (error) {
        toast(error);
      } else {
        toast.success(isLogin ? 'Logged in successfully!' : 'Signed up successfully!');
        console.log('Redirecting user:', user);
        router.push(user.role === 'admin' ? '/admin/dashboard' : '/products');
      }
    },
  });

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 p-6">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-lg">
        <h2 className="mb-6 text-center text-2xl font-semibold text-gray-800">
          {isLogin ? 'Login to your account' : 'Create an account'}
        </h2>
        <form onSubmit={formik.handleSubmit} className="space-y-4">
          {!isLogin && (
            <>
              <InputField
                id="first_name"
                name="first_name"
                type="text"
                placeholder="First Name"
                formik={formik}
              />
              <InputField
                id="last_name"
                name="last_name"
                type="text"
                placeholder="Last Name"
                formik={formik}
              />
              <div>
                <label htmlFor="role" className="block text-sm font-medium text-gray-700">
                  Role
                </label>
                <select
                  id="role"
                  name="role"
                  value={formik.values.role}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-4 py-2 shadow-sm focus:border-lime-500 focus:ring-lime-500 sm:text-sm"
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
                {formik.touched.role && formik.errors.role && (
                  <p className="mt-1 text-sm text-red-500">{formik.errors.role}</p>
                )}
              </div>
            </>
          )}

          <InputField id="email" name="email" type="email" placeholder="Email" formik={formik} />

          <div className="relative">
            <Input
              id="password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="w-full rounded-md border px-4 py-2 pr-10"
            />
            <button
              type="button"
              className="absolute right-3 top-3 text-gray-500"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
            {formik.touched.password && formik.errors.password && (
              <p className="mt-1 text-sm text-red-500">{formik.errors.password}</p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full rounded-md bg-lime-600 px-4 py-2 text-white transition-all duration-300 hover:bg-lime-700 focus:ring-2 focus:ring-lime-400 disabled:bg-lime-300"
            disabled={formik.isSubmitting || loading}
          >
            {loading ? <Loader className="animate-spin" size={20} /> : isLogin ? 'Login' : 'Sign Up'}
          </Button>

          <div className="text-center">
            <Button
              type="button"
              variant="ghost"
              className="mt-2 text-sm text-gray-600 hover:underline"
              onClick={() => setIsLogin(!isLogin)}
            >
              {isLogin ? 'Switch to Sign Up' : 'Switch to Login'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

interface InputFieldProps {
  id: string;
  name: string;
  type: string;
  placeholder: string;
  formik: any; // You can replace 'any' with a more specific type if available
}

function InputField({ id, name, type, placeholder, formik }: InputFieldProps) {
  return (
    <div>
      <Input
        id={id}
        name={name}
        type={type}
        placeholder={placeholder}
        value={formik.values[name]}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        className="w-full rounded-md border px-4 py-2"
      />
      {formik.touched[name] && formik.errors[name] && (
        <p className="mt-1 text-sm text-red-500">{formik.errors[name]}</p>
      )}
    </div>
  );
}