import { createRoot } from "react-dom/client";
import App from "./App";
import "./duoha.css"; // 原站 8 段内联 <style>(动画 / 3D flipbook / 自定义样式)

// 不用 StrictMode：原站 runtime 是命令式 DOM 脚本（按 class/id 查询并绑定），
// StrictMode 双挂载会重复绑定 / 重建节点。
createRoot(document.getElementById("root")!).render(<App />);
