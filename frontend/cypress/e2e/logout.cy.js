describe('Logout E2E', () => {
    it('should logout, clear token, and redirect to landing page', () => {
        cy.viewport(1440, 900)
        // 1️⃣ Se connecter
        cy.visit('/login')

        cy.get('input[type="email"]').type('ali12@gmail.com')
        cy.get('input[type="password"]').type('ali123')
        cy.contains('button', 'LOGIN').click()

        cy.url().should('include', '/profile')

        // 2️⃣ Cliquer sur Logout
        cy.contains('Log out').click()

        // 3️⃣ Vérifier que le token est supprimé
        cy.window().then((win) => {
            expect(win.localStorage.getItem('token')).to.be.null
        })

        // 4️⃣ Vérifier la redirection vers /
        cy.url().should('eq', Cypress.config().baseUrl + '/')
    })
})
