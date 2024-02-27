'use client';
import {
  MutateUserOptions,
  useUserMutation
} from '@/hooks/mutations/useUserMutation';
import { backend_url } from '@/lib/constants';
import {
  ChevronRightIcon,
  EnvelopeIcon,
  EyeIcon,
  EyeSlashIcon,
  LockClosedIcon,
  UserIcon
} from '@heroicons/react/24/outline';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { BiLoader } from 'react-icons/bi';
import { toast } from 'sonner';
import z from 'zod';

const loginSchema = z.object({
  name: z.string().nullish(),
  email: z.string().email({ message: 'Invalid Email!' }),
  password: z
    .string()
    .min(6, { message: 'Password must be at least 6 characters!' })
});
const registerSchema = z.object({
  name: z.string().min(4, { message: 'Name must be at least 4 characters' }),
  email: z.string().email({ message: 'Invalid Email!' }),
  password: z
    .string()
    .min(6, { message: 'Password must be at least 6 characters!' })
});
type Schema = z.infer<typeof registerSchema | typeof loginSchema>;

export default function Auth() {
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const { mutate, isPending } = useUserMutation();
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<Schema>({
    resolver: zodResolver(isLoginMode ? loginSchema : registerSchema)
  });

  const onSubmit = async (formBody: Schema) => {
    toast.loading(`${isLoginMode ? 'Logging in...' : 'Registering...'}`, {
      duration: Infinity
    });
    let options: MutateUserOptions | undefined = undefined;
    if (isLoginMode) {
      options = {
        type: 'login',
        data: { email: formBody.email, password: formBody.password }
      };
    } else {
      options = {
        type: 'register',
        data: {
          email: formBody.email,
          password: formBody.password,
          name: formBody.name || ''
        }
      };
    }
    mutate(options, {
      onSuccess() {
        toast.dismiss();
        toast.success(
          isLoginMode ? 'User logged in' : 'User registered successfully'
        );
        router.push('/');
      },
      onError(err) {
        toast.dismiss();
        toast.error(err.message);
      }
    });
  };

  return (
    <main
      className={`grid h-screen min-h-screen flex-1 place-items-center overflow-y-auto bg-gray-900 text-neutral-200 sm:py-10`}
    >
      <section className="flex h-full w-full flex-col justify-center rounded-lg bg-neutral-800/50 px-4 pb-8 sm:h-fit sm:max-w-screen-xs sm:px-8">
        <div className="relative flex flex-col items-center space-y-1 py-10">
          <h2 className="text-xl font-semibold text-white md:text-2xl">
            {isLoginMode ? 'Welcome back' : 'Get started with Flashey'}
          </h2>
          <div className="absolute inset-0 grid place-items-center">
            <div className="h-5/6 w-9/12 bg-sky-900/30 blur-3xl filter" />
          </div>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex w-full flex-col space-y-5 font-medium text-neutral-300"
        >
          {!isLoginMode && (
            <div className="space-y-2">
              <label htmlFor="name">Name</label>
              <div className="group flex h-11 items-center space-x-2 rounded-md border-2 border-neutral-700 px-2.5 font-medium focus-within:border-neutral-500">
                <UserIcon className="h-5 w-5 text-neutral-500" />
                <input
                  {...register('name')}
                  type="text"
                  id="name"
                  placeholder="Enter your name..."
                  className="flex-1 bg-transparent placeholder:text-neutral-500"
                />
              </div>
              <p className="font-base text-sm text-rose-500">
                {errors.name?.message}
              </p>
            </div>
          )}

          <div className="space-y-2">
            <label htmlFor="email">Email Address</label>
            <div className="group flex h-11 items-center space-x-2 rounded-md border-2 border-neutral-700 px-2.5 font-medium focus-within:border-neutral-500">
              <EnvelopeIcon className="h-5 w-5 text-neutral-500" />
              <input
                {...register('email')}
                autoFocus
                type="text"
                id="email"
                placeholder="Enter your email..."
                className="flex-1 bg-transparent placeholder:text-neutral-500"
              />
            </div>
            <p className="font-base text-sm text-rose-500">
              {errors.email?.message}
            </p>
          </div>

          <div className="space-y-2">
            <label htmlFor="password">Password</label>
            <div className="group flex h-11 items-center space-x-2 rounded-md border-2 border-neutral-700 px-2.5 font-medium focus-within:border-neutral-500">
              <LockClosedIcon className="h-5 w-5 text-neutral-500" />
              <input
                {...register('password')}
                type={`${showPassword ? 'text' : 'password'}`}
                id="password"
                placeholder="Enter your password..."
                className="flex-1 bg-transparent placeholder:text-neutral-500"
              />
              {showPassword ? (
                <EyeIcon
                  onClick={() => setShowPassword(false)}
                  className="h-5 w-5 cursor-pointer text-neutral-500"
                />
              ) : (
                <EyeSlashIcon
                  onClick={() => setShowPassword(true)}
                  className="h-5 w-5 cursor-pointer text-neutral-500"
                />
              )}
            </div>
            <p className="font-base text-sm text-rose-500">
              {errors.password?.message}
            </p>
          </div>

          <button
            type="submit"
            className="flex h-10 items-center justify-center space-x-1 rounded-md bg-gray-700/40 font-medium text-neutral-200 ring-neutral-500/50 hover:bg-gray-700/40 focus:ring-2"
          >
            {!isPending ? (
              <>
                <span>{isLoginMode ? 'Login' : 'Register'}</span>
                <ChevronRightIcon className="h-4 w-4" />
              </>
            ) : (
              <BiLoader className="h-4.5 w-4.5 animate-spin text-neutral-200" />
            )}
          </button>

          <div className="flex items-center space-x-3">
            <span className="h-0.5 flex-1 rounded-full bg-gray-700" />
            <span className="text-sm text-neutral-300">or</span>
            <span className="h-0.5 flex-1 rounded-full bg-gray-700" />
          </div>

          <button
            type="button"
            onClick={() => {
              window.open(`${backend_url}/api/login/google`, '_blank');
              window.close();
            }}
            className="flex h-10 items-center justify-center space-x-2 rounded-md bg-neutral-200 font-semibold text-black hover:bg-neutral-100"
          >
            <span>Continue with Google</span>
            <img src="/google.png" alt="google icon" className="h-4 w-4" />
          </button>

          <p className="text-center">
            <span className="text-sm font-normal text-neutral-400">
              {isLoginMode
                ? "Don't have an account?"
                : 'Already have an account?'}
            </span>{' '}
            <button
              onClick={() => setIsLoginMode(!isLoginMode)}
              className="text-base"
            >
              {isLoginMode ? 'Register' : 'Login'}
            </button>
          </p>
        </form>
      </section>
    </main>
  );
}
