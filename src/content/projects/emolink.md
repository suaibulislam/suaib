---
title: "emolink"
description: "a minimal discord bot that converts custom emojis to cdn links with a professional, compact ui."
tech: ["python", "discord.py", "pillow"]
status: "completed"
featured: true
github: "https://github.com/suaibulislam/emolink"
date: 2024-01-15
---

# emolink discord bot

a minimal, professional discord bot designed to convert custom emojis into direct cdn links. it's built for power users and developers who need emoji assets quickly without the clutter of decorative responses.

## what it does

emolink takes a custom emoji and gives you back the raw cdn link. it supports multiple sizes (24, 48, 56, 128, and original) and works entirely through modern discord features like slash commands and context menus.

### key features

- **slash commands:** use `/emoji` for single conversions or `/batch` for multiple links at once.
- **context menus:** right-click any message to extract all emoji links directly via the "apps" menu.
- **professional ui:** no flashy emojis or unnecessary text—just clean, compact embeds.
- **privacy focused:** it doesn't need "message content" intent; it only reads what you explicitly send it.
- **ephemeral responses:** you can choose to have the links sent only to you so you don't spam the channel.

### the logic

built with **python** and **discord.py**, it uses a sleek command-handling system that ensures responses are fast and the ui is always responsive. it’s designed to be a "set it and forget it" tool for server owners.