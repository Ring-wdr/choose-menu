import { ButtonHTMLAttributes } from "react";
import clsx from "clsx";
import styles from "./index.module.css";

type ButtonProps = {
  variant?: "large" | "medium" | "small" | "none";
  fullWidth?: boolean;
  resetStyle?: boolean;
} & ButtonHTMLAttributes<HTMLButtonElement>;

export default function Button({
  variant = "none",
  fullWidth = false,
  className = "",
  resetStyle,
  ...props
}: ButtonProps) {
  return (
    <button
      className={clsx(
        styles.button,
        { [styles[variant]]: variant },
        { [styles["w-full"]]: fullWidth },
        { [styles.reset_style]: resetStyle },
        className
      )}
      {...props}
    />
  );
}
