

type PersonProps = {
    name: string
}
export default function Button({ name }: PersonProps) {
  return <button className="bg-blue-600">{name}</button>;
}
