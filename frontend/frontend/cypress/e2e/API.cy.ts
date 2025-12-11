import * as user from '../fixtures/user.json'

describe('API Testing',
  { baseUrl: Cypress.env('API_URL') }, () => {

  let token: string = ''

  before(() => {
    cy.request('GET', '/api/health')
      .then(res => expect(res.status).to.eq(200))

    cy.request('POST', '/login', {
      username: user.username,
      password: user.password
    }).then(res => {
      expect(res.status).to.eq(200)
      token = res.body.token
    })
  })

  it('USERS', () => {
    cy.request({
      method: 'GET',
      url: '/me',
      headers: {
        Authorization: `Bearer ${token}`
      }
    }).then(res => expect(res.status).to.eq(200))
  })

  it('ORDERS', () => {
    // Assert unauthorized access
    cy.request({
      method: 'GET',
      url: '/orders',
      failOnStatusCode: false
    }).then(res => expect(res.status).to.eq(401))

    // Assert authorized access, add token
    cy.request({
      method: 'GET',
      url: '/orders',
      headers: {
        Authorization: `Bearer ${token}`
      }
    }).then(res => expect(res.status).to.eq(200))

    // Assert available product
    cy.request({
      method: 'PUT',
      url: '/orders/add',
      headers: {
        Authorization: `Bearer ${token}`
      },
      body: {
        "product": 9,
        "quantity": 3
      }
    }).then(res => expect(res.status).to.eq(200))

    // Assert unavailable product
    cy.request({
      method: 'PUT',
      url: '/orders/add',
      failOnStatusCode: false,
      headers: {
        Authorization: `Bearer ${token}`
      },
      body: {
        "product": 4,
        "quantity": 3
      }
    }).then(res => expect(res.status).to.eq(404))
  })

  it('PRODUCTS', () => {
    let randomID: string = ''

    cy.request({
      method: 'GET',
      url: '/products/random',
      headers: {
        Authorization: `Bearer ${token}`
      }
    }).then(res => {
      expect(res.status).to.eq(200)
      randomID = res.body[0].id
    })

    cy.request({
      method: 'GET',
      url: '/products/' + randomID,
      headers: {
        Authorization: `Bearer ${token}`
      }
    }).then(res => expect(res.status).to.eq(200))
  })

  it('REVIEWS', () => {
    cy.request({
      method: 'POST',
      url: '/reviews',
      headers: {
        Authorization: `Bearer ${token}`
      },
      body: {
        "title": "APITesting",
        "comment": "API Testing is great!",
        "rating": 5
      }
    }).then(res => expect(res.status).to.eq(200))
  })
})
