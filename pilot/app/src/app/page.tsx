import Link from "next/link";

export default function HomePage() {
  const wikiUrl = process.env.NEXT_PUBLIC_WIKI_URL ?? "http://127.0.0.1:3002/wiki";

  return (
    <main className="page-shell home-page">
      <h1>미니 예약 파일럿</h1>
      <p>위키를 단일 진실 공급원으로 삼는 작은 예약 앱.</p>
      <div className="home-actions">
        <a href={wikiUrl}>파일럿 위키 열기</a>
        <Link href="/services">서비스 선택하기</Link>
      </div>
    </main>
  );
}
