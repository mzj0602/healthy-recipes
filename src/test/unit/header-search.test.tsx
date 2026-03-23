import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createStore, Provider } from 'jotai';
import { SiteChrome } from '@/features/meal-planner/components/site-chrome';
import { searchAtom } from '@/features/recipes/store/recipeAtoms';

function renderSiteChrome(
  activePage: 'home' | 'recipes' | 'plan' | 'detail' = 'home',
  onNavigate = vi.fn(),
  store = createStore(),
) {
  render(
    <Provider store={store}>
      <SiteChrome activePage={activePage} onNavigate={onNavigate} />
    </Provider>,
  );
  return { store, onNavigate };
}

describe('HeaderSearch', () => {
  let onNavigate: ReturnType<typeof vi.fn>;
  let store: ReturnType<typeof createStore>;

  beforeEach(() => {
    onNavigate = vi.fn();
    store = createStore();
  });

  it('点击搜索图标后 input 出现', () => {
    renderSiteChrome('home', onNavigate, store);

    // input 初始不可见（宽度为 0）
    const input = screen.getByPlaceholderText('搜索菜谱...');
    const wrapper = input.parentElement!;
    expect(wrapper.className).toContain('w-0');

    fireEvent.click(screen.getByRole('button', { name: '搜索' }));

    expect(wrapper.className).toContain('w-[220px]');
  });

  it('输入空字符串按 Enter：searchAtom 不被写入，onNavigate 不被调用', () => {
    renderSiteChrome('home', onNavigate, store);

    fireEvent.click(screen.getByRole('button', { name: '搜索' }));

    const input = screen.getByPlaceholderText('搜索菜谱...');
    fireEvent.keyDown(input, { key: 'Enter' });

    expect(store.get(searchAtom)).toBe('');
    expect(onNavigate).not.toHaveBeenCalled();
  });

  it('输入关键词按 Enter：searchAtom = 关键词，onNavigate("recipes") 被调用', () => {
    renderSiteChrome('home', onNavigate, store);

    fireEvent.click(screen.getByRole('button', { name: '搜索' }));

    const input = screen.getByPlaceholderText('搜索菜谱...');
    fireEvent.change(input, { target: { value: '三文鱼' } });
    fireEvent.keyDown(input, { key: 'Enter' });

    expect(store.get(searchAtom)).toBe('三文鱼');
    expect(onNavigate).toHaveBeenCalledWith('recipes');
  });

  it('已在 recipes 页搜索：onNavigate 不被重复调用', () => {
    renderSiteChrome('recipes', onNavigate, store);

    fireEvent.click(screen.getByRole('button', { name: '搜索' }));

    const input = screen.getByPlaceholderText('搜索菜谱...');
    fireEvent.change(input, { target: { value: '高蛋白' } });
    fireEvent.keyDown(input, { key: 'Enter' });

    expect(store.get(searchAtom)).toBe('高蛋白');
    expect(onNavigate).not.toHaveBeenCalled();
  });

  it('按 Esc 键：input 收起，localValue 清空', () => {
    renderSiteChrome('home', onNavigate, store);

    fireEvent.click(screen.getByRole('button', { name: '搜索' }));

    const input = screen.getByPlaceholderText('搜索菜谱...');
    fireEvent.change(input, { target: { value: '牛油果' } });
    expect(input).toHaveValue('牛油果');

    fireEvent.keyDown(input, { key: 'Escape' });

    expect(input).toHaveValue('');
    const wrapper = input.parentElement!;
    expect(wrapper.className).toContain('w-0');
  });
});
