import { createClient } from "@supabase/supabase-js";

export default async function globalSetup() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    console.warn(
      "Supabase env vars not set for E2E cleanup. Skipping test data cleanup."
    );
    return;
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey);

  // Find test users (@test.com) and only clean up their data
  const { data: users } = await supabase.auth.admin.listUsers();
  const testUsers = users?.users?.filter((u) => u.email?.endsWith("@test.com")) ?? [];
  const testUserIds = testUsers.map((u) => u.id);

  if (testUserIds.length > 0) {
    // Delete tasks belonging to test users' lists, then the lists themselves
    // Cascade: tasks reference task_lists, so delete tasks first
    const { data: lists } = await supabase
      .from("task_lists")
      .select("id")
      .in("user_id", testUserIds);
    const listIds = lists?.map((l) => l.id) ?? [];

    if (listIds.length > 0) {
      await supabase.from("tasks").delete().in("task_list_id", listIds);
      await supabase.from("task_lists").delete().in("id", listIds);
    }

    // Delete the test users
    for (const id of testUserIds) {
      await supabase.auth.admin.deleteUser(id);
    }
  }

  console.log(`E2E setup: cleaned up ${testUsers.length} test user(s) and their data`);
}
