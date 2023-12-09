import { ClientNameSide } from "./ClientAuth";
import styles from "./page.module.css";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={styles.client}>
      <ClientNameSide />
      {children}
    </div>
  );
}
