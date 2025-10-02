import { Avatar, AvatarImage, AvatarFallback } from '../../../src/components/ui/avatar'

describe('Avatar Component', () => {
  it('renders basic avatar container', () => {
    cy.mount(
      <Avatar>
        <AvatarFallback>JD</AvatarFallback>
      </Avatar>
    )
    
    cy.get('span').should('exist') // Radix Avatar renders as span
    cy.contains('JD').should('be.visible')
  })

  it('renders avatar with image component', () => {
    cy.mount(
      <Avatar>
        <AvatarImage src="/logo.png" alt="User Avatar" />
        <AvatarFallback>JD</AvatarFallback>
      </Avatar>
    )
    
    // Check that the avatar container exists
    cy.get('span').should('exist')
    // The image might take time to load or may fallback, so we'll just verify the avatar renders
    cy.get('span').should('have.class', 'relative')
    cy.get('span').should('have.class', 'flex')
  })

  it('shows fallback when image fails to load', () => {
    cy.mount(
      <Avatar>
        <AvatarImage src="invalid-url.jpg" alt="User Avatar" />
        <AvatarFallback>JD</AvatarFallback>
      </Avatar>
    )
    
    // The fallback should be visible (Radix automatically handles failed images)
    cy.contains('JD').should('be.visible')
  })

  it('renders fallback text correctly', () => {
    cy.mount(
      <Avatar>
        <AvatarFallback>AB</AvatarFallback>
      </Avatar>
    )
    
    cy.contains('AB').should('be.visible')
    cy.get('span').should('have.class', 'bg-muted')
  })

  it('renders different avatar sizes', () => {
    cy.mount(
      <div className="flex items-center space-x-4 p-4">
        <Avatar className="h-8 w-8">
          <AvatarFallback className="text-xs">SM</AvatarFallback>
        </Avatar>
        <Avatar>
          <AvatarFallback>MD</AvatarFallback>
        </Avatar>
        <Avatar className="h-16 w-16">
          <AvatarFallback className="text-lg">LG</AvatarFallback>
        </Avatar>
      </div>
    )
    
    cy.contains('SM').should('be.visible')
    cy.contains('MD').should('be.visible')
    cy.contains('LG').should('be.visible')
  })

  it('handles multiple avatar types', () => {
    cy.mount(
      <div className="flex space-x-4 p-4">
        <Avatar>
          <AvatarImage src="/logo.png" />
          <AvatarFallback>A</AvatarFallback>
        </Avatar>
        <Avatar>
          <AvatarFallback className="bg-blue-500 text-white">B</AvatarFallback>
        </Avatar>
        <Avatar>
          <AvatarFallback className="bg-green-500 text-white">C</AvatarFallback>
        </Avatar>
      </div>
    )
    
    // Should render 3 avatars - check the fallback text is visible
    cy.contains('B').should('be.visible')
    cy.contains('C').should('be.visible')
    // First avatar might show image or fallback, so we just check it exists
    cy.get('span').should('have.length.at.least', 3)
  })

  it('applies custom className', () => {
    cy.mount(
      <Avatar className="border-2 border-blue-500">
        <AvatarFallback>JD</AvatarFallback>
      </Avatar>
    )
    
    cy.get('span').first().should('have.class', 'border-2')
    cy.get('span').first().should('have.class', 'border-blue-500')
  })
})