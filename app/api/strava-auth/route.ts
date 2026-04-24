import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get('code')

  // Step 1: no code yet — redirect to Strava authorization
  if (!code) {
    const params = new URLSearchParams({
      client_id: process.env.STRAVA_CLIENT_ID!,
      response_type: 'code',
      redirect_uri: `${process.env.NEXT_PUBLIC_URL}/api/strava-auth`,
      approval_prompt: 'force',
      scope: 'activity:read_all',
    })
    return NextResponse.redirect(`https://www.strava.com/oauth/authorize?${params}`)
  }

  // Step 2: exchange code for tokens
  const res = await fetch('https://www.strava.com/oauth/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      client_id: process.env.STRAVA_CLIENT_ID,
      client_secret: process.env.STRAVA_CLIENT_SECRET,
      code,
      grant_type: 'authorization_code',
    }),
  })

  const data = await res.json()

  if (!data.refresh_token) {
    return new NextResponse(
      `<pre style="font-family:monospace;padding:2rem">ERROR:\n${JSON.stringify(data, null, 2)}</pre>`,
      { headers: { 'Content-Type': 'text/html' } }
    )
  }

  return new NextResponse(
    `<!DOCTYPE html>
<html>
<body style="font-family:monospace;background:#09090b;color:#fafafa;padding:2rem">
  <h2 style="color:#DFE104">✓ Got your Strava tokens</h2>
  <p>Copy the refresh token below into your <code>.env.local</code> as<br>
  <code>STRAVA_REFRESH_TOKEN=...</code> and also into Vercel env vars.</p>
  <div style="background:#1c1c1e;padding:1rem;border:1px solid #3f3f46;margin-top:1rem;word-break:break-all">
    <strong style="color:#DFE104">STRAVA_REFRESH_TOKEN=</strong>${data.refresh_token}
  </div>
  <p style="color:#a1a1aa;margin-top:1rem;font-size:0.85rem">
    Access token (expires in ~6 hrs, not needed): ${data.access_token?.substring(0, 10)}...
  </p>
</body>
</html>`,
    { headers: { 'Content-Type': 'text/html' } }
  )
}
