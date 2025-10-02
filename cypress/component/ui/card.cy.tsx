import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent, 
  CardFooter 
} from '../../../src/components/ui/card'

describe('Card Component', () => {
  it('renders basic card', () => {
    cy.mount(
      <Card>
        <CardContent>
          <p>Basic card content</p>
        </CardContent>
      </Card>
    )
    
    cy.get('div').should('have.class', 'rounded-lg')
    cy.get('div').should('have.class', 'border')
    cy.contains('Basic card content').should('be.visible')
  })

  it('renders complete card with all components', () => {
    cy.mount(
      <Card className="w-96">
        <CardHeader>
          <CardTitle>Card Title</CardTitle>
          <CardDescription>This is a card description</CardDescription>
        </CardHeader>
        <CardContent>
          <p>This is the main content of the card.</p>
        </CardContent>
        <CardFooter>
          <button className="px-4 py-2 bg-blue-500 text-white rounded">
            Action Button
          </button>
        </CardFooter>
      </Card>
    )
    
    cy.contains('Card Title').should('be.visible')
    cy.contains('This is a card description').should('be.visible')
    cy.contains('This is the main content of the card.').should('be.visible')
    cy.get('button').should('contain.text', 'Action Button')
  })

  it('renders multiple cards in a layout', () => {
    cy.mount(
      <div className="grid grid-cols-2 gap-4 p-4">
        <Card>
          <CardHeader>
            <CardTitle>Card 1</CardTitle>
          </CardHeader>
          <CardContent>Content 1</CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Card 2</CardTitle>
          </CardHeader>
          <CardContent>Content 2</CardContent>
        </Card>
      </div>
    )
    
    cy.contains('Card 1').should('be.visible')
    cy.contains('Card 2').should('be.visible')
    cy.contains('Content 1').should('be.visible')
    cy.contains('Content 2').should('be.visible')
  })

  it('handles interactive card content', () => {
    const onButtonClick = cy.stub().as('onButtonClick')
    
    cy.mount(
      <Card>
        <CardHeader>
          <CardTitle>Interactive Card</CardTitle>
        </CardHeader>
        <CardContent>
          <input 
            type="text" 
            placeholder="Enter text" 
            className="border rounded px-2 py-1 w-full"
          />
        </CardContent>
        <CardFooter>
          <button 
            onClick={onButtonClick}
            className="px-4 py-2 bg-green-500 text-white rounded"
          >
            Submit
          </button>
        </CardFooter>
      </Card>
    )
    
    cy.get('input').type('Test input')
    cy.get('input').should('have.value', 'Test input')
    cy.get('button').click()
    cy.get('@onButtonClick').should('have.been.called')
  })

  it('applies custom styling', () => {
    cy.mount(
      <Card className="bg-red-100 border-red-300">
        <CardHeader className="bg-red-200">
          <CardTitle className="text-red-800">Styled Card</CardTitle>
        </CardHeader>
        <CardContent className="text-red-700">
          Custom styled content
        </CardContent>
      </Card>
    )
    
    cy.get('[class*="bg-red-100"]').should('exist')
    cy.get('[class*="border-red-300"]').should('exist')
    cy.contains('Styled Card').should('be.visible')
    cy.contains('Custom styled content').should('be.visible')
  })

  it('renders card with image content', () => {
    cy.mount(
      <Card className="w-80">
        <CardContent className="p-0">
          <img 
            src="https://via.placeholder.com/300x150" 
            alt="Card image"
            className="w-full h-32 object-cover rounded-t-lg"
          />
          <div className="p-4">
            <h3 className="font-bold">Image Card</h3>
            <p>This card contains an image.</p>
          </div>
        </CardContent>
      </Card>
    )
    
    cy.get('img').should('exist')
    cy.get('img').should('have.attr', 'src', 'https://via.placeholder.com/300x150')
    cy.contains('Image Card').should('be.visible')
  })
})