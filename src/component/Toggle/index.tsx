import { Fragment, InputHTMLAttributes, useId } from "react";
import styles from "./index.module.css";

export default function Toggle({
  ...props
}: InputHTMLAttributes<HTMLInputElement>) {
  const toggleId = useId();
  return (
    <Fragment key={toggleId}>
      <input
        type="checkbox"
        className={styles.toggle}
        id={toggleId}
        {...props}
        hidden
      />
      <label htmlFor={toggleId} className={styles.toggleSwitch}>
        <span className={styles.toggleButton}></span>
      </label>
    </Fragment>
  );
}
