// [Claude Code 2026-04-20] Added VideoAsset discriminated union for mux/mp4/youtube
export type VideoAsset =
  | { type: "mux"; playbackId: string }
  | { type: "mp4"; url: string; poster?: string }
  | { type: "youtube"; videoId: string };

// [Claude Code 2026-04-20] Extended ChangeEntry with images[] and videos[] for rich media
export type ChangeEntry = {
  date: string; // YYYY-MM-DD
  version?: string;
  title: string;
  summary: string;
  tags: string[];
  details: string[];
  screenshot?: string; // primary screenshot URL (legacy single image)
  images?: string[];   // additional image URLs (shown in gallery)
  videos?: VideoAsset[]; // video assets (shown in VideoPlayer)
};

export type Tool = {
  id: string;
  name: string;
  tagline: string;
  accentColor: string; // hex
  company: string;
  changelogUrl: string;
  websiteUrl: string;
  patternType: "dots" | "lines" | "circles" | "grid" | "waves" | "hexagon";
  changes: ChangeEntry[];
};

export const tools: Tool[] = [
  {
    id: "cursor",
    name: "Cursor",
    tagline: "The AI-first code editor",
    accentColor: "#7C6FF7",
    company: "Anysphere",
    changelogUrl: "https://cursor.com/changelog",
    websiteUrl: "https://cursor.com",
    patternType: "dots",
    changes: [
      // [Claude Code 2026-04-20] 以下 Cursor 2026 条目由 scraper 抓取 + Mux ID 精确映射
      {
        date: "2026-04-15",
        version: "3.2",
        title: "Canvases — Interactive Agent Dashboards",
        summary: "Agent 输出可持久化为可交互 Canvas 仪表板",
        tags: ["Canvas", "Agent", "Major"],
        details: [
          "Canvases：Agent 输出不再是一次性对话，可保存为持久化交互式仪表板",
          "支持图表、代码块、图片、Markdown 混排",
          "Canvas 可共享给团队成员，支持协同查看",
          "与 Agent 对话可直接更新 Canvas 内容",
        ],
        videos: [
          { type: "mux", playbackId: "kMGs01X6Ar00THbfjzAzFC0237Det00efN1v9wiTJl5eFtE" },
        ],
      },
      {
        date: "2026-04-13",
        version: "3.1",
        title: "Tiled Layout & Upgraded Voice in Agents Window",
        summary: "多 Agent 并排平铺视图，语音输入升级",
        tags: ["Agent", "Layout", "Voice"],
        details: [
          "Agents Window 支持分屏平铺（Tiled Layout），多个 Agent 并排比对",
          "Voice input 升级，支持更长的连续语音输入",
          "Agent Tabs 可以 side-by-side 或 grid 排列",
          "Design Mode 新增键盘导航元素树（上下左右切换层级）",
        ],
        // [Claude Code 2026-04-20] filters-search-files.png 来自 Cursor changelog 同期截图，
        // 与 Tiled Layout 同批发布。4 个 Mux ID 均经过 date-chunk 精确匹配，不要随意改顺序。
        images: [
          "https://ptht05hbb1ssoooe.public.blob.vercel-storage.com/assets/changelog/filters-search-files.png",
        ],
        videos: [
          { type: "mux", playbackId: "027nRU502XA01jiuaShIJv9SjB9ocpmkPALLCtzphZ6b00w" },
          { type: "mux", playbackId: "jUyRBbGL27c6PcDq4q29LJ88qK01pe5kCA3kvB1SdZus" },
          { type: "mux", playbackId: "zOTMpKVJh5fIPnKQO01Spx01tNaDDzdycDSUskkVu6EYM" },
          { type: "mux", playbackId: "Fv1TxwmQPtHUfXLUyhm4Sj2YGYSRcfttBKDmd8rHzNg" },
        ],
      },
      {
        // [Claude Code 2026-04-21] BugBot 规则配置 + MCP 为功能/开发者更新，非可见界面变化 → 不在 Timeline River 中显示
        date: "2026-04-08",
        title: "BugBot Rules & MCP Support",
        summary: "BugBot 支持自定义规则，MCP 协议集成",
        tags: ["BugBot", "MCP"],
        details: [
          "BugBot 支持自定义 review 规则，可按项目/团队规范配置",
          "MCP（Model Context Protocol）集成：IDE AI 连接外部工具和数据源",
          "过滤搜索文件功能增强",
        ],
      },
      {
        date: "2026-04-02",
        version: "3.0",
        title: "Cursor 3 — Agent-first 界面重构",
        summary: "从「编辑器+AI侧边栏」到 Agent-first 全新架构",
        tags: ["Agent", "Design Mode", "Background Agent", "Major"],
        details: [
          "全新 Agents Window：左侧统一管理所有本地/云端 Agent",
          "Design Mode：浏览器内点选 UI 元素 → 属性面板精细调整，无需文字描述",
          "Background Agents：机器关闭后 Agent 继续在云端异步执行",
          "Agent Tabs：并排展示多个 Agent 对话，支持网格布局",
          "移除顶部 agents/editor 切换按钮，改为可定制布局面板",
        ],
        images: [
          // TODO [Claude Code 2026-04-20]: URL 缺少文件扩展名，需确认是 .png/.jpg/.webp
          "https://ptht05hbb1ssoooe.public.blob.vercel-storage.com/assets/changelog/agent-tabs",
        ],
        videos: [
          { type: "mux", playbackId: "sZQK9gk9ZNqZLeRjCH02QlzVCEeBY5ktQLgkPTmLRjtU" },
          { type: "mux", playbackId: "UMJM00fBs7Y4V2V3LFiwrKHVjjZlZKKpMr2TnfxNp4pI" },
        ],
      },
      {
        // [Claude Code 2026-04-21] 基础设施/Enterprise 功能，og-image 为博客营销图 → 不在 Timeline River 中显示
        date: "2026-03-25",
        title: "Self-hosted Cloud Agents",
        summary: "云端 Agent 支持自托管，数据不出企业",
        tags: ["Cloud Agent", "Enterprise"],
        details: [
          "Self-hosted cloud agents：在自己的基础设施上运行云端 Agent",
          "数据完全在企业内部，满足合规和隐私要求",
          "支持私有化部署，与企业 VPN/防火墙兼容",
        ],
      },
      // [Claude Code 2026-04-20] Source: cursor.com/changelog/2-0
      // [Claude Code 2026-04-21] PNG 顺序按「界面可见性」：Improved Prompt UI → Plan Mode → Team Commands（Multi-Agent/Composer 主视觉在同页 Mux 视频）
      {
        date: "2025-10-29",
        version: "2.0",
        title: "Multi-Agents & Browser GA",
        summary: "最多 8 个 Agent 并行运行，内置浏览器与沙箱终端正式发布",
        tags: ["Multi-Agent", "Browser", "Major"],
        details: [
          "Multi-Agents：最多 8 个 Agent 并行，各自运行在独立 git worktree 或远程机器",
          "Composer：速度是同等智能模型的 4 倍的全新前沿模型",
          "Browser (GA)：编辑器内置浏览器，可点选元素直接改样式",
          "Sandboxed Terminals (GA)：macOS shell 命令在安全沙箱执行",
          "Cloud Agents：99.9% 可靠性，毫秒级启动，99.9% 可用性保障",
        ],
        images: [
          "https://ptht05hbb1ssoooe.public.blob.vercel-storage.com/assets/changelog/changelog-2-0-2.png",
          "https://ptht05hbb1ssoooe.public.blob.vercel-storage.com/assets/changelog/changelog-2-0-0.png",
          "https://ptht05hbb1ssoooe.public.blob.vercel-storage.com/assets/changelog/changelog-2-0-1.png",
        ],
        videos: [
          { type: "mux", playbackId: "ndhL1Eh8h2tC8eJNJ2D02hNwTuG67sm2xYpVkP0100V1XM" },
          { type: "mux", playbackId: "wz01shXnVf02FznEbDF0114WW9fxohbJY8dVVX01mHxnsD8" },
        ],
      },
      // [Claude Code 2026-04-20] Source: cursor.com/changelog/1-0
      // [Claude Code 2026-04-21] 1-0-0.png 对应「Background Agent」小节；1-0-1/2 对应「New Settings and Dashboard」→ 界面优先放前
      {
        date: "2025-06-04",
        version: "1.0",
        title: "Cursor 1.0 — Background Agent GA & BugBot",
        summary: "Background Agent 正式全面开放，BugBot 自动 PR code review",
        tags: ["Background Agent", "BugBot", "Major"],
        details: [
          "Background Agent (GA)：全平台开放，Cmd/Ctrl+E 启动，云端异步执行任务",
          "BugBot：自动 review PR 并标注潜在 bug，与 GitHub CI 集成",
          "Jupyter Notebook 支持：Agent 可直接创建和编辑 notebook cells",
          "Memories (Beta)：保存项目特定对话事实，下次对话可自动回忆",
          "MCP 一键安装：支持 OAuth 的 MCP server 快速配置",
        ],
        images: [
          "https://ptht05hbb1ssoooe.public.blob.vercel-storage.com/assets/changelog/changelog-1-0-1.png",
          "https://ptht05hbb1ssoooe.public.blob.vercel-storage.com/assets/changelog/changelog-1-0-2.png",
          "https://ptht05hbb1ssoooe.public.blob.vercel-storage.com/assets/changelog/changelog-1-0-0.png",
        ],
      },
      // [Claude Code 2026-04-20] Source: cursor.com/changelog/0-50
      // [Claude Code 2026-04-21] 0-50-1 = Multi-root workspaces；0-50-0 = New Tab model（Tab 补全示意）→ 工作区 UI 优先
      {
        date: "2025-05-15",
        version: "0.50",
        title: "Background Agent Preview & New Tab Model",
        summary: "Background Agent 首次预览，全新 Tab Model 支持跨文件重构",
        tags: ["Background Agent", "Tab Model", "Preview"],
        details: [
          "Background Agent（Preview）：Agent 并行在远程环境运行，可监控状态随时接管",
          "New Tab Model：新训练模型，擅长跨多文件重构建议",
          "Inline Edit 刷新：新增全文件编辑（⌘⇧⏎）和发送给 Agent（⌘L）",
          "@folders 支持：将整个代码库目录加入上下文",
          "快速文件编辑：search & replace 工具让长文件编辑速度提升近 2 倍",
        ],
        images: [
          "https://ptht05hbb1ssoooe.public.blob.vercel-storage.com/assets/changelog/changelog-0-50-1.png",
          "https://ptht05hbb1ssoooe.public.blob.vercel-storage.com/assets/changelog/changelog-0-50-0.png",
        ],
      },
      // [Claude Code 2026-04-21] Source: https://cursor.com/changelog/2-2
      {
        date: "2025-12-10",
        version: "2.2",
        title: "Debug Mode & Visual Editor for Browser",
        summary: "内置浏览器可视化编辑器上线，Plan Mode 改进",
        tags: ["Visual Editor", "Browser", "Debug"],
        details: [
          "浏览器内置可视化编辑器：拖拽元素、检查 props、侧边栏滑块调样式",
          "Debug Mode：Agent 自动识别运行时错误并修复",
          "Plan Mode 改进：规划阶段对话体验优化",
          "BugBot：PR 自动 code review，标注潜在 bug",
        ],
        // [Claude Code 2026-04-21] Screenshots from cursor.com/changelog/2-2
        images: [
          "https://ptht05hbb1ssoooe.public.blob.vercel-storage.com/assets/changelog/changelog-2-2-debug-dropdown.jpg",
          "https://ptht05hbb1ssoooe.public.blob.vercel-storage.com/assets/changelog/changelog-2-2-judge.jpg",
          "https://ptht05hbb1ssoooe.public.blob.vercel-storage.com/assets/changelog/changelog-2-2-pinned.jpg",
        ],
        videos: [
          { type: "mp4", url: "https://ptht05hbb1ssoooe.public.blob.vercel-storage.com/assets/changelog/changelog-2-2-browser-bNio0bOiM0ocjkCu3rkFPkk7F6lIZe.mp4" },
          { type: "mp4", url: "https://ptht05hbb1ssoooe.public.blob.vercel-storage.com/assets/changelog/changelog-2-2-plans.mp4" },
        ],
      },
    ],
  },
  {
    id: "trae",
    name: "Trae",
    tagline: "The Real AI Engineer",
    accentColor: "#22C55E",
    company: "ByteDance",
    changelogUrl: "https://www.trae.ai/changelog",
    websiteUrl: "https://www.trae.ai",
    patternType: "grid",
    changes: [
      // [Claude Code 2026-04-20] Source: https://x.com/Trae_ai/status/2038813538064494938
      // Scraped via scrape-x-tweets.js — twimg video/image URLs may expire
      {
        date: "2026-03-31",
        title: "SOLO — 全自主 Desktop & Web Agent",
        summary: "SOLO 全新版本上线，桌面端 + Web 端，你定义任务，SOLO 自主完成",
        tags: ["SOLO", "Agent", "Desktop", "Major"],
        details: [
          "SOLO 全新版本：现已登陆 Desktop（macOS/Windows）和 Web 端",
          "你定义任务，SOLO 自动规划、执行、汇报结果，无需手动干预",
          "限时免费邀请码内测，注册即可申请",
          "支持终端、浏览器、代码库全栈上下文感知",
        ],
        images: [
          "https://pbs.twimg.com/media/HEtTrmCX0AA1G91.jpg?name=orig",
        ],
        videos: [
          {
            type: "mp4",
            // [Claude Code 2026-04-20] twimg 视频需通过 /api/video-proxy 转发（直接访问 403）
            url: "/api/video-proxy?url=https://video.twimg.com/amplify_video/2038805359280758784/vid/avc1/1280x720/WhgEFeGjHnALVvHu.mp4?tag=21",
            poster: "https://pbs.twimg.com/media/HEtTrmCX0AA1G91.jpg?name=orig",
          },
        ],
      },
      // [Claude Code 2026-04-20] Source: https://x.com/Trae_ai/status/1946195869851594754
      {
        date: "2025-07-19",
        title: "Trae 2.0 — 全新视觉设计",
        summary: "Trae 2.0 全新界面设计上线，更现代的 AI coding 体验",
        tags: ["Design", "Major"],
        details: [
          "Trae 2.0 全新视觉设计：全面重构界面风格，更现代简洁",
          "Agent 工作流优化：更流畅的任务规划与执行体验",
          "新版 AI 对话界面：更直观的代码生成与解释展示",
        ],
        images: [
          "https://pbs.twimg.com/amplify_video_thumb/1946195869851594754/img/NPlImVc7jVIYEMbz.jpg?name=orig",
        ],
        videos: [
          {
            type: "mp4",
            // [Claude Code 2026-04-20] twimg 视频需通过 /api/video-proxy 转发（直接访问 403）
            url: "/api/video-proxy?url=https://video.twimg.com/amplify_video/1946195869851594754/vid/avc1/1280x720/iGJOcGuQACbM0sEh.mp4?tag=21",
            poster: "https://pbs.twimg.com/amplify_video_thumb/1946195869851594754/img/NPlImVc7jVIYEMbz.jpg?name=orig",
          },
        ],
      },
    ],
  },
  {
    id: "antigravity",
    name: "Antigravity",
    tagline: "Agent-first IDE by Google",
    accentColor: "#4285F4",
    company: "Google",
    changelogUrl: "https://developers.googleblog.com",
    websiteUrl: "https://antigravityai.io",
    patternType: "circles",
    changes: [
      {
        // [Claude Code 2026-04-21] 模型能力/性能更新，非可见 UI 变化 → 不在 Timeline River 中显示
        date: "2026-04-10",
        title: "Gemini 3.1 Pro — 2M Token 上下文",
        summary: "上下文扩展至 200 万 token，整个中型 codebase 纳入",
        tags: ["Context Window", "Gemini", "Performance"],
        details: [
          "Gemini 3.1 Pro 2M token 上下文：可纳入整个中型 codebase",
          "跨文件依赖分析精度大幅提升",
          "Manager View 支持同时调度 5 个并行 Agent",
          "Artifacts 版本历史可对比不同 Agent 的产出",
        ],
      },
      {
        // [Claude Code 2026-04-21] 视频封面为演讲者人像，非产品 UI → 不在 Timeline River 中显示
        // 视频保留供弹窗播放，但移除 images[] 以排除出 Timeline River
        date: "2025-11-18",
        title: "Antigravity 正式发布",
        summary: "随 Gemini 3 同步发布，双视图架构 + Artifacts 机制",
        tags: ["Launch", "Manager View", "Artifacts", "Major"],
        details: [
          "双视图：Editor View（传统 IDE + Agent 侧边栏）+ Manager View（多 Agent 任务调度中心）",
          "三挡快捷键：Cmd+I（内联精细）→ Cmd+L（Agent 对话）→ Cmd+E（Manager 宏观）",
          "Artifacts 机制：Agent 生成任务计划+截图+浏览器录屏供审核，再 Apply",
          "内置 Chrome 浏览器：Agent 可自主测试 UI 截图验证",
          "支持 Claude Sonnet 4.6 / Claude Opus 4.6 / GPT-OSS-120B",
          "免费开放，全平台（Windows / macOS / Linux）",
        ],
        // [Claude Code 2026-04-21] Source: https://x.com/googleaidevs/status/1992001690216931552
        videos: [
          {
            type: "mp4",
            url: "/api/video-proxy?url=https://video.twimg.com/amplify_video/1991995862227243008/vid/avc1/1280x720/sgfuUqTBlG2DtA0s.mp4?tag=21",
          },
        ],
      },
    ],
  },
  {
    id: "pencil",
    name: "Pencil",
    tagline: "Design on canvas. Land in code.",
    accentColor: "#F59E0B",
    company: "Pencil Labs",
    changelogUrl: "https://trypencil.com/resources/release-notes",
    websiteUrl: "https://www.pencil.dev",
    patternType: "hexagon",
    changes: [
      // [Claude Code 2026-04-20] Source: https://x.com/tomkrcha/status/2044433115985457392
      // Scraped via scrape-x-tweets.js — twimg video/image URLs may expire
      {
        date: "2026-04-15",
        title: "Code on Canvas — 代码与设计合体",
        summary: "Claude 和 Codex 生成的代码直接嵌入 Pencil 画布，设计与代码正式合一",
        tags: ["Code on Canvas", "Claude", "Codex", "Major"],
        details: [
          "Code on Canvas：Agent 生成的自定义组件直接落在设计画布上",
          "支持 Claude Code CLI 和 OpenAI Codex 作为代码生成引擎",
          "设计层与代码层双向同步：画布修改 → 代码更新，代码修改 → 画布更新",
          "开启「设计 ❤️ 代码」全新创作模式",
        ],
        images: [
          "https://pbs.twimg.com/amplify_video_thumb/2044426866225012736/img/sTBFBr10knrYJiYt.jpg?name=orig",
        ],
        videos: [
          {
            type: "mp4",
            // [Claude Code 2026-04-20] twimg 视频需通过 /api/video-proxy 转发（直接访问 403）
            url: "/api/video-proxy?url=https://video.twimg.com/amplify_video/2044426866225012736/vid/avc1/1174x720/O5kSM5G5wnNUcPyk.mp4?tag=21",
            poster: "https://pbs.twimg.com/amplify_video_thumb/2044426866225012736/img/sTBFBr10knrYJiYt.jpg?name=orig",
          },
        ],
      },
      // [Claude Code 2026-04-21] Source: https://x.com/tomkrcha/status/2026329359838318906
      {
        date: "2026-02-24",
        title: "SWARM Mode — 并行 Agent 设计军团",
        summary: "100k 用户里程碑，SWARM 模式：多个 AI 设计 Agent 并行协作",
        tags: ["Multi-Agent", "SWARM", "Canvas", "Major"],
        details: [
          "SWARM mode：一支 AI 设计 Agent 团队并行为你工作",
          "Agent 步骤实时透明展示：ToolSearch → Reading objects → Design → Reviewing visuals",
          "Agent 操作对象为真实设计组件，非代码字符串",
          "支持 Claude Code CLI / OpenAI Codex / Gemini CLI / Kiro CLI 多种 Agent 接入",
          "Pencil 用户突破 100,000 里程碑",
        ],
        images: [
          "https://pbs.twimg.com/amplify_video_thumb/2026309809713381376/img/6X7ZjyF6evwb__ru.jpg?name=orig",
        ],
        videos: [
          {
            type: "mp4",
            // [Claude Code 2026-04-21] twimg 视频需通过 /api/video-proxy 转发（直接访问 403）
            url: "/api/video-proxy?url=https://video.twimg.com/amplify_video/2026309809713381376/vid/avc1/1202x720/dd7JfP0VZKrlO81W.mp4?tag=21",
            poster: "https://pbs.twimg.com/amplify_video_thumb/2026309809713381376/img/6X7ZjyF6evwb__ru.jpg?name=orig",
          },
        ],
      },
      // [Claude Code 2026-04-21] Source: https://x.com/tomkrcha/status/2014028990810300498
      {
        date: "2026-01-21",
        title: "Infinite Design Canvas — 无限画布 + Claude Code",
        summary: "WebGL 无限画布上线，并行 Agent 设计 + 与 Claude Code 直接集成",
        tags: ["Infinite Canvas", "Claude Code", "WebGL", "Major"],
        details: [
          "超快 WebGL 无限画布：完全可编辑，支持 pan/zoom 如同 Figma",
          "并行 Agent：多个 Agent 在同一画布上同时执行设计任务",
          "本地运行 Claude Code：设计直接转换为代码",
          "设计文件存于 Git repo：开放 JSON 格式 .pen 文件，所有 AI Agent 可读写",
          "MCP-first：AI Agent 通过 MCP 协议完整读写画布对象",
          "Agent 可读取设计变量（颜色 token、spacing 等）并直接应用",
        ],
        images: [
          "https://pbs.twimg.com/amplify_video_thumb/2014022787955040259/img/8THZqeRanvfh6med.jpg?name=orig",
        ],
        videos: [
          {
            type: "mp4",
            // [Claude Code 2026-04-21] twimg 视频需通过 /api/video-proxy 转发（直接访问 403）
            url: "/api/video-proxy?url=https://video.twimg.com/amplify_video/2014022787955040259/vid/avc1/1208x720/QgpfqWvtri7wZAy-.mp4?tag=21",
            poster: "https://pbs.twimg.com/amplify_video_thumb/2014022787955040259/img/8THZqeRanvfh6med.jpg?name=orig",
          },
        ],
      },
      // [Claude Code 2026-04-21] Source: https://x.com/tomkrcha/status/1919763769070071867
      {
        date: "2025-05-06",
        title: "Design Mode for Cursor — 设计融入编码流",
        summary: "Cursor 内直接设计，设计与代码在同一上下文中协同",
        tags: ["Cursor", "Design Mode", "Major"],
        details: [
          "Design Mode：在 Cursor 中直接进行 UI 设计，无需切换工具",
          "复用 Cursor 已有 AI Agent，设计与代码共享完整上下文",
          "Vibe code + vibe design 合为一体，保持创作心流",
        ],
        images: [
          "https://pbs.twimg.com/amplify_video_thumb/1919761660727984130/img/WTpUECY5td1itgHI.jpg?name=orig",
        ],
        videos: [
          {
            type: "mp4",
            // [Claude Code 2026-04-21] twimg 视频需通过 /api/video-proxy 转发（直接访问 403）
            url: "/api/video-proxy?url=https://video.twimg.com/amplify_video/1919761660727984130/vid/avc1/1098x720/7ClqXxUSeAx34yBQ.mp4?tag=16",
            poster: "https://pbs.twimg.com/amplify_video_thumb/1919761660727984130/img/WTpUECY5td1itgHI.jpg?name=orig",
          },
        ],
      },
    ],
  },
  {
    id: "v0",
    name: "v0",
    tagline: "Build with AI. Ship to Vercel.",
    accentColor: "#000000",
    company: "Vercel",
    changelogUrl: "https://v0.app/changelog",
    websiteUrl: "https://v0.app",
    patternType: "lines",
    changes: [
      // [Claude Code 2026-04-20] v0 视频来自 Vercel blob storage（pdgvvgmkdvyeydso）
      // git-import.mp4 / folders-changelog.mp4 / shadcn.mp4 均已从 v0.app/changelog 抓取
      // shadcn.mp4 已从 Design Mode 条目拆分出来，单独对应"shadcn/ui 组件集成"功能
      {
        date: "2026-02-20",
        title: "Git 集成 + 生产级平台升级",
        summary: "从原型工具进化为生产级平台，每次对话创 Git branch",
        tags: ["Git", "Production", "Database", "Major"],
        details: [
          "Git 集成：每次对话自动创建独立 branch，一键提 PR",
          "沙箱运行时：可导入任意 GitHub repo，真实代码环境",
          "数据库连接：Snowflake、AWS 等企业级数据源",
          "Token 计费替代固定 credits：按复杂度动态计费",
          "VS Code 式代码编辑器内嵌：file-by-file 查看和手动编辑",
        ],
        videos: [
          {
            // [Claude Code 2026-04-20] poster URL 404，由 VideoCardThumb 直接从视频提取首帧
            type: "mp4",
            url: "https://pdgvvgmkdvyeydso.public.blob.vercel-storage.com/changelog/git-import.mp4",
          },
        ],
      },
      {
        date: "2026-01-27",
        title: "Folders & Projects 重组",
        summary: "项目管理重构，支持文件夹组织对话和代码",
        tags: ["Projects", "Organization"],
        details: [
          "引入文件夹结构组织对话和生成的代码",
          "项目视图支持多个相关对话归组",
          "快速跳转和搜索项目内资产",
        ],
        videos: [
          {
            // [Claude Code 2026-04-20] poster URL 404，由 VideoCardThumb 直接从视频提取首帧
            type: "mp4",
            url: "https://pdgvvgmkdvyeydso.public.blob.vercel-storage.com/changelog/folders-changelog.mp4",
          },
        ],
      },
      // [Claude Code 2026-04-20] Split shadcn.mp4 into its own entry.
      // shadcn.mp4 shows the shadcn/ui component-picker workflow, NOT the
      // option+D visual CSS editor. Keeping them merged caused "界面和内容对不上".
      {
        date: "2025-11-01",
        title: "shadcn/ui 组件直接集成",
        summary: "在 v0 中一键添加任意 shadcn/ui 组件",
        tags: ["shadcn/ui", "Components", "DX"],
        details: [
          "组件面板：浏览并一键插入全套 shadcn/ui 组件",
          "自动适配项目已有主题 token（颜色、圆角、字体）",
          "与 Chat 协同：选中组件后可继续用自然语言描述调整",
          "组件代码直接落进项目文件，可手动编辑",
        ],
        videos: [
          {
            type: "mp4",
            url: "https://pdgvvgmkdvyeydso.public.blob.vercel-storage.com/changelog/shadcn.mp4",
          },
        ],
      },
      // [Claude Code 2026-04-21] Source: https://x.com/v0/status/1932892095565660490
      {
        date: "2025-06-11",
        title: "Design Mode 上线",
        summary: "Option+D 点选元素精细调整，完全免费不消耗 token",
        tags: ["Design Mode", "No-Token", "Visual Edit", "Major"],
        details: [
          "Option+D 激活 Design Mode，光标变选择工具",
          "悬停高亮元素，点击选中 → 右侧 Design Panel 出现",
          "Design Panel 控件：Typography / Color / Layout / Border / Shadow / 文字内容",
          "完全免费，不消耗任何 credits！",
          "修改实时同步更新底层代码",
        ],
        images: [
          "https://pbs.twimg.com/amplify_video_thumb/1932892033020235776/img/865aAhiVPrgzbgYC.jpg?name=orig",
        ],
        videos: [
          {
            type: "mp4",
            // [Claude Code 2026-04-21] twimg 视频需通过 /api/video-proxy 转发（直接访问 403）
            url: "/api/video-proxy?url=https://video.twimg.com/amplify_video/1932892033020235776/vid/avc1/1280x720/5QnuxWnSlv0672PH.mp4?tag=14",
            poster: "https://pbs.twimg.com/amplify_video_thumb/1932892033020235776/img/865aAhiVPrgzbgYC.jpg?name=orig",
          },
        ],
      },
      {
        date: "2024-10-01",
        title: "v0 公开发布",
        summary: "Chat → UI 代码生成，shadcn/ui 原生支持",
        tags: ["Launch"],
        details: [
          "自然语言描述 → 生成完整 React 组件",
          "原生支持 shadcn/ui 组件库",
          "Preview + Code 双视图切换",
          "支持多轮对话迭代",
        ],
      },
    ],
  },
  {
    id: "figma-ai",
    name: "Figma AI",
    tagline: "AI built into where you design",
    accentColor: "#A259FF",
    company: "Figma",
    changelogUrl: "https://www.figma.com/ai",
    websiteUrl: "https://www.figma.com/make",
    patternType: "waves",
    changes: [
      {
        date: "2026-04-02",
        title: "Make Kits + Make Attachments",
        summary: "原型从真实组件、数据和约束出发，不再从空白开始",
        tags: ["Make", "Design System", "Context"],
        details: [
          "Make Kits：为 Figma Make 带来设计系统组件和样式的上下文",
          "Make Attachments：将真实数据和约束注入原型生成过程",
          "Make 原型可内嵌进 Figma Design、FigJam、Slides",
          "Agent 修改组件时自动沿用团队设计规范",
        ],
        // [Claude Code 2026-04-21] Sanity CDN 图为营销插图，非产品截图 → 不在 Timeline River 中显示
      },
      // [Claude Code 2026-04-21] Source: https://x.com/figma/status/2036434766661296602
      {
        date: "2026-03-24",
        title: "use_figma MCP — AI Agent 直接操作画布 Open Beta",
        summary: "AI Agent 通过 use_figma MCP 工具直接在 Figma 画布上设计，open beta 开放",
        tags: ["MCP", "Agent", "Canvas", "Major"],
        details: [
          "use_figma MCP tool：AI Agent 可直接在 Figma 画布上执行设计操作",
          "Skills 系统：用 Markdown 定义 Agent 行为规范和设计惯例",
          "Open beta：任何 Figma 用户均可使用",
          "Agent 可创建 Frame、使用组件、应用变量、设置 Auto Layout",
        ],
        images: [
          "https://pbs.twimg.com/amplify_video_thumb/2036429643713323008/img/s6Wec1hWII4QzyQR.jpg?name=orig",
        ],
        videos: [
          {
            type: "mp4",
            // [Claude Code 2026-04-21] twimg 视频需通过 /api/video-proxy 转发（直接访问 403）
            url: "/api/video-proxy?url=https://video.twimg.com/amplify_video/2036429643713323008/vid/avc1/1280x720/xvERk60aoSVb--sN.mp4?tag=21",
            poster: "https://pbs.twimg.com/amplify_video_thumb/2036429643713323008/img/s6Wec1hWII4QzyQR.jpg?name=orig",
          },
        ],
      },
      {
        // [Claude Code 2026-04-21] 无真实产品 UI 截图 → 不在 Timeline River 中显示
        date: "2026-02-26",
        title: "Slides AI + FigJam AI 更新",
        summary: "幻灯片和白板的 AI 能力大幅增强",
        tags: ["Slides", "FigJam", "AI"],
        details: [
          "Slides AI：AI 一键生成完整演示文稿结构和内容",
          "FigJam AI：智能整理便利贴、生成流程图",
          "更多 AI 功能开放给免费用户",
        ],
      },
      {
        // [Claude Code 2026-04-21] API/开发者更新，非可见 UI 变化 → 不在 Timeline River 中显示
        // 原图为 Figma 博客营销插图，非产品截图
        date: "2026-01-22",
        title: "Write-to-Canvas API Beta",
        summary: "AI Agent 获得画布直接写权限，操作真实设计组件",
        tags: ["Canvas API", "Agent", "Write Access", "Major"],
        details: [
          "Figma MCP Server Write 权限开放 Beta",
          "Agent 可直接创建 Frame、使用组件、应用变量、设置 Auto Layout",
          "Skills 框架：Markdown 定义 Agent 行为规范，编码团队设计惯例",
          "改 token 全局同步，影响所有使用该 token 的组件",
          "「Agents Meet the Figma Canvas」正式发布",
        ],
      },
      {
        date: "2025-09-01",
        title: "Figma AI 系列功能上线",
        summary: "图片生成、文案生成、背景移除、AI 设计建议",
        tags: ["Launch", "AI Features"],
        details: [
          "AI 生成图片 / 优化现有图片",
          "生成/替换设计稿中的文案内容",
          "一键移除图片背景",
          "Figma Make：Chat → 生成前端代码（HTML/CSS/JS）",
          "Figma MCP Server（Read Only）上线，设计上下文注入 Cursor/Claude",
        ],
      },
      // [Claude Code 2026-04-21] Removed: "Figma AI 系列功能上线" 2025-09-01 — 日期为圆整占位，无来源
      // [Claude Code 2026-04-21] Source: https://x.com/figma/status/1915098380331839541
      {
        date: "2025-04-23",
        title: "Edit Image + gpt-image-1 接入",
        summary: "全新 Edit Image 功能上线，Figma Make an Image 切换至 gpt-image-1",
        tags: ["Edit Image", "gpt-image-1", "AI Features"],
        details: [
          "Edit Image（全新功能）：在现有图片上直接 AI 编辑，无需重新生成",
          "Make an Image 升级：接入 OpenAI gpt-image-1，生成质量大幅提升",
          "两项功能同日向所有用户推出",
        ],
        images: [
          "https://pbs.twimg.com/amplify_video_thumb/1915095961694564352/img/YDgHlHifayhnPTpf.jpg?name=orig",
        ],
        videos: [
          {
            type: "mp4",
            // [Claude Code 2026-04-21] twimg 视频需通过 /api/video-proxy 转发（直接访问 403）
            url: "/api/video-proxy?url=https://video.twimg.com/amplify_video/1915095961694564352/vid/avc1/1280x720/cMECNU5-JX4egEW4.mp4?tag=16",
            poster: "https://pbs.twimg.com/amplify_video_thumb/1915095961694564352/img/YDgHlHifayhnPTpf.jpg?name=orig",
          },
        ],
      },
    ],
  },
  {
    id: "canva",
    name: "Canva",
    tagline: "Design anything, publish anywhere",
    accentColor: "#7D2AE8",
    company: "Canva",
    changelogUrl: "https://www.canva.com/newsroom/news/",
    websiteUrl: "https://www.canva.com",
    patternType: "circles",
    changes: [
      // [Claude Code 2026-04-20] Source: youtube.com/watch?v=1GNYx2P1OB8 (Canva Create 2025)
      {
        date: "2025-04-10",
        title: "Visual Suite 2.0 — 统一创作格式",
        summary: "Canva Create 2025：文档、演示、网站、表格统一为单一设计格式",
        tags: ["Visual Suite", "Sheets", "Code", "Major"],
        details: [
          "Visual Suite 2.0：文档、演示、网站在同一设计中创建，无需切换工具",
          "Canva Sheets：深度可视化电子表格，Magic Insights + Magic Formulas 自动计算",
          "Canva Code：用 prompt 为设计添加交互功能，无需写代码",
          "Photo Editor：集成背景生成器，AI 将主体无缝融入新场景",
          "Magic Charts：接入 Google Analytics、HubSpot 实时数据，AI 推荐图表类型",
          "Canva AI 助手：支持语音和文字输入的一体化创意助手",
        ],
        videos: [
          { type: "youtube", videoId: "1GNYx2P1OB8" },
        ],
      },
      // [Claude Code 2026-04-20] Source: youtube.com/watch?v=Q2L1Y65VxBI (Canva Create 2024)
      {
        date: "2024-05-23",
        title: "全新 Canva — 为工作而生",
        summary: "Canva Create 2024：十年最大编辑器升级，Canva AI 2.0 + Enterprise 首发",
        tags: ["Editor Redesign", "Enterprise", "AI", "Major"],
        details: [
          "全新编辑器：十年来最大界面升级，更多创作空间和直觉操作体验",
          "全新主页：一眼览所有项目，快速访问团队资源和品牌规范",
          "Canva Enterprise：大型组织专用订阅，品牌资产管理 + 权限控制",
          "Work Kits：销售、市场、HR、创意团队专用模板套装",
          "Canva AI 2.0：基于世界首个创意专用基础模型驱动",
        ],
        videos: [
          { type: "youtube", videoId: "Q2L1Y65VxBI" },
        ],
      },
    ],
  },
];
