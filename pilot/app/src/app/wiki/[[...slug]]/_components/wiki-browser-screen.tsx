import Link from "next/link";
import type { ReactNode } from "react";
import type { WddStatus } from "@wdd/harness";
import {
  filterWikiNodesByType,
  listWikiTypeTabs,
  wikiHref,
  wikiHrefWithType,
  type WikiBrowserNode,
  type WikiTypeTab
} from "../../_lib/wiki-browser";

type WikiBrowserScreenProps = {
  current: WikiBrowserNode;
  nodes: WikiBrowserNode[];
  selectedType: WikiTypeTab;
};

export function WikiBrowserScreen({ current, nodes, selectedType }: WikiBrowserScreenProps) {
  const tabs = listWikiTypeTabs(nodes);
  const visibleNodes = filterWikiNodesByType(nodes, selectedType);

  return (
    <main className="wiki-shell">
      <aside className="wiki-index" aria-label="파일럿 위키 인덱스">
        <h2>위키 노드</h2>
        <nav className="wiki-tabs" aria-label="위키 노드 유형" role="tablist">
          {tabs.map((tab) => (
            <Link
              key={tab.type}
              className="wiki-tab"
              href={wikiHrefWithType(current.id, tab.type)}
              scroll={false}
              role="tab"
              aria-selected={selectedType === tab.type}
            >
              <span>{tab.label}</span>
              <strong>{tab.count}</strong>
            </Link>
          ))}
        </nav>
        <ul aria-label="위키 노드">
          {visibleNodes.map((node) => (
            <li key={node.id}>
              <Link
                className="wiki-node-link"
                href={wikiHrefWithType(node.id, selectedType)}
                scroll={false}
                aria-current={node.id === current.id ? "page" : undefined}
              >
                <span className="wiki-type" aria-hidden="true">
                  {node.type}
                </span>
                <strong>{node.title}</strong>
                <span>{node.id}</span>
              </Link>
            </li>
          ))}
        </ul>
      </aside>

      <article className="wiki-article">
        <header>
          <Link href="/">미니 예약 파일럿</Link>
          <p className="wiki-type">{current.type}</p>
          <h1>{current.title}</h1>
          {current.summary ? <p className="wiki-summary">{current.summary}</p> : null}
        </header>

        <div className="wiki-meta">
          <section>
            <h2>노드</h2>
            <p className="wiki-id">
              <code>{current.id}</code>
            </p>
          </section>
          <section>
            <h2>원본</h2>
            <p className="wiki-file">
              <code>{current.filePath}</code>
            </p>
          </section>
          <section>
            <h2>의존</h2>
            {current.dependencies.length ? (
              <ul className="wiki-dependencies">
                {current.dependencies.map((id) => (
                  <li key={id}>
                    <Link href={wikiHref(id)}>{id}</Link>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="wiki-empty">없음</p>
            )}
          </section>
          <WorkflowStatus status={current.wddStatus} />
        </div>

        <WikiMarkdown title={current.title} body={current.body} />

        <div className="wiki-refs">
          <ReferenceList title="구현" refs={current.implementationRefs} />
          <ReferenceList title="검증" refs={current.verificationRefs} />
        </div>
      </article>
    </main>
  );
}

const PHASE_LABELS: Record<WddStatus["phase"], string> = {
  wiki: "위키 수정 중",
  coding: "코딩 필요",
  verification: "검증 필요",
  verified: "검증 완료",
  blocked: "차단됨"
};

const CODE_LABELS: Record<WddStatus["code"], string> = {
  pending: "코드 미반영",
  reflected: "코드 반영됨",
  not_required: "코드 불필요"
};

const VERIFICATION_LABELS: Record<WddStatus["verification"], string> = {
  pending: "검증 대기",
  passed: "검증 통과",
  failed: "검증 실패",
  not_required: "검증 불필요"
};

function WorkflowStatus({ status }: { status: WddStatus }) {
  return (
    <section className={`wiki-status wiki-status-${status.phase}`}>
      <h2>작업 정합성</h2>
      <p>현재 phase: {PHASE_LABELS[status.phase]}</p>
      <p>{CODE_LABELS[status.code]}</p>
      <p>{VERIFICATION_LABELS[status.verification]}</p>
      {status.note ? <p>{status.note}</p> : null}
    </section>
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
        <p className="wiki-empty">없음</p>
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
      const table = parseMarkdownTable(tableLines);
      blocks.push(table ? <MarkdownTable key={blocks.length} table={table} /> : <PreformattedTable key={blocks.length} lines={tableLines} />);
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

type MarkdownTableData = {
  headers: string[];
  rows: string[][];
};

function MarkdownTable({ table }: { table: MarkdownTableData }) {
  return (
    <div className="wiki-table-wrap">
      <table className="wiki-table">
        <thead>
          <tr>
            {table.headers.map((header, index) => (
              <th key={`${header}-${index}`} scope="col">
                {renderInlineWikiLinks(header)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {table.rows.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {table.headers.map((_, cellIndex) => (
                <td key={cellIndex}>{renderInlineWikiLinks(row[cellIndex] ?? "")}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function PreformattedTable({ lines }: { lines: string[] }) {
  return (
    <pre className="wiki-table-fallback">
      {lines.join("\n")}
    </pre>
  );
}

function parseMarkdownTable(lines: string[]): MarkdownTableData | undefined {
  if (lines.length < 2) return undefined;
  const rows = lines.map(splitMarkdownTableRow);
  const [headers, separator, ...bodyRows] = rows;
  if (!headers.length || !separator.every(isMarkdownTableSeparator)) return undefined;
  return {
    headers,
    rows: bodyRows.filter((row) => row.some((cell) => cell.trim()))
  };
}

function splitMarkdownTableRow(line: string): string[] {
  return line
    .trim()
    .replace(/^\|/, "")
    .replace(/\|$/, "")
    .split("|")
    .map((cell) => cell.trim());
}

function isMarkdownTableSeparator(cell: string): boolean {
  return /^:?-{3,}:?$/.test(cell.replace(/\s/g, ""));
}

function renderInlineWikiLinks(text: string): ReactNode[] {
  const parts: ReactNode[] = [];
  const pattern = /(`([^`]+)`|\[\[([^\]]+)\]\])/g;
  let lastIndex = 0;
  let match = pattern.exec(text);

  while (match) {
    if (match.index > lastIndex) parts.push(text.slice(lastIndex, match.index));
    const code = match[2];
    const id = match[3];
    if (code) {
      parts.push(<code key={`${code}-${match.index}`}>{code}</code>);
    } else if (id) {
      parts.push(
        <Link href={wikiHref(id)} key={`${id}-${match.index}`}>
          {id}
        </Link>
      );
    }
    lastIndex = match.index + match[0].length;
    match = pattern.exec(text);
  }

  if (lastIndex < text.length) parts.push(text.slice(lastIndex));
  return parts;
}
