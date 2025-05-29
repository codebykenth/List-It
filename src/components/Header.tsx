type HeaderProps = {
  email: string;
  photoUrl?: string;
};
function Header({ email, photoUrl }: HeaderProps) {
  return (
    <div>
      <div className="flex items-center gap-2 p-2 bg-slate-400  text-slate-900">
        <img src={photoUrl} alt="Profile Image" />
        <div>
          <div>Hi, {email}</div>
          <p>Date</p>
        </div>
      </div>
    </div>
  );
}

export default Header;
