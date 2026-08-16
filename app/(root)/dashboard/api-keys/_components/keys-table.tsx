import { MagnifyingGlassIcon } from "@phosphor-icons/react";

import { formatKeyDate, type APIKey } from "@/lib/api-keys";

export function KeysTable({
  keys,
  search,
  onSearchChange,
}: {
  keys: APIKey[];
  search: string;
  onSearchChange: (value: string) => void;
}) {
  const query = search.trim().toLowerCase();
  const filtered = keys.filter((key) => key.name.toLowerCase().includes(query));

  return (
    <div className="rounded-xl border border-white/10 bg-[#0b0b0c]">
      <div className="border-b border-white/10 p-3">
        <div className="relative max-w-xs">
          <MagnifyingGlassIcon
            size={14}
            className="pointer-events-none absolute top-1/2 left-2.5 -translate-y-1/2 text-zinc-400"
          />
          <input
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Search by name..."
            className="h-8 w-full rounded-lg border border-white/10 bg-black pl-8 pr-3 text-[13px] text-white outline-none placeholder:text-zinc-400 focus:border-white/20"
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] text-left text-[13px]">
          <thead>
            <tr className="border-b border-white/10 text-xs text-zinc-400">
              <th className="px-4 py-2.5 font-normal">Key</th>
              <th className="px-4 py-2.5 font-normal">Expires</th>
              <th className="px-4 py-2.5 font-normal">Last used</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((key) => (
              <tr key={key.id} className="border-b border-white/5 last:border-b-0">
                <td className="px-4 py-3">
                  <p className="font-medium text-white">{key.name}</p>
                  <p className="mt-0.5 font-mono text-xs text-zinc-400">{key.key_preview}</p>
                </td>
                <td className="px-4 py-3 text-zinc-300">{formatKeyDate(key.expires_at)}</td>
                <td className="px-4 py-3 text-zinc-300">{formatKeyDate(key.last_used_at)}</td>
              </tr>
            ))}
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={3} className="px-4 py-8 text-center text-zinc-400">
                  {keys.length === 0 ? "No API keys yet." : "No keys match that name."}
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>

      <p className="border-t border-white/10 px-4 py-2.5 text-xs text-zinc-400">
        {filtered.length} key{filtered.length === 1 ? "" : "s"}
      </p>
    </div>
  );
}
