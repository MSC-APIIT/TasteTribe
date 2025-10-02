import { CommentCard } from '../../../src/components/ui/comment-card'

const mockComment = {
  id: '1',
  author: 'John Doe',
  comment: 'Amazing food! The pizza was perfectly cooked and delicious.',
  rating: 5
}

const mockPoorComment = {
  id: '2',
  author: 'Jane Smith',
  comment: 'Service was slow and food was cold when it arrived.',
  rating: 2
}

const mockLongComment = {
  id: '3',
  author: 'Food Critic',
  comment: 'This restaurant exceeded all my expectations. The ambiance was perfect, the service was impeccable, and every dish we ordered was a masterpiece. The chef clearly knows what they are doing and the ingredients are fresh and high quality. I would definitely recommend this place to anyone looking for an exceptional dining experience.',
  rating: 4
}

describe('Comment Card Component', () => {
  it('renders comment information correctly', () => {
    cy.mount(<CommentCard comment={mockComment} />)
    
    cy.contains('John Doe').should('be.visible')
    cy.contains('Amazing food! The pizza was perfectly cooked and delicious.').should('be.visible')
    
    // Check rating stars are rendered
    cy.get('svg').should('have.length', 5) // Should have 5 rating stars
    
    // Check that 5 stars are filled (yellow)
    cy.get('svg').each(($star) => {
      cy.wrap($star).should('have.class', 'text-yellow-400')
    })
  })

  it('displays different rating values correctly', () => {
    cy.mount(
      <div className="space-y-4 p-4">
        <CommentCard comment={mockComment} />
        <CommentCard comment={mockPoorComment} />
      </div>
    )
    
    // First comment (5 stars) - all should be yellow
    cy.contains('John Doe').parent().parent().within(() => {
      cy.get('svg').eq(0).should('have.class', 'text-yellow-400')
      cy.get('svg').eq(4).should('have.class', 'text-yellow-400')
    })
    
    // Second comment (2 stars) - first 2 should be yellow, rest gray
    cy.contains('Jane Smith').parent().parent().within(() => {
      cy.get('svg').eq(0).should('have.class', 'text-yellow-400')
      cy.get('svg').eq(1).should('have.class', 'text-yellow-400')
      cy.get('svg').eq(2).should('have.class', 'text-gray-300')
    })
  })

  it('handles long comments properly', () => {
    cy.mount(<CommentCard comment={mockLongComment} />)
    
    cy.contains('Food Critic').should('be.visible')
    cy.contains('This restaurant exceeded all my expectations').should('be.visible')
    cy.contains('exceptional dining experience').should('be.visible')
    
    // Should still display rating
    cy.get('svg').should('have.length', 5)
  })

  it('renders multiple comments in a feed layout', () => {
    const comments = [mockComment, mockPoorComment, mockLongComment]
    
    cy.mount(
      <div className="space-y-4 p-4 max-w-2xl">
        {comments.map(comment => (
          <CommentCard key={comment.id} comment={comment} />
        ))}
      </div>
    )
    
    cy.contains('John Doe').should('be.visible')
    cy.contains('Jane Smith').should('be.visible')
    cy.contains('Food Critic').should('be.visible')
    
    // Should have 15 total stars (3 comments × 5 stars each)
    cy.get('svg').should('have.length', 15)
  })

  it('displays author names prominently', () => {
    cy.mount(<CommentCard comment={mockComment} />)
    
    cy.get('.font-bold').should('contain.text', 'John Doe')
  })

  it('handles special characters in comments and names', () => {
    const specialComment = {
      id: '4',
      author: 'José María',
      comment: 'Très bon! The crème brûlée was fantastic. Rating: 10/10 ⭐',
      rating: 5
    }
    
    cy.mount(<CommentCard comment={specialComment} />)
    
    cy.contains('José María').should('be.visible')
    cy.contains('Très bon!').should('be.visible')
    cy.contains('⭐').should('be.visible')
  })

  it('maintains consistent spacing and layout', () => {
    cy.mount(<CommentCard comment={mockComment} />)
    
    // Check card structure
    cy.get('[class*="p-4"]').should('exist') // CardContent padding
    cy.get('.flex.items-center.mb-2').should('exist') // Author and rating row
    cy.get('.font-bold.mr-2').should('exist') // Author styling
  })

  it('handles zero rating edge case', () => {
    const zeroRatingComment = {
      id: '5',
      author: 'Unhappy Customer',
      comment: 'Worst experience ever. Would not recommend.',
      rating: 0
    }
    
    cy.mount(<CommentCard comment={zeroRatingComment} />)
    
    cy.contains('Unhappy Customer').should('be.visible')
    cy.contains('Worst experience ever').should('be.visible')
    
    // All stars should be gray (unfilled)
    cy.get('svg').each(($star) => {
      cy.wrap($star).should('have.class', 'text-gray-300')
    })
  })
})