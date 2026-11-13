import {
  FieldErrors,
  FieldValues,
  Path,
  RegisterOptions,
  UseFormRegister,
} from 'react-hook-form';
import { useTheme } from '../../hooks/userSettings/useTheme';

interface LongInfoInputProps<T extends FieldValues> {
  inputTitle: string;
  name: Path<T>;
  register: UseFormRegister<T>;
  errors: FieldErrors<T>;
  rules?: RegisterOptions<T, Path<T>>;
}

export function LongInfoInput<T extends FieldValues>({
  inputTitle,
  name,
  register,
  errors,
  rules,
}: LongInfoInputProps<T>) {
  const themeType = useTheme();
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        marginBlock: '20px',
      }}
    >
      <label>{inputTitle}</label>
      <textarea
        style={{
          backgroundColor: themeType.inputBackgroundColor,
          color: themeType.inputTextColor,
          border: `1px solid ${errors[name] ? themeType.inputErrorBorderColor : themeType.inputBorderColor}`,
          borderRadius: '4px',
          padding: '5px',
          minHeight: '70px',
        }}
        {...register(name, rules ?? {})}
      />
      {errors[name] && (
        <p style={{ fontSize: '12px', color: themeType.errorTextColor }}>
          {errors[name]?.message as string}
        </p>
      )}
    </div>
  );
}
