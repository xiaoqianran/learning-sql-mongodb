import { useMemo, useState } from "react";
import type { DemoKind } from "@/data/lessons";
import { createShopSchema, runSql, type SqlResult, type SqlTable } from "@/lib/sql-engine";
import { createShopMongo, runMongo, type MongoResult, type MongoCollection } from "@/lib/mongo-engine";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Play, RotateCcw } from "lucide-react";

const SQL_PRESETS: Partial<Record<DemoKind, { sql: string; blurb: string }>> = {
  "sql-select-all": {
    sql: "SELECT * FROM users LIMIT 3;",
    blurb: "从表中取出前几行。",
  },
  "sql-select-cols": {
    sql: "SELECT name, city FROM users;",
    blurb: "只投影需要的列。",
  },
  "sql-where": {
    sql: "SELECT name, age, city FROM users WHERE city = 'Tokyo';",
    blurb: "WHERE 过滤行。",
  },
  "sql-order": {
    sql: "SELECT name, price FROM products ORDER BY price DESC LIMIT 3;",
    blurb: "排序 + LIMIT。",
  },
  "sql-group": {
    sql: "SELECT city, COUNT(*) AS cnt FROM users GROUP BY city ORDER BY cnt DESC;",
    blurb: "GROUP BY 聚合。",
  },
  "sql-join": {
    sql: "SELECT o.id, u.name, o.total, o.status\nFROM orders o\nJOIN users u ON o.user_id = u.id;",
    blurb: "INNER JOIN 关联用户。",
  },
  "sql-left-join": {
    sql: "SELECT u.name, o.id AS order_id, o.total\nFROM users u\nLEFT JOIN orders o ON o.user_id = u.id;",
    blurb: "LEFT JOIN 保留无订单用户。",
  },
  "sql-subquery": {
    sql: "SELECT name FROM users\nWHERE id IN (\n  SELECT user_id FROM orders WHERE status = 'paid'\n);",
    blurb: "IN + 子查询。",
  },
  "sql-dml": {
    sql: "UPDATE products SET stock = 100 WHERE id = 2;\nSELECT id, name, stock FROM products WHERE id = 2;",
    blurb: "先更新再查询验证（引擎逐条执行第一条语句）。",
  },
  "sql-create": {
    sql: "CREATE TABLE reviews (id INT, product_id INT, rating INT, body TEXT);\nSELECT * FROM reviews;",
    blurb: "建表后查询空表。",
  },
  "sql-shop": {
    sql: "SELECT u.city, SUM(o.total) AS revenue\nFROM orders o\nJOIN users u ON o.user_id = u.id\nWHERE o.status = 'paid'\nGROUP BY u.city\nORDER BY revenue DESC;",
    blurb: "业务分析：城市已支付收入。",
  },
};

const MONGO_PRESETS: Partial<Record<DemoKind, { cmd: string; blurb: string }>> = {
  "mongo-find": {
    cmd: 'db.users.find({ city: "Tokyo" })',
    blurb: "等值查询。",
  },
  "mongo-crud": {
    cmd: 'db.users.updateOne({ name: "Alice" }, { $set: { age: 29 } })',
    blurb: "$set 更新字段。",
  },
  "mongo-ops": {
    cmd: "db.products.find({ price: { $gte: 40 } })",
    blurb: "比较操作符。",
  },
  "mongo-embed": {
    cmd: "db.orders.findOne({ _id: 1 })",
    blurb: "内嵌 items 的订单文档。",
  },
  "mongo-agg": {
    cmd: 'db.orders.aggregate([\n  { $group: { _id: "$status", revenue: { $sum: "$total" }, n: { $sum: 1 } } },\n  { $sort: { revenue: -1 } }\n])',
    blurb: "聚合管道。",
  },
  "mongo-update-ops": {
    cmd: "db.products.updateOne({ _id: 1 }, { $inc: { stock: -1 } })",
    blurb: "$inc 改库存。",
  },
};

export function InteractiveDemo({
  kind,
  title,
  hint,
}: {
  kind: DemoKind;
  title: string;
  hint?: string;
}) {
  if (kind === "compare-model") return <CompareDemo title={title} hint={hint} />;
  if (kind.startsWith("mongo")) {
    return <MongoDemo kind={kind} title={title} hint={hint} />;
  }
  return <SqlDemo kind={kind} title={title} hint={hint} />;
}

function SqlDemo({ kind, title, hint }: { kind: DemoKind; title: string; hint?: string }) {
  const preset = SQL_PRESETS[kind] ?? SQL_PRESETS["sql-select-all"]!;
  const [sql, setSql] = useState(preset.sql);
  const [tables, setTables] = useState<Record<string, SqlTable>>(() => createShopSchema());
  const [result, setResult] = useState<SqlResult | null>(null);

  function run() {
    // run first statement only; if multiple, run first then optional second for dml demo
    const parts = sql
      .split(";")
      .map((s) => s.trim())
      .filter(Boolean);
    let t = tables;
    let last: SqlResult | null = null;
    for (const p of parts) {
      const res = runSql(p, t);
      last = res;
      if (!res.ok) break;
      if (res.kind === "mutate") t = res.tables;
    }
    if (last?.ok && last.kind === "mutate") setTables(last.tables);
    // if last is mutate and we want to show table, re-select
    if (last?.ok && last.kind === "mutate" && parts.length === 1) {
      setResult(last);
    } else {
      setResult(last);
    }
  }

  function reset() {
    setTables(createShopSchema());
    setSql(preset.sql);
    setResult(null);
  }

  return (
    <DemoShell title={title} hint={hint ?? preset.blurb} onRun={run} onReset={reset} engine="SQL">
      <textarea
        value={sql}
        onChange={(e) => setSql(e.target.value)}
        spellCheck={false}
        className="min-h-[120px] w-full resize-y rounded-md border border-border bg-code-bg p-3 font-mono text-[13px] leading-relaxed text-code-fg outline-none focus:border-primary"
      />
      <ResultPanel sql={result} />
    </DemoShell>
  );
}

function MongoDemo({ kind, title, hint }: { kind: DemoKind; title: string; hint?: string }) {
  const preset = MONGO_PRESETS[kind] ?? MONGO_PRESETS["mongo-find"]!;
  const [cmd, setCmd] = useState(preset.cmd);
  const [cols, setCols] = useState<Record<string, MongoCollection>>(() => createShopMongo());
  const [result, setResult] = useState<MongoResult | null>(null);

  function run() {
    const res = runMongo(cmd, cols);
    setResult(res);
    if (res.ok && res.kind === "mutate") setCols(res.collections);
  }

  function reset() {
    setCols(createShopMongo());
    setCmd(preset.cmd);
    setResult(null);
  }

  return (
    <DemoShell title={title} hint={hint ?? preset.blurb} onRun={run} onReset={reset} engine="MongoDB">
      <textarea
        value={cmd}
        onChange={(e) => setCmd(e.target.value)}
        spellCheck={false}
        className="min-h-[120px] w-full resize-y rounded-md border border-border bg-code-bg p-3 font-mono text-[13px] leading-relaxed text-code-fg outline-none focus:border-primary"
      />
      <MongoResultPanel result={result} />
    </DemoShell>
  );
}

function CompareDemo({ title, hint }: { title: string; hint?: string }) {
  const sqlRes = useMemo(() => runSql("SELECT * FROM orders LIMIT 2", createShopSchema()), []);
  const mongoRes = useMemo(() => runMongo("db.orders.find({})", createShopMongo()), []);
  return (
    <section className="rounded-xl border border-border bg-surface p-4 shadow-soft sm:p-5">
      <header className="mb-3">
        <p className="text-xs font-medium uppercase tracking-wider text-primary">对照 Demo</p>
        <h3 className="font-display text-lg font-semibold text-fg">{title}</h3>
        {hint ? <p className="mt-1 text-xs text-muted">{hint}</p> : null}
      </header>
      <div className="grid gap-3 lg:grid-cols-2">
        <div>
          <p className="mb-2 text-xs font-medium text-muted">SQL · orders 行式</p>
          <ResultPanel sql={sqlRes} />
        </div>
        <div>
          <p className="mb-2 text-xs font-medium text-muted">Mongo · orders 文档（含 items）</p>
          <MongoResultPanel result={mongoRes} />
        </div>
      </div>
    </section>
  );
}

function DemoShell({
  title,
  hint,
  engine,
  onRun,
  onReset,
  children,
}: {
  title: string;
  hint?: string;
  engine: string;
  onRun: () => void;
  onReset: () => void;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-xl border border-border bg-surface p-4 shadow-soft sm:p-5">
      <header className="mb-3 flex flex-wrap items-start justify-between gap-2">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-primary">
            可运行 · {engine}
          </p>
          <h3 className="font-display text-lg font-semibold text-fg">{title}</h3>
          {hint ? <p className="mt-1 text-xs text-muted">{hint}</p> : null}
        </div>
        <div className="flex gap-2">
          <Button type="button" size="sm" onClick={onRun} className="gap-1.5">
            <Play className="h-3.5 w-3.5" />
            运行
          </Button>
          <Button type="button" size="sm" variant="secondary" onClick={onReset} className="gap-1.5">
            <RotateCcw className="h-3.5 w-3.5" />
            重置
          </Button>
        </div>
      </header>
      <div className="space-y-3">{children}</div>
    </section>
  );
}

export function ResultPanel({ sql }: { sql: SqlResult | null }) {
  if (!sql) {
    return (
      <p className="rounded-md border border-dashed border-border bg-surface-2 px-3 py-4 text-center text-xs text-subtle">
        点击运行查看结果
      </p>
    );
  }
  if (!sql.ok) {
    return (
      <p className="rounded-md border border-danger/30 bg-danger/10 px-3 py-2 font-mono text-xs text-danger">
        {sql.error}
      </p>
    );
  }
  if (sql.kind === "mutate") {
    return (
      <p className="rounded-md border border-primary/30 bg-primary-soft px-3 py-2 text-sm text-fg">
        {sql.message}
      </p>
    );
  }
  return (
    <div className="overflow-hidden rounded-md border border-border">
      <div className="border-b border-border bg-surface-2 px-3 py-1.5 text-[11px] text-muted">
        {sql.message ?? `${sql.rows.length} 行`}
      </div>
      <div className="scrollbar-thin max-h-64 overflow-auto">
        <table className="w-full min-w-full text-left text-xs">
          <thead className="sticky top-0 bg-surface-3">
            <tr>
              {sql.columns.map((c) => (
                <th key={c} className="px-3 py-2 font-mono font-medium text-primary">
                  {c}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sql.rows.map((r, i) => (
              <tr key={i} className={cn(i % 2 ? "bg-surface-2/50" : "bg-surface")}>
                {sql.columns.map((c) => (
                  <td key={c} className="px-3 py-1.5 font-mono text-fg">
                    {formatCell(r[c])}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function MongoResultPanel({ result }: { result: MongoResult | null }) {
  if (!result) {
    return (
      <p className="rounded-md border border-dashed border-border bg-surface-2 px-3 py-4 text-center text-xs text-subtle">
        点击运行查看结果
      </p>
    );
  }
  if (!result.ok) {
    return (
      <p className="rounded-md border border-danger/30 bg-danger/10 px-3 py-2 font-mono text-xs text-danger">
        {result.error}
      </p>
    );
  }
  if (result.kind === "mutate") {
    return (
      <p className="rounded-md border border-primary/30 bg-primary-soft px-3 py-2 text-sm text-fg">
        {result.message}
      </p>
    );
  }
  const docs = result.kind === "aggregate" ? result.docs : result.docs;
  return (
    <div className="overflow-hidden rounded-md border border-border">
      <div className="border-b border-border bg-surface-2 px-3 py-1.5 text-[11px] text-muted">
        {result.message}
      </div>
      <pre className="scrollbar-thin max-h-64 overflow-auto bg-code-bg p-3 font-mono text-[12px] leading-relaxed text-code-fg">
        {JSON.stringify(docs, null, 2)}
      </pre>
    </div>
  );
}

function formatCell(v: unknown) {
  if (v === null || v === undefined) return <span className="text-subtle">NULL</span>;
  if (typeof v === "boolean") return v ? "true" : "false";
  return String(v);
}
