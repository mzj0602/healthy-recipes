import type { IngredientEntry } from '@/features/health-plan/types';

// key: meal.title（精确匹配，覆盖所有 28 条默认餐食）
export const mealIngredientsMap: Record<string, IngredientEntry[]> = {
  // 周一
  '希腊酸奶和浆果': [
    { name: '希腊酸奶', amount: '200g', category: '肉蛋类' },
    { name: '蓝莓', amount: '50g', category: '蔬果类' },
    { name: '草莓', amount: '50g', category: '蔬果类' },
    { name: '蜂蜜', amount: '5g', category: '调料类' },
  ],
  '藜麦鸡肉沙拉': [
    { name: '藜麦', amount: '80g', category: '主食类' },
    { name: '鸡胸肉', amount: '150g', category: '肉蛋类' },
    { name: '生菜', amount: '100g', category: '蔬果类' },
    { name: '小番茄', amount: '80g', category: '蔬果类' },
    { name: '橄榄油', amount: '10ml', category: '调料类' },
    { name: '柠檬汁', amount: '5ml', category: '调料类' },
  ],
  '杏仁和苹果': [
    { name: '杏仁', amount: '30g', category: '蔬果类' },
    { name: '苹果', amount: '1 个', category: '蔬果类' },
  ],
  '烤三文鱼配芦笋': [
    { name: '三文鱼', amount: '200g', category: '肉蛋类' },
    { name: '芦笋', amount: '150g', category: '蔬果类' },
    { name: '橄榄油', amount: '10ml', category: '调料类' },
    { name: '柠檬', amount: '半个', category: '蔬果类' },
    { name: '黑胡椒', amount: '适量', category: '调料类' },
    { name: '食盐', amount: '适量', category: '调料类' },
  ],

  // 周二
  '牛油果吐司配鸡蛋': [
    { name: '全麦吐司', amount: '2 片', category: '主食类' },
    { name: '牛油果', amount: '1 个', category: '蔬果类' },
    { name: '鸡蛋', amount: '2 个', category: '肉蛋类' },
    { name: '食盐', amount: '适量', category: '调料类' },
    { name: '黑胡椒', amount: '适量', category: '调料类' },
  ],
  '烤鸡卷饼': [
    { name: '全麦卷饼皮', amount: '2 张', category: '主食类' },
    { name: '鸡胸肉', amount: '150g', category: '肉蛋类' },
    { name: '生菜', amount: '60g', category: '蔬果类' },
    { name: '番茄', amount: '1 个', category: '蔬果类' },
    { name: '低脂奶酪', amount: '30g', category: '肉蛋类' },
    { name: '橄榄油', amount: '5ml', category: '调料类' },
  ],
  '蛋白奶昔': [
    { name: '蛋白粉', amount: '30g', category: '肉蛋类' },
    { name: '低脂牛奶', amount: '200ml', category: '肉蛋类' },
    { name: '香蕉', amount: '半根', category: '蔬果类' },
  ],
  '火鸡辣椒': [
    { name: '火鸡肉末', amount: '200g', category: '肉蛋类' },
    { name: '红腰豆', amount: '100g', category: '蔬果类' },
    { name: '番茄罐头', amount: '200g', category: '蔬果类' },
    { name: '洋葱', amount: '1 个', category: '蔬果类' },
    { name: '大蒜', amount: '3 瓣', category: '蔬果类' },
    { name: '辣椒粉', amount: '5g', category: '调料类' },
    { name: '橄榄油', amount: '10ml', category: '调料类' },
  ],

  // 周三
  '燕麦片': [
    { name: '燕麦片', amount: '80g', category: '主食类' },
    { name: '低脂牛奶', amount: '200ml', category: '肉蛋类' },
    { name: '香蕉', amount: '1 根', category: '蔬果类' },
    { name: '蜂蜜', amount: '10g', category: '调料类' },
  ],
  '金枪鱼沙拉碗': [
    { name: '金枪鱼罐头', amount: '150g', category: '肉蛋类' },
    { name: '生菜', amount: '100g', category: '蔬果类' },
    { name: '黄瓜', amount: '80g', category: '蔬果类' },
    { name: '小番茄', amount: '60g', category: '蔬果类' },
    { name: '橄榄油', amount: '10ml', category: '调料类' },
    { name: '柠檬汁', amount: '5ml', category: '调料类' },
    { name: '杂粮米饭', amount: '150g', category: '主食类' },
  ],
  '胡萝卜条和鹰嘴豆泥': [
    { name: '胡萝卜', amount: '2 根', category: '蔬果类' },
    { name: '鹰嘴豆泥', amount: '80g', category: '蔬果类' },
  ],
  '豆腐炒菜': [
    { name: '嫩豆腐', amount: '200g', category: '肉蛋类' },
    { name: '西兰花', amount: '150g', category: '蔬果类' },
    { name: '胡萝卜', amount: '80g', category: '蔬果类' },
    { name: '生抽', amount: '15ml', category: '调料类' },
    { name: '芝麻油', amount: '5ml', category: '调料类' },
    { name: '大蒜', amount: '2 瓣', category: '蔬果类' },
    { name: '杂粮米饭', amount: '150g', category: '主食类' },
  ],

  // 周四
  '炒蛋': [
    { name: '鸡蛋', amount: '3 个', category: '肉蛋类' },
    { name: '低脂牛奶', amount: '30ml', category: '肉蛋类' },
    { name: '全麦吐司', amount: '2 片', category: '主食类' },
    { name: '食盐', amount: '适量', category: '调料类' },
    { name: '黑胡椒', amount: '适量', category: '调料类' },
    { name: '黄油', amount: '5g', category: '调料类' },
  ],
  '扁豆汤': [
    { name: '红扁豆', amount: '150g', category: '主食类' },
    { name: '洋葱', amount: '1 个', category: '蔬果类' },
    { name: '胡萝卜', amount: '1 根', category: '蔬果类' },
    { name: '大蒜', amount: '3 瓣', category: '蔬果类' },
    { name: '番茄罐头', amount: '200g', category: '蔬果类' },
    { name: '橄榄油', amount: '10ml', category: '调料类' },
    { name: '孜然粉', amount: '3g', category: '调料类' },
    { name: '食盐', amount: '适量', category: '调料类' },
  ],
  '米饼配花生酱': [
    { name: '糙米饼', amount: '3 片', category: '主食类' },
    { name: '天然花生酱', amount: '30g', category: '调料类' },
  ],
  '瘦肉汉堡': [
    { name: '瘦牛肉饼', amount: '150g', category: '肉蛋类' },
    { name: '全麦汉堡坯', amount: '1 个', category: '主食类' },
    { name: '生菜', amount: '30g', category: '蔬果类' },
    { name: '番茄', amount: '1 个', category: '蔬果类' },
    { name: '洋葱', amount: '半个', category: '蔬果类' },
    { name: '芥末酱', amount: '10g', category: '调料类' },
  ],

  // 周五
  '奶昔碗': [
    { name: '冷冻蓝莓', amount: '100g', category: '蔬果类' },
    { name: '香蕉', amount: '1 根', category: '蔬果类' },
    { name: '希腊酸奶', amount: '150g', category: '肉蛋类' },
    { name: '燕麦片', amount: '30g', category: '主食类' },
    { name: '奇异籽', amount: '10g', category: '蔬果类' },
    { name: '蜂蜜', amount: '5g', category: '调料类' },
  ],
  '虾肉塔可': [
    { name: '鲜虾', amount: '200g', category: '肉蛋类' },
    { name: '玉米饼皮', amount: '3 张', category: '主食类' },
    { name: '紫甘蓝', amount: '80g', category: '蔬果类' },
    { name: '牛油果', amount: '1 个', category: '蔬果类' },
    { name: '酸奶油', amount: '30g', category: '肉蛋类' },
    { name: '柠檬汁', amount: '10ml', category: '调料类' },
    { name: '香菜', amount: '适量', category: '蔬果类' },
  ],
  '毛豆': [
    { name: '毛豆（带壳）', amount: '200g', category: '蔬果类' },
    { name: '食盐', amount: '适量', category: '调料类' },
  ],
  '全麦蔬菜比萨': [
    { name: '全麦比萨饼底', amount: '1 个', category: '主食类' },
    { name: '番茄酱', amount: '60g', category: '调料类' },
    { name: '低脂马苏里拉奶酪', amount: '80g', category: '肉蛋类' },
    { name: '青椒', amount: '50g', category: '蔬果类' },
    { name: '蘑菇', amount: '80g', category: '蔬果类' },
    { name: '洋葱', amount: '半个', category: '蔬果类' },
    { name: '菠菜', amount: '50g', category: '蔬果类' },
  ],

  // 周六
  '全麦煎饼': [
    { name: '全麦面粉', amount: '100g', category: '主食类' },
    { name: '鸡蛋', amount: '1 个', category: '肉蛋类' },
    { name: '低脂牛奶', amount: '150ml', category: '肉蛋类' },
    { name: '泡打粉', amount: '3g', category: '调料类' },
    { name: '蓝莓', amount: '50g', category: '蔬果类' },
    { name: '枫糖浆', amount: '15ml', category: '调料类' },
  ],
  '科布沙拉': [
    { name: '鸡胸肉', amount: '150g', category: '肉蛋类' },
    { name: '鸡蛋', amount: '2 个', category: '肉蛋类' },
    { name: '生菜', amount: '120g', category: '蔬果类' },
    { name: '牛油果', amount: '1 个', category: '蔬果类' },
    { name: '小番茄', amount: '80g', category: '蔬果类' },
    { name: '培根', amount: '40g', category: '肉蛋类' },
    { name: '蓝纹奶酪', amount: '30g', category: '肉蛋类' },
    { name: '橄榄油', amount: '10ml', category: '调料类' },
  ],
  '希腊酸奶': [
    { name: '希腊酸奶', amount: '200g', category: '肉蛋类' },
    { name: '蜂蜜', amount: '10g', category: '调料类' },
  ],
  '烤鳕鱼配藜麦': [
    { name: '鳕鱼', amount: '200g', category: '肉蛋类' },
    { name: '藜麦', amount: '80g', category: '主食类' },
    { name: '柠檬', amount: '半个', category: '蔬果类' },
    { name: '橄榄油', amount: '10ml', category: '调料类' },
    { name: '大蒜', amount: '2 瓣', category: '蔬果类' },
    { name: '香草碎', amount: '适量', category: '调料类' },
    { name: '西兰花', amount: '100g', category: '蔬果类' },
  ],

  // 周日
  '水果沙拉和坚果': [
    { name: '苹果', amount: '1 个', category: '蔬果类' },
    { name: '橙子', amount: '1 个', category: '蔬果类' },
    { name: '葡萄', amount: '80g', category: '蔬果类' },
    { name: '草莓', amount: '50g', category: '蔬果类' },
    { name: '混合坚果', amount: '30g', category: '蔬果类' },
    { name: '蜂蜜', amount: '5g', category: '调料类' },
  ],
  '剩余火鸡辣椒': [
    { name: '火鸡肉末', amount: '200g', category: '肉蛋类' },
    { name: '红腰豆', amount: '100g', category: '蔬果类' },
    { name: '番茄罐头', amount: '200g', category: '蔬果类' },
    { name: '洋葱', amount: '1 个', category: '蔬果类' },
    { name: '大蒜', amount: '3 瓣', category: '蔬果类' },
    { name: '辣椒粉', amount: '5g', category: '调料类' },
    { name: '橄榄油', amount: '10ml', category: '调料类' },
  ],
  '茅屋芝士': [
    { name: '茅屋芝士', amount: '150g', category: '肉蛋类' },
    { name: '菠萝块', amount: '60g', category: '蔬果类' },
  ],
  '烤鸡和蔬菜': [
    { name: '鸡腿肉', amount: '250g', category: '肉蛋类' },
    { name: '西兰花', amount: '100g', category: '蔬果类' },
    { name: '胡萝卜', amount: '80g', category: '蔬果类' },
    { name: '洋葱', amount: '1 个', category: '蔬果类' },
    { name: '橄榄油', amount: '15ml', category: '调料类' },
    { name: '大蒜', amount: '3 瓣', category: '蔬果类' },
    { name: '迷迭香', amount: '适量', category: '调料类' },
    { name: '食盐', amount: '适量', category: '调料类' },
    { name: '杂粮米饭', amount: '150g', category: '主食类' },
  ],
};
