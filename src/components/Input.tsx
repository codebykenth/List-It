type CredentialsProps = {
  labelName: string;
  inputName: string;
  inputType: string;
  inputValue: string | number | readonly string[] | undefined;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isRequired?: boolean;
};
function Input({
  labelName,
  inputName,
  inputType,
  inputValue,
  onChange,
  isRequired,
}: CredentialsProps) {
  return (
    <div className="flex flex-col">
      <label htmlFor="" className="text-sm">
        {labelName}
        {isRequired && <span className="text-red-700"> *</span>} 
      </label>
      <input
        type={inputType}
        className="bg-slate-200 rounded-md h-10"
        name={inputName}
        value={inputValue}
        onChange={onChange}
      />
    </div>
  );
}

export default Input;
