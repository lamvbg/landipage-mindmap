# experimentdeck-react

1:1 复刻 **duoha.co/experimentdeck** 落地页到 React + Vite + TS，作为你 **Mindmap Vocab Kit** 落地页的
起步骨架 + 设计系统。现在内容是 Experiment Deck 原样（结构 1:1），后续 rebrand 成你的产品。

> 仅本地学习/改造用。原站文案、图片、WarriorPlus 支付链接版权归原作者，rebrand 后请全部替换。

## 跑起来
```bash
npm install
npm run dev        # 开发
# 或
npm run build && npm run preview   # 生产预览
```

## 架构（为什么这样拆）
| 文件 | 作用 |
|---|---|
| `index.html` | **设计系统在这里**：Tailwind CDN + `tailwind.config`(色板/字体/阴影/网格底纹) + Google Fonts。保留 CDN 以保证 1:1 渲染每一个 class（含 JS 运行时动态生成的 class）。 |
| `src/duoha.css` | 原站 8 段内联 `<style>`(自定义动画 / 3D flipbook / 特殊样式)。 |
| `src/duoha-body.html` | 原站 `<body>` 真 HTML(去掉 script)。 |
| `src/DuohaPage.tsx` | 用 `?raw` 导入上面的 HTML，`dangerouslySetInnerHTML` 原样注入 → 逐字节 1:1，无转换误差。 |
| `public/duoha-runtime.js` | 原站 4 段 vanilla 脚本(FAQ/carousel 交互、3D 全景 flipbook 引擎、倒计时)。 |
| `src/useDuohaRuntime.ts` | React 挂载后运行上面脚本；因 DOMContentLoaded 已过，临时打补丁让其 DOMContentLoaded 回调立即执行。 |

## 设计系统（design tokens，在 index.html 的 tailwind.config）
```
色板 encyclo:
  navy #082A52 · navydeep #061B35 · ink #071A2B         (深色区/文字)
  bone #EAF8FF · bonedim #DDF4FF · paper #F7FBFF         (浅色底)
  gold #2CE6E6 · goldsoft #42B6FF · golddeep #0878EE     (青→蓝主色渐变)
  crimson #EF4A68                                        (强调/警示)
字体: display=Outfit · body=Inter · mono=IBM Plex Mono
阴影: plate(大投影) · card(卡片) · insetgold(青色描边)
底纹: bg-lat-long(经纬网格 SVG)
```

## 怎么 rebrand 成 Mindmap Vocab Kit
1. **文案/结构**：编辑 `src/duoha-body.html`（或把某个 section 抽成真正的 JSX 组件再改）。
   把 "Experiment Deck / 100 experiments / Visual Science Activity Book" 换成你的
   "Mindmap Vocab Kit / 204 pages A1–C2 / word-family mind-map book" 等。
2. **配色**：改 `tailwind.config` 的 encyclo 色值即可全站换肤。
3. **图片**：现在图片仍热链 duoha.co。换成你自己的书本样张(`mindmap-vocab-kit/out` 渲染的 PNG)，
   放 `public/` 并改 `duoha-body.html` 里的 `src`。
4. **支付**：原站 WarriorPlus 按钮已未接入。接你自己的 Gumroad/KDP/Stripe 链接。

## 已知边界
- Tailwind 用 CDN(生产不推荐，但保证 1:1)；正式上线可迁到 `@tailwindcss/vite` + 把 `tailwind.config` 移出来。
- 图片热链原站，联网才显示；rebrand 时替换为本地资源。
- 3D flipbook / 倒计时需真实浏览器交互，headless 只做静态校验。
# landipage-mindmap
