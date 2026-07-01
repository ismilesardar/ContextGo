import { headers } from 'next/headers';

export const getIP = async (req?: any): Promise<string> => {
  const FALLBACK_IP_ADDRESS = '0.0.0.0';

  if (req) {
    const hdrs = req.headers;

    // Web Fetch Request-style headers (has `get`)
    if (hdrs && typeof hdrs.get === 'function') {
      const forwardedFor = hdrs.get('x-forwarded-for') || hdrs.get('x-real-ip');
      if (forwardedFor) return forwardedFor.split(',')[0].trim();
    }

    // Node/Express-style plain headers object
    if (hdrs && typeof hdrs === 'object') {
      const xfwd =
        hdrs['x-forwarded-for'] ||
        hdrs['x-real-ip'] ||
        hdrs['X-Forwarded-For'] ||
        hdrs['X-Real-IP'];
      if (xfwd) return String(xfwd).split(',')[0].trim();
    }

    // Fallback to socket remote address
    const remote =
      (req.socket && req.socket.remoteAddress) ||
      (req.connection && (req.connection as any).remoteAddress);
    if (remote) return String(remote);
  }

  // No request provided — use Next's headers()
  const forwardedFor = (await headers()).get('x-forwarded-for');
  if (forwardedFor) {
    return forwardedFor.split(',')[0] ?? FALLBACK_IP_ADDRESS;
  }

  return (await headers()).get('x-real-ip') ?? FALLBACK_IP_ADDRESS;
};
