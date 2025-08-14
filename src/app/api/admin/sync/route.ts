// ...your imports above remain unchanged

function json(status: number, body: any) {
  return new NextResponse(JSON.stringify(body), {
    status,
    headers: {
      'content-type': 'application/json',
      'x-admin-sync': 'v2',
      'access-control-allow-origin': 'https://www.ticketpay.us.com, https://ticketpay.us.com, http://localhost:3000, http://localhost:3010',
      'access-control-allow-headers': 'authorization, content-type',
      'access-control-allow-methods': 'OPTIONS, POST',
    },
  });
}

// ...rest of your route.ts unchanged
