import { StallCard } from '../../../src/components/ui/stall-card'

const mockStall = {
  id: '1',
  name: 'Delicious Pizza Place',
  description: 'Best pizza in town with fresh ingredients',
  coverImages: ['/logo.png']
}

const mockStallWithoutImage = {
  id: '2',
  name: 'Burger Joint',
  description: 'Juicy burgers and crispy fries',
  coverImages: []
}

describe('Stall Card Component', () => {
  it('renders stall information correctly', () => {
    cy.mount(<StallCard stall={mockStall} />)
    
    cy.contains('Delicious Pizza Place').should('be.visible')
    cy.contains('Best pizza in town with fresh ingredients').should('be.visible')
    cy.get('img').should('have.attr', 'src', '/logo.png')
    cy.get('img').should('have.attr', 'alt', 'Delicious Pizza Place')
  })

  it('handles click events', () => {
    const onClickSpy = cy.stub().as('onClickSpy')
    cy.mount(<StallCard stall={mockStall} onClick={onClickSpy} />)
    
    cy.get('[class*="cursor-pointer"]').click()
    cy.get('@onClickSpy').should('have.been.called')
  })

  it('shows hover effects', () => {
    cy.mount(<StallCard stall={mockStall} />)
    
    cy.get('[class*="cursor-pointer"]').should('have.class', 'hover:shadow-lg')
    cy.get('[class*="cursor-pointer"]').should('have.class', 'transition-shadow')
  })

  it('falls back to default image when no cover image provided', () => {
    cy.mount(<StallCard stall={mockStallWithoutImage} />)
    
    cy.contains('Burger Joint').should('be.visible')
    cy.get('img').should('have.attr', 'src', '/logo.png')
  })

  it('renders multiple stalls in a grid layout', () => {
    const stalls = [mockStall, mockStallWithoutImage]
    
    cy.mount(
      <div className="grid grid-cols-2 gap-4 p-4">
        {stalls.map(stall => (
          <StallCard key={stall.id} stall={stall} />
        ))}
      </div>
    )
    
    cy.contains('Delicious Pizza Place').should('be.visible')
    cy.contains('Burger Joint').should('be.visible')
    cy.get('img').should('have.length', 2)
  })

  it('handles long text content properly', () => {
    const longTextStall = {
      id: '3',
      name: 'Very Long Restaurant Name That Might Overflow',
      description: 'This is a very long description that should test how the component handles extensive text content and whether it wraps properly without breaking the layout',
      coverImages: ['/logo.png']
    }
    
    cy.mount(<StallCard stall={longTextStall} />)
    
    cy.contains('Very Long Restaurant Name That Might Overflow').should('be.visible')
    cy.contains('This is a very long description').should('be.visible')
  })
})