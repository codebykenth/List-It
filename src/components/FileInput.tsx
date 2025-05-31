import { cn } from "@/lib/utils";
interface FileInputProps {
  label?: string;
  className?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  accept?: string;
  name?: string;
  id?: string;
  required?: boolean;
}
function FileInput({ label, className, ...props }: FileInputProps) {
  return (
    <div className="grid w-full gap-1.5">
      {label && <label className="text-sm">{label}</label>}
      <input
        type="file"
        className={cn(
          "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        {...props}
      />
    </div>
  );
}
export default FileInput;
