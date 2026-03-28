#!/usr/bin/env node
/**
 * 发送 Telegram 通知（使用 openclaw bot）
 * 用法：node scripts/notify-tg.js "消息内容"
 */

const text = process.argv[2]
if (!text) process.exit(0)

// openclaw bot token + chat id
const TOKEN = '8269110471:AAHzm2VcBXQcttdhGkOkn4Nl9RTiILqIhuk'
const CHAT_ID = '6938150752'

fetch(`https://api.telegram.org/bot${TOKEN}/sendMessage`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ chat_id: CHAT_ID, text, parse_mode: 'HTML' })
}).catch(() => {})
