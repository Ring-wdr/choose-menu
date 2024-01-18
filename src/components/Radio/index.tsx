import { Fragment, InputHTMLAttributes, useId } from "react";
import styles from "./index.module.css";
import clsx from "clsx";

export default function Radio({
  value,
  label,
  className,
  theme,
  ...props
}: InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  value: string;
  theme?: "hot" | "ice";
}) {
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
      <label htmlFor={radioId} className={clsx(theme && styles[theme])}>
        {label}
      </label>
    </Fragment>
  );
}
