export interface FormInputsProps {
  label: string;
  inputType?: string;
  inputParams: object;
  inputErrors?: React.ReactNode;
  inputWidth?: number; // by percentage
  inputHeight?: number; // in pixels
}
export function FormInputs({
  label,
  inputType,
  inputParams,
  inputErrors,
  inputWidth,
  inputHeight,
}: FormInputsProps) {
  const sharedStyles = {
    backgroundColor: '#ebebeb',
    border: inputErrors ? '2px solid #4f0000' : '2px solid #a3a3a3',
    borderRadius: '5px',
    padding: '5px',
    width: inputWidth ? `${inputWidth}%` : '50%',
    height: inputHeight ? inputHeight : '',
  };
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '4px',
        fontSize: '12px',
      }}
    >
      <label>{label}</label>
      {inputType === 'textarea' ? (
        <textarea style={{ ...sharedStyles }} {...inputParams} />
      ) : (
        <input
          style={{
            ...sharedStyles,
          }}
          {...inputParams}
          type={inputType || ''}
        />
      )}

      {inputErrors}
    </div>
  );
}
