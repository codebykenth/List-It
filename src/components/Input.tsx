type CredentialsProps = {
  labelName: string;
  inputName: string;
  inputType: string;
};
function Input({ labelName, inputName, inputType }: CredentialsProps) {
  return (
    <div className="flex flex-col">
      <label htmlFor="" className="text-sm">
        {labelName}
      </label>
      <input
        type={inputType}
        className="bg-slate-200 rounded-md h-10"
        name={inputName}
      />
    </div>
  );
}

export default Input;
