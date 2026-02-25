/**
 * Email validation utilities — safe for both client and server.
 */

const EMAIL_REGEX =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*\.[a-zA-Z]{2,}$/;

export function isValidEmailFormat(email: string): boolean {
  return EMAIL_REGEX.test(email.trim());
}

const DISPOSABLE_DOMAINS = new Set([
  "mailinator.com",
  "tempmail.com",
  "guerrillamail.com",
  "guerrillamail.net",
  "guerrillamail.org",
  "throwaway.email",
  "temp-mail.org",
  "fakeinbox.com",
  "sharklasers.com",
  "guerrillamailblock.com",
  "grr.la",
  "dispostable.com",
  "yopmail.com",
  "yopmail.fr",
  "trashmail.com",
  "trashmail.me",
  "trashmail.net",
  "mailnesia.com",
  "maildrop.cc",
  "discard.email",
  "mailcatch.com",
  "tempail.com",
  "tempr.email",
  "temp-mail.io",
  "mohmal.com",
  "burnermail.io",
  "mailnull.com",
  "spamgourmet.com",
  "mytemp.email",
  "getairmail.com",
  "meltmail.com",
  "throwam.com",
  "tmail.ws",
  "harakirimail.com",
  "getnada.com",
  "mailsac.com",
  "inboxkitten.com",
  "33mail.com",
  "maildax.com",
  "10minutemail.com",
  "10minute.email",
  "minutemail.com",
  "emailondeck.com",
  "tempmailaddress.com",
  "tempinbox.com",
  "crazymailing.com",
  "trashymail.com",
  "mailexpire.com",
  "tempmailo.com",
  "tempomail.fr",
  "jetable.org",
  "spam4.me",
  "mailtemp.info",
  "1secmail.com",
  "1secmail.net",
  "1secmail.org",
  "emailfake.com",
  "luxusmail.org",
  "tmpmail.net",
  "tmpmail.org",
  "moakt.cc",
  "moakt.ws",
  "boun.cr",
  "bouncr.com",
]);

export function isDisposableEmail(email: string): boolean {
  const domain = email.trim().split("@")[1]?.toLowerCase();
  if (!domain) return false;
  return DISPOSABLE_DOMAINS.has(domain);
}

const TYPO_MAP: Record<string, string> = {
  "gmial.com": "gmail.com",
  "gmal.com": "gmail.com",
  "gmaill.com": "gmail.com",
  "gamil.com": "gmail.com",
  "gnail.com": "gmail.com",
  "gmali.com": "gmail.com",
  "gmai.com": "gmail.com",
  "gmail.co": "gmail.com",
  "gmail.cm": "gmail.com",
  "gmail.om": "gmail.com",
  "gmail.con": "gmail.com",
  "gmail.cmo": "gmail.com",
  "gmaul.com": "gmail.com",
  "gmailcom": "gmail.com",
  "yahooo.com": "yahoo.com",
  "yaho.com": "yahoo.com",
  "yhoo.com": "yahoo.com",
  "yahoo.co": "yahoo.com",
  "yahoo.cm": "yahoo.com",
  "yahoo.con": "yahoo.com",
  "yhaoo.com": "yahoo.com",
  "hotmal.com": "hotmail.com",
  "hotmial.com": "hotmail.com",
  "hotmaill.com": "hotmail.com",
  "hotmai.com": "hotmail.com",
  "hotmail.co": "hotmail.com",
  "hotmail.cm": "hotmail.com",
  "hotmail.con": "hotmail.com",
  "outlok.com": "outlook.com",
  "outloo.com": "outlook.com",
  "outlook.co": "outlook.com",
  "outlook.cm": "outlook.com",
  "outlook.con": "outlook.com",
  "iclould.com": "icloud.com",
  "icloud.co": "icloud.com",
  "icloud.cm": "icloud.com",
  "icloud.con": "icloud.com",
  "icoud.com": "icloud.com",
  "icload.com": "icloud.com",
  "protonmal.com": "protonmail.com",
  "protonmai.com": "protonmail.com",
  "protonmail.co": "protonmail.com",
  "protonmail.con": "protonmail.com",
};

export function detectEmailTypo(email: string): string | null {
  const domain = email.trim().split("@")[1]?.toLowerCase();
  if (!domain) return null;
  const correction = TYPO_MAP[domain];
  if (!correction) return null;
  const local = email.trim().split("@")[0];
  return `${local}@${correction}`;
}
