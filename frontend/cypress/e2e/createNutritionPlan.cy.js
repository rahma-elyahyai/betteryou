describe('Create Nutrition Plan E2E', () => {
  it('should navigate to profile, open nutrition, and create a plan', () => {
    // Forcer mode desktop pour afficher la sidebar
    cy.viewport(1440, 900)

    // 1️⃣ Login
    cy.visit('/login')
    cy.get('input[type="email"]').type('ali12@gmail.com')
    cy.get('input[type="password"]').type('ali123')
    cy.contains('button', 'LOGIN').click()

    // 2️⃣ Attendre la page Profile (et PAS Dashboard)
    cy.url({ timeout: 10000 }).should('include', '/profile')

    // 3️⃣ S'assurer que la sidebar est visible
    cy.get('aside', { timeout: 10000 }).should('be.visible')

    // 4️⃣ Cliquer sur Nutrition depuis la sidebar
    cy.contains('button', 'Nutrition', { timeout: 10000 }).should('be.visible').click()

    // 5️⃣ Vérifier qu’on est bien sur la page Nutrition
    cy.url().should('include', '/nutrition')

    // 6️⃣ Vérifier que le catalogue s’affiche
    cy.contains('Create nutrition plan', { timeout: 10000 }).should('be.visible').click()

    // 7️⃣ Remplir le formulaire
    cy.get('input[placeholder*="name"]').type('Fat Loss Program')
    cy.get('textarea, input[placeholder*="description"]').type('Plan focused on healthy weight loss.')
    cy.get('input[placeholder*="objective"]').type('Lose weight')
    cy.get('input[type="number"]').eq(0).type('1800') // calories
    cy.get('input[type="number"]').eq(1).type('30')   // duration in days

    // 8️⃣ Soumettre
    cy.contains('button', 'Create').click()

    // 9️⃣ Vérifier redirection + affichage du plan
    cy.url().should('include', '/nutrition')
    cy.contains('Fat Loss Program').should('be.visible')
  })
})
