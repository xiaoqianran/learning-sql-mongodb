export type QuizQuestion = {
  id: string;
  question: string;
  options: string[];
  answer: number;
  explain: string;
};

export type DemoKind =
  | "sql-select-all"
  | "sql-select-cols"
  | "sql-where"
  | "sql-order"
  | "sql-group"
  | "sql-join"
  | "sql-left-join"
  | "sql-subquery"
  | "sql-dml"
  | "sql-create"
  | "sql-shop"
  | "mongo-find"
  | "mongo-crud"
  | "mongo-ops"
  | "mongo-embed"
  | "mongo-agg"
  | "mongo-update-ops"
  | "compare-model";

export type LessonBlock =
  | { type: "text"; title?: string; body: string }
  | { type: "code"; title?: string; lang?: string; code: string }
  | { type: "tip"; body: string }
  | { type: "demo"; kind: DemoKind; title: string; hint?: string }
  | { type: "quiz"; questions: QuizQuestion[] };

export type Lesson = {
  slug: string;
  title: string;
  summary: string;
  level: "入门" | "进阶" | "实战";
  track: "SQL 入门" | "SQL 进阶" | "SQL 实战" | "MongoDB 入门" | "MongoDB 进阶" | "对比与选型" | "工程实践" | "知识卡片";
  format?: "course" | "reference";
  minutes: number;
  official?: string;
  blocks: LessonBlock[];
};

export const LESSONS: Lesson[] = [
  {
    "slug": "intro",
    "title": "数据库与 SQL 是什么",
    "summary": "关系型模型、表、行、列与 SQL 角色。",
    "level": "入门",
    "track": "SQL 入门",
    "minutes": 6,
    "official": "https://www.postgresql.org/docs/current/tutorial-sql.html",
    "blocks": [
      {
        "type": "text",
        "title": "为什么学数据库",
        "body": "几乎所有后端都会存数据。SQL 是操作关系型数据库（PostgreSQL、MySQL、SQLite）的标准语言；MongoDB 则是文档型（JSON-like）数据库。本站用同一套示例商店数据，双轨对照学习。"
      },
      {
        "type": "text",
        "title": "关系型核心概念",
        "body": "表（table）≈ 电子表格；行（row）是一条记录；列（column）有类型与约束。主键（PRIMARY KEY）唯一标识一行；外键把表关联起来。"
      },
      {
        "type": "code",
        "title": "第一句 SQL",
        "lang": "sql",
        "code": "SELECT * FROM users LIMIT 3;"
      },
      {
        "type": "demo",
        "kind": "sql-select-all",
        "title": "动手：查出用户",
        "hint": "运行示例查询，观察结果表"
      },
      {
        "type": "quiz",
        "questions": [
          {
            "id": "i1",
            "question": "SQL 主要用于？",
            "options": [
              "画 UI",
              "操作关系型数据",
              "编译 C++",
              "设计图标"
            ],
            "answer": 1,
            "explain": "Structured Query Language。"
          },
          {
            "id": "i2",
            "question": "一行记录通常叫？",
            "options": [
              "列",
              "行 / row / tuple",
              "索引",
              "视图"
            ],
            "answer": 1,
            "explain": "row。"
          }
        ]
      }
    ]
  },
  {
    "slug": "select-basics",
    "title": "SELECT 基础",
    "summary": "投影列、别名、LIMIT。",
    "level": "入门",
    "track": "SQL 入门",
    "minutes": 8,
    "blocks": [
      {
        "type": "text",
        "title": "投影",
        "body": "SELECT 后面是你要的列。用 AS 起别名。LIMIT 限制返回行数。"
      },
      {
        "type": "code",
        "title": "选列与别名",
        "lang": "sql",
        "code": "SELECT name AS user_name, city\nFROM users\nLIMIT 5;"
      },
      {
        "type": "demo",
        "kind": "sql-select-cols",
        "title": "动手：选列",
        "hint": "只查 name 与 city"
      },
      {
        "type": "tip",
        "body": "生产环境避免无脑 SELECT *：带宽、索引与契约都会变脆弱。"
      },
      {
        "type": "quiz",
        "questions": [
          {
            "id": "s1",
            "question": "AS 的作用？",
            "options": [
              "删表",
              "列别名",
              "建索引",
              "授权"
            ],
            "answer": 1,
            "explain": "别名。"
          },
          {
            "id": "s2",
            "question": "LIMIT 3 返回？",
            "options": [
              "3 列",
              "最多 3 行",
              "第 3 页",
              "3 张表"
            ],
            "answer": 1,
            "explain": "行数上限。"
          }
        ]
      }
    ]
  },
  {
    "slug": "where-filter",
    "title": "WHERE 过滤",
    "summary": "比较、AND/OR、IN、LIKE、NULL。",
    "level": "入门",
    "track": "SQL 入门",
    "minutes": 10,
    "blocks": [
      {
        "type": "text",
        "title": "过滤行",
        "body": "WHERE 在 FROM 之后筛选行。注意：NULL 不能用 = 判断，要用 IS NULL / IS NOT NULL。"
      },
      {
        "type": "code",
        "title": "组合条件",
        "lang": "sql",
        "code": "SELECT name, age, city\nFROM users\nWHERE city = 'Tokyo' AND age >= 25;"
      },
      {
        "type": "code",
        "title": "IN 与 LIKE",
        "lang": "sql",
        "code": "SELECT * FROM products\nWHERE category IN ('Books', 'Hardware')\n  AND name LIKE '%SQL%';"
      },
      {
        "type": "demo",
        "kind": "sql-where",
        "title": "动手：过滤东京用户",
        "hint": "WHERE city = 'Tokyo'"
      },
      {
        "type": "quiz",
        "questions": [
          {
            "id": "w1",
            "question": "判断 NULL？",
            "options": [
              "= NULL",
              "IS NULL",
              "== null",
              "NULL()"
            ],
            "answer": 1,
            "explain": "三值逻辑。"
          },
          {
            "id": "w2",
            "question": "LIKE '%a' 匹配？",
            "options": [
              "以 a 开头",
              "以 a 结尾",
              "等于 a",
              "不含 a"
            ],
            "answer": 1,
            "explain": "% 通配任意长度。"
          }
        ]
      }
    ]
  },
  {
    "slug": "order-limit",
    "title": "ORDER BY 与分页思维",
    "summary": "排序、稳定分页思路。",
    "level": "入门",
    "track": "SQL 入门",
    "minutes": 7,
    "blocks": [
      {
        "type": "text",
        "title": "排序",
        "body": "ORDER BY col ASC|DESC。多列排序从左到右。分页常用 LIMIT + OFFSET，但深分页更推荐键集分页。"
      },
      {
        "type": "code",
        "title": "按价格降序",
        "lang": "sql",
        "code": "SELECT name, price\nFROM products\nORDER BY price DESC\nLIMIT 3;"
      },
      {
        "type": "demo",
        "kind": "sql-order",
        "title": "动手：最贵商品",
        "hint": "ORDER BY price DESC LIMIT 3"
      },
      {
        "type": "quiz",
        "questions": [
          {
            "id": "o1",
            "question": "DESC 表示？",
            "options": [
              "升序",
              "降序",
              "去重",
              "默认"
            ],
            "answer": 1,
            "explain": "descending。"
          }
        ]
      }
    ]
  },
  {
    "slug": "aggregates",
    "title": "聚合：COUNT / SUM / AVG",
    "summary": "GROUP BY 与聚合函数。",
    "level": "入门",
    "track": "SQL 入门",
    "minutes": 12,
    "blocks": [
      {
        "type": "text",
        "title": "聚合",
        "body": "COUNT、SUM、AVG、MIN、MAX 把多行压成统计。GROUP BY 按维度分组；SELECT 中非聚合列必须出现在 GROUP BY。"
      },
      {
        "type": "code",
        "title": "按城市统计人数",
        "lang": "sql",
        "code": "SELECT city, COUNT(*) AS cnt\nFROM users\nGROUP BY city\nORDER BY cnt DESC;"
      },
      {
        "type": "code",
        "title": "订单总额",
        "lang": "sql",
        "code": "SELECT status, SUM(total) AS revenue\nFROM orders\nGROUP BY status;"
      },
      {
        "type": "demo",
        "kind": "sql-group",
        "title": "动手：城市人数",
        "hint": "GROUP BY city"
      },
      {
        "type": "tip",
        "body": "WHERE 在分组前过滤行；HAVING 在分组后过滤组（本教学引擎简化为先 WHERE）。"
      },
      {
        "type": "quiz",
        "questions": [
          {
            "id": "a1",
            "question": "COUNT(*) 统计？",
            "options": [
              "非空列",
              "所有行",
              "仅主键",
              "仅 NULL"
            ],
            "answer": 1,
            "explain": "所有行。"
          },
          {
            "id": "a2",
            "question": "GROUP BY 作用？",
            "options": [
              "排序",
              "按维度分组聚合",
              "建表",
              "授权"
            ],
            "answer": 1,
            "explain": "分组。"
          }
        ]
      }
    ]
  },
  {
    "slug": "join-intro",
    "title": "JOIN 联结表",
    "summary": "INNER JOIN 与多表查询。",
    "level": "入门",
    "track": "SQL 入门",
    "minutes": 12,
    "blocks": [
      {
        "type": "text",
        "title": "为什么 JOIN",
        "body": "订单里只有 user_id，用户名在 users 表。JOIN 用键把表拼起来。INNER JOIN 只保留两侧都匹配的行。"
      },
      {
        "type": "code",
        "title": "订单带用户名",
        "lang": "sql",
        "code": "SELECT o.id, u.name, o.total, o.status\nFROM orders o\nJOIN users u ON o.user_id = u.id;"
      },
      {
        "type": "demo",
        "kind": "sql-join",
        "title": "动手：订单 × 用户",
        "hint": "JOIN users"
      },
      {
        "type": "quiz",
        "questions": [
          {
            "id": "j1",
            "question": "INNER JOIN 结果？",
            "options": [
              "左表全保留",
              "两侧匹配行",
              "笛卡尔积全量",
              "右表全保留"
            ],
            "answer": 1,
            "explain": "匹配交集。"
          },
          {
            "id": "j2",
            "question": "ON 子句？",
            "options": [
              "排序",
              "联结条件",
              "分页",
              "建索引"
            ],
            "answer": 1,
            "explain": "联结条件。"
          }
        ]
      }
    ]
  },
  {
    "slug": "left-join",
    "title": "LEFT JOIN 与空值",
    "summary": "保留左表、右侧可为 NULL。",
    "level": "进阶",
    "track": "SQL 进阶",
    "minutes": 10,
    "blocks": [
      {
        "type": "text",
        "title": "LEFT JOIN",
        "body": "左表每行都保留；右表无匹配时右侧列为 NULL。常用于「找出没有订单的用户」。"
      },
      {
        "type": "code",
        "title": "用户及其订单",
        "lang": "sql",
        "code": "SELECT u.name, o.id AS order_id, o.total\nFROM users u\nLEFT JOIN orders o ON o.user_id = u.id;"
      },
      {
        "type": "demo",
        "kind": "sql-left-join",
        "title": "动手：LEFT JOIN",
        "hint": "观察无订单用户"
      },
      {
        "type": "quiz",
        "questions": [
          {
            "id": "lj1",
            "question": "LEFT JOIN 无匹配时右侧？",
            "options": [
              "报错",
              "NULL",
              "0",
              "删除左行"
            ],
            "answer": 1,
            "explain": "NULL。"
          }
        ]
      }
    ]
  },
  {
    "slug": "subquery",
    "title": "子查询",
    "summary": "WHERE IN / 标量子查询思路。",
    "level": "进阶",
    "track": "SQL 进阶",
    "minutes": 10,
    "blocks": [
      {
        "type": "text",
        "title": "子查询",
        "body": "查询里嵌查询。常见：WHERE col IN (SELECT ...)、FROM (SELECT ...) t。能写 JOIN 的往往更清晰，但子查询表达「集合条件」很直观。"
      },
      {
        "type": "code",
        "title": "买过单的用户",
        "lang": "sql",
        "code": "SELECT name FROM users\nWHERE id IN (\n  SELECT user_id FROM orders WHERE status = 'paid'\n);"
      },
      {
        "type": "demo",
        "kind": "sql-subquery",
        "title": "动手：子查询",
        "hint": "IN (SELECT ...)"
      },
      {
        "type": "quiz",
        "questions": [
          {
            "id": "sq1",
            "question": "IN (SELECT ...) 用于？",
            "options": [
              "建表",
              "集合成员判断",
              "备份",
              "事务"
            ],
            "answer": 1,
            "explain": "成员判断。"
          }
        ]
      }
    ]
  },
  {
    "slug": "insert-update-delete",
    "title": "INSERT / UPDATE / DELETE",
    "summary": "DML 写操作。",
    "level": "进阶",
    "track": "SQL 进阶",
    "minutes": 10,
    "blocks": [
      {
        "type": "text",
        "title": "写数据",
        "body": "INSERT 插入、UPDATE 修改、DELETE 删除。没有 WHERE 的 UPDATE/DELETE 会动整表——生产极危险。"
      },
      {
        "type": "code",
        "title": "插入",
        "lang": "sql",
        "code": "INSERT INTO users (id, name, email, city, age)\nVALUES (6, 'Frank', 'frank@mail.com', 'Nagoya', 31);"
      },
      {
        "type": "code",
        "title": "更新与删除",
        "lang": "sql",
        "code": "UPDATE products SET stock = 100 WHERE id = 2;\nDELETE FROM orders WHERE status = 'cancelled';"
      },
      {
        "type": "demo",
        "kind": "sql-dml",
        "title": "动手：改库存",
        "hint": "UPDATE products"
      },
      {
        "type": "tip",
        "body": "先 SELECT 同一 WHERE 验证影响行数，再执行写操作。"
      },
      {
        "type": "quiz",
        "questions": [
          {
            "id": "d1",
            "question": "无 WHERE 的 DELETE？",
            "options": [
              "删一行",
              "可能清空表",
              "只删主键",
              "无效"
            ],
            "answer": 1,
            "explain": "整表删除风险。"
          },
          {
            "id": "d2",
            "question": "DML 包含？",
            "options": [
              "CREATE",
              "INSERT/UPDATE/DELETE",
              "GRANT",
              "VACUUM"
            ],
            "answer": 1,
            "explain": "数据操纵。"
          }
        ]
      }
    ]
  },
  {
    "slug": "create-table",
    "title": "CREATE TABLE 与类型",
    "summary": "建表、主键思路。",
    "level": "进阶",
    "track": "SQL 进阶",
    "minutes": 9,
    "blocks": [
      {
        "type": "text",
        "title": "DDL",
        "body": "CREATE TABLE 定义结构。类型：INT、TEXT/VARCHAR、BOOLEAN、TIMESTAMP… 约束：PRIMARY KEY、NOT NULL、UNIQUE。"
      },
      {
        "type": "code",
        "title": "建表",
        "lang": "sql",
        "code": "CREATE TABLE reviews (\n  id INT,\n  product_id INT,\n  rating INT,\n  body TEXT\n);"
      },
      {
        "type": "demo",
        "kind": "sql-create",
        "title": "动手：建表",
        "hint": "CREATE TABLE"
      },
      {
        "type": "quiz",
        "questions": [
          {
            "id": "c1",
            "question": "PRIMARY KEY 保证？",
            "options": [
              "可重复",
              "唯一且标识行",
              "必须是字符串",
              "自动 JOIN"
            ],
            "answer": 1,
            "explain": "唯一标识。"
          }
        ]
      }
    ]
  },
  {
    "slug": "indexes",
    "title": "索引入门",
    "summary": "B-Tree 直觉、何时建索引。",
    "level": "进阶",
    "track": "SQL 进阶",
    "minutes": 10,
    "blocks": [
      {
        "type": "text",
        "title": "索引是什么",
        "body": "索引像书的目录：加速 WHERE / JOIN / ORDER BY，但拖慢写入并占空间。先对高频过滤列、外键列建索引。"
      },
      {
        "type": "code",
        "title": "示例（PostgreSQL 语法示意）",
        "lang": "sql",
        "code": "-- 教学环境不执行物理索引，理解语义即可\n-- CREATE INDEX idx_orders_user ON orders(user_id);\nSELECT * FROM orders WHERE user_id = 1;"
      },
      {
        "type": "tip",
        "body": "不是列越多越好：低基数列（如性别）单独索引收益小；复合索引注意最左前缀。"
      },
      {
        "type": "quiz",
        "questions": [
          {
            "id": "ix1",
            "question": "索引主要加速？",
            "options": [
              "磁盘扩容",
              "查询定位",
              "网络",
              "UI"
            ],
            "answer": 1,
            "explain": "查找。"
          },
          {
            "id": "ix2",
            "question": "索引副作用？",
            "options": [
              "写入变慢/占空间",
              "数据更准确",
              "自动备份",
              "免 SQL 注入"
            ],
            "answer": 0,
            "explain": "写放大。"
          }
        ]
      }
    ]
  },
  {
    "slug": "transactions",
    "title": "事务 ACID",
    "summary": "原子性、一致性、隔离、持久。",
    "level": "进阶",
    "track": "SQL 进阶",
    "minutes": 11,
    "blocks": [
      {
        "type": "text",
        "title": "事务",
        "body": "BEGIN → 多条语句 → COMMIT 或 ROLLBACK。转账：扣款+入账必须同进同退。隔离级别影响脏读/不可重复读/幻读。"
      },
      {
        "type": "code",
        "title": "示意",
        "lang": "sql",
        "code": "-- BEGIN;\n-- UPDATE accounts SET bal = bal - 100 WHERE id = 1;\n-- UPDATE accounts SET bal = bal + 100 WHERE id = 2;\n-- COMMIT;"
      },
      {
        "type": "tip",
        "body": "MongoDB 也有多文档事务，但文档模型常通过内嵌减少跨文档事务需求。"
      },
      {
        "type": "quiz",
        "questions": [
          {
            "id": "tx1",
            "question": "ACID 中 A？",
            "options": [
              "Array",
              "Atomicity 原子性",
              "Async",
              "Alias"
            ],
            "answer": 1,
            "explain": "原子性。"
          },
          {
            "id": "tx2",
            "question": "ROLLBACK 作用？",
            "options": [
              "提交",
              "撤销未提交变更",
              "建索引",
              "备份"
            ],
            "answer": 1,
            "explain": "回滚。"
          }
        ]
      }
    ]
  },
  {
    "slug": "normalization",
    "title": "范式与建模直觉",
    "summary": "1NF/2NF/3NF 与适度反范式。",
    "level": "进阶",
    "track": "SQL 进阶",
    "minutes": 10,
    "blocks": [
      {
        "type": "text",
        "title": "规范化",
        "body": "减少冗余与更新异常：一格一值、消除部分依赖与传递依赖。分析场景可适度反范式（冗余加速读）。"
      },
      {
        "type": "text",
        "title": "订单例子",
        "body": "不要把用户邮箱重复写在每一行订单里当唯一真相；用 user_id 关联。报表库可以冗余快照字段。"
      },
      {
        "type": "quiz",
        "questions": [
          {
            "id": "n1",
            "question": "规范化主要目标？",
            "options": [
              "更多冗余",
              "减少异常与冗余",
              "取消主键",
              "只用 Mongo"
            ],
            "answer": 1,
            "explain": "减冗余。"
          }
        ]
      }
    ]
  },
  {
    "slug": "sql-shop-queries",
    "title": "实战：商店分析查询",
    "summary": "组合 JOIN + 聚合解决业务问题。",
    "level": "实战",
    "track": "SQL 实战",
    "minutes": 12,
    "blocks": [
      {
        "type": "text",
        "title": "业务问题",
        "body": "「每个城市的已支付订单总金额」需要 users ⋈ orders 再过滤、分组。"
      },
      {
        "type": "code",
        "title": "城市收入",
        "lang": "sql",
        "code": "SELECT u.city, SUM(o.total) AS revenue\nFROM orders o\nJOIN users u ON o.user_id = u.id\nWHERE o.status = 'paid'\nGROUP BY u.city\nORDER BY revenue DESC;"
      },
      {
        "type": "demo",
        "kind": "sql-shop",
        "title": "动手：城市收入",
        "hint": "JOIN + GROUP BY"
      },
      {
        "type": "quiz",
        "questions": [
          {
            "id": "ss1",
            "question": "本查询核心技巧？",
            "options": [
              "仅 DELETE",
              "JOIN + 过滤 + 聚合",
              "DROP TABLE",
              "无 WHERE"
            ],
            "answer": 1,
            "explain": "组合拳。"
          }
        ]
      }
    ]
  },
  {
    "slug": "sql-injection",
    "title": "SQL 注入与参数化",
    "summary": "永远不要拼接不可信输入。",
    "level": "实战",
    "track": "SQL 实战",
    "minutes": 9,
    "blocks": [
      {
        "type": "text",
        "title": "注入",
        "body": "把用户输入拼进 SQL 字符串会导致攻击者改写语句。正确做法：参数化查询 / 预编译（$1、? 占位）。"
      },
      {
        "type": "code",
        "title": "危险 vs 安全（示意）",
        "lang": "js",
        "code": "// 危险\n// db.query(\"SELECT * FROM users WHERE name = '\" + name + \"'\")\n// 安全\n// db.query(\"SELECT * FROM users WHERE name = $1\", [name])"
      },
      {
        "type": "tip",
        "body": "ORM 不是自动安全：raw SQL 拼接同样危险。最小权限账号、WAF 是纵深防御。"
      },
      {
        "type": "quiz",
        "questions": [
          {
            "id": "inj1",
            "question": "防注入首选？",
            "options": [
              "禁用 SELECT",
              "参数化查询",
              "更长密码",
              "只用 Mongo"
            ],
            "answer": 1,
            "explain": "参数绑定。"
          }
        ]
      }
    ]
  },
  {
    "slug": "explain-plan",
    "title": "读懂执行计划直觉",
    "summary": "Seq Scan vs Index Scan。",
    "level": "实战",
    "track": "SQL 实战",
    "minutes": 8,
    "blocks": [
      {
        "type": "text",
        "title": "EXPLAIN",
        "body": "数据库会生成执行计划。顺序扫描适合小表；大表等值查询应走索引。统计信息过期会导致烂计划——要 ANALYZE。"
      },
      {
        "type": "code",
        "title": "示意",
        "lang": "sql",
        "code": "-- EXPLAIN ANALYZE SELECT * FROM orders WHERE user_id = 1;"
      },
      {
        "type": "quiz",
        "questions": [
          {
            "id": "ex1",
            "question": "大表等值查找更期望？",
            "options": [
              "全表扫描",
              "索引扫描",
              "删库",
              "笛卡尔积"
            ],
            "answer": 1,
            "explain": "Index Scan。"
          }
        ]
      }
    ]
  },
  {
    "slug": "mongo-intro",
    "title": "MongoDB 是什么",
    "summary": "文档、集合、BSON。",
    "level": "入门",
    "track": "MongoDB 入门",
    "minutes": 8,
    "official": "https://www.mongodb.com/docs/manual/introduction/",
    "blocks": [
      {
        "type": "text",
        "title": "文档模型",
        "body": "MongoDB 存 BSON 文档（类 JSON）。集合 ≈ 表，文档 ≈ 行，但字段可以灵活、可嵌套数组与子文档。适合内容、日志、产品目录等半结构化数据。"
      },
      {
        "type": "code",
        "title": "第一条查询",
        "lang": "javascript",
        "code": "db.users.find({ city: \"Tokyo\" })"
      },
      {
        "type": "demo",
        "kind": "mongo-find",
        "title": "动手：查东京用户",
        "hint": "find 查询"
      },
      {
        "type": "quiz",
        "questions": [
          {
            "id": "mi1",
            "question": "MongoDB 基本存储单位？",
            "options": [
              "行固定 schema 仅表格",
              "BSON 文档",
              "仅 CSV",
              "仅图"
            ],
            "answer": 1,
            "explain": "文档。"
          },
          {
            "id": "mi2",
            "question": "集合类似 SQL 的？",
            "options": [
              "数据库集群",
              "表",
              "事务日志",
              "触发器"
            ],
            "answer": 1,
            "explain": "collection ≈ table。"
          }
        ]
      }
    ]
  },
  {
    "slug": "mongo-crud",
    "title": "MongoDB CRUD",
    "summary": "insert / find / update / delete。",
    "level": "入门",
    "track": "MongoDB 入门",
    "minutes": 12,
    "blocks": [
      {
        "type": "text",
        "title": "四大操作",
        "body": "insertOne / find / updateOne+$set / deleteMany。更新推荐操作符，避免整单替换踩坑。"
      },
      {
        "type": "code",
        "title": "写入与更新",
        "lang": "javascript",
        "code": "db.users.insertOne({ _id: 6, name: \"Frank\", city: \"Nagoya\", age: 31 })\n\ndb.users.updateOne(\n  { name: \"Alice\" },\n  { $set: { age: 29 } }\n)"
      },
      {
        "type": "code",
        "title": "删除",
        "lang": "javascript",
        "code": "db.orders.deleteMany({ status: \"cancelled\" })"
      },
      {
        "type": "demo",
        "kind": "mongo-crud",
        "title": "动手：更新年龄",
        "hint": "$set"
      },
      {
        "type": "quiz",
        "questions": [
          {
            "id": "mc1",
            "question": "局部更新字段用？",
            "options": [
              "$set",
              "$table",
              "UPDATE SQL only",
              "$drop"
            ],
            "answer": 0,
            "explain": "$set。"
          },
          {
            "id": "mc2",
            "question": "insertOne 返回？",
            "options": [
              "仅 true",
              "含 insertedId 等",
              "建表",
              "事务 id 必须"
            ],
            "answer": 1,
            "explain": "写入确认。"
          }
        ]
      }
    ]
  },
  {
    "slug": "mongo-query-ops",
    "title": "查询操作符",
    "summary": "$gt $in $or $regex。",
    "level": "入门",
    "track": "MongoDB 入门",
    "minutes": 10,
    "blocks": [
      {
        "type": "text",
        "title": "操作符",
        "body": "比较：$gt/$gte/$lt/$lte/$ne；集合：$in/$nin；逻辑：$and/$or；存在：$exists；正则：$regex。"
      },
      {
        "type": "code",
        "title": "示例",
        "lang": "javascript",
        "code": "db.products.find({\n  price: { $gte: 40 },\n  category: { $in: [\"Books\", \"Hardware\"] }\n})"
      },
      {
        "type": "demo",
        "kind": "mongo-ops",
        "title": "动手：价格过滤",
        "hint": "$gte"
      },
      {
        "type": "quiz",
        "questions": [
          {
            "id": "mo1",
            "question": "$gte 含义？",
            "options": [
              "小于",
              "大于等于",
              "正则",
              "存在"
            ],
            "answer": 1,
            "explain": ">="
          }
        ]
      }
    ]
  },
  {
    "slug": "mongo-embed-ref",
    "title": "内嵌 vs 引用",
    "summary": "建模两种策略。",
    "level": "入门",
    "track": "MongoDB 入门",
    "minutes": 11,
    "blocks": [
      {
        "type": "text",
        "title": "怎么建模",
        "body": "内嵌：读一单拿齐、事务边界小；引用：复用实体、避免文档过大。经验：一对少、一起读 → 内嵌；多对多、独立生命周期 → 引用。"
      },
      {
        "type": "code",
        "title": "订单内嵌明细",
        "lang": "javascript",
        "code": "{\n  _id: 1,\n  user_id: 1,\n  items: [{ product_id: 1, qty: 1, price: 89 }],\n  total: 89\n}"
      },
      {
        "type": "demo",
        "kind": "mongo-embed",
        "title": "动手：看订单文档",
        "hint": "嵌套 items"
      },
      {
        "type": "quiz",
        "questions": [
          {
            "id": "me1",
            "question": "总是内嵌数组？",
            "options": [
              "是",
              "否，需考虑增长与复用",
              "仅 SQL 能内嵌",
              "Mongo 禁止嵌套"
            ],
            "answer": 1,
            "explain": "有边界。"
          }
        ]
      }
    ]
  },
  {
    "slug": "mongo-aggregate",
    "title": "聚合管道",
    "summary": "$match $group $sort $project。",
    "level": "进阶",
    "track": "MongoDB 进阶",
    "minutes": 14,
    "blocks": [
      {
        "type": "text",
        "title": "Pipeline",
        "body": "文档依次流过阶段，像流水线。$match 过滤、$group 聚合、$sort 排序、$project 整形、$limit 截断。"
      },
      {
        "type": "code",
        "title": "按状态汇总",
        "lang": "javascript",
        "code": "db.orders.aggregate([\n  { $match: { status: { $in: [\"paid\", \"shipped\"] } } },\n  { $group: { _id: \"$status\", revenue: { $sum: \"$total\" }, n: { $sum: 1 } } },\n  { $sort: { revenue: -1 } }\n])"
      },
      {
        "type": "demo",
        "kind": "mongo-agg",
        "title": "动手：聚合收入",
        "hint": "$group"
      },
      {
        "type": "quiz",
        "questions": [
          {
            "id": "ag1",
            "question": "$group 的 _id？",
            "options": [
              "必须省略",
              "分组键",
              "仅时间",
              "固定为 1"
            ],
            "answer": 1,
            "explain": "分组维度。"
          },
          {
            "id": "ag2",
            "question": "管道顺序重要吗？",
            "options": [
              "不重要",
              "重要，$match 尽早",
              "只能 sort 第一",
              "禁止 limit"
            ],
            "answer": 1,
            "explain": "先过滤更省。"
          }
        ]
      }
    ]
  },
  {
    "slug": "mongo-indexes",
    "title": "MongoDB 索引",
    "summary": "单字段、复合、多键索引直觉。",
    "level": "进阶",
    "track": "MongoDB 进阶",
    "minutes": 9,
    "blocks": [
      {
        "type": "text",
        "title": "索引",
        "body": "createIndex({ city: 1 })。数组字段自动多键索引。复合索引同样有前缀规则。explain() 看是否 IXSCAN。"
      },
      {
        "type": "code",
        "title": "示意",
        "lang": "javascript",
        "code": "// db.users.createIndex({ city: 1, age: -1 })\ndb.users.find({ city: \"Tokyo\", age: { $gte: 25 } })"
      },
      {
        "type": "quiz",
        "questions": [
          {
            "id": "mx1",
            "question": "数组字段索引类型直觉？",
            "options": [
              "无法索引",
              "多键索引",
              "仅全文",
              "仅哈希"
            ],
            "answer": 1,
            "explain": "multikey。"
          }
        ]
      }
    ]
  },
  {
    "slug": "mongo-update-ops",
    "title": "更新操作符进阶",
    "summary": "$inc $push $unset。",
    "level": "进阶",
    "track": "MongoDB 进阶",
    "minutes": 9,
    "blocks": [
      {
        "type": "text",
        "title": "操作符",
        "body": "$inc 增减数值、$push 追加数组、$pull 移除、$unset 删字段。原子单文档更新是 Mongo 强项。"
      },
      {
        "type": "code",
        "title": "库存与标签",
        "lang": "javascript",
        "code": "db.products.updateOne(\n  { _id: 1 },\n  { $inc: { stock: -1 } }\n)\n\ndb.users.updateOne(\n  { name: \"Bob\" },\n  { $push: { tags: \"mentor\" } }\n)"
      },
      {
        "type": "demo",
        "kind": "mongo-update-ops",
        "title": "动手：$inc 库存",
        "hint": "stock - 1"
      },
      {
        "type": "quiz",
        "questions": [
          {
            "id": "uo1",
            "question": "$inc 用于？",
            "options": [
              "字符串拼接",
              "数值增减",
              "删库",
              "建集合"
            ],
            "answer": 1,
            "explain": "数值。"
          }
        ]
      }
    ]
  },
  {
    "slug": "mongo-schema-design",
    "title": "模式设计模式",
    "summary": "属性模式、桶模式、子集模式。",
    "level": "进阶",
    "track": "MongoDB 进阶",
    "minutes": 10,
    "blocks": [
      {
        "type": "text",
        "title": "常用模式",
        "body": "属性模式：把稀疏键变成 {k,v} 数组便于索引；桶模式：时序点合并到桶文档；子集：列表页只存摘要、详情另集合。"
      },
      {
        "type": "tip",
        "body": "没有银弹：以访问路径（query pattern）驱动建模，而不是先画 ER 再硬塞。"
      },
      {
        "type": "quiz",
        "questions": [
          {
            "id": "sd1",
            "question": "Mongo 建模更应围绕？",
            "options": [
              "仅 3NF",
              "访问路径 / 查询模式",
              "必须单表",
              "禁止冗余"
            ],
            "answer": 1,
            "explain": "query-driven。"
          }
        ]
      }
    ]
  },
  {
    "slug": "sql-vs-mongo",
    "title": "SQL vs MongoDB 选型",
    "summary": "何时用关系型，何时用文档型。",
    "level": "实战",
    "track": "对比与选型",
    "minutes": 10,
    "blocks": [
      {
        "type": "text",
        "title": "怎么选",
        "body": "强事务、复杂 JOIN、报表规范 → SQL（PostgreSQL）。灵活 schema、海量半结构化、水平扩展文档 → MongoDB。很多系统两者并用（多类型持久化）。"
      },
      {
        "type": "text",
        "title": "同一业务两种表意",
        "body": "关系型：orders 行 + order_items 行。文档型：orders 文档内嵌 items[]。读路径不同，一致性边界不同。"
      },
      {
        "type": "demo",
        "kind": "compare-model",
        "title": "对照：同一商店",
        "hint": "表 vs 文档"
      },
      {
        "type": "quiz",
        "questions": [
          {
            "id": "vs1",
            "question": "银行转账更偏向？",
            "options": [
              "纯缓存",
              "关系型 + 事务",
              "仅本地文件",
              "无持久化"
            ],
            "answer": 1,
            "explain": "ACID。"
          },
          {
            "id": "vs2",
            "question": "内容 CMS 多变字段？",
            "options": [
              "强制宽表",
              "文档模型常更合适",
              "不能用 DB",
              "只能 CSV"
            ],
            "answer": 1,
            "explain": "灵活 schema。"
          }
        ]
      }
    ]
  },
  {
    "slug": "cap-consistency",
    "title": "一致性与分布式直觉",
    "summary": "副本、最终一致、读写关注点。",
    "level": "实战",
    "track": "对比与选型",
    "minutes": 9,
    "blocks": [
      {
        "type": "text",
        "title": "副本",
        "body": "主从/副本集提高可用与读扩展。读从库可能略旧（最终一致）。金融写路径通常读主、写关注 majority。"
      },
      {
        "type": "quiz",
        "questions": [
          {
            "id": "cp1",
            "question": "读从库可能？",
            "options": [
              "永远最新",
              "读到略旧数据",
              "自动写",
              "无网络"
            ],
            "answer": 1,
            "explain": "复制延迟。"
          }
        ]
      }
    ]
  },
  {
    "slug": "migrations",
    "title": "迁移与版本化 schema",
    "summary": "SQL migration 与 Mongo 演进。",
    "level": "实战",
    "track": "工程实践",
    "minutes": 8,
    "blocks": [
      {
        "type": "text",
        "title": "迁移",
        "body": "SQL：Flyway/Liquibase/Prisma migrate 版本化 DDL。Mongo：虽灵活，仍要管理索引与字段演进，避免「隐形 schema 腐化」。"
      },
      {
        "type": "code",
        "title": "迁移文件命名直觉",
        "lang": "text",
        "code": "001_create_users.sql\n002_add_orders_status_index.sql"
      },
      {
        "type": "quiz",
        "questions": [
          {
            "id": "mg1",
            "question": "生产改表应？",
            "options": [
              "手工无记录",
              "可重复的版本化迁移",
              "删库重建每周一次",
              "只在聊天里说"
            ],
            "answer": 1,
            "explain": "migration。"
          }
        ]
      }
    ]
  },
  {
    "slug": "orm-odm",
    "title": "ORM / ODM 与原生查询",
    "summary": "Prisma、Drizzle、Mongoose 定位。",
    "level": "实战",
    "track": "工程实践",
    "minutes": 8,
    "blocks": [
      {
        "type": "text",
        "title": "抽象层",
        "body": "ORM/ODM 提升生产力，但复杂报表/窗口函数/聚合仍常回退原生 SQL 或 aggregate。理解生成的查询，避免 N+1。"
      },
      {
        "type": "quiz",
        "questions": [
          {
            "id": "orm1",
            "question": "N+1 问题？",
            "options": [
              "一次查完",
              "循环里反复查关联",
              "索引太多",
              "磁盘满"
            ],
            "answer": 1,
            "explain": "懒加载陷阱。"
          }
        ]
      }
    ]
  },
  {
    "slug": "backup-ops",
    "title": "备份与基本运维",
    "summary": "备份、恢复、监控指标。",
    "level": "实战",
    "track": "工程实践",
    "minutes": 7,
    "blocks": [
      {
        "type": "text",
        "title": "运维底线",
        "body": "定期备份 + 恢复演练；监控连接数、慢查询、复制延迟、磁盘；权限最小；变更窗口。"
      },
      {
        "type": "quiz",
        "questions": [
          {
            "id": "bk1",
            "question": "备份是否够？",
            "options": [
              "够",
              "还要验证能恢复",
              "从不备份",
              "只截图"
            ],
            "answer": 1,
            "explain": "restore test。"
          }
        ]
      }
    ]
  },
  {
    "slug": "capstone",
    "title": "毕业：双栈小项目清单",
    "summary": "用 SQL + Mongo 各做一个小服务。",
    "level": "实战",
    "track": "工程实践",
    "minutes": 10,
    "format": "course",
    "blocks": [
      {
        "type": "text",
        "title": "项目建议",
        "body": "1) PostgreSQL：用户/订单/商品 REST，含 JOIN 报表。2) MongoDB：带评论内嵌的文章 API + 聚合热门标签。3) 写一篇选型笔记：为什么这里用表/文档。"
      },
      {
        "type": "tip",
        "body": "做完工坊全部闯关 + 主修课掌握（测验≥80%）即可领取结业证明。"
      },
      {
        "type": "quiz",
        "questions": [
          {
            "id": "cap1",
            "question": "本站主修完成标准之一？",
            "options": [
              "只看视频",
              "测验掌握 + 工坊任务",
              "关注博主",
              "关闭电脑"
            ],
            "answer": 1,
            "explain": "动手检验。"
          }
        ]
      }
    ]
  },
  {
    "slug": "ref-postgres-types",
    "title": "知识卡：PostgreSQL 类型速览",
    "summary": "常用类型与 JSONB。",
    "level": "进阶",
    "track": "知识卡片",
    "format": "reference",
    "minutes": 6,
    "blocks": [
      {
        "type": "text",
        "title": "类型",
        "body": "int/bigint、numeric、text、bool、timestamptz、uuid、jsonb、array。jsonb 可建 GIN 索引，适合半结构化列。"
      },
      {
        "type": "code",
        "title": "jsonb 查询示意",
        "lang": "sql",
        "code": "-- SELECT data->>'email' FROM events WHERE data @> '{\"type\":\"signup\"}';"
      },
      {
        "type": "quiz",
        "questions": [
          {
            "id": "rf1",
            "question": "PostgreSQL 二进制 JSON？",
            "options": [
              "json only",
              "jsonb",
              "bson 表",
              "xml 强制"
            ],
            "answer": 1,
            "explain": "jsonb。"
          }
        ]
      }
    ]
  },
  {
    "slug": "ref-mongo-transactions",
    "title": "知识卡：Mongo 多文档事务",
    "summary": "会话与事务边界。",
    "level": "进阶",
    "track": "知识卡片",
    "format": "reference",
    "minutes": 6,
    "blocks": [
      {
        "type": "text",
        "title": "事务",
        "body": "副本集/分片上可开 multi-document transactions。有成本：优先用单文档原子性与合理内嵌。"
      },
      {
        "type": "quiz",
        "questions": [
          {
            "id": "rm1",
            "question": "Mongo 事务？",
            "options": [
              "完全不存在",
              "支持但优先单文档设计",
              "只能单机文件",
              "自动替代索引"
            ],
            "answer": 1,
            "explain": "支持但慎用。"
          }
        ]
      }
    ]
  }
];

export const TRACKS = [
  "SQL 入门",
  "SQL 进阶",
  "SQL 实战",
  "MongoDB 入门",
  "MongoDB 进阶",
  "对比与选型",
  "工程实践",
  "知识卡片",
] as const;

export function getLesson(slug: string): Lesson | undefined {
  return LESSONS.find((l) => l.slug === slug);
}

export function getLessonIndex(slug: string): number {
  return LESSONS.findIndex((l) => l.slug === slug);
}

export function getAdjacent(slug: string): {
  prev?: Lesson;
  next?: Lesson;
} {
  const i = getLessonIndex(slug);
  if (i < 0) return {};
  return {
    prev: i > 0 ? LESSONS[i - 1] : undefined,
    next: i < LESSONS.length - 1 ? LESSONS[i + 1] : undefined,
  };
}

export function getLessonsByTrack(track: Lesson["track"]) {
  return LESSONS.filter((l) => l.track === track);
}

export function getAllQuizQuestions(): Array<
  QuizQuestion & { lessonSlug: string; lessonTitle: string }
> {
  const out: Array<QuizQuestion & { lessonSlug: string; lessonTitle: string }> = [];
  for (const lesson of LESSONS) {
    for (const block of lesson.blocks) {
      if (block.type === "quiz") {
        for (const q of block.questions) {
          out.push({
            ...q,
            lessonSlug: lesson.slug,
            lessonTitle: lesson.title,
          });
        }
      }
    }
  }
  return out;
}

export function isCourseLesson(l: Lesson): boolean {
  if (l.format === "reference") return false;
  if (l.format === "course") return true;
  return l.track !== "知识卡片";
}

export function getCourseLessons(): Lesson[] {
  return LESSONS.filter(isCourseLesson);
}
