import Link from "next/link";

export default function HomePage() {
  return (
    <main className="page-shell home-page">
      <h1>미니 예약 파일럿</h1>
      <p>위키를 단일 진실 공급원으로 삼는 작은 예약 앱.</p>
      <div className="home-actions">
        <Link href="/wiki">파일럿 위키 열기</Link>
        <Link href="/services">서비스 선택하기</Link>
      </div>
    </main>
  );
}
