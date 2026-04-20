export type ChangeEntry = {
  date: string; // YYYY-MM-DD
  version?: string;
  title: string;
  summary: string;
  tags: string[];
  details: string[];
  screenshot?: string; // URL or local path
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
      {
        date: "2026-04-02",
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
        screenshot: "https://storage.googleapis.com/gweb-developer-goog-blog-assets/images/editor-open-agent-manager.original.png",
      },
      {
        date: "2026-03-15",
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
      },
      {
        date: "2026-01-20",
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
      },
      {
        date: "2025-10-01",
        version: "0.42",
        title: "Composer Agent Mode",
        summary: "Composer 支持 Agent Mode，可访问终端和文件系统",
        tags: ["Composer", "Agent", "Terminal"],
        details: [
          "Composer 内一键切换 Agent Mode",
          "Agent 获得 Terminal、文件系统、浏览器权限",
          "多文件 Diff 预览后确认",
          "Codebase 全量索引，跨文件语义搜索",
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
      {
        date: "2026-04-01",
        version: "1.x",
        title: "SOLO Coder GA 正式发布",
        summary: "SOLO Coder 正式版上线，多 Agent 协作 + 语音交互",
        tags: ["SOLO", "Multi-Agent", "Voice", "Major"],
        details: [
          "SOLO Coder 正式 GA：深度规划 + 精准执行 + 子 Agent 协调",
          "多 Agent 并行：不同任务分配不同模型，各自独立上下文",
          "语音输入：像对队友一样说话，实时转码执行",
          "集成 Terminal、Editor、文档、浏览器、Figma 于统一上下文",
          "Chat 居中作为主区，左侧「项目树 + 持久化任务列表」",
        ],
      },
      {
        date: "2026-02-15",
        title: "MCP 支持 + Windows 版本",
        summary: "MCP 协议接入，正式支持 Windows 10/11",
        tags: ["MCP", "Windows", "Platform"],
        details: [
          "MCP 支持：IDE AI 连接外部工具和数据源",
          "Windows 10/11 正式支持（此前仅 macOS）",
          "Builder Mode 细化：步骤预览 UI 更清晰",
        ],
      },
      {
        date: "2026-01-01",
        title: "Builder Mode 上线",
        summary: "三阶段「理解→规划→执行」交互流，先计划再动手",
        tags: ["Builder Mode", "Planning", "Major"],
        details: [
          "Builder Mode：读取需求 → 分步规划展示 → 用户确认 → 逐步执行",
          "实时展示将要修改的文件预览",
          "免费访问 Claude 3.7 Sonnet、GPT-4o、DeepSeek R1",
          "多模态 Chat：截图/设计稿直接拖入生成 UI 代码",
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
        screenshot: "https://storage.googleapis.com/gweb-developer-goog-blog-assets/images/editor-open-agent-manager.original.png",
      },
      {
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
      },
    ],
  },
  {
    id: "pencil",
    name: "Pencil",
    tagline: "Design on canvas. Land in code.",
    accentColor: "#F59E0B",
    company: "Pencil Labs",
    changelogUrl: "https://docs.pencil.dev",
    websiteUrl: "https://www.pencil.dev",
    patternType: "hexagon",
    changes: [
      {
        date: "2026-03-01",
        title: "Agent Teams — 6 Agent 并行设计",
        summary: "多 Agent 并行操作画布，世界首个并发 Agent 设计工具",
        tags: ["Multi-Agent", "Canvas", "Major"],
        details: [
          "最多 6 个 Agent 并行操作同一画布的不同区域",
          "Agent 步骤实时透明展示：ToolSearch → Reading objects → Design → Reviewing visuals",
          "Agent 操作对象为真实设计组件，非代码字符串",
          "支持 Claude Code CLI / OpenAI Codex / Gemini CLI / Kiro CLI 多种 Agent 接入",
        ],
      },
      {
        date: "2026-01-15",
        title: "MCP-first 架构 + Claude Code 集成",
        summary: "完整读写画布 API，与 Claude Code 工作流深度融合",
        tags: ["MCP", "Claude Code", "Architecture", "Major"],
        details: [
          "MCP-first：AI Agent 通过 MCP 协议完整读写画布对象",
          "Agent 可读取设计变量（颜色 token、spacing 等）并直接应用",
          "与 Claude Code 工作流打通：设计 → 代码无缝流转",
          "无限画布（Infinite Canvas）：pan/zoom 如同 Figma",
          "右侧属性面板：手动微调尺寸/颜色/字体，和 Agent 操作同一层对象",
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
      },
      {
        date: "2025-06-10",
        title: "Design Mode 上线",
        summary: "点选元素精细调整，完全免费不消耗 token",
        tags: ["Design Mode", "No-Token", "Visual Edit", "Major"],
        details: [
          "Option+D 激活 Design Mode，光标变选择工具",
          "悬停高亮元素，点击选中 → 右侧 Design Panel 出现",
          "Design Panel 控件：Typography / Color / Layout / Border / Shadow / 文字内容",
          "完全免费，不消耗任何 credits！",
          "目前支持 Tailwind + shadcn/ui 组件体系",
          "修改实时同步更新底层代码",
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
      },
      {
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
    ],
  },
];
