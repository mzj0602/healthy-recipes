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
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#fdf9f3', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      {/* Fixed Header */}
      <header className="backdrop-blur-xl fixed top-0 w-full z-50" style={{ backgroundColor: '#fdf9f3' }}>
        <nav className="flex justify-between items-center px-6 py-4 max-w-7xl mx-auto">
          <div
            className="text-2xl font-bold tracking-tight"
            style={{ fontFamily: 'Epilogue, sans-serif', color: '#9a3412' }}
          >
            FreshPlate
          </div>
          <div className="flex items-center gap-6">
            <span
              className="text-stone-600 font-medium cursor-default"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            >
              返回首页
            </span>
            <span
              className="px-5 py-2 rounded-xl font-bold text-sm text-white cursor-default"
              style={{ backgroundColor: '#964900' }}
            >
              Sign Up
            </span>
          </div>
        </nav>
      </header>

      {/* Main */}
      <main className="flex-grow flex items-center justify-center pt-24 pb-16 px-4 relative overflow-hidden">
        {/* Background blurs */}
        <div className="absolute top-20 -left-20 w-96 h-96 rounded-full blur-3xl" style={{ backgroundColor: 'rgba(245,130,31,0.05)' }} />
        <div className="absolute bottom-20 -right-20 w-96 h-96 rounded-full blur-3xl" style={{ backgroundColor: 'rgba(0,171,241,0.05)' }} />

        {/* Decorative left image */}
        <div className="hidden lg:block absolute left-12 top-1/2 -translate-y-1/2 opacity-20" style={{ transform: 'translateY(-50%) rotate(-12deg)' }}>
          <img
            alt="Fresh salad bowl"
            className="w-48 h-64 object-cover rounded-xl shadow-2xl"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuA0H-M5gXbsM-gQ7EiyRFRCfjxGGhWm3zBtjQCpRBnVP0TgK7PxLj2z3tNA2NVRHV9MEmVnP7C1C9dd4PpJXov0WVyq4BP6cA_lynaRh2jvnvsRzM0qMgmY9NKyJoEOEAqoEs0qDcAC4GZx1QCu6XekNrrU2yonz5rhWtwZpRk88e3qulo0xD3Ow2tqjgsTrsR5uzTPyjtI6ub3q5ZdqO6b2DPOLq40yFO9NJvM15JJHeUBruGQT9ByfXtJqBkr8TbBG3NmvpOfpTo"
          />
        </div>

        {/* Decorative right image */}
        <div className="hidden lg:block absolute right-12 top-1/2 -translate-y-1/2 opacity-20" style={{ transform: 'translateY(-50%) rotate(8deg)' }}>
          <img
            alt="Healthy ingredients"
            className="w-48 h-64 object-cover rounded-xl shadow-2xl"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuCLbANgjc4MCEyaBBAPQhutqUnExOamkKNOilFEhl2YJPFezlr26v9_FeYwFKZ0RhIA31-xt9GCyXoua2V9PVfp6mreflaPC5w-diyjRMm_S9X9F8XVSRko5oX92MlDuFa-g8Fff5prpKeOUCIVsreVlR13fH12Q9cLT2s3zxmSndMDY0M7Dqsx006q9AWjaUWiY16OPjBbJpJ-uC67JzGpXHqVLJ3avkjsPfsZvAK23xTX8ETK0rxaXOUPFbbEIuypimiSJF6ATnM"
          />
        </div>

        {/* Login Card */}
        <div className="w-full max-w-md z-10">
          <div
            className="bg-white p-8 md:p-12 rounded-xl"
            style={{
              boxShadow: '0 12px 32px rgba(28,28,24,0.06)',
              border: '1px solid rgba(221,193,176,0.1)',
            }}
          >
            {/* Card header */}
            <div className="text-center mb-10">
              <span
                className="text-4xl font-extrabold tracking-tighter"
                style={{ fontFamily: 'Epilogue, sans-serif', color: '#f5821f' }}
              >
                FreshPlate
              </span>
              <h1
                className="text-3xl font-bold mt-6"
                style={{ fontFamily: 'Epilogue, sans-serif', color: '#1c1c18' }}
              >
                欢迎回来
              </h1>
              <p className="mt-2 text-sm" style={{ color: '#564336' }}>
                继续您的健康烹饪之旅
              </p>
              {/* Demo account hint */}
              <p
                className="mt-4 rounded-lg px-4 py-2 text-xs text-left"
                style={{ backgroundColor: '#f7f3ed', color: '#564336' }}
              >
                演示账号：<span className="font-semibold">demo</span> /{' '}
                <span className="font-semibold">123456</span>
              </p>
            </div>

            <form className="space-y-6" onSubmit={handleSubmit}>
              {/* Username */}
              <div className="space-y-1.5">
                <label
                  className="text-xs font-bold uppercase tracking-wider px-1"
                  htmlFor="username"
                  style={{ color: '#564336' }}
                >
                  邮箱或用户名
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none" style={{ color: '#8a7264' }}>
                    <User className="h-5 w-5" />
                  </div>
                  <Input
                    id="username"
                    type="text"
                    autoComplete="username"
                    value={username}
                    onChange={(event) => setUsername(event.target.value)}
                    placeholder="example@freshplate.com"
                    className={cn(
                      'pl-11 pr-4 py-3.5 border-none rounded-xl outline-none',
                      'focus:ring-2 focus:ring-offset-0 transition-all',
                      'placeholder:text-stone-400'
                    )}
                    style={{ backgroundColor: '#f7f3ed', color: '#1c1c18' }}
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <label
                  className="text-xs font-bold uppercase tracking-wider px-1"
                  htmlFor="password"
                  style={{ color: '#564336' }}
                >
                  密码
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none" style={{ color: '#8a7264' }}>
                    <Lock className="h-5 w-5" />
                  </div>
                  <Input
                    id="password"
                    type="password"
                    autoComplete="current-password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="••••••••"
                    className={cn(
                      'pl-11 pr-4 py-3.5 border-none rounded-xl outline-none',
                      'focus:ring-2 focus:ring-offset-0 transition-all',
                      'placeholder:text-stone-400'
                    )}
                    style={{ backgroundColor: '#f7f3ed', color: '#1c1c18' }}
                  />
                </div>
              </div>

              {/* Remember me + Forgot password */}
              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    className="w-4 h-4 rounded"
                    style={{ borderColor: '#ddc1b0' }}
                    readOnly
                  />
                  <span style={{ color: '#564336' }}>记住我</span>
                </label>
                <span className="font-semibold cursor-default" style={{ color: '#964900' }}>
                  忘记密码?
                </span>
              </div>

              {/* Error message */}
              {error ? (
                <div
                  className="rounded-lg px-4 py-3 text-sm"
                  style={{
                    backgroundColor: '#fff0f0',
                    color: '#ba1a1a',
                    border: '1px solid #fecaca',
                  }}
                >
                  {error}
                </div>
              ) : null}

              {/* Submit button */}
              <Button
                type="submit"
                variant="default"
                disabled={isSubmitting}
                className="w-full font-bold text-lg text-white py-4 rounded-xl hover:scale-[1.02] active:scale-[0.98] transition-all"
                style={{
                  fontFamily: 'Epilogue, sans-serif',
                  background: 'linear-gradient(135deg, #964900 0%, #f5821f 100%)',
                  boxShadow: '0 8px 20px rgba(245,130,31,0.2)',
                  height: 'auto',
                }}
              >
                {isSubmitting ? '登录中...' : '登录'}
              </Button>
            </form>

            {/* Separator */}
            <div className="relative my-10">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t" style={{ borderColor: 'rgba(221,193,176,0.2)' }} />
              </div>
              <div className="relative flex justify-center text-xs uppercase tracking-widest font-bold">
                <span className="bg-white px-4" style={{ color: '#8a7264' }}>
                  或使用社交账号登录
                </span>
              </div>
            </div>

            {/* Social login buttons */}
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                className="flex items-center justify-center gap-2 py-3 rounded-xl transition-all cursor-default"
                style={{ backgroundColor: '#f7f3ed' }}
                tabIndex={-1}
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                </svg>
                <span className="text-sm font-bold" style={{ color: '#1c1c18' }}>Google</span>
              </button>
              <button
                type="button"
                className="flex items-center justify-center gap-2 py-3 rounded-xl transition-all cursor-default"
                style={{ backgroundColor: '#f7f3ed' }}
                tabIndex={-1}
              >
                <svg className="w-6 h-6" fill="#07C160" viewBox="0 0 24 24">
                  <path d="M8.5 13.5a.75.75 0 100-1.5.75.75 0 000 1.5zm7 0a.75.75 0 100-1.5.75.75 0 000 1.5zM22 10.5c0-4.694-4.477-8.5-10-8.5s-10 3.806-10 8.5c0 2.533 1.252 4.811 3.235 6.43l-.735 2.57 3-1.5c1.4.5 3 .5 4.5.5.382 0 .764 0 1.144-.04.148.88.66 1.662 1.45 2.158l2.206 1.103-.541-1.892c1.458-1.192 2.381-2.868 2.381-4.731 0-.348-.032-.69-.094-1.023C20.67 13.12 22 11.944 22 10.5zM12 17.5c-1.3 0-2.5-.2-3.6-.6l-2.4 1.2.6-2.1c-1.6-1.3-2.6-3.1-2.6-5 0-3.9 3.6-7 8-7s8 3.1 8 7-3.6 7-8 7zm7.5-3c0 .8-.5 1.5-1.2 2.1l-.3 1.1 1.2-.6c.7-.4 1.3-.4 1.8-.4-.3.4-.5.8-.5 1.3 0 1.1 1 2 2.2 2 .4 0 .7-.1 1-.2l.7.3-.2-.6c.5-.4.8-1 1-1.6.4-.3.6-.8.6-1.3 0-1.1-1.1-2-2.5-2-.3 0-.6 0-.8.1.1-.3.1-.5.1-.8 0-1.4-1.3-2.5-3-2.5s-3 1.1-3 2.5 1.3 2.5 3 2.5c.3 0 .6-.1.9-.2z" />
                </svg>
                <span className="text-sm font-bold" style={{ color: '#1c1c18' }}>微信</span>
              </button>
            </div>

            {/* Register link */}
            <div className="mt-10 text-center text-sm">
              <span style={{ color: '#564336' }}>还没有账号?</span>
              <span className="font-bold ml-1 cursor-default" style={{ color: '#964900' }}>
                立即注册
              </span>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-stone-100 w-full mt-auto py-8">
        <div className="flex flex-col md:flex-row justify-between items-center px-8 max-w-7xl mx-auto gap-4">
          <div className="font-bold text-lg" style={{ fontFamily: 'Epilogue, sans-serif', color: '#7c2d12' }}>
            FreshPlate.
          </div>
          <div className="flex gap-8 text-stone-500 text-sm">
            <span className="cursor-default hover:text-orange-600 transition-all">Privacy Policy</span>
            <span className="cursor-default hover:text-orange-600 transition-all">Terms of Service</span>
            <span className="cursor-default hover:text-orange-600 transition-all">Help Center</span>
            <span className="cursor-default hover:text-orange-600 transition-all">Contact</span>
          </div>
          <p className="text-stone-500 text-xs">
            © 2024 FreshPlate. The Artisanal Kitchen.
          </p>
        </div>
      </footer>
    </div>
  );
}
