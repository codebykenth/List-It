import { useEffect, useState } from "react";
import { clearInterval } from "timers";

type HeaderProps = {
  email?: string;
  photoUrl?: string;
};
function Header({ email, photoUrl }: HeaderProps) {
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
      <div className="flex items-center gap-2 p-2 bg-slate-400  text-slate-900">
        <img src={photoUrl} alt="Profile Image" />
        <div>
          <div>Hi, {email}</div>
          <p>{formattedDateTime}</p>
        </div>
      </div>
    </div>
  );
}

export default Header;
