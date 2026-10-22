import {
  FieldErrors,
  FieldValues,
  Path,
  RegisterOptions,
  UseFormRegister,
} from 'react-hook-form';

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
          backgroundColor: '#cfcfcf',
          border: `1px solid ${errors[name] ? '#8b0a0a' : '#1a1a1a'}`,
          borderRadius: '4px',
          padding: '5px',
        }}
        {...register(name, rules)}
      />
      {errors[name] && (
        <p style={{ fontSize: '12px', color: '#8b0a0a' }}>
          {errors[name]?.message as string}
        </p>
      )}
    </div>
  );
}
