import { useState } from 'react';
import { Lock, User } from 'lucide-react';

interface LoginPageProps {
  onLogin: (payload: { username: string }) => void;
}

const demoAccount = {
  username: 'demo',
  password: '123456',
};

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
    </svg>
  );
}

function WeChatIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="#07C160" aria-hidden="true">
      <path d="M8.691 2.188C3.891 2.188 0 5.476 0 9.53c0 2.212 1.17 4.203 3.002 5.55a.59.59 0 0 1 .213.665l-.39 1.48c-.019.07-.048.141-.048.213 0 .163.13.295.295.295a.326.326 0 0 0 .167-.054l1.903-1.114a.864.864 0 0 1 .717-.098 10.16 10.16 0 0 0 2.837.403c.276 0 .543-.027.811-.05-.857-2.578.157-5.972 2.938-7.746 1.37-.879 2.9-1.362 4.516-1.362.03 0 .057.005.087.005C15.853 4.501 12.537 2.188 8.691 2.188zm-2.336 3.583a.96.96 0 1 1 0 1.92.96.96 0 0 1 0-1.92zm4.668 0a.96.96 0 1 1 0 1.92.96.96 0 0 1 0-1.92zM19.586 8.494c-2.415 0-4.43 1.532-4.43 3.783 0 2.252 2.015 3.783 4.43 3.783.493 0 .97-.073 1.42-.2a.44.44 0 0 1 .358.049l1.005.587a.163.163 0 0 0 .083.027.148.148 0 0 0 .148-.148.182.182 0 0 0-.024-.106l-.195-.74a.295.295 0 0 1 .107-.332C23.14 14.378 24 13.2 24 11.894c0-1.93-1.973-3.4-4.414-3.4zm-1.755 2.214a.575.575 0 1 1 0 1.15.575.575 0 0 1 0-1.15zm3.51 0a.575.575 0 1 1 0 1.15.575.575 0 0 1 0-1.15z" />
    </svg>
  );
}

export function LoginPage({ onLogin }: LoginPageProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

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
    }, 500);
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#fdf9f3]">
      {/* Top App Bar */}
      <header className="sticky top-0 z-20 flex items-center justify-between border-b border-[#ddc1b0]/30 bg-[#fdf9f3]/90 px-6 py-4 backdrop-blur-xl">
        <span className="font-['Epilogue',sans-serif] text-xl font-bold text-[#964900]">FreshPlate</span>
        <div className="flex items-center gap-3">
          <button
            type="button"
            className="text-sm font-medium text-[#564336] hover:text-[#964900]"
          >
            返回首页
          </button>
          <button
            type="button"
            className="rounded-xl bg-[#964900] px-4 py-2 text-sm font-semibold text-white hover:bg-[#7a3c00] active:scale-95"
          >
            Sign Up
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative flex flex-1 items-center justify-center overflow-hidden px-4 py-16">
        {/* Background blobs */}
        <div className="pointer-events-none absolute -left-32 -top-32 h-96 w-96 rounded-full bg-[#f5821f]/5 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-[#006590]/5 blur-3xl" />

        {/* Decorative images – desktop only */}
        <div className="pointer-events-none absolute left-16 top-1/2 hidden -translate-y-1/2 -rotate-6 opacity-20 lg:block">
          <div className="h-64 w-48 rounded-xl bg-[#f5821f]/20 shadow-2xl" />
        </div>
        <div className="pointer-events-none absolute right-16 top-1/2 hidden -translate-y-1/2 rotate-6 opacity-20 lg:block">
          <div className="h-64 w-48 rounded-xl bg-[#006590]/20 shadow-2xl" />
        </div>

        {/* Login Card */}
        <div className="relative z-10 w-full max-w-md rounded-xl border border-[#ddc1b0]/10 bg-white p-8 shadow-[0_12px_32px_rgba(28,28,24,0.06)] md:p-12">
          {/* Card Header */}
          <div className="mb-10 text-center">
            <span className="font-['Epilogue',sans-serif] text-4xl font-extrabold text-[#f5821f]">
              FreshPlate
            </span>
            <h1 className="mt-6 font-['Epilogue',sans-serif] text-3xl font-bold text-[#1c1c18]">
              欢迎回来
            </h1>
            <p className="mt-2 text-sm text-[#564336]">继续您的健康烹饪之旅</p>
            <p className="mt-1 text-xs text-[#8a7264]">
              演示账号：<span className="font-semibold text-[#964900]">demo</span> / <span className="font-semibold text-[#964900]">123456</span>
            </p>
          </div>

          {/* Form */}
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Username */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-widest text-[#564336]" htmlFor="username">
                邮箱或用户名
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8a7264]" />
                <input
                  autoComplete="username"
                  className="w-full rounded-xl border border-[#ddc1b0] bg-[#f7f3ed] py-3 pl-10 pr-4 text-sm text-[#1c1c18] placeholder:text-[#8a7264] focus:outline-none focus:ring-2 focus:ring-[#964900]/20"
                  id="username"
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="请输入用户名"
                  value={username}
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-widest text-[#564336]" htmlFor="password">
                密码
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8a7264]" />
                <input
                  autoComplete="current-password"
                  className="w-full rounded-xl border border-[#ddc1b0] bg-[#f7f3ed] py-3 pl-10 pr-4 text-sm text-[#1c1c18] placeholder:text-[#8a7264] focus:outline-none focus:ring-2 focus:ring-[#964900]/20"
                  id="password"
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="请输入密码"
                  type="password"
                  value={password}
                />
              </div>
            </div>

            {/* Options row */}
            <div className="flex items-center justify-between">
              <label className="flex cursor-pointer items-center gap-2 text-sm text-[#564336]">
                <input
                  checked={rememberMe}
                  className="h-4 w-4 rounded border-[#ddc1b0] accent-[#964900]"
                  onChange={(e) => setRememberMe(e.target.checked)}
                  type="checkbox"
                />
                记住我
              </label>
              <button type="button" className="text-sm font-medium text-[#964900] hover:underline">
                忘记密码?
              </button>
            </div>

            {/* Error */}
            {error ? (
              <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                {error}
              </div>
            ) : null}

            {/* Submit */}
            <button
              className="w-full rounded-xl bg-gradient-to-br from-[#964900] to-[#f5821f] py-4 font-['Epilogue',sans-serif] text-lg font-bold text-white transition-transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70"
              disabled={isSubmitting}
              type="submit"
            >
              {isSubmitting ? '登录中...' : '登录'}
            </button>
          </form>

          {/* Divider */}
          <div className="my-6 flex items-center gap-3">
            <div className="h-px flex-1 bg-[#ddc1b0]/50" />
            <span className="text-xs text-[#8a7264]">或使用社交账号登录</span>
            <div className="h-px flex-1 bg-[#ddc1b0]/50" />
          </div>

          {/* Social buttons */}
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              className="flex items-center justify-center gap-2 rounded-xl border border-[#ddc1b0]/50 bg-[#f7f3ed] py-3 text-sm font-medium text-[#1c1c18] hover:bg-[#ede8e1] active:scale-95"
            >
              <GoogleIcon />
              Google
            </button>
            <button
              type="button"
              className="flex items-center justify-center gap-2 rounded-xl border border-[#ddc1b0]/50 bg-[#f7f3ed] py-3 text-sm font-medium text-[#1c1c18] hover:bg-[#ede8e1] active:scale-95"
            >
              <WeChatIcon />
              微信
            </button>
          </div>

          {/* Sign up link */}
          <p className="mt-6 text-center text-sm text-[#564336]">
            还没有账号?{' '}
            <button type="button" className="font-bold text-[#964900] hover:underline">
              立即注册
            </button>
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer className="flex flex-col items-center justify-between gap-4 bg-stone-100 px-6 py-6 text-sm text-stone-500 sm:flex-row">
        <span className="font-['Epilogue',sans-serif] font-bold text-[#7c2d12]">FreshPlate.</span>
        <div className="flex flex-wrap justify-center gap-4">
          {['隐私政策', '服务条款', '帮助中心', '联系我们'].map((link) => (
            <button key={link} type="button" className="hover:text-orange-600">
              {link}
            </button>
          ))}
        </div>
        <span className="text-xs">© 2024 FreshPlate. The Artisanal Kitchen.</span>
      </footer>
    </div>
  );
}
