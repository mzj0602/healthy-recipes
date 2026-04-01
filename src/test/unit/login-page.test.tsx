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

  // T11: shadcn 组件渲染验证
  it('渲染 shadcn Input — 存在两个文本输入框', () => {
    render(<LoginPage onLogin={vi.fn()} />);
    // username textbox + password input (queried by role)
    const textboxes = screen.getAllByRole('textbox');
    expect(textboxes).toHaveLength(1); // only username is role=textbox; password is type=password
    expect(screen.getByPlaceholderText('请输入用户名')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('请输入密码')).toBeInTheDocument();
  });

  it('渲染 shadcn Button — 登录按钮文字正确', () => {
    render(<LoginPage onLogin={vi.fn()} />);
    const btn = screen.getByRole('button', { name: '登录' });
    expect(btn).toBeInTheDocument();
  });

  it('正确凭证提交 — onLogin 参数含 username: demo', async () => {
    const onLogin = vi.fn();
    render(<LoginPage onLogin={onLogin} />);

    fireEvent.change(screen.getByLabelText('用户名'), { target: { value: 'demo' } });
    fireEvent.change(screen.getByLabelText('密码'), { target: { value: '123456' } });
    fireEvent.click(screen.getByRole('button', { name: '登录' }));

    await waitFor(() => {
      expect(onLogin).toHaveBeenCalledWith(expect.objectContaining({ username: 'demo' }));
    }, { timeout: 1200 });
  });

  // T12: 无硬编码 hex 颜色
  it('渲染后 className 不包含硬编码 hex 颜色值', () => {
    const { container } = render(<LoginPage onLogin={vi.fn()} />);
    const allElements = container.querySelectorAll('*');
    const hexPattern = /#[0-9a-fA-F]{3,6}\b/;
    allElements.forEach((el) => {
      const cls = el.getAttribute('class') ?? '';
      expect(hexPattern.test(cls), `Element <${el.tagName.toLowerCase()}> has hex color in class: "${cls}"`).toBe(false);
    });
  });
});
