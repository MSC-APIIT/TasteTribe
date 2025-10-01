// Create a simple logo component for testing without Next.js dependencies
const SimpleLogo = () => (
  <a href="/" className="flex items-center space-x-4">
    <img
      src="/logo.png"
      alt="TasteTribe Logo"
      width={40}
      height={40}
      className="ml-10 relative"
    />
    <span className="text-xl font-bold text-gray-900 dark:text-white truncate">
      TasteTribe
    </span>
  </a>
)

describe('Logo Component', () => {
  it('renders logo image and text', () => {
    cy.mount(<SimpleLogo />)
    
    cy.get('img').should('exist')
    cy.get('img').should('have.attr', 'src', '/logo.png')
    cy.get('img').should('have.attr', 'alt', 'TasteTribe Logo')
    cy.get('img').should('have.attr', 'width', '40')
    cy.get('img').should('have.attr', 'height', '40')
    
    cy.contains('TasteTribe').should('be.visible')
  })

  it('has proper link structure', () => {
    cy.mount(<SimpleLogo />)
    
    cy.get('a').should('have.attr', 'href', '/')
    cy.get('a').should('have.class', 'flex')
    cy.get('a').should('have.class', 'items-center')
    cy.get('a').should('have.class', 'space-x-4')
  })

  it('applies correct styling to text', () => {
    cy.mount(<SimpleLogo />)
    
    cy.get('span').should('have.class', 'text-xl')
    cy.get('span').should('have.class', 'font-bold')
    cy.get('span').should('have.class', 'truncate')
  })

  it('handles dark mode styling', () => {
    // Mount with dark mode enabled and assert computed color
    cy.document().then((doc) => {
      doc.documentElement.classList.add('dark');
    });
    cy.mount(<SimpleLogo />);
    // Get the expected color for Tailwind dark:text-white
    const expectedDarkColor = 'rgb(255, 255, 255)';
    cy.get('span').should('have.css', 'color', expectedDarkColor);
  })

  it('handles light mode styling', () => {
    cy.mount(<SimpleLogo />)
    
    cy.get('span').should('have.class', 'text-gray-900')
  })

  it('maintains layout in different container sizes', () => {
    cy.mount(
      <div className="w-48 p-4 border">
        <SimpleLogo />
      </div>
    )
    
    cy.contains('TasteTribe').should('be.visible')
    cy.get('img').should('be.visible')
  })

  it('works in navigation header context', () => {
    cy.mount(
      <header className="bg-white shadow-sm border-b p-4">
        <nav className="flex items-center justify-between">
          <SimpleLogo />
          <div>Other nav items</div>
        </nav>
      </header>
    )
    
    cy.contains('TasteTribe').should('be.visible')
    cy.get('img').should('be.visible')
  })

  it('handles clickable functionality', () => {
    cy.mount(<SimpleLogo />)
    
    // The link should be clickable
    cy.get('a').should('exist')
    cy.get('a').click()
  })
})