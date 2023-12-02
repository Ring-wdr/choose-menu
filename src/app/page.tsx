import styles from "./page.module.css";
import ClientSide from "./ClientSide";

export default function Home() {
  return (
    <main className={styles.main}>
      <div className={styles.description}>
        <h3>이름을 입력하세요</h3>
        <ClientSide />
      </div>
    </main>
  );
}
