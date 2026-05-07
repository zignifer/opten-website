// src/app/utils/detectOS.ts
export type OS = 'mac' | 'windows' | 'linux' | 'ios' | 'android' | 'unknown';
export type SurfaceTab = 'web' | 'desktop' | 'cli' | 'mobile';

export function detectOS(): OS {
  if (typeof navigator === 'undefined') return 'unknown';

  // Tier 1: userAgentData (Chromium-only, ~70% browsers as of 2026)
  const uaData = (navigator as any).userAgentData;
  if (uaData?.platform) {
    const p = uaData.platform.toLowerCase();
    if (p.includes('mac')) return 'mac';
    if (p.includes('win')) return 'windows';
    if (p.includes('linux')) return 'linux';
    if (p.includes('android')) return 'android';
  }

  // Tier 2: classic UA parsing
  const ua = navigator.userAgent || '';
  if (/iPhone|iPad|iPod/.test(ua)) return 'ios';
  if (/Android/.test(ua)) return 'android';
  if (/Macintosh|Mac OS X/.test(ua)) {
    // Tier 3: iPad masquerade — iPadOS 13+ reports as Mac. Disambiguate via touch.
    if (navigator.maxTouchPoints > 1) return 'ios';
    return 'mac';
  }
  if (/Windows NT/.test(ua)) return 'windows';
  if (/Linux|X11/.test(ua)) return 'linux';

  return 'unknown';
}

export function osToSurface(os: OS): SurfaceTab {
  switch (os) {
    case 'mac':
    case 'windows': return 'desktop';
    case 'linux':   return 'cli';
    case 'ios':
    case 'android': return 'mobile';
    default:        return 'web';
  }
}
