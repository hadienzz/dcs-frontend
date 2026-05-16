import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

export type FormFieldProps = {
  /**
   * The DOM id of the control rendered as `children`.
   *
   * The parent passing the input is responsible for setting `id={id}` and,
   * when `errorMessage` is provided, `aria-describedby={`${id}-error`}` so the
   * error message rendered below is announced by assistive technology.
   */
  id: string;
  label: string;
  required?: boolean;
  helperText?: string;
  errorMessage?: string;
  children: ReactNode;
  className?: string;
};

/**
 * Presentational wrapper that renders a label, the form control passed via
 * `children`, and either a helper text or an error message below the control.
 *
 * The component does not own any state - it simply provides the visual slots
 * and the accessible label/error association. The control rendered as
 * `children` should set `aria-describedby={`${id}-error`}` when an
 * `errorMessage` is provided so screen readers announce the validation message.
 */
function FormField({
  id,
  label,
  required = false,
  helperText,
  errorMessage,
  children,
  className,
}: FormFieldProps) {
  const hasError = Boolean(errorMessage);

  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <label
        htmlFor={id}
        className="text-sm font-medium text-foreground"
      >
        {label}
        {required ? (
          <>
            <span aria-hidden="true" className="ml-0.5 text-destructive">
              *
            </span>
            <span className="sr-only"> wajib</span>
          </>
        ) : null}
      </label>

      {children}

      {!hasError && helperText ? (
        <p className="mt-1 text-xs text-muted-foreground">{helperText}</p>
      ) : null}

      {hasError ? (
        <p
          id={`${id}-error`}
          className="mt-1 text-xs text-destructive"
        >
          {errorMessage}
        </p>
      ) : null}
    </div>
  );
}

export default FormField;
