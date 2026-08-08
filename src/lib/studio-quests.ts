export type QuestId =
  | "sql_tokyo"
  | "sql_join_paid"
  | "sql_group_city"
  | "mongo_osaka"
  | "mongo_price"
  | "mongo_agg_status";

export type QuestDef = {
  id: QuestId;
  title: string;
  engine: "sql" | "mongo";
  prompt: string;
  hint: string;
  starter: string;
  /** fingerprint via expected query */
  expectedSql?: string;
  expectedMongo?: string;
};

export const QUEST_DEFS: QuestDef[] = [
  {
    id: "sql_tokyo",
    title: "SQL · 东京用户",
    engine: "sql",
    prompt: "查出所有 city = 'Tokyo' 的用户的 name 与 age。",
    hint: "SELECT name, age FROM users WHERE ...",
    starter: "SELECT name, age FROM users WHERE city = 'Tokyo';",
    expectedSql: "SELECT name, age FROM users WHERE city = 'Tokyo'",
  },
  {
    id: "sql_join_paid",
    title: "SQL · 已支付订单",
    engine: "sql",
    prompt: "列出已支付订单：订单 id、用户 name、total（JOIN users）。",
    hint: "JOIN + WHERE status = 'paid'",
    starter:
      "SELECT o.id, u.name, o.total\nFROM orders o\nJOIN users u ON o.user_id = u.id\nWHERE o.status = 'paid'",
    expectedSql:
      "SELECT o.id, u.name, o.total FROM orders o JOIN users u ON o.user_id = u.id WHERE o.status = 'paid'",
  },
  {
    id: "sql_group_city",
    title: "SQL · 城市人数",
    engine: "sql",
    prompt: "按 city 统计用户数，列名 city, cnt，按 cnt 降序。",
    hint: "GROUP BY city + COUNT(*)",
    starter:
      "SELECT city, COUNT(*) AS cnt FROM users GROUP BY city ORDER BY cnt DESC",
    expectedSql:
      "SELECT city, COUNT(*) AS cnt FROM users GROUP BY city ORDER BY cnt DESC",
  },
  {
    id: "mongo_osaka",
    title: "Mongo · 大阪用户",
    engine: "mongo",
    prompt: '找出 city 为 "Osaka" 的用户文档。',
    hint: 'db.users.find({ city: "Osaka" })',
    starter: 'db.users.find({ city: "Osaka" })',
    expectedMongo: 'db.users.find({ city: "Osaka" })',
  },
  {
    id: "mongo_price",
    title: "Mongo · 贵价商品",
    engine: "mongo",
    prompt: "找出 price >= 50 的商品。",
    hint: "{ price: { $gte: 50 } }",
    starter: "db.products.find({ price: { $gte: 50 } })",
    expectedMongo: "db.products.find({ price: { $gte: 50 } })",
  },
  {
    id: "mongo_agg_status",
    title: "Mongo · 状态汇总",
    engine: "mongo",
    prompt: "按 status 分组，统计订单数 n 与 total 之和 revenue。",
    hint: "$group + $sum",
    starter:
      'db.orders.aggregate([\n  { $group: { _id: "$status", n: { $sum: 1 }, revenue: { $sum: "$total" } } }\n])',
    expectedMongo:
      'db.orders.aggregate([{ $group: { _id: "$status", n: { $sum: 1 }, revenue: { $sum: "$total" } } }])',
  },
];

const KEY = "sql-mongo-learn-quests-v1";

export function loadQuestDone(): QuestId[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    const arr = JSON.parse(raw) as QuestId[];
    return Array.isArray(arr) ? arr : [];
  } catch {
    return [];
  }
}

export function saveQuestDone(ids: QuestId[]) {
  try {
    localStorage.setItem(KEY, JSON.stringify(ids));
  } catch {
    /* ignore */
  }
}

export function resetQuests() {
  try {
    localStorage.removeItem(KEY);
  } catch {
    /* ignore */
  }
}
