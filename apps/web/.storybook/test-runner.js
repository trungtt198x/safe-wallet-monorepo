const { getStoryContext } = require('@storybook/test-runner')
const { toMatchImageSnapshot } = require('jest-image-snapshot')

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

    // Small delay for any remaining renders
    await page.waitForTimeout(100)

    // Take screenshot
    const screenshot = await page.screenshot()

    // Compare with baseline using jest-image-snapshot
    expect(screenshot).toMatchImageSnapshot({
      customSnapshotIdentifier: context.id,
      // Allow 1% pixel difference to account for minor rendering variations
      failureThreshold: 0.01,
      failureThresholdType: 'percent',
    })
  },
}

module.exports = config
