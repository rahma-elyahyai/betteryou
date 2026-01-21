describe('Scénario 1 — Login réussi', () => {
  it('L’utilisateur se connecte et est redirigé vers le profil', () => {
    // 1️⃣ Accéder à l'application
    cy.visit('http://localhost:5173/login')

    cy.get('input[type="email"]').type('ali12@gmail.com')
    cy.get('input[type="password"]').type('ali123')
    cy.contains('button', 'LOGIN').click()


    // 4️⃣ Vérifier la redirection vers la page profil
    cy.url().should('include', '/profile')

    // 5️⃣ Vérifier un élément clé du profil
    cy.contains('My Profile').should('be.visible')
  })
})
