import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { LoginPage } from '@/features/meal-planner/components/login-page';

describe('LoginPage', () => {
  it('用户名或密码为空时显示必填错误', () => {
    const onLogin = vi.fn();

    render(<LoginPage onLogin={onLogin} />);

    fireEvent.click(screen.getByRole('button', { name: '登录' }));

    expect(screen.getByText('请输入用户名和密码')).toBeVisible();
    expect(onLogin).not.toHaveBeenCalled();
  });

  it('错误凭证时显示登录失败信息', async () => {
    const onLogin = vi.fn();

    render(<LoginPage onLogin={onLogin} />);

    fireEvent.change(screen.getByLabelText('用户名'), { target: { value: 'wrong' } });
    fireEvent.change(screen.getByLabelText('密码'), { target: { value: 'badpass' } });
    fireEvent.click(screen.getByRole('button', { name: '登录' }));

    await waitFor(() => {
      expect(screen.getByText('用户名或密码错误')).toBeVisible();
    }, { timeout: 1200 });
    expect(onLogin).not.toHaveBeenCalled();
  });

  it('正确凭证时触发登录回调', async () => {
    const onLogin = vi.fn();

    render(<LoginPage onLogin={onLogin} />);

    fireEvent.change(screen.getByLabelText('用户名'), { target: { value: 'demo' } });
    fireEvent.change(screen.getByLabelText('密码'), { target: { value: '123456' } });
    fireEvent.click(screen.getByRole('button', { name: '登录' }));

    await waitFor(() => {
      expect(onLogin).toHaveBeenCalledWith({ username: 'demo' });
    }, { timeout: 1200 });
  });
});
