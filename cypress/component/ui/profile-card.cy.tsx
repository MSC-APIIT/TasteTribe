import { ProfileCard } from '../../../src/components/ui/profile-card'

const mockProfile = {
  name: 'John Smith',
  bio: 'Food enthusiast and home chef. Love trying new restaurants!',
  profilePicture: '/logo.png'
}

const mockProfileWithoutPicture = {
  name: 'Jane Doe',
  bio: 'Pizza lover and restaurant reviewer',
  profilePicture: ''
}

const mockLongProfile = {
  name: 'Professional Food Critic',
  bio: 'I have been reviewing restaurants for over 20 years and have visited establishments all around the world. My passion for culinary excellence drives me to discover hidden gems and share my experiences with fellow food lovers.',
  profilePicture: '/logo.png'
}

describe('Profile Card Component', () => {
  it('renders profile information correctly', () => {
    const onEditSpy = cy.stub().as('onEditSpy')
    
    cy.mount(<ProfileCard profile={mockProfile} onEdit={onEditSpy} />)
    
    cy.contains('John Smith').should('be.visible')
    cy.contains('Food enthusiast and home chef').should('be.visible')
    cy.get('button').contains('Edit Profile').should('be.visible')
  })

  it('displays avatar with profile picture', () => {
    const onEditSpy = cy.stub()
    
    cy.mount(<ProfileCard profile={mockProfile} onEdit={onEditSpy} />)
    
    // Avatar should have large size classes
    cy.get('span').should('have.class', 'h-24')
    cy.get('span').should('have.class', 'w-24')
  })

  it('shows fallback avatar when no profile picture', () => {
    const onEditSpy = cy.stub()
    
    cy.mount(<ProfileCard profile={mockProfileWithoutPicture} onEdit={onEditSpy} />)
    
    cy.contains('Jane Doe').should('be.visible')
    // Should show first letter of name as fallback
    cy.contains('J').should('be.visible')
  })

  it('handles edit profile button click', () => {
    const onEditSpy = cy.stub().as('onEditSpy')
    
    cy.mount(<ProfileCard profile={mockProfile} onEdit={onEditSpy} />)
    
    cy.get('button').contains('Edit Profile').click()
    cy.get('@onEditSpy').should('have.been.called')
  })

  it('handles long bio text properly', () => {
    const onEditSpy = cy.stub()
    
    cy.mount(<ProfileCard profile={mockLongProfile} onEdit={onEditSpy} />)
    
    cy.contains('Professional Food Critic').should('be.visible')
    cy.contains('I have been reviewing restaurants').should('be.visible')
    cy.contains('fellow food lovers').should('be.visible')
  })

  it('maintains proper layout with avatar and text', () => {
    const onEditSpy = cy.stub()
    
    cy.mount(<ProfileCard profile={mockProfile} onEdit={onEditSpy} />)
    
    // Check header layout
    cy.get('[class*="flex-row"]').should('exist')
    cy.get('[class*="items-center"]').should('exist')
    cy.get('[class*="gap-4"]').should('exist')
  })

  it('renders multiple profiles in a grid', () => {
    const profiles = [mockProfile, mockProfileWithoutPicture]
    const onEditSpy = cy.stub()
    
    cy.mount(
      <div className="grid grid-cols-2 gap-4 p-4">
        {profiles.map((profile, index) => (
          <ProfileCard key={index} profile={profile} onEdit={onEditSpy} />
        ))}
      </div>
    )
    
    cy.contains('John Smith').should('be.visible')
    cy.contains('Jane Doe').should('be.visible')
    cy.get('button').should('have.length', 2)
  })

  it('handles special characters in name and bio', () => {
    const specialProfile = {
      name: 'María José García',
      bio: 'Especialista en cocina española & mediterránea 🍤🥘',
      profilePicture: '/logo.png'
    }
    const onEditSpy = cy.stub()
    
    cy.mount(<ProfileCard profile={specialProfile} onEdit={onEditSpy} />)
    
    cy.contains('María José García').should('be.visible')
    cy.contains('Especialista en cocina española').should('be.visible')
    cy.contains('🍤🥘').should('be.visible')
  })

  it('displays empty bio gracefully', () => {
    const emptyBioProfile = {
      name: 'New User',
      bio: '',
      profilePicture: '/logo.png'
    }
    const onEditSpy = cy.stub()
    
    cy.mount(<ProfileCard profile={emptyBioProfile} onEdit={onEditSpy} />)
    
    cy.contains('New User').should('be.visible')
    cy.get('button').contains('Edit Profile').should('be.visible')
  })

  it('handles very short names correctly', () => {
    const shortNameProfile = {
      name: 'A',
      bio: 'Short name, big appetite!',
      profilePicture: ''
    }
    const onEditSpy = cy.stub()
    
    cy.mount(<ProfileCard profile={shortNameProfile} onEdit={onEditSpy} />)
    
    cy.contains('A').should('be.visible')
    cy.contains('Short name, big appetite!').should('be.visible')
  })

  it('maintains consistent card styling', () => {
    const onEditSpy = cy.stub()
    
    cy.mount(<ProfileCard profile={mockProfile} onEdit={onEditSpy} />)
    
    // Card should have standard styling
    cy.get('[class*="rounded-lg"]').should('exist')
    cy.get('[class*="border"]').should('exist')
    cy.get('[class*="shadow"]').should('exist')
  })
})