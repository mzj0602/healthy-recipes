#!/usr/bin/env node
/**
 * 发送 Telegram 通知
 * 用法：node scripts/notify-tg.js "消息内容"
 */

import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import path from 'path'

// 自动加载 .env
const envPath = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../.env')
try {
  readFileSync(envPath, 'utf-8').split('\n').forEach(line => {
    const [key, ...vals] = line.split('=')
    if (key?.trim() && vals.length) process.env[key.trim()] = vals.join('=').trim()
  })
} catch {}

const text = process.argv[2]
const token = process.env.TG_BOT_TOKEN
const chatId = process.env.TG_CHAT_ID

if (!token || !chatId || !text) process.exit(0)

fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ chat_id: chatId, text, parse_mode: 'HTML' })
}).catch(() => {})
