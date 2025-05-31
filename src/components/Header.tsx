import { useEffect, useState } from "react";

type HeaderProps = {
  name?: string;
  email?: string;
  photoUrl?: string;
};
function Header({ name, photoUrl }: HeaderProps) {
  const [currentDateTime, setCurrentDateTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

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
      <div className="flex items-center gap-2 p-2 bg-slate-300  text-slate-900">
        <img
          src={photoUrl}
          alt="Profile Image"
          className="size-24 rounded-full object-cover border-2 border-slate-600"
        />
        <div>
          <div className="text-2xl font-bold">Hi, {name}</div>
          <p className="text-sm text-slate-600">{formattedDateTime}</p>
        </div>
      </div>
    </div>
  );
}

export default Header;
