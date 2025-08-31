import { useEffect } from 'react';
import { z } from 'zod';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginThunk } from '../../store/slices/authSlice';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '../../store';
import { Button } from '../ui/Button';
import { useNavigate } from 'react-router-dom';

const loginSchema = z.object({
  username: z.string().min(1, 'Username is required'),
  password: z.string().min(6, 'Password must be at least 6 characters long'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginForm() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { loading, error, isAuthenticated } = useSelector(
    (state: RootState) => state.auth
  );

  const methods = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    mode: 'onSubmit',
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    clearErrors,
  } = methods;

  useEffect(() => {
    if (error) {
      setError('root', { message: error });
    } else {
      clearErrors('root');
    }
  }, [error, setError, clearErrors]);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/search');
    }
  }, [isAuthenticated, navigate]);

  const onSubmit = (data: LoginFormValues) => {
    dispatch(loginThunk(data));
  };

  return (
    <div className="flex flex-col items-center justify-center bg-white rounded-xl shadow-xl py-20 px-10 max-w-md mx-auto">
      <h1 className="text-3xl font-bold text-pink mb-2">Welcome Back!</h1>
      <p className="text-gray-text mb-6 text-base">
        Sign in to your account to book your next room.
      </p>
      <FormProvider {...methods}>
        <form
          className="w-full flex flex-col gap-4"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div>
            <input
              {...register('username')}
              className={`w-full border rounded-lg px-4 py-2 text-base focus:outline-none focus:ring-1 ${
                errors.username
                  ? 'border-red-600 text-red-600 focus:ring-red-600'
                  : 'border-gray focus:ring-turquoise'
              }`}
              placeholder="Username"
              autoComplete="username"
            />
            {errors.username && (
              <p className="text-red-600 text-sm text-left pl-1">
                {errors.username.message}
              </p>
            )}
          </div>
          <div>
            <input
              {...register('password')}
              type="password"
              className={`w-full border rounded-lg px-4 py-2 text-base focus:outline-none focus:ring-1 ${
                errors.password
                  ? 'border-red-600 text-red-600 focus:ring-red-600'
                  : 'border-gray focus:ring-turquoise'
              }`}
              placeholder="Password"
              autoComplete="current-password"
            />
            {errors.password && (
              <div className="text-red-600 text-sm text-left pl-1">
                {errors.password.message}
              </div>
            )}
          </div>
          {errors.root && (
            <div className="text-red-600 text-sm text-center">
              {errors.root.message}
            </div>
          )}
          <Button type="submit" disabled={loading} variant="pink" size="wide">
            {loading ? 'Logging in...' : 'Login'}
          </Button>
        </form>
      </FormProvider>
      <div className="mt-6 text-sm text-gray-text">
        Don't have an account?{' '}
        <Button
          type="button"
          onClick={() => navigate('/register')}
          variant="link"
        >
          Sign up
        </Button>
      </div>
    </div>
  );
}
