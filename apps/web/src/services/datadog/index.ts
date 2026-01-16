import { datadogLogs } from '@datadog/browser-logs'
import { datadogRum } from '@datadog/browser-rum'
import { APP_ENV, DATADOG_APPLICATION_ID, DATADOG_CLIENT_TOKEN, DATADOG_SERVICE } from '@/config/constants'
import { APP_VERSION } from '@/config/version'

const DATADOG_SITE = 'datadoghq.eu'

function initDatadog(): void {
  if (!DATADOG_CLIENT_TOKEN || datadogLogs.getInitConfiguration?.()) {
    return
  }

  datadogLogs.init({
    clientToken: DATADOG_CLIENT_TOKEN,
    site: DATADOG_SITE,
    forwardErrorsToLogs: true,
    sessionSampleRate: 100,
  })

  if (DATADOG_APPLICATION_ID) {
    datadogRum.init({
      applicationId: DATADOG_APPLICATION_ID,
      clientToken: DATADOG_CLIENT_TOKEN,
      site: DATADOG_SITE,
      service: DATADOG_SERVICE,
      env: APP_ENV,
      version: APP_VERSION,
      sessionSampleRate: 100,
      sessionReplaySampleRate: 0,
      trackUserInteractions: true,
      trackResources: true,
      trackLongTasks: true,
      defaultPrivacyLevel: 'mask-user-input',
    })
  }
}

export const logger = datadogLogs.logger

// Client-side only
if (typeof window !== 'undefined') {
  initDatadog()
}
