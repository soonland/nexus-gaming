import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface IRegisterData {
  email: string;
  username: string;
  password: string;
  bio?: string;
  avatar?: string;
  socialLinks?: Record<string, string>;
}

interface IRegisterError {
  message: string;
  field?: string;
}

export const useRegister = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<IRegisterError | null>(null);

  const register = async (data: IRegisterData) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Une erreur est survenue');
      }

      // Redirect to onboarding or login
      router.push('/login?registered=true');
    } catch (err) {
      setError({
        message:
          err instanceof Error
            ? err.message
            : "Une erreur est survenue lors de l'inscription",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    register,
    isLoading,
    error,
  };
};
