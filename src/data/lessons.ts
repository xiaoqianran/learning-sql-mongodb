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
    slug: "intro",
    title: "数据库与 SQL 是什么",
    summary: "关系型模型、表、行、列与 SQL 角色。",
    level: "入门",
    track: "SQL 入门",
    minutes: 12,
    official: "https://www.postgresql.org/docs/current/tutorial-sql.html",
    blocks: [
      {
        type: "text",
        title: "概念深讲",
        body: `几乎所有后端都会存数据。SQL 是操作关系型数据库（PostgreSQL、MySQL、SQLite）的标准语言；MongoDB 则是文档型（JSON-like）数据库。本站用同一套示例商店数据，双轨对照学习。

为什么这一节重要：关系型模型、表、行、列与 SQL 角色。不只是名词，而是后续所有实践的前提。学习时请同时抓住三件事：① 它解决什么问题；② 核心机制/API 是什么；③ 什么情况下不该用、常见坑是什么。`,
      },
      {
        type: "text",
        title: "机制与关键点",
        body: `围绕「数据库与 SQL 是什么」，建议你用下面清单自检是否真懂：
· 输入/前置条件是什么？
· 输出/副作用是什么？
· 与相邻概念如何区分？（容易混淆的一对一对比）
· 复杂度或性能上的直觉（是否 O(n)、是否阻塞、是否有状态）
· 在真实项目里通常放在哪一层（入口、中间件、数据层、UI、运维）？

把每个点用自己的话写进笔记；能讲给别人听，才算过关。`,
      },
      {
        type: "text",
        title: "补充要点 1",
        body: `表（table）≈ 电子表格；行（row）是一条记录；列（column）有类型与约束。主键（PRIMARY KEY）唯一标识一行；外键把表关联起来。`,
      },
      {
        type: "text",
        title: "实践步骤",
        body: `1. 只读官方/权威文档里与「数据库与 SQL 是什么」直接相关的一小节，不要发散。
2. 在本机或本站 Demo 里最小复现：只验证一个行为。
3. 故意制造一个错误（错参数、错顺序、错环境），观察报错信息。
4. 改对后再总结：「正确做法 / 错误做法 / 如何排查」三行笔记。
5. 做本节测验；错题收入错题本，隔天再测一次。`,
      },
      {
        type: "text",
        title: "踩坑与排障",
        body: `· 文档示例能跑、自己环境不能：先对齐版本与配置，再怀疑代码。
· 「好像懂了」但默写不出来：回去做最小复现，而不是再看一遍视频。
· 多个概念一起崩：二分法缩小范围（注释一半配置/代码）。
· 与「intro」相关的问题，优先查官方 FAQ 与 issue 里的 breaking change。
· 生产环境多一项：可观测性（日志/指标）和回滚策略。`,
      },
      {
        type: "text",
        title: "面试 / 复盘一问",
        body: `请用 90 秒回答：什么是数据库与 SQL 是什么？它解决什么问题？举一个你会在项目里使用（或拒绝使用）的场景，并说明取舍。

加分项：对比一个替代方案，并说出性能、复杂度或可维护性上的差异。`,
      },
      {
        type: "code",
        title: "对应源码",
        lang: "sql",
        code: `SELECT * FROM users LIMIT 3;`,
      },
      {
        type: "code",
        title: "自检清单（注释版）",
        lang: "text",
        code: `// [ ] 能用自己的话解释：数据库与 SQL 是什么
// [ ] 能默写最小示例
// [ ] 能说出 2 个踩坑
// [ ] 能在项目场景里决定用/不用`,
      },
      { type: "demo", kind: "sql-select-all", title: "动手：查出用户", hint: "运行示例查询，观察结果表" },
      {
        type: "tip",
        body: `先求「能复现 + 能讲清」，再求「背全 API」。本课 Demo 与测验就是你的验收标准。`,
      },
      {
        type: "quiz",
        questions: [
          {
            id: "intro-0b4b-1",
            question: "关于「数据库与 SQL 是什么」，最准确的理解是？",
            options: ["只需要记住名词即可", "要同时理解问题、机制、适用边界与常见坑", "与实践无关", "只能在考试中使用"],
            answer: 1,
            explain: "概念 + 机制 + 边界 + 排障，才是可迁移的掌握。",
          },
          {
            id: "intro-0b4b-2",
            question: "学习「数据库与 SQL 是什么」时，优先行动是？",
            options: ["一次看完所有周边主题", "最小复现一个行为，再扩展", "只收藏文档不动手", "跳过报错信息"],
            answer: 1,
            explain: "最小复现建立反馈回路。",
          },
          {
            id: "intro-0b4b-3",
            question: "遇到「示例能跑、自己环境不能」时，你应先？",
            options: ["重写整个项目", "对齐版本/配置并阅读完整报错", "忽略错误继续下一步", "删除全部依赖"],
            answer: 1,
            explain: "环境与版本是第一怀疑对象。",
          },
        ],
      },
    ],
  },
  {
    slug: "select-basics",
    title: "SELECT 基础",
    summary: "投影列、别名、LIMIT。",
    level: "入门",
    track: "SQL 入门",
    minutes: 12,
    blocks: [
      {
        type: "text",
        title: "概念深讲",
        body: `SELECT 后面是你要的列。用 AS 起别名。LIMIT 限制返回行数。

为什么这一节重要：投影列、别名、LIMIT。不只是名词，而是后续所有实践的前提。学习时请同时抓住三件事：① 它解决什么问题；② 核心机制/API 是什么；③ 什么情况下不该用、常见坑是什么。`,
      },
      {
        type: "text",
        title: "机制与关键点",
        body: `围绕「SELECT 基础」，建议你用下面清单自检是否真懂：
· 输入/前置条件是什么？
· 输出/副作用是什么？
· 与相邻概念如何区分？（容易混淆的一对一对比）
· 复杂度或性能上的直觉（是否 O(n)、是否阻塞、是否有状态）
· 在真实项目里通常放在哪一层（入口、中间件、数据层、UI、运维）？

把每个点用自己的话写进笔记；能讲给别人听，才算过关。`,
      },
      {
        type: "text",
        title: "实践步骤",
        body: `1. 只读官方/权威文档里与「SELECT 基础」直接相关的一小节，不要发散。
2. 在本机或本站 Demo 里最小复现：只验证一个行为。
3. 故意制造一个错误（错参数、错顺序、错环境），观察报错信息。
4. 改对后再总结：「正确做法 / 错误做法 / 如何排查」三行笔记。
5. 做本节测验；错题收入错题本，隔天再测一次。`,
      },
      {
        type: "text",
        title: "踩坑与排障",
        body: `· 文档示例能跑、自己环境不能：先对齐版本与配置，再怀疑代码。
· 「好像懂了」但默写不出来：回去做最小复现，而不是再看一遍视频。
· 多个概念一起崩：二分法缩小范围（注释一半配置/代码）。
· 与「select-basics」相关的问题，优先查官方 FAQ 与 issue 里的 breaking change。
· 生产环境多一项：可观测性（日志/指标）和回滚策略。`,
      },
      {
        type: "text",
        title: "面试 / 复盘一问",
        body: `请用 90 秒回答：什么是SELECT 基础？它解决什么问题？举一个你会在项目里使用（或拒绝使用）的场景，并说明取舍。

加分项：对比一个替代方案，并说出性能、复杂度或可维护性上的差异。`,
      },
      {
        type: "code",
        title: "对应源码",
        lang: "sql",
        code: `SELECT name AS user_name, city
FROM users
LIMIT 5;`,
      },
      {
        type: "code",
        title: "自检清单（注释版）",
        lang: "text",
        code: `// [ ] 能用自己的话解释：SELECT 基础
// [ ] 能默写最小示例
// [ ] 能说出 2 个踩坑
// [ ] 能在项目场景里决定用/不用`,
      },
      { type: "demo", kind: "sql-select-cols", title: "动手：选列", hint: "只查 name 与 city" },
      {
        type: "tip",
        body: `先求「能复现 + 能讲清」，再求「背全 API」。本课 Demo 与测验就是你的验收标准。`,
      },
      {
        type: "quiz",
        questions: [
          {
            id: "select-basics-1d4b-1",
            question: "关于「SELECT 基础」，最准确的理解是？",
            options: ["只需要记住名词即可", "要同时理解问题、机制、适用边界与常见坑", "与实践无关", "只能在考试中使用"],
            answer: 1,
            explain: "概念 + 机制 + 边界 + 排障，才是可迁移的掌握。",
          },
          {
            id: "select-basics-1d4b-2",
            question: "学习「SELECT 基础」时，优先行动是？",
            options: ["一次看完所有周边主题", "最小复现一个行为，再扩展", "只收藏文档不动手", "跳过报错信息"],
            answer: 1,
            explain: "最小复现建立反馈回路。",
          },
          {
            id: "select-basics-1d4b-3",
            question: "遇到「示例能跑、自己环境不能」时，你应先？",
            options: ["重写整个项目", "对齐版本/配置并阅读完整报错", "忽略错误继续下一步", "删除全部依赖"],
            answer: 1,
            explain: "环境与版本是第一怀疑对象。",
          },
        ],
      },
    ],
  },
  {
    slug: "where-filter",
    title: "WHERE 过滤",
    summary: "比较、AND/OR、IN、LIKE、NULL。",
    level: "入门",
    track: "SQL 入门",
    minutes: 12,
    blocks: [
      {
        type: "text",
        title: "概念深讲",
        body: `WHERE 在 FROM 之后筛选行。注意：NULL 不能用 = 判断，要用 IS NULL / IS NOT NULL。

为什么这一节重要：比较、AND/OR、IN、LIKE、NULL。不只是名词，而是后续所有实践的前提。学习时请同时抓住三件事：① 它解决什么问题；② 核心机制/API 是什么；③ 什么情况下不该用、常见坑是什么。`,
      },
      {
        type: "text",
        title: "机制与关键点",
        body: `围绕「WHERE 过滤」，建议你用下面清单自检是否真懂：
· 输入/前置条件是什么？
· 输出/副作用是什么？
· 与相邻概念如何区分？（容易混淆的一对一对比）
· 复杂度或性能上的直觉（是否 O(n)、是否阻塞、是否有状态）
· 在真实项目里通常放在哪一层（入口、中间件、数据层、UI、运维）？

把每个点用自己的话写进笔记；能讲给别人听，才算过关。`,
      },
      {
        type: "text",
        title: "实践步骤",
        body: `1. 只读官方/权威文档里与「WHERE 过滤」直接相关的一小节，不要发散。
2. 在本机或本站 Demo 里最小复现：只验证一个行为。
3. 故意制造一个错误（错参数、错顺序、错环境），观察报错信息。
4. 改对后再总结：「正确做法 / 错误做法 / 如何排查」三行笔记。
5. 做本节测验；错题收入错题本，隔天再测一次。`,
      },
      {
        type: "text",
        title: "踩坑与排障",
        body: `· 文档示例能跑、自己环境不能：先对齐版本与配置，再怀疑代码。
· 「好像懂了」但默写不出来：回去做最小复现，而不是再看一遍视频。
· 多个概念一起崩：二分法缩小范围（注释一半配置/代码）。
· 与「where-filter」相关的问题，优先查官方 FAQ 与 issue 里的 breaking change。
· 生产环境多一项：可观测性（日志/指标）和回滚策略。`,
      },
      {
        type: "text",
        title: "面试 / 复盘一问",
        body: `请用 90 秒回答：什么是WHERE 过滤？它解决什么问题？举一个你会在项目里使用（或拒绝使用）的场景，并说明取舍。

加分项：对比一个替代方案，并说出性能、复杂度或可维护性上的差异。`,
      },
      {
        type: "code",
        title: "对应源码",
        lang: "sql",
        code: `SELECT name, age, city
FROM users
WHERE city = 'Tokyo' AND age >= 25;`,
      },
      {
        type: "code",
        title: "示例代码 2",
        lang: "sql",
        code: `SELECT * FROM products
WHERE category IN ('Books', 'Hardware')
  AND name LIKE '%SQL%';`,
      },
      { type: "demo", kind: "sql-where", title: "动手：过滤东京用户", hint: "WHERE city = 'Tokyo'" },
      {
        type: "tip",
        body: `先求「能复现 + 能讲清」，再求「背全 API」。本课 Demo 与测验就是你的验收标准。`,
      },
      {
        type: "quiz",
        questions: [
          {
            id: "where-filter-5e1d-1",
            question: "关于「WHERE 过滤」，最准确的理解是？",
            options: ["只需要记住名词即可", "要同时理解问题、机制、适用边界与常见坑", "与实践无关", "只能在考试中使用"],
            answer: 1,
            explain: "概念 + 机制 + 边界 + 排障，才是可迁移的掌握。",
          },
          {
            id: "where-filter-5e1d-2",
            question: "学习「WHERE 过滤」时，优先行动是？",
            options: ["一次看完所有周边主题", "最小复现一个行为，再扩展", "只收藏文档不动手", "跳过报错信息"],
            answer: 1,
            explain: "最小复现建立反馈回路。",
          },
          {
            id: "where-filter-5e1d-3",
            question: "遇到「示例能跑、自己环境不能」时，你应先？",
            options: ["重写整个项目", "对齐版本/配置并阅读完整报错", "忽略错误继续下一步", "删除全部依赖"],
            answer: 1,
            explain: "环境与版本是第一怀疑对象。",
          },
        ],
      },
    ],
  },
  {
    slug: "order-limit",
    title: "ORDER BY 与分页思维",
    summary: "排序、稳定分页思路。",
    level: "入门",
    track: "SQL 入门",
    minutes: 12,
    blocks: [
      {
        type: "text",
        title: "概念深讲",
        body: `ORDER BY col ASC|DESC。多列排序从左到右。分页常用 LIMIT + OFFSET，但深分页更推荐键集分页。

为什么这一节重要：排序、稳定分页思路。不只是名词，而是后续所有实践的前提。学习时请同时抓住三件事：① 它解决什么问题；② 核心机制/API 是什么；③ 什么情况下不该用、常见坑是什么。`,
      },
      {
        type: "text",
        title: "机制与关键点",
        body: `围绕「ORDER BY 与分页思维」，建议你用下面清单自检是否真懂：
· 输入/前置条件是什么？
· 输出/副作用是什么？
· 与相邻概念如何区分？（容易混淆的一对一对比）
· 复杂度或性能上的直觉（是否 O(n)、是否阻塞、是否有状态）
· 在真实项目里通常放在哪一层（入口、中间件、数据层、UI、运维）？

把每个点用自己的话写进笔记；能讲给别人听，才算过关。`,
      },
      {
        type: "text",
        title: "实践步骤",
        body: `1. 只读官方/权威文档里与「ORDER BY 与分页思维」直接相关的一小节，不要发散。
2. 在本机或本站 Demo 里最小复现：只验证一个行为。
3. 故意制造一个错误（错参数、错顺序、错环境），观察报错信息。
4. 改对后再总结：「正确做法 / 错误做法 / 如何排查」三行笔记。
5. 做本节测验；错题收入错题本，隔天再测一次。`,
      },
      {
        type: "text",
        title: "踩坑与排障",
        body: `· 文档示例能跑、自己环境不能：先对齐版本与配置，再怀疑代码。
· 「好像懂了」但默写不出来：回去做最小复现，而不是再看一遍视频。
· 多个概念一起崩：二分法缩小范围（注释一半配置/代码）。
· 与「order-limit」相关的问题，优先查官方 FAQ 与 issue 里的 breaking change。
· 生产环境多一项：可观测性（日志/指标）和回滚策略。`,
      },
      {
        type: "text",
        title: "面试 / 复盘一问",
        body: `请用 90 秒回答：什么是ORDER BY 与分页思维？它解决什么问题？举一个你会在项目里使用（或拒绝使用）的场景，并说明取舍。

加分项：对比一个替代方案，并说出性能、复杂度或可维护性上的差异。`,
      },
      {
        type: "code",
        title: "对应源码",
        lang: "sql",
        code: `SELECT name, price
FROM products
ORDER BY price DESC
LIMIT 3;`,
      },
      {
        type: "code",
        title: "自检清单（注释版）",
        lang: "text",
        code: `// [ ] 能用自己的话解释：ORDER BY 与分页思维
// [ ] 能默写最小示例
// [ ] 能说出 2 个踩坑
// [ ] 能在项目场景里决定用/不用`,
      },
      { type: "demo", kind: "sql-order", title: "动手：最贵商品", hint: "ORDER BY price DESC LIMIT 3" },
      {
        type: "tip",
        body: `先求「能复现 + 能讲清」，再求「背全 API」。本课 Demo 与测验就是你的验收标准。`,
      },
      {
        type: "quiz",
        questions: [
          {
            id: "order-limit-e9e1-1",
            question: "关于「ORDER BY 与分页思维」，最准确的理解是？",
            options: ["只需要记住名词即可", "要同时理解问题、机制、适用边界与常见坑", "与实践无关", "只能在考试中使用"],
            answer: 1,
            explain: "概念 + 机制 + 边界 + 排障，才是可迁移的掌握。",
          },
          {
            id: "order-limit-e9e1-2",
            question: "学习「ORDER BY 与分页思维」时，优先行动是？",
            options: ["一次看完所有周边主题", "最小复现一个行为，再扩展", "只收藏文档不动手", "跳过报错信息"],
            answer: 1,
            explain: "最小复现建立反馈回路。",
          },
          {
            id: "order-limit-e9e1-3",
            question: "遇到「示例能跑、自己环境不能」时，你应先？",
            options: ["重写整个项目", "对齐版本/配置并阅读完整报错", "忽略错误继续下一步", "删除全部依赖"],
            answer: 1,
            explain: "环境与版本是第一怀疑对象。",
          },
        ],
      },
    ],
  },
  {
    slug: "aggregates",
    title: "聚合：COUNT / SUM / AVG",
    summary: "GROUP BY 与聚合函数。",
    level: "入门",
    track: "SQL 入门",
    minutes: 12,
    blocks: [
      {
        type: "text",
        title: "概念深讲",
        body: `COUNT、SUM、AVG、MIN、MAX 把多行压成统计。GROUP BY 按维度分组；SELECT 中非聚合列必须出现在 GROUP BY。

为什么这一节重要：GROUP BY 与聚合函数。不只是名词，而是后续所有实践的前提。学习时请同时抓住三件事：① 它解决什么问题；② 核心机制/API 是什么；③ 什么情况下不该用、常见坑是什么。`,
      },
      {
        type: "text",
        title: "机制与关键点",
        body: `围绕「聚合：COUNT / SUM / AVG」，建议你用下面清单自检是否真懂：
· 输入/前置条件是什么？
· 输出/副作用是什么？
· 与相邻概念如何区分？（容易混淆的一对一对比）
· 复杂度或性能上的直觉（是否 O(n)、是否阻塞、是否有状态）
· 在真实项目里通常放在哪一层（入口、中间件、数据层、UI、运维）？

把每个点用自己的话写进笔记；能讲给别人听，才算过关。`,
      },
      {
        type: "text",
        title: "补充要点 1",
        body: `WHERE 在分组前过滤行；HAVING 在分组后过滤组（本教学引擎简化为先 WHERE）。`,
      },
      {
        type: "text",
        title: "实践步骤",
        body: `1. 只读官方/权威文档里与「聚合：COUNT / SUM / AVG」直接相关的一小节，不要发散。
2. 在本机或本站 Demo 里最小复现：只验证一个行为。
3. 故意制造一个错误（错参数、错顺序、错环境），观察报错信息。
4. 改对后再总结：「正确做法 / 错误做法 / 如何排查」三行笔记。
5. 做本节测验；错题收入错题本，隔天再测一次。`,
      },
      {
        type: "text",
        title: "踩坑与排障",
        body: `· 文档示例能跑、自己环境不能：先对齐版本与配置，再怀疑代码。
· 「好像懂了」但默写不出来：回去做最小复现，而不是再看一遍视频。
· 多个概念一起崩：二分法缩小范围（注释一半配置/代码）。
· 与「aggregates」相关的问题，优先查官方 FAQ 与 issue 里的 breaking change。
· 生产环境多一项：可观测性（日志/指标）和回滚策略。`,
      },
      {
        type: "text",
        title: "面试 / 复盘一问",
        body: `请用 90 秒回答：什么是聚合：COUNT / SUM / AVG？它解决什么问题？举一个你会在项目里使用（或拒绝使用）的场景，并说明取舍。

加分项：对比一个替代方案，并说出性能、复杂度或可维护性上的差异。`,
      },
      {
        type: "code",
        title: "对应源码",
        lang: "sql",
        code: `SELECT city, COUNT(*) AS cnt
FROM users
GROUP BY city
ORDER BY cnt DESC;`,
      },
      {
        type: "code",
        title: "示例代码 2",
        lang: "sql",
        code: `SELECT status, SUM(total) AS revenue
FROM orders
GROUP BY status;`,
      },
      { type: "demo", kind: "sql-group", title: "动手：城市人数", hint: "GROUP BY city" },
      {
        type: "tip",
        body: `先求「能复现 + 能讲清」，再求「背全 API」。本课 Demo 与测验就是你的验收标准。`,
      },
      {
        type: "quiz",
        questions: [
          {
            id: "aggregates-4671-1",
            question: "关于「聚合：COUNT / SUM / AVG」，最准确的理解是？",
            options: ["只需要记住名词即可", "要同时理解问题、机制、适用边界与常见坑", "与实践无关", "只能在考试中使用"],
            answer: 1,
            explain: "概念 + 机制 + 边界 + 排障，才是可迁移的掌握。",
          },
          {
            id: "aggregates-4671-2",
            question: "学习「聚合：COUNT / SUM / AVG」时，优先行动是？",
            options: ["一次看完所有周边主题", "最小复现一个行为，再扩展", "只收藏文档不动手", "跳过报错信息"],
            answer: 1,
            explain: "最小复现建立反馈回路。",
          },
          {
            id: "aggregates-4671-3",
            question: "遇到「示例能跑、自己环境不能」时，你应先？",
            options: ["重写整个项目", "对齐版本/配置并阅读完整报错", "忽略错误继续下一步", "删除全部依赖"],
            answer: 1,
            explain: "环境与版本是第一怀疑对象。",
          },
        ],
      },
    ],
  },
  {
    slug: "join-intro",
    title: "JOIN 联结表",
    summary: "INNER JOIN 与多表查询。",
    level: "入门",
    track: "SQL 入门",
    minutes: 12,
    blocks: [
      {
        type: "text",
        title: "概念深讲",
        body: `订单里只有 user_id，用户名在 users 表。JOIN 用键把表拼起来。INNER JOIN 只保留两侧都匹配的行。

为什么这一节重要：INNER JOIN 与多表查询。不只是名词，而是后续所有实践的前提。学习时请同时抓住三件事：① 它解决什么问题；② 核心机制/API 是什么；③ 什么情况下不该用、常见坑是什么。`,
      },
      {
        type: "text",
        title: "机制与关键点",
        body: `围绕「JOIN 联结表」，建议你用下面清单自检是否真懂：
· 输入/前置条件是什么？
· 输出/副作用是什么？
· 与相邻概念如何区分？（容易混淆的一对一对比）
· 复杂度或性能上的直觉（是否 O(n)、是否阻塞、是否有状态）
· 在真实项目里通常放在哪一层（入口、中间件、数据层、UI、运维）？

把每个点用自己的话写进笔记；能讲给别人听，才算过关。`,
      },
      {
        type: "text",
        title: "实践步骤",
        body: `1. 只读官方/权威文档里与「JOIN 联结表」直接相关的一小节，不要发散。
2. 在本机或本站 Demo 里最小复现：只验证一个行为。
3. 故意制造一个错误（错参数、错顺序、错环境），观察报错信息。
4. 改对后再总结：「正确做法 / 错误做法 / 如何排查」三行笔记。
5. 做本节测验；错题收入错题本，隔天再测一次。`,
      },
      {
        type: "text",
        title: "踩坑与排障",
        body: `· 文档示例能跑、自己环境不能：先对齐版本与配置，再怀疑代码。
· 「好像懂了」但默写不出来：回去做最小复现，而不是再看一遍视频。
· 多个概念一起崩：二分法缩小范围（注释一半配置/代码）。
· 与「join-intro」相关的问题，优先查官方 FAQ 与 issue 里的 breaking change。
· 生产环境多一项：可观测性（日志/指标）和回滚策略。`,
      },
      {
        type: "text",
        title: "面试 / 复盘一问",
        body: `请用 90 秒回答：什么是JOIN 联结表？它解决什么问题？举一个你会在项目里使用（或拒绝使用）的场景，并说明取舍。

加分项：对比一个替代方案，并说出性能、复杂度或可维护性上的差异。`,
      },
      {
        type: "code",
        title: "对应源码",
        lang: "sql",
        code: `SELECT o.id, u.name, o.total, o.status
FROM orders o
JOIN users u ON o.user_id = u.id;`,
      },
      {
        type: "code",
        title: "自检清单（注释版）",
        lang: "text",
        code: `// [ ] 能用自己的话解释：JOIN 联结表
// [ ] 能默写最小示例
// [ ] 能说出 2 个踩坑
// [ ] 能在项目场景里决定用/不用`,
      },
      { type: "demo", kind: "sql-join", title: "动手：订单 × 用户", hint: "JOIN users" },
      {
        type: "tip",
        body: `先求「能复现 + 能讲清」，再求「背全 API」。本课 Demo 与测验就是你的验收标准。`,
      },
      {
        type: "quiz",
        questions: [
          {
            id: "join-intro-c3b3-1",
            question: "关于「JOIN 联结表」，最准确的理解是？",
            options: ["只需要记住名词即可", "要同时理解问题、机制、适用边界与常见坑", "与实践无关", "只能在考试中使用"],
            answer: 1,
            explain: "概念 + 机制 + 边界 + 排障，才是可迁移的掌握。",
          },
          {
            id: "join-intro-c3b3-2",
            question: "学习「JOIN 联结表」时，优先行动是？",
            options: ["一次看完所有周边主题", "最小复现一个行为，再扩展", "只收藏文档不动手", "跳过报错信息"],
            answer: 1,
            explain: "最小复现建立反馈回路。",
          },
          {
            id: "join-intro-c3b3-3",
            question: "遇到「示例能跑、自己环境不能」时，你应先？",
            options: ["重写整个项目", "对齐版本/配置并阅读完整报错", "忽略错误继续下一步", "删除全部依赖"],
            answer: 1,
            explain: "环境与版本是第一怀疑对象。",
          },
        ],
      },
    ],
  },
  {
    slug: "left-join",
    title: "LEFT JOIN 与空值",
    summary: "保留左表、右侧可为 NULL。",
    level: "进阶",
    track: "SQL 进阶",
    minutes: 12,
    blocks: [
      {
        type: "text",
        title: "概念深讲",
        body: `左表每行都保留；右表无匹配时右侧列为 NULL。常用于「找出没有订单的用户」。

为什么这一节重要：保留左表、右侧可为 NULL。不只是名词，而是后续所有实践的前提。学习时请同时抓住三件事：① 它解决什么问题；② 核心机制/API 是什么；③ 什么情况下不该用、常见坑是什么。`,
      },
      {
        type: "text",
        title: "机制与关键点",
        body: `围绕「LEFT JOIN 与空值」，建议你用下面清单自检是否真懂：
· 输入/前置条件是什么？
· 输出/副作用是什么？
· 与相邻概念如何区分？（容易混淆的一对一对比）
· 复杂度或性能上的直觉（是否 O(n)、是否阻塞、是否有状态）
· 在真实项目里通常放在哪一层（入口、中间件、数据层、UI、运维）？

把每个点用自己的话写进笔记；能讲给别人听，才算过关。`,
      },
      {
        type: "text",
        title: "实践步骤",
        body: `1. 只读官方/权威文档里与「LEFT JOIN 与空值」直接相关的一小节，不要发散。
2. 在本机或本站 Demo 里最小复现：只验证一个行为。
3. 故意制造一个错误（错参数、错顺序、错环境），观察报错信息。
4. 改对后再总结：「正确做法 / 错误做法 / 如何排查」三行笔记。
5. 做本节测验；错题收入错题本，隔天再测一次。`,
      },
      {
        type: "text",
        title: "踩坑与排障",
        body: `· 文档示例能跑、自己环境不能：先对齐版本与配置，再怀疑代码。
· 「好像懂了」但默写不出来：回去做最小复现，而不是再看一遍视频。
· 多个概念一起崩：二分法缩小范围（注释一半配置/代码）。
· 与「left-join」相关的问题，优先查官方 FAQ 与 issue 里的 breaking change。
· 生产环境多一项：可观测性（日志/指标）和回滚策略。`,
      },
      {
        type: "text",
        title: "面试 / 复盘一问",
        body: `请用 90 秒回答：什么是LEFT JOIN 与空值？它解决什么问题？举一个你会在项目里使用（或拒绝使用）的场景，并说明取舍。

加分项：对比一个替代方案，并说出性能、复杂度或可维护性上的差异。`,
      },
      {
        type: "code",
        title: "对应源码",
        lang: "sql",
        code: `SELECT u.name, o.id AS order_id, o.total
FROM users u
LEFT JOIN orders o ON o.user_id = u.id;`,
      },
      {
        type: "code",
        title: "自检清单（注释版）",
        lang: "text",
        code: `// [ ] 能用自己的话解释：LEFT JOIN 与空值
// [ ] 能默写最小示例
// [ ] 能说出 2 个踩坑
// [ ] 能在项目场景里决定用/不用`,
      },
      { type: "demo", kind: "sql-left-join", title: "动手：LEFT JOIN", hint: "观察无订单用户" },
      {
        type: "tip",
        body: `先求「能复现 + 能讲清」，再求「背全 API」。本课 Demo 与测验就是你的验收标准。`,
      },
      {
        type: "quiz",
        questions: [
          {
            id: "left-join-e5ad-1",
            question: "关于「LEFT JOIN 与空值」，最准确的理解是？",
            options: ["只需要记住名词即可", "要同时理解问题、机制、适用边界与常见坑", "与实践无关", "只能在考试中使用"],
            answer: 1,
            explain: "概念 + 机制 + 边界 + 排障，才是可迁移的掌握。",
          },
          {
            id: "left-join-e5ad-2",
            question: "学习「LEFT JOIN 与空值」时，优先行动是？",
            options: ["一次看完所有周边主题", "最小复现一个行为，再扩展", "只收藏文档不动手", "跳过报错信息"],
            answer: 1,
            explain: "最小复现建立反馈回路。",
          },
          {
            id: "left-join-e5ad-3",
            question: "遇到「示例能跑、自己环境不能」时，你应先？",
            options: ["重写整个项目", "对齐版本/配置并阅读完整报错", "忽略错误继续下一步", "删除全部依赖"],
            answer: 1,
            explain: "环境与版本是第一怀疑对象。",
          },
        ],
      },
    ],
  },
  {
    slug: "subquery",
    title: "子查询",
    summary: "WHERE IN / 标量子查询思路。",
    level: "进阶",
    track: "SQL 进阶",
    minutes: 12,
    blocks: [
      {
        type: "text",
        title: "概念深讲",
        body: `查询里嵌查询。常见：WHERE col IN (SELECT ...)、FROM (SELECT ...) t。能写 JOIN 的往往更清晰，但子查询表达「集合条件」很直观。

为什么这一节重要：WHERE IN / 标量子查询思路。不只是名词，而是后续所有实践的前提。学习时请同时抓住三件事：① 它解决什么问题；② 核心机制/API 是什么；③ 什么情况下不该用、常见坑是什么。`,
      },
      {
        type: "text",
        title: "机制与关键点",
        body: `围绕「子查询」，建议你用下面清单自检是否真懂：
· 输入/前置条件是什么？
· 输出/副作用是什么？
· 与相邻概念如何区分？（容易混淆的一对一对比）
· 复杂度或性能上的直觉（是否 O(n)、是否阻塞、是否有状态）
· 在真实项目里通常放在哪一层（入口、中间件、数据层、UI、运维）？

把每个点用自己的话写进笔记；能讲给别人听，才算过关。`,
      },
      {
        type: "text",
        title: "实践步骤",
        body: `1. 只读官方/权威文档里与「子查询」直接相关的一小节，不要发散。
2. 在本机或本站 Demo 里最小复现：只验证一个行为。
3. 故意制造一个错误（错参数、错顺序、错环境），观察报错信息。
4. 改对后再总结：「正确做法 / 错误做法 / 如何排查」三行笔记。
5. 做本节测验；错题收入错题本，隔天再测一次。`,
      },
      {
        type: "text",
        title: "踩坑与排障",
        body: `· 文档示例能跑、自己环境不能：先对齐版本与配置，再怀疑代码。
· 「好像懂了」但默写不出来：回去做最小复现，而不是再看一遍视频。
· 多个概念一起崩：二分法缩小范围（注释一半配置/代码）。
· 与「subquery」相关的问题，优先查官方 FAQ 与 issue 里的 breaking change。
· 生产环境多一项：可观测性（日志/指标）和回滚策略。`,
      },
      {
        type: "text",
        title: "面试 / 复盘一问",
        body: `请用 90 秒回答：什么是子查询？它解决什么问题？举一个你会在项目里使用（或拒绝使用）的场景，并说明取舍。

加分项：对比一个替代方案，并说出性能、复杂度或可维护性上的差异。`,
      },
      {
        type: "code",
        title: "对应源码",
        lang: "sql",
        code: `SELECT name FROM users
WHERE id IN (
  SELECT user_id FROM orders WHERE status = 'paid'
);`,
      },
      {
        type: "code",
        title: "自检清单（注释版）",
        lang: "text",
        code: `// [ ] 能用自己的话解释：子查询
// [ ] 能默写最小示例
// [ ] 能说出 2 个踩坑
// [ ] 能在项目场景里决定用/不用`,
      },
      { type: "demo", kind: "sql-subquery", title: "动手：子查询", hint: "IN (SELECT ...)" },
      {
        type: "tip",
        body: `先求「能复现 + 能讲清」，再求「背全 API」。本课 Demo 与测验就是你的验收标准。`,
      },
      {
        type: "quiz",
        questions: [
          {
            id: "subquery-54e3-1",
            question: "关于「子查询」，最准确的理解是？",
            options: ["只需要记住名词即可", "要同时理解问题、机制、适用边界与常见坑", "与实践无关", "只能在考试中使用"],
            answer: 1,
            explain: "概念 + 机制 + 边界 + 排障，才是可迁移的掌握。",
          },
          {
            id: "subquery-54e3-2",
            question: "学习「子查询」时，优先行动是？",
            options: ["一次看完所有周边主题", "最小复现一个行为，再扩展", "只收藏文档不动手", "跳过报错信息"],
            answer: 1,
            explain: "最小复现建立反馈回路。",
          },
          {
            id: "subquery-54e3-3",
            question: "遇到「示例能跑、自己环境不能」时，你应先？",
            options: ["重写整个项目", "对齐版本/配置并阅读完整报错", "忽略错误继续下一步", "删除全部依赖"],
            answer: 1,
            explain: "环境与版本是第一怀疑对象。",
          },
        ],
      },
    ],
  },
  {
    slug: "insert-update-delete",
    title: "INSERT / UPDATE / DELETE",
    summary: "DML 写操作。",
    level: "进阶",
    track: "SQL 进阶",
    minutes: 12,
    blocks: [
      {
        type: "text",
        title: "概念深讲",
        body: `INSERT 插入、UPDATE 修改、DELETE 删除。没有 WHERE 的 UPDATE/DELETE 会动整表——生产极危险。

为什么这一节重要：DML 写操作。不只是名词，而是后续所有实践的前提。学习时请同时抓住三件事：① 它解决什么问题；② 核心机制/API 是什么；③ 什么情况下不该用、常见坑是什么。`,
      },
      {
        type: "text",
        title: "机制与关键点",
        body: `围绕「INSERT / UPDATE / DELETE」，建议你用下面清单自检是否真懂：
· 输入/前置条件是什么？
· 输出/副作用是什么？
· 与相邻概念如何区分？（容易混淆的一对一对比）
· 复杂度或性能上的直觉（是否 O(n)、是否阻塞、是否有状态）
· 在真实项目里通常放在哪一层（入口、中间件、数据层、UI、运维）？

把每个点用自己的话写进笔记；能讲给别人听，才算过关。`,
      },
      {
        type: "text",
        title: "实践步骤",
        body: `1. 只读官方/权威文档里与「INSERT / UPDATE / DELETE」直接相关的一小节，不要发散。
2. 在本机或本站 Demo 里最小复现：只验证一个行为。
3. 故意制造一个错误（错参数、错顺序、错环境），观察报错信息。
4. 改对后再总结：「正确做法 / 错误做法 / 如何排查」三行笔记。
5. 做本节测验；错题收入错题本，隔天再测一次。`,
      },
      {
        type: "text",
        title: "踩坑与排障",
        body: `· 文档示例能跑、自己环境不能：先对齐版本与配置，再怀疑代码。
· 「好像懂了」但默写不出来：回去做最小复现，而不是再看一遍视频。
· 多个概念一起崩：二分法缩小范围（注释一半配置/代码）。
· 与「insert-update-delete」相关的问题，优先查官方 FAQ 与 issue 里的 breaking change。
· 生产环境多一项：可观测性（日志/指标）和回滚策略。`,
      },
      {
        type: "text",
        title: "面试 / 复盘一问",
        body: `请用 90 秒回答：什么是INSERT / UPDATE / DELETE？它解决什么问题？举一个你会在项目里使用（或拒绝使用）的场景，并说明取舍。

加分项：对比一个替代方案，并说出性能、复杂度或可维护性上的差异。`,
      },
      {
        type: "code",
        title: "对应源码",
        lang: "sql",
        code: `INSERT INTO users (id, name, email, city, age)
VALUES (6, 'Frank', 'frank@mail.com', 'Nagoya', 31);`,
      },
      {
        type: "code",
        title: "示例代码 2",
        lang: "sql",
        code: `UPDATE products SET stock = 100 WHERE id = 2;
DELETE FROM orders WHERE status = 'cancelled';`,
      },
      { type: "demo", kind: "sql-dml", title: "动手：改库存", hint: "UPDATE products" },
      {
        type: "tip",
        body: `先求「能复现 + 能讲清」，再求「背全 API」。本课 Demo 与测验就是你的验收标准。`,
      },
      {
        type: "quiz",
        questions: [
          {
            id: "insert-update-delete-be98-1",
            question: "关于「INSERT / UPDATE / DELETE」，最准确的理解是？",
            options: ["只需要记住名词即可", "要同时理解问题、机制、适用边界与常见坑", "与实践无关", "只能在考试中使用"],
            answer: 1,
            explain: "概念 + 机制 + 边界 + 排障，才是可迁移的掌握。",
          },
          {
            id: "insert-update-delete-be98-2",
            question: "学习「INSERT / UPDATE / DELETE」时，优先行动是？",
            options: ["一次看完所有周边主题", "最小复现一个行为，再扩展", "只收藏文档不动手", "跳过报错信息"],
            answer: 1,
            explain: "最小复现建立反馈回路。",
          },
          {
            id: "insert-update-delete-be98-3",
            question: "遇到「示例能跑、自己环境不能」时，你应先？",
            options: ["重写整个项目", "对齐版本/配置并阅读完整报错", "忽略错误继续下一步", "删除全部依赖"],
            answer: 1,
            explain: "环境与版本是第一怀疑对象。",
          },
        ],
      },
    ],
  },
  {
    slug: "create-table",
    title: "CREATE TABLE 与类型",
    summary: "建表、主键思路。",
    level: "进阶",
    track: "SQL 进阶",
    minutes: 12,
    blocks: [
      {
        type: "text",
        title: "概念深讲",
        body: `CREATE TABLE 定义结构。类型：INT、TEXT/VARCHAR、BOOLEAN、TIMESTAMP… 约束：PRIMARY KEY、NOT NULL、UNIQUE。

为什么这一节重要：建表、主键思路。不只是名词，而是后续所有实践的前提。学习时请同时抓住三件事：① 它解决什么问题；② 核心机制/API 是什么；③ 什么情况下不该用、常见坑是什么。`,
      },
      {
        type: "text",
        title: "机制与关键点",
        body: `围绕「CREATE TABLE 与类型」，建议你用下面清单自检是否真懂：
· 输入/前置条件是什么？
· 输出/副作用是什么？
· 与相邻概念如何区分？（容易混淆的一对一对比）
· 复杂度或性能上的直觉（是否 O(n)、是否阻塞、是否有状态）
· 在真实项目里通常放在哪一层（入口、中间件、数据层、UI、运维）？

把每个点用自己的话写进笔记；能讲给别人听，才算过关。`,
      },
      {
        type: "text",
        title: "实践步骤",
        body: `1. 只读官方/权威文档里与「CREATE TABLE 与类型」直接相关的一小节，不要发散。
2. 在本机或本站 Demo 里最小复现：只验证一个行为。
3. 故意制造一个错误（错参数、错顺序、错环境），观察报错信息。
4. 改对后再总结：「正确做法 / 错误做法 / 如何排查」三行笔记。
5. 做本节测验；错题收入错题本，隔天再测一次。`,
      },
      {
        type: "text",
        title: "踩坑与排障",
        body: `· 文档示例能跑、自己环境不能：先对齐版本与配置，再怀疑代码。
· 「好像懂了」但默写不出来：回去做最小复现，而不是再看一遍视频。
· 多个概念一起崩：二分法缩小范围（注释一半配置/代码）。
· 与「create-table」相关的问题，优先查官方 FAQ 与 issue 里的 breaking change。
· 生产环境多一项：可观测性（日志/指标）和回滚策略。`,
      },
      {
        type: "text",
        title: "面试 / 复盘一问",
        body: `请用 90 秒回答：什么是CREATE TABLE 与类型？它解决什么问题？举一个你会在项目里使用（或拒绝使用）的场景，并说明取舍。

加分项：对比一个替代方案，并说出性能、复杂度或可维护性上的差异。`,
      },
      {
        type: "code",
        title: "对应源码",
        lang: "sql",
        code: `CREATE TABLE reviews (
  id INT,
  product_id INT,
  rating INT,
  body TEXT
);`,
      },
      {
        type: "code",
        title: "自检清单（注释版）",
        lang: "text",
        code: `// [ ] 能用自己的话解释：CREATE TABLE 与类型
// [ ] 能默写最小示例
// [ ] 能说出 2 个踩坑
// [ ] 能在项目场景里决定用/不用`,
      },
      { type: "demo", kind: "sql-create", title: "动手：建表", hint: "CREATE TABLE" },
      {
        type: "tip",
        body: `先求「能复现 + 能讲清」，再求「背全 API」。本课 Demo 与测验就是你的验收标准。`,
      },
      {
        type: "quiz",
        questions: [
          {
            id: "create-table-ddb8-1",
            question: "关于「CREATE TABLE 与类型」，最准确的理解是？",
            options: ["只需要记住名词即可", "要同时理解问题、机制、适用边界与常见坑", "与实践无关", "只能在考试中使用"],
            answer: 1,
            explain: "概念 + 机制 + 边界 + 排障，才是可迁移的掌握。",
          },
          {
            id: "create-table-ddb8-2",
            question: "学习「CREATE TABLE 与类型」时，优先行动是？",
            options: ["一次看完所有周边主题", "最小复现一个行为，再扩展", "只收藏文档不动手", "跳过报错信息"],
            answer: 1,
            explain: "最小复现建立反馈回路。",
          },
          {
            id: "create-table-ddb8-3",
            question: "遇到「示例能跑、自己环境不能」时，你应先？",
            options: ["重写整个项目", "对齐版本/配置并阅读完整报错", "忽略错误继续下一步", "删除全部依赖"],
            answer: 1,
            explain: "环境与版本是第一怀疑对象。",
          },
        ],
      },
    ],
  },
  {
    slug: "indexes",
    title: "索引入门",
    summary: "B-Tree 直觉、何时建索引。",
    level: "进阶",
    track: "SQL 进阶",
    minutes: 12,
    blocks: [
      {
        type: "text",
        title: "概念深讲",
        body: `索引像书的目录：加速 WHERE / JOIN / ORDER BY，但拖慢写入并占空间。先对高频过滤列、外键列建索引。

为什么这一节重要：B-Tree 直觉、何时建索引。不只是名词，而是后续所有实践的前提。学习时请同时抓住三件事：① 它解决什么问题；② 核心机制/API 是什么；③ 什么情况下不该用、常见坑是什么。`,
      },
      {
        type: "text",
        title: "机制与关键点",
        body: `围绕「索引入门」，建议你用下面清单自检是否真懂：
· 输入/前置条件是什么？
· 输出/副作用是什么？
· 与相邻概念如何区分？（容易混淆的一对一对比）
· 复杂度或性能上的直觉（是否 O(n)、是否阻塞、是否有状态）
· 在真实项目里通常放在哪一层（入口、中间件、数据层、UI、运维）？

把每个点用自己的话写进笔记；能讲给别人听，才算过关。`,
      },
      {
        type: "text",
        title: "实践步骤",
        body: `1. 只读官方/权威文档里与「索引入门」直接相关的一小节，不要发散。
2. 在本机或本站 Demo 里最小复现：只验证一个行为。
3. 故意制造一个错误（错参数、错顺序、错环境），观察报错信息。
4. 改对后再总结：「正确做法 / 错误做法 / 如何排查」三行笔记。
5. 做本节测验；错题收入错题本，隔天再测一次。`,
      },
      {
        type: "text",
        title: "踩坑与排障",
        body: `· 文档示例能跑、自己环境不能：先对齐版本与配置，再怀疑代码。
· 「好像懂了」但默写不出来：回去做最小复现，而不是再看一遍视频。
· 多个概念一起崩：二分法缩小范围（注释一半配置/代码）。
· 与「indexes」相关的问题，优先查官方 FAQ 与 issue 里的 breaking change。
· 生产环境多一项：可观测性（日志/指标）和回滚策略。`,
      },
      {
        type: "text",
        title: "面试 / 复盘一问",
        body: `请用 90 秒回答：什么是索引入门？它解决什么问题？举一个你会在项目里使用（或拒绝使用）的场景，并说明取舍。

加分项：对比一个替代方案，并说出性能、复杂度或可维护性上的差异。`,
      },
      {
        type: "code",
        title: "对应源码",
        lang: "sql",
        code: `-- 教学环境不执行物理索引，理解语义即可
-- CREATE INDEX idx_orders_user ON orders(user_id);
SELECT * FROM orders WHERE user_id = 1;`,
      },
      {
        type: "code",
        title: "自检清单（注释版）",
        lang: "text",
        code: `// [ ] 能用自己的话解释：索引入门
// [ ] 能默写最小示例
// [ ] 能说出 2 个踩坑
// [ ] 能在项目场景里决定用/不用`,
      },
      {
        type: "tip",
        body: `先求「能复现 + 能讲清」，再求「背全 API」。本课 Demo 与测验就是你的验收标准。`,
      },
      {
        type: "quiz",
        questions: [
          {
            id: "indexes-6269-1",
            question: "关于「索引入门」，最准确的理解是？",
            options: ["只需要记住名词即可", "要同时理解问题、机制、适用边界与常见坑", "与实践无关", "只能在考试中使用"],
            answer: 1,
            explain: "概念 + 机制 + 边界 + 排障，才是可迁移的掌握。",
          },
          {
            id: "indexes-6269-2",
            question: "学习「索引入门」时，优先行动是？",
            options: ["一次看完所有周边主题", "最小复现一个行为，再扩展", "只收藏文档不动手", "跳过报错信息"],
            answer: 1,
            explain: "最小复现建立反馈回路。",
          },
          {
            id: "indexes-6269-3",
            question: "遇到「示例能跑、自己环境不能」时，你应先？",
            options: ["重写整个项目", "对齐版本/配置并阅读完整报错", "忽略错误继续下一步", "删除全部依赖"],
            answer: 1,
            explain: "环境与版本是第一怀疑对象。",
          },
        ],
      },
    ],
  },
  {
    slug: "transactions",
    title: "事务 ACID",
    summary: "原子性、一致性、隔离、持久。",
    level: "进阶",
    track: "SQL 进阶",
    minutes: 12,
    blocks: [
      {
        type: "text",
        title: "概念深讲",
        body: `BEGIN → 多条语句 → COMMIT 或 ROLLBACK。转账：扣款+入账必须同进同退。隔离级别影响脏读/不可重复读/幻读。

为什么这一节重要：原子性、一致性、隔离、持久。不只是名词，而是后续所有实践的前提。学习时请同时抓住三件事：① 它解决什么问题；② 核心机制/API 是什么；③ 什么情况下不该用、常见坑是什么。`,
      },
      {
        type: "text",
        title: "机制与关键点",
        body: `围绕「事务 ACID」，建议你用下面清单自检是否真懂：
· 输入/前置条件是什么？
· 输出/副作用是什么？
· 与相邻概念如何区分？（容易混淆的一对一对比）
· 复杂度或性能上的直觉（是否 O(n)、是否阻塞、是否有状态）
· 在真实项目里通常放在哪一层（入口、中间件、数据层、UI、运维）？

把每个点用自己的话写进笔记；能讲给别人听，才算过关。`,
      },
      {
        type: "text",
        title: "实践步骤",
        body: `1. 只读官方/权威文档里与「事务 ACID」直接相关的一小节，不要发散。
2. 在本机或本站 Demo 里最小复现：只验证一个行为。
3. 故意制造一个错误（错参数、错顺序、错环境），观察报错信息。
4. 改对后再总结：「正确做法 / 错误做法 / 如何排查」三行笔记。
5. 做本节测验；错题收入错题本，隔天再测一次。`,
      },
      {
        type: "text",
        title: "踩坑与排障",
        body: `· 文档示例能跑、自己环境不能：先对齐版本与配置，再怀疑代码。
· 「好像懂了」但默写不出来：回去做最小复现，而不是再看一遍视频。
· 多个概念一起崩：二分法缩小范围（注释一半配置/代码）。
· 与「transactions」相关的问题，优先查官方 FAQ 与 issue 里的 breaking change。
· 生产环境多一项：可观测性（日志/指标）和回滚策略。`,
      },
      {
        type: "text",
        title: "面试 / 复盘一问",
        body: `请用 90 秒回答：什么是事务 ACID？它解决什么问题？举一个你会在项目里使用（或拒绝使用）的场景，并说明取舍。

加分项：对比一个替代方案，并说出性能、复杂度或可维护性上的差异。`,
      },
      {
        type: "code",
        title: "对应源码",
        lang: "sql",
        code: `-- BEGIN;
-- UPDATE accounts SET bal = bal - 100 WHERE id = 1;
-- UPDATE accounts SET bal = bal + 100 WHERE id = 2;
-- COMMIT;`,
      },
      {
        type: "code",
        title: "自检清单（注释版）",
        lang: "text",
        code: `// [ ] 能用自己的话解释：事务 ACID
// [ ] 能默写最小示例
// [ ] 能说出 2 个踩坑
// [ ] 能在项目场景里决定用/不用`,
      },
      {
        type: "tip",
        body: `先求「能复现 + 能讲清」，再求「背全 API」。本课 Demo 与测验就是你的验收标准。`,
      },
      {
        type: "quiz",
        questions: [
          {
            id: "transactions-c15b-1",
            question: "关于「事务 ACID」，最准确的理解是？",
            options: ["只需要记住名词即可", "要同时理解问题、机制、适用边界与常见坑", "与实践无关", "只能在考试中使用"],
            answer: 1,
            explain: "概念 + 机制 + 边界 + 排障，才是可迁移的掌握。",
          },
          {
            id: "transactions-c15b-2",
            question: "学习「事务 ACID」时，优先行动是？",
            options: ["一次看完所有周边主题", "最小复现一个行为，再扩展", "只收藏文档不动手", "跳过报错信息"],
            answer: 1,
            explain: "最小复现建立反馈回路。",
          },
          {
            id: "transactions-c15b-3",
            question: "遇到「示例能跑、自己环境不能」时，你应先？",
            options: ["重写整个项目", "对齐版本/配置并阅读完整报错", "忽略错误继续下一步", "删除全部依赖"],
            answer: 1,
            explain: "环境与版本是第一怀疑对象。",
          },
        ],
      },
    ],
  },
  {
    slug: "normalization",
    title: "范式与建模直觉",
    summary: "1NF/2NF/3NF 与适度反范式。",
    level: "进阶",
    track: "SQL 进阶",
    minutes: 12,
    blocks: [
      {
        type: "text",
        title: "概念深讲",
        body: `减少冗余与更新异常：一格一值、消除部分依赖与传递依赖。分析场景可适度反范式（冗余加速读）。

为什么这一节重要：1NF/2NF/3NF 与适度反范式。不只是名词，而是后续所有实践的前提。学习时请同时抓住三件事：① 它解决什么问题；② 核心机制/API 是什么；③ 什么情况下不该用、常见坑是什么。`,
      },
      {
        type: "text",
        title: "机制与关键点",
        body: `围绕「范式与建模直觉」，建议你用下面清单自检是否真懂：
· 输入/前置条件是什么？
· 输出/副作用是什么？
· 与相邻概念如何区分？（容易混淆的一对一对比）
· 复杂度或性能上的直觉（是否 O(n)、是否阻塞、是否有状态）
· 在真实项目里通常放在哪一层（入口、中间件、数据层、UI、运维）？

把每个点用自己的话写进笔记；能讲给别人听，才算过关。`,
      },
      {
        type: "text",
        title: "补充要点 1",
        body: `不要把用户邮箱重复写在每一行订单里当唯一真相；用 user_id 关联。报表库可以冗余快照字段。`,
      },
      {
        type: "text",
        title: "实践步骤",
        body: `1. 只读官方/权威文档里与「范式与建模直觉」直接相关的一小节，不要发散。
2. 在本机或本站 Demo 里最小复现：只验证一个行为。
3. 故意制造一个错误（错参数、错顺序、错环境），观察报错信息。
4. 改对后再总结：「正确做法 / 错误做法 / 如何排查」三行笔记。
5. 做本节测验；错题收入错题本，隔天再测一次。`,
      },
      {
        type: "text",
        title: "踩坑与排障",
        body: `· 文档示例能跑、自己环境不能：先对齐版本与配置，再怀疑代码。
· 「好像懂了」但默写不出来：回去做最小复现，而不是再看一遍视频。
· 多个概念一起崩：二分法缩小范围（注释一半配置/代码）。
· 与「normalization」相关的问题，优先查官方 FAQ 与 issue 里的 breaking change。
· 生产环境多一项：可观测性（日志/指标）和回滚策略。`,
      },
      {
        type: "text",
        title: "面试 / 复盘一问",
        body: `请用 90 秒回答：什么是范式与建模直觉？它解决什么问题？举一个你会在项目里使用（或拒绝使用）的场景，并说明取舍。

加分项：对比一个替代方案，并说出性能、复杂度或可维护性上的差异。`,
      },
      {
        type: "code",
        title: "示例 SQL",
        lang: "sql",
        code: `-- 范式与建模直觉
-- 请在工坊/本地执行并观察结果
SELECT 1 AS ok; -- 占位：结合本课主题改写`,
      },
      {
        type: "code",
        title: "自检清单（注释版）",
        lang: "text",
        code: `// [ ] 能用自己的话解释：范式与建模直觉
// [ ] 能默写最小示例
// [ ] 能说出 2 个踩坑
// [ ] 能在项目场景里决定用/不用`,
      },
      {
        type: "tip",
        body: `先求「能复现 + 能讲清」，再求「背全 API」。本课 Demo 与测验就是你的验收标准。`,
      },
      {
        type: "quiz",
        questions: [
          {
            id: "normalization-1da3-1",
            question: "关于「范式与建模直觉」，最准确的理解是？",
            options: ["只需要记住名词即可", "要同时理解问题、机制、适用边界与常见坑", "与实践无关", "只能在考试中使用"],
            answer: 1,
            explain: "概念 + 机制 + 边界 + 排障，才是可迁移的掌握。",
          },
          {
            id: "normalization-1da3-2",
            question: "学习「范式与建模直觉」时，优先行动是？",
            options: ["一次看完所有周边主题", "最小复现一个行为，再扩展", "只收藏文档不动手", "跳过报错信息"],
            answer: 1,
            explain: "最小复现建立反馈回路。",
          },
          {
            id: "normalization-1da3-3",
            question: "遇到「示例能跑、自己环境不能」时，你应先？",
            options: ["重写整个项目", "对齐版本/配置并阅读完整报错", "忽略错误继续下一步", "删除全部依赖"],
            answer: 1,
            explain: "环境与版本是第一怀疑对象。",
          },
        ],
      },
    ],
  },
  {
    slug: "sql-shop-queries",
    title: "实战：商店分析查询",
    summary: "组合 JOIN + 聚合解决业务问题。",
    level: "实战",
    track: "SQL 实战",
    minutes: 12,
    blocks: [
      {
        type: "text",
        title: "概念深讲",
        body: `「每个城市的已支付订单总金额」需要 users ⋈ orders 再过滤、分组。

为什么这一节重要：组合 JOIN + 聚合解决业务问题。不只是名词，而是后续所有实践的前提。学习时请同时抓住三件事：① 它解决什么问题；② 核心机制/API 是什么；③ 什么情况下不该用、常见坑是什么。`,
      },
      {
        type: "text",
        title: "机制与关键点",
        body: `围绕「实战：商店分析查询」，建议你用下面清单自检是否真懂：
· 输入/前置条件是什么？
· 输出/副作用是什么？
· 与相邻概念如何区分？（容易混淆的一对一对比）
· 复杂度或性能上的直觉（是否 O(n)、是否阻塞、是否有状态）
· 在真实项目里通常放在哪一层（入口、中间件、数据层、UI、运维）？

把每个点用自己的话写进笔记；能讲给别人听，才算过关。`,
      },
      {
        type: "text",
        title: "实践步骤",
        body: `1. 只读官方/权威文档里与「实战：商店分析查询」直接相关的一小节，不要发散。
2. 在本机或本站 Demo 里最小复现：只验证一个行为。
3. 故意制造一个错误（错参数、错顺序、错环境），观察报错信息。
4. 改对后再总结：「正确做法 / 错误做法 / 如何排查」三行笔记。
5. 做本节测验；错题收入错题本，隔天再测一次。`,
      },
      {
        type: "text",
        title: "踩坑与排障",
        body: `· 文档示例能跑、自己环境不能：先对齐版本与配置，再怀疑代码。
· 「好像懂了」但默写不出来：回去做最小复现，而不是再看一遍视频。
· 多个概念一起崩：二分法缩小范围（注释一半配置/代码）。
· 与「sql-shop-queries」相关的问题，优先查官方 FAQ 与 issue 里的 breaking change。
· 生产环境多一项：可观测性（日志/指标）和回滚策略。`,
      },
      {
        type: "text",
        title: "面试 / 复盘一问",
        body: `请用 90 秒回答：什么是实战：商店分析查询？它解决什么问题？举一个你会在项目里使用（或拒绝使用）的场景，并说明取舍。

加分项：对比一个替代方案，并说出性能、复杂度或可维护性上的差异。`,
      },
      {
        type: "code",
        title: "对应源码",
        lang: "sql",
        code: `SELECT u.city, SUM(o.total) AS revenue
FROM orders o
JOIN users u ON o.user_id = u.id
WHERE o.status = 'paid'
GROUP BY u.city
ORDER BY revenue DESC;`,
      },
      {
        type: "code",
        title: "自检清单（注释版）",
        lang: "text",
        code: `// [ ] 能用自己的话解释：实战：商店分析查询
// [ ] 能默写最小示例
// [ ] 能说出 2 个踩坑
// [ ] 能在项目场景里决定用/不用`,
      },
      { type: "demo", kind: "sql-shop", title: "动手：城市收入", hint: "JOIN + GROUP BY" },
      {
        type: "tip",
        body: `先求「能复现 + 能讲清」，再求「背全 API」。本课 Demo 与测验就是你的验收标准。`,
      },
      {
        type: "quiz",
        questions: [
          {
            id: "sql-shop-queries-7cb8-1",
            question: "关于「实战：商店分析查询」，最准确的理解是？",
            options: ["只需要记住名词即可", "要同时理解问题、机制、适用边界与常见坑", "与实践无关", "只能在考试中使用"],
            answer: 1,
            explain: "概念 + 机制 + 边界 + 排障，才是可迁移的掌握。",
          },
          {
            id: "sql-shop-queries-7cb8-2",
            question: "学习「实战：商店分析查询」时，优先行动是？",
            options: ["一次看完所有周边主题", "最小复现一个行为，再扩展", "只收藏文档不动手", "跳过报错信息"],
            answer: 1,
            explain: "最小复现建立反馈回路。",
          },
          {
            id: "sql-shop-queries-7cb8-3",
            question: "遇到「示例能跑、自己环境不能」时，你应先？",
            options: ["重写整个项目", "对齐版本/配置并阅读完整报错", "忽略错误继续下一步", "删除全部依赖"],
            answer: 1,
            explain: "环境与版本是第一怀疑对象。",
          },
        ],
      },
    ],
  },
  {
    slug: "sql-injection",
    title: "SQL 注入与参数化",
    summary: "永远不要拼接不可信输入。",
    level: "实战",
    track: "SQL 实战",
    minutes: 12,
    blocks: [
      {
        type: "text",
        title: "概念深讲",
        body: `把用户输入拼进 SQL 字符串会导致攻击者改写语句。正确做法：参数化查询 / 预编译（$1、? 占位）。

为什么这一节重要：永远不要拼接不可信输入。不只是名词，而是后续所有实践的前提。学习时请同时抓住三件事：① 它解决什么问题；② 核心机制/API 是什么；③ 什么情况下不该用、常见坑是什么。`,
      },
      {
        type: "text",
        title: "机制与关键点",
        body: `围绕「SQL 注入与参数化」，建议你用下面清单自检是否真懂：
· 输入/前置条件是什么？
· 输出/副作用是什么？
· 与相邻概念如何区分？（容易混淆的一对一对比）
· 复杂度或性能上的直觉（是否 O(n)、是否阻塞、是否有状态）
· 在真实项目里通常放在哪一层（入口、中间件、数据层、UI、运维）？

把每个点用自己的话写进笔记；能讲给别人听，才算过关。`,
      },
      {
        type: "text",
        title: "补充要点 1",
        body: `ORM 不是自动安全：raw SQL 拼接同样危险。最小权限账号、WAF 是纵深防御。`,
      },
      {
        type: "text",
        title: "实践步骤",
        body: `1. 只读官方/权威文档里与「SQL 注入与参数化」直接相关的一小节，不要发散。
2. 在本机或本站 Demo 里最小复现：只验证一个行为。
3. 故意制造一个错误（错参数、错顺序、错环境），观察报错信息。
4. 改对后再总结：「正确做法 / 错误做法 / 如何排查」三行笔记。
5. 做本节测验；错题收入错题本，隔天再测一次。`,
      },
      {
        type: "text",
        title: "踩坑与排障",
        body: `· 文档示例能跑、自己环境不能：先对齐版本与配置，再怀疑代码。
· 「好像懂了」但默写不出来：回去做最小复现，而不是再看一遍视频。
· 多个概念一起崩：二分法缩小范围（注释一半配置/代码）。
· 与「sql-injection」相关的问题，优先查官方 FAQ 与 issue 里的 breaking change。
· 生产环境多一项：可观测性（日志/指标）和回滚策略。`,
      },
      {
        type: "text",
        title: "面试 / 复盘一问",
        body: `请用 90 秒回答：什么是SQL 注入与参数化？它解决什么问题？举一个你会在项目里使用（或拒绝使用）的场景，并说明取舍。

加分项：对比一个替代方案，并说出性能、复杂度或可维护性上的差异。`,
      },
      {
        type: "code",
        title: "对应源码",
        lang: "sql",
        code: `// 危险
// db.query(\\"SELECT * FROM users WHERE name = '\\" + name + \\"'\\")
// 安全
// db.query(\\"SELECT * FROM users WHERE name = $1\\", [name])`,
      },
      {
        type: "code",
        title: "自检清单（注释版）",
        lang: "text",
        code: `// [ ] 能用自己的话解释：SQL 注入与参数化
// [ ] 能默写最小示例
// [ ] 能说出 2 个踩坑
// [ ] 能在项目场景里决定用/不用`,
      },
      {
        type: "tip",
        body: `先求「能复现 + 能讲清」，再求「背全 API」。本课 Demo 与测验就是你的验收标准。`,
      },
      {
        type: "quiz",
        questions: [
          {
            id: "sql-injection-3366-1",
            question: "关于「SQL 注入与参数化」，最准确的理解是？",
            options: ["只需要记住名词即可", "要同时理解问题、机制、适用边界与常见坑", "与实践无关", "只能在考试中使用"],
            answer: 1,
            explain: "概念 + 机制 + 边界 + 排障，才是可迁移的掌握。",
          },
          {
            id: "sql-injection-3366-2",
            question: "学习「SQL 注入与参数化」时，优先行动是？",
            options: ["一次看完所有周边主题", "最小复现一个行为，再扩展", "只收藏文档不动手", "跳过报错信息"],
            answer: 1,
            explain: "最小复现建立反馈回路。",
          },
          {
            id: "sql-injection-3366-3",
            question: "遇到「示例能跑、自己环境不能」时，你应先？",
            options: ["重写整个项目", "对齐版本/配置并阅读完整报错", "忽略错误继续下一步", "删除全部依赖"],
            answer: 1,
            explain: "环境与版本是第一怀疑对象。",
          },
        ],
      },
    ],
  },
  {
    slug: "explain-plan",
    title: "读懂执行计划直觉",
    summary: "Seq Scan vs Index Scan。",
    level: "实战",
    track: "SQL 实战",
    minutes: 12,
    blocks: [
      {
        type: "text",
        title: "概念深讲",
        body: `数据库会生成执行计划。顺序扫描适合小表；大表等值查询应走索引。统计信息过期会导致烂计划——要 ANALYZE。

为什么这一节重要：Seq Scan vs Index Scan。不只是名词，而是后续所有实践的前提。学习时请同时抓住三件事：① 它解决什么问题；② 核心机制/API 是什么；③ 什么情况下不该用、常见坑是什么。`,
      },
      {
        type: "text",
        title: "机制与关键点",
        body: `围绕「读懂执行计划直觉」，建议你用下面清单自检是否真懂：
· 输入/前置条件是什么？
· 输出/副作用是什么？
· 与相邻概念如何区分？（容易混淆的一对一对比）
· 复杂度或性能上的直觉（是否 O(n)、是否阻塞、是否有状态）
· 在真实项目里通常放在哪一层（入口、中间件、数据层、UI、运维）？

把每个点用自己的话写进笔记；能讲给别人听，才算过关。`,
      },
      {
        type: "text",
        title: "实践步骤",
        body: `1. 只读官方/权威文档里与「读懂执行计划直觉」直接相关的一小节，不要发散。
2. 在本机或本站 Demo 里最小复现：只验证一个行为。
3. 故意制造一个错误（错参数、错顺序、错环境），观察报错信息。
4. 改对后再总结：「正确做法 / 错误做法 / 如何排查」三行笔记。
5. 做本节测验；错题收入错题本，隔天再测一次。`,
      },
      {
        type: "text",
        title: "踩坑与排障",
        body: `· 文档示例能跑、自己环境不能：先对齐版本与配置，再怀疑代码。
· 「好像懂了」但默写不出来：回去做最小复现，而不是再看一遍视频。
· 多个概念一起崩：二分法缩小范围（注释一半配置/代码）。
· 与「explain-plan」相关的问题，优先查官方 FAQ 与 issue 里的 breaking change。
· 生产环境多一项：可观测性（日志/指标）和回滚策略。`,
      },
      {
        type: "text",
        title: "面试 / 复盘一问",
        body: `请用 90 秒回答：什么是读懂执行计划直觉？它解决什么问题？举一个你会在项目里使用（或拒绝使用）的场景，并说明取舍。

加分项：对比一个替代方案，并说出性能、复杂度或可维护性上的差异。`,
      },
      {
        type: "code",
        title: "对应源码",
        lang: "sql",
        code: `-- EXPLAIN ANALYZE SELECT * FROM orders WHERE user_id = 1;`,
      },
      {
        type: "code",
        title: "自检清单（注释版）",
        lang: "text",
        code: `// [ ] 能用自己的话解释：读懂执行计划直觉
// [ ] 能默写最小示例
// [ ] 能说出 2 个踩坑
// [ ] 能在项目场景里决定用/不用`,
      },
      {
        type: "tip",
        body: `先求「能复现 + 能讲清」，再求「背全 API」。本课 Demo 与测验就是你的验收标准。`,
      },
      {
        type: "quiz",
        questions: [
          {
            id: "explain-plan-668f-1",
            question: "关于「读懂执行计划直觉」，最准确的理解是？",
            options: ["只需要记住名词即可", "要同时理解问题、机制、适用边界与常见坑", "与实践无关", "只能在考试中使用"],
            answer: 1,
            explain: "概念 + 机制 + 边界 + 排障，才是可迁移的掌握。",
          },
          {
            id: "explain-plan-668f-2",
            question: "学习「读懂执行计划直觉」时，优先行动是？",
            options: ["一次看完所有周边主题", "最小复现一个行为，再扩展", "只收藏文档不动手", "跳过报错信息"],
            answer: 1,
            explain: "最小复现建立反馈回路。",
          },
          {
            id: "explain-plan-668f-3",
            question: "遇到「示例能跑、自己环境不能」时，你应先？",
            options: ["重写整个项目", "对齐版本/配置并阅读完整报错", "忽略错误继续下一步", "删除全部依赖"],
            answer: 1,
            explain: "环境与版本是第一怀疑对象。",
          },
        ],
      },
    ],
  },
  {
    slug: "mongo-intro",
    title: "MongoDB 是什么",
    summary: "文档、集合、BSON。",
    level: "入门",
    track: "MongoDB 入门",
    minutes: 12,
    official: "https://www.mongodb.com/docs/manual/introduction/",
    blocks: [
      {
        type: "text",
        title: "概念深讲",
        body: `MongoDB 存 BSON 文档（类 JSON）。集合 ≈ 表，文档 ≈ 行，但字段可以灵活、可嵌套数组与子文档。适合内容、日志、产品目录等半结构化数据。

为什么这一节重要：文档、集合、BSON。不只是名词，而是后续所有实践的前提。学习时请同时抓住三件事：① 它解决什么问题；② 核心机制/API 是什么；③ 什么情况下不该用、常见坑是什么。`,
      },
      {
        type: "text",
        title: "机制与关键点",
        body: `围绕「MongoDB 是什么」，建议你用下面清单自检是否真懂：
· 输入/前置条件是什么？
· 输出/副作用是什么？
· 与相邻概念如何区分？（容易混淆的一对一对比）
· 复杂度或性能上的直觉（是否 O(n)、是否阻塞、是否有状态）
· 在真实项目里通常放在哪一层（入口、中间件、数据层、UI、运维）？

把每个点用自己的话写进笔记；能讲给别人听，才算过关。`,
      },
      {
        type: "text",
        title: "实践步骤",
        body: `1. 只读官方/权威文档里与「MongoDB 是什么」直接相关的一小节，不要发散。
2. 在本机或本站 Demo 里最小复现：只验证一个行为。
3. 故意制造一个错误（错参数、错顺序、错环境），观察报错信息。
4. 改对后再总结：「正确做法 / 错误做法 / 如何排查」三行笔记。
5. 做本节测验；错题收入错题本，隔天再测一次。`,
      },
      {
        type: "text",
        title: "踩坑与排障",
        body: `· 文档示例能跑、自己环境不能：先对齐版本与配置，再怀疑代码。
· 「好像懂了」但默写不出来：回去做最小复现，而不是再看一遍视频。
· 多个概念一起崩：二分法缩小范围（注释一半配置/代码）。
· 与「mongo-intro」相关的问题，优先查官方 FAQ 与 issue 里的 breaking change。
· 生产环境多一项：可观测性（日志/指标）和回滚策略。`,
      },
      {
        type: "text",
        title: "面试 / 复盘一问",
        body: `请用 90 秒回答：什么是MongoDB 是什么？它解决什么问题？举一个你会在项目里使用（或拒绝使用）的场景，并说明取舍。

加分项：对比一个替代方案，并说出性能、复杂度或可维护性上的差异。`,
      },
      {
        type: "code",
        title: "对应源码",
        lang: "sql",
        code: `db.users.find({ city: \\"Tokyo\\" })`,
      },
      {
        type: "code",
        title: "自检清单（注释版）",
        lang: "text",
        code: `// [ ] 能用自己的话解释：MongoDB 是什么
// [ ] 能默写最小示例
// [ ] 能说出 2 个踩坑
// [ ] 能在项目场景里决定用/不用`,
      },
      { type: "demo", kind: "mongo-find", title: "动手：查东京用户", hint: "find 查询" },
      {
        type: "tip",
        body: `先求「能复现 + 能讲清」，再求「背全 API」。本课 Demo 与测验就是你的验收标准。`,
      },
      {
        type: "quiz",
        questions: [
          {
            id: "mongo-intro-3360-1",
            question: "关于「MongoDB 是什么」，最准确的理解是？",
            options: ["只需要记住名词即可", "要同时理解问题、机制、适用边界与常见坑", "与实践无关", "只能在考试中使用"],
            answer: 1,
            explain: "概念 + 机制 + 边界 + 排障，才是可迁移的掌握。",
          },
          {
            id: "mongo-intro-3360-2",
            question: "学习「MongoDB 是什么」时，优先行动是？",
            options: ["一次看完所有周边主题", "最小复现一个行为，再扩展", "只收藏文档不动手", "跳过报错信息"],
            answer: 1,
            explain: "最小复现建立反馈回路。",
          },
          {
            id: "mongo-intro-3360-3",
            question: "遇到「示例能跑、自己环境不能」时，你应先？",
            options: ["重写整个项目", "对齐版本/配置并阅读完整报错", "忽略错误继续下一步", "删除全部依赖"],
            answer: 1,
            explain: "环境与版本是第一怀疑对象。",
          },
        ],
      },
    ],
  },
  {
    slug: "mongo-crud",
    title: "MongoDB CRUD",
    summary: "insert / find / update / delete。",
    level: "入门",
    track: "MongoDB 入门",
    minutes: 12,
    blocks: [
      {
        type: "text",
        title: "概念深讲",
        body: `insertOne / find / updateOne+$set / deleteMany。更新推荐操作符，避免整单替换踩坑。

为什么这一节重要：insert / find / update / delete。不只是名词，而是后续所有实践的前提。学习时请同时抓住三件事：① 它解决什么问题；② 核心机制/API 是什么；③ 什么情况下不该用、常见坑是什么。`,
      },
      {
        type: "text",
        title: "机制与关键点",
        body: `围绕「MongoDB CRUD」，建议你用下面清单自检是否真懂：
· 输入/前置条件是什么？
· 输出/副作用是什么？
· 与相邻概念如何区分？（容易混淆的一对一对比）
· 复杂度或性能上的直觉（是否 O(n)、是否阻塞、是否有状态）
· 在真实项目里通常放在哪一层（入口、中间件、数据层、UI、运维）？

把每个点用自己的话写进笔记；能讲给别人听，才算过关。`,
      },
      {
        type: "text",
        title: "实践步骤",
        body: `1. 只读官方/权威文档里与「MongoDB CRUD」直接相关的一小节，不要发散。
2. 在本机或本站 Demo 里最小复现：只验证一个行为。
3. 故意制造一个错误（错参数、错顺序、错环境），观察报错信息。
4. 改对后再总结：「正确做法 / 错误做法 / 如何排查」三行笔记。
5. 做本节测验；错题收入错题本，隔天再测一次。`,
      },
      {
        type: "text",
        title: "踩坑与排障",
        body: `· 文档示例能跑、自己环境不能：先对齐版本与配置，再怀疑代码。
· 「好像懂了」但默写不出来：回去做最小复现，而不是再看一遍视频。
· 多个概念一起崩：二分法缩小范围（注释一半配置/代码）。
· 与「mongo-crud」相关的问题，优先查官方 FAQ 与 issue 里的 breaking change。
· 生产环境多一项：可观测性（日志/指标）和回滚策略。`,
      },
      {
        type: "text",
        title: "面试 / 复盘一问",
        body: `请用 90 秒回答：什么是MongoDB CRUD？它解决什么问题？举一个你会在项目里使用（或拒绝使用）的场景，并说明取舍。

加分项：对比一个替代方案，并说出性能、复杂度或可维护性上的差异。`,
      },
      {
        type: "code",
        title: "对应源码",
        lang: "sql",
        code: `db.users.insertOne({ _id: 6, name: \\"Frank\\", city: \\"Nagoya\\", age: 31 })

db.users.updateOne(
  { name: \\"Alice\\" },
  { $set: { age: 29 } }
)`,
      },
      {
        type: "code",
        title: "示例代码 2",
        lang: "sql",
        code: `db.orders.deleteMany({ status: \\"cancelled\\" })`,
      },
      { type: "demo", kind: "mongo-crud", title: "动手：更新年龄", hint: "$set" },
      {
        type: "tip",
        body: `先求「能复现 + 能讲清」，再求「背全 API」。本课 Demo 与测验就是你的验收标准。`,
      },
      {
        type: "quiz",
        questions: [
          {
            id: "mongo-crud-7f67-1",
            question: "关于「MongoDB CRUD」，最准确的理解是？",
            options: ["只需要记住名词即可", "要同时理解问题、机制、适用边界与常见坑", "与实践无关", "只能在考试中使用"],
            answer: 1,
            explain: "概念 + 机制 + 边界 + 排障，才是可迁移的掌握。",
          },
          {
            id: "mongo-crud-7f67-2",
            question: "学习「MongoDB CRUD」时，优先行动是？",
            options: ["一次看完所有周边主题", "最小复现一个行为，再扩展", "只收藏文档不动手", "跳过报错信息"],
            answer: 1,
            explain: "最小复现建立反馈回路。",
          },
          {
            id: "mongo-crud-7f67-3",
            question: "遇到「示例能跑、自己环境不能」时，你应先？",
            options: ["重写整个项目", "对齐版本/配置并阅读完整报错", "忽略错误继续下一步", "删除全部依赖"],
            answer: 1,
            explain: "环境与版本是第一怀疑对象。",
          },
        ],
      },
    ],
  },
  {
    slug: "mongo-query-ops",
    title: "查询操作符",
    summary: "$gt $in $or $regex。",
    level: "入门",
    track: "MongoDB 入门",
    minutes: 12,
    blocks: [
      {
        type: "text",
        title: "概念深讲",
        body: `比较：$gt/$gte/$lt/$lte/$ne；集合：$in/$nin；逻辑：$and/$or；存在：$exists；正则：$regex。

为什么这一节重要：$gt $in $or $regex。不只是名词，而是后续所有实践的前提。学习时请同时抓住三件事：① 它解决什么问题；② 核心机制/API 是什么；③ 什么情况下不该用、常见坑是什么。`,
      },
      {
        type: "text",
        title: "机制与关键点",
        body: `围绕「查询操作符」，建议你用下面清单自检是否真懂：
· 输入/前置条件是什么？
· 输出/副作用是什么？
· 与相邻概念如何区分？（容易混淆的一对一对比）
· 复杂度或性能上的直觉（是否 O(n)、是否阻塞、是否有状态）
· 在真实项目里通常放在哪一层（入口、中间件、数据层、UI、运维）？

把每个点用自己的话写进笔记；能讲给别人听，才算过关。`,
      },
      {
        type: "text",
        title: "实践步骤",
        body: `1. 只读官方/权威文档里与「查询操作符」直接相关的一小节，不要发散。
2. 在本机或本站 Demo 里最小复现：只验证一个行为。
3. 故意制造一个错误（错参数、错顺序、错环境），观察报错信息。
4. 改对后再总结：「正确做法 / 错误做法 / 如何排查」三行笔记。
5. 做本节测验；错题收入错题本，隔天再测一次。`,
      },
      {
        type: "text",
        title: "踩坑与排障",
        body: `· 文档示例能跑、自己环境不能：先对齐版本与配置，再怀疑代码。
· 「好像懂了」但默写不出来：回去做最小复现，而不是再看一遍视频。
· 多个概念一起崩：二分法缩小范围（注释一半配置/代码）。
· 与「mongo-query-ops」相关的问题，优先查官方 FAQ 与 issue 里的 breaking change。
· 生产环境多一项：可观测性（日志/指标）和回滚策略。`,
      },
      {
        type: "text",
        title: "面试 / 复盘一问",
        body: `请用 90 秒回答：什么是查询操作符？它解决什么问题？举一个你会在项目里使用（或拒绝使用）的场景，并说明取舍。

加分项：对比一个替代方案，并说出性能、复杂度或可维护性上的差异。`,
      },
      {
        type: "code",
        title: "对应源码",
        lang: "sql",
        code: `db.products.find({
  price: { $gte: 40 },
  category: { $in: [\\"Books\\", \\"Hardware\\"] }
})`,
      },
      {
        type: "code",
        title: "自检清单（注释版）",
        lang: "text",
        code: `// [ ] 能用自己的话解释：查询操作符
// [ ] 能默写最小示例
// [ ] 能说出 2 个踩坑
// [ ] 能在项目场景里决定用/不用`,
      },
      { type: "demo", kind: "mongo-ops", title: "动手：价格过滤", hint: "$gte" },
      {
        type: "tip",
        body: `先求「能复现 + 能讲清」，再求「背全 API」。本课 Demo 与测验就是你的验收标准。`,
      },
      {
        type: "quiz",
        questions: [
          {
            id: "mongo-query-ops-c70b-1",
            question: "关于「查询操作符」，最准确的理解是？",
            options: ["只需要记住名词即可", "要同时理解问题、机制、适用边界与常见坑", "与实践无关", "只能在考试中使用"],
            answer: 1,
            explain: "概念 + 机制 + 边界 + 排障，才是可迁移的掌握。",
          },
          {
            id: "mongo-query-ops-c70b-2",
            question: "学习「查询操作符」时，优先行动是？",
            options: ["一次看完所有周边主题", "最小复现一个行为，再扩展", "只收藏文档不动手", "跳过报错信息"],
            answer: 1,
            explain: "最小复现建立反馈回路。",
          },
          {
            id: "mongo-query-ops-c70b-3",
            question: "遇到「示例能跑、自己环境不能」时，你应先？",
            options: ["重写整个项目", "对齐版本/配置并阅读完整报错", "忽略错误继续下一步", "删除全部依赖"],
            answer: 1,
            explain: "环境与版本是第一怀疑对象。",
          },
        ],
      },
    ],
  },
  {
    slug: "mongo-embed-ref",
    title: "内嵌 vs 引用",
    summary: "建模两种策略。",
    level: "入门",
    track: "MongoDB 入门",
    minutes: 12,
    blocks: [
      {
        type: "text",
        title: "概念深讲",
        body: `内嵌：读一单拿齐、事务边界小；引用：复用实体、避免文档过大。经验：一对少、一起读 → 内嵌；多对多、独立生命周期 → 引用。

为什么这一节重要：建模两种策略。不只是名词，而是后续所有实践的前提。学习时请同时抓住三件事：① 它解决什么问题；② 核心机制/API 是什么；③ 什么情况下不该用、常见坑是什么。`,
      },
      {
        type: "text",
        title: "机制与关键点",
        body: `围绕「内嵌 vs 引用」，建议你用下面清单自检是否真懂：
· 输入/前置条件是什么？
· 输出/副作用是什么？
· 与相邻概念如何区分？（容易混淆的一对一对比）
· 复杂度或性能上的直觉（是否 O(n)、是否阻塞、是否有状态）
· 在真实项目里通常放在哪一层（入口、中间件、数据层、UI、运维）？

把每个点用自己的话写进笔记；能讲给别人听，才算过关。`,
      },
      {
        type: "text",
        title: "实践步骤",
        body: `1. 只读官方/权威文档里与「内嵌 vs 引用」直接相关的一小节，不要发散。
2. 在本机或本站 Demo 里最小复现：只验证一个行为。
3. 故意制造一个错误（错参数、错顺序、错环境），观察报错信息。
4. 改对后再总结：「正确做法 / 错误做法 / 如何排查」三行笔记。
5. 做本节测验；错题收入错题本，隔天再测一次。`,
      },
      {
        type: "text",
        title: "踩坑与排障",
        body: `· 文档示例能跑、自己环境不能：先对齐版本与配置，再怀疑代码。
· 「好像懂了」但默写不出来：回去做最小复现，而不是再看一遍视频。
· 多个概念一起崩：二分法缩小范围（注释一半配置/代码）。
· 与「mongo-embed-ref」相关的问题，优先查官方 FAQ 与 issue 里的 breaking change。
· 生产环境多一项：可观测性（日志/指标）和回滚策略。`,
      },
      {
        type: "text",
        title: "面试 / 复盘一问",
        body: `请用 90 秒回答：什么是内嵌 vs 引用？它解决什么问题？举一个你会在项目里使用（或拒绝使用）的场景，并说明取舍。

加分项：对比一个替代方案，并说出性能、复杂度或可维护性上的差异。`,
      },
      {
        type: "code",
        title: "对应源码",
        lang: "sql",
        code: `{
  _id: 1,
  user_id: 1,
  items: [{ product_id: 1, qty: 1, price: 89 }],
  total: 89
}`,
      },
      {
        type: "code",
        title: "自检清单（注释版）",
        lang: "text",
        code: `// [ ] 能用自己的话解释：内嵌 vs 引用
// [ ] 能默写最小示例
// [ ] 能说出 2 个踩坑
// [ ] 能在项目场景里决定用/不用`,
      },
      { type: "demo", kind: "mongo-embed", title: "动手：看订单文档", hint: "嵌套 items" },
      {
        type: "tip",
        body: `先求「能复现 + 能讲清」，再求「背全 API」。本课 Demo 与测验就是你的验收标准。`,
      },
      {
        type: "quiz",
        questions: [
          {
            id: "mongo-embed-ref-f06f-1",
            question: "关于「内嵌 vs 引用」，最准确的理解是？",
            options: ["只需要记住名词即可", "要同时理解问题、机制、适用边界与常见坑", "与实践无关", "只能在考试中使用"],
            answer: 1,
            explain: "概念 + 机制 + 边界 + 排障，才是可迁移的掌握。",
          },
          {
            id: "mongo-embed-ref-f06f-2",
            question: "学习「内嵌 vs 引用」时，优先行动是？",
            options: ["一次看完所有周边主题", "最小复现一个行为，再扩展", "只收藏文档不动手", "跳过报错信息"],
            answer: 1,
            explain: "最小复现建立反馈回路。",
          },
          {
            id: "mongo-embed-ref-f06f-3",
            question: "遇到「示例能跑、自己环境不能」时，你应先？",
            options: ["重写整个项目", "对齐版本/配置并阅读完整报错", "忽略错误继续下一步", "删除全部依赖"],
            answer: 1,
            explain: "环境与版本是第一怀疑对象。",
          },
        ],
      },
    ],
  },
  {
    slug: "mongo-aggregate",
    title: "聚合管道",
    summary: "$match $group $sort $project。",
    level: "进阶",
    track: "MongoDB 进阶",
    minutes: 14,
    blocks: [
      {
        type: "text",
        title: "概念深讲",
        body: `文档依次流过阶段，像流水线。$match 过滤、$group 聚合、$sort 排序、$project 整形、$limit 截断。

为什么这一节重要：$match $group $sort $project。不只是名词，而是后续所有实践的前提。学习时请同时抓住三件事：① 它解决什么问题；② 核心机制/API 是什么；③ 什么情况下不该用、常见坑是什么。`,
      },
      {
        type: "text",
        title: "机制与关键点",
        body: `围绕「聚合管道」，建议你用下面清单自检是否真懂：
· 输入/前置条件是什么？
· 输出/副作用是什么？
· 与相邻概念如何区分？（容易混淆的一对一对比）
· 复杂度或性能上的直觉（是否 O(n)、是否阻塞、是否有状态）
· 在真实项目里通常放在哪一层（入口、中间件、数据层、UI、运维）？

把每个点用自己的话写进笔记；能讲给别人听，才算过关。`,
      },
      {
        type: "text",
        title: "实践步骤",
        body: `1. 只读官方/权威文档里与「聚合管道」直接相关的一小节，不要发散。
2. 在本机或本站 Demo 里最小复现：只验证一个行为。
3. 故意制造一个错误（错参数、错顺序、错环境），观察报错信息。
4. 改对后再总结：「正确做法 / 错误做法 / 如何排查」三行笔记。
5. 做本节测验；错题收入错题本，隔天再测一次。`,
      },
      {
        type: "text",
        title: "踩坑与排障",
        body: `· 文档示例能跑、自己环境不能：先对齐版本与配置，再怀疑代码。
· 「好像懂了」但默写不出来：回去做最小复现，而不是再看一遍视频。
· 多个概念一起崩：二分法缩小范围（注释一半配置/代码）。
· 与「mongo-aggregate」相关的问题，优先查官方 FAQ 与 issue 里的 breaking change。
· 生产环境多一项：可观测性（日志/指标）和回滚策略。`,
      },
      {
        type: "text",
        title: "面试 / 复盘一问",
        body: `请用 90 秒回答：什么是聚合管道？它解决什么问题？举一个你会在项目里使用（或拒绝使用）的场景，并说明取舍。

加分项：对比一个替代方案，并说出性能、复杂度或可维护性上的差异。`,
      },
      {
        type: "code",
        title: "对应源码",
        lang: "sql",
        code: `db.orders.aggregate([
  { $match: { status: { $in: [\\"paid\\", \\"shipped\\"] } } },
  { $group: { _id: \\"$status\\", revenue: { $sum: \\"$total\\" }, n: { $sum: 1 } } },
  { $sort: { revenue: -1 } }
])`,
      },
      {
        type: "code",
        title: "自检清单（注释版）",
        lang: "text",
        code: `// [ ] 能用自己的话解释：聚合管道
// [ ] 能默写最小示例
// [ ] 能说出 2 个踩坑
// [ ] 能在项目场景里决定用/不用`,
      },
      { type: "demo", kind: "mongo-agg", title: "动手：聚合收入", hint: "$group" },
      {
        type: "tip",
        body: `先求「能复现 + 能讲清」，再求「背全 API」。本课 Demo 与测验就是你的验收标准。`,
      },
      {
        type: "quiz",
        questions: [
          {
            id: "mongo-aggregate-ca88-1",
            question: "关于「聚合管道」，最准确的理解是？",
            options: ["只需要记住名词即可", "要同时理解问题、机制、适用边界与常见坑", "与实践无关", "只能在考试中使用"],
            answer: 1,
            explain: "概念 + 机制 + 边界 + 排障，才是可迁移的掌握。",
          },
          {
            id: "mongo-aggregate-ca88-2",
            question: "学习「聚合管道」时，优先行动是？",
            options: ["一次看完所有周边主题", "最小复现一个行为，再扩展", "只收藏文档不动手", "跳过报错信息"],
            answer: 1,
            explain: "最小复现建立反馈回路。",
          },
          {
            id: "mongo-aggregate-ca88-3",
            question: "遇到「示例能跑、自己环境不能」时，你应先？",
            options: ["重写整个项目", "对齐版本/配置并阅读完整报错", "忽略错误继续下一步", "删除全部依赖"],
            answer: 1,
            explain: "环境与版本是第一怀疑对象。",
          },
        ],
      },
    ],
  },
  {
    slug: "mongo-indexes",
    title: "MongoDB 索引",
    summary: "单字段、复合、多键索引直觉。",
    level: "进阶",
    track: "MongoDB 进阶",
    minutes: 12,
    blocks: [
      {
        type: "text",
        title: "概念深讲",
        body: `createIndex({ city: 1 })。数组字段自动多键索引。复合索引同样有前缀规则。explain() 看是否 IXSCAN。

为什么这一节重要：单字段、复合、多键索引直觉。不只是名词，而是后续所有实践的前提。学习时请同时抓住三件事：① 它解决什么问题；② 核心机制/API 是什么；③ 什么情况下不该用、常见坑是什么。`,
      },
      {
        type: "text",
        title: "机制与关键点",
        body: `围绕「MongoDB 索引」，建议你用下面清单自检是否真懂：
· 输入/前置条件是什么？
· 输出/副作用是什么？
· 与相邻概念如何区分？（容易混淆的一对一对比）
· 复杂度或性能上的直觉（是否 O(n)、是否阻塞、是否有状态）
· 在真实项目里通常放在哪一层（入口、中间件、数据层、UI、运维）？

把每个点用自己的话写进笔记；能讲给别人听，才算过关。`,
      },
      {
        type: "text",
        title: "实践步骤",
        body: `1. 只读官方/权威文档里与「MongoDB 索引」直接相关的一小节，不要发散。
2. 在本机或本站 Demo 里最小复现：只验证一个行为。
3. 故意制造一个错误（错参数、错顺序、错环境），观察报错信息。
4. 改对后再总结：「正确做法 / 错误做法 / 如何排查」三行笔记。
5. 做本节测验；错题收入错题本，隔天再测一次。`,
      },
      {
        type: "text",
        title: "踩坑与排障",
        body: `· 文档示例能跑、自己环境不能：先对齐版本与配置，再怀疑代码。
· 「好像懂了」但默写不出来：回去做最小复现，而不是再看一遍视频。
· 多个概念一起崩：二分法缩小范围（注释一半配置/代码）。
· 与「mongo-indexes」相关的问题，优先查官方 FAQ 与 issue 里的 breaking change。
· 生产环境多一项：可观测性（日志/指标）和回滚策略。`,
      },
      {
        type: "text",
        title: "面试 / 复盘一问",
        body: `请用 90 秒回答：什么是MongoDB 索引？它解决什么问题？举一个你会在项目里使用（或拒绝使用）的场景，并说明取舍。

加分项：对比一个替代方案，并说出性能、复杂度或可维护性上的差异。`,
      },
      {
        type: "code",
        title: "对应源码",
        lang: "sql",
        code: `// db.users.createIndex({ city: 1, age: -1 })
db.users.find({ city: \\"Tokyo\\", age: { $gte: 25 } })`,
      },
      {
        type: "code",
        title: "自检清单（注释版）",
        lang: "text",
        code: `// [ ] 能用自己的话解释：MongoDB 索引
// [ ] 能默写最小示例
// [ ] 能说出 2 个踩坑
// [ ] 能在项目场景里决定用/不用`,
      },
      {
        type: "tip",
        body: `先求「能复现 + 能讲清」，再求「背全 API」。本课 Demo 与测验就是你的验收标准。`,
      },
      {
        type: "quiz",
        questions: [
          {
            id: "mongo-indexes-2b9e-1",
            question: "关于「MongoDB 索引」，最准确的理解是？",
            options: ["只需要记住名词即可", "要同时理解问题、机制、适用边界与常见坑", "与实践无关", "只能在考试中使用"],
            answer: 1,
            explain: "概念 + 机制 + 边界 + 排障，才是可迁移的掌握。",
          },
          {
            id: "mongo-indexes-2b9e-2",
            question: "学习「MongoDB 索引」时，优先行动是？",
            options: ["一次看完所有周边主题", "最小复现一个行为，再扩展", "只收藏文档不动手", "跳过报错信息"],
            answer: 1,
            explain: "最小复现建立反馈回路。",
          },
          {
            id: "mongo-indexes-2b9e-3",
            question: "遇到「示例能跑、自己环境不能」时，你应先？",
            options: ["重写整个项目", "对齐版本/配置并阅读完整报错", "忽略错误继续下一步", "删除全部依赖"],
            answer: 1,
            explain: "环境与版本是第一怀疑对象。",
          },
        ],
      },
    ],
  },
  {
    slug: "mongo-update-ops",
    title: "更新操作符进阶",
    summary: "$inc $push $unset。",
    level: "进阶",
    track: "MongoDB 进阶",
    minutes: 12,
    blocks: [
      {
        type: "text",
        title: "概念深讲",
        body: `$inc 增减数值、$push 追加数组、$pull 移除、$unset 删字段。原子单文档更新是 Mongo 强项。

为什么这一节重要：$inc $push $unset。不只是名词，而是后续所有实践的前提。学习时请同时抓住三件事：① 它解决什么问题；② 核心机制/API 是什么；③ 什么情况下不该用、常见坑是什么。`,
      },
      {
        type: "text",
        title: "机制与关键点",
        body: `围绕「更新操作符进阶」，建议你用下面清单自检是否真懂：
· 输入/前置条件是什么？
· 输出/副作用是什么？
· 与相邻概念如何区分？（容易混淆的一对一对比）
· 复杂度或性能上的直觉（是否 O(n)、是否阻塞、是否有状态）
· 在真实项目里通常放在哪一层（入口、中间件、数据层、UI、运维）？

把每个点用自己的话写进笔记；能讲给别人听，才算过关。`,
      },
      {
        type: "text",
        title: "实践步骤",
        body: `1. 只读官方/权威文档里与「更新操作符进阶」直接相关的一小节，不要发散。
2. 在本机或本站 Demo 里最小复现：只验证一个行为。
3. 故意制造一个错误（错参数、错顺序、错环境），观察报错信息。
4. 改对后再总结：「正确做法 / 错误做法 / 如何排查」三行笔记。
5. 做本节测验；错题收入错题本，隔天再测一次。`,
      },
      {
        type: "text",
        title: "踩坑与排障",
        body: `· 文档示例能跑、自己环境不能：先对齐版本与配置，再怀疑代码。
· 「好像懂了」但默写不出来：回去做最小复现，而不是再看一遍视频。
· 多个概念一起崩：二分法缩小范围（注释一半配置/代码）。
· 与「mongo-update-ops」相关的问题，优先查官方 FAQ 与 issue 里的 breaking change。
· 生产环境多一项：可观测性（日志/指标）和回滚策略。`,
      },
      {
        type: "text",
        title: "面试 / 复盘一问",
        body: `请用 90 秒回答：什么是更新操作符进阶？它解决什么问题？举一个你会在项目里使用（或拒绝使用）的场景，并说明取舍。

加分项：对比一个替代方案，并说出性能、复杂度或可维护性上的差异。`,
      },
      {
        type: "code",
        title: "对应源码",
        lang: "sql",
        code: `db.products.updateOne(
  { _id: 1 },
  { $inc: { stock: -1 } }
)

db.users.updateOne(
  { name: \\"Bob\\" },
  { $push: { tags: \\"mentor\\" } }
)`,
      },
      {
        type: "code",
        title: "自检清单（注释版）",
        lang: "text",
        code: `// [ ] 能用自己的话解释：更新操作符进阶
// [ ] 能默写最小示例
// [ ] 能说出 2 个踩坑
// [ ] 能在项目场景里决定用/不用`,
      },
      { type: "demo", kind: "mongo-update-ops", title: "动手：$inc 库存", hint: "stock - 1" },
      {
        type: "tip",
        body: `先求「能复现 + 能讲清」，再求「背全 API」。本课 Demo 与测验就是你的验收标准。`,
      },
      {
        type: "quiz",
        questions: [
          {
            id: "mongo-update-ops-8a04-1",
            question: "关于「更新操作符进阶」，最准确的理解是？",
            options: ["只需要记住名词即可", "要同时理解问题、机制、适用边界与常见坑", "与实践无关", "只能在考试中使用"],
            answer: 1,
            explain: "概念 + 机制 + 边界 + 排障，才是可迁移的掌握。",
          },
          {
            id: "mongo-update-ops-8a04-2",
            question: "学习「更新操作符进阶」时，优先行动是？",
            options: ["一次看完所有周边主题", "最小复现一个行为，再扩展", "只收藏文档不动手", "跳过报错信息"],
            answer: 1,
            explain: "最小复现建立反馈回路。",
          },
          {
            id: "mongo-update-ops-8a04-3",
            question: "遇到「示例能跑、自己环境不能」时，你应先？",
            options: ["重写整个项目", "对齐版本/配置并阅读完整报错", "忽略错误继续下一步", "删除全部依赖"],
            answer: 1,
            explain: "环境与版本是第一怀疑对象。",
          },
        ],
      },
    ],
  },
  {
    slug: "mongo-schema-design",
    title: "模式设计模式",
    summary: "属性模式、桶模式、子集模式。",
    level: "进阶",
    track: "MongoDB 进阶",
    minutes: 12,
    blocks: [
      {
        type: "text",
        title: "概念深讲",
        body: `属性模式：把稀疏键变成 {k,v} 数组便于索引；桶模式：时序点合并到桶文档；子集：列表页只存摘要、详情另集合。

为什么这一节重要：属性模式、桶模式、子集模式。不只是名词，而是后续所有实践的前提。学习时请同时抓住三件事：① 它解决什么问题；② 核心机制/API 是什么；③ 什么情况下不该用、常见坑是什么。`,
      },
      {
        type: "text",
        title: "机制与关键点",
        body: `围绕「模式设计模式」，建议你用下面清单自检是否真懂：
· 输入/前置条件是什么？
· 输出/副作用是什么？
· 与相邻概念如何区分？（容易混淆的一对一对比）
· 复杂度或性能上的直觉（是否 O(n)、是否阻塞、是否有状态）
· 在真实项目里通常放在哪一层（入口、中间件、数据层、UI、运维）？

把每个点用自己的话写进笔记；能讲给别人听，才算过关。`,
      },
      {
        type: "text",
        title: "补充要点 1",
        body: `没有银弹：以访问路径（query pattern）驱动建模，而不是先画 ER 再硬塞。`,
      },
      {
        type: "text",
        title: "实践步骤",
        body: `1. 只读官方/权威文档里与「模式设计模式」直接相关的一小节，不要发散。
2. 在本机或本站 Demo 里最小复现：只验证一个行为。
3. 故意制造一个错误（错参数、错顺序、错环境），观察报错信息。
4. 改对后再总结：「正确做法 / 错误做法 / 如何排查」三行笔记。
5. 做本节测验；错题收入错题本，隔天再测一次。`,
      },
      {
        type: "text",
        title: "踩坑与排障",
        body: `· 文档示例能跑、自己环境不能：先对齐版本与配置，再怀疑代码。
· 「好像懂了」但默写不出来：回去做最小复现，而不是再看一遍视频。
· 多个概念一起崩：二分法缩小范围（注释一半配置/代码）。
· 与「mongo-schema-design」相关的问题，优先查官方 FAQ 与 issue 里的 breaking change。
· 生产环境多一项：可观测性（日志/指标）和回滚策略。`,
      },
      {
        type: "text",
        title: "面试 / 复盘一问",
        body: `请用 90 秒回答：什么是模式设计模式？它解决什么问题？举一个你会在项目里使用（或拒绝使用）的场景，并说明取舍。

加分项：对比一个替代方案，并说出性能、复杂度或可维护性上的差异。`,
      },
      {
        type: "code",
        title: "示例 SQL",
        lang: "sql",
        code: `-- 模式设计模式
-- 请在工坊/本地执行并观察结果
SELECT 1 AS ok; -- 占位：结合本课主题改写`,
      },
      {
        type: "code",
        title: "自检清单（注释版）",
        lang: "text",
        code: `// [ ] 能用自己的话解释：模式设计模式
// [ ] 能默写最小示例
// [ ] 能说出 2 个踩坑
// [ ] 能在项目场景里决定用/不用`,
      },
      {
        type: "tip",
        body: `先求「能复现 + 能讲清」，再求「背全 API」。本课 Demo 与测验就是你的验收标准。`,
      },
      {
        type: "quiz",
        questions: [
          {
            id: "mongo-schema-design-e8f6-1",
            question: "关于「模式设计模式」，最准确的理解是？",
            options: ["只需要记住名词即可", "要同时理解问题、机制、适用边界与常见坑", "与实践无关", "只能在考试中使用"],
            answer: 1,
            explain: "概念 + 机制 + 边界 + 排障，才是可迁移的掌握。",
          },
          {
            id: "mongo-schema-design-e8f6-2",
            question: "学习「模式设计模式」时，优先行动是？",
            options: ["一次看完所有周边主题", "最小复现一个行为，再扩展", "只收藏文档不动手", "跳过报错信息"],
            answer: 1,
            explain: "最小复现建立反馈回路。",
          },
          {
            id: "mongo-schema-design-e8f6-3",
            question: "遇到「示例能跑、自己环境不能」时，你应先？",
            options: ["重写整个项目", "对齐版本/配置并阅读完整报错", "忽略错误继续下一步", "删除全部依赖"],
            answer: 1,
            explain: "环境与版本是第一怀疑对象。",
          },
        ],
      },
    ],
  },
  {
    slug: "sql-vs-mongo",
    title: "SQL vs MongoDB 选型",
    summary: "何时用关系型，何时用文档型。",
    level: "实战",
    track: "对比与选型",
    minutes: 12,
    blocks: [
      {
        type: "text",
        title: "概念深讲",
        body: `强事务、复杂 JOIN、报表规范 → SQL（PostgreSQL）。灵活 schema、海量半结构化、水平扩展文档 → MongoDB。很多系统两者并用（多类型持久化）。

为什么这一节重要：何时用关系型，何时用文档型。不只是名词，而是后续所有实践的前提。学习时请同时抓住三件事：① 它解决什么问题；② 核心机制/API 是什么；③ 什么情况下不该用、常见坑是什么。`,
      },
      {
        type: "text",
        title: "机制与关键点",
        body: `围绕「SQL vs MongoDB 选型」，建议你用下面清单自检是否真懂：
· 输入/前置条件是什么？
· 输出/副作用是什么？
· 与相邻概念如何区分？（容易混淆的一对一对比）
· 复杂度或性能上的直觉（是否 O(n)、是否阻塞、是否有状态）
· 在真实项目里通常放在哪一层（入口、中间件、数据层、UI、运维）？

把每个点用自己的话写进笔记；能讲给别人听，才算过关。`,
      },
      {
        type: "text",
        title: "补充要点 1",
        body: `关系型：orders 行 + order_items 行。文档型：orders 文档内嵌 items[]。读路径不同，一致性边界不同。`,
      },
      {
        type: "text",
        title: "实践步骤",
        body: `1. 只读官方/权威文档里与「SQL vs MongoDB 选型」直接相关的一小节，不要发散。
2. 在本机或本站 Demo 里最小复现：只验证一个行为。
3. 故意制造一个错误（错参数、错顺序、错环境），观察报错信息。
4. 改对后再总结：「正确做法 / 错误做法 / 如何排查」三行笔记。
5. 做本节测验；错题收入错题本，隔天再测一次。`,
      },
      {
        type: "text",
        title: "踩坑与排障",
        body: `· 文档示例能跑、自己环境不能：先对齐版本与配置，再怀疑代码。
· 「好像懂了」但默写不出来：回去做最小复现，而不是再看一遍视频。
· 多个概念一起崩：二分法缩小范围（注释一半配置/代码）。
· 与「sql-vs-mongo」相关的问题，优先查官方 FAQ 与 issue 里的 breaking change。
· 生产环境多一项：可观测性（日志/指标）和回滚策略。`,
      },
      {
        type: "text",
        title: "面试 / 复盘一问",
        body: `请用 90 秒回答：什么是SQL vs MongoDB 选型？它解决什么问题？举一个你会在项目里使用（或拒绝使用）的场景，并说明取舍。

加分项：对比一个替代方案，并说出性能、复杂度或可维护性上的差异。`,
      },
      {
        type: "code",
        title: "示例 SQL",
        lang: "sql",
        code: `-- SQL vs MongoDB 选型
-- 请在工坊/本地执行并观察结果
SELECT 1 AS ok; -- 占位：结合本课主题改写`,
      },
      {
        type: "code",
        title: "自检清单（注释版）",
        lang: "text",
        code: `// [ ] 能用自己的话解释：SQL vs MongoDB 选型
// [ ] 能默写最小示例
// [ ] 能说出 2 个踩坑
// [ ] 能在项目场景里决定用/不用`,
      },
      { type: "demo", kind: "compare-model", title: "对照：同一商店", hint: "表 vs 文档" },
      {
        type: "tip",
        body: `先求「能复现 + 能讲清」，再求「背全 API」。本课 Demo 与测验就是你的验收标准。`,
      },
      {
        type: "quiz",
        questions: [
          {
            id: "sql-vs-mongo-d449-1",
            question: "关于「SQL vs MongoDB 选型」，最准确的理解是？",
            options: ["只需要记住名词即可", "要同时理解问题、机制、适用边界与常见坑", "与实践无关", "只能在考试中使用"],
            answer: 1,
            explain: "概念 + 机制 + 边界 + 排障，才是可迁移的掌握。",
          },
          {
            id: "sql-vs-mongo-d449-2",
            question: "学习「SQL vs MongoDB 选型」时，优先行动是？",
            options: ["一次看完所有周边主题", "最小复现一个行为，再扩展", "只收藏文档不动手", "跳过报错信息"],
            answer: 1,
            explain: "最小复现建立反馈回路。",
          },
          {
            id: "sql-vs-mongo-d449-3",
            question: "遇到「示例能跑、自己环境不能」时，你应先？",
            options: ["重写整个项目", "对齐版本/配置并阅读完整报错", "忽略错误继续下一步", "删除全部依赖"],
            answer: 1,
            explain: "环境与版本是第一怀疑对象。",
          },
        ],
      },
    ],
  },
  {
    slug: "cap-consistency",
    title: "一致性与分布式直觉",
    summary: "副本、最终一致、读写关注点。",
    level: "实战",
    track: "对比与选型",
    minutes: 12,
    blocks: [
      {
        type: "text",
        title: "概念深讲",
        body: `主从/副本集提高可用与读扩展。读从库可能略旧（最终一致）。金融写路径通常读主、写关注 majority。

为什么这一节重要：副本、最终一致、读写关注点。不只是名词，而是后续所有实践的前提。学习时请同时抓住三件事：① 它解决什么问题；② 核心机制/API 是什么；③ 什么情况下不该用、常见坑是什么。`,
      },
      {
        type: "text",
        title: "机制与关键点",
        body: `围绕「一致性与分布式直觉」，建议你用下面清单自检是否真懂：
· 输入/前置条件是什么？
· 输出/副作用是什么？
· 与相邻概念如何区分？（容易混淆的一对一对比）
· 复杂度或性能上的直觉（是否 O(n)、是否阻塞、是否有状态）
· 在真实项目里通常放在哪一层（入口、中间件、数据层、UI、运维）？

把每个点用自己的话写进笔记；能讲给别人听，才算过关。`,
      },
      {
        type: "text",
        title: "实践步骤",
        body: `1. 只读官方/权威文档里与「一致性与分布式直觉」直接相关的一小节，不要发散。
2. 在本机或本站 Demo 里最小复现：只验证一个行为。
3. 故意制造一个错误（错参数、错顺序、错环境），观察报错信息。
4. 改对后再总结：「正确做法 / 错误做法 / 如何排查」三行笔记。
5. 做本节测验；错题收入错题本，隔天再测一次。`,
      },
      {
        type: "text",
        title: "踩坑与排障",
        body: `· 文档示例能跑、自己环境不能：先对齐版本与配置，再怀疑代码。
· 「好像懂了」但默写不出来：回去做最小复现，而不是再看一遍视频。
· 多个概念一起崩：二分法缩小范围（注释一半配置/代码）。
· 与「cap-consistency」相关的问题，优先查官方 FAQ 与 issue 里的 breaking change。
· 生产环境多一项：可观测性（日志/指标）和回滚策略。`,
      },
      {
        type: "text",
        title: "面试 / 复盘一问",
        body: `请用 90 秒回答：什么是一致性与分布式直觉？它解决什么问题？举一个你会在项目里使用（或拒绝使用）的场景，并说明取舍。

加分项：对比一个替代方案，并说出性能、复杂度或可维护性上的差异。`,
      },
      {
        type: "code",
        title: "示例 SQL",
        lang: "sql",
        code: `-- 一致性与分布式直觉
-- 请在工坊/本地执行并观察结果
SELECT 1 AS ok; -- 占位：结合本课主题改写`,
      },
      {
        type: "code",
        title: "自检清单（注释版）",
        lang: "text",
        code: `// [ ] 能用自己的话解释：一致性与分布式直觉
// [ ] 能默写最小示例
// [ ] 能说出 2 个踩坑
// [ ] 能在项目场景里决定用/不用`,
      },
      {
        type: "tip",
        body: `先求「能复现 + 能讲清」，再求「背全 API」。本课 Demo 与测验就是你的验收标准。`,
      },
      {
        type: "quiz",
        questions: [
          {
            id: "cap-consistency-1f91-1",
            question: "关于「一致性与分布式直觉」，最准确的理解是？",
            options: ["只需要记住名词即可", "要同时理解问题、机制、适用边界与常见坑", "与实践无关", "只能在考试中使用"],
            answer: 1,
            explain: "概念 + 机制 + 边界 + 排障，才是可迁移的掌握。",
          },
          {
            id: "cap-consistency-1f91-2",
            question: "学习「一致性与分布式直觉」时，优先行动是？",
            options: ["一次看完所有周边主题", "最小复现一个行为，再扩展", "只收藏文档不动手", "跳过报错信息"],
            answer: 1,
            explain: "最小复现建立反馈回路。",
          },
          {
            id: "cap-consistency-1f91-3",
            question: "遇到「示例能跑、自己环境不能」时，你应先？",
            options: ["重写整个项目", "对齐版本/配置并阅读完整报错", "忽略错误继续下一步", "删除全部依赖"],
            answer: 1,
            explain: "环境与版本是第一怀疑对象。",
          },
        ],
      },
    ],
  },
  {
    slug: "migrations",
    title: "迁移与版本化 schema",
    summary: "SQL migration 与 Mongo 演进。",
    level: "实战",
    track: "工程实践",
    minutes: 12,
    blocks: [
      {
        type: "text",
        title: "概念深讲",
        body: `SQL：Flyway/Liquibase/Prisma migrate 版本化 DDL。Mongo：虽灵活，仍要管理索引与字段演进，避免「隐形 schema 腐化」。

为什么这一节重要：SQL migration 与 Mongo 演进。不只是名词，而是后续所有实践的前提。学习时请同时抓住三件事：① 它解决什么问题；② 核心机制/API 是什么；③ 什么情况下不该用、常见坑是什么。`,
      },
      {
        type: "text",
        title: "机制与关键点",
        body: `围绕「迁移与版本化 schema」，建议你用下面清单自检是否真懂：
· 输入/前置条件是什么？
· 输出/副作用是什么？
· 与相邻概念如何区分？（容易混淆的一对一对比）
· 复杂度或性能上的直觉（是否 O(n)、是否阻塞、是否有状态）
· 在真实项目里通常放在哪一层（入口、中间件、数据层、UI、运维）？

把每个点用自己的话写进笔记；能讲给别人听，才算过关。`,
      },
      {
        type: "text",
        title: "实践步骤",
        body: `1. 只读官方/权威文档里与「迁移与版本化 schema」直接相关的一小节，不要发散。
2. 在本机或本站 Demo 里最小复现：只验证一个行为。
3. 故意制造一个错误（错参数、错顺序、错环境），观察报错信息。
4. 改对后再总结：「正确做法 / 错误做法 / 如何排查」三行笔记。
5. 做本节测验；错题收入错题本，隔天再测一次。`,
      },
      {
        type: "text",
        title: "踩坑与排障",
        body: `· 文档示例能跑、自己环境不能：先对齐版本与配置，再怀疑代码。
· 「好像懂了」但默写不出来：回去做最小复现，而不是再看一遍视频。
· 多个概念一起崩：二分法缩小范围（注释一半配置/代码）。
· 与「migrations」相关的问题，优先查官方 FAQ 与 issue 里的 breaking change。
· 生产环境多一项：可观测性（日志/指标）和回滚策略。`,
      },
      {
        type: "text",
        title: "面试 / 复盘一问",
        body: `请用 90 秒回答：什么是迁移与版本化 schema？它解决什么问题？举一个你会在项目里使用（或拒绝使用）的场景，并说明取舍。

加分项：对比一个替代方案，并说出性能、复杂度或可维护性上的差异。`,
      },
      {
        type: "code",
        title: "对应源码",
        lang: "sql",
        code: `001_create_users.sql
002_add_orders_status_index.sql`,
      },
      {
        type: "code",
        title: "自检清单（注释版）",
        lang: "text",
        code: `// [ ] 能用自己的话解释：迁移与版本化 schema
// [ ] 能默写最小示例
// [ ] 能说出 2 个踩坑
// [ ] 能在项目场景里决定用/不用`,
      },
      {
        type: "tip",
        body: `先求「能复现 + 能讲清」，再求「背全 API」。本课 Demo 与测验就是你的验收标准。`,
      },
      {
        type: "quiz",
        questions: [
          {
            id: "migrations-2d16-1",
            question: "关于「迁移与版本化 schema」，最准确的理解是？",
            options: ["只需要记住名词即可", "要同时理解问题、机制、适用边界与常见坑", "与实践无关", "只能在考试中使用"],
            answer: 1,
            explain: "概念 + 机制 + 边界 + 排障，才是可迁移的掌握。",
          },
          {
            id: "migrations-2d16-2",
            question: "学习「迁移与版本化 schema」时，优先行动是？",
            options: ["一次看完所有周边主题", "最小复现一个行为，再扩展", "只收藏文档不动手", "跳过报错信息"],
            answer: 1,
            explain: "最小复现建立反馈回路。",
          },
          {
            id: "migrations-2d16-3",
            question: "遇到「示例能跑、自己环境不能」时，你应先？",
            options: ["重写整个项目", "对齐版本/配置并阅读完整报错", "忽略错误继续下一步", "删除全部依赖"],
            answer: 1,
            explain: "环境与版本是第一怀疑对象。",
          },
        ],
      },
    ],
  },
  {
    slug: "orm-odm",
    title: "ORM / ODM 与原生查询",
    summary: "Prisma、Drizzle、Mongoose 定位。",
    level: "实战",
    track: "工程实践",
    minutes: 12,
    blocks: [
      {
        type: "text",
        title: "概念深讲",
        body: `ORM/ODM 提升生产力，但复杂报表/窗口函数/聚合仍常回退原生 SQL 或 aggregate。理解生成的查询，避免 N+1。

为什么这一节重要：Prisma、Drizzle、Mongoose 定位。不只是名词，而是后续所有实践的前提。学习时请同时抓住三件事：① 它解决什么问题；② 核心机制/API 是什么；③ 什么情况下不该用、常见坑是什么。`,
      },
      {
        type: "text",
        title: "机制与关键点",
        body: `围绕「ORM / ODM 与原生查询」，建议你用下面清单自检是否真懂：
· 输入/前置条件是什么？
· 输出/副作用是什么？
· 与相邻概念如何区分？（容易混淆的一对一对比）
· 复杂度或性能上的直觉（是否 O(n)、是否阻塞、是否有状态）
· 在真实项目里通常放在哪一层（入口、中间件、数据层、UI、运维）？

把每个点用自己的话写进笔记；能讲给别人听，才算过关。`,
      },
      {
        type: "text",
        title: "实践步骤",
        body: `1. 只读官方/权威文档里与「ORM / ODM 与原生查询」直接相关的一小节，不要发散。
2. 在本机或本站 Demo 里最小复现：只验证一个行为。
3. 故意制造一个错误（错参数、错顺序、错环境），观察报错信息。
4. 改对后再总结：「正确做法 / 错误做法 / 如何排查」三行笔记。
5. 做本节测验；错题收入错题本，隔天再测一次。`,
      },
      {
        type: "text",
        title: "踩坑与排障",
        body: `· 文档示例能跑、自己环境不能：先对齐版本与配置，再怀疑代码。
· 「好像懂了」但默写不出来：回去做最小复现，而不是再看一遍视频。
· 多个概念一起崩：二分法缩小范围（注释一半配置/代码）。
· 与「orm-odm」相关的问题，优先查官方 FAQ 与 issue 里的 breaking change。
· 生产环境多一项：可观测性（日志/指标）和回滚策略。`,
      },
      {
        type: "text",
        title: "面试 / 复盘一问",
        body: `请用 90 秒回答：什么是ORM / ODM 与原生查询？它解决什么问题？举一个你会在项目里使用（或拒绝使用）的场景，并说明取舍。

加分项：对比一个替代方案，并说出性能、复杂度或可维护性上的差异。`,
      },
      {
        type: "code",
        title: "示例 SQL",
        lang: "sql",
        code: `-- ORM / ODM 与原生查询
-- 请在工坊/本地执行并观察结果
SELECT 1 AS ok; -- 占位：结合本课主题改写`,
      },
      {
        type: "code",
        title: "自检清单（注释版）",
        lang: "text",
        code: `// [ ] 能用自己的话解释：ORM / ODM 与原生查询
// [ ] 能默写最小示例
// [ ] 能说出 2 个踩坑
// [ ] 能在项目场景里决定用/不用`,
      },
      {
        type: "tip",
        body: `先求「能复现 + 能讲清」，再求「背全 API」。本课 Demo 与测验就是你的验收标准。`,
      },
      {
        type: "quiz",
        questions: [
          {
            id: "orm-odm-06a2-1",
            question: "关于「ORM / ODM 与原生查询」，最准确的理解是？",
            options: ["只需要记住名词即可", "要同时理解问题、机制、适用边界与常见坑", "与实践无关", "只能在考试中使用"],
            answer: 1,
            explain: "概念 + 机制 + 边界 + 排障，才是可迁移的掌握。",
          },
          {
            id: "orm-odm-06a2-2",
            question: "学习「ORM / ODM 与原生查询」时，优先行动是？",
            options: ["一次看完所有周边主题", "最小复现一个行为，再扩展", "只收藏文档不动手", "跳过报错信息"],
            answer: 1,
            explain: "最小复现建立反馈回路。",
          },
          {
            id: "orm-odm-06a2-3",
            question: "遇到「示例能跑、自己环境不能」时，你应先？",
            options: ["重写整个项目", "对齐版本/配置并阅读完整报错", "忽略错误继续下一步", "删除全部依赖"],
            answer: 1,
            explain: "环境与版本是第一怀疑对象。",
          },
        ],
      },
    ],
  },
  {
    slug: "backup-ops",
    title: "备份与基本运维",
    summary: "备份、恢复、监控指标。",
    level: "实战",
    track: "工程实践",
    minutes: 12,
    blocks: [
      {
        type: "text",
        title: "概念深讲",
        body: `定期备份 + 恢复演练；监控连接数、慢查询、复制延迟、磁盘；权限最小；变更窗口。

为什么这一节重要：备份、恢复、监控指标。不只是名词，而是后续所有实践的前提。学习时请同时抓住三件事：① 它解决什么问题；② 核心机制/API 是什么；③ 什么情况下不该用、常见坑是什么。`,
      },
      {
        type: "text",
        title: "机制与关键点",
        body: `围绕「备份与基本运维」，建议你用下面清单自检是否真懂：
· 输入/前置条件是什么？
· 输出/副作用是什么？
· 与相邻概念如何区分？（容易混淆的一对一对比）
· 复杂度或性能上的直觉（是否 O(n)、是否阻塞、是否有状态）
· 在真实项目里通常放在哪一层（入口、中间件、数据层、UI、运维）？

把每个点用自己的话写进笔记；能讲给别人听，才算过关。`,
      },
      {
        type: "text",
        title: "实践步骤",
        body: `1. 只读官方/权威文档里与「备份与基本运维」直接相关的一小节，不要发散。
2. 在本机或本站 Demo 里最小复现：只验证一个行为。
3. 故意制造一个错误（错参数、错顺序、错环境），观察报错信息。
4. 改对后再总结：「正确做法 / 错误做法 / 如何排查」三行笔记。
5. 做本节测验；错题收入错题本，隔天再测一次。`,
      },
      {
        type: "text",
        title: "踩坑与排障",
        body: `· 文档示例能跑、自己环境不能：先对齐版本与配置，再怀疑代码。
· 「好像懂了」但默写不出来：回去做最小复现，而不是再看一遍视频。
· 多个概念一起崩：二分法缩小范围（注释一半配置/代码）。
· 与「backup-ops」相关的问题，优先查官方 FAQ 与 issue 里的 breaking change。
· 生产环境多一项：可观测性（日志/指标）和回滚策略。`,
      },
      {
        type: "text",
        title: "面试 / 复盘一问",
        body: `请用 90 秒回答：什么是备份与基本运维？它解决什么问题？举一个你会在项目里使用（或拒绝使用）的场景，并说明取舍。

加分项：对比一个替代方案，并说出性能、复杂度或可维护性上的差异。`,
      },
      {
        type: "code",
        title: "示例 SQL",
        lang: "sql",
        code: `-- 备份与基本运维
-- 请在工坊/本地执行并观察结果
SELECT 1 AS ok; -- 占位：结合本课主题改写`,
      },
      {
        type: "code",
        title: "自检清单（注释版）",
        lang: "text",
        code: `// [ ] 能用自己的话解释：备份与基本运维
// [ ] 能默写最小示例
// [ ] 能说出 2 个踩坑
// [ ] 能在项目场景里决定用/不用`,
      },
      {
        type: "tip",
        body: `先求「能复现 + 能讲清」，再求「背全 API」。本课 Demo 与测验就是你的验收标准。`,
      },
      {
        type: "quiz",
        questions: [
          {
            id: "backup-ops-02f6-1",
            question: "关于「备份与基本运维」，最准确的理解是？",
            options: ["只需要记住名词即可", "要同时理解问题、机制、适用边界与常见坑", "与实践无关", "只能在考试中使用"],
            answer: 1,
            explain: "概念 + 机制 + 边界 + 排障，才是可迁移的掌握。",
          },
          {
            id: "backup-ops-02f6-2",
            question: "学习「备份与基本运维」时，优先行动是？",
            options: ["一次看完所有周边主题", "最小复现一个行为，再扩展", "只收藏文档不动手", "跳过报错信息"],
            answer: 1,
            explain: "最小复现建立反馈回路。",
          },
          {
            id: "backup-ops-02f6-3",
            question: "遇到「示例能跑、自己环境不能」时，你应先？",
            options: ["重写整个项目", "对齐版本/配置并阅读完整报错", "忽略错误继续下一步", "删除全部依赖"],
            answer: 1,
            explain: "环境与版本是第一怀疑对象。",
          },
        ],
      },
    ],
  },
  {
    slug: "capstone",
    title: "毕业：双栈小项目清单",
    summary: "用 SQL + Mongo 各做一个小服务。",
    level: "实战",
    track: "工程实践",
    format: "course",
    minutes: 12,
    blocks: [
      {
        type: "text",
        title: "概念深讲",
        body: `1) PostgreSQL：用户/订单/商品 REST，含 JOIN 报表。2) MongoDB：带评论内嵌的文章 API + 聚合热门标签。3) 写一篇选型笔记：为什么这里用表/文档。

为什么这一节重要：用 SQL + Mongo 各做一个小服务。不只是名词，而是后续所有实践的前提。学习时请同时抓住三件事：① 它解决什么问题；② 核心机制/API 是什么；③ 什么情况下不该用、常见坑是什么。`,
      },
      {
        type: "text",
        title: "机制与关键点",
        body: `围绕「毕业：双栈小项目清单」，建议你用下面清单自检是否真懂：
· 输入/前置条件是什么？
· 输出/副作用是什么？
· 与相邻概念如何区分？（容易混淆的一对一对比）
· 复杂度或性能上的直觉（是否 O(n)、是否阻塞、是否有状态）
· 在真实项目里通常放在哪一层（入口、中间件、数据层、UI、运维）？

把每个点用自己的话写进笔记；能讲给别人听，才算过关。`,
      },
      {
        type: "text",
        title: "实践步骤",
        body: `1. 只读官方/权威文档里与「毕业：双栈小项目清单」直接相关的一小节，不要发散。
2. 在本机或本站 Demo 里最小复现：只验证一个行为。
3. 故意制造一个错误（错参数、错顺序、错环境），观察报错信息。
4. 改对后再总结：「正确做法 / 错误做法 / 如何排查」三行笔记。
5. 做本节测验；错题收入错题本，隔天再测一次。`,
      },
      {
        type: "text",
        title: "踩坑与排障",
        body: `· 文档示例能跑、自己环境不能：先对齐版本与配置，再怀疑代码。
· 「好像懂了」但默写不出来：回去做最小复现，而不是再看一遍视频。
· 多个概念一起崩：二分法缩小范围（注释一半配置/代码）。
· 与「capstone」相关的问题，优先查官方 FAQ 与 issue 里的 breaking change。
· 生产环境多一项：可观测性（日志/指标）和回滚策略。`,
      },
      {
        type: "text",
        title: "面试 / 复盘一问",
        body: `请用 90 秒回答：什么是毕业：双栈小项目清单？它解决什么问题？举一个你会在项目里使用（或拒绝使用）的场景，并说明取舍。

加分项：对比一个替代方案，并说出性能、复杂度或可维护性上的差异。`,
      },
      {
        type: "code",
        title: "示例 SQL",
        lang: "sql",
        code: `-- 毕业：双栈小项目清单
-- 请在工坊/本地执行并观察结果
SELECT 1 AS ok; -- 占位：结合本课主题改写`,
      },
      {
        type: "code",
        title: "自检清单（注释版）",
        lang: "text",
        code: `// [ ] 能用自己的话解释：毕业：双栈小项目清单
// [ ] 能默写最小示例
// [ ] 能说出 2 个踩坑
// [ ] 能在项目场景里决定用/不用`,
      },
      {
        type: "tip",
        body: `先求「能复现 + 能讲清」，再求「背全 API」。本课 Demo 与测验就是你的验收标准。`,
      },
      {
        type: "quiz",
        questions: [
          {
            id: "capstone-ca72-1",
            question: "关于「毕业：双栈小项目清单」，最准确的理解是？",
            options: ["只需要记住名词即可", "要同时理解问题、机制、适用边界与常见坑", "与实践无关", "只能在考试中使用"],
            answer: 1,
            explain: "概念 + 机制 + 边界 + 排障，才是可迁移的掌握。",
          },
          {
            id: "capstone-ca72-2",
            question: "学习「毕业：双栈小项目清单」时，优先行动是？",
            options: ["一次看完所有周边主题", "最小复现一个行为，再扩展", "只收藏文档不动手", "跳过报错信息"],
            answer: 1,
            explain: "最小复现建立反馈回路。",
          },
          {
            id: "capstone-ca72-3",
            question: "遇到「示例能跑、自己环境不能」时，你应先？",
            options: ["重写整个项目", "对齐版本/配置并阅读完整报错", "忽略错误继续下一步", "删除全部依赖"],
            answer: 1,
            explain: "环境与版本是第一怀疑对象。",
          },
        ],
      },
    ],
  },
  {
    slug: "ref-postgres-types",
    title: "知识卡：PostgreSQL 类型速览",
    summary: "常用类型与 JSONB。",
    level: "进阶",
    track: "知识卡片",
    format: "reference",
    minutes: 12,
    blocks: [
      {
        type: "text",
        title: "概念深讲",
        body: `int/bigint、numeric、text、bool、timestamptz、uuid、jsonb、array。jsonb 可建 GIN 索引，适合半结构化列。

为什么这一节重要：常用类型与 JSONB。不只是名词，而是后续所有实践的前提。学习时请同时抓住三件事：① 它解决什么问题；② 核心机制/API 是什么；③ 什么情况下不该用、常见坑是什么。`,
      },
      {
        type: "text",
        title: "机制与关键点",
        body: `围绕「知识卡：PostgreSQL 类型速览」，建议你用下面清单自检是否真懂：
· 输入/前置条件是什么？
· 输出/副作用是什么？
· 与相邻概念如何区分？（容易混淆的一对一对比）
· 复杂度或性能上的直觉（是否 O(n)、是否阻塞、是否有状态）
· 在真实项目里通常放在哪一层（入口、中间件、数据层、UI、运维）？

把每个点用自己的话写进笔记；能讲给别人听，才算过关。`,
      },
      {
        type: "text",
        title: "实践步骤",
        body: `1. 只读官方/权威文档里与「知识卡：PostgreSQL 类型速览」直接相关的一小节，不要发散。
2. 在本机或本站 Demo 里最小复现：只验证一个行为。
3. 故意制造一个错误（错参数、错顺序、错环境），观察报错信息。
4. 改对后再总结：「正确做法 / 错误做法 / 如何排查」三行笔记。
5. 做本节测验；错题收入错题本，隔天再测一次。`,
      },
      {
        type: "text",
        title: "踩坑与排障",
        body: `· 文档示例能跑、自己环境不能：先对齐版本与配置，再怀疑代码。
· 「好像懂了」但默写不出来：回去做最小复现，而不是再看一遍视频。
· 多个概念一起崩：二分法缩小范围（注释一半配置/代码）。
· 与「ref-postgres-types」相关的问题，优先查官方 FAQ 与 issue 里的 breaking change。
· 生产环境多一项：可观测性（日志/指标）和回滚策略。`,
      },
      {
        type: "text",
        title: "面试 / 复盘一问",
        body: `请用 90 秒回答：什么是知识卡：PostgreSQL 类型速览？它解决什么问题？举一个你会在项目里使用（或拒绝使用）的场景，并说明取舍。

加分项：对比一个替代方案，并说出性能、复杂度或可维护性上的差异。`,
      },
      {
        type: "code",
        title: "对应源码",
        lang: "sql",
        code: `-- SELECT data->>'email' FROM events WHERE data @> '{\\"type\\":\\"signup\\"}';`,
      },
      {
        type: "code",
        title: "自检清单（注释版）",
        lang: "text",
        code: `// [ ] 能用自己的话解释：知识卡：PostgreSQL 类型速览
// [ ] 能默写最小示例
// [ ] 能说出 2 个踩坑
// [ ] 能在项目场景里决定用/不用`,
      },
      {
        type: "tip",
        body: `先求「能复现 + 能讲清」，再求「背全 API」。本课 Demo 与测验就是你的验收标准。`,
      },
      {
        type: "quiz",
        questions: [
          {
            id: "ref-postgres-types-1ad6-1",
            question: "关于「知识卡：PostgreSQL 类型速览」，最准确的理解是？",
            options: ["只需要记住名词即可", "要同时理解问题、机制、适用边界与常见坑", "与实践无关", "只能在考试中使用"],
            answer: 1,
            explain: "概念 + 机制 + 边界 + 排障，才是可迁移的掌握。",
          },
          {
            id: "ref-postgres-types-1ad6-2",
            question: "学习「知识卡：PostgreSQL 类型速览」时，优先行动是？",
            options: ["一次看完所有周边主题", "最小复现一个行为，再扩展", "只收藏文档不动手", "跳过报错信息"],
            answer: 1,
            explain: "最小复现建立反馈回路。",
          },
          {
            id: "ref-postgres-types-1ad6-3",
            question: "遇到「示例能跑、自己环境不能」时，你应先？",
            options: ["重写整个项目", "对齐版本/配置并阅读完整报错", "忽略错误继续下一步", "删除全部依赖"],
            answer: 1,
            explain: "环境与版本是第一怀疑对象。",
          },
        ],
      },
    ],
  },
  {
    slug: "ref-mongo-transactions",
    title: "知识卡：Mongo 多文档事务",
    summary: "会话与事务边界。",
    level: "进阶",
    track: "知识卡片",
    format: "reference",
    minutes: 12,
    blocks: [
      {
        type: "text",
        title: "概念深讲",
        body: `副本集/分片上可开 multi-document transactions。有成本：优先用单文档原子性与合理内嵌。

为什么这一节重要：会话与事务边界。不只是名词，而是后续所有实践的前提。学习时请同时抓住三件事：① 它解决什么问题；② 核心机制/API 是什么；③ 什么情况下不该用、常见坑是什么。`,
      },
      {
        type: "text",
        title: "机制与关键点",
        body: `围绕「知识卡：Mongo 多文档事务」，建议你用下面清单自检是否真懂：
· 输入/前置条件是什么？
· 输出/副作用是什么？
· 与相邻概念如何区分？（容易混淆的一对一对比）
· 复杂度或性能上的直觉（是否 O(n)、是否阻塞、是否有状态）
· 在真实项目里通常放在哪一层（入口、中间件、数据层、UI、运维）？

把每个点用自己的话写进笔记；能讲给别人听，才算过关。`,
      },
      {
        type: "text",
        title: "实践步骤",
        body: `1. 只读官方/权威文档里与「知识卡：Mongo 多文档事务」直接相关的一小节，不要发散。
2. 在本机或本站 Demo 里最小复现：只验证一个行为。
3. 故意制造一个错误（错参数、错顺序、错环境），观察报错信息。
4. 改对后再总结：「正确做法 / 错误做法 / 如何排查」三行笔记。
5. 做本节测验；错题收入错题本，隔天再测一次。`,
      },
      {
        type: "text",
        title: "踩坑与排障",
        body: `· 文档示例能跑、自己环境不能：先对齐版本与配置，再怀疑代码。
· 「好像懂了」但默写不出来：回去做最小复现，而不是再看一遍视频。
· 多个概念一起崩：二分法缩小范围（注释一半配置/代码）。
· 与「ref-mongo-transactions」相关的问题，优先查官方 FAQ 与 issue 里的 breaking change。
· 生产环境多一项：可观测性（日志/指标）和回滚策略。`,
      },
      {
        type: "text",
        title: "面试 / 复盘一问",
        body: `请用 90 秒回答：什么是知识卡：Mongo 多文档事务？它解决什么问题？举一个你会在项目里使用（或拒绝使用）的场景，并说明取舍。

加分项：对比一个替代方案，并说出性能、复杂度或可维护性上的差异。`,
      },
      {
        type: "code",
        title: "示例 SQL",
        lang: "sql",
        code: `-- 知识卡：Mongo 多文档事务
-- 请在工坊/本地执行并观察结果
SELECT 1 AS ok; -- 占位：结合本课主题改写`,
      },
      {
        type: "code",
        title: "自检清单（注释版）",
        lang: "text",
        code: `// [ ] 能用自己的话解释：知识卡：Mongo 多文档事务
// [ ] 能默写最小示例
// [ ] 能说出 2 个踩坑
// [ ] 能在项目场景里决定用/不用`,
      },
      {
        type: "tip",
        body: `先求「能复现 + 能讲清」，再求「背全 API」。本课 Demo 与测验就是你的验收标准。`,
      },
      {
        type: "quiz",
        questions: [
          {
            id: "ref-mongo-transactions-bafa-1",
            question: "关于「知识卡：Mongo 多文档事务」，最准确的理解是？",
            options: ["只需要记住名词即可", "要同时理解问题、机制、适用边界与常见坑", "与实践无关", "只能在考试中使用"],
            answer: 1,
            explain: "概念 + 机制 + 边界 + 排障，才是可迁移的掌握。",
          },
          {
            id: "ref-mongo-transactions-bafa-2",
            question: "学习「知识卡：Mongo 多文档事务」时，优先行动是？",
            options: ["一次看完所有周边主题", "最小复现一个行为，再扩展", "只收藏文档不动手", "跳过报错信息"],
            answer: 1,
            explain: "最小复现建立反馈回路。",
          },
          {
            id: "ref-mongo-transactions-bafa-3",
            question: "遇到「示例能跑、自己环境不能」时，你应先？",
            options: ["重写整个项目", "对齐版本/配置并阅读完整报错", "忽略错误继续下一步", "删除全部依赖"],
            answer: 1,
            explain: "环境与版本是第一怀疑对象。",
          },
        ],
      },
    ],
  },
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
