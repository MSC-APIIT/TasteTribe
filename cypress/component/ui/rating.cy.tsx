import { Rating } from '../../../src/components/ui/rating'

describe('Rating Component', () => {
  it('renders basic rating with default props', () => {
    cy.mount(<Rating rating={3} />)
    
    // Should render 5 stars (default maxRating)
    cy.get('svg').should('have.length', 5)
    
    // First 3 should be filled (yellow), last 2 should be empty (gray)
    cy.get('svg').eq(0).should('have.class', 'text-yellow-400')
    cy.get('svg').eq(1).should('have.class', 'text-yellow-400')
    cy.get('svg').eq(2).should('have.class', 'text-yellow-400')
    cy.get('svg').eq(3).should('have.class', 'text-gray-300')
    cy.get('svg').eq(4).should('have.class', 'text-gray-300')
  })

  it('renders different rating values', () => {
    cy.mount(
      <div className="space-y-4 p-4">
        <div data-test="rating-0">
          <span className="block mb-2">0 Stars:</span>
          <Rating rating={0} />
        </div>
        <div data-test="rating-1">
          <span className="block mb-2">1 Star:</span>
          <Rating rating={1} />
        </div>
        <div data-test="rating-5">
          <span className="block mb-2">5 Stars:</span>
          <Rating rating={5} />
        </div>
      </div>
    )
    
    // First rating (0 stars) - all should be gray
    cy.get('[data-test="rating-0"]').within(() => {
      cy.get('svg').each(($star) => {
        cy.wrap($star).should('have.class', 'text-gray-300')
      })
    })
    
    // Second rating (1 star) - first should be yellow, rest gray
    cy.get('[data-test="rating-1"]').within(() => {
      cy.get('svg').eq(0).should('have.class', 'text-yellow-400')
      cy.get('svg').eq(1).should('have.class', 'text-gray-300')
    })
    
    // Third rating (5 stars) - all should be yellow
    cy.get('[data-test="rating-5"]').within(() => {
      cy.get('svg').each(($star) => {
        cy.wrap($star).should('have.class', 'text-yellow-400')
      })
    })
  })

  it('handles custom maxRating values', () => {
    cy.mount(
      <div className="space-y-4 p-4">
        <div data-test="rating-3-3">
          <span className="block mb-2">3 out of 3 stars:</span>
          <Rating rating={3} maxRating={3} />
        </div>
        <div data-test="rating-7-10">
          <span className="block mb-2">7 out of 10 stars:</span>
          <Rating rating={7} maxRating={10} />
        </div>
      </div>
    )
    
    // First rating should have 3 stars total
    cy.get('[data-test="rating-3-3"]').within(() => {
      cy.get('svg').should('have.length', 3)
      cy.get('svg').each(($star) => {
        cy.wrap($star).should('have.class', 'text-yellow-400')
      })
    })
    
    // Second rating should have 10 stars total
    cy.get('[data-test="rating-7-10"]').within(() => {
      cy.get('svg').should('have.length', 10)
      // First 7 should be yellow
      cy.get('svg').eq(0).should('have.class', 'text-yellow-400')
      cy.get('svg').eq(6).should('have.class', 'text-yellow-400')
      // Last 3 should be gray
      cy.get('svg').eq(7).should('have.class', 'text-gray-300')
      cy.get('svg').eq(9).should('have.class', 'text-gray-300')
    })
  })

  it('handles decimal ratings correctly', () => {
    cy.mount(
      <div className="space-y-4 p-4">
        <div data-test="rating-2-3">
          <span className="block mb-2">Rating 2.3 (should show 3 stars filled):</span>
          <Rating rating={2.3} />
        </div>
        <div data-test="rating-4-8">
          <span className="block mb-2">Rating 4.8 (should show 5 stars filled):</span>
          <Rating rating={4.8} />
        </div>
      </div>
    )
    
    // 2.3 rating should show 3 filled stars (i < 2.3 means i=0,1,2 are filled)
    cy.get('[data-test="rating-2-3"]').within(() => {
      cy.get('svg').eq(0).should('have.class', 'text-yellow-400')
      cy.get('svg').eq(1).should('have.class', 'text-yellow-400')
      cy.get('svg').eq(2).should('have.class', 'text-yellow-400')
      cy.get('svg').eq(3).should('have.class', 'text-gray-300')
    })
    
    // 4.8 rating should show 5 filled stars (i < 4.8 means i=0,1,2,3,4 are filled)
    cy.get('[data-test="rating-4-8"]').within(() => {
      cy.get('svg').eq(0).should('have.class', 'text-yellow-400')
      cy.get('svg').eq(1).should('have.class', 'text-yellow-400')
      cy.get('svg').eq(2).should('have.class', 'text-yellow-400')
      cy.get('svg').eq(3).should('have.class', 'text-yellow-400')
      cy.get('svg').eq(4).should('have.class', 'text-yellow-400')
    })
  })

  it('handles edge cases', () => {
    cy.mount(
      <div className="space-y-4 p-4">
        <div data-test="rating-negative">
          <span className="block mb-2">Negative rating:</span>
          <Rating rating={-1} />
        </div>
        <div data-test="rating-over-max">
          <span className="block mb-2">Rating higher than max:</span>
          <Rating rating={7} maxRating={5} />
        </div>
        <div data-test="rating-zero-max">
          <span className="block mb-2">Zero max rating:</span>
          <Rating rating={3} maxRating={0} />
        </div>
      </div>
    )
    
    // Negative rating should show no filled stars
    cy.get('[data-test="rating-negative"]').within(() => {
      cy.get('svg').each(($star) => {
        cy.wrap($star).should('have.class', 'text-gray-300')
      })
    })
    
    // Rating higher than max should fill all stars
    cy.get('[data-test="rating-over-max"]').within(() => {
      cy.get('svg').should('have.length', 5)
      cy.get('svg').each(($star) => {
        cy.wrap($star).should('have.class', 'text-yellow-400')
      })
    })
    
    // Zero max rating should show no stars
    cy.get('[data-test="rating-zero-max"]').within(() => {
      cy.get('svg').should('have.length', 0)
    })
  })

  it('has proper styling and accessibility', () => {
    cy.mount(<Rating rating={4} />)
    
    // Check container has flex layout
    cy.get('div').should('have.class', 'flex')
    cy.get('div').should('have.class', 'items-center')
    
    // Check star sizing
    cy.get('svg').each(($star) => {
      cy.wrap($star).should('have.class', 'w-5')
      cy.wrap($star).should('have.class', 'h-5')
    })
  })

  it('displays various rating scenarios for food app', () => {
    cy.mount(
      <div className="space-y-6 p-6 bg-gray-50">
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="font-bold mb-2">Restaurant Reviews</h3>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span>Excellent Restaurant</span>
              <Rating rating={5} />
            </div>
            <div className="flex items-center justify-between">
              <span>Good Food Stall</span>
              <Rating rating={4} />
            </div>
            <div className="flex items-center justify-between">
              <span>Average Place</span>
              <Rating rating={3} />
            </div>
            <div className="flex items-center justify-between">
              <span>Poor Service</span>
              <Rating rating={1} />
            </div>
          </div>
        </div>
      </div>
    )
    
    cy.contains('Restaurant Reviews').should('be.visible')
    cy.contains('Excellent Restaurant').should('be.visible')
    cy.contains('Good Food Stall').should('be.visible')
    cy.contains('Average Place').should('be.visible')
    cy.contains('Poor Service').should('be.visible')
    
    // Verify different rating displays
    cy.get('svg').should('have.length', 20) // 4 ratings × 5 stars each
  })
})