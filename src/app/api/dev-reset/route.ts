import { NextResponse } from "next/server";

export async function GET() {
  if (process.env.NODE_ENV !== "development") {
    return NextResponse.json({ error: "Not available" }, { status: 403 });
  }

  const html = `<!DOCTYPE html>
<html>
<head><title>Dev Reset</title></head>
<body style="background:#000;color:#fff;font-family:monospace;padding:40px;">
<h1>Resetting...</h1>
<pre id="log"></pre>
<script>
  const log = document.getElementById('log');
  function addLog(msg) { log.textContent += msg + '\\n'; }

  // Clear all localStorage
  const lsKeys = Object.keys(localStorage);
  addLog('localStorage keys: ' + lsKeys.join(', '));
  localStorage.clear();
  addLog('localStorage cleared');

  // Clear sessionStorage
  sessionStorage.clear();
  addLog('sessionStorage cleared');

  // Clear all cookies
  document.cookie.split(';').forEach(c => {
    const name = c.trim().split('=')[0];
    document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/';
    addLog('cookie cleared: ' + name);
  });

  // Clear IndexedDB
  if (indexedDB.databases) {
    indexedDB.databases().then(dbs => {
      dbs.forEach(db => {
        indexedDB.deleteDatabase(db.name);
        addLog('indexedDB cleared: ' + db.name);
      });
    });
  }

  // Unregister service workers
  if (navigator.serviceWorker) {
    navigator.serviceWorker.getRegistrations().then(regs => {
      regs.forEach(r => { r.unregister(); addLog('SW unregistered'); });
    });
  }

  addLog('\\nDone! Redirecting in 2 seconds...');
  setTimeout(() => { window.location.href = '/signin'; }, 2000);
</script>
</body>
</html>`;

  return new NextResponse(html, {
    headers: {
      "Content-Type": "text/html",
      "Set-Cookie": "authjs.session-token=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;httponly",
    },
  });
}
