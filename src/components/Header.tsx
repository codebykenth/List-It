import { useEffect, useState } from "react";
import { authApiService } from "@/api/ApiService";
import FileInput from "@/components/FileInput";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

type HeaderProps = {
  name?: string;
  email?: string;
  photoUrl?: string | null;
};

function Header({ name, photoUrl }: HeaderProps) {
  const [currentDateTime, setCurrentDateTime] = useState(new Date());
  const [isUploading, setIsUploading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setSelectedFile(file);
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    try {
      setIsUploading(true);
      const formData = new FormData();
      formData.append("profile_image", selectedFile);

      await authApiService.postData("/profile/update", formData);

      // Reload the page to reflect changes
      window.location.reload();
    } catch (error) {
      console.error("Error uploading profile image:", error);
    } finally {
      setIsUploading(false);
      setIsDialogOpen(false);
    }
  };

  const formattedDateTime = new Intl.DateTimeFormat("en-PH", {
    timeZone: "Asia/Manila",
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).format(currentDateTime);

  return (
    <div>
      <div className="flex items-center gap-2 p-4 bg-slate-300 text-slate-900">
        {photoUrl ? (
          <img
            src={photoUrl}
            alt="Profile Image"
            className="size-24 rounded-full object-cover border-2 border-slate-600 cursor-pointer hover:opacity-80 transition-opacity"
            onClick={() => setIsDialogOpen(true)}
          />
        ) : (
          <div
            className="size-24 rounded-full border-2 border-slate-600 flex items-center justify-center bg-slate-400 cursor-pointer hover:bg-slate-500 transition-colors"
            onClick={() => setIsDialogOpen(true)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-12 w-12 text-slate-100"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
          </div>
        )}
        <div>
          <div className="text-2xl font-bold">Hi, {name}</div>
          <p className="text-sm text-slate-600">{formattedDateTime}</p>
        </div>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Update Profile Picture</DialogTitle>
            <DialogDescription>
              Choose a new profile picture to upload.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <FileInput
              id="profile_image"
              accept="image/*,.png,.jpg,.jpeg"
              onChange={handleFileChange}
            />
          </div>
          <div className="flex justify-end gap-4">
            <Button
              variant="outline"
              onClick={() => setIsDialogOpen(false)}
              className="cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              onClick={handleUpload}
              disabled={!selectedFile || isUploading}
              className="cursor-pointer"
            >
              {isUploading ? (
                <>
                  <span className="w-4 h-4 border-2 border-slate-200 border-t-slate-800 rounded-full animate-spin mr-2"></span>
                  Uploading...
                </>
              ) : (
                "Upload"
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default Header;
