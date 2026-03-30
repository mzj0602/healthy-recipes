import { useState } from 'react';
import { Lock, User } from 'lucide-react';

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
    <div className="flex min-h-screen items-center justify-center bg-[#f9f8f6] px-4 py-12">
      <div className="w-full max-w-md rounded-2xl border border-[#f2dfcf] bg-white p-8 shadow-[0_20px_60px_rgba(63,38,23,0.08)] sm:p-10">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#ec7f13] text-white shadow-lg">
            <svg className="h-7 w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
            </svg>
          </div>
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-[#ec7f13]">FreshPlate</p>
          <h1 className="mt-3 text-3xl font-bold tracking-[-0.03em] text-[#3f2617]">账号登录</h1>
          <p className="mt-2 text-sm text-[#8b6b55]">输入用户名和密码即可进入健康食谱系统</p>
          <p className="mt-3 rounded-xl bg-[#fff4e8] px-4 py-3 text-xs text-[#9a5b1a]">
            演示账号：<span className="font-semibold">demo</span> / <span className="font-semibold">123456</span>
          </p>
        </div>

        <form className="space-y-5" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-[#5d4230]" htmlFor="username">
              用户名
            </label>
            <div className="relative">
              <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#aa8367]" />
              <input
                id="username"
                type="text"
                autoComplete="username"
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                placeholder="请输入用户名"
                className="w-full rounded-xl border border-[#e7d7ca] bg-[#fffdfb] py-3 pl-10 pr-4 text-sm text-[#3f2617] outline-none transition focus:border-[#ec7f13] focus:ring-4 focus:ring-[#ec7f13]/10"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-[#5d4230]" htmlFor="password">
              密码
            </label>
            <div className="relative">
              <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#aa8367]" />
              <input
                id="password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="请输入密码"
                className="w-full rounded-xl border border-[#e7d7ca] bg-[#fffdfb] py-3 pl-10 pr-4 text-sm text-[#3f2617] outline-none transition focus:border-[#ec7f13] focus:ring-4 focus:ring-[#ec7f13]/10"
              />
            </div>
          </div>

          {error ? (
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          ) : null}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-xl bg-[#ec7f13] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#c7670b] disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isSubmitting ? '登录中...' : '登录'}
          </button>
        </form>
      </div>
    </div>
  );
}
