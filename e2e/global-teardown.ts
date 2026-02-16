const { createClient } = require("@supabase/supabase-js");

module.exports = async function globalTeardown() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    console.warn(
      "Supabase env vars not set. Skipping test data cleanup."
    );
    return;
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey);

  // Delete all tasks first (FK constraint), then task_lists
  await supabase
    .from("tasks")
    .delete()
    .neq("id", "00000000-0000-0000-0000-000000000000");
  await supabase
    .from("task_lists")
    .delete()
    .neq("id", "00000000-0000-0000-0000-000000000000");

  // Delete all test users from auth.users
  const { data: users } = await supabase.auth.admin.listUsers();
  let deletedCount = 0;
  if (users?.users) {
    for (const user of users.users) {
      if (user.email?.endsWith("@test.com")) {
        await supabase.auth.admin.deleteUser(user.id);
        deletedCount++;
      }
    }
  }

  console.log(
    `E2E teardown: cleaned up ${deletedCount} test user(s) and their data`
  );
};
