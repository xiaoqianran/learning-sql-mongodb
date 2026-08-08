import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  QUEST_DEFS,
  loadQuestDone,
  saveQuestDone,
  resetQuests,
  type QuestId,
  type QuestDef,
} from "@/lib/studio-quests";
import { createShopSchema, runSql, resultFingerprint } from "@/lib/sql-engine";
import { createShopMongo, runMongo, mongoFingerprint } from "@/lib/mongo-engine";
import { ResultPanel, MongoResultPanel } from "@/components/demos/InteractiveDemos";
import { Check, Flag, Play, RotateCcw, Server } from "lucide-react";

export const Route = createFileRoute("/studio")({
  component: StudioPage,
});

function StudioPage() {
  const [questDone, setQuestDone] = useState<QuestId[]>(() =>
    typeof window !== "undefined" ? loadQuestDone() : [],
  );
  const [activeId, setActiveId] = useState<QuestId>(QUEST_DEFS[0]!.id);
  const quest = QUEST_DEFS.find((q) => q.id === activeId) ?? QUEST_DEFS[0]!;
  const [code, setCode] = useState(quest.starter);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [ok, setOk] = useState<boolean | null>(null);
  const [sqlResult, setSqlResult] = useState<ReturnType<typeof runSql> | null>(null);
  const [mongoResult, setMongoResult] = useState<ReturnType<typeof runMongo> | null>(null);

  const progress = useMemo(() => {
    const done = questDone.length;
    const total = QUEST_DEFS.length;
    return { done, total, pct: Math.round((done / total) * 100) };
  }, [questDone]);

  const selectQuest = useCallback((q: QuestDef) => {
    setActiveId(q.id);
    setCode(q.starter);
    setFeedback(null);
    setOk(null);
    setSqlResult(null);
    setMongoResult(null);
  }, []);

  function markDone(id: QuestId) {
    setQuestDone((prev) => {
      if (prev.includes(id)) return prev;
      const next = [...prev, id];
      saveQuestDone(next);
      return next;
    });
  }

  function check() {
    setFeedback(null);
    setOk(null);
    if (quest.engine === "sql") {
      const tables = createShopSchema();
      const userParts = code
        .split(";")
        .map((s) => s.trim())
        .filter(Boolean);
      const userRes = runSql(userParts[0] ?? "", tables);
      setSqlResult(userRes);
      setMongoResult(null);
      if (!userRes.ok) {
        setOk(false);
        setFeedback(userRes.error);
        return;
      }
      const exp = runSql(quest.expectedSql ?? "", createShopSchema());
      if (!exp.ok) {
        setOk(false);
        setFeedback("内置期望查询失败");
        return;
      }
      const same = resultFingerprint(userRes) === resultFingerprint(exp);
      setOk(same);
      setFeedback(same ? "结果正确，任务完成！" : "结果与期望不一致，检查列名/过滤/联结。");
      if (same) markDone(quest.id);
    } else {
      const userRes = runMongo(code, createShopMongo());
      setMongoResult(userRes);
      setSqlResult(null);
      if (!userRes.ok) {
        setOk(false);
        setFeedback(userRes.error);
        return;
      }
      const exp = runMongo(quest.expectedMongo ?? "", createShopMongo());
      if (!exp.ok) {
        setOk(false);
        setFeedback("内置期望命令失败");
        return;
      }
      // order-insensitive compare for find/aggregate
      const same = normalizeMongo(userRes) === normalizeMongo(exp);
      setOk(same);
      setFeedback(same ? "结果正确，任务完成！" : "结果与期望不一致，检查过滤与聚合字段。");
      if (same) markDone(quest.id);
    }
  }

  return (
    <div className="mx-auto max-w-5xl pb-16">
      <header className="mb-6">
        <p className="inline-flex items-center gap-1.5 text-xs font-medium uppercase tracking-wider text-primary">
          <Server className="h-3.5 w-3.5" />
          查询工坊
        </p>
        <h1 className="mt-1 font-display text-2xl font-semibold text-fg sm:text-3xl">
          闯关：SQL + MongoDB
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-muted">
          共 {QUEST_DEFS.length} 关。运行你的查询，结果与标准答案的数据指纹一致即通关。进度保存在本地。
        </p>
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <div className="h-2 w-40 overflow-hidden rounded-full bg-surface-3">
            <div
              className="h-full rounded-full bg-primary transition-all"
              style={{ width: `${progress.pct}%` }}
            />
          </div>
          <span className="font-mono text-xs text-muted">
            {progress.done}/{progress.total} · {progress.pct}%
          </span>
          <Button
            size="sm"
            variant="secondary"
            className="gap-1.5"
            onClick={() => {
              resetQuests();
              setQuestDone([]);
              setFeedback(null);
              setOk(null);
            }}
          >
            <RotateCcw className="h-3.5 w-3.5" />
            重置进度
          </Button>
        </div>
      </header>

      <div className="grid gap-4 lg:grid-cols-[240px_1fr]">
        <nav className="space-y-1">
          {QUEST_DEFS.map((q, i) => {
            const done = questDone.includes(q.id);
            const active = q.id === activeId;
            return (
              <button
                key={q.id}
                type="button"
                onClick={() => selectQuest(q)}
                className={cn(
                  "flex w-full items-center gap-2 rounded-lg border px-3 py-2.5 text-left text-sm transition-colors",
                  active
                    ? "border-primary/40 bg-primary-soft text-fg"
                    : "border-border bg-surface text-muted hover:text-fg",
                )}
              >
                <span className="font-mono text-[11px] text-subtle">{i + 1}</span>
                <span className="min-w-0 flex-1 truncate">{q.title}</span>
                {done ? <Check className="h-3.5 w-3.5 shrink-0 text-primary" /> : null}
              </button>
            );
          })}
        </nav>

        <section className="rounded-xl border border-border bg-surface p-4 sm:p-5">
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <span
              className={cn(
                "rounded-full px-2 py-0.5 text-[11px] font-medium",
                quest.engine === "sql"
                  ? "bg-blue/15 text-blue"
                  : "bg-green/15 text-green",
              )}
            >
              {quest.engine.toUpperCase()}
            </span>
            <Flag className="h-3.5 w-3.5 text-primary" />
            <h2 className="font-display text-lg font-semibold text-fg">{quest.title}</h2>
          </div>
          <p className="text-sm text-fg">{quest.prompt}</p>
          <p className="mt-1 text-xs text-muted">提示：{quest.hint}</p>

          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            spellCheck={false}
            className="mt-4 min-h-[160px] w-full resize-y rounded-lg border border-border bg-code-bg p-3 font-mono text-[13px] leading-relaxed text-code-fg outline-none focus:border-primary"
          />

          <div className="mt-3 flex flex-wrap gap-2">
            <Button onClick={check} className="gap-1.5">
              <Play className="h-4 w-4" />
              运行并校验
            </Button>
            <Button variant="secondary" onClick={() => setCode(quest.starter)}>
              恢复示例
            </Button>
          </div>

          {feedback ? (
            <p
              className={cn(
                "mt-3 rounded-md border px-3 py-2 text-sm",
                ok
                  ? "border-primary/30 bg-primary-soft text-fg"
                  : "border-warn/40 bg-warn/10 text-fg",
              )}
            >
              {feedback}
            </p>
          ) : null}

          <div className="mt-4">
            {quest.engine === "sql" ? (
              <ResultPanel sql={sqlResult} />
            ) : (
              <MongoResultPanel result={mongoResult} />
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

function normalizeMongo(res: ReturnType<typeof runMongo>): string {
  if (!res.ok) return mongoFingerprint(res);
  if (res.kind === "mutate") return mongoFingerprint(res);
  const docs = [...(res.kind === "aggregate" ? res.docs : res.docs)].map((d) =>
    JSON.stringify(d),
  );
  docs.sort();
  return docs.join("|");
}
