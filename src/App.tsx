import DuohaPage from "./DuohaPage";
import { useDuohaRuntime } from "./useDuohaRuntime";

// 1:1 复刻 duoha.co/experimentdeck 落地页：
// - 设计系统(色板 encyclo / 字体 Outfit·Inter·IBM Plex Mono / 阴影 / 网格底纹) 在 index.html 的 tailwind.config
// - 8 段自定义样式在 src/duoha.css
// - 页面结构在 <DuohaPage/>(由原站 body 机械转成 JSX)
// - 交互/3D flipbook/倒计时 由 useDuohaRuntime 复用原站 vanilla runtime 驱动
export default function App() {
  useDuohaRuntime();
  return <DuohaPage />;
}
