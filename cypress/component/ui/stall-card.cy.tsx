import { StallCard } from '../../../src/components/ui/stall-card'

const mockStall = {
  id: '1',
  stallName: 'Delicious Pizza Place',
  stallDescription: 'Best pizza in town with fresh ingredients',
  stallImage: ['/logo.png'],
  profileId: 'profile-1'
}

const mockStallWithoutImage = {
  id: '2',
  stallName: 'Burger Joint',
  stallDescription: 'Juicy burgers and crispy fries',
  stallImage: [],
  profileId: 'profile-2'
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
      stallName: 'Very Long Restaurant Name That Might Overflow',
      stallDescription: 'This is a very long description that should test how the component handles extensive text content and whether it wraps properly without breaking the layout',
      stallImage: ['/logo.png'],
      profileId: 'profile-3'
    }
    
    cy.mount(<StallCard stall={longTextStall} />)
    
    cy.contains('Very Long Restaurant Name That Might Overflow').should('be.visible')
    cy.contains('This is a very long description').should('be.visible')
  })
})