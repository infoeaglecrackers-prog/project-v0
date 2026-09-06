import User from "../models/User";

/**
 * Everyone who should hear about payment events.
 *
 * Payments on the self-hosted UPI rail are confirmed by a human, so the alert has
 * to reach every admin rather than one inbox — otherwise a claim sits unverified
 * whenever the single ADMIN_EMAIL owner is away.
 *
 * ADMIN_EMAIL is still honoured as an extra recipient (e.g. a shared
 * orders@ mailbox that isn't a login account), deduped against the real admins.
 */
export const getAdminEmails = async (): Promise<string[]> => {
  const recipients = new Set<string>();

  try {
    const admins = await User.find({ role: "admin" }).select("email").lean();
    for (const a of admins) {
      if (a.email) recipients.add(a.email.trim().toLowerCase());
    }
  } catch (err) {
    // Fall through to ADMIN_EMAIL rather than losing the alert entirely.
    console.error("Couldn't load admin recipients:", err);
  }

  const fallback = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  if (fallback) recipients.add(fallback);

  return [...recipients];
};

/** Comma-joined for nodemailer's `to` field. Empty string means "nobody to tell". */
export const getAdminRecipientLine = async (): Promise<string> =>
  (await getAdminEmails()).join(", ");
