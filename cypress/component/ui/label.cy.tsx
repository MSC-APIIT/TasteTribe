import { Label } from '../../../src/components/ui/label'

describe('Label Component', () => {
  it('renders label with text', () => {
    cy.mount(<Label>Username</Label>)
    cy.get('label').should('contain.text', 'Username')
    cy.get('label').should('have.class', 'text-sm')
    cy.get('label').should('have.class', 'font-medium')
  })

  it('can be associated with input using htmlFor', () => {
    cy.mount(
      <div className="space-y-2 p-4">
        <Label htmlFor="email">Email Address</Label>
        <input id="email" type="email" className="border rounded px-2 py-1" />
      </div>
    )
    
    cy.get('label').should('have.attr', 'for', 'email')
    cy.get('label').click()
    cy.get('#email').should('be.focused')
  })

  it('applies custom className', () => {
    cy.mount(<Label className="text-red-500">Error Label</Label>)
    cy.get('label').should('have.class', 'text-red-500')
  })

  it('renders with different content types', () => {
    cy.mount(
      <div className="space-y-4 p-4">
        <Label>Simple Text</Label>
        <Label>
          <span className="text-red-500">*</span> Required Field
        </Label>
        <Label>
          Email <small>(optional)</small>
        </Label>
      </div>
    )
    
    cy.get('label').should('have.length', 3)
    cy.get('label').first().should('contain.text', 'Simple Text')
    cy.get('label').eq(1).should('contain.text', 'Required Field')
    cy.get('label').last().should('contain.text', 'Email')
  })

  it('handles disabled state styling', () => {
    cy.mount(
      <div className="p-4">
        <Label className="peer-disabled:opacity-70">
          Label for disabled input
        </Label>
        <input disabled className="peer ml-2 border rounded px-2 py-1" />
      </div>
    )
    
    cy.get('label').should('exist')
  })
})