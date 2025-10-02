import { MenuItemCard } from '../../../src/components/ui/menu-item-card'

const mockMenuItem = {
  _id: '1',
  id: '1',
  name: 'Margherita Pizza',
  description: 'Fresh tomatoes, mozzarella, and basil',
  price: 12.99
}

const mockExpensiveItem = {
  _id: '2',
  id: '2',
  name: 'Premium Wagyu Burger',
  description: 'Grade A5 wagyu beef with truffle mayo',
  price: 45.00
}

describe('Menu Item Card Component', () => {
  it('renders menu item information correctly', () => {
    const onEditSpy = cy.stub().as('onEditSpy')
    const onDeleteSpy = cy.stub().as('onDeleteSpy')
    
    cy.mount(
      <MenuItemCard 
        item={mockMenuItem} 
        onEdit={onEditSpy} 
        onDelete={onDeleteSpy} 
      />
    )
    
  cy.contains('Margherita Pizza').should('be.visible')
  cy.contains('Fresh tomatoes, mozzarella, and basil').should('be.visible')
  cy.contains(`LKR ${mockMenuItem.price}`).should('be.visible')
  })

  it('handles edit button click', () => {
    const onEditSpy = cy.stub().as('onEditSpy')
    const onDeleteSpy = cy.stub().as('onDeleteSpy')
    
    cy.mount(
      <MenuItemCard 
        item={mockMenuItem} 
        onEdit={onEditSpy} 
        onDelete={onDeleteSpy} 
      />
    )
    
    cy.contains('Edit').click()
    cy.get('@onEditSpy').should('have.been.called')
  })

  it('handles delete button click', () => {
    const onEditSpy = cy.stub().as('onEditSpy')
    const onDeleteSpy = cy.stub().as('onDeleteSpy')
    
    cy.mount(
      <MenuItemCard 
        item={mockMenuItem} 
        onEdit={onEditSpy} 
        onDelete={onDeleteSpy} 
      />
    )
    
    cy.contains('Delete').click()
    cy.get('@onDeleteSpy').should('have.been.called')
  })

  it('formats price correctly for different values', () => {
    const onEditSpy = cy.stub()
    const onDeleteSpy = cy.stub()
    
    cy.mount(
      <div className="space-y-4 p-4">
        <MenuItemCard item={mockMenuItem} onEdit={onEditSpy} onDelete={onDeleteSpy} />
        <MenuItemCard item={mockExpensiveItem} onEdit={onEditSpy} onDelete={onDeleteSpy} />
      </div>
    )
    
  cy.contains('LKR 12.99').should('be.visible')
  cy.contains('LKR 45.00').should('be.visible')
  })

  it('renders button variants correctly', () => {
    const onEditSpy = cy.stub()
    const onDeleteSpy = cy.stub()
    
    cy.mount(
      <MenuItemCard 
        item={mockMenuItem} 
        onEdit={onEditSpy} 
        onDelete={onDeleteSpy} 
      />
    )
    
    // Check button variants
    cy.get('button').contains('Edit').should('exist')
    cy.get('button').contains('Delete').should('exist')
    
    // Edit button should have outline variant
    cy.get('button').contains('Edit').should('have.class', 'border')
    
    // Delete button should have destructive variant (typically red)
    cy.get('button').contains('Delete').should('exist')
  })

  it('handles very long menu item names and descriptions', () => {
    const longMenuItem = {
     _id: '3',
      id: '3',
      name: 'Super Extra Long Menu Item Name That Could Potentially Break Layout',
      description: 'An extremely detailed description of this menu item that goes on and on explaining every single ingredient and preparation method in great detail',
      price: 25.50
    }
    
    const onEditSpy = cy.stub()
    const onDeleteSpy = cy.stub()
    
    cy.mount(
      <MenuItemCard 
        item={longMenuItem} 
        onEdit={onEditSpy} 
        onDelete={onDeleteSpy} 
      />
    )
    
    cy.contains('Super Extra Long Menu Item Name').should('be.visible')
  cy.contains('An extremely detailed description').should('be.visible')
  cy.contains('LKR 25.50').should('be.visible')
  })

  it('renders multiple menu items in a list', () => {
    const items = [mockMenuItem, mockExpensiveItem]
    const onEditSpy = cy.stub()
    const onDeleteSpy = cy.stub()
    
    cy.mount(
      <div className="space-y-4 p-4">
        {items.map(item => (
          <MenuItemCard 
            key={item._id}
            item={item} 
            onEdit={onEditSpy} 
            onDelete={onDeleteSpy} 
          />
        ))}
      </div>
    )
    
    cy.contains('Margherita Pizza').should('be.visible')
    cy.contains('Premium Wagyu Burger').should('be.visible')
    cy.get('button').should('have.length', 4) // 2 items × 2 buttons each
  })
})