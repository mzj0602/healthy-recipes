#!/usr/bin/env node
/**
 * 发送 Telegram 通知
 * 用法：node scripts/notify-tg.js "消息内容"
 */

import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import path from 'path'

// 从 .env 文件加载变量，仅补充 shell 中未定义的 key（已定义含空值的 key 不覆盖）
function loadEnv(filePath, skipKeys) {
  try {
    readFileSync(filePath, 'utf-8').split('\n').forEach(line => {
      const match = line.match(/^([A-Z_][A-Z0-9_]*)=(.*)$/)
      if (!match) return
      const k = match[1]
      if (skipKeys?.has(k) || k in process.env) return
      // 去掉值首尾的引号（单引号或双引号）
      process.env[k] = match[2].trim().replace(/^(['"])(.*)\1$/, '$2')
    })
  } catch {}
}

const projectEnvPath = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../.env')
const globalEnvPath = process.env.HOME ? path.join(process.env.HOME, '.claude', '.env') : null

// 记录项目 .env 中出现的所有 key（含空值），防止 global fallback 覆盖
const projectKeys = new Set()
try {
  readFileSync(projectEnvPath, 'utf-8').split('\n').forEach(line => {
    const match = line.match(/^([A-Z_][A-Z0-9_]*)=/)
    if (match) projectKeys.add(match[1])
  })
} catch {}

loadEnv(projectEnvPath)
if (globalEnvPath) loadEnv(globalEnvPath, projectKeys)

const text = process.argv[2]
const token = process.env.TG_BOT_TOKEN
const chatId = process.env.TG_CHAT_ID

if (!token || !chatId || !text) process.exit(0)

fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ chat_id: chatId, text, parse_mode: 'HTML' })
}).catch(() => {})
