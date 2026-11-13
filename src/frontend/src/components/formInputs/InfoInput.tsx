import {
  FieldErrors,
  FieldValues,
  Path,
  RegisterOptions,
  UseFormRegister,
} from 'react-hook-form';
import { useTheme } from '../../hooks/userSettings/useTheme';

interface InfoInputProps<T extends FieldValues> {
  inputTitle: string;
  name: Path<T>;
  register: UseFormRegister<T>;
  errors: FieldErrors<T>;
  rules?: RegisterOptions<T, Path<T>>;
  inputWidth?: number;
}

export function InfoInput<T extends FieldValues>({
  inputTitle,
  name,
  register,
  errors,
  rules,
  inputWidth,
}: InfoInputProps<T>) {
  const themeType = useTheme();
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        width: `${inputWidth || 300}px`,
      }}
    >
      <label>{inputTitle}</label>
      <input
        style={{
          backgroundColor: themeType.inputBackgroundColor,
          color: themeType.inputTextColor,
          border: `1px solid ${errors[name] ? themeType.inputErrorBorderColor : themeType.inputBorderColor}`,
          borderRadius: '4px',
          padding: '5px',
        }}
        {...register(name, rules)}
      />
      {errors[name] && (
        <p style={{ fontSize: '12px', color: themeType.errorTextColor }}>
          {errors[name]?.message as string}
        </p>
      )}
    </div>
  );
}
