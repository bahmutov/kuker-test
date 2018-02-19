/// <reference types="Cypress" />
const itsName = require('its-name')
const toFullTestName = (runnable) =>
  itsName(runnable).join(' - ')

Cypress.on('fail', (err, runnable) => {
  const fullName = toFullTestName(runnable)

  console.group('failed test "%s"', fullName)
  console.error('fail', err)
  console.error('runnable', runnable)
  console.error('kuker events', cy.state('kuker'))
  console.groupEnd()

  // here we can change the error!
  throw new Error(`Ooops, test "${fullName}" failed!\n${err.message}`)
})
Cypress.on('test:after:run', (test, runnable) => {
  const fullName = toFullTestName(runnable)

  console.group('test:after:run "%s"', fullName)
  if (test.state === 'passed') {
    console.log('✅ test %s', test.state)
  } else {
    console.log('⚠️ test %s', test.state)
  }
  console.log(test)
  console.log(runnable)
  console.groupEnd()


})
beforeEach('intercept Kuker events', () => {
  const kukerEvents = []
  cy.state('kuker', kukerEvents)

  cy.visit('http://localhost:1234', {
    onBeforeLoad: win => {
      console.log('intercepting Kuker events')
      const postMessage = win.postMessage.bind(win)
      win.postMessage = (o, target) => {
        if (o.kuker) {
          kukerEvents.push(o)
        }
        return postMessage(o, target)
      }
    }
  })
})
it('loads', () => {})
it('fails', () => {
  throw new Error('nope')
})
