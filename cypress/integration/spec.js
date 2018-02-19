/// <reference types="Cypress" />
const itsName = require('its-name')
const toFullTestName = (runnable) =>
  itsName(runnable).join(' - ')
const isPassed = (test) =>
  test.state === 'passed'

Cypress.on('fail', (err, runnable) => {
  const fullName = toFullTestName(runnable)

  console.group('failed test "%s"', fullName)
  console.error('fail', err)
  console.error('runnable', runnable)
  console.error('kuker events', kukerEvents)
  console.groupEnd()

  // here we can change the error!

  throw new Error(`Ooops, test "${fullName}" failed!\n${err.message}`)
})
Cypress.on('test:before:run:async', (test, runnable) => {
  console.log('before test "%s"', toFullTestName(runnable))
})
// Cypress.prependListener('test:before:run:async', (test, runnable) => {
  // TODO how to read file that might not exist yet
  // cy.now('readFile', './file.json')
  // throws error
  //  TypeError: Cannot read property 'hasPreviouslyLinkedCommand' of undefined
// })

Cypress.prependListener('test:after:run', (test, runnable) => {
  const fullName = toFullTestName(runnable)

  console.group('test:after:run "%s"', fullName)
  if (isPassed(test)) {
    console.log('✅ test %s', test.state)
  } else {
    console.log('⚠️ test %s', test.state)
  }
  console.log(test)
  console.log(runnable)
  console.groupEnd()

  if (isPassed(test)) {
    // save test log
    cy.now('writeFile', 'file.json', JSON.stringify(kukerEvents, null, 2))
    // TODO: needs to work on "test:after:run:async"
    // and return the promise
  } else {
    // we can change the error here to provide more details
    // test.error = new Error('more details')
  }
})

const kukerEvents = []
Cypress.on('test:before:run', () => {
  kukerEvents.length = 0
})
Cypress.on('window:before:load', (win) => {
  console.log('intercepting Kuker events')
  const postMessage = win.postMessage.bind(win)
  win.postMessage = (o, target) => {
    if (o.kuker) {
      kukerEvents.push(o)
      Cypress.log({name: 'kuker', type: 'parent', message: o.type})
    }
    return postMessage(o, target)
  }
})
beforeEach('intercept Kuker events', () => {
  // cy.state('kuker', kukerEvents)
  cy.visit('http://localhost:1234')
})
it('loads', () => {})
it('fails', () => {
  throw new Error('nope')
})
