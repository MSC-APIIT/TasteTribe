import { Input } from '../../../src/components/ui/input'

describe('Input Component', () => {
  it('renders basic input field', () => {
    cy.mount(<Input placeholder="Enter text here" />)
    cy.get('input').should('exist')
    cy.get('input').should('have.attr', 'placeholder', 'Enter text here')
  })

  it('handles different input types', () => {
    cy.mount(
      <div className="space-y-4 p-4">
        <Input type="text" placeholder="Text input" />
        <Input type="email" placeholder="Email input" />
        <Input type="password" placeholder="Password input" />
        <Input type="number" placeholder="Number input" />
      </div>
    )
    
    cy.get('input[type="text"]').should('exist')
    cy.get('input[type="email"]').should('exist')
    cy.get('input[type="password"]').should('exist')
    cy.get('input[type="number"]').should('exist')
  })

  it('accepts user input', () => {
    cy.mount(<Input placeholder="Type something" />)
    cy.get('input').type('Hello World')
    cy.get('input').should('have.value', 'Hello World')
  })

  it('can be disabled', () => {
    cy.mount(<Input disabled placeholder="Disabled input" />)
    cy.get('input').should('be.disabled')
    cy.get('input').should('have.class', 'disabled:cursor-not-allowed')
  })

  it('applies custom className', () => {
    cy.mount(<Input className="custom-class" />)
    cy.get('input').should('have.class', 'custom-class')
  })

  it('handles focus and blur states', () => {
    cy.mount(<Input placeholder="Focus test" />)
    cy.get('input').focus()
    cy.get('input').should('be.focused')
    cy.get('input').blur()
    cy.get('input').should('not.be.focused')
  })
})