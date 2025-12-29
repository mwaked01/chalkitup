import Link from "next/link";
type BalanceProps = {
  user: {
    id: string;
    name: string | null;
    email: string;
    emailVerified: Date | null;
    image: string | null;
  };
  amount: number;
};

export default function BalanceListItem({ user, amount }: BalanceProps) {
  const isOwed = amount > 0;
  return (
    <Link
      key={user.id}
      href={`/balance/${user.id}`} // Link to the details page
      className="block"
    >
      <div className="flex justify-between items-center p-4 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold">
            {user.name?.charAt(0).toUpperCase() || "U"}
          </div>
          <div>
            <h3 className="font-semibold text-gray-800">
              {user.name || "Unknown User"}
            </h3>
            <p className="text-xs text-gray-500">
              {isOwed ? "owes you" : "you owe"}
            </p>
          </div>
        </div>

        <div className="text-right">
          <p
            className={`text-lg font-bold ${
              isOwed ? "text-green-600" : "text-red-600"
            }`}
          >
            {isOwed ? "+" : "-"}${Math.abs(amount).toFixed(2)}
          </p>
        </div>
      </div>
    </Link>
  );
}
