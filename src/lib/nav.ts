import {
  Award,
  BookMarked,
  BookOpen,
  BookX,
  Code2,
  FlaskConical,
  LayoutDashboard,
  Library,
  Server,
  type LucideIcon,
} from "lucide-react";
import type { Lesson } from "@/data/lessons";
import { LESSONS, TRACKS, getCourseLessons } from "@/data/lessons";

export const TRACK_META: Record<
  Lesson["track"],
  { order: number; label: string; blurb: string }
> = {
  "SQL 入门": { order: 1, label: "① SQL 入门", blurb: "SELECT · WHERE · JOIN · 聚合" },
  "SQL 进阶": { order: 2, label: "② SQL 进阶", blurb: "子查询 · DML · 索引 · 事务" },
  "SQL 实战": { order: 3, label: "③ SQL 实战", blurb: "分析查询 · 注入 · 执行计划" },
  "MongoDB 入门": { order: 4, label: "④ Mongo 入门", blurb: "文档 · CRUD · 操作符" },
  "MongoDB 进阶": { order: 5, label: "⑤ Mongo 进阶", blurb: "聚合 · 索引 · 建模" },
  "对比与选型": { order: 6, label: "⑥ 对比选型", blurb: "SQL vs Mongo · 一致性" },
  "工程实践": { order: 7, label: "⑦ 工程实践", blurb: "迁移 · ORM · 备份 · 毕业" },
  "知识卡片": { order: 8, label: "⑧ 知识卡片", blurb: "可选加深 · 不阻塞结业" },
};

export function trackLabel(track: Lesson["track"]) {
  return TRACK_META[track]?.label ?? track;
}

export function orderedTracks(): Lesson["track"][] {
  return [...TRACKS].sort((a, b) => (TRACK_META[a]?.order ?? 99) - (TRACK_META[b]?.order ?? 99));
}

export function getValidCompleted(completed: string[]): string[] {
  const set = new Set(LESSONS.map((l) => l.slug));
  return completed.filter((s) => set.has(s));
}

export function completedCount(completed: string[]): number {
  const set = new Set(getValidCompleted(completed));
  return getCourseLessons().filter((l) => set.has(l.slug)).length;
}

export function progressPercent(completed: string[]): number {
  const core = getCourseLessons();
  if (core.length === 0) return 0;
  return Math.round((completedCount(completed) / core.length) * 100);
}

export function isAllComplete(completed: string[]): boolean {
  return getCourseLessons().every((l) => completed.includes(l.slug));
}

export function getContinueLesson(completed: string[]): Lesson {
  const coreNext = getCourseLessons().find((l) => !completed.includes(l.slug));
  if (coreNext) return coreNext;
  const next = LESSONS.find((l) => !completed.includes(l.slug));
  if (next) return next;
  return LESSONS[LESSONS.length - 1] ?? LESSONS[0]!;
}

export function getContinueHref(completed: string[]): {
  kind: "lesson" | "certificate";
  slug?: string;
} {
  if (isAllComplete(completed)) return { kind: "certificate" };
  return { kind: "lesson", slug: getContinueLesson(completed).slug };
}

export type NavItem = {
  to:
    | "/"
    | "/docs"
    | "/cheatsheet"
    | "/studio"
    | "/playground"
    | "/lab"
    | "/hub"
    | "/mistakes"
    | "/certificate";
  label: string;
  hint?: string;
  icon: LucideIcon;
};

export const NAV_PRIMARY: NavItem[] = [
  { to: "/docs", label: "地图", hint: "查 · 官方文档对照", icon: Library },
  { to: "/studio", label: "工坊", hint: "练 · 查询闯关", icon: Server },
  { to: "/hub", label: "进度", hint: "我 · 学习中心", icon: LayoutDashboard },
];

export const NAV_TOOLS: NavItem[] = [
  { to: "/cheatsheet", label: "速查表", hint: "SQL / Mongo 语法", icon: BookMarked },
  { to: "/playground", label: "Playground", hint: "自由写查询", icon: Code2 },
  { to: "/lab", label: "练习场", hint: "刷测验题", icon: FlaskConical },
  { to: "/mistakes", label: "错题本", hint: "错题重练", icon: BookX },
  { to: "/certificate", label: "结业证书", hint: "全部完成后解锁", icon: Award },
];

export const NAV_HOME: NavItem = {
  to: "/",
  label: "学 · 首页",
  hint: "路径与大纲",
  icon: BookOpen,
};
