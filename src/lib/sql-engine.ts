/** Lightweight educational SQL engine (SELECT / INSERT / UPDATE / DELETE / CREATE) */

export type SqlValue = string | number | boolean | null;
export type SqlRow = Record<string, SqlValue>;
export type SqlTable = { name: string; columns: string[]; rows: SqlRow[] };

export type SqlResult =
  | { ok: true; kind: "select"; columns: string[]; rows: SqlRow[]; message?: string }
  | { ok: true; kind: "mutate"; message: string; affected: number; tables: Record<string, SqlTable> }
  | { ok: false; error: string };

function cloneTables(tables: Record<string, SqlTable>): Record<string, SqlTable> {
  const out: Record<string, SqlTable> = {};
  for (const [k, t] of Object.entries(tables)) {
    out[k] = {
      name: t.name,
      columns: [...t.columns],
      rows: t.rows.map((r) => ({ ...r })),
    };
  }
  return out;
}

export function createShopSchema(): Record<string, SqlTable> {
  return {
    users: {
      name: "users",
      columns: ["id", "name", "email", "city", "age"],
      rows: [
        { id: 1, name: "Alice", email: "alice@mail.com", city: "Tokyo", age: 28 },
        { id: 2, name: "Bob", email: "bob@mail.com", city: "Osaka", age: 34 },
        { id: 3, name: "Carol", email: "carol@mail.com", city: "Tokyo", age: 22 },
        { id: 4, name: "Dave", email: "dave@mail.com", city: "Kyoto", age: 41 },
        { id: 5, name: "Eve", email: "eve@mail.com", city: "Osaka", age: 29 },
      ],
    },
    products: {
      name: "products",
      columns: ["id", "name", "category", "price", "stock"],
      rows: [
        { id: 1, name: "Keyboard", category: "Hardware", price: 89, stock: 40 },
        { id: 2, name: "Mouse", category: "Hardware", price: 29, stock: 120 },
        { id: 3, name: "PostgreSQL Guide", category: "Books", price: 45, stock: 15 },
        { id: 4, name: "MongoDB Path", category: "Books", price: 39, stock: 22 },
        { id: 5, name: "USB-C Hub", category: "Hardware", price: 59, stock: 8 },
      ],
    },
    orders: {
      name: "orders",
      columns: ["id", "user_id", "product_id", "qty", "status", "total"],
      rows: [
        { id: 1, user_id: 1, product_id: 1, qty: 1, status: "paid", total: 89 },
        { id: 2, user_id: 1, product_id: 3, qty: 2, status: "paid", total: 90 },
        { id: 3, user_id: 2, product_id: 2, qty: 3, status: "shipped", total: 87 },
        { id: 4, user_id: 3, product_id: 5, qty: 1, status: "pending", total: 59 },
        { id: 5, user_id: 2, product_id: 4, qty: 1, status: "paid", total: 39 },
        { id: 6, user_id: 5, product_id: 1, qty: 2, status: "cancelled", total: 178 },
        { id: 7, user_id: 4, product_id: 3, qty: 1, status: "paid", total: 45 },
      ],
    },
  };
}

function stripComments(sql: string): string {
  return sql
    .replace(/--[^\n]*/g, "")
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .trim();
}

function unquoteIdent(s: string): string {
  const t = s.trim();
  if ((t.startsWith('"') && t.endsWith('"')) || (t.startsWith("`") && t.endsWith("`"))) {
    return t.slice(1, -1);
  }
  return t;
}

function parseValue(raw: string): SqlValue {
  const s = raw.trim();
  if (/^null$/i.test(s)) return null;
  if (/^true$/i.test(s)) return true;
  if (/^false$/i.test(s)) return false;
  if (/^-?\d+(\.\d+)?$/.test(s)) return Number(s);
  if (
    (s.startsWith("'") && s.endsWith("'")) ||
    (s.startsWith('"') && s.endsWith('"'))
  ) {
    return s.slice(1, -1).replace(/''/g, "'");
  }
  return s;
}

function evalExpr(row: SqlRow, expr: string, tables?: Record<string, SqlTable>): SqlValue {
  const e = expr.trim();
  // aliases like u.name
  if (e.includes(".")) {
    const [alias, col] = e.split(".");
    const key = col ?? alias;
    if (key && key in row) return row[key] ?? null;
    // try alias_col
    const full = e.replace(".", "_");
    if (full in row) return row[full] ?? null;
  }
  if (e in row) return row[e] ?? null;
  // string/number literal
  if (/^'.*'$/.test(e) || /^-?\d+(\.\d+)?$/.test(e) || /^null$/i.test(e)) {
    return parseValue(e);
  }
  // COUNT(*) etc handled elsewhere
  void tables;
  return row[e] ?? null;
}

function cmp(a: SqlValue, op: string, b: SqlValue): boolean {
  if (op === "IS" || op === "IS NOT") {
    const isNull = a === null;
    if (op === "IS") return isNull === (String(b).toLowerCase() === "null" || b === null);
    return isNull !== (String(b).toLowerCase() === "null" || b === null);
  }
  if (a === null || b === null) return false;
  if (op === "LIKE" || op === "ILIKE") {
    const pat = String(b)
      .replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
      .replace(/%/g, ".*")
      .replace(/_/g, ".");
    const re = new RegExp(`^${pat}$`, op === "ILIKE" ? "i" : undefined);
    return re.test(String(a));
  }
  if (op === "IN") {
    // b is not used this way
    return false;
  }
  const na = typeof a === "number" ? a : Number(a);
  const nb = typeof b === "number" ? b : Number(b);
  const bothNum = !Number.isNaN(na) && !Number.isNaN(nb) && String(a) !== "" && String(b) !== "";
  const av = bothNum && typeof a !== "boolean" ? na : a;
  const bv = bothNum && typeof b !== "boolean" ? nb : b;
  switch (op) {
    case "=":
    case "==":
      return av == bv;
    case "!=":
    case "<>":
      return av != bv;
    case ">":
      return (av as number | string) > (bv as number | string);
    case ">=":
      return (av as number | string) >= (bv as number | string);
    case "<":
      return (av as number | string) < (bv as number | string);
    case "<=":
      return (av as number | string) <= (bv as number | string);
    default:
      return false;
  }
}

function evalWhere(row: SqlRow, where: string): boolean {
  if (!where.trim()) return true;
  // split by AND / OR (simple, left-to-right AND stronger via split OR first)
  const orParts = where.split(/\s+OR\s+/i);
  return orParts.some((orPart) => {
    const andParts = orPart.split(/\s+AND\s+/i);
    return andParts.every((clause) => {
      const c = clause.trim();
      // col IN (a,b)
      const inM = c.match(/^([\w.]+)\s+IN\s*\((.+)\)$/i);
      if (inM) {
        const val = evalExpr(row, inM[1]!);
        const list = inM[2]!.split(",").map((x) => parseValue(x.trim()));
        return list.some((x) => x == val);
      }
      const notInM = c.match(/^([\w.]+)\s+NOT\s+IN\s*\((.+)\)$/i);
      if (notInM) {
        const val = evalExpr(row, notInM[1]!);
        const list = notInM[2]!.split(",").map((x) => parseValue(x.trim()));
        return !list.some((x) => x == val);
      }
      const isM = c.match(/^([\w.]+)\s+IS\s+(NOT\s+)?NULL$/i);
      if (isM) {
        const val = evalExpr(row, isM[1]!);
        const isNull = val === null;
        return isM[2] ? !isNull : isNull;
      }
      const m = c.match(
        /^([\w.]+)\s*(=|!=|<>|>=|<=|>|<|LIKE|ILIKE)\s*(.+)$/i,
      );
      if (!m) return true;
      const left = evalExpr(row, m[1]!);
      const op = m[2]!.toUpperCase();
      const right = parseValue(m[3]!);
      return cmp(left, op, right);
    });
  });
}

function parseSelectList(list: string): Array<{ expr: string; as?: string }> {
  // split by comma not in parens
  const parts: string[] = [];
  let buf = "";
  let depth = 0;
  for (const ch of list) {
    if (ch === "(") depth++;
    if (ch === ")") depth--;
    if (ch === "," && depth === 0) {
      parts.push(buf.trim());
      buf = "";
    } else buf += ch;
  }
  if (buf.trim()) parts.push(buf.trim());
  return parts.map((p) => {
    const asM = p.match(/^(.+?)\s+AS\s+([\w"]+)$/i);
    if (asM) return { expr: asM[1]!.trim(), as: unquoteIdent(asM[2]!) };
    const sp = p.match(/^([\w.*]+)\s+([\w"]+)$/);
    if (sp && !/^(count|sum|avg|min|max)$/i.test(sp[1]!)) {
      // only if second looks like alias not keyword
      return { expr: sp[1]!, as: unquoteIdent(sp[2]!) };
    }
    return { expr: p };
  });
}

function applyAgg(
  fn: string,
  col: string,
  rows: SqlRow[],
): SqlValue {
  const f = fn.toUpperCase();
  if (f === "COUNT") {
    if (col === "*" || !col) return rows.length;
    return rows.filter((r) => evalExpr(r, col) !== null).length;
  }
  const vals = rows
    .map((r) => evalExpr(r, col))
    .filter((v) => v !== null && v !== undefined) as number[];
  const nums = vals.map(Number).filter((n) => !Number.isNaN(n));
  if (f === "SUM") return nums.reduce((a, b) => a + b, 0);
  if (f === "AVG") return nums.length ? nums.reduce((a, b) => a + b, 0) / nums.length : null;
  if (f === "MIN") return nums.length ? Math.min(...nums) : null;
  if (f === "MAX") return nums.length ? Math.max(...nums) : null;
  return null;
}

function isAgg(expr: string): boolean {
  return /^(COUNT|SUM|AVG|MIN|MAX)\s*\(/i.test(expr.trim());
}

function parseAgg(expr: string): { fn: string; col: string } | null {
  const m = expr.trim().match(/^(COUNT|SUM|AVG|MIN|MAX)\s*\(\s*([*\w.]+)\s*\)$/i);
  if (!m) return null;
  return { fn: m[1]!, col: m[2]! };
}

export function runSql(
  sqlInput: string,
  tablesIn: Record<string, SqlTable>,
): SqlResult {
  const tables = cloneTables(tablesIn);
  const sql = stripComments(sqlInput);
  if (!sql) return { ok: false, error: "空查询" };

  // only first statement
  const stmt = sql.replace(/;\s*$/, "").trim();
  const upper = stmt.toUpperCase();

  try {
    if (upper.startsWith("SELECT")) {
      return runSelect(stmt, tables);
    }
    if (upper.startsWith("INSERT")) {
      return runInsert(stmt, tables);
    }
    if (upper.startsWith("UPDATE")) {
      return runUpdate(stmt, tables);
    }
    if (upper.startsWith("DELETE")) {
      return runDelete(stmt, tables);
    }
    if (upper.startsWith("CREATE TABLE")) {
      return runCreate(stmt, tables);
    }
    if (upper.startsWith("DROP TABLE")) {
      const m = stmt.match(/^DROP\s+TABLE\s+(?:IF\s+EXISTS\s+)?([\w"]+)/i);
      if (!m) return { ok: false, error: "DROP TABLE 语法错误" };
      const name = unquoteIdent(m[1]!).toLowerCase();
      if (!(name in tables)) {
        if (/IF\s+EXISTS/i.test(stmt)) {
          return { ok: true, kind: "mutate", message: "表不存在，已跳过", affected: 0, tables };
        }
        return { ok: false, error: `表不存在: ${name}` };
      }
      delete tables[name];
      return { ok: true, kind: "mutate", message: `已删除表 ${name}`, affected: 0, tables };
    }
    return {
      ok: false,
      error: "本教学引擎支持 SELECT / INSERT / UPDATE / DELETE / CREATE TABLE / DROP TABLE",
    };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : String(e) };
  }
}

function runSelect(stmt: string, tables: Record<string, SqlTable>): SqlResult {
  // SELECT ... FROM t [alias] [JOIN ...] [WHERE ...] [GROUP BY ...] [ORDER BY ...] [LIMIT n]
  const m = stmt.match(
    /^SELECT\s+([\s\S]+?)\s+FROM\s+([\s\S]+)$/i,
  );
  if (!m) return { ok: false, error: "SELECT 语法错误：需要 FROM" };

  const selectList = m[1]!;
  let rest = m[2]!;

  // extract LIMIT
  let limit: number | null = null;
  const limM = rest.match(/\s+LIMIT\s+(\d+)\s*$/i);
  if (limM) {
    limit = Number(limM[1]);
    rest = rest.slice(0, limM.index).trim();
  }

  // ORDER BY
  let orderBy: { col: string; dir: "ASC" | "DESC" } | null = null;
  const ordM = rest.match(/\s+ORDER\s+BY\s+([\w.]+)(?:\s+(ASC|DESC))?\s*$/i);
  if (ordM) {
    orderBy = { col: ordM[1]!, dir: (ordM[2]?.toUpperCase() as "ASC" | "DESC") || "ASC" };
    rest = rest.slice(0, ordM.index).trim();
  }

  // GROUP BY
  let groupBy: string[] = [];
  const grpM = rest.match(/\s+GROUP\s+BY\s+([\w.,\s]+)\s*$/i);
  if (grpM) {
    groupBy = grpM[1]!.split(",").map((s) => s.trim());
    rest = rest.slice(0, grpM.index).trim();
  }

  // WHERE
  let where = "";
  const whM = rest.match(/\s+WHERE\s+([\s\S]+)$/i);
  if (whM) {
    where = whM[1]!.trim();
    rest = rest.slice(0, whM.index).trim();
  }

  // FROM + JOINs
  // rest now: table [alias] [JOIN table alias ON cond]*
  const joinParts = rest.split(/\s+(INNER\s+JOIN|LEFT\s+JOIN|JOIN)\s+/i);
  const fromPart = joinParts[0]!.trim();
  const fromM = fromPart.match(/^([\w"]+)(?:\s+(?:AS\s+)?([\w"]+))?$/i);
  if (!fromM) return { ok: false, error: `无法解析 FROM: ${fromPart}` };
  const baseName = unquoteIdent(fromM[1]!).toLowerCase();
  const baseAlias = fromM[2] ? unquoteIdent(fromM[2]!) : baseName;
  if (!(baseName in tables)) return { ok: false, error: `表不存在: ${baseName}` };

  type JoinSpec = {
    type: "inner" | "left";
    table: string;
    alias: string;
    on: string;
  };
  const joins: JoinSpec[] = [];
  for (let i = 1; i < joinParts.length; i += 2) {
    const jtype = joinParts[i]!.toUpperCase().includes("LEFT") ? "left" : "inner";
    const jbody = joinParts[i + 1] ?? "";
    const jm = jbody.match(
      /^([\w"]+)(?:\s+(?:AS\s+)?([\w"]+))?\s+ON\s+(.+)$/i,
    );
    if (!jm) return { ok: false, error: `JOIN 语法错误: ${jbody}` };
    joins.push({
      type: jtype,
      table: unquoteIdent(jm[1]!).toLowerCase(),
      alias: jm[2] ? unquoteIdent(jm[2]!) : unquoteIdent(jm[1]!).toLowerCase(),
      on: jm[3]!.trim(),
    });
  }

  // Build row set with flat columns (unprefixed preferred; prefixed for conflicts)
  let rows: SqlRow[] = tables[baseName]!.rows.map((r) => {
    const out: SqlRow = { ...r };
    for (const [k, v] of Object.entries(r)) {
      out[`${baseAlias}.${k}`] = v;
    }
    return out;
  });

  for (const j of joins) {
    if (!(j.table in tables)) return { ok: false, error: `表不存在: ${j.table}` };
    const rightRows = tables[j.table]!.rows;
    const next: SqlRow[] = [];
    for (const left of rows) {
      let matched = false;
      for (const rr of rightRows) {
        const combined: SqlRow = { ...left };
        for (const [k, v] of Object.entries(rr)) {
          if (!(k in combined)) combined[k] = v;
          combined[`${j.alias}.${k}`] = v;
        }
        // evaluate ON: rewrite alias.col
        if (evalJoinOn(combined, j.on, left, rr, baseAlias, j.alias)) {
          next.push(combined);
          matched = true;
        }
      }
      if (!matched && j.type === "left") {
        const combined: SqlRow = { ...left };
        for (const col of tables[j.table]!.columns) {
          if (!(col in combined)) combined[col] = null;
          combined[`${j.alias}.${col}`] = null;
        }
        next.push(combined);
      }
    }
    rows = next;
  }

  // WHERE
  if (where) {
    rows = rows.filter((r) => evalWhere(r, where));
  }

  const cols = parseSelectList(selectList);
  const hasAgg = cols.some((c) => isAgg(c.expr)) || groupBy.length > 0;

  let resultRows: SqlRow[] = [];
  let resultCols: string[] = [];

  if (hasAgg) {
    const groups = new Map<string, SqlRow[]>();
    if (groupBy.length === 0) {
      groups.set("__all__", rows);
    } else {
      for (const r of rows) {
        const key = groupBy.map((g) => String(evalExpr(r, g))).join("\0");
        if (!groups.has(key)) groups.set(key, []);
        groups.get(key)!.push(r);
      }
    }
    for (const groupRows of groups.values()) {
      const out: SqlRow = {};
      for (const c of cols) {
        const name = c.as ?? c.expr;
        if (isAgg(c.expr)) {
          const ag = parseAgg(c.expr);
          if (!ag) throw new Error(`聚合表达式错误: ${c.expr}`);
          out[name] = applyAgg(ag.fn, ag.col, groupRows);
        } else {
          out[name] = evalExpr(groupRows[0]!, c.expr);
        }
      }
      resultRows.push(out);
    }
    resultCols = cols.map((c) => c.as ?? c.expr);
  } else {
    // SELECT *
    if (cols.length === 1 && cols[0]!.expr === "*") {
      // use base table columns if no joins
      if (joins.length === 0) {
        resultCols = tables[baseName]!.columns;
        resultRows = rows.map((r) => {
          const o: SqlRow = {};
          for (const c of resultCols) o[c] = r[c] ?? null;
          return o;
        });
      } else {
        // all unique non-dotted keys first
        const set = new Set<string>();
        for (const r of rows) {
          for (const k of Object.keys(r)) {
            if (!k.includes(".")) set.add(k);
          }
        }
        resultCols = [...set];
        resultRows = rows.map((r) => {
          const o: SqlRow = {};
          for (const c of resultCols) o[c] = r[c] ?? null;
          return o;
        });
      }
    } else {
      resultCols = cols.map((c) => c.as ?? c.expr.replace(/^[\w]+\./, ""));
      resultRows = rows.map((r) => {
        const o: SqlRow = {};
        cols.forEach((c, i) => {
          const name = resultCols[i]!;
          o[name] = evalExpr(r, c.expr);
        });
        return o;
      });
    }
  }

  if (orderBy) {
    const { col, dir } = orderBy;
    resultRows.sort((a, b) => {
      const av = a[col] ?? a[col.split(".").pop()!] ?? null;
      const bv = b[col] ?? b[col.split(".").pop()!] ?? null;
      if (av === bv) return 0;
      if (av === null) return 1;
      if (bv === null) return -1;
      if (av < bv) return dir === "ASC" ? -1 : 1;
      if (av > bv) return dir === "ASC" ? 1 : -1;
      return 0;
    });
  }

  if (limit !== null) resultRows = resultRows.slice(0, limit);

  return {
    ok: true,
    kind: "select",
    columns: resultCols,
    rows: resultRows,
    message: `${resultRows.length} 行`,
  };
}

function evalJoinOn(
  combined: SqlRow,
  on: string,
  left: SqlRow,
  right: SqlRow,
  leftAlias: string,
  rightAlias: string,
): boolean {
  // support a.col = b.col
  const m = on.match(/^([\w.]+)\s*=\s*([\w.]+)$/i);
  if (!m) return evalWhere(combined, on);
  const lv = resolveJoinCol(m[1]!, left, right, leftAlias, rightAlias, combined);
  const rv = resolveJoinCol(m[2]!, left, right, leftAlias, rightAlias, combined);
  return lv == rv;
}

function resolveJoinCol(
  ref: string,
  left: SqlRow,
  right: SqlRow,
  leftAlias: string,
  rightAlias: string,
  combined: SqlRow,
): SqlValue {
  if (ref.includes(".")) {
    const [a, c] = ref.split(".");
    if (a === leftAlias) return left[c!] ?? left[`${leftAlias}.${c}`] ?? null;
    if (a === rightAlias) return right[c!] ?? null;
    return combined[ref] ?? combined[c!] ?? null;
  }
  return combined[ref] ?? left[ref] ?? right[ref] ?? null;
}

function runInsert(stmt: string, tables: Record<string, SqlTable>): SqlResult {
  // INSERT INTO t (cols) VALUES (v1),(v2)
  const m = stmt.match(
    /^INSERT\s+INTO\s+([\w"]+)\s*(?:\(([^)]+)\))?\s*VALUES\s*([\s\S]+)$/i,
  );
  if (!m) return { ok: false, error: "INSERT 语法错误" };
  const name = unquoteIdent(m[1]!).toLowerCase();
  if (!(name in tables)) return { ok: false, error: `表不存在: ${name}` };
  const table = tables[name]!;
  const cols = m[2]
    ? m[2].split(",").map((c) => unquoteIdent(c.trim()))
    : table.columns;
  const valuesBlob = m[3]!.trim();
  const tuples: string[] = [];
  let buf = "";
  let depth = 0;
  for (const ch of valuesBlob) {
    if (ch === "(") {
      depth++;
      if (depth === 1) {
        buf = "";
        continue;
      }
    }
    if (ch === ")") {
      depth--;
      if (depth === 0) {
        tuples.push(buf);
        continue;
      }
    }
    if (depth >= 1) buf += ch;
  }
  let affected = 0;
  for (const t of tuples) {
    const vals = splitCsv(t).map(parseValue);
    const row: SqlRow = {};
    for (const c of table.columns) row[c] = null;
    cols.forEach((c, i) => {
      row[c] = vals[i] ?? null;
    });
    table.rows.push(row);
    affected++;
  }
  return {
    ok: true,
    kind: "mutate",
    message: `插入 ${affected} 行到 ${name}`,
    affected,
    tables,
  };
}

function splitCsv(s: string): string[] {
  const parts: string[] = [];
  let buf = "";
  let inQ = false;
  for (let i = 0; i < s.length; i++) {
    const ch = s[i]!;
    if (ch === "'" && s[i + 1] === "'") {
      buf += "''";
      i++;
      continue;
    }
    if (ch === "'") {
      inQ = !inQ;
      buf += ch;
      continue;
    }
    if (ch === "," && !inQ) {
      parts.push(buf.trim());
      buf = "";
      continue;
    }
    buf += ch;
  }
  if (buf.trim() || parts.length) parts.push(buf.trim());
  return parts;
}

function runUpdate(stmt: string, tables: Record<string, SqlTable>): SqlResult {
  const m = stmt.match(
    /^UPDATE\s+([\w"]+)\s+SET\s+([\s\S]+?)(?:\s+WHERE\s+([\s\S]+))?$/i,
  );
  if (!m) return { ok: false, error: "UPDATE 语法错误" };
  const name = unquoteIdent(m[1]!).toLowerCase();
  if (!(name in tables)) return { ok: false, error: `表不存在: ${name}` };
  const table = tables[name]!;
  const setPart = m[2]!;
  const where = m[3] ?? "";
  const assigns = setPart.split(",").map((p) => {
    const am = p.trim().match(/^([\w"]+)\s*=\s*(.+)$/);
    if (!am) throw new Error(`SET 子句错误: ${p}`);
    return { col: unquoteIdent(am[1]!), val: parseValue(am[2]!) };
  });
  let affected = 0;
  for (const row of table.rows) {
    if (where && !evalWhere(row, where)) continue;
    for (const a of assigns) row[a.col] = a.val;
    affected++;
  }
  return {
    ok: true,
    kind: "mutate",
    message: `更新 ${affected} 行 (${name})`,
    affected,
    tables,
  };
}

function runDelete(stmt: string, tables: Record<string, SqlTable>): SqlResult {
  const m = stmt.match(/^DELETE\s+FROM\s+([\w"]+)(?:\s+WHERE\s+([\s\S]+))?$/i);
  if (!m) return { ok: false, error: "DELETE 语法错误" };
  const name = unquoteIdent(m[1]!).toLowerCase();
  if (!(name in tables)) return { ok: false, error: `表不存在: ${name}` };
  const table = tables[name]!;
  const where = m[2] ?? "";
  const before = table.rows.length;
  if (!where) {
    table.rows = [];
  } else {
    table.rows = table.rows.filter((r) => !evalWhere(r, where));
  }
  const affected = before - table.rows.length;
  return {
    ok: true,
    kind: "mutate",
    message: `删除 ${affected} 行 (${name})`,
    affected,
    tables,
  };
}

function runCreate(stmt: string, tables: Record<string, SqlTable>): SqlResult {
  const m = stmt.match(
    /^CREATE\s+TABLE\s+(?:IF\s+NOT\s+EXISTS\s+)?([\w"]+)\s*\(([\s\S]+)\)$/i,
  );
  if (!m) return { ok: false, error: "CREATE TABLE 语法错误" };
  const name = unquoteIdent(m[1]!).toLowerCase();
  if (name in tables && !/IF\s+NOT\s+EXISTS/i.test(stmt)) {
    return { ok: false, error: `表已存在: ${name}` };
  }
  if (name in tables) {
    return { ok: true, kind: "mutate", message: "表已存在，跳过", affected: 0, tables };
  }
  const cols = m[2]!
    .split(",")
    .map((c) => c.trim())
    .filter((c) => c && !/^(PRIMARY|UNIQUE|CONSTRAINT|FOREIGN|CHECK)/i.test(c))
    .map((c) => unquoteIdent(c.split(/\s+/)[0]!));
  tables[name] = { name, columns: cols, rows: [] };
  return {
    ok: true,
    kind: "mutate",
    message: `已创建表 ${name} (${cols.join(", ")})`,
    affected: 0,
    tables,
  };
}

export function tablesEqual(
  a: { columns: string[]; rows: SqlRow[] },
  b: { columns: string[]; rows: SqlRow[] },
): boolean {
  if (a.rows.length !== b.rows.length) return false;
  // compare as sets of JSON rows (order-insensitive by default for checks)
  const norm = (rows: SqlRow[], cols: string[]) =>
    rows
      .map((r) => JSON.stringify(cols.map((c) => r[c] ?? null)))
      .sort()
      .join("|");
  const cols =
    a.columns.length >= b.columns.length ? a.columns : b.columns;
  return norm(a.rows, cols) === norm(b.rows, cols);
}

export function resultFingerprint(res: SqlResult): string {
  if (!res.ok) return `err:${res.error}`;
  if (res.kind === "mutate") return `mut:${res.affected}:${res.message}`;
  return JSON.stringify({
    c: res.columns,
    r: res.rows.map((row) => res.columns.map((c) => row[c] ?? null)),
  });
}
