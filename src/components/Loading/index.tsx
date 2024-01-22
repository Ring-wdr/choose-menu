import styles from './index.module.css';

export default function LoadingImage() {
  return (
    <div className={styles['spinner-container']}>
      <div className={styles.spinner}>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
    </div>
  );
}
