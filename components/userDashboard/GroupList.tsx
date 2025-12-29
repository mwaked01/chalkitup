import { GroupWithDetails } from "../../types/groupQuery";
import GroupListItem from "@/components/userDashboard/GroupListItem";

import { ListTodo } from "lucide-react";

type GroupListProps = {
  groups: GroupWithDetails[];
  setActiveTab?: (tab: "groups" | "balances") => void;
};

export default function GroupList({ groups, setActiveTab }: GroupListProps) {
  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold mb-4">Your Groups</h1>
        <button onClick={() => setActiveTab && setActiveTab("balances")}>
          <ListTodo className="w-4 h-4 mr-2" />
          Balance List
        </button>
      </div>

      <div className="space-y-6">
        {groups.map((group) => (
          <GroupListItem key={group.id} group={group} />
        ))}
      </div>
    </div>
  );
}

