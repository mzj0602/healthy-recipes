import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

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
    }, 500);
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(236,127,19,0.14),_transparent_35%),linear-gradient(180deg,#fffaf5_0%,#f9f8f6_48%,#f4efe9_100%)] px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-6xl items-center justify-center">
        <div className="grid w-full overflow-hidden rounded-[28px] border border-white/60 bg-white/85 shadow-[0_30px_80px_-32px_rgba(63,38,23,0.3)] backdrop-blur md:grid-cols-[1.05fr_0.95fr]">
          <section className="flex flex-col justify-between bg-[#fff7f0] px-7 py-8 sm:px-10 sm:py-10">
            <div className="space-y-6">
              <div className="inline-flex w-fit items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-[#c7670b] shadow-sm">
                FreshPlate
                <span className="rounded-full bg-[#fde6d0] px-2 py-0.5 text-xs text-[#a95505]">健康饮食平台</span>
              </div>

              <div className="space-y-4">
                <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[#c7670b]">欢迎回来</p>
                <h1 className="max-w-md text-4xl font-black leading-tight tracking-[-0.03em] text-[#3f2617] sm:text-5xl">
                  登录后继续管理你的健康食谱与饮食计划
                </h1>
                <p className="max-w-xl text-base leading-7 text-[#8a674f] sm:text-lg">
                  先做一个轻量版登录页：支持用户名和密码登录，登录成功后即可进入当前应用主页。
                </p>
              </div>
            </div>

            <div className="mt-10 grid gap-4 sm:grid-cols-3">
              {[
                ['个性化食谱', '快速查看推荐菜谱和营养搭配'],
                ['饮食计划', '继续编辑你的每日摄入安排'],
                ['简单登录', '当前演示账号可直接体验流程'],
              ].map(([title, desc]) => (
                <div className="rounded-[20px] border border-[#f2dfcf] bg-white/90 p-4 shadow-sm" key={title}>
                  <p className="text-sm font-bold text-[#3f2617]">{title}</p>
                  <p className="mt-2 text-sm leading-6 text-[#8a674f]">{desc}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="flex items-center px-6 py-8 sm:px-10 sm:py-10">
            <div className="mx-auto w-full max-w-md">
              <div className="rounded-[24px] border border-[#f5e7da] bg-white p-6 shadow-[0_20px_50px_-30px_rgba(236,127,19,0.45)] sm:p-8">
                <div className="space-y-2">
                  <h2 className="text-2xl font-bold tracking-[-0.02em] text-[#3f2617]">账号登录</h2>
                  <p className="text-sm leading-6 text-[#8a674f]">
                    使用用户名和密码登录。
                    <br />
                    演示账号：<span className="font-semibold text-[#c7670b]">demo</span> / <span className="font-semibold text-[#c7670b]">123456</span>
                  </p>
                </div>

                <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-[#5d4230]" htmlFor="username">
                      用户名
                    </label>
                    <Input
                      autoComplete="username"
                      className="h-11 rounded-[16px] border-[#ead7c5] bg-[#fffdfa]"
                      id="username"
                      onChange={(event) => setUsername(event.target.value)}
                      placeholder="请输入用户名"
                      value={username}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-[#5d4230]" htmlFor="password">
                      密码
                    </label>
                    <Input
                      autoComplete="current-password"
                      className="h-11 rounded-[16px] border-[#ead7c5] bg-[#fffdfa]"
                      id="password"
                      onChange={(event) => setPassword(event.target.value)}
                      placeholder="请输入密码"
                      type="password"
                      value={password}
                    />
                  </div>

                  {error ? (
                    <div className="rounded-[16px] border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                      {error}
                    </div>
                  ) : null}

                  <Button className="h-11 w-full rounded-[16px] text-sm font-semibold" disabled={isSubmitting} size="lg" type="submit">
                    {isSubmitting ? '登录中...' : '登录'}
                  </Button>
                </form>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
