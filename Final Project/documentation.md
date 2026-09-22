# CSTU Computer & Programming Club
## Complete User Documentation

This document explains how to use the CSTU Computer & Programming Club (CPC) platform. It covers the public website, membership registration, member portal, administrator portal, contests, events, notices, credentials, and the meaning of every important status.

---

## 1. Platform Overview

The CPC platform has three user experiences:

1. **Public website**: Anyone can view club information, members, advisors, notices, events, contests, contest results, and the gallery.
2. **Member portal**: Approved members can manage their profile, view applications, register for contests, see club activity, and download a digital credential card.
3. **Administrator portal**: Administrators manage members, membership applications, notices, events, contests, contest applications, and contest results.

The platform uses email and password authentication. A user's role determines which dashboard is shown after login.

### User roles

| Role | Main permissions |
| --- | --- |
| Visitor | Browse public content and submit a membership application. |
| Member | Use the member dashboard, update their profile, register for contests, view application statuses, and download their credential. |
| Administrator | Manage club data and review or update applications, members, notices, events, contests, and results. |

---

## 2. Getting Started

### Opening the platform

Open the website in a browser. The home page provides links to the main public sections and highlights selected club information.

### Main public navigation

The navigation provides access to:

- **Home**: Club overview, featured members, notices, contests, and highlights.
- **Join Club**: Membership registration form.
- **Gallery**: Club photos and image previews.
- **Notices**: Announcements and other published notices.
- **Events**: Club events, venues, dates, descriptions, and registration links.
- **Contests**: Competitive programming contests and standings.
- **Members**: Active member directory.
- **Advisors**: Faculty and club advisor information.
- **Login**: Sign in to the member or administrator area.

### Login portal selection

The login page can be opened as an administrator or member portal. The selected portal changes the label shown on the page; the system still verifies the account's actual role during authentication.

After a successful login:

- An administrator is sent to `/admin/dashboard`.
- A member is sent to `/member/dashboard`.

An inactive account cannot log in. A user with an invalid email or password receives a login error.

---

## 3. Public Website Guide

### Home page

The home page brings together the most important club information, including:

- Club introduction and membership call to action.
- Featured active members.
- Recent notices.
- Contest and standings highlights.
- Gallery highlights.
- Club statistics and links to other public sections.

### Members directory

The Members page displays active users whose role is `MEMBER`. Visitors can search the directory using the available search control.

A member entry can include:

- Name and profile image.
- Designation.
- Academic session.
- Department.
- Codeforces profile.
- GitHub profile.

Inactive accounts and administrator accounts are not intended to appear in the public member directory.

### Advisors

The Advisors page contains advisor profiles and supporting information. Selecting an advisor opens the available profile details. The `/advisors` address redirects to the main advisor page.

### Notices

The Notices page lists club announcements. Notices can include:

- Title.
- Category.
- Full content.
- Published date.
- Pinned state.
- Optional attachment.

Pinned notices appear before other notices. The available categories are:

- `ANNOUNCEMENT`
- `WORKSHOP`
- `CONTEST`
- `GENERAL`

### Events

An event can display:

- Title.
- Description.
- Venue.
- Event date.
- Cover image.
- External registration link.

When an event has an external registration link, use that link to complete registration. The CPC platform does not replace the external registration service.

### Contests

The Contests page displays competitive programming contests with:

- Contest title and description.
- Contest platform.
- Contest date.
- Registration deadline, when provided.
- Contest lifecycle status.
- External contest URL, when provided.
- Public results or standings.

The public contest area also shows a global leaderboard based on recorded contest results.

### Gallery

The Gallery page displays static club images. Select an image to open its larger preview, then close the preview to return to the gallery.

---

## 4. Applying for Membership

Anyone can apply from the **Join Club** page.

### Information required

The form requires:

- Full name.
- Student ID.
- Email address.
- Password.
- Password confirmation.
- Department.
- Academic session.
- Payment method.
- Transaction number.

The form also accepts:

- Phone number.
- Codeforces handle.

### Payment methods

The available payment methods are:

- bKash.
- Nagad.
- Rocket.
- Cash.
- Bank Transfer.

Enter the transaction number or other payment reference exactly as provided by the payment channel.

### Password rules

- Passwords must contain at least six characters.
- Password and confirmation password must match.
- The password is stored securely as a hash after submission; it is not stored as readable text.

### Submission process

1. Open **Join Club**.
2. Complete all required fields.
3. Add optional contact and programming profile information if available.
4. Review the payment method and transaction number.
5. Submit the form.
6. Wait for an administrator to review the application.

A successful submission starts with status `PENDING`. The form is cleared after the submission succeeds.

### Duplicate application checks

The system checks for:

- An existing user with the same email.
- An existing user with the same student ID.
- Another pending application with the same email.
- Another pending application with the same student ID.

If a duplicate is found, the application is rejected and the existing account or application should be used instead.

### Application status meanings

| Status | Meaning |
| --- | --- |
| `PENDING` | The application has been submitted and is waiting for administrator review. |
| `APPROVED` | The application was accepted and a member account was created or reactivated. |
| `REJECTED` | The application was reviewed and not accepted. |

Approval does not automatically log the applicant in. The applicant must use the submitted email and password on the Login page.

---

## 5. Member Portal

The member portal is available to authenticated users through `/member`.

### Member dashboard

The dashboard can show:

- Name, profile image, and designation.
- Department and academic information.
- Contest applications.
- Codeforces and other programming handles.
- Recent notices.
- Upcoming contests.
- Recorded contest results.

Use the dashboard as the starting point for checking current activity and profile information.

### Updating the member profile

Open **Profile** from the member navigation. The profile form can update:

- Name.
- Phone number.
- Student ID.
- Department.
- Academic session.
- Profile image.
- Codeforces handle.
- VJudge handle.
- GitHub URL.

Save the form after making changes. The updated profile information is used by the dashboard, public member directory, and credential card where applicable.

A member cannot use the member profile screen to change their password. Password changes can be performed by an administrator through member management when necessary.

### Viewing applications

Open **Applications** to view the member's application activity. This area can include membership and contest application information.

Contest applications can display:

- Contest name.
- Team name, when provided.
- Application status.
- Remarks or other submitted information.

### Registering for a contest

1. Open **Applications** in the member portal.
2. Select a listed contest.
3. Enter an optional team name.
4. Add optional team or registration remarks when available.
5. Submit the application.

A new contest application starts as `PENDING`. A member cannot submit a second application for the same contest and account.

The current application endpoint accepts an authenticated session and does not enforce the contest's registration deadline or lifecycle status. Follow the contest date and registration instructions published by the club even if a registration control remains visible.

### Contest application statuses

| Status | Meaning |
| --- | --- |
| `PENDING` | The application is awaiting administrator review. |
| `APPROVED` | The member's contest application was accepted. |
| `REJECTED` | The member's contest application was not accepted. |

### Member credential

Open **Credential** to view the digital ID card generated from the member profile.

The credential can include:

- Member name.
- Profile image.
- Designation.
- Student ID.
- Department.
- Academic session.
- A QR code or verification information.

Use the download control to generate a PDF copy. The PDF is generated in the browser from the visible credential card. For the best result:

- Make sure the profile image has loaded.
- Keep the credential page open until the download finishes.
- Use a modern browser with JavaScript enabled.
- Check that the profile information is correct before downloading.

---

## 6. Administrator Portal

Administrators use the `/admin` area to manage the club platform. All administrator pages and administrator API operations require an authenticated account with role `ADMIN`.

If an unauthenticated user opens an admin page, the system redirects them to Login. If a non-admin user tries to open an admin page, the system redirects them to the member dashboard.

### Administrator dashboard

The dashboard provides an overview of:

- Total members.
- Total administrators.
- Notice count.
- Event count.
- Contest count.
- Pending membership applications.
- Pending contest applications.
- Recent application activity.

Use the dashboard to identify pending work before opening a management section.

---

## 7. Managing Membership Applications

Open **Admin > Join Applications**.

### Reviewing applications

Applications can be:

- Filtered by status.
- Searched in the browser.
- Opened for full details.
- Approved.
- Rejected.
- Deleted.

Review the applicant's identity, academic information, contact details, payment information, and transaction number before making a decision.

### Approving an application

1. Open the application details.
2. Confirm the submitted information and payment reference.
3. Choose **Approve**.
4. Confirm the action if prompted.
5. The application status becomes `APPROVED`.
6. A member account is created or an existing matching account is reactivated.

The approved account uses the email and password submitted in the membership application. The new account receives role `MEMBER` and active status.

### Rejecting an application

1. Open the application details.
2. Add a remark if an explanation is needed.
3. Choose **Reject**.
4. Confirm the action.

Rejection changes the application status to `REJECTED`. It does not create an active member account.

### Deleting an application

Deleting removes the application record. It should be used only when the record is no longer needed or was submitted incorrectly. Deletion is different from rejection because it removes the review history.

---

## 8. Managing Members

Open **Admin > Member Management**.

### Member information

An administrator can manage:

- Name.
- Email.
- Password.
- Role.
- Student ID.
- Department.
- Academic session.
- Designation.
- Phone number.
- Profile image.
- Codeforces handle.
- VJudge handle.
- GitHub URL.
- Account status.

### Creating an account

1. Open Member Management.
2. Choose the create-member action.
3. Complete the required account fields.
4. Select the appropriate role and designation.
5. Set a temporary password.
6. Save the account.

Use the `MEMBER` role for ordinary club members. Use the `ADMIN` role only for trusted administrators.

### Editing an account

1. Search for the member.
2. Open the edit action.
3. Update the required fields.
4. Save the changes.

When resetting a password, provide a new password and communicate it to the account owner through a secure channel. Do not publish passwords in notices or ordinary messages.

### Activating or deactivating an account

Active accounts can authenticate and appear in member-facing areas. Inactive accounts cannot log in.

Use an inactive status when access should be disabled without deleting the member's record.

### Deleting an account

Deleting removes the member record. Verify that the account should be permanently removed before confirming. Administrator accounts cannot be deleted through the member-management workflow.

---

## 9. Managing Notices

Open **Admin > Notice Board**.

### Creating a notice

A notice requires:

- Title.
- Content.
- Category.
- Author.

Optional settings include:

- Pinning the notice.
- Attaching a file.

After saving, the notice is available on the public Notices page.

### Editing and deleting notices

Use the edit action to change the title, content, category, pinned state, or attachment. Use delete only when the notice should no longer exist.

### Notice categories

| Category | Suggested use |
| --- | --- |
| `ANNOUNCEMENT` | General club announcements. |
| `WORKSHOP` | Workshop or learning activity information. |
| `CONTEST` | Contest-related announcements. |
| `GENERAL` | Other club information. |

Pinned notices are shown before non-pinned notices.

---

## 10. Managing Events

Open **Admin > Event Management**.

### Creating an event

An event requires:

- Title.
- Description.
- Venue.
- Event date.

Optional settings include:

- Cover image.
- External registration link.
- Active or inactive state.

Use the external registration link when registration is handled by another service such as a form provider or event platform.

### Event status

Events use an `isActive` flag:

- `true`: The event is active.
- `false`: The event is inactive.

The public API filters inactive events. The server-rendered public events page currently retrieves events without applying that filter, so an inactive event may still appear there until the implementation is corrected.

### Editing and deleting events

Use edit to update event details or deactivate an event. Delete only when the event record should be permanently removed.

---

## 11. Managing Contests

Open **Admin > Contests & Standings**.

### Creating a contest

A contest requires:

- Title.
- Contest date.

Other contest fields include:

- Description.
- Platform, such as VJudge or another supported platform.
- External contest URL.
- Registration deadline.
- Lifecycle status.

### Contest statuses

| Status | Meaning |
| --- | --- |
| `UPCOMING` | The contest has not started. |
| `RUNNING` | The contest is currently in progress. |
| `COMPLETED` | The contest has finished and results can be recorded. |

The database uses `COMPLETED` for a finished contest. Use that value when managing contests.

### Reviewing contest applications

1. Select a contest.
2. Open its applications.
3. Review the member, team information, and remarks.
4. Update each application to `APPROVED` or `REJECTED` as appropriate.
5. Leave an explanatory remark when useful.

### Recording contest results

For each participant, an administrator can record:

- Problems solved.
- Rating.
- Rank.
- Remarks.

Saved results appear in the member dashboard and public contest results or standings where applicable.

### Contest registration behavior

The current backend prevents duplicate applications for the same user and contest, but it does not automatically enforce:

- Registration deadline.
- Contest lifecycle status.
- Active membership status.
- Member-only access.

Administrators should communicate registration windows clearly and review applications before approval.

---

## 12. Status Reference

### User accounts

| Value | Meaning |
| --- | --- |
| `ACTIVE` | The account can log in and is available to member-facing features. |
| `INACTIVE` | The account is disabled and cannot log in. |

### Membership applications

| Value | Meaning |
| --- | --- |
| `PENDING` | Waiting for administrator review. |
| `APPROVED` | Accepted; an active member account is created or reactivated. |
| `REJECTED` | Not accepted. |

### Contest applications

| Value | Meaning |
| --- | --- |
| `PENDING` | Waiting for contest review. |
| `APPROVED` | Accepted for the contest. |
| `REJECTED` | Not accepted for the contest. |

### Contests

| Value | Meaning |
| --- | --- |
| `UPCOMING` | Scheduled for a future date. |
| `RUNNING` | Currently in progress. |
| `COMPLETED` | Finished; results may be recorded. |

---

## 13. Uploads and Images

The platform can upload profile images, cover images, notice attachments, and other files to Cloudflare R2 when storage is configured.

### Upload behavior

- Files are uploaded through the platform's upload service.
- Files are stored under an `uploads/` prefix.
- A public R2 URL should be configured for production use.
- The upload service currently does not enforce a visible file-size, MIME-type, or extension policy.

Use appropriate, non-sensitive files and avoid uploading confidential documents unless the club has approved the storage policy.

### Image proxy

Some credential images are loaded through an image proxy so they can be rendered in the credential card. Use trusted image URLs only.

---

## 14. Troubleshooting

### I cannot log in

Check the following:

- The email address is correct.
- The password is correct.
- The membership application was approved.
- The account is active.
- The email is entered using the same account that was approved.

If the account is inactive or the password is unknown, contact an administrator.

### My membership application will not submit

Check that:

- All required fields are filled.
- The password has at least six characters.
- Both password fields match.
- The payment method is selected.
- The transaction number is present.
- The email or student ID is not already used by another user or pending application.

### My member profile changes are not visible

Refresh the page after saving. Confirm that the save operation completed successfully and that the correct account is signed in.

### My contest application cannot be submitted

A duplicate application for the same contest is not allowed. Check the Applications page first. If the registration deadline has passed or the contest has ended, contact an administrator because the current interface may still display the contest.

### My credential PDF is incomplete

Wait for the profile image and QR code to finish loading before downloading. Then reload the credential page and try again in a modern browser.

### An uploaded image or attachment is missing

The platform requires working Cloudflare R2 configuration for file storage. An administrator should verify the R2 account, bucket, access keys, and public URL.

### An administrator page redirects me to Login

The session may have expired. Sign in again. If the account is a member rather than an administrator, it cannot access the admin portal.

---

## 15. Privacy and Security Guidance

- Do not share passwords in public notices, contest remarks, or screenshots.
- Use a unique, strong password for every administrator account.
- Deactivate accounts when access should be removed.
- Avoid placing unnecessary personal information in public notices or contest remarks.
- Review public member profile fields before publishing sensitive information.
- Treat student IDs, email addresses, payment references, and profile images as personal information.
- Only upload files that the club is permitted to store and publish.
- Administrators should review API and storage configuration before putting the system into production.

The platform currently exposes some profile and contest-related data through public or authenticated endpoints. Treat all content entered into the system as potentially visible to other users unless the relevant workflow explicitly states otherwise.

---

## 16. Administrator Operational Checklist

### Before opening the platform

- Confirm the database is available.
- Confirm authentication secrets are configured.
- Confirm file storage is configured if uploads are needed.
- Confirm at least one active administrator account exists.

### Daily review

- Check pending membership applications.
- Check pending contest applications.
- Review new notices and event information.
- Confirm upcoming contest dates and registration deadlines.
- Deactivate accounts that should no longer have access.

### Before publishing content

- Check spelling, dates, venue, links, and attachments.
- Confirm whether a notice should be pinned.
- Confirm event and contest status values.
- Avoid publishing private payment or identity details.

### After a contest

- Change the contest status to `COMPLETED`.
- Review participant applications.
- Record rank, rating, and solved-problem counts.
- Verify that public standings display the intended information.

---

## 17. Technical Reference for Maintainers

The user interface is organized into Next.js App Router route groups:

```text
src/app/(public)/     Public website
src/app/(member)/     Member portal
src/app/(admin)/      Administrator portal
src/app/api/          API route handlers
src/components/       Shared UI components
src/lib/              Authentication, database, storage, and helpers
src/models/           Mongoose data models
```

The main models are:

- `User`
- `JoinApplication`
- `Notice`
- `Event`
- `Contest`
- `ContestApplication`
- `ContestResult`

Protected page navigation is handled by `src/proxy.js`. Authentication is configured in `src/lib/auth.js`. MongoDB connections are managed in `src/lib/db.js`. Cloudflare R2 integration is handled in `src/lib/r2.js`.

API responses generally use a `success` flag and return either `data` or `error`.

---

## 18. Known Implementation Notes

These notes describe current behavior that administrators and maintainers should understand:

1. The user interface may offer a `SUSPENDED` member status, but the user model currently accepts only `ACTIVE` and `INACTIVE`. Use `INACTIVE` until those values are aligned.
2. The contest form may show `ENDED`, while the data model uses `COMPLETED`. Use `COMPLETED` for a finished contest.
3. Public detail API routes exist for notices, events, contests, and results, but the public interface does not currently link to dedicated detail pages for every resource.
4. The public events API filters inactive events, while the server-rendered events page may still display them. Verify visibility after changing an event to inactive.
5. Contest registration currently relies on administrator review and does not fully enforce dates or membership status.
6. File uploads and image proxying should be secured and restricted before production use.

These are implementation notes for operating the current release. They are not user errors.
