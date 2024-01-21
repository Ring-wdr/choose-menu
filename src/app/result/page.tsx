import { Button } from "@/components/ui/button";
import Link from "next/link";
import styles from "./page.module.css";

export default function Result() {
  return (
    <main className={styles.main}>
      <h1>선택 완료</h1>
      <Link href="/menu">
        <Button>뒤로 가기</Button>
      </Link>
    </main>
  );
}
