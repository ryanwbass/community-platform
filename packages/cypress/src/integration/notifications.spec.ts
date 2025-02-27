import { DbCollectionName } from '../utils/test-utils'

describe('[Notifications]', () => {
  it('[are not generated when the howTo author is triggering notification]', () => {
    cy.visit('how-to')
    cy.login('event_reader@test.com', 'test1234')
    cy.visit('/how-to/testing-testing')
    cy.wait(2000)
    cy.get('[data-cy="vote-useful"]').contains('Useful').click()
    cy.wait(2000)
    cy.step('Verify the notification has not been added')
    cy.queryDocuments('users', 'userName', '==', 'event_reader').then(
      (docs) => {
        expect(docs.length).to.be.greaterThan(0)
        expect(docs[0]['notifications']).to.be.undefined
      },
    )
  })

  it('[are generated by clicking on useful]', () => {
    cy.visit('how-to')
    cy.login('howto_reader@test.com', 'test1234')
    cy.wait(2000)
    cy.visit('/how-to/testing-testing')
    cy.wait(2000)
    cy.get('[data-cy="vote-useful"]').contains('Useful').click()
    cy.wait(7000)
    cy.step('Verify the notification has been added')
    cy.queryDocuments('users', 'userName', '==', 'event_reader').then(
      (docs) => {
        expect(docs.length).to.be.greaterThan(0)
        const user = docs[1]
        let notifications = user['notifications']
        expect(notifications.length).to.equal(1)
        expect(notifications[0]['type']).to.equal('howto_useful')
        expect(notifications[0]['relevantUrl']).to.equal(
          '/how-to/testing-testing',
        )
        expect(notifications[0]['read']).to.equal(false)
        expect(notifications[0]['triggeredBy']['displayName']).to.equal(
          'howto_reader',
        )
      },
    )
  })

  it('[are generated by adding comments]', () => {
    cy.visit('how-to')
    cy.login('howto_reader@test.com', 'test1234')
    cy.visit('/how-to/testing-testing')
    cy.wait(2000)
    cy.get('[data-cy="comments-form"]').type('some sample comment')
    cy.wait(2000)
    cy.get('[data-cy="comment-submit"]').click()
    cy.wait(7000)
    cy.step('Verify the notification has been added')
    cy.queryDocuments('users', 'userName', '==', 'event_reader').then(
      (docs) => {
        expect(docs.length).to.be.greaterThan(0)
        const user = docs[1]
        let notifications = user['notifications']
        expect(notifications.length).to.equal(1)
        expect(notifications[0]['type']).to.equal('new_comment')
        expect(notifications[0]['relevantUrl']).to.equal(
          '/how-to/testing-testing',
        )
        expect(notifications[0]['read']).to.equal(false)
        expect(notifications[0]['triggeredBy']['displayName']).to.equal(
          'howto_reader',
        )
      },
    )
  })

  it('[are generated by adding comments to research]', () => {
    cy.visit('how-to')
    cy.login('howto_reader@test.com', 'test1234')
    cy.wait(5000)
    cy.visit('/research/qwerty')
    cy.wait(2000)
    cy.get('[data-cy="open-comments"]').click()
    cy.wait(2000)
    cy.get('[data-cy="comments-form"]').type('some sample comment')
    cy.wait(2000)
    cy.get('[data-cy="comment-submit"]').click()
    cy.wait(7000)
    cy.step('Verify the notification has been added')
    cy.queryDocuments('users', 'userName', '==', 'event_reader').then(
      (docs) => {
        expect(docs.length).to.be.greaterThan(0)
        const user = docs[1]
        let notifications = user['notifications']
        expect(notifications.length).to.equal(1)
        expect(notifications[0]['type']).to.equal('new_comment_research')
        expect(notifications[0]['relevantUrl']).to.equal(
          '/research/qwerty#update_0',
        )
        expect(notifications[0]['read']).to.equal(false)
        expect(notifications[0]['triggeredBy']['displayName']).to.equal(
          'howto_reader',
        )
      },
    )
  })

  it('[appear in notifications modal]', () => {
    cy.visit('how-to')
    cy.login('event_reader@test.com', 'test1234')
    cy.visit('/how-to/testing-testing')
    cy.wait(5000)
    cy.get(
      '[data-cy="notifications-desktop"] [data-cy="toggle-notifications-modal"]',
    ).click()
    cy.wait(2000)
    const notifications = cy.get('[data-cy="notification"]')
    expect(notifications).to.exist
  })

  it('[notifications modal is closed when clicking on the notifications icon for the second time or clicking on the header]', () => {
    cy.visit('how-to')
    cy.login('event_reader@test.com', 'test1234')
    cy.visit('/how-to/testing-testing')
    cy.wait(5000)
    cy.get(
      '[data-cy="notifications-desktop"] [data-cy="toggle-notifications-modal"]',
    ).click()
    let notificationsModal = cy.get('[data-cy="notifications-modal-desktop"]')
    expect(notificationsModal).to.exist
    //click on the notifications button again
    cy.get(
      '[data-cy="notifications-desktop"] [data-cy="toggle-notifications-modal"]',
    ).click()
    notificationsModal = cy.get('[data-cy="notifications-modal-desktop"]')
    notificationsModal.should('not.exist')
    //click within the header area
    cy.get(
      '[data-cy="notifications-desktop"] [data-cy="toggle-notifications-modal"]',
    ).click()
    cy.get('[data-cy="header"]').click()
    notificationsModal = cy.get('[data-cy="notifications-modal-desktop"]')
    notificationsModal.should('not.exist')
  })

  it('[are marked read when clicking on clear button]', () => {
    cy.visit('how-to')
    cy.login('event_reader@test.com', 'test1234')
    cy.visit('/how-to/testing-testing')
    cy.wait(5000)
    cy.get(
      '[data-cy="notifications-desktop"] [data-cy="toggle-notifications-modal"]',
    ).click()
    cy.wait(2000)
    cy.get('[data-cy="clear-notifications"]').click()
    cy.wait(2000)
    cy.step('Verify the notification have been marked read')
    cy.queryDocuments('users', 'userName', '==', 'event_reader').then(
      (docs) => {
        expect(docs.length).to.be.greaterThan(0)
        const user = docs[1]
        const notifications = user['notifications']
        expect(notifications.length).to.be.greaterThan(0)
        notifications.forEach((n) => {
          expect(n['read']).to.be.true
        })
      },
    )
    cy.wait(5000)
    const noNotificationsText = 'Nada, no new notification'
    cy.get('[data-cy="notifications-desktop"]').should(
      'have.text',
      noNotificationsText,
    )
  })
})
