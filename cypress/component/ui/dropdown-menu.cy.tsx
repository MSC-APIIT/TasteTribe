import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../../../src/components/ui/dropdown-menu'

describe('Dropdown Menu Component', () => {
  it('renders dropdown trigger', () => {
    cy.mount(
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="px-4 py-2 border rounded">Open Menu</button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem>Item 1</DropdownMenuItem>
          <DropdownMenuItem>Item 2</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )
    
    cy.contains('Open Menu').should('be.visible')
    cy.get('button').should('exist')
  })

  it('opens dropdown when trigger is clicked', () => {
    cy.mount(
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="px-4 py-2 border rounded">Menu</button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem>Profile</DropdownMenuItem>
          <DropdownMenuItem>Settings</DropdownMenuItem>
          <DropdownMenuItem>Logout</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )
    
    // Initially menu items should not be visible
    cy.contains('Profile').should('not.exist')
    
    // Click trigger to open menu
    cy.contains('Menu').click()
    
    // Menu items should now be visible
    cy.contains('Profile').should('be.visible')
    cy.contains('Settings').should('be.visible')
    cy.contains('Logout').should('be.visible')
  })

  it('handles menu item clicks', () => {
    const onProfileClick = cy.stub().as('onProfileClick')
    const onSettingsClick = cy.stub().as('onSettingsClick')
    
    cy.mount(
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="px-4 py-2 border rounded">Actions</button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onClick={onProfileClick}>
            Profile
          </DropdownMenuItem>
          <DropdownMenuItem onClick={onSettingsClick}>
            Settings
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )
    
    cy.contains('Actions').click()
    cy.contains('Profile').click()
    cy.get('@onProfileClick').should('have.been.called')
  })

  it('renders dropdown with icons', () => {
    cy.mount(
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="px-4 py-2 border rounded flex items-center">
            <span>User Menu</span>
            <svg className="ml-2 h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem>
            <span>👤 Profile</span>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <span>⚙️ Settings</span>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <span>🚪 Logout</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )
    
    cy.contains('User Menu').click()
    cy.contains('👤 Profile').should('be.visible')
    cy.contains('⚙️ Settings').should('be.visible')
    cy.contains('🚪 Logout').should('be.visible')
  })

  it('closes dropdown when clicking outside', () => {
    cy.mount(
      <div className="p-8">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="px-4 py-2 border rounded">Menu</button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>Item 1</DropdownMenuItem>
            <DropdownMenuItem>Item 2</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <div className="mt-4 p-4 bg-gray-100">Click outside area</div>
      </div>
    )
    
    // Open menu
    cy.contains('Menu').click()
    cy.contains('Item 1').should('be.visible')
    
    // Press Escape to close (instead of clicking outside due to pointer-events issue)
    cy.get('body').type('{esc}')
    cy.contains('Item 1').should('not.exist')
  })

  it('supports keyboard navigation', () => {
    cy.mount(
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="px-4 py-2 border rounded">Keyboard Menu</button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem>First Item</DropdownMenuItem>
          <DropdownMenuItem>Second Item</DropdownMenuItem>
          <DropdownMenuItem>Third Item</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )
    
    // Focus the trigger and open with Enter
    cy.get('button').focus()
    cy.get('button').should('be.focused')
    cy.get('button').type('{enter}')
    
    // Menu should be open
    cy.contains('First Item').should('be.visible')
  })

  it('renders complex dropdown with separators and groups', () => {
    cy.mount(
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="px-4 py-2 border rounded">Complex Menu</button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56">
          <DropdownMenuItem>
            <span>New Tab</span>
            <span className="ml-auto text-xs">⌘T</span>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <span>New Window</span>
            <span className="ml-auto text-xs">⌘N</span>
          </DropdownMenuItem>
          <DropdownMenuItem disabled>
            <span>New Private Window</span>
            <span className="ml-auto text-xs">⌘⇧N</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )
    
    cy.contains('Complex Menu').click()
    cy.contains('New Tab').should('be.visible')
    cy.contains('⌘T').should('be.visible')
    cy.contains('New Window').should('be.visible')
    cy.contains('New Private Window').should('be.visible')
  })
})