# cis-opportunities
A platform for CIS students applying abroad to discover, filter, and track portfolio-building extracurricular activities in one place.
# 🎓 CIS Student Activity Hub

An all-in-one opportunity platform for students from CIS countries seeking extracurricular activities for university admissions.

## 📌 Problem Statement
Students in CIS countries often struggle to find relevant extracurricular opportunities such as Olympiads, competitions, volunteering, and internships. Information is scattered across numerous Telegram channels, university sites, and social media, making portfolio building overwhelming.

## 💡 Solution
A centralized platform that aggregates active opportunities, provides precise filtering (age, format, location), and allows users to save and track key events in their personal profile.

## ✨ Key Features

### For Students:
- **Authentication:** Simple registration and sign-in via Email & Password.
- **Main Feed:** Immediate access to all events with open registration.
- **Filtering System:** Search by category (Olympiads, volunteering, internships), format (online/offline), and keywords.
- **Favorites System ("Star" events):** Save and manage important events directly in your profile.
- **Action Buttons:** Quick access to official external application links.

### For Admins (Control Panel):
- **Event Management:** Create and post new events with dynamic action buttons.
- **Status Toggle:** Switch events between active/inactive.
- **Deletion:** Safely remove outdated or archived events.

## 🛠 Tech Stack
- **Frontend:** HTML5, CSS3, JavaScript / React
- **Backend and database:** Supabase Auth and PostgreSQL

## Supabase setup

1. Create a Supabase project and enable email/password sign-in in **Authentication → Providers → Email**.
2. Copy `.env.example` to `.env.local` and fill in the project URL and publishable key from **Project Settings → API**. Add the same variables to your hosting provider for deployment. These are public client values; never put a `service_role` key in the app.
3. Run the migrations in order in the Supabase SQL Editor:
   - `supabase/migrations/20261111000000_supabase_admin_access.sql`
   - `supabase/migrations/20261111210000_admin_users_telegram_inbox.sql`
4. Install dependencies and start the app with `npm install` and `npm run dev`.
5. Register the first admin, then promote that account in the SQL Editor by replacing the email below:

   ```sql
   insert into public.user_roles (user_id, role)
   select id, 'admin'
   from auth.users
   where lower(email) = lower('admin@example.com')
   on conflict (user_id) do update set role = excluded.role;
   ```

   The account must already exist. After granting access, have the user refresh or sign in again. Remove access with:

   ```sql
   delete from public.user_roles
   where user_id = (select id from auth.users where lower(email) = lower('admin@example.com'));
   ```

After the first admin signs in, they can assign and remove admin roles in **Admin → Users**. The database checks admin permissions and prevents self-demotion or removing the last admin. Admin links are only shown to assigned users, and the database independently enforces activity writes with row-level security. Public visitors can read active activities but cannot create, edit, or delete them. New registrations do not grant admin access.

## Telegram post submissions

The admin panel can receive manually forwarded Telegram posts as drafts. This does not read channel history or publish events automatically.

1. Create a Telegram bot with [@BotFather](https://t.me/BotFather) and copy its token.
2. In Vercel, add these server-side environment variables (do not prefix them with `VITE_`):
   - `TELEGRAM_BOT_TOKEN`: the token from BotFather.
   - `TELEGRAM_WEBHOOK_SECRET`: a private string containing only letters, numbers, `_`, or `-` (at least 32 random characters recommended).
   - `TELEGRAM_WEBHOOK_URL`: your deployed HTTPS URL followed by `/api/telegram-webhook`, for example `https://your-site.vercel.app/api/telegram-webhook`.
   - `SUPABASE_SERVICE_ROLE_KEY`: the project's service-role/secret key. Keep it only in Vercel server environment variables; never expose it to browser code or commit it.
   The existing `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` variables must also be configured in Vercel.
3. Redeploy after saving the environment variables, sign in as an admin, open **Admin → Telegram**, and select **Connect webhook**.
4. Send `/id` to the bot, then add that numeric Telegram ID to the panel's allowed-senders list. Only IDs on that list can submit drafts.
5. Forward a post to the bot. Admins can review and edit its suggested title, category, deadline, and link before publishing it as an activity.

Keep the bot token, webhook secret, and Supabase service-role key private. If any of these values have been shared publicly, rotate them before enabling the webhook.
