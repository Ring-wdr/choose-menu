import styles from "./page.module.css";
import Button from "@/component/Button";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { action } from "./action";

export default function Home() {
  if (cookies().get("userName")?.value) {
    redirect("/menu");
  }
  return (
    <main className={styles.main}>
      <form action={action} className={styles.description}>
        <h3>이름을 입력하세요</h3>
        <input type="text" name="userName" required />
        <Button fullWidth>선택</Button>
      </form>
    </main>
  );
}
