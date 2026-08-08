/** Lightweight educational MongoDB-like document engine */

export type MongoValue =
  | string
  | number
  | boolean
  | null
  | MongoValue[]
  | { [k: string]: MongoValue };
export type MongoDoc = { _id: string | number } & Record<string, MongoValue>;
export type MongoCollection = { name: string; docs: MongoDoc[] };

export type MongoResult =
  | { ok: true; kind: "find"; docs: MongoDoc[]; message?: string }
  | { ok: true; kind: "mutate"; message: string; affected: number; collections: Record<string, MongoCollection> }
  | { ok: true; kind: "aggregate"; docs: Record<string, MongoValue>[]; message?: string }
  | { ok: false; error: string };

function cloneCols(c: Record<string, MongoCollection>): Record<string, MongoCollection> {
  const out: Record<string, MongoCollection> = {};
  for (const [k, v] of Object.entries(c)) {
    out[k] = { name: v.name, docs: v.docs.map((d) => structuredClone(d)) };
  }
  return out;
}

export function createShopMongo(): Record<string, MongoCollection> {
  return {
    users: {
      name: "users",
      docs: [
        { _id: 1, name: "Alice", email: "alice@mail.com", city: "Tokyo", age: 28, tags: ["vip", "dev"] },
        { _id: 2, name: "Bob", email: "bob@mail.com", city: "Osaka", age: 34, tags: ["dev"] },
        { _id: 3, name: "Carol", email: "carol@mail.com", city: "Tokyo", age: 22, tags: ["new"] },
        { _id: 4, name: "Dave", email: "dave@mail.com", city: "Kyoto", age: 41, tags: ["vip"] },
        { _id: 5, name: "Eve", email: "eve@mail.com", city: "Osaka", age: 29, tags: ["dev", "design"] },
      ],
    },
    products: {
      name: "products",
      docs: [
        { _id: 1, name: "Keyboard", category: "Hardware", price: 89, stock: 40 },
        { _id: 2, name: "Mouse", category: "Hardware", price: 29, stock: 120 },
        { _id: 3, name: "PostgreSQL Guide", category: "Books", price: 45, stock: 15 },
        { _id: 4, name: "MongoDB Path", category: "Books", price: 39, stock: 22 },
        { _id: 5, name: "USB-C Hub", category: "Hardware", price: 59, stock: 8 },
      ],
    },
    orders: {
      name: "orders",
      docs: [
        {
          _id: 1,
          user_id: 1,
          items: [{ product_id: 1, qty: 1, price: 89 }],
          status: "paid",
          total: 89,
        },
        {
          _id: 2,
          user_id: 1,
          items: [{ product_id: 3, qty: 2, price: 45 }],
          status: "paid",
          total: 90,
        },
        {
          _id: 3,
          user_id: 2,
          items: [{ product_id: 2, qty: 3, price: 29 }],
          status: "shipped",
          total: 87,
        },
        {
          _id: 4,
          user_id: 3,
          items: [{ product_id: 5, qty: 1, price: 59 }],
          status: "pending",
          total: 59,
        },
        {
          _id: 5,
          user_id: 2,
          items: [{ product_id: 4, qty: 1, price: 39 }],
          status: "paid",
          total: 39,
        },
      ],
    },
  };
}

function getPath(doc: Record<string, MongoValue>, path: string): MongoValue {
  const parts = path.split(".");
  let cur: MongoValue = doc as MongoValue;
  for (const p of parts) {
    if (cur === null || cur === undefined || typeof cur !== "object" || Array.isArray(cur)) {
      return undefined as unknown as MongoValue;
    }
    cur = (cur as Record<string, MongoValue>)[p] as MongoValue;
  }
  return cur;
}

function matchQuery(doc: MongoDoc, query: Record<string, MongoValue>): boolean {
  for (const [key, cond] of Object.entries(query)) {
    if (key === "$or" && Array.isArray(cond)) {
      if (!cond.some((q) => matchQuery(doc, q as Record<string, MongoValue>))) return false;
      continue;
    }
    if (key === "$and" && Array.isArray(cond)) {
      if (!cond.every((q) => matchQuery(doc, q as Record<string, MongoValue>))) return false;
      continue;
    }
    const val = getPath(doc, key);
    if (cond !== null && typeof cond === "object" && !Array.isArray(cond)) {
      const ops = cond as Record<string, MongoValue>;
      for (const [op, expected] of Object.entries(ops)) {
        switch (op) {
          case "$eq":
            if (val !== expected) return false;
            break;
          case "$ne":
            if (val === expected) return false;
            break;
          case "$gt":
            if (!((val as number) > (expected as number))) return false;
            break;
          case "$gte":
            if (!((val as number) >= (expected as number))) return false;
            break;
          case "$lt":
            if (!((val as number) < (expected as number))) return false;
            break;
          case "$lte":
            if (!((val as number) <= (expected as number))) return false;
            break;
          case "$in":
            if (!Array.isArray(expected) || !expected.includes(val as never)) return false;
            break;
          case "$nin":
            if (!Array.isArray(expected) || expected.includes(val as never)) return false;
            break;
          case "$exists":
            if (Boolean(expected) !== (val !== undefined)) return false;
            break;
          case "$regex": {
            const re = new RegExp(String(expected), String(ops.$options ?? ""));
            if (!re.test(String(val ?? ""))) return false;
            break;
          }
          default:
            return false;
        }
      }
    } else {
      if (val !== cond) return false;
    }
  }
  return true;
}

function applyUpdate(doc: MongoDoc, update: Record<string, MongoValue>): void {
  if ("$set" in update && update.$set && typeof update.$set === "object") {
    for (const [k, v] of Object.entries(update.$set as Record<string, MongoValue>)) {
      setPath(doc, k, v);
    }
  }
  if ("$unset" in update && update.$unset && typeof update.$unset === "object") {
    for (const k of Object.keys(update.$unset as object)) {
      delete (doc as Record<string, MongoValue>)[k];
    }
  }
  if ("$inc" in update && update.$inc && typeof update.$inc === "object") {
    for (const [k, v] of Object.entries(update.$inc as Record<string, MongoValue>)) {
      const cur = Number(getPath(doc, k) ?? 0);
      setPath(doc, k, cur + Number(v));
    }
  }
  if ("$push" in update && update.$push && typeof update.$push === "object") {
    for (const [k, v] of Object.entries(update.$push as Record<string, MongoValue>)) {
      const cur = getPath(doc, k);
      if (Array.isArray(cur)) cur.push(v);
      else setPath(doc, k, [v]);
    }
  }
  // replacement style
  const keys = Object.keys(update).filter((k) => !k.startsWith("$"));
  if (keys.length && !Object.keys(update).some((k) => k.startsWith("$"))) {
    const id = doc._id;
    for (const k of Object.keys(doc)) {
      if (k !== "_id") delete (doc as Record<string, MongoValue>)[k];
    }
    for (const [k, v] of Object.entries(update)) {
      if (k !== "_id") (doc as Record<string, MongoValue>)[k] = v;
    }
    doc._id = id;
  }
}

function setPath(doc: Record<string, MongoValue>, path: string, value: MongoValue) {
  const parts = path.split(".");
  let cur: Record<string, MongoValue> = doc;
  for (let i = 0; i < parts.length - 1; i++) {
    const p = parts[i]!;
    if (typeof cur[p] !== "object" || cur[p] === null || Array.isArray(cur[p])) {
      cur[p] = {};
    }
    cur = cur[p] as Record<string, MongoValue>;
  }
  cur[parts[parts.length - 1]!] = value;
}

function parseJsonish(input: string): unknown {
  const s = input.trim();
  if (!s) return {};
  // allow single quotes loosely
  const normalized = s
    .replace(/([,{[]\s*)'([^']*)'/g, '$1"$2"')
    .replace(/([{,]\s*)(\$[a-zA-Z]+|[a-zA-Z_][\w]*)\s*:/g, '$1"$2":');
  return JSON.parse(normalized);
}

/**
 * Shell-like commands:
 * db.users.find({city:"Tokyo"})
 * db.users.findOne({_id:1})
 * db.users.insertOne({...})
 * db.users.insertMany([...])
 * db.users.updateOne(q, u)
 * db.users.updateMany(q, u)
 * db.users.deleteOne(q)
 * db.users.deleteMany(q)
 * db.users.aggregate([...])
 * show collections
 */
export function runMongo(
  input: string,
  colsIn: Record<string, MongoCollection>,
): MongoResult {
  const collections = cloneCols(colsIn);
  const raw = input.trim().replace(/;\s*$/, "");
  if (!raw) return { ok: false, error: "空命令" };

  try {
    if (/^show\s+collections$/i.test(raw)) {
      return {
        ok: true,
        kind: "find",
        docs: Object.keys(collections).map((name, i) => ({ _id: i + 1, name })),
        message: `${Object.keys(collections).length} collections`,
      };
    }

    const m = raw.match(
      /^db\.(\w+)\.(find|findOne|insertOne|insertMany|updateOne|updateMany|deleteOne|deleteMany|aggregate|countDocuments)\s*\(([\s\S]*)\)\s*$/i,
    );
    if (!m) {
      return {
        ok: false,
        error:
          '语法: db.<collection>.find({...}) / insertOne / updateOne / deleteMany / aggregate([...])',
      };
    }
    const colName = m[1]!;
    const method = m[2]!.toLowerCase();
    const argsRaw = m[3]!.trim();

    if (!(colName in collections) && !method.startsWith("insert")) {
      // auto-create on insert only
      if (!["insertone", "insertmany"].includes(method)) {
        return { ok: false, error: `集合不存在: ${colName}` };
      }
      collections[colName] = { name: colName, docs: [] };
    }
    if (!(colName in collections)) {
      collections[colName] = { name: colName, docs: [] };
    }
    const col = collections[colName]!;

    const args = splitArgs(argsRaw);

    switch (method) {
      case "find": {
        const q = (args[0] ? parseJsonish(args[0]) : {}) as Record<string, MongoValue>;
        const proj = args[1] ? (parseJsonish(args[1]) as Record<string, number>) : null;
        let docs = col.docs.filter((d) => matchQuery(d, q)).map((d) => structuredClone(d));
        if (proj) docs = docs.map((d) => project(d, proj));
        return { ok: true, kind: "find", docs, message: `${docs.length} 文档` };
      }
      case "findone": {
        const q = (args[0] ? parseJsonish(args[0]) : {}) as Record<string, MongoValue>;
        const doc = col.docs.find((d) => matchQuery(d, q));
        return {
          ok: true,
          kind: "find",
          docs: doc ? [structuredClone(doc)] : [],
          message: doc ? "1 文档" : "null",
        };
      }
      case "countdocuments": {
        const q = (args[0] ? parseJsonish(args[0]) : {}) as Record<string, MongoValue>;
        const n = col.docs.filter((d) => matchQuery(d, q)).length;
        return { ok: true, kind: "find", docs: [{ _id: 0, count: n }], message: String(n) };
      }
      case "insertone": {
        const doc = parseJsonish(args[0] || "{}") as MongoDoc;
        if (doc._id === undefined || doc._id === null) {
          doc._id = Date.now();
        }
        col.docs.push(doc);
        return {
          ok: true,
          kind: "mutate",
          message: `inserted _id=${doc._id}`,
          affected: 1,
          collections,
        };
      }
      case "insertmany": {
        const arr = parseJsonish(args[0] || "[]") as MongoDoc[];
        if (!Array.isArray(arr)) return { ok: false, error: "insertMany 需要数组" };
        for (const doc of arr) {
          if (doc._id === undefined) doc._id = Date.now() + Math.random();
          col.docs.push(doc);
        }
        return {
          ok: true,
          kind: "mutate",
          message: `inserted ${arr.length}`,
          affected: arr.length,
          collections,
        };
      }
      case "updateone":
      case "updatemany": {
        const q = (parseJsonish(args[0] || "{}") as Record<string, MongoValue>) ?? {};
        const u = (parseJsonish(args[1] || "{}") as Record<string, MongoValue>) ?? {};
        let affected = 0;
        for (const d of col.docs) {
          if (!matchQuery(d, q)) continue;
          applyUpdate(d, u);
          affected++;
          if (method === "updateone") break;
        }
        return {
          ok: true,
          kind: "mutate",
          message: `modified ${affected}`,
          affected,
          collections,
        };
      }
      case "deleteone":
      case "deletemany": {
        const q = (parseJsonish(args[0] || "{}") as Record<string, MongoValue>) ?? {};
        let affected = 0;
        if (method === "deleteone") {
          const idx = col.docs.findIndex((d) => matchQuery(d, q));
          if (idx >= 0) {
            col.docs.splice(idx, 1);
            affected = 1;
          }
        } else {
          const before = col.docs.length;
          col.docs = col.docs.filter((d) => !matchQuery(d, q));
          affected = before - col.docs.length;
        }
        return {
          ok: true,
          kind: "mutate",
          message: `deleted ${affected}`,
          affected,
          collections,
        };
      }
      case "aggregate": {
        const pipeline = parseJsonish(args[0] || "[]") as Record<string, MongoValue>[];
        if (!Array.isArray(pipeline)) return { ok: false, error: "aggregate 需要管道数组" };
        let docs: Record<string, MongoValue>[] = col.docs.map((d) => structuredClone(d));
        for (const stage of pipeline) {
          docs = runStage(docs, stage);
        }
        return {
          ok: true,
          kind: "aggregate",
          docs,
          message: `${docs.length} 文档`,
        };
      }
      default:
        return { ok: false, error: `未支持方法: ${method}` };
    }
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : String(e) };
  }
}

function project(doc: MongoDoc, proj: Record<string, number>): MongoDoc {
  const includeId = proj._id !== 0;
  const keys = Object.keys(proj).filter((k) => k !== "_id" && proj[k]);
  if (keys.length === 0) {
    const out = { ...doc };
    if (!includeId) delete (out as { _id?: unknown })._id;
    return out;
  }
  const out: MongoDoc = { _id: doc._id };
  if (!includeId) delete (out as { _id?: unknown })._id;
  for (const k of keys) {
    (out as Record<string, MongoValue>)[k] = getPath(doc, k);
  }
  return out;
}

function splitArgs(s: string): string[] {
  if (!s.trim()) return [];
  const parts: string[] = [];
  let buf = "";
  let depth = 0;
  let inStr: string | null = null;
  for (let i = 0; i < s.length; i++) {
    const ch = s[i]!;
    if (inStr) {
      buf += ch;
      if (ch === inStr && s[i - 1] !== "\\") inStr = null;
      continue;
    }
    if (ch === '"' || ch === "'") {
      inStr = ch;
      buf += ch;
      continue;
    }
    if (ch === "{" || ch === "[" || ch === "(") depth++;
    if (ch === "}" || ch === "]" || ch === ")") depth--;
    if (ch === "," && depth === 0) {
      parts.push(buf.trim());
      buf = "";
      continue;
    }
    buf += ch;
  }
  if (buf.trim()) parts.push(buf.trim());
  return parts;
}

function runStage(
  docs: Record<string, MongoValue>[],
  stage: Record<string, MongoValue>,
): Record<string, MongoValue>[] {
  if ("$match" in stage) {
    const q = stage.$match as Record<string, MongoValue>;
    return docs.filter((d) => matchQuery(d as MongoDoc, q));
  }
  if ("$project" in stage) {
    const proj = stage.$project as Record<string, number>;
    return docs.map((d) => project(d as MongoDoc, proj));
  }
  if ("$limit" in stage) {
    return docs.slice(0, Number(stage.$limit));
  }
  if ("$skip" in stage) {
    return docs.slice(Number(stage.$skip));
  }
  if ("$sort" in stage) {
    const sort = stage.$sort as Record<string, number>;
    const keys = Object.entries(sort);
    return [...docs].sort((a, b) => {
      for (const [k, dir] of keys) {
        const av = getPath(a, k) as number | string;
        const bv = getPath(b, k) as number | string;
        if (av === bv) continue;
        if (av == null) return 1;
        if (bv == null) return -1;
        if (av < bv) return dir >= 0 ? -1 : 1;
        if (av > bv) return dir >= 0 ? 1 : -1;
      }
      return 0;
    });
  }
  if ("$group" in stage) {
    const g = stage.$group as Record<string, MongoValue>;
    const idExpr = g._id;
    const groups = new Map<string, Record<string, MongoValue>[]>();
    for (const d of docs) {
      let key: string;
      if (idExpr === null) key = "null";
      else if (typeof idExpr === "string" && idExpr.startsWith("$")) {
        key = JSON.stringify(getPath(d, idExpr.slice(1)));
      } else key = JSON.stringify(idExpr);
      if (!groups.has(key)) groups.set(key, []);
      groups.get(key)!.push(d);
    }
    const out: Record<string, MongoValue>[] = [];
    for (const [key, items] of groups) {
      const row: Record<string, MongoValue> = {
        _id: key === "null" ? null : JSON.parse(key),
      };
      for (const [field, expr] of Object.entries(g)) {
        if (field === "_id") continue;
        if (expr && typeof expr === "object" && !Array.isArray(expr)) {
          const op = Object.keys(expr)[0]!;
          const arg = (expr as Record<string, MongoValue>)[op];
          const fieldName =
            typeof arg === "string" && arg.startsWith("$") ? arg.slice(1) : "";
          const vals = items.map((it) =>
            fieldName ? getPath(it, fieldName) : arg,
          );
          if (op === "$sum") {
            if (arg === 1) row[field] = items.length;
            else
              row[field] = vals.reduce<number>(
                (a, b) => a + (Number(b) || 0),
                0,
              );
          } else if (op === "$avg") {
            const nums = vals.map(Number).filter((n) => !Number.isNaN(n));
            row[field] = nums.length
              ? nums.reduce((a, b) => a + b, 0) / nums.length
              : null;
          } else if (op === "$min") {
            row[field] = Math.min(...vals.map(Number));
          } else if (op === "$max") {
            row[field] = Math.max(...vals.map(Number));
          } else if (op === "$push") {
            row[field] = vals;
          } else if (op === "$first") {
            row[field] = vals[0] ?? null;
          }
        }
      }
      out.push(row);
    }
    return out;
  }
  if ("$count" in stage) {
    return [{ [String(stage.$count)]: docs.length }];
  }
  return docs;
}

export function mongoFingerprint(res: MongoResult): string {
  if (!res.ok) return `err:${res.error}`;
  if (res.kind === "mutate") return `mut:${res.affected}`;
  if (res.kind === "aggregate") return JSON.stringify(res.docs);
  return JSON.stringify(res.docs);
}
