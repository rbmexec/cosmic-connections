import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export function GET(request: NextRequest) {
  const origin = request.nextUrl.origin;

  // Return an HTML page that fetches the CSRF token and auto-submits a form
  // to NextAuth's Google sign-in endpoint. This runs inside SFSafariViewController
  // so cookies will be set in the Safari context.
  const html = `<!DOCTYPE html>
<html>
<head>
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <style>
    body {
      background: #020617;
      color: white;
      font-family: -apple-system, system-ui, sans-serif;
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      margin: 0;
    }
    .loader {
      text-align: center;
    }
    .spinner {
      width: 32px;
      height: 32px;
      border: 3px solid rgba(255,255,255,0.2);
      border-top-color: #8b5cf6;
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
      margin: 0 auto 16px;
    }
    @keyframes spin { to { transform: rotate(360deg); } }
  </style>
</head>
<body>
  <div class="loader">
    <div class="spinner"></div>
    <p>Connecting to Google...</p>
  </div>
  <form id="signin-form" method="POST" action="${origin}/api/auth/signin/google" style="display:none">
    <input type="hidden" name="csrfToken" id="csrf-token" />
    <input type="hidden" name="callbackUrl" value="${origin}/api/auth-mobile/redirect" />
  </form>
  <script>
    fetch('${origin}/api/auth/csrf')
      .then(r => r.json())
      .then(data => {
        document.getElementById('csrf-token').value = data.csrfToken;
        document.getElementById('signin-form').submit();
      })
      .catch(() => {
        document.querySelector('.loader p').textContent = 'Failed to connect. Please try again.';
      });
  </script>
</body>
</html>`;

  return new NextResponse(html, {
    headers: { "Content-Type": "text/html" },
  });
}
