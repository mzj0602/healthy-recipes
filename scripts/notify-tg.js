#!/usr/bin/env node
/**
 * 发送 Telegram 通知
 * 用法：node scripts/notify-tg.js "消息内容"
 */

import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import path from 'path'

// 优先读项目 .env；fallback 只补充项目 .env 中未出现的 key（含空值 key 也视为已定义）
const projectEnvPath = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../.env')
const globalEnvPath = process.env.HOME ? path.join(process.env.HOME, '.claude', '.env') : null

const projectKeys = new Set()
try {
  readFileSync(projectEnvPath, 'utf-8').split('\n').forEach(line => {
    const [key, ...vals] = line.split('=')
    const k = key?.trim()
    if (!k || !vals.length) return
    projectKeys.add(k)
    if (!process.env[k]) process.env[k] = vals.join('=').trim()
  })
} catch {}

if (globalEnvPath) {
  try {
    readFileSync(globalEnvPath, 'utf-8').split('\n').forEach(line => {
      const [key, ...vals] = line.split('=')
      const k = key?.trim()
      if (!k || !vals.length || projectKeys.has(k) || process.env[k]) return
      process.env[k] = vals.join('=').trim()
    })
  } catch {}
}

const text = process.argv[2]
const token = process.env.TG_BOT_TOKEN
const chatId = process.env.TG_CHAT_ID

if (!token || !chatId || !text) process.exit(0)

fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ chat_id: chatId, text, parse_mode: 'HTML' })
}).catch(() => {})
