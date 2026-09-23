// The deployment host serves dist and dispatches stripped /api/* paths here.
export async function handleApi(request) {
  if (new URL(request.url).pathname === '/api/health') return Response.json({ok:true,game:'before-the-close',release:'2026-09-23-r8.2',persistence:'browser-session'});
  return Response.json({error:'NOT_FOUND'},{status:404});
}
