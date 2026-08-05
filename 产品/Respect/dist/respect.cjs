#!/usr/bin/env node
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/cli.ts
var cli_exports = {};
__export(cli_exports, {
  main: () => main
});
module.exports = __toCommonJS(cli_exports);

// src/core/version.ts
var VERSION = "0.1.0";
var HELP_TEXT = `\u{1F91D} Respect v${VERSION} \u2014 \u5C0A\u91CD\u4F60\u7684\u5DE5\u4F5C\u6D41\uFF1A\u901A\u7528\u4EFB\u52A1\u578B AI Agent

\u7528\u6CD5:
  respect <prompt>                     \u8FD0\u884C\u4E00\u4E2A\u4EFB\u52A1\uFF08\u6700\u5C0F\u95ED\u73AF\uFF1A\u9700\u6C42\u2192\u89C4\u5212\u2192\u6267\u884C\u2192\u9A8C\u8BC1\u2192\u6C89\u6DC0\u8BB0\u5FC6\uFF09
  respect run <prompt> [\u9009\u9879]          \u663E\u5F0F run \u5B50\u547D\u4EE4
  respect memory [--dump] [--search q] \u67E5\u770B/\u641C\u7D22 Memory Bank
  respect skill list|run <name>        Skills \u5217\u8868/\u590D\u7528

\u5168\u5C40\u9009\u9879:
  --session <name>       \u4F1A\u8BDD\u540D\uFF08\u9ED8\u8BA4: default\uFF09
  --permission <level>   \u6743\u9650\u7EA7\u522B read-only|local|sandbox|admin\uFF08\u9ED8\u8BA4: local\uFF09
  --cwd <dir>            \u4EFB\u52A1\u5DE5\u4F5C\u76EE\u5F55\uFF08\u9ED8\u8BA4: \u5F53\u524D\u76EE\u5F55\uFF09
  --model <provider:model>  \u6A21\u578B\u89C4\u683C\uFF08\u9ED8\u8BA4: echo:demo\uFF09
  --yes                  \u81EA\u52A8\u6279\u51C6\u654F\u611F\u64CD\u4F5C\uFF08\u5371\u9669\uFF0C\u8C28\u614E\u4F7F\u7528\uFF09
  -h, --help             \u663E\u793A\u5E2E\u52A9
  -v, --version          \u663E\u793A\u7248\u672C

\u793A\u4F8B:
  respect "\u5E2E\u6211\u770B\u770B\u5F53\u524D\u9879\u76EE\u7684\u7ED3\u6784" --permission read-only
  respect "\u4FEE\u590D src/main.ts \u4E2D\u7684 bug" --session debug-session
  respect memory --search "\u8E29\u5751"
  respect skill run daily-report
`;

// src/cli.ts
var import_node_url = require("node:url");

// src/memory/memoryBank.ts
var import_node_fs = require("node:fs");
var import_node_path = require("node:path");
var MEMORY_FILES = {
  user: "user.md",
  project: "project.md",
  decision: "decisions.md",
  pitfall: "pitfalls.md"
};
var MEMORY_TITLES = {
  user: "\u7528\u6237\u504F\u597D\u3001\u4E60\u60EF\u3001\u5DE5\u4F5C\u6D41",
  project: "\u9879\u76EE\u4E0A\u4E0B\u6587\u3001\u67B6\u6784\u51B3\u7B56",
  decision: "\u5173\u952E\u51B3\u7B56\u8BB0\u5F55\uFF08ADR\uFF09",
  pitfall: "\u8E29\u8FC7\u7684\u5751\u3001\u9519\u8BEF\u6559\u8BAD"
};
function formatEntry(entry) {
  const safeTitle = entry.title.replace(/\s*\n+\s*/g, " ").trim();
  const lines = [
    `## [${entry.createdAt}] ${safeTitle}`,
    `- source: ${entry.source}`,
    "",
    ...entry.body.trim().split("\n").map((l) => l.startsWith("  ") ? l : `  ${l}`),
    ""
  ];
  return lines.join("\n");
}
var MemoryBank = class {
  root;
  constructor(root) {
    this.root = root;
  }
  static defaultRoot(cwd) {
    return process.env.RESPECT_MEMORY_DIR || (0, import_node_path.join)(cwd, ".respect", "memory");
  }
  /** 确保目录与 4 个记忆文件存在（带文件头注释） */
  ensure() {
    (0, import_node_fs.mkdirSync)(this.root, { recursive: true });
    for (const kind of Object.keys(MEMORY_FILES)) {
      const p = (0, import_node_path.join)(this.root, MEMORY_FILES[kind]);
      if (!(0, import_node_fs.existsSync)(p)) {
        (0, import_node_fs.writeFileSync)(
          p,
          `# ${MEMORY_FILES[kind]} \u2014 ${MEMORY_TITLES[kind]}

<!-- \u6761\u76EE\u683C\u5F0F\uFF1A## [\u65F6\u95F4\u6233] \u6807\u9898 / - source: \u6765\u6E90 / \u7F29\u8FDB\u6B63\u6587 -->

`,
          "utf8"
        );
      }
    }
  }
  fileFor(kind) {
    return (0, import_node_path.join)(this.root, MEMORY_FILES[kind]);
  }
  /** 追加一条记忆 */
  record(entry) {
    this.ensure();
    const entryText = formatEntry(entry);
    (0, import_node_fs.appendFileSync)(this.fileFor(entry.kind), entryText, "utf8");
    return entryText;
  }
  /** 读取某类记忆全文 */
  read(kind) {
    const p = this.fileFor(kind);
    return (0, import_node_fs.existsSync)(p) ? (0, import_node_fs.readFileSync)(p, "utf8") : "";
  }
  /** 全部记忆原文 */
  dump() {
    return {
      user: this.read("user"),
      project: this.read("project"),
      decision: this.read("decision"),
      pitfall: this.read("pitfall")
    };
  }
  /** 简单关键词搜索（大小写不敏感子串匹配，按条目粒度返回） */
  search(query) {
    const q = query.toLowerCase();
    const hits = [];
    for (const kind of Object.keys(MEMORY_FILES)) {
      const text = this.read(kind);
      const blocks = text.split(/^## \[/m).slice(1);
      for (const block of blocks) {
        const firstLine = block.split("\n")[0] ?? "";
        const title = firstLine.includes("] ") ? firstLine.slice(firstLine.indexOf("] ") + 2) : firstLine;
        if (block.toLowerCase().includes(q)) {
          const body = block.split("\n").slice(2).join(" ").trim();
          hits.push({
            kind,
            file: MEMORY_FILES[kind],
            title: title.trim(),
            snippet: body.slice(0, 120)
          });
        }
      }
    }
    return hits;
  }
  /** 统计每类记忆的条目数 */
  stats() {
    const out = { user: 0, project: 0, decision: 0, pitfall: 0 };
    for (const kind of Object.keys(out)) {
      out[kind] = this.read(kind).split(/^## \[/m).length - 1;
    }
    return out;
  }
  /** 生成注入模型上下文的相关记忆摘要（任务开始时调用）。
   *  MED-2 修复：按文件内出现顺序取最新 limit 条（record 追加在文件末尾）。 */
  injectContext(limit = 3) {
    this.ensure();
    const parts = [];
    for (const kind of Object.keys(MEMORY_FILES)) {
      const hits = this.search("").filter((h) => h.kind === kind);
      for (const h of hits.slice(-limit)) {
        parts.push(`[${MEMORY_FILES[kind]}] ${h.title}: ${h.snippet}`);
      }
    }
    return parts.length ? `\u6765\u81EA Memory Bank \u7684\u76F8\u5173\u8BB0\u5FC6\uFF1A
${parts.map((p) => `- ${p}`).join("\n")}` : "Memory Bank \u6682\u65E0\u8BB0\u5FC6\u3002";
  }
};

// src/memory/cli.ts
async function runMemoryCommand(args) {
  const bank = new MemoryBank(MemoryBank.defaultRoot(args.cwd));
  bank.ensure();
  if (args.memoryAction === "search") {
    if (!args.memorySearch) {
      console.error("\u7528\u6CD5: respect memory --search <\u5173\u952E\u8BCD>");
      return 1;
    }
    const hits = bank.search(args.memorySearch);
    if (hits.length === 0) {
      console.log(`(\u65E0\u5339\u914D "${args.memorySearch}")`);
      return 0;
    }
    for (const h of hits) {
      console.log(`[${h.kind}] ${h.file} :: ${h.title}`);
      console.log(`    ${h.snippet}`);
    }
    return 0;
  }
  const stats = bank.stats();
  console.log(`Memory Bank \u4F4D\u4E8E: ${bank.root}`);
  console.log(`\u6761\u76EE\u7EDF\u8BA1: user=${stats.user} project=${stats.project} decision=${stats.decision} pitfall=${stats.pitfall}`);
  const dump = bank.dump();
  for (const kind of ["user", "project", "decision", "pitfall"]) {
    console.log(`
===== ${kind} (${dump[kind].split(/^## \[/m).length - 1} \u6761) =====`);
    if (dump[kind].trim()) console.log(dump[kind]);
  }
  return 0;
}

// src/skills/skills.ts
var import_node_fs2 = require("node:fs");
var import_node_path2 = require("node:path");
function parseFrontmatter(fm) {
  const meta = {};
  const params = [];
  let current = null;
  let inParams = false;
  for (const line of fm.split(/\r?\n/)) {
    const t = line.trim();
    if (t === "parameters:") {
      inParams = true;
      continue;
    }
    if (inParams) {
      if (t === "") continue;
      if (t.startsWith("- ")) {
        if (current) params.push(current);
        current = {};
        const rest = t.slice(2);
        current.name = rest.match(/name:\s*(\S+)/)?.[1];
        current.description = rest.match(/description:\s*(.+)/)?.[1];
        if (rest.includes("required: true")) current.required = true;
        continue;
      }
      if (current) {
        const dm = t.match(/^description:\s*(.+)$/);
        if (dm) current.description = dm[1];
        if (t === "required: true") current.required = true;
        continue;
      }
      inParams = false;
    }
    if (!inParams && t.includes(":")) {
      const idx = t.indexOf(":");
      const key = t.slice(0, idx).trim();
      if (key === "name" || key === "description") {
        let v = t.slice(idx + 1).trim();
        if (v === "true") v = true;
        else if (v === "false") v = false;
        meta[key] = v;
      }
    }
  }
  if (current) params.push(current);
  return { meta, params };
}
function parseSkill(raw) {
  const m = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if (!m) throw new Error("\u6280\u80FD\u683C\u5F0F\u9519\u8BEF\uFF1A\u7F3A\u5C11 YAML frontmatter\uFF08--- \u5F00\u5934\uFF09");
  const [, fm, body] = m;
  const { meta, params } = parseFrontmatter(fm);
  const steps = [];
  const bodyParts = body.split(/- tool:\s*/).slice(1);
  for (const part of bodyParts) {
    const tool = part.split("\n")[0].trim();
    const argsBlock = part.match(/args:\s*\n([\s\S]*)$/)?.[1] ?? "";
    const args = {};
    const argRe = /^\s{2,}(\S+):\s*(.+)$/gm;
    let am;
    while ((am = argRe.exec(argsBlock)) !== null) {
      args[am[1]] = am[2].trim().replace(/^"(.*)"$/, "$1");
    }
    if (tool) steps.push({ tool, args });
  }
  return {
    name: String(meta.name ?? ""),
    description: String(meta.description ?? ""),
    parameters: params,
    steps
  };
}
function serializeSkill(skill) {
  const lines = ["---", `name: ${skill.name}`, `description: ${skill.description}`, "parameters:"];
  for (const p of skill.parameters) {
    lines.push(`  - name: ${p.name}`);
    lines.push(`    description: ${p.description}`);
    if (p.required) lines.push("    required: true");
  }
  lines.push("---", "steps:");
  for (const s of skill.steps) {
    lines.push(`  - tool: ${s.tool}`);
    lines.push("    args:");
    for (const [k, v] of Object.entries(s.args)) {
      lines.push(`      ${k}: "${String(v)}"`);
    }
  }
  return lines.join("\n") + "\n";
}
function renderTemplate(template, params) {
  return template.replace(/\{\{\s*(\w+)\s*\}\}/g, (_, key) => params[key] ?? `{{${key}}}`);
}
function assertSafeName(name) {
  if (!/^[a-zA-Z0-9_-]+$/.test(name)) {
    throw new Error(`\u975E\u6CD5\u6280\u80FD\u540D: ${name}\uFF08\u4EC5\u5141\u8BB8\u5B57\u6BCD/\u6570\u5B57/-/_\uFF09`);
  }
}
var SkillStore = class {
  root;
  constructor(root) {
    this.root = root;
  }
  static defaultRoot(cwd) {
    return process.env.RESPECT_SKILLS_DIR || (0, import_node_path2.join)(cwd, ".respect", "skills");
  }
  ensure() {
    (0, import_node_fs2.mkdirSync)(this.root, { recursive: true });
  }
  list() {
    if (!(0, import_node_fs2.existsSync)(this.root)) return [];
    const skills = [];
    for (const f of (0, import_node_fs2.readdirSync)(this.root)) {
      if (!f.endsWith(".skill.md")) continue;
      try {
        skills.push(this.load(f.replace(/\.skill\.md$/, "")));
      } catch {
      }
    }
    return skills.sort((a, b) => a.name.localeCompare(b.name));
  }
  load(name) {
    assertSafeName(name);
    const p = (0, import_node_path2.join)(this.root, `${name}.skill.md`);
    if (!(0, import_node_fs2.existsSync)(p)) throw new Error(`\u6280\u80FD\u4E0D\u5B58\u5728: ${name}\uFF08.respect/skills/${name}.skill.md\uFF09`);
    return parseSkill((0, import_node_fs2.readFileSync)(p, "utf8"));
  }
  save(skill) {
    assertSafeName(skill.name);
    this.ensure();
    (0, import_node_fs2.writeFileSync)((0, import_node_path2.join)(this.root, `${skill.name}.skill.md`), serializeSkill(skill), "utf8");
  }
  /** 重放技能：参数替换 + 依序执行工具步骤 */
  async run(name, params, registry, ctx) {
    const skill = this.load(name);
    for (const p of skill.parameters) {
      if (p.required && (params[p.name] === void 0 || params[p.name] === "")) {
        throw new Error(`\u6280\u80FD ${name} \u7F3A\u5C11\u5FC5\u586B\u53C2\u6570: ${p.name}`);
      }
    }
    let executed = 0;
    for (const step of skill.steps) {
      const renderedArgs = {};
      for (const [k, v] of Object.entries(step.args)) {
        renderedArgs[k] = typeof v === "string" ? renderTemplate(v, params) : v;
      }
      const result = await registry.execute(step.tool, renderedArgs, ctx);
      executed++;
      console.log(`   \u2192 ${step.tool} ${JSON.stringify(renderedArgs)}`);
      console.log(`     ${result.ok ? "\u2714" : "\u2716"} ${result.output.split("\n").slice(0, 5).join("\n       ")}`);
    }
    return executed;
  }
};
function exampleSkill() {
  return {
    name: "daily-report",
    description: "\u751F\u6210\u6BCF\u65E5\u5DE5\u4F5C\u62A5\u544A",
    parameters: [
      { name: "date", description: "\u62A5\u544A\u65E5\u671F\uFF0C\u5982 2026-08-05", required: true }
    ],
    steps: [
      { tool: "list_dir", args: { path: "docs" } },
      { tool: "read_file", args: { path: "docs/{{date}}.md" } }
    ]
  };
}

// src/tools/permissions.ts
var LEVEL_ORDER = {
  "read-only": 0,
  local: 1,
  sandbox: 2,
  admin: 3
};
var VALID_LEVELS = ["read-only", "local", "sandbox", "admin"];
function parseLevel(s) {
  const v = s;
  if (VALID_LEVELS.includes(v)) return v;
  throw new Error(`\u672A\u77E5\u6743\u9650\u7EA7\u522B: ${s}\uFF08\u53EF\u9009: ${VALID_LEVELS.join(" | ")}\uFF09`);
}
function canRun(tool, session) {
  return LEVEL_ORDER[session] >= LEVEL_ORDER[tool.permission];
}
function needsApproval(tool, session) {
  return tool.sensitive && canRun(tool, session);
}
function describeTool(tool) {
  const parts = [`[${tool.permission}]`, tool.name];
  if (tool.sensitive) parts.push("(\u654F\u611F)");
  return parts.join(" ");
}

// src/tools/registry.ts
var ToolExecutionError = class extends Error {
  reason;
  constructor(message, reason) {
    super(message);
    this.reason = reason;
  }
};
var ToolRegistry = class {
  tools = /* @__PURE__ */ new Map();
  register(tool) {
    if (this.tools.has(tool.name)) {
      throw new Error(`\u5DE5\u5177\u91CD\u590D\u6CE8\u518C: ${tool.name}`);
    }
    this.tools.set(tool.name, tool);
  }
  get(name) {
    return this.tools.get(name);
  }
  list() {
    return [...this.tools.values()];
  }
  has(name) {
    return this.tools.has(name);
  }
  /** 执行工具：先做权限与审批策略判定，通过后调用实现。
   *  opts.approved = 调用方已通过交互审批，本次调用跳过审批判定（一次性）。 */
  async execute(name, args, ctx, opts) {
    const tool = this.tools.get(name);
    if (!tool) throw new ToolExecutionError(`\u672A\u6CE8\u518C\u7684\u5DE5\u5177: ${name}`, "not-found");
    if (!canRun(tool, ctx.permission)) {
      throw new ToolExecutionError(
        `\u6743\u9650\u4E0D\u8DB3: ${describeTool(tool)} \u9700\u8981 ${tool.permission}\uFF0C\u5F53\u524D\u4F1A\u8BDD\u4E3A ${ctx.permission}`,
        "permission-denied"
      );
    }
    if (needsApproval(tool, ctx.permission) && !ctx.approveSensitive && !opts?.approved) {
      throw new ToolExecutionError(
        `\u654F\u611F\u64CD\u4F5C\u9700\u8981\u5BA1\u6279: ${describeTool(tool)}\uFF08\u4F7F\u7528 --yes \u6216\u63D0\u5347\u6743\u9650\u540E\u91CD\u8BD5\uFF09`,
        "approval-required"
      );
    }
    let result;
    try {
      result = await tool.run(args, ctx);
    } catch (e) {
      const message = e instanceof Error ? e.message : String(e);
      ctx.evidence.push(`tool:${name} args=${JSON.stringify(args)} -> ERROR ${message}`);
      throw e instanceof ToolExecutionError ? e : new ToolExecutionError(`\u5DE5\u5177 ${name} \u6267\u884C\u5931\u8D25: ${message}`, "runtime");
    }
    ctx.evidence.push(`tool:${name} args=${JSON.stringify(args)} -> ok=${result.ok}`);
    return result;
  }
};

// src/tools/builtin.ts
var import_node_child_process = require("node:child_process");
var import_node_fs3 = require("node:fs");
var import_node_path3 = __toESM(require("node:path"), 1);
function isWithin(parent, child) {
  const rel = import_node_path3.default.relative(parent, child);
  return rel === "" || rel !== ".." && !rel.startsWith(".." + import_node_path3.default.sep) && !import_node_path3.default.isAbsolute(rel);
}
function resolveWithin(cwd, p) {
  const abs = import_node_path3.default.resolve(cwd, p);
  if (!isWithin(cwd, abs)) {
    throw new ToolExecutionError(`\u8DEF\u5F84\u8D8A\u754C: ${p} \u4E0D\u5728\u5DE5\u4F5C\u76EE\u5F55\u5185: ${cwd}`, "runtime");
  }
  const realCwd = (0, import_node_fs3.realpathSync)(cwd);
  let realTarget = null;
  try {
    realTarget = (0, import_node_fs3.realpathSync)(abs);
  } catch {
    let parent = import_node_path3.default.dirname(abs);
    while (parent !== import_node_path3.default.dirname(parent)) {
      try {
        realTarget = (0, import_node_fs3.realpathSync)(parent);
        break;
      } catch {
        parent = import_node_path3.default.dirname(parent);
      }
    }
  }
  if (realTarget && !isWithin(realCwd, realTarget)) {
    throw new ToolExecutionError(`\u8DEF\u5F84\u8D8A\u754C(symlink): ${p} \u89E3\u6790\u540E\u4F4D\u4E8E\u5DE5\u4F5C\u76EE\u5F55\u4E4B\u5916`, "runtime");
  }
  return abs;
}
function ok(output) {
  return { ok: true, output };
}
function str(args, key) {
  const v = args[key];
  if (typeof v !== "string" || v.length === 0) {
    throw new ToolExecutionError(`\u7F3A\u5C11\u5B57\u7B26\u4E32\u53C2\u6570: ${key}`, "runtime");
  }
  return v;
}
function registerBuiltinTools(reg) {
  reg.register({
    name: "list_dir",
    description: "\u5217\u51FA\u76EE\u5F55\u5185\u5BB9",
    permission: "read-only",
    sensitive: false,
    parameters: [
      { name: "path", description: "\u76EE\u5F55\u8DEF\u5F84\uFF08\u76F8\u5BF9\u5DE5\u4F5C\u76EE\u5F55\uFF09", required: true }
    ],
    run: (args, ctx) => {
      const dir = resolveWithin(ctx.cwd, str(args, "path"));
      if (!(0, import_node_fs3.existsSync)(dir)) throw new ToolExecutionError(`\u76EE\u5F55\u4E0D\u5B58\u5728: ${dir}`, "runtime");
      const entries = (0, import_node_fs3.readdirSync)(dir, { withFileTypes: true }).map(
        (e) => e.isDirectory() ? `${e.name}/` : e.name
      );
      return ok(entries.join("\n"));
    }
  });
  reg.register({
    name: "read_file",
    description: "\u8BFB\u53D6\u6587\u4EF6\u5185\u5BB9\uFF08\u5DE5\u4F5C\u76EE\u5F55\u5185\uFF09",
    permission: "read-only",
    sensitive: false,
    parameters: [{ name: "path", description: "\u6587\u4EF6\u8DEF\u5F84", required: true }],
    run: (args, ctx) => {
      const file = resolveWithin(ctx.cwd, str(args, "path"));
      if (!(0, import_node_fs3.existsSync)(file) || (0, import_node_fs3.statSync)(file).isDirectory()) {
        throw new ToolExecutionError(`\u6587\u4EF6\u4E0D\u5B58\u5728: ${file}`, "runtime");
      }
      return ok((0, import_node_fs3.readFileSync)(file, "utf8"));
    }
  });
  reg.register({
    name: "grep",
    description: "\u5728\u5DE5\u4F5C\u76EE\u5F55\u5185\u6309\u6B63\u5219\u641C\u7D22\u6587\u672C",
    permission: "read-only",
    sensitive: false,
    parameters: [
      { name: "pattern", description: "\u6B63\u5219\u8868\u8FBE\u5F0F", required: true },
      { name: "glob", description: "\u6587\u4EF6\u901A\u914D\u7B26\uFF0C\u5982 **/*.ts" }
    ],
    run: (args, ctx) => {
      const pattern = str(args, "pattern");
      let re;
      try {
        re = new RegExp(pattern, "i");
      } catch {
        throw new ToolExecutionError(`\u975E\u6CD5\u6B63\u5219: ${pattern}`, "runtime");
      }
      const results = [];
      const MAX_DEPTH = 64;
      const walk = (dir, depth) => {
        if (depth > MAX_DEPTH) return;
        let entries;
        try {
          entries = (0, import_node_fs3.readdirSync)(dir, { withFileTypes: true });
        } catch {
          return;
        }
        for (const e of entries) {
          if (e.name.startsWith(".") || e.name === "node_modules") continue;
          const p = import_node_path3.default.join(dir, e.name);
          if (e.isDirectory()) walk(p, depth + 1);
          else if (e.isFile()) {
            try {
              const lines = (0, import_node_fs3.readFileSync)(p, "utf8").split("\n");
              lines.forEach((line, i) => {
                if (re.test(line)) results.push(`${import_node_path3.default.relative(ctx.cwd, p)}:${i + 1}: ${line.trim()}`);
              });
            } catch {
            }
          }
        }
      };
      walk(ctx.cwd, 0);
      return ok(results.slice(0, 200).join("\n") || "(\u65E0\u5339\u914D)");
    }
  });
  reg.register({
    name: "write_file",
    description: "\u5199\u5165/\u8986\u76D6\u6587\u4EF6\uFF08\u5DE5\u4F5C\u76EE\u5F55\u5185\uFF0Clocal \u6743\u9650\uFF09",
    permission: "local",
    sensitive: false,
    parameters: [
      { name: "path", description: "\u6587\u4EF6\u8DEF\u5F84", required: true },
      { name: "content", description: "\u6587\u4EF6\u5185\u5BB9", required: true }
    ],
    run: (args, ctx) => {
      const file = resolveWithin(ctx.cwd, str(args, "path"));
      const content = str(args, "content");
      (0, import_node_fs3.mkdirSync)(import_node_path3.default.dirname(file), { recursive: true });
      (0, import_node_fs3.writeFileSync)(file, content, "utf8");
      return ok(`\u5DF2\u5199\u5165 ${file} (${content.length} \u5B57\u7B26)`);
    }
  });
  reg.register({
    name: "append_file",
    description: "\u8FFD\u52A0\u5185\u5BB9\u5230\u6587\u4EF6\uFF08\u5DE5\u4F5C\u76EE\u5F55\u5185\uFF0Clocal \u6743\u9650\uFF09",
    permission: "local",
    sensitive: false,
    parameters: [
      { name: "path", description: "\u6587\u4EF6\u8DEF\u5F84", required: true },
      { name: "content", description: "\u8FFD\u52A0\u5185\u5BB9", required: true }
    ],
    run: (args, ctx) => {
      const file = resolveWithin(ctx.cwd, str(args, "path"));
      (0, import_node_fs3.appendFileSync)(file, str(args, "content"), "utf8");
      return ok(`\u5DF2\u8FFD\u52A0\u5230 ${file}`);
    }
  });
  reg.register({
    name: "bash",
    description: "\u6267\u884C shell \u547D\u4EE4\uFF08sandbox \u6743\u9650 + \u654F\u611F\u5BA1\u6279\uFF09",
    permission: "sandbox",
    sensitive: true,
    parameters: [{ name: "command", description: "\u8981\u6267\u884C\u7684\u547D\u4EE4", required: true }],
    run: (args, ctx) => {
      const cmd = str(args, "command");
      try {
        const out = (0, import_node_child_process.execSync)(cmd, { cwd: ctx.cwd, encoding: "utf8", timeout: 3e4, stdio: ["ignore", "pipe", "pipe"] });
        return ok(out.trim() || "(\u547D\u4EE4\u6267\u884C\u6210\u529F\uFF0C\u65E0\u8F93\u51FA)");
      } catch (e) {
        const err = e;
        return {
          ok: false,
          output: `exit=${err.status ?? "?"}
${err.stdout ?? ""}${err.stderr ?? err.message ?? ""}`.trim()
        };
      }
    }
  });
  reg.register({
    name: "delete_file",
    description: "\u5220\u9664\u6587\u4EF6\uFF08admin \u6743\u9650 + \u654F\u611F\u5BA1\u6279\uFF09",
    permission: "admin",
    sensitive: true,
    parameters: [{ name: "path", description: "\u6587\u4EF6\u8DEF\u5F84", required: true }],
    run: (args, ctx) => {
      const file = resolveWithin(ctx.cwd, str(args, "path"));
      if (!(0, import_node_fs3.existsSync)(file)) throw new ToolExecutionError(`\u6587\u4EF6\u4E0D\u5B58\u5728: ${file}`, "runtime");
      (0, import_node_fs3.unlinkSync)(file);
      return ok(`\u5DF2\u5220\u9664 ${file}`);
    }
  });
}

// src/skills/cli.ts
async function runSkillCommand(args) {
  const store = new SkillStore(SkillStore.defaultRoot(args.cwd));
  store.ensure();
  if (args.skillAction === "record") {
    if (!args.skillName) {
      console.error("\u7528\u6CD5: respect skill record <\u6280\u80FD\u540D> [\u793A\u4F8B\u6587\u4EF6]");
      return 1;
    }
    const skill = { ...exampleSkill(), name: args.skillName };
    store.save(skill);
    console.log(`\u6280\u80FD\u5DF2\u5199\u5165: ${store.root}/${args.skillName}.skill.md`);
    console.log("\uFF08\u5B8C\u6574\u5F55\u5236\u80FD\u529B\u5C06\u5728\u684C\u9762\u7AEF GUI \u63D0\u4F9B\uFF0CCLI \u4E0B\u8BF7\u76F4\u63A5\u7F16\u8F91\u6280\u80FD\u6587\u4EF6\uFF09");
    return 0;
  }
  if (args.skillAction === "run") {
    if (!args.skillName) {
      console.error("\u7528\u6CD5: respect skill run <\u6280\u80FD\u540D> -- <\u53C2\u6570=\u503C>...");
      return 1;
    }
    const params = {};
    for (const a of args.prompt) {
      const m = a.match(/^(\w+)=(.*)$/);
      if (m) params[m[1]] = m[2];
    }
    const registry = new ToolRegistry();
    registerBuiltinTools(registry);
    const ctx = {
      cwd: args.cwd,
      permission: parseLevel(args.permission),
      approveSensitive: args.approveSensitive,
      evidence: []
    };
    try {
      console.log(`\u{1F91D} \u91CD\u653E\u6280\u80FD: ${args.skillName}`);
      const executed = await store.run(args.skillName, params, registry, ctx);
      console.log(`\u2705 \u6280\u80FD\u6267\u884C\u5B8C\u6210\uFF08${executed} \u6B65\uFF09`);
      return 0;
    } catch (e) {
      console.error(`\u2716 ${e.message}`);
      return 1;
    }
  }
  const skills = store.list();
  console.log(`Skills \u76EE\u5F55: ${store.root}`);
  if (skills.length === 0) {
    console.log("(\u6682\u65E0\u6280\u80FD\uFF0C\u53EF\u7528 respect skill record <name> \u521B\u5EFA\u793A\u4F8B)");
    return 0;
  }
  for (const s of skills) {
    const params = s.parameters.map((p) => `${p.name}${p.required ? "*" : ""}`).join(", ") || "(\u65E0\u53C2\u6570)";
    console.log(`  ${s.name} \u2014 ${s.description}`);
    console.log(`    \u53C2\u6570: ${params} | \u6B65\u9AA4: ${s.steps.length}`);
  }
  return 0;
}

// src/agent/orchestrator.ts
var import_promises = require("node:readline/promises");
var import_node_process = require("node:process");

// src/agent/planner.ts
var SPLIT_RE = /[。；;，,\n]/;
function plan(prompt, maxTasks = 5) {
  const trimmed = prompt.trim();
  if (!trimmed) return [];
  const sentences = trimmed.split(SPLIT_RE).map((s) => s.trim()).filter((s) => s.length > 0);
  const items = (sentences.length > 1 ? sentences : [trimmed]).slice(0, maxTasks);
  return items.map((description, i) => ({ id: i + 1, description }));
}
function describePlan(tasks) {
  return tasks.map((t) => `${t.id}. ${t.description}`).join("\n");
}

// src/gateway/echo.ts
function extractFile(text) {
  const m = text.match(/[\w./\\-]+\.(ts|tsx|js|jsx|json|md|mjs|cjs|cs|py|txt)/i);
  return m ? m[0] : void 0;
}
function inferPlan(userText) {
  const calls = [];
  const file = extractFile(userText);
  if (/查看|结构|列出|list|inspect/i.test(userText)) {
    calls.push(JSON.stringify({ tool: "list_dir", args: { path: "." } }));
  }
  if (/读取|read|修复|fix/i.test(userText) && file) {
    calls.push(JSON.stringify({ tool: "read_file", args: { path: file } }));
  }
  if (/创建|写入|write|生成/i.test(userText)) {
    calls.push(JSON.stringify({ tool: "write_file", args: { path: file ?? "out.txt", content: "// \u7531 Respect echo \u6F14\u793A\u751F\u6210\n" } }));
  }
  if (/修复|fix|验证|测试|check/i.test(userText) && file) {
    calls.push(JSON.stringify({ tool: "bash", args: { command: `node --check "${file}"` } }));
  }
  if (calls.length === 0) {
    calls.push(JSON.stringify({ tool: "list_dir", args: { path: "." } }));
  }
  return calls.join("\n");
}
var EchoProvider = class {
  name = "echo";
  available() {
    return true;
  }
  async complete(req) {
    const last = req.messages[req.messages.length - 1];
    const userText = last?.role === "user" ? last.content : "";
    const plan2 = inferPlan(userText);
    return {
      content: `\u3010echo\u3011\u5DF2\u6536\u5230\u9700\u6C42\u3002\u63A8\u65AD\u6267\u884C\u8BA1\u5212\uFF1A
${plan2}`,
      toolCalls: plan2.split("\n").filter(Boolean)
    };
  }
};

// src/gateway/toolcalls.ts
function scanJsonObjects(text) {
  const objs = [];
  let depth = 0;
  let start = -1;
  let inString = false;
  let escape = false;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (inString) {
      if (escape) escape = false;
      else if (ch === "\\") escape = true;
      else if (ch === '"') inString = false;
      else if (ch === "\n") inString = false;
      continue;
    }
    if (ch === '"') {
      inString = true;
      continue;
    }
    if (ch === "{") {
      if (depth === 0) start = i;
      depth++;
    } else if (ch === "}") {
      depth = Math.max(0, depth - 1);
      if (depth === 0 && start >= 0) {
        objs.push(text.slice(start, i + 1));
        start = -1;
      }
    }
  }
  return objs;
}
function extractToolCalls(text) {
  const out = [];
  const seen = /* @__PURE__ */ new Set();
  for (const raw of scanJsonObjects(text)) {
    try {
      const obj = JSON.parse(raw);
      if (obj && typeof obj.tool === "string") {
        const call = { tool: obj.tool, args: obj.args ?? {} };
        const key = JSON.stringify(call);
        if (!seen.has(key)) {
          seen.add(key);
          out.push(call);
        }
      }
    } catch {
    }
  }
  return out;
}

// src/gateway/openai.ts
var OpenAICompatProvider = class {
  name = "openai";
  apiKey;
  baseUrl;
  timeoutMs;
  constructor() {
    this.apiKey = process.env.OPENAI_API_KEY ?? "";
    this.baseUrl = process.env.OPENAI_BASE_URL ?? "https://api.openai.com/v1";
    this.timeoutMs = Number(process.env.RESPECT_HTTP_TIMEOUT_MS ?? 3e4) || 3e4;
  }
  available() {
    return this.apiKey.length > 0 || /localhost|127\.0\.0\.1/i.test(this.baseUrl);
  }
  async complete(req) {
    if (!this.available()) {
      throw new Error("OpenAI \u63D0\u4F9B\u5546\u4E0D\u53EF\u7528\uFF1A\u8BF7\u8BBE\u7F6E OPENAI_API_KEY\uFF08\u6216 OPENAI_BASE_URL \u6307\u5411\u672C\u5730\u7AEF\u70B9\uFF09");
    }
    const url = `${this.baseUrl.replace(/\/$/, "")}/chat/completions`;
    const headers = { "Content-Type": "application/json" };
    if (this.apiKey) headers.Authorization = `Bearer ${this.apiKey}`;
    const body = JSON.stringify({
      model: req.model,
      messages: req.messages.map((m) => ({ role: m.role, content: m.content, name: m.name }))
    });
    const resp = await fetch(url, {
      method: "POST",
      headers,
      body,
      signal: AbortSignal.timeout(this.timeoutMs)
    });
    if (!resp.ok) {
      throw new Error(`OpenAI API ${resp.status}: ${(await resp.text()).slice(0, 300)}`);
    }
    const data = await resp.json();
    const content = data.choices?.[0]?.message?.content ?? "";
    return { content, toolCalls: extractToolCalls(content).map((c) => JSON.stringify(c)) };
  }
};

// src/gateway/index.ts
function parseModelSpec(spec) {
  const i = spec.indexOf(":");
  return i === -1 ? { provider: spec, model: "" } : { provider: spec.slice(0, i), model: spec.slice(i + 1) };
}
function createProvider(providerName) {
  switch (providerName) {
    case "echo":
      return new EchoProvider();
    case "openai":
      return new OpenAICompatProvider();
    default:
      throw new Error(`\u672A\u77E5\u6A21\u578B\u63D0\u4F9B\u5546: ${providerName}\uFF08\u53EF\u9009: echo | openai\uFF09`);
  }
}
function providerFor(spec) {
  const { provider, model } = parseModelSpec(spec);
  return { provider: createProvider(provider), model };
}

// src/agent/orchestrator.ts
var MAX_STEPS = 20;
async function askApproval(toolName, argsStr) {
  if (!import_node_process.stdin.isTTY) return false;
  const rl = (0, import_promises.createInterface)({ input: import_node_process.stdin, output: import_node_process.stdout });
  try {
    const answer = await rl.question(`\u26A0 \u654F\u611F\u64CD\u4F5C [${toolName}] ${argsStr}
  \u662F\u5426\u6279\u51C6\u6267\u884C? (y/N) `);
    return /^y(es)?$/i.test(answer.trim());
  } finally {
    rl.close();
  }
}
async function runTask(args) {
  const prompt = args.prompt.join(" ").trim();
  if (!prompt) {
    console.error('\u8BF7\u63D0\u4F9B\u9700\u6C42\u6587\u672C\uFF0C\u4F8B\u5982: respect "\u5E2E\u6211\u67E5\u770B\u9879\u76EE\u7ED3\u6784"');
    return 1;
  }
  console.log(`\u{1F91D} Respect \u2014 \u4EFB\u52A1\u5F00\u59CB`);
  console.log(`  \u9700\u6C42: ${prompt}`);
  console.log(`  \u4F1A\u8BDD: ${args.session} | \u6743\u9650: ${args.permission} | \u6A21\u578B: ${args.model} | \u5DE5\u4F5C\u76EE\u5F55: ${args.cwd}
`);
  const bank = new MemoryBank(MemoryBank.defaultRoot(args.cwd));
  bank.ensure();
  const memoryCtx = bank.injectContext();
  let provider;
  let model;
  try {
    ({ provider, model } = providerFor(args.model));
  } catch (e) {
    console.error(`\u2716 ${e.message}`);
    return 1;
  }
  if (!provider.available()) {
    console.error("\u2716 \u6A21\u578B\u63D0\u4F9B\u5546\u4E0D\u53EF\u7528\uFF08\u68C0\u67E5 API key \u6216\u4F7F\u7528 echo \u6F14\u793A provider\uFF09");
    return 1;
  }
  const registry = new ToolRegistry();
  registerBuiltinTools(registry);
  const ctx = {
    cwd: args.cwd,
    permission: parseLevel(args.permission),
    approveSensitive: args.approveSensitive,
    evidence: []
  };
  const tasks = plan(prompt);
  console.log(`\u2500\u2500 \u89C4\u5212: ${tasks.length} \u4E2A\u5B50\u4EFB\u52A1`);
  console.log(describePlan(tasks) + "\n");
  const systemPrompt = [
    "\u4F60\u662F Respect\uFF0C\u4E00\u4E2A\u5C0A\u91CD\u7528\u6237\u5DE5\u4F5C\u6D41\u7684\u901A\u7528\u4EFB\u52A1\u578B AI Agent\u3002",
    `\u5F53\u524D\u6743\u9650\u7EA7\u522B: ${args.permission}\uFF08read-only \u53EA\u80FD\u8BFB\uFF1Blocal \u53EF\u5199\u6587\u4EF6\uFF1Bsandbox \u53EF\u6267\u884C\u547D\u4EE4\uFF1Badmin \u53EF\u5220\u9664\uFF09\u3002`,
    `\u654F\u611F\u64CD\u4F5C\uFF08bash \u547D\u4EE4\u3001\u5220\u9664\u6587\u4EF6\uFF09\u9700\u8981\u5BA1\u6279\u3002`,
    memoryCtx,
    '\u8BF7\u8FD4\u56DE\u8BA1\u5212\u6267\u884C\u7684\u5DE5\u5177\u8C03\u7528\uFF0C\u6BCF\u884C\u4E00\u4E2A JSON\uFF1A{"tool":"\u5DE5\u5177\u540D","args":{...}}\u3002\u53EF\u7528\u5DE5\u5177: ' + registry.list().map((t) => `${t.name}(${t.permission})`).join(", ")
  ].join("\n");
  let steps = 0;
  for (const task of tasks) {
    if (steps >= MAX_STEPS) {
      console.log(`  \u26A0 \u8FBE\u5230\u6700\u5927\u6B65\u6570\u9650\u5236\uFF08${MAX_STEPS}\uFF09\uFF0C\u7EC8\u6B62\u4EFB\u52A1`);
      break;
    }
    console.log(`[${task.id}/${tasks.length}] \u5B50\u4EFB\u52A1: ${task.description}`);
    let resp;
    try {
      resp = await provider.complete({
        model,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: task.description }
        ]
      });
    } catch (e) {
      console.log(`   \u2716 \u6A21\u578B\u8C03\u7528\u5931\u8D25: ${e.message}`);
      continue;
    }
    const toolText = (resp.toolCalls && resp.toolCalls.length > 0 ? resp.toolCalls.join("\n") : "") || resp.content || "";
    const calls = extractToolCalls(toolText);
    if (calls.length === 0) {
      console.log(`   \uFF08\u6A21\u578B\u672A\u8FD4\u56DE\u5DE5\u5177\u8C03\u7528\uFF09${resp.content}`);
      continue;
    }
    for (const call of calls) {
      if (steps >= MAX_STEPS) {
        console.log("  \u26A0 \u8FBE\u5230\u6700\u5927\u6B65\u6570\u9650\u5236\uFF0C\u7EC8\u6B62\u6267\u884C");
        break;
      }
      steps++;
      const argsStr = JSON.stringify(call.args);
      console.log(`   \u2192 \u8C03\u7528\u5DE5\u5177 ${call.tool} ${argsStr}`);
      try {
        let result = await registry.execute(call.tool, call.args, ctx);
        if (!result.ok) {
          console.log(`     \u2716 \u5DE5\u5177\u8FD4\u56DE\u5931\u8D25:
${result.output.split("\n").map((l) => "       " + l).join("\n")}`);
          continue;
        }
        const lines = result.output.split("\n").slice(0, 10);
        console.log(`     \u2714 ${lines.join("\n       ")}`);
      } catch (e) {
        if (e instanceof ToolExecutionError && e.reason === "approval-required") {
          const approved = await askApproval(call.tool, argsStr);
          if (approved) {
            try {
              const result = await registry.execute(call.tool, call.args, ctx, { approved: true });
              console.log(`     \u2714 (\u5DF2\u5BA1\u6279) ${result.output.split("\n").slice(0, 5).join("\n       ")}`);
            } catch (e2) {
              console.log(`     \u2716 \u6267\u884C\u5931\u8D25: ${e2.message}`);
            }
          } else {
            console.log(`     \u23F8 \u654F\u611F\u64CD\u4F5C\u88AB\u62D2\u7EDD: ${call.tool}`);
          }
        } else if (e instanceof ToolExecutionError) {
          console.log(`     \u2716 ${e.message}`);
        } else {
          console.log(`     \u2716 \u610F\u5916\u9519\u8BEF: ${e.message}`);
        }
      }
    }
  }
  console.log(`
\u2500\u2500 \u9A8C\u8BC1`);
  const bashEvidence = ctx.evidence.filter((e) => e.startsWith("tool:bash "));
  if (bashEvidence.length > 0) {
    console.log(`   bash \u9A8C\u8BC1\u6267\u884C ${bashEvidence.length} \u6B21\uFF08\u8BE6\u89C1\u4E0A\u65B9\u8F93\u51FA\uFF09`);
  }
  const failed = ctx.evidence.filter((e) => e.includes(" -> ok=false") || e.includes(" -> ERROR"));
  console.log(`   \u5DE5\u5177\u8C03\u7528\u8FFD\u6EAF: ${ctx.evidence.length} \u6B21\uFF08\u5931\u8D25 ${failed.length} \u6B21\uFF09`);
  if (failed.length > 0) console.log("   \u26A0 \u5B58\u5728\u5931\u8D25\u7684\u5DE5\u5177\u8C03\u7528\uFF0C\u8BF7\u68C0\u67E5\u8F93\u51FA");
  try {
    bank.record({
      kind: "project",
      title: `\u4EFB\u52A1: ${prompt.slice(0, 50)}`,
      body: `\u5728 ${(/* @__PURE__ */ new Date()).toISOString()} \u5B8C\u6210\uFF0C\u5171 ${ctx.evidence.length} \u6B21\u5DE5\u5177\u8C03\u7528\uFF08\u5931\u8D25 ${failed.length} \u6B21\uFF09\u3002\u9700\u6C42: ${prompt}`,
      source: `session:${args.session}`,
      createdAt: (/* @__PURE__ */ new Date()).toISOString()
    });
    console.log(`
\u2500\u2500 \u8BB0\u5FC6\u5DF2\u6C89\u6DC0 \u2192 ${bank.fileFor("project")}`);
  } catch (e) {
    console.log(`
\u2500\u2500 \u26A0 \u8BB0\u5FC6\u6C89\u6DC0\u5931\u8D25: ${e.message}`);
  }
  console.log("\n\u2705 \u4EFB\u52A1\u5B8C\u6210");
  return 0;
}

// src/cli.ts
var import_meta = {};
function parseArgs(argv) {
  const out = {
    command: "run",
    prompt: [],
    session: "default",
    permission: "local",
    cwd: process.cwd(),
    model: "echo:demo",
    approveSensitive: false,
    help: false,
    version: false,
    memoryAction: "dump",
    memorySearch: void 0,
    skillAction: "list",
    skillName: void 0,
    skillPath: void 0
  };
  const rest = [];
  let commandSet = false;
  let i = 0;
  while (i < argv.length) {
    const a = argv[i];
    switch (a) {
      case "--help":
      case "-h":
        out.help = true;
        i++;
        break;
      case "--version":
      case "-v":
        out.version = true;
        i++;
        break;
      case "--session":
        out.session = argv[++i] ?? "";
        i++;
        break;
      case "--permission":
        out.permission = argv[++i] ?? "local";
        i++;
        break;
      case "--cwd":
        out.cwd = argv[++i] ?? process.cwd();
        i++;
        break;
      case "--model":
        out.model = argv[++i] ?? "echo:demo";
        i++;
        break;
      case "--yes":
        out.approveSensitive = true;
        i++;
        break;
      case "run":
      case "memory":
      case "skill":
        if (!commandSet) {
          out.command = a;
          commandSet = true;
        } else {
          rest.push(a);
        }
        i++;
        break;
      case "--dump":
        out.memoryAction = "dump";
        i++;
        break;
      case "--search":
        out.memorySearch = argv[++i] ?? "";
        out.memoryAction = "search";
        i++;
        break;
      case "list":
        out.skillAction = "list";
        i++;
        break;
      default:
        rest.push(a);
        i++;
    }
  }
  if (out.command === "run") out.prompt = rest;
  else if (out.command === "skill") {
    if (rest[0] === "run") {
      out.skillAction = "run";
      out.skillName = rest[1];
      out.prompt = rest.slice(2);
    } else if (rest[0] === "record") {
      out.skillAction = "record";
      out.skillName = rest[1];
      out.skillPath = rest[2];
    } else {
      out.skillAction = "list";
    }
  }
  return out;
}
async function main(argv) {
  const args = parseArgs(argv);
  if (args.help || argv.length === 0) {
    console.log(HELP_TEXT);
    return 0;
  }
  if (args.version) {
    console.log(`respect v${VERSION}`);
    return 0;
  }
  if (args.command === "memory") {
    return runMemoryCommand(args);
  }
  if (args.command === "skill") {
    return runSkillCommand(args);
  }
  return runTask(args);
}
var entryUrl = process.argv[1] ? (0, import_node_url.pathToFileURL)(process.argv[1]).href : "";
var isSeaExe = !!process.argv[1] && /\.exe$/i.test(process.argv[1]);
if (import_meta.url === entryUrl || isSeaExe) {
  main(process.argv.slice(2)).then(
    (code) => process.exit(code),
    (err) => {
      console.error("[respect] \u81F4\u547D\u9519\u8BEF:", err instanceof Error ? err.message : err);
      process.exit(1);
    }
  );
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  main
});
