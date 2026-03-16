import type { DayPlan, NutrientGoal } from '@/features/health-plan/types';

export const nutrientGoals: NutrientGoal[] = [
  { id: 'protein', label: '蛋白质', valueLabel: '(120g/150g)', percent: 80 },
  { id: 'calories', label: '热量', valueLabel: '(1,850 / 2,200)', percent: 84 },
  { id: 'carbs', label: '碳水', valueLabel: '(200g / 250g)', percent: 80 },
];

export const weeklyPlan: DayPlan[] = [
  {
    id: 'monday',
    day: '周一',
    accent: 'dark',
    meals: [
      { id: 'mon-breakfast', type: '早餐', title: '希腊酸奶和浆果', calories: 320 },
      { id: 'mon-lunch', type: '午餐', title: '藜麦鸡肉沙拉', calories: 450 },
      { id: 'mon-snack', type: '加餐', title: '杏仁和苹果', calories: 180 },
      { id: 'mon-dinner', type: '晚餐', title: '烤三文鱼配芦笋', calories: 550 },
    ],
  },
  {
    id: 'tuesday',
    day: '周二',
    accent: 'brand',
    meals: [
      { id: 'tue-breakfast', type: '早餐', title: '牛油果吐司配鸡蛋', calories: 380 },
      { id: 'tue-lunch', type: '午餐', title: '烤鸡卷饼', calories: 500 },
      { id: 'tue-snack', type: '加餐', title: '蛋白奶昔', calories: 150 },
      { id: 'tue-dinner', type: '晚餐', title: '火鸡辣椒', calories: 480 },
    ],
  },
  {
    id: 'wednesday',
    day: '周三',
    accent: 'brand-light',
    meals: [
      { id: 'wed-breakfast', type: '早餐', title: '燕麦片', calories: 350 },
      { id: 'wed-lunch', type: '午餐', title: '金枪鱼沙拉碗', calories: 420 },
      { id: 'wed-snack', type: '加餐', title: '胡萝卜条和鹰嘴豆泥', calories: 120 },
      { id: 'wed-dinner', type: '晚餐', title: '豆腐炒菜', calories: 400 },
    ],
  },
  {
    id: 'thursday',
    day: '周四',
    accent: 'soft',
    meals: [
      { id: 'thu-breakfast', type: '早餐', title: '炒蛋', calories: 300 },
      { id: 'thu-lunch', type: '午餐', title: '扁豆汤', calories: 380 },
      { id: 'thu-snack', type: '加餐', title: '米饼配花生酱', calories: 190 },
      { id: 'thu-dinner', type: '晚餐', title: '瘦肉汉堡', calories: 520 },
    ],
  },
  {
    id: 'friday',
    day: '周五',
    accent: 'brand',
    meals: [
      { id: 'fri-breakfast', type: '早餐', title: '奶昔碗', calories: 340 },
      { id: 'fri-lunch', type: '午餐', title: '虾肉塔可', calories: 440 },
      { id: 'fri-snack', type: '加餐', title: '毛豆', calories: 150 },
      { id: 'fri-dinner', type: '晚餐', title: '全麦蔬菜比萨', calories: 600 },
    ],
  },
  {
    id: 'saturday',
    day: '周六',
    accent: 'brand-light',
    meals: [
      { id: 'sat-breakfast', type: '早餐', title: '全麦煎饼', calories: 410 },
      { id: 'sat-lunch', type: '午餐', title: '科布沙拉', calories: 510 },
      { id: 'sat-snack', type: '加餐', title: '希腊酸奶', calories: 140 },
      { id: 'sat-dinner', type: '晚餐', title: '烤鳕鱼配藜麦', calories: 430 },
    ],
  },
  {
    id: 'sunday',
    day: '周日',
    accent: 'soft',
    meals: [
      { id: 'sun-breakfast', type: '早餐', title: '水果沙拉和坚果', calories: 290 },
      { id: 'sun-lunch', type: '午餐', title: '剩余火鸡辣椒', calories: 480 },
      { id: 'sun-snack', type: '加餐', title: '茅屋芝士', calories: 160 },
      { id: 'sun-dinner', type: '晚餐', title: '烤鸡和蔬菜', calories: 580 },
    ],
  },
];
