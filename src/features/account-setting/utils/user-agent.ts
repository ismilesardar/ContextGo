export function getUserBrowserInfo({
  userAgentInfo
}: {
  userAgentInfo: UAParser.IResult | null;
}) {
  if (!userAgentInfo) return 'Unknown Device';

  if (userAgentInfo.browser.name === null && userAgentInfo.os.name === null) {
    return 'Unknown Device';
  }
  if (userAgentInfo.browser.name === null)
    return userAgentInfo.os.name || 'Unknown OS';
  if (userAgentInfo.os.name === null)
    return userAgentInfo.browser.name || 'Unknown Browser';

  const browserName = userAgentInfo.browser.name || 'Unknown Browser';
  const osName = userAgentInfo.os.name || '';

  return `${browserName}, ${osName}`.trim();
}

export function formatDate(date: Date) {
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short'
  }).format(new Date(date));
}
