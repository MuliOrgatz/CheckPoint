import { z } from 'zod';
import { useEffect } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '../../store';
import { Button } from '../ui/Button';
import { useNavigate } from 'react-router-dom';
import { registerThunk } from '../../store/slices/authSlice';

const signUpSchema = z.object({
  username: z.string().min(1, 'Username is required'),
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type SignUpFormValues = z.infer<typeof signUpSchema>;

export default function SignUpForm() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { loading, error, isAuthenticated } = useSelector(
    (state: RootState) => state.auth
  );

  const methods = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpSchema),
    mode: 'onSubmit',
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    clearErrors,
  } = methods;

  // Show backend error
  useEffect(() => {
    if (error) {
      setError('root', { message: error });
    } else {
      clearErrors('root');
    }
  }, [error, setError, clearErrors]);

  // Redirect after successful registration
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/search');
    }
  }, [isAuthenticated, navigate]);

  const onSubmit = (data: SignUpFormValues) => {
    dispatch(registerThunk(data));
  };

  return (
    <div className="flex flex-col items-center justify-center bg-white rounded-xl shadow-xl py-10 px-20 max-w-md mx-auto">
      <div className="bg-pink/10 rounded-full p-4 mb-2">
        <img
          src="/assets/user.svg"
          alt="User"
          className="w-10 h-10 text-pink"
        />
      </div>
      <h1 className="text-3xl font-bold text-pink mb-2">Create Account</h1>
      <p className="text-gray-400 mb-6 text-base">
        Sign up to book your next room.
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
              {...register('email')}
              type="email"
              className={`w-full border rounded-lg px-4 py-2 text-base focus:outline-none focus:ring-1 ${
                errors.email
                  ? 'border-red-600 text-red-600 focus:ring-red-600'
                  : 'border-gray focus:ring-turquoise'
              }`}
              placeholder="Email"
              autoComplete="email"
            />
            {errors.email && (
              <p className="text-red-600 text-sm text-left pl-1">
                {errors.email.message}
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
              autoComplete="new-password"
            />
            {errors.password && (
              <p className="text-red-600 text-sm text-left pl-1">
                {errors.password.message}
              </p>
            )}
          </div>
          {errors.root && (
            <div className="text-red-600 text-sm text-center">
              {errors.root.message}
            </div>
          )}
          <Button type="submit" disabled={loading} variant="pink" size="wide">
            {loading ? 'Signing up...' : 'Sign Up'}
          </Button>
        </form>
      </FormProvider>
      <div className="mt-6 text-sm text-gray-text">
        Already have an account?{' '}
        <Button type="button" onClick={() => navigate('/login')} variant="link">
          Login
        </Button>
      </div>
    </div>
  );
}
