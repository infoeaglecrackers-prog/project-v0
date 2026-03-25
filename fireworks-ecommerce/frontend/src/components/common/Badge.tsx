interface Props {
  label: string;
  color?: "green" | "red" | "yellow" | "blue" | "purple" | "gray" | "orange";
}

const colorMap: Record<string, string> = {
  green: "bg-green-100 text-green-700",
  red: "bg-red-100 text-red-700",
  yellow: "bg-yellow-100 text-yellow-700",
  blue: "bg-blue-100 text-blue-700",
  purple: "bg-purple-100 text-purple-700",
  gray: "bg-gray-100 text-gray-700",
  orange: "bg-orange-100 text-orange-700",
};

export default function Badge({ label, color = "gray" }: Props) {
  return (
    <span className={`badge ${colorMap[color]}`}>{label}</span>
  );
}
