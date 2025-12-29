import { GroupWithDetails } from "../types/groupQuery";
type GroupProps = {
  group: GroupWithDetails;
  currentUserId?: string;
};

export default async function GroupDetails({ group,currentUserId }: GroupProps) {
  return (
      <div className="border p-4 rounded-lg shadow-md hover:shadow-lg transition cursor-pointer bg-white">
        <h3 className="text-xl font-semibold text-green-700">{group.name}</h3>
        <p className="text-sm text-gray-500">
          Total Expenses: {group.expenses.length}
        </p>
        {/* Add more summary details here */}
      </div>
  );
}