import Link from "next/link";
import Button from "../Button";
import styles from "./index.module.css";
export default function Main() {
  return (
    <main className={styles.main}>
      <div className={styles.description}>
        <h3>이름을 입력하세요</h3>
        <input type="text" />
        <Link href={"/menu"}>
          <Button fullWidth>선택</Button>
        </Link>
      </div>
    </main>
  );
}
