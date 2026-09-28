import { useEffect } from "react";

/**
 * 运行原站的 4 段 vanilla runtime（FAQ/carousel 交互、3D 全景 flipbook 引擎、倒计时等）。
 * 这些脚本都写成 `document.addEventListener('DOMContentLoaded', fn)`，但 React 挂载时
 * DOMContentLoaded 早已触发，回调不会再跑。所以在注入脚本前临时打补丁：把针对
 * DOMContentLoaded 的注册改成"下一 tick 立即执行"，让它们在页面 DOM 就绪后照常初始化。
 */
let ran = false;

export function useDuohaRuntime() {
  useEffect(() => {
    if (ran) return;
    ran = true;

    const docAny = document as unknown as {
      addEventListener: (...a: unknown[]) => unknown;
    };
    const origAdd = document.addEventListener.bind(document) as (...a: unknown[]) => unknown;
    docAny.addEventListener = (type: unknown, cb: unknown, ...rest: unknown[]) => {
      if (type === "DOMContentLoaded" && typeof cb === "function") {
        window.setTimeout(() => (cb as () => void)(), 0);
        return undefined;
      }
      return origAdd(type, cb, ...rest);
    };

    const s = document.createElement("script");
    s.src = "/duoha-runtime.js";
    s.async = false;
    s.onload = () => {
      docAny.addEventListener = origAdd; // 恢复原始 addEventListener
    };
    document.body.appendChild(s);
  }, []);
}
