/// <reference types="Cypress" />
Cypress.on('fail', (err, runnable) => {
  console.error('fail', err)
  console.error('runnable', runnable)
  console.error('kuker events', cy.state('kuker'))
  throw err
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
