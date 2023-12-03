import { ButtonHTMLAttributes } from "react";
import styles from "./index.module.css";

type ButtonProps = {
  variant?: "large" | "small";
  fullWidth?: boolean;
  resetStyle?: boolean;
} & ButtonHTMLAttributes<HTMLButtonElement>;

export default function Button({
  variant = "small",
  fullWidth = false,
  className = "",
  resetStyle,
  ...props
}: ButtonProps) {
  return (
    <button
      className={`${styles.button} ${styles[variant]} ${
        fullWidth ? styles["w-full"] : ""
      } ${resetStyle ? styles.reset_style : ""} ${className}`}
      {...props}
    />
  );
}
