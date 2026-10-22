import {
  FieldErrors,
  FieldValues,
  Path,
  RegisterOptions,
  UseFormRegister,
} from 'react-hook-form';

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
  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: '300px' }}>
      <label>{inputTitle}</label>
      <select
        style={{
          backgroundColor: '#cfcfcf',
          border: `1px solid ${errors[name] ? '#8b0a0a' : '#1a1a1a'}`,
          borderRadius: '4px',
          padding: '5px',
          width: inputWidth ? inputWidth : '',
        }}
        {...register(name, rules)}
      >
        {selectOptions}
      </select>
      {errors[name] && (
        <p style={{ fontSize: '12px', color: '#8b0a0a' }}>
          {errors[name]?.message as string}
        </p>
      )}
    </div>
  );
}
