import { ButtonHTMLAttributes } from "react";
import styles from "./index.module.css";

type ButtonProps = {
  variant?: "large" | "small";
  fullWidth?: boolean;
} & ButtonHTMLAttributes<HTMLButtonElement>;

export default function Button({
  variant = "small",
  fullWidth = false,
  className = "",
  ...props
}: ButtonProps) {
  return (
    <button
      className={`${styles.button} ${styles[variant]} ${
        fullWidth ? styles["w-full"] : ""
      } ${className}`}
      {...props}
    />
  );
}
