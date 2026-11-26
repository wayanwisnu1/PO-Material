import React from 'react';

interface Action {
  id: number;
  name: string;
  label: string;
  description: string;
}

interface Group {
  key: string;
  label: string;
  description: string;
  actions: Action[];
}

interface PermissionSelectorProps {
  groups: Group[];
  selectedIds: number[];
  onChange: (ids: number[]) => void;
}

export default function PermissionSelector({ groups, selectedIds, onChange }: PermissionSelectorProps) {
  const togglePermission = (id: number) => {
    if (selectedIds.includes(id)) {
      onChange(selectedIds.filter((pid) => pid !== id));
    } else {
      onChange([...selectedIds, id]);
    }
  };

  return (
    <div className="space-y-6">
      {groups.map((group) => (
        <div key={group.key} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
          <h4 className="font-semibold text-gray-900 mb-1">{group.label}</h4>
          <p className="text-xs text-gray-500 mb-4">{group.description}</p>
          <div className="grid grid-cols-2 gap-3">
            {group.actions.map((action) => (
              <label key={action.name} className="flex items-center space-x-2 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={selectedIds.includes(action.id)}
                  onChange={() => togglePermission(action.id)}
                  className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                />
                <span className="text-sm text-gray-700 group-hover:text-orange-700" title={action.description}>
                  {action.label}
                </span>
              </label>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
