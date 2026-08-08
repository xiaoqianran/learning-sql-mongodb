import { createFileRoute, Link } from "@tanstack/react-router";
import { DOC_SECTIONS } from "@/data/docs-map";
import { ExternalLink, Library } from "lucide-react";
import { getLesson } from "@/data/lessons";

export const Route = createFileRoute("/docs")({
  component: DocsPage,
});

function DocsPage() {
  return (
    <div className="mx-auto max-w-3xl pb-16">
      <header className="mb-6">
        <p className="inline-flex items-center gap-1.5 text-xs font-medium uppercase tracking-wider text-primary">
          <Library className="h-3.5 w-3.5" />
          文档地图
        </p>
        <h1 className="mt-1 font-display text-2xl font-semibold text-fg sm:text-3xl">
          官方文档 ↔ 本站课程
        </h1>
        <p className="mt-2 text-sm text-muted">
          对照 PostgreSQL 与 MongoDB 官方手册，快速跳到对应课节。
        </p>
      </header>

      <div className="space-y-6">
        {DOC_SECTIONS.map((sec) => (
          <section key={sec.id} className="rounded-xl border border-border bg-surface">
            <div className="border-b border-border px-4 py-3">
              <h2 className="font-display text-base font-semibold text-fg">{sec.title}</h2>
              <p className="mt-0.5 text-xs text-muted">{sec.blurb}</p>
            </div>
            <ul className="divide-y divide-border">
              {sec.links.map((link) => {
                const lesson = link.lessonSlug ? getLesson(link.lessonSlug) : undefined;
                return (
                  <li
                    key={link.href + link.title}
                    className="flex flex-wrap items-center justify-between gap-2 px-4 py-3"
                  >
                    <div className="min-w-0">
                      <a
                        href={link.href}
                        target={link.href.startsWith("http") ? "_blank" : undefined}
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 text-sm font-medium text-fg no-underline hover:text-primary"
                      >
                        {link.title}
                        {link.href.startsWith("http") ? (
                          <ExternalLink className="h-3.5 w-3.5 text-subtle" />
                        ) : null}
                      </a>
                      {link.note ? (
                        <p className="text-xs text-muted">{link.note}</p>
                      ) : null}
                    </div>
                    {lesson ? (
                      <Link
                        to="/lesson/$slug"
                        params={{ slug: lesson.slug }}
                        className="shrink-0 rounded-full bg-primary-soft px-2.5 py-1 text-[11px] font-medium text-primary no-underline"
                      >
                        本站 · {lesson.title}
                      </Link>
                    ) : link.href.startsWith("/") ? (
                      <Link
                        to={link.href as "/studio"}
                        className="shrink-0 text-xs text-primary no-underline"
                      >
                        打开
                      </Link>
                    ) : null}
                  </li>
                );
              })}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}
