import LoginForm from '@/components/Auth/LoginForm';
import AuthLayout from '@/components/Auth/AuthLayout';

export default function LoginPage() {
  return (
    <AuthLayout>
      <LoginForm />
    </AuthLayout>
  );
}