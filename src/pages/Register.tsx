import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Briefcase } from 'lucide-react';
import AuthForm from '@/components/auth/AuthForm';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { registerUser, clearError } from '@/store/slices/authSlice';

const Register = () => {
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

  const handleSubmit = async (data: { name?: string; email: string; password: string }) => {
    if (data.name) {
      await dispatch(registerUser({ name: data.name, email: data.email, password: data.password }));
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Left side - Decorative */}
      <div className="hidden flex-1 bg-gradient-to-br from-primary/10 via-accent to-primary/20 lg:block">
        <div className="flex h-full flex-col items-center justify-center p-12">
          <div className="max-w-md text-center">
            <h2 className="font-display text-3xl font-bold">
              Start your freelance journey
            </h2>
            <p className="mt-4 text-muted-foreground">
              Join GigFlow today and connect with clients and freelancers worldwide.
            </p>
          </div>
        </div>
      </div>

      {/* Right side - Form */}
      <div className="flex flex-1 flex-col items-center justify-center p-8">
        <div className="mb-8 flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
            <Briefcase className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="font-display text-2xl font-bold">GigFlow</span>
        </div>
        <AuthForm
          type="register"
          onSubmit={handleSubmit}
          isLoading={isLoading}
          error={error}
        />
      </div>
    </div>
  );
};

export default Register;
