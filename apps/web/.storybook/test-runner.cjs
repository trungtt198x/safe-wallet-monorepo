const path = require('path')
const { getStoryContext } = require('@storybook/test-runner')
const { toMatchImageSnapshot } = require('jest-image-snapshot')

// Configurable threshold via environment variable (default: 1%)
const FAILURE_THRESHOLD = parseFloat(process.env.VISUAL_REGRESSION_THRESHOLD || '0.01')

/** @type {import('@storybook/test-runner').TestRunnerConfig} */
const config = {
  setup() {
    // Extend Jest expect with image snapshot matcher
    expect.extend({ toMatchImageSnapshot })
  },

  async postVisit(page, context) {
    // Get story context to check for visual test opt-out
    const storyContext = await getStoryContext(page, context)

    // Skip visual tests if story has `parameters.visualTest.disable: true`
    if (storyContext.parameters?.visualTest?.disable) {
      return
    }

    // Wait for any animations/transitions to complete
    await page.evaluate(() => {
      return new Promise((resolve) => {
        // Wait for fonts to load
        if (document.fonts?.ready) {
          document.fonts.ready.then(() => resolve())
        } else {
          resolve()
        }
      })
    })

    // Wait for network to be idle to reduce flakiness
    await page.waitForLoadState('networkidle')

    // Take screenshot
    const screenshot = await page.screenshot()

    // Compare with baseline using jest-image-snapshot
    // Snapshots are stored in a central location for easier CI artifact collection
    expect(screenshot).toMatchImageSnapshot({
      customSnapshotIdentifier: context.id,
      customSnapshotsDir: path.join(process.cwd(), '__visual_snapshots__'),
      customDiffDir: path.join(process.cwd(), '__visual_snapshots__', '__diff_output__'),
      failureThreshold: FAILURE_THRESHOLD,
      failureThresholdType: 'percent',
    })
  },
}

module.exports = config
