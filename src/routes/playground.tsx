import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { createShopSchema, runSql, type SqlTable } from "@/lib/sql-engine";
import { createShopMongo, runMongo, type MongoCollection } from "@/lib/mongo-engine";
import { ResultPanel, MongoResultPanel } from "@/components/demos/InteractiveDemos";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Code2, Database, Play, RotateCcw } from "lucide-react";

export const Route = createFileRoute("/playground")({
  component: PlaygroundPage,
});

const SQL_SAMPLES = [
  { id: "users", title: "查用户", sql: "SELECT * FROM users;" },
  {
    id: "join",
    title: "订单 JOIN",
    sql: "SELECT o.id, u.name, o.total\nFROM orders o\nJOIN users u ON o.user_id = u.id\nWHERE o.status = 'paid';",
  },
  {
    id: "agg",
    title: "分组统计",
    sql: "SELECT category, COUNT(*) AS n, AVG(price) AS avg_price\nFROM products\nGROUP BY category;",
  },
  {
    id: "insert",
    title: "插入用户",
    sql: "INSERT INTO users (id, name, email, city, age)\nVALUES (10, 'Zed', 'zed@mail.com', 'Sapporo', 27);\nSELECT * FROM users WHERE id = 10;",
  },
];

const MONGO_SAMPLES = [
  { id: "find", title: "find", cmd: 'db.users.find({ city: "Osaka" })' },
  {
    id: "ops",
    title: "操作符",
    cmd: "db.products.find({ price: { $lt: 50 }, category: \"Books\" })",
  },
  {
    id: "agg",
    title: "aggregate",
    cmd: 'db.orders.aggregate([\n  { $match: { status: "paid" } },\n  { $group: { _id: "$user_id", spent: { $sum: "$total" } } },\n  { $sort: { spent: -1 } }\n])',
  },
  {
    id: "update",
    title: "updateOne",
    cmd: 'db.users.updateOne({ name: "Eve" }, { $push: { tags: "lead" } })',
  },
];

function PlaygroundPage() {
  const [mode, setMode] = useState<"sql" | "mongo">("sql");
  return (
    <div className="mx-auto max-w-5xl pb-16">
      <header className="mb-5">
        <p className="inline-flex items-center gap-1.5 text-xs font-medium uppercase tracking-wider text-primary">
          <Code2 className="h-3.5 w-3.5" />
          Playground · 浏览器内引擎
        </p>
        <h1 className="mt-1 font-display text-2xl font-semibold tracking-tight text-fg sm:text-3xl">
          SQL / Mongo 在线练习
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted">
          教学用内存引擎：同一商店数据集，左侧写查询，右侧看结果。语法覆盖课堂高频子集，非完整数据库服务器。
        </p>
      </header>

      <div className="mb-4 flex flex-wrap gap-2">
        {(
          [
            { id: "sql" as const, label: "SQL", icon: Database },
            { id: "mongo" as const, label: "MongoDB", icon: Code2 },
          ] as const
        ).map((m) => (
          <button
            key={m.id}
            type="button"
            onClick={() => setMode(m.id)}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-colors",
              mode === m.id
                ? "bg-primary text-primary-fg"
                : "bg-surface-3 text-muted hover:text-fg",
            )}
          >
            <m.icon className="h-3.5 w-3.5" />
            {m.label}
          </button>
        ))}
      </div>

      {mode === "sql" ? <SqlPlayground /> : <MongoPlayground />}
    </div>
  );
}

function SqlPlayground() {
  const [sql, setSql] = useState(SQL_SAMPLES[0]!.sql);
  const [tables, setTables] = useState<Record<string, SqlTable>>(() => createShopSchema());
  const [result, setResult] = useState<ReturnType<typeof runSql> | null>(null);

  const schemaHint = useMemo(
    () =>
      Object.values(tables)
        .map((t) => `${t.name}(${t.columns.join(", ")}) · ${t.rows.length} rows`)
        .join("\n"),
    [tables],
  );

  function run() {
    const parts = sql
      .split(";")
      .map((s) => s.trim())
      .filter(Boolean);
    let t = tables;
    let last: ReturnType<typeof runSql> | null = null;
    for (const p of parts) {
      const res = runSql(p, t);
      last = res;
      if (!res.ok) break;
      if (res.kind === "mutate") t = res.tables;
    }
    if (last?.ok && last.kind === "mutate") setTables(last.tables);
    setResult(last);
  }

  return (
    <div className="grid gap-4 lg:grid-cols-[1fr_280px]">
      <div className="space-y-3">
        <div className="flex flex-wrap gap-2">
          {SQL_SAMPLES.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => setSql(s.sql)}
              className="rounded-full bg-surface-3 px-3 py-1 text-xs text-muted hover:text-fg"
            >
              {s.title}
            </button>
          ))}
        </div>
        <textarea
          value={sql}
          onChange={(e) => setSql(e.target.value)}
          spellCheck={false}
          className="min-h-[220px] w-full resize-y rounded-xl border border-border bg-code-bg p-4 font-mono text-[13px] leading-relaxed text-code-fg outline-none focus:border-primary"
        />
        <div className="flex flex-wrap gap-2">
          <Button onClick={run} className="gap-1.5">
            <Play className="h-4 w-4" />
            运行 SQL
          </Button>
          <Button
            variant="secondary"
            onClick={() => {
              setTables(createShopSchema());
              setResult(null);
            }}
            className="gap-1.5"
          >
            <RotateCcw className="h-4 w-4" />
            重置数据
          </Button>
        </div>
        <ResultPanel sql={result} />
      </div>
      <aside className="rounded-xl border border-border bg-surface p-4">
        <p className="text-xs font-medium uppercase tracking-wider text-primary">Schema</p>
        <pre className="mt-2 whitespace-pre-wrap font-mono text-[11px] leading-relaxed text-muted">
          {schemaHint}
        </pre>
        <p className="mt-4 text-[11px] text-subtle">
          支持 SELECT / JOIN / WHERE / GROUP BY / ORDER BY / LIMIT / INSERT / UPDATE / DELETE /
          CREATE TABLE。
        </p>
      </aside>
    </div>
  );
}

function MongoPlayground() {
  const [cmd, setCmd] = useState(MONGO_SAMPLES[0]!.cmd);
  const [cols, setCols] = useState<Record<string, MongoCollection>>(() => createShopMongo());
  const [result, setResult] = useState<ReturnType<typeof runMongo> | null>(null);

  const names = Object.keys(cols).join(", ");

  function run() {
    const res = runMongo(cmd, cols);
    setResult(res);
    if (res.ok && res.kind === "mutate") setCols(res.collections);
  }

  return (
    <div className="grid gap-4 lg:grid-cols-[1fr_280px]">
      <div className="space-y-3">
        <div className="flex flex-wrap gap-2">
          {MONGO_SAMPLES.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => setCmd(s.cmd)}
              className="rounded-full bg-surface-3 px-3 py-1 text-xs text-muted hover:text-fg"
            >
              {s.title}
            </button>
          ))}
        </div>
        <textarea
          value={cmd}
          onChange={(e) => setCmd(e.target.value)}
          spellCheck={false}
          className="min-h-[220px] w-full resize-y rounded-xl border border-border bg-code-bg p-4 font-mono text-[13px] leading-relaxed text-code-fg outline-none focus:border-primary"
        />
        <div className="flex flex-wrap gap-2">
          <Button onClick={run} className="gap-1.5">
            <Play className="h-4 w-4" />
            运行命令
          </Button>
          <Button
            variant="secondary"
            onClick={() => {
              setCols(createShopMongo());
              setResult(null);
            }}
            className="gap-1.5"
          >
            <RotateCcw className="h-4 w-4" />
            重置数据
          </Button>
        </div>
        <MongoResultPanel result={result} />
      </div>
      <aside className="rounded-xl border border-border bg-surface p-4">
        <p className="text-xs font-medium uppercase tracking-wider text-primary">Collections</p>
        <p className="mt-2 font-mono text-[12px] text-muted">{names}</p>
        <p className="mt-4 text-[11px] leading-relaxed text-subtle">
          db.col.find / findOne / insertOne / updateOne / updateMany / deleteOne / deleteMany /
          aggregate / countDocuments · show collections
        </p>
      </aside>
    </div>
  );
}
