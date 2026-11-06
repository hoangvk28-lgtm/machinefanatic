import { getAdminSession } from "@/lib/admin-auth";
import { logoutAction } from "@/app/admin/actions";

export async function AdminHeader() {
  const session = await getAdminSession();

  return (
    <div className="flex items-center justify-end flex-1 gap-3">
      <div className="flex items-center gap-2">
        <div className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center">
          <svg className="w-4 h-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
          </svg>
        </div>
        <span className="text-sm font-medium text-gray-700 hidden sm:block">
          {session.adminEmail ?? "Admin"}
        </span>
      </div>

      <form action={logoutAction}>
        <button
          type="submit"
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15M12 9l-3 3m0 0 3 3m-3-3h12.75" />
          </svg>
          Logout
        </button>
      </form>
    </div>
  );
}
