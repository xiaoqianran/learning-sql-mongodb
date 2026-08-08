# SQL & MongoDB 实战学习

交互式中文教程：关系型 SQL + 文档型 MongoDB 双轨，课程 · 测验 · 进度 · 浏览器内 Playground · 查询工坊。

**在线访问（部署后）：** https://xiaoqianran.github.io/learning-sql-mongodb/  
**仓库：** https://github.com/xiaoqianran/learning-sql-mongodb

参考姊妹项目：[learning-vue3](https://github.com/xiaoqianran/learning-vue3)

---

## 这是什么

面向想系统学习 **SQL（关系型）** 与 **MongoDB（文档型）** 的同学。内容以「读一点、跑一点、测一点」组织。

你可以：

- 按路径学习 **30+ 节** 课程（讲解 + 示例查询 + 可运行 Demo + 小测验）
- 在 **Playground** 里自由写 SQL / Mongo 命令（浏览器内存引擎 + 商店示例数据）
- 在 **查询工坊** 闯关：结果与标准答案校验
- 用 **速查表 / 文档地图 / 学习中心 / 错题本 / 结业证明** 跟进度

> 说明：站内 SQL/Mongo 引擎为**教学子集**，用于理解语法与结果形态，并非完整数据库服务器。

---

## 功能一览

| 模块 | 路径 | 说明 |
|------|------|------|
| 课程 | `/lesson/:slug` | 正文、示例、可运行 Demo、测验、笔记 |
| 首页大纲 | `/` | 搜索、路径筛选、进度 |
| Playground | `/playground` | SQL / Mongo 双模式练习 |
| 查询工坊 | `/studio` | 闯关任务 |
| 文档地图 | `/docs` | 官网手册 ↔ 本站课 |
| 速查表 | `/cheatsheet` | 一页语法 |
| 学习中心 | `/hub` | 打卡、收藏、路径进度 |
| 练习场 / 错题本 | `/lab` `/mistakes` | 刷题 |
| 结业证明 | `/certificate` | 主修掌握后解锁 |

---

## 学习路径

| 路径 | 内容 |
|------|------|
| SQL 入门 | SELECT · WHERE · ORDER · 聚合 · JOIN |
| SQL 进阶 | LEFT JOIN · 子查询 · DML · 建表 · 索引 · 事务 · 范式 |
| SQL 实战 | 商店分析 · 注入 · 执行计划 |
| MongoDB 入门 | 文档 · CRUD · 操作符 · 内嵌/引用 |
| MongoDB 进阶 | 聚合管道 · 索引 · 更新操作符 · 模式设计 |
| 对比与选型 | SQL vs Mongo · 一致性直觉 |
| 工程实践 | 迁移 · ORM · 备份 · 毕业清单 |

---

## 本地运行

```bash
git clone https://github.com/xiaoqianran/learning-sql-mongodb.git
cd learning-sql-mongodb
npm install
npm run dev
```

环境：Node 22+ 推荐。开发服务器默认 `0.0.0.0:8080`。

```bash
npm run build        # 生产构建（Vercel）
npm run build:pages  # GitHub Pages
npm run typecheck
```

---

## 技术栈

React 19 · TypeScript · Vite · TanStack Start/Router · Tailwind v4 · Zustand · Catppuccin 主题

自研教学引擎：`src/lib/sql-engine.ts` · `src/lib/mongo-engine.ts`

---

## License

与 learning-vue3 一致，仅供学习交流。
