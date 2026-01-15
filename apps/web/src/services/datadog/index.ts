import { datadogLogs } from '@datadog/browser-logs'
import { datadogRum } from '@datadog/browser-rum'
import { reactPlugin } from '@datadog/browser-rum-react'
import { APP_ENV, DATADOG_APPLICATION_ID, DATADOG_CLIENT_TOKEN, IS_PRODUCTION } from '@/config/constants'
import packageJson from '../../../package.json'

const DATADOG_SITE = 'datadoghq.eu'
const SERVICE_NAME = 'safe-wallet'

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
      service: SERVICE_NAME,
      env: APP_ENV,
      version: packageJson.version,
      sessionSampleRate: 100,
      sessionReplaySampleRate: 0,
      trackResources: true,
      trackLongTasks: true,
      defaultPrivacyLevel: 'mask-user-input',
      plugins: [reactPlugin({ router: false })],
    })
  }

  if (!IS_PRODUCTION) {
    console.debug('[Datadog] initialized', { logs: true, rum: Boolean(DATADOG_APPLICATION_ID) })
  }
}

export const logger = datadogLogs.logger

// Client-side only
if (typeof window !== 'undefined') {
  initDatadog()
}
