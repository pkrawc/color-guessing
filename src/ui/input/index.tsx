import { ComponentPropsWithRef, forwardRef } from "react"
import styles from "./input.module.css"
import clsx from "clsx"

interface InputProps extends ComponentPropsWithRef<"input"> {
  label: string
  error?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { type = "text", label, className, error, ...props },
  ref
) {
  return (
    <label className={clsx(styles.wrapper, className, { filled: props.value })}>
      <span className={styles.label}>{label}</span>
      <input
        {...props}
        ref={ref}
        aria-label={label}
        placeholder=" "
        type={type}
      />
    </label>
  )
})
