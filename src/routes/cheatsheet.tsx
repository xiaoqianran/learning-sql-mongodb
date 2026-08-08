import { createFileRoute, Link } from "@tanstack/react-router";
import { BookMarked } from "lucide-react";

export const Route = createFileRoute("/cheatsheet")({
  component: CheatsheetPage,
});

const SECTIONS: { title: string; items: { k: string; v: string }[] }[] = [
  {
    title: "SQL · 查询",
    items: [
      { k: "SELECT col", v: "投影列；* 全列（慎用）" },
      { k: "FROM t alias", v: "数据源与别名" },
      { k: "WHERE", v: "行过滤；AND/OR/IN/LIKE/IS NULL" },
      { k: "JOIN … ON", v: "INNER 匹配；LEFT 保留左表" },
      { k: "GROUP BY", v: "分组；配合 COUNT/SUM/AVG" },
      { k: "ORDER BY", v: "ASC/DESC 排序" },
      { k: "LIMIT n", v: "限制返回行数" },
    ],
  },
  {
    title: "SQL · 写与结构",
    items: [
      { k: "INSERT INTO", v: "插入行" },
      { k: "UPDATE … SET", v: "修改；务必带 WHERE" },
      { k: "DELETE FROM", v: "删除；务必带 WHERE" },
      { k: "CREATE TABLE", v: "DDL 建表" },
      { k: "PRIMARY KEY", v: "唯一标识一行" },
      { k: "INDEX", v: "加速查找；写有代价" },
      { k: "BEGIN/COMMIT", v: "事务原子提交" },
    ],
  },
  {
    title: "MongoDB · CRUD",
    items: [
      { k: "db.c.find(q)", v: "查询文档集" },
      { k: "findOne", v: "单文档或 null" },
      { k: "insertOne/Many", v: "写入" },
      { k: "updateOne + $set", v: "局部更新" },
      { k: "$inc / $push", v: "增减 / 数组追加" },
      { k: "deleteMany", v: "按条件删除" },
      { k: "countDocuments", v: "计数" },
    ],
  },
  {
    title: "MongoDB · 查询与聚合",
    items: [
      { k: "$gt $gte $lt $lte", v: "比较" },
      { k: "$in $nin", v: "集合成员" },
      { k: "$or $and", v: "逻辑组合" },
      { k: "$regex", v: "正则匹配" },
      { k: "aggregate", v: "管道：$match $group $sort…" },
      { k: "$group._id", v: "分组键；null 为全局" },
      { k: "$sum $avg", v: "聚合累加器" },
    ],
  },
  {
    title: "建模与选型",
    items: [
      { k: "关系型", v: "范式、JOIN、强事务" },
      { k: "文档型", v: "内嵌/引用、灵活字段" },
      { k: "内嵌", v: "一起读、一对少" },
      { k: "引用", v: "复用、多对多" },
      { k: "参数化 SQL", v: "防注入" },
      { k: "迁移", v: "版本化 schema 变更" },
      { k: "备份", v: "还要演练恢复" },
    ],
  },
];

function CheatsheetPage() {
  return (
    <div className="mx-auto max-w-3xl pb-16">
      <header className="mb-6">
        <p className="inline-flex items-center gap-1.5 text-xs font-medium uppercase tracking-wider text-primary">
          <BookMarked className="h-3.5 w-3.5" />
          速查 · SQL & MongoDB
        </p>
        <h1 className="mt-1 font-display text-2xl font-semibold text-fg sm:text-3xl">
          语法速查表
        </h1>
        <p className="mt-2 text-sm text-muted">
          高频语法一页掌握。动手见{" "}
          <Link to="/playground" className="text-primary no-underline hover:underline">
            Playground
          </Link>{" "}
          与{" "}
          <Link to="/studio" className="text-primary no-underline hover:underline">
            查询工坊
          </Link>
          。
        </p>
      </header>

      <div className="grid gap-4">
        {SECTIONS.map((sec) => (
          <section
            key={sec.title}
            className="overflow-hidden rounded-xl border border-border bg-surface"
          >
            <h2 className="border-b border-border bg-surface-2 px-4 py-2.5 font-display text-sm font-semibold text-fg">
              {sec.title}
            </h2>
            <ul className="divide-y divide-border">
              {sec.items.map((it) => (
                <li
                  key={it.k}
                  className="grid gap-1 px-4 py-2.5 sm:grid-cols-[14rem_1fr] sm:gap-3"
                >
                  <code className="font-mono text-xs text-primary">{it.k}</code>
                  <span className="text-sm text-muted">{it.v}</span>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}
