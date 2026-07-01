'use client';

import { FieldPath, FieldValues } from 'react-hook-form';
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { BaseFormFieldProps } from '@/types/base-form';
import { Button } from '../ui/button';
import { useState } from 'react';
import { Icons } from '../icons';
import Link from 'next/link';

interface FormInputProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> extends BaseFormFieldProps<TFieldValues, TName> {
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url';
  placeholder?: string;
  step?: string | number;
  min?: string | number;
  max?: string | number;
  labelClassName?: string;
  boxClassName?: string;
  requiredIcon?: boolean;
  forgotPasswordLink?: boolean;
  autoComplete?: string;
  onKeyDown?: React.KeyboardEventHandler<HTMLInputElement>;
}

function FormInput<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({
  control,
  name,
  label,
  description,
  required,
  type = 'text',
  placeholder,
  step,
  min,
  max,
  disabled,
  className,
  labelClassName,
  boxClassName,
  autoComplete,
  requiredIcon,
  forgotPasswordLink = false,
  onKeyDown
}: FormInputProps<TFieldValues, TName>) {
  const [showPassword, setShowPassword] = useState(false);
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={boxClassName}>
          {label && (
            <FormLabel
              className={`flex items-end justify-between ${labelClassName}`}
            >
              <span>
                {label}
                {requiredIcon && <span className='ml-1 text-red-500'>*</span>}
              </span>
              {type === 'password' && forgotPasswordLink && (
                <Link
                  className='text-xs leading-none text-neutral-400 underline underline-offset-2 transition-colors hover:text-neutral-600'
                  href='/auth/forgot-password'
                >
                  Forgot password?
                </Link>
              )}
            </FormLabel>
          )}
          <FormControl>
            <div className='relative'>
              <Input
                {...field}
                autoComplete={autoComplete}
                type={
                  type === 'password'
                    ? showPassword
                      ? 'text'
                      : 'password'
                    : type
                }
                placeholder={placeholder}
                step={step}
                min={min}
                max={max}
                className={className}
                disabled={disabled}
                required={required}
                onKeyDown={onKeyDown}
                onChange={(e) => {
                  if (type === 'number') {
                    const value = e.target.value;
                    field.onChange(
                      value === '' ? undefined : parseFloat(value)
                    );
                  } else {
                    field.onChange(e.target.value);
                  }
                }}
              />
              {type === 'password' && (
                <Button
                  type='button'
                  onClick={() => setShowPassword(!showPassword)}
                  className='absolute right-1 bottom-1 cursor-pointer border-none bg-transparent outline-none hover:bg-transparent'
                >
                  {showPassword ? (
                    <Icons.eye className='size-6 text-gray-300' />
                  ) : (
                    <Icons.eyeOff className='size-6 text-gray-300' />
                  )}
                </Button>
              )}
            </div>
          </FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

export { FormInput };
