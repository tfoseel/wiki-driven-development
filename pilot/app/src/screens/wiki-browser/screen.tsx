import Link from "next/link";
import type { ReactNode } from "react";
import { wikiHref, type WikiBrowserNode } from "../../lib/wiki-browser";

type WikiBrowserScreenProps = {
  current: WikiBrowserNode;
  nodes: WikiBrowserNode[];
};

export function WikiBrowserScreen({ current, nodes }: WikiBrowserScreenProps) {
  return (
    <main className="wiki-shell">
      <aside className="wiki-index" aria-label="Pilot wiki index">
        <h2>Wiki Nodes</h2>
        <ul aria-label="Wiki nodes">
          {nodes.map((node) => (
            <li key={node.id}>
              <Link className="wiki-node-link" href={node.href} aria-current={node.id === current.id ? "page" : undefined}>
                <span className="wiki-type">{node.type}</span>
                <strong>{node.title}</strong>
                <span>{node.id}</span>
              </Link>
            </li>
          ))}
        </ul>
      </aside>

      <article className="wiki-article">
        <header>
          <Link href="/">Mini Booking Pilot</Link>
          <p className="wiki-type">{current.type}</p>
          <h1>{current.title}</h1>
          {current.summary ? <p className="wiki-summary">{current.summary}</p> : null}
        </header>

        <div className="wiki-meta">
          <section>
            <h2>Node</h2>
            <p className="wiki-id">
              <code>{current.id}</code>
            </p>
          </section>
          <section>
            <h2>Source</h2>
            <p className="wiki-file">
              <code>{current.filePath}</code>
            </p>
          </section>
          <section>
            <h2>Depends On</h2>
            {current.dependencies.length ? (
              <ul className="wiki-dependencies">
                {current.dependencies.map((id) => (
                  <li key={id}>
                    <Link href={wikiHref(id)}>{id}</Link>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="wiki-empty">None</p>
            )}
          </section>
        </div>

        <WikiMarkdown title={current.title} body={current.body} />

        <div className="wiki-refs">
          <ReferenceList title="Implementation" refs={current.implementationRefs} />
          <ReferenceList title="Verification" refs={current.verificationRefs} />
        </div>
      </article>
    </main>
  );
}

function ReferenceList({ title, refs }: { title: string; refs: string[] }) {
  return (
    <section>
      <h2>{title}</h2>
      {refs.length ? (
        <ul className="wiki-ref-list">
          {refs.map((ref) => (
            <li key={ref}>
              <code>{ref}</code>
            </li>
          ))}
        </ul>
      ) : (
        <p className="wiki-empty">None</p>
      )}
    </section>
  );
}

function WikiMarkdown({ title, body }: { title: string; body: string }) {
  const lines = body.split(/\r?\n/);
  const firstContentLine = lines.findIndex((line) => line.trim().length > 0);
  if (firstContentLine >= 0 && lines[firstContentLine].trim() === `# ${title}`) {
    lines.splice(firstContentLine, 1);
  }

  const blocks: ReactNode[] = [];
  let index = 0;

  while (index < lines.length) {
    const line = lines[index] ?? "";
    const trimmed = line.trim();
    if (!trimmed) {
      index += 1;
      continue;
    }

    const heading = /^(#{2,4})\s+(.+)$/.exec(trimmed);
    if (heading) {
      const level = heading[1].length;
      const text = heading[2];
      const Tag = (`h${level}` as "h2" | "h3" | "h4");
      blocks.push(<Tag key={blocks.length}>{renderInlineWikiLinks(text)}</Tag>);
      index += 1;
      continue;
    }

    if (trimmed.startsWith("|")) {
      const tableLines: string[] = [];
      while (lines[index]?.trim().startsWith("|")) {
        tableLines.push(lines[index]);
        index += 1;
      }
      blocks.push(
        <pre className="wiki-table" key={blocks.length}>
          {tableLines.join("\n")}
        </pre>
      );
      continue;
    }

    if (trimmed.startsWith("- ")) {
      const items: string[] = [];
      while (lines[index]?.trim().startsWith("- ")) {
        items.push(lines[index].trim().slice(2));
        index += 1;
      }
      blocks.push(
        <ul key={blocks.length}>
          {items.map((item) => (
            <li key={item}>{renderInlineWikiLinks(item)}</li>
          ))}
        </ul>
      );
      continue;
    }

    if (/^\d+\.\s+/.test(trimmed)) {
      const items: string[] = [];
      while (/^\d+\.\s+/.test(lines[index]?.trim() ?? "")) {
        items.push((lines[index] ?? "").trim().replace(/^\d+\.\s+/, ""));
        index += 1;
      }
      blocks.push(
        <ol key={blocks.length}>
          {items.map((item) => (
            <li key={item}>{renderInlineWikiLinks(item)}</li>
          ))}
        </ol>
      );
      continue;
    }

    const paragraphLines: string[] = [];
    while (
      lines[index] &&
      lines[index].trim() &&
      !/^(#{2,4})\s+/.test(lines[index].trim()) &&
      !lines[index].trim().startsWith("|") &&
      !lines[index].trim().startsWith("- ") &&
      !/^\d+\.\s+/.test(lines[index].trim())
    ) {
      paragraphLines.push(lines[index].trim());
      index += 1;
    }
    blocks.push(<p key={blocks.length}>{renderInlineWikiLinks(paragraphLines.join(" "))}</p>);
  }

  return <div className="wiki-body">{blocks}</div>;
}

function renderInlineWikiLinks(text: string): ReactNode[] {
  const parts: ReactNode[] = [];
  const pattern = /\[\[([^\]]+)\]\]/g;
  let lastIndex = 0;
  let match = pattern.exec(text);

  while (match) {
    if (match.index > lastIndex) parts.push(text.slice(lastIndex, match.index));
    const id = match[1];
    parts.push(
      <Link href={wikiHref(id)} key={`${id}-${match.index}`}>
        {id}
      </Link>
    );
    lastIndex = match.index + match[0].length;
    match = pattern.exec(text);
  }

  if (lastIndex < text.length) parts.push(text.slice(lastIndex));
  return parts;
}
