import { Button } from '../../../src/components/ui/button'

describe('Button Component (Cypress)', () => {
  it('renders button with text', () => {
    cy.mount(<Button>Click me</Button>)
    cy.get('button').should('contain.text', 'Click me')
  })

  it('handles click events', () => {
    const onClickSpy = cy.stub().as('onClickSpy')
    cy.mount(<Button onClick={onClickSpy}>Click me</Button>)
    
    cy.get('button').click()
    cy.get('@onClickSpy').should('have.been.called')
  })

  it('applies variant classes correctly', () => {
    cy.mount(<Button variant="outline">Outline Button</Button>)
    cy.get('button').should('contain.text', 'Outline Button')
    cy.get('button').should('have.class', 'border')
  })

  it('can be disabled', () => {
    cy.mount(<Button disabled>Disabled Button</Button>)
    cy.get('button').should('be.disabled')
    cy.get('button').should('contain.text', 'Disabled Button')
  })

  it('shows different button sizes visually', () => {
    cy.mount(
      <div className="space-y-4 p-4">
        <Button size="sm">Small Button</Button>
        <Button size="default">Default Button</Button>
        <Button size="lg">Large Button</Button>
      </div>
    )
    
    // Visual testing - you can actually see the buttons!
    cy.get('button').should('have.length', 3)
  })
})