import { Fragment, InputHTMLAttributes, useId } from "react";
import styles from "./index.module.css";

export default function Radio({
  value,
  label,
  ...props
}: InputHTMLAttributes<HTMLInputElement> & { label: string; value: string }) {
  const radioId = useId();
  return (
    <Fragment key={value || "defaultkey"}>
      <input
        type="radio"
        className={styles.radio}
        id={radioId}
        value={value}
        {...props}
      />
      <label htmlFor={radioId}>{label}</label>
    </Fragment>
  );
}
