'use client';
import { useFormik } from 'formik';
import { useState } from 'react';
import * as Yup from 'yup';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { useRouter } from 'next/navigation';

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
});

export default function Auth() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
      first_name: '',
      last_name: '',
    },
    validationSchema: AuthSchema,
    onSubmit: async (values) => {
      const endpoint = isLogin ? '/api/auth/login' : '/api/auth/signup';
      const body = isLogin
        ? { email: values.email, password: values.password }
        : { ...values, role: 'user' };

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const { user, error } = await response.json();

      if (error) {
        alert(error);
      } else {
        alert(isLogin ? 'Logged in successfully!' : 'Signed up successfully!');
        router.push(user.role === 'admin' ? '/admin/dashboard' : '/products');
      }
    },
  });

  return (
    <form onSubmit={formik.handleSubmit}>
      {!isLogin && (
        <>
          <Input
            id="first_name"
            name="first_name"
            type="text"
            placeholder="First Name"
            value={formik.values.first_name}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.first_name && formik.errors.first_name && (
            <div className="text-red-500">{formik.errors.first_name}</div>
          )}

          <Input
            id="last_name"
            name="last_name"
            type="text"
            placeholder="Last Name"
            value={formik.values.last_name}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.last_name && formik.errors.last_name && (
            <div className="text-red-500">{formik.errors.last_name}</div>
          )}
        </>
      )}

      <Input
        id="email"
        name="email"
        type="email"
        placeholder="Email"
        value={formik.values.email}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
      />
      {formik.touched.email && formik.errors.email && (
        <div className="text-red-500">{formik.errors.email}</div>
      )}

      <Input
        id="password"
        name="password"
        type="password"
        placeholder="Password"
        value={formik.values.password}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
      />
      {formik.touched.password && formik.errors.password && (
        <div className="text-red-500">{formik.errors.password}</div>
      )}

      <Button type="submit">{isLogin ? 'Login' : 'Sign Up'}</Button>
      <Button
        type="button"
        variant="ghost"
        onClick={() => setIsLogin(!isLogin)}
      >
        {isLogin ? 'Switch to Sign Up' : 'Switch to Login'}
      </Button>
    </form>
  );
}