export type DocLink = {
  title: string;
  href: string;
  lessonSlug?: string;
  note?: string;
};

export type DocSection = {
  id: string;
  title: string;
  blurb: string;
  links: DocLink[];
};

export const DOC_SECTIONS: DocSection[] = [
  {
    id: "sql",
    title: "SQL / PostgreSQL",
    blurb: "关系型查询与 PostgreSQL 官方文档精选。",
    links: [
      {
        title: "SQL Tutorial",
        href: "https://www.postgresql.org/docs/current/tutorial-sql.html",
        lessonSlug: "intro",
      },
      {
        title: "SELECT",
        href: "https://www.postgresql.org/docs/current/sql-select.html",
        lessonSlug: "select-basics",
      },
      {
        title: "Joins",
        href: "https://www.postgresql.org/docs/current/tutorial-join.html",
        lessonSlug: "join-intro",
      },
      {
        title: "Indexes",
        href: "https://www.postgresql.org/docs/current/indexes.html",
        lessonSlug: "indexes",
      },
      {
        title: "Transactions",
        href: "https://www.postgresql.org/docs/current/tutorial-transactions.html",
        lessonSlug: "transactions",
      },
      {
        title: "JSON Types",
        href: "https://www.postgresql.org/docs/current/datatype-json.html",
        lessonSlug: "ref-postgres-types",
      },
    ],
  },
  {
    id: "mongo",
    title: "MongoDB Manual",
    blurb: "文档模型、CRUD 与聚合。",
    links: [
      {
        title: "Introduction",
        href: "https://www.mongodb.com/docs/manual/introduction/",
        lessonSlug: "mongo-intro",
      },
      {
        title: "CRUD",
        href: "https://www.mongodb.com/docs/manual/crud/",
        lessonSlug: "mongo-crud",
      },
      {
        title: "Query Documents",
        href: "https://www.mongodb.com/docs/manual/tutorial/query-documents/",
        lessonSlug: "mongo-query-ops",
      },
      {
        title: "Aggregation",
        href: "https://www.mongodb.com/docs/manual/aggregation/",
        lessonSlug: "mongo-aggregate",
      },
      {
        title: "Indexes",
        href: "https://www.mongodb.com/docs/manual/indexes/",
        lessonSlug: "mongo-indexes",
      },
      {
        title: "Data Modeling",
        href: "https://www.mongodb.com/docs/manual/core/data-modeling-introduction/",
        lessonSlug: "mongo-embed-ref",
      },
      {
        title: "Transactions",
        href: "https://www.mongodb.com/docs/manual/core/transactions/",
        lessonSlug: "ref-mongo-transactions",
      },
    ],
  },
  {
    id: "security",
    title: "安全与工程",
    blurb: "注入、迁移与运维意识。",
    links: [
      {
        title: "OWASP SQL Injection",
        href: "https://owasp.org/www-community/attacks/SQL_Injection",
        lessonSlug: "sql-injection",
      },
      {
        title: "本站工坊",
        href: "/studio",
        note: "站内闯关",
      },
      {
        title: "Playground",
        href: "/playground",
        note: "站内练习",
      },
    ],
  },
];
