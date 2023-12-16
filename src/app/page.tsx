import LoadingButton from "./_component/LoadingButton";
import { action } from "./action";
import styles from "./page.module.css";

export default function Home() {
  return (
    <main className={styles.main}>
      <form action={action} className={styles.description}>
        <h3>이름을 입력하세요</h3>
        <input type="text" name="userName" required />
        <LoadingButton />
      </form>
    </main>
  );
}
