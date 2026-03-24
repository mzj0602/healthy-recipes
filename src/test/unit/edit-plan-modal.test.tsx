import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { EditPlanModal } from '@/features/health-plan/components/edit-plan-modal';
import type { DayPlan, NutrientGoal } from '@/features/health-plan/types';

const mockPlan: DayPlan[] = [
  {
    id: 'monday',
    day: '周一',
    accent: 'dark',
    meals: [
      { id: 'mon-breakfast', type: '早餐', title: '希腊酸奶', calories: 320 },
      { id: 'mon-lunch', type: '午餐', title: '鸡肉沙拉', calories: 450 },
    ],
  },
  {
    id: 'tuesday',
    day: '周二',
    accent: 'brand',
    meals: [{ id: 'tue-breakfast', type: '早餐', title: '牛油果吐司', calories: 380 }],
  },
];

const mockGoals: NutrientGoal[] = [
  { id: 'protein', label: '蛋白质', valueLabel: '(120g/150g)', percent: 80 },
  { id: 'calories', label: '热量', valueLabel: '(1850/2200)', percent: 84 },
];

function renderModal(overrides?: {
  onSave?: ReturnType<typeof vi.fn>;
  onClose?: ReturnType<typeof vi.fn>;
}) {
  const onSave = overrides?.onSave ?? vi.fn();
  const onClose = overrides?.onClose ?? vi.fn();
  render(
    <EditPlanModal
      plan={mockPlan}
      goals={mockGoals}
      onSave={onSave}
      onClose={onClose}
    />,
  );
  return { onSave, onClose };
}

describe('EditPlanModal', () => {
  it('草稿隔离：修改 draft 不影响原 props，取消时 onSave 未被调用', () => {
    const { onSave, onClose } = renderModal();

    // 修改餐食名称
    const inputs = screen.getAllByPlaceholderText('餐食名称');
    fireEvent.change(inputs[0], { target: { value: '修改后名称' } });

    // 点击取消
    fireEvent.click(screen.getByRole('button', { name: '取消' }));

    expect(onClose).toHaveBeenCalledTimes(1);
    expect(onSave).not.toHaveBeenCalled();
    // 原 props 不受影响
    expect(mockPlan[0].meals[0].title).toBe('希腊酸奶');
  });

  it('updateMeal 正确更新指定 day/meal 的 title', () => {
    const { onSave } = renderModal();

    const inputs = screen.getAllByPlaceholderText('餐食名称');
    fireEvent.change(inputs[0], { target: { value: '新早餐' } });

    fireEvent.click(screen.getByRole('button', { name: '保存计划' }));

    expect(onSave).toHaveBeenCalledTimes(1);
    const [savedPlan] = onSave.mock.calls[0] as [DayPlan[], NutrientGoal[]];
    expect(savedPlan[0].meals[0].title).toBe('新早餐');
    // 其他 meal 不变
    expect(savedPlan[0].meals[1].title).toBe('鸡肉沙拉');
  });

  it('updateMeal 正确更新指定 meal 的 calories', () => {
    const { onSave } = renderModal();

    // calories number inputs (每行有一个 number input)
    const numberInputs = screen.getAllByRole('spinbutton');
    // 第一个是 percent input of goals, 餐食 calories 在后面
    // goals 有 2 个 percent input, 然后是 meals calories
    // 先找到周一的第一个 meal calories input
    // 目标区有 2 个 percent spinbutton，餐食区有 2 个 calories spinbutton
    // index 2 = 第一个餐食 calories
    fireEvent.change(numberInputs[2], { target: { value: '999' } });

    fireEvent.click(screen.getByRole('button', { name: '保存计划' }));

    const [savedPlan] = onSave.mock.calls[0] as [DayPlan[], NutrientGoal[]];
    expect(savedPlan[0].meals[0].calories).toBe(999);
  });

  it('percent 边界：输入 -1 → 0', () => {
    const { onSave } = renderModal();

    const percentInputs = screen.getAllByRole('spinbutton');
    // 第一个是蛋白质 percent
    fireEvent.change(percentInputs[0], { target: { value: '-1' } });

    fireEvent.click(screen.getByRole('button', { name: '保存计划' }));

    const [, savedGoals] = onSave.mock.calls[0] as [DayPlan[], NutrientGoal[]];
    expect(savedGoals[0].percent).toBe(0);
  });

  it('percent 边界：输入 150 → 100', () => {
    const { onSave } = renderModal();

    const percentInputs = screen.getAllByRole('spinbutton');
    fireEvent.change(percentInputs[0], { target: { value: '150' } });

    fireEvent.click(screen.getByRole('button', { name: '保存计划' }));

    const [, savedGoals] = onSave.mock.calls[0] as [DayPlan[], NutrientGoal[]];
    expect(savedGoals[0].percent).toBe(100);
  });

  it('点击取消调用 onClose，不调用 onSave', () => {
    const { onSave, onClose } = renderModal();

    fireEvent.click(screen.getByRole('button', { name: '取消' }));

    expect(onClose).toHaveBeenCalledTimes(1);
    expect(onSave).not.toHaveBeenCalled();
  });

  it('点击 × 调用 onClose', () => {
    const { onClose } = renderModal();

    fireEvent.click(screen.getByRole('button', { name: '关闭' }));

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('点击背景蒙层调用 onClose', () => {
    const { onClose } = renderModal();

    // backdrop 是弹窗背后的 div，通过 aria-label 无法获取，用 fixed 容器的第一个 div
    const dialog = screen.getByRole('dialog');
    const backdrop = dialog.querySelector('.absolute.inset-0') as HTMLElement;
    fireEvent.click(backdrop);

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('Tab 切换展示对应日期的餐食', () => {
    renderModal();

    // 默认显示周一的餐食
    expect(screen.getByDisplayValue('希腊酸奶')).toBeInTheDocument();

    // 切换到周二
    fireEvent.click(screen.getByRole('button', { name: '周二' }));

    expect(screen.getByDisplayValue('牛油果吐司')).toBeInTheDocument();
    expect(screen.queryByDisplayValue('希腊酸奶')).not.toBeInTheDocument();
  });

  it('T10: 点击"+ 添加餐食"后 meals 列表增加一行，且 type === 其他', () => {
    renderModal();

    const mealInputsBefore = screen.getAllByPlaceholderText('餐食名称');
    fireEvent.click(screen.getByRole('button', { name: '+ 添加餐食' }));

    const mealInputsAfter = screen.getAllByPlaceholderText('餐食名称');
    expect(mealInputsAfter.length).toBe(mealInputsBefore.length + 1);
    // 新增行的 type 标签应为 "其他"
    expect(screen.getByText('其他')).toBeInTheDocument();
  });

  it('T11: 点击删除按钮后对应 meal 从列表消失', () => {
    renderModal();

    const mealInputsBefore = screen.getAllByPlaceholderText('餐食名称');
    expect(mealInputsBefore.length).toBe(2);

    // 删除第一个餐食（周一有 2 条，可以删）
    const deleteButtons = screen.getAllByRole('button', { name: '删除餐食' });
    fireEvent.click(deleteButtons[0]);

    const mealInputsAfter = screen.getAllByPlaceholderText('餐食名称');
    expect(mealInputsAfter.length).toBe(1);
    expect(screen.queryByDisplayValue('希腊酸奶')).not.toBeInTheDocument();
  });

  it('T12: 仅剩 1 条时删除按钮带 disabled 属性', () => {
    renderModal();

    // 删除一条后只剩 1 条
    const deleteButtons = screen.getAllByRole('button', { name: '删除餐食' });
    fireEvent.click(deleteButtons[0]);

    const remainingDeleteBtn = screen.getByRole('button', { name: '删除餐食' });
    expect(remainingDeleteBtn).toBeDisabled();
  });

  it('T13: title 为空点保存 → 错误文案出现，onSave 未被调用', () => {
    const { onSave } = renderModal();

    // 清空第一个餐食名称
    const inputs = screen.getAllByPlaceholderText('餐食名称');
    fireEvent.change(inputs[0], { target: { value: '' } });

    fireEvent.click(screen.getByRole('button', { name: '保存计划' }));

    expect(screen.getByText('餐食名称不能为空')).toBeInTheDocument();
    expect(onSave).not.toHaveBeenCalled();
  });

  it('T14: calories 为负点保存 → 错误文案出现，onSave 未被调用', () => {
    const { onSave } = renderModal();

    // 设置 calories 为负数
    const numberInputs = screen.getAllByRole('spinbutton');
    // goals 有 2 个 percent，meals 的 calories 从 index 2 开始
    fireEvent.change(numberInputs[2], { target: { value: '-5' } });

    fireEvent.click(screen.getByRole('button', { name: '保存计划' }));

    expect(screen.getByText('请输入有效卡路里（≥ 0）')).toBeInTheDocument();
    expect(onSave).not.toHaveBeenCalled();
  });

  it('T15: 修复错误后再次保存 → onSave 被调用一次', () => {
    const { onSave } = renderModal();

    // 先制造错误
    const inputs = screen.getAllByPlaceholderText('餐食名称');
    fireEvent.change(inputs[0], { target: { value: '' } });
    fireEvent.click(screen.getByRole('button', { name: '保存计划' }));
    expect(onSave).not.toHaveBeenCalled();

    // 修复错误
    fireEvent.change(inputs[0], { target: { value: '修复后的名称' } });
    fireEvent.click(screen.getByRole('button', { name: '保存计划' }));

    expect(onSave).toHaveBeenCalledTimes(1);
  });
});
