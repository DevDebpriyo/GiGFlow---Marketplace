import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Briefcase } from 'lucide-react';
import AuthForm from '@/components/auth/AuthForm';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { loginUser, clearError } from '@/store/slices/authSlice';

const Login = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, isLoading, error } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/gigs');
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  const handleSubmit = async (data: { email: string; password: string }) => {
    await dispatch(loginUser(data));
  };

  return (
    <div className="flex min-h-screen">
      {/* Left side - Form */}
      <div className="flex flex-1 flex-col items-center justify-center p-8">
        <div className="mb-8 flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
            <Briefcase className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="font-display text-2xl font-bold">GigFlow</span>
        </div>
        <AuthForm
          type="login"
          onSubmit={handleSubmit}
          isLoading={isLoading}
          error={error}
        />
      </div>

      {/* Right side - Decorative */}
      <div className="hidden flex-1 bg-gradient-to-br from-primary/20 via-accent to-primary/10 lg:block">
        <div className="flex h-full flex-col items-center justify-center p-12">
          <div className="max-w-md text-center">
            <h2 className="font-display text-3xl font-bold">
              Welcome back to GigFlow
            </h2>
            <p className="mt-4 text-muted-foreground">
              Sign in to continue managing your gigs, bids, and opportunities.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
