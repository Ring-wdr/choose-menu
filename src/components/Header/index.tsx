import { ModeToggle } from '../Theme-provider/toggle';

import styles from './index.module.css';

export default function Header() {
  return (
    <header className={styles.header}>
      커피 고르는 사이트 <ModeToggle />
    </header>
  );
}
