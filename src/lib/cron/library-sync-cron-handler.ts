import cron from 'node-cron';
import { syncLibraryTemplates } from '@/lib/api/library/sync-library';

export function librarySyncCron() {
  // Use globalThis to prevent duplicate registration during Hot Module Replacement (HMR)
  if ((globalThis as any)._isLibrarySyncCronStarted) {
    return;
  }

  // Run daily, off-peak
  cron.schedule('0 3 * * *', async () => {
    try {
      const summary = await syncLibraryTemplates();
      console.log('✅ [CRON] Library sync complete', summary);
    } catch (error) {
      console.error('❌ [CRON] Library sync failed:', error);
    }
  });

  (globalThis as any)._isLibrarySyncCronStarted = true;
}
