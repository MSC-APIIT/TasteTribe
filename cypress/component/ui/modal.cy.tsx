import { Modal } from '../../../src/components/ui/modal'
import { useState } from 'react'

// Test wrapper component to manage modal state
function ModalTestWrapper() {
  const [isOpen, setIsOpen] = useState(false)
  
  return (
    <div>
      <button onClick={() => setIsOpen(true)}>Open Modal</button>
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <h2 className="text-xl font-bold mb-4">Test Modal</h2>
        <p>This is the modal content.</p>
        <button className="mt-4 px-4 py-2 bg-blue-500 text-white rounded">
          Modal Button
        </button>
      </Modal>
    </div>
  )
}

describe('Modal Component', () => {
  it('does not render when isOpen is false', () => {
    cy.mount(
      <Modal isOpen={false} onClose={() => {}}>
        <p>Hidden modal content</p>
      </Modal>
    )
    
    cy.contains('Hidden modal content').should('not.exist')
  })

  it('renders when isOpen is true', () => {
    cy.mount(
      <Modal isOpen={true} onClose={() => {}}>
        <h2>Visible Modal</h2>
        <p>Modal is now visible</p>
      </Modal>
    )
    
    cy.contains('Visible Modal').should('be.visible')
    cy.contains('Modal is now visible').should('be.visible')
    cy.get('.fixed.inset-0').should('exist') // backdrop
  })

  it('can be opened and closed interactively', () => {
    cy.mount(<ModalTestWrapper />)
    
    // Initially modal should not be visible
    cy.contains('Test Modal').should('not.exist')
    
    // Open modal
    cy.contains('Open Modal').click()
    cy.contains('Test Modal').should('be.visible')
    cy.contains('This is the modal content.').should('be.visible')
    
    // Close modal using X button
    cy.get('button').contains('×').click()
    cy.contains('Test Modal').should('not.exist')
  })

  it('closes when close button is clicked', () => {
    const onCloseSpy = cy.stub().as('onCloseSpy')
    
    cy.mount(
      <Modal isOpen={true} onClose={onCloseSpy}>
        <h2>Closeable Modal</h2>
      </Modal>
    )
    
    cy.get('button').contains('×').click()
    cy.get('@onCloseSpy').should('have.been.called')
  })

  it('has proper backdrop and styling', () => {
    cy.mount(
      <Modal isOpen={true} onClose={() => {}}>
        <h2>Styled Modal</h2>
      </Modal>
    )
    
    // Check backdrop
    cy.get('.fixed.inset-0').should('have.class', 'bg-black/60')
    cy.get('.fixed.inset-0').should('have.class', 'backdrop-blur-sm')
    
    // Check modal container
    cy.get('.bg-white').should('exist')
    cy.get('.rounded-lg').should('exist')
    cy.get('.shadow-2xl').should('exist')
  })

  it('handles scrollable content', () => {
    const longContent = Array(50).fill('This is a long line of text. ').join('')
    
    cy.mount(
      <Modal isOpen={true} onClose={() => {}}>
        <h2>Scrollable Modal</h2>
        <div style={{ height: '200vh' }}>
          <p>{longContent}</p>
        </div>
      </Modal>
    )
    
    cy.contains('Scrollable Modal').should('be.visible')
    cy.get('.overflow-y-auto').should('exist')
    cy.get('.max-h-\\[90vh\\]').should('exist')
  })

  it('renders different modal content types', () => {
    cy.mount(
      <Modal isOpen={true} onClose={() => {}}>
        <div className="space-y-4">
          <h1>Modal with Form</h1>
          <form>
            <input 
              type="text" 
              placeholder="Name" 
              className="border rounded px-2 py-1 w-full mb-2"
            />
            <input 
              type="email" 
              placeholder="Email" 
              className="border rounded px-2 py-1 w-full mb-2"
            />
            <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded">
              Submit
            </button>
          </form>
        </div>
      </Modal>
    )
    
    cy.contains('Modal with Form').should('be.visible')
    cy.get('input[type="text"]').should('exist')
    cy.get('input[type="email"]').should('exist')
    cy.get('button[type="submit"]').should('contain.text', 'Submit')
  })

  it('maintains focus within modal', () => {
    cy.mount(
      <Modal isOpen={true} onClose={() => {}}>
        <h2>Focus Test Modal</h2>
        <input type="text" placeholder="First input" className="border rounded px-2 py-1 mb-2" />
        <input type="text" placeholder="Second input" className="border rounded px-2 py-1" />
      </Modal>
    )
    
    cy.get('input').first().click().should('be.focused')
    cy.get('input').last().click().should('be.focused')
  })
})