import {
  FieldErrors,
  FieldValues,
  Path,
  RegisterOptions,
  UseFormRegister,
} from 'react-hook-form';

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
          backgroundColor: '#cfcfcf',
          border: `1px solid ${errors[name] ? '#8b0a0a' : '#1a1a1a'}`,
          borderRadius: '4px',
          padding: '5px',
          minHeight: '70px',
        }}
        {...register(name, rules ?? {})}
      />
      {errors[name] && (
        <p style={{ fontSize: '12px', color: '#8b0a0a' }}>
          {errors[name]?.message as string}
        </p>
      )}
    </div>
  );
}
