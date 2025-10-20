import React, { ButtonHTMLAttributes, forwardRef } from 'react';
import { clsx } from 'clsx';
import styles from './Button.module.css';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'tertiary' | 'ghost' | 'danger';
  size?: 'small' | 'medium' | 'large';
  fullWidth?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'leading' | 'trailing';
  children?: React.ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'medium',
      fullWidth = false,
      loading = false,
      disabled = false,
      icon,
      iconPosition = 'leading',
      children,
      className,
      ...props
    },
    ref
  ) => {
    const buttonClasses = clsx(
      styles.button,
      styles[`button--${variant}`],
      styles[`button--${size}`],
      {
        [styles['button--full-width']]: fullWidth,
        [styles['button--loading']]: loading,
        [styles['button--disabled']]: disabled || loading,
        [styles['button--icon-only']]: icon && !children,
      },
      className
    );

    return (
      <button
        ref={ref}
        className={buttonClasses}
        disabled={disabled || loading}
        aria-busy={loading}
        {...props}
      >
        {loading && (
          <span className={styles.button__loader} aria-hidden="true">
            <svg
              className={styles.button__spinner}
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className={styles.button__spinner_track}
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className={styles.button__spinner_fill}
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
          </span>
        )}
        {icon && iconPosition === 'leading' && (
          <span className={styles.button__icon} aria-hidden="true">
            {icon}
          </span>
        )}
        {children && <span className={styles.button__content}>{children}</span>}
        {icon && iconPosition === 'trailing' && (
          <span className={styles.button__icon} aria-hidden="true">
            {icon}
          </span>
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';

// Button Group Component
export interface ButtonGroupProps {
  children: React.ReactNode;
  orientation?: 'horizontal' | 'vertical';
  spacing?: 'none' | 'small' | 'medium' | 'large';
  className?: string;
}

export const ButtonGroup: React.FC<ButtonGroupProps> = ({
  children,
  orientation = 'horizontal',
  spacing = 'small',
  className,
}) => {
  const groupClasses = clsx(
    styles['button-group'],
    styles[`button-group--${orientation}`],
    styles[`button-group--spacing-${spacing}`],
    className
  );

  return (
    <div className={groupClasses} role="group">
      {children}
    </div>
  );
};

ButtonGroup.displayName = 'ButtonGroup';