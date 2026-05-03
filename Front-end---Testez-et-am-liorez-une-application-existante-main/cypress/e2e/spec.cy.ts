describe('template spec avec mocks', () => {
  
  beforeEach(() => {
    // Intercepte les appels API selon les routes réelles de votre UserService
    cy.intercept('POST', '/api/register', {
      statusCode: 200,
      body: {}
    }).as('registerRequest');

    cy.intercept('POST', '/api/login', {
      statusCode: 200,
      body: 'mock_jwt_token' // Correspond à votre backend qui renvoie un token (chaîne de caractères)
    }).as('loginRequest');

    // Ajout de l'interception pour la liste des utilisateurs
    cy.intercept('GET', '/api/readlist', {
      statusCode: 200,
      body: [
        { id: 1, firstName: 'Cytest', lastName: 'Cytest', login: 'Cytest', password: 'Cytest' }
      ]
    }).as('readListRequest');

    cy.intercept('GET', '/api/read/Cytest', {
      statusCode: 200,
      body: { id: 1, firstName: 'Cytest', lastName: 'Cytest', login: 'Cytest', password: 'Cytest' }
    }).as('getRequest');

    // Notez l'utilisation de PATCH au lieu de PUT, car votre service utilise .patch()
    cy.intercept('PATCH', '/api/update', {
      statusCode: 200,
      body: {}
    }).as('updateRequest');

    cy.intercept('DELETE', '/api/delete/Cytest', {
      statusCode: 200,
      body: {}
    }).as('deleteRequest');
  });

  it('Register', function() {
    cy.visit('http://localhost:4200/');
    
    cy.get('button.btn-register').click();
    cy.get('input[formcontrolname="firstName"]').type('Cytest');
    cy.get('input[formcontrolname="lastName"]').type('Cytest');
    cy.get('input[formcontrolname="login"]').type('Cytest');
    cy.get('input[formcontrolname="password"]').type('Cytest');
    cy.get('button.btn-register').click();
    
    cy.wait('@registerRequest'); 
  });

  it('Login', function() {
    cy.visit('http://localhost:4200/');
    
    cy.get('button.btn-login').click();
    cy.get('input[formcontrolname="login"]').type('Cytest');
    cy.get('input[formcontrolname="password"]').type('Cytest');
    cy.get('button.btn-login').click();
    
    cy.wait('@loginRequest');
    cy.url().should('include', 'list');
  });

  it('Detail', function() {
    cy.visit('http://localhost:4200/');
    
    cy.get('button.btn-login').click();
    cy.get('input[formcontrolname="login"]').type('Cytest');
    cy.get('input[formcontrolname="password"]').type('Cytest');
    cy.get('button.btn-login').click();
    
    cy.contains('tr', 'Cytest').find('button.btn-detail').click();
    cy.wait('@getRequest');
  });

  it('Modifier', function() {
    cy.visit('http://localhost:4200/');

    cy.get('button.btn-login').click();
    cy.get('input[formcontrolname="login"]').type('Cytest');
    cy.get('input[formcontrolname="password"]').type('Cytest');
    cy.get('button.btn-login').click();

    cy.contains('tr', 'Cytest').find('button.btn-detail').click();
    cy.wait('@getRequest');
    
    cy.get('button.btn-modifie').click();
    cy.get('input[type="password"]').clear();
    cy.get('input[type="password"]').type('Cytest');
    cy.get('button.btn-valide').click();
    
    cy.wait('@updateRequest');
  });

  it('Suprimer', function() {
    cy.visit('http://localhost:4200/');
    
    cy.get('button.btn-login').click();
    cy.get('input[formcontrolname="login"]').type('Cytest');
    cy.get('input[formcontrolname="password"]').type('Cytest');
    cy.get('button.btn-login').click();

    cy.wait('@readListRequest'); // Attend le chargement de la liste
    
    cy.contains('tr', 'Cytest').find('button.btn-detail').click();
    cy.wait('@getRequest'); // Attend les détails
    
    // Gérer la boîte de dialogue de confirmation (clique sur "OK")
    cy.on('window:confirm', () => true);
    
    // Utilisation de la bonne classe HTML : .btn-suprime
    cy.get('button.btn-suprime').click();
    
    cy.wait('@deleteRequest'); // Attend la requête HTTP de suppression
  });
});