import {
  FieldErrors,
  FieldValues,
  Path,
  RegisterOptions,
  UseFormRegister,
} from 'react-hook-form';
import { useTheme } from '../../hooks/userSettings/useTheme';

interface InfoSelectProps<T extends FieldValues> {
  inputTitle: string;
  name: Path<T>;
  register: UseFormRegister<T>;
  errors: FieldErrors<T>;
  rules?: RegisterOptions<T, Path<T>>;
  selectOptions: React.ReactNode;
  inputWidth?: string;
}

export function InfoSelect<T extends FieldValues>({
  inputTitle,
  name,
  register,
  errors,
  rules,
  selectOptions,
  inputWidth,
}: InfoSelectProps<T>) {
  const themeType = useTheme();
  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: '300px' }}>
      <label>{inputTitle}</label>
      <select
        style={{
          backgroundColor: themeType.inputBackgroundColor,
          color: themeType.inputTextColor,
          border: `1px solid ${errors[name] ? themeType.inputErrorBorderColor : themeType.inputBorderColor}`,
          borderRadius: '4px',
          padding: '5px',
          width: inputWidth ? inputWidth : '',
        }}
        {...register(name, rules)}
      >
        {selectOptions}
      </select>
      {errors[name] && (
        <p style={{ fontSize: '12px', color: themeType.errorTextColor }}>
          {errors[name]?.message as string}
        </p>
      )}
    </div>
  );
}
