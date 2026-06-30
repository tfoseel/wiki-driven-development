"use client";

import { useEffect, useId, useState } from "react";

type MermaidDiagramProps = {
  code: string;
};

export function MermaidDiagram({ code }: MermaidDiagramProps) {
  const rawId = useId();
  const diagramId = `wiki-mermaid-${rawId.replace(/[^a-zA-Z0-9_-]/g, "")}`;
  const [svg, setSvg] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function renderDiagram() {
      setError(null);
      setSvg(null);

      try {
        const mermaid = (await import("mermaid")).default;
        mermaid.initialize({
          startOnLoad: false,
          securityLevel: "strict",
          theme: "base",
          themeVariables: {
            primaryColor: "#f3faf7",
            primaryTextColor: "#26302d",
            primaryBorderColor: "#8bbcaf",
            lineColor: "#53605c",
            secondaryColor: "#fffefa",
            tertiaryColor: "#f2f5f1"
          }
        });
        const result = await mermaid.render(diagramId, code);
        if (!cancelled) setSvg(result.svg);
      } catch (cause) {
        if (!cancelled) setError(cause instanceof Error ? cause.message : "Mermaid diagram failed to render.");
      }
    }

    void renderDiagram();

    return () => {
      cancelled = true;
    };
  }, [code, diagramId]);

  return (
    <figure className="wiki-mermaid" aria-label="Mermaid 다이어그램">
      {svg ? <div dangerouslySetInnerHTML={{ __html: svg }} /> : null}
      {!svg && !error ? <p className="wiki-empty">다이어그램 렌더링 중...</p> : null}
      {error ? (
        <figcaption>
          <strong>Mermaid 렌더링 실패</strong>
          <pre>{code}</pre>
          <p>{error}</p>
        </figcaption>
      ) : null}
    </figure>
  );
}
