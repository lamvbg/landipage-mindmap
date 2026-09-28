// DuohaPage —— 原站 <body> 真 HTML 原样注入（1:1 忠实复刻）。
// 页面含 client-side 模板(${...})与复杂结构，机械转 JSX 易错，故用 dangerouslySetInnerHTML
// 保证逐字节一致；Tailwind CDN 负责样式，原站 vanilla runtime(见 useDuohaRuntime) 负责交互。
// 后续 rebrand 时可把各 section 逐个抽成真正的 JSX 组件。
import bodyHtml from "./duoha-body.html?raw";

export default function DuohaPage() {
  return <div dangerouslySetInnerHTML={{ __html: bodyHtml }} />;
}
