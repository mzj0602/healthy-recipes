#!/usr/bin/env node
/**
 * FreshPlate Telegram Bot
 * 轮询 TG 消息，接收指令后触发 Claude Code Pipeline
 *
 * 启动：
 *   TG_BOT_TOKEN=xxx TG_CHAT_ID=yyy node scripts/tg-bot.js
 *
 * 或用 pm2 常驻：
 *   pm2 start scripts/tg-bot.js --name freshplate-bot \
 *     --env TG_BOT_TOKEN=xxx --env TG_CHAT_ID=yyy
 *
 * 支持的指令：
 *   /pipeline <feature-name> <需求描述 或 JIRA URL>
 *   /status   查看当前是否有任务在执行
 *   /help     显示帮助
 */

import { exec } from 'child_process'
import { execSync } from 'child_process'
import { fileURLToPath } from 'url'
import { readFileSync } from 'fs'
import path from 'path'

// 加载 .env
const envPath = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../.env')
try {
  readFileSync(envPath, 'utf-8').split('\n').forEach(line => {
    const [key, ...vals] = line.split('=')
    if (key && vals.length) process.env[key.trim()] = vals.join('=').trim()
  })
} catch {}

const TOKEN = process.env.TG_BOT_TOKEN
const ALLOWED_CHAT_ID = process.env.TG_CHAT_ID
const PROJECT_DIR = path.dirname(path.dirname(fileURLToPath(import.meta.url)))
const CLAUDE_BIN = '/Users/mzj/.nvm/versions/node/v24.13.1/bin/claude'

if (!TOKEN || !ALLOWED_CHAT_ID) {
  console.error('❌ 缺少环境变量：TG_BOT_TOKEN 和 TG_CHAT_ID 必须设置')
  process.exit(1)
}

let offset = 0
let isRunning = false

// ─── Claude 执行单个阶段 ────────────────────────────────────
function runStage(prompt) {
  return new Promise((resolve, reject) => {
    const child = exec(
      `${CLAUDE_BIN} --dangerously-skip-permissions -p "${prompt}"`,
      { cwd: PROJECT_DIR, env: { ...process.env, PATH: process.env.PATH } }
    )
    child.on('close', (code) => code === 0 ? resolve() : reject(new Error(`exit code ${code}`)))
  })
}

// ─── TG API ───────────────────────────────────────────────
async function getUpdates() {
  const res = await fetch(
    `https://api.telegram.org/bot${TOKEN}/getUpdates?offset=${offset}&timeout=30`
  )
  const data = await res.json()
  return data.result || []
}

async function sendMessage(chatId, text) {
  await fetch(`https://api.telegram.org/bot${TOKEN}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: chatId, text, parse_mode: 'HTML' })
  })
}

// ─── 指令处理 ──────────────────────────────────────────────
async function handleMessage(msg) {
  const chatId = String(msg.chat.id)
  const text = msg.text?.trim() || ''

  // 安全校验：只响应授权的 chat
  if (chatId !== ALLOWED_CHAT_ID) {
    await sendMessage(chatId, '⛔ 未授权')
    return
  }

  // /help
  if (text === '/help') {
    await sendMessage(chatId, [
      '<b>FreshPlate Pipeline Bot</b>',
      '',
      '可用指令：',
      '/pipeline &lt;feature&gt; &lt;需求描述或JIRA URL&gt;',
      '  → 启动完整开发 Pipeline',
      '',
      '/status',
      '  → 查看当前执行状态',
      '',
      '示例：',
      '/pipeline recipe-search 用户需要按食材搜索菜谱',
      '/pipeline recipe-ai https://jira.example.com/HR-123'
    ].join('\n'))
    return
  }

  // /status
  if (text === '/status') {
    await sendMessage(chatId, isRunning ? '⏳ 当前有任务正在执行中...' : '✅ 空闲，可以接收新任务')
    return
  }

  // /pipeline
  if (text.startsWith('/pipeline')) {
    const args = text.replace('/pipeline', '').trim()

    if (!args) {
      await sendMessage(chatId, '❌ 请提供参数：/pipeline &lt;feature-name&gt; &lt;需求描述&gt;')
      return
    }

    if (isRunning) {
      await sendMessage(chatId, '⏳ 当前有任务正在执行，请等待完成后再发起新任务')
      return
    }

    const featureName = args.split(' ')[0]
    const source = args.slice(featureName.length).trim()

    await sendMessage(chatId, `🚀 <b>Pipeline 启动</b>\n功能：${featureName}\n\n各阶段完成后会单独通知你`)

    isRunning = true

    // 顺序执行各阶段，每阶段完成后发 TG 通知
    ;(async () => {
      const stages = [
        { name: 'P1 需求分析', emoji: '📋', prompt: `/p1-require ${featureName} ${source}` },
        { name: 'P2 技术设计', emoji: '🎨', prompt: `/p2-design ${featureName}` },
        { name: 'P3 任务拆解', emoji: '📝', prompt: `/p3-taskgen ${featureName}` },
        { name: 'P4 代码开发', emoji: '⚙️', prompt: `/p4-develop ${featureName}` },
        { name: 'P5 代码 Review', emoji: '🔍', prompt: `/p5-review ${featureName}` },
        { name: 'P6 测试', emoji: '🧪', prompt: `/p6-test ${featureName}` },
        { name: 'P7 文档同步', emoji: '📚', prompt: `/p7-docsync ${featureName}` },
      ]

      for (const stage of stages) {
        await sendMessage(chatId, `⏳ 正在执行 ${stage.emoji} ${stage.name}...`)
        try {
          await runStage(stage.prompt)
          await sendMessage(chatId, `✅ ${stage.emoji} ${stage.name} 完成`)
        } catch (err) {
          await sendMessage(chatId, `❌ ${stage.emoji} ${stage.name} 失败\n${err.message}`)
          isRunning = false
          return
        }
      }

      // P8 提交并推送
      await sendMessage(chatId, `⏳ 正在执行 🚀 P8 提交部署...`)
      try {
        execSync(
          `git add -A && git commit -m "feat: ${featureName} — pipeline auto commit" && git push`,
          { cwd: PROJECT_DIR, env: { ...process.env, PATH: process.env.PATH } }
        )
        await sendMessage(chatId, `✅ 🚀 P8 提交部署完成，GitHub Actions 已触发`)
      } catch (err) {
        await sendMessage(chatId, `❌ 🚀 P8 提交失败\n${err.message}`)
      }

      isRunning = false
      await sendMessage(chatId, `🎉 <b>Pipeline 全部完成！</b>\n功能：${featureName}\n查看：specs/${featureName}/`)
    })()
    return
  }

  // 未知指令
  await sendMessage(chatId, '❓ 未知指令，发送 /help 查看帮助')
}

// ─── 轮询主循环 ────────────────────────────────────────────
async function poll() {
  try {
    const updates = await getUpdates()
    for (const update of updates) {
      offset = update.update_id + 1
      if (update.message) {
        await handleMessage(update.message)
      }
    }
  } catch (err) {
    console.error('轮询出错：', err.message)
  }
  setTimeout(poll, 1000)
}

console.log('🤖 FreshPlate Bot 启动，等待指令...')
poll()
