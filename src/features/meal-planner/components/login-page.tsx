import { useState } from 'react';
import { Lock, User } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface LoginPageProps {
  onLogin: (payload: { username: string }) => void;
}

const demoAccount = {
  username: 'demo',
  password: '123456',
};

// Harvest design token values — kept as constants to avoid hex in className
const harvest = {
  surface: '#fdf9f3',
  surfaceContainerLow: '#f7f3ed',
  onSurface: '#1c1c18',
  onSurfaceVariant: '#564336',
  primary: '#964900',
  primaryGradient: 'linear-gradient(135deg, #964900 0%, #f5821f 100%)',
  error: '#ba1a1a',
  errorBg: '#fff0f0',
  errorBorder: '#fecaca',
} as const;

export function LoginPage({ onLogin }: LoginPageProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');

    const normalizedUsername = username.trim();
    const normalizedPassword = password.trim();

    if (!normalizedUsername || !normalizedPassword) {
      setError('请输入用户名和密码');
      return;
    }

    setIsSubmitting(true);

    window.setTimeout(() => {
      if (
        normalizedUsername === demoAccount.username &&
        normalizedPassword === demoAccount.password
      ) {
        onLogin({ username: normalizedUsername });
        setIsSubmitting(false);
        return;
      }

      setError('用户名或密码错误');
      setIsSubmitting(false);
    }, 400);
  }

  return (
    <div className={cn('flex min-h-screen')} style={{ backgroundColor: harvest.surface }}>
      {/* Left Hero Column — hidden on mobile, shown on lg+ */}
      <div className="hidden lg:flex lg:w-[55%] relative overflow-hidden">
        <img
          src="/images/featured-quinoa-bowl.jpg"
          alt="健康美食"
          className="object-cover w-full h-full"
        />
        {/* Gradient overlay */}
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0.1) 60%, transparent 100%)' }}
        />
        {/* Brand tagline */}
        <div className="absolute bottom-12 left-12 right-12 text-white">
          <h2
            className="text-4xl font-extrabold leading-tight"
            style={{ fontFamily: 'Epilogue, serif' }}
          >
            用新鲜食材
          </h2>
          <h2
            className="text-4xl font-extrabold leading-tight"
            style={{ fontFamily: 'Epilogue, serif' }}
          >
            开启健康生活
          </h2>
          <p className="mt-4 text-base" style={{ color: 'rgba(255,255,255,0.8)' }}>
            探索数百种营养均衡的美味食谱
          </p>
        </div>
      </div>

      {/* Right Form Column */}
      <div className="flex flex-col flex-1 lg:w-[45%]">
        {/* Top navigation bar */}
        <nav className="flex items-center justify-between px-8 py-5">
          <span
            className="text-xl font-extrabold tracking-tight"
            style={{ fontFamily: 'Epilogue, serif', color: harvest.primary }}
          >
            FreshPlate
          </span>
          {/* Register button — visual only, no action */}
          <button
            type="button"
            className="cursor-default pointer-events-none rounded-md border px-4 py-1.5 text-sm font-medium"
            style={{ borderColor: harvest.primary, color: harvest.primary, backgroundColor: 'transparent' }}
            tabIndex={-1}
            aria-hidden="true"
          >
            注册
          </button>
        </nav>

        {/* Form area */}
        <div className="flex flex-1 items-center justify-center px-8 py-12">
          <div className="w-full max-w-md">
            {/* Header */}
            <div className="mb-8">
              <h1
                className="text-3xl font-bold"
                style={{ fontFamily: 'Epilogue, serif', color: harvest.onSurface }}
              >
                账号登录
              </h1>
              <p className="mt-2 text-sm" style={{ color: harvest.onSurfaceVariant }}>
                输入用户名和密码即可进入健康食谱系统
              </p>
              {/* Demo account hint */}
              <p
                className="mt-4 rounded-lg px-4 py-3 text-xs"
                style={{ backgroundColor: harvest.surfaceContainerLow, color: harvest.onSurfaceVariant }}
              >
                演示账号：<span className="font-semibold">demo</span> /{' '}
                <span className="font-semibold">123456</span>
              </p>
            </div>

            <form className="space-y-5" onSubmit={handleSubmit}>
              {/* Username */}
              <div className="space-y-1.5">
                <label
                  className="text-sm font-semibold"
                  htmlFor="username"
                  style={{ color: harvest.onSurface }}
                >
                  用户名
                </label>
                <div className="relative">
                  <User
                    className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2"
                    style={{ color: harvest.onSurfaceVariant }}
                  />
                  <Input
                    id="username"
                    type="text"
                    autoComplete="username"
                    value={username}
                    onChange={(event) => setUsername(event.target.value)}
                    placeholder="请输入用户名"
                    className="border-none py-3 pl-10 pr-4"
                    style={{ backgroundColor: harvest.surfaceContainerLow, borderRadius: '0.5rem' }}
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <label
                  className="text-sm font-semibold"
                  htmlFor="password"
                  style={{ color: harvest.onSurface }}
                >
                  密码
                </label>
                <div className="relative">
                  <Lock
                    className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2"
                    style={{ color: harvest.onSurfaceVariant }}
                  />
                  <Input
                    id="password"
                    type="password"
                    autoComplete="current-password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="请输入密码"
                    className="border-none py-3 pl-10 pr-4"
                    style={{ backgroundColor: harvest.surfaceContainerLow, borderRadius: '0.5rem' }}
                  />
                </div>
              </div>

              {/* Remember me + Forgot password */}
              <div className="flex items-center justify-between text-sm">
                <label
                  className="flex items-center gap-2 cursor-default select-none"
                  style={{ color: harvest.onSurfaceVariant }}
                >
                  <input type="checkbox" className="rounded" readOnly />
                  记住我
                </label>
                <span className="cursor-default" style={{ color: harvest.primary }}>
                  忘记密码？
                </span>
              </div>

              {/* Error message */}
              {error ? (
                <div
                  className="rounded-lg px-4 py-3 text-sm"
                  style={{
                    backgroundColor: harvest.errorBg,
                    color: harvest.error,
                    border: `1px solid ${harvest.errorBorder}`,
                  }}
                >
                  {error}
                </div>
              ) : null}

              {/* Submit button — Harvest gradient */}
              <Button
                type="submit"
                variant="default"
                size="lg"
                disabled={isSubmitting}
                className="w-full font-bold text-base text-white hover:scale-[1.02] transition-transform"
                style={{
                  fontFamily: 'Epilogue, serif',
                  background: harvest.primaryGradient,
                  borderRadius: '0.75rem',
                  boxShadow: '0 12px 32px rgba(28, 28, 24, 0.06)',
                }}
              >
                {isSubmitting ? '登录中...' : '登录'}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
