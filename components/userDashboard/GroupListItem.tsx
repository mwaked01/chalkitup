import Link from "next/link";
import { GroupWithDetails } from "../../types/groupQuery";
type GroupProps = {
  group: GroupWithDetails;
};

export default function GroupListItem({ group }: GroupProps) {
  return (
    <Link href={`/groups/${group.id}`} passHref>
      <div className="border p-4 rounded-lg shadow-md hover:shadow-lg transition cursor-pointer bg-white">
        <h3 className="text-xl font-semibold text-green-700">{group.name}</h3>
        <h3 className="text-xl font-semibold text-green-700">{`/groups/${group.id}`}</h3>
        <h3 className="text-xl font-semibold text-green-700">
          {typeof group.id}
        </h3>
        <p className="text-sm text-gray-500">
          Total Expenses: {group.expenses.length}
        </p>
        {/* Add more summary details here */}
      </div>
    </Link>
  );
}
