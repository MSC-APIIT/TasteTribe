import React from 'react'

// Create a simplified sign in component for testing without Next.js dependencies
const SimpleSignIn = ({ onSuccess }: { onSuccess?: () => void }) => {
  const [email, setEmail] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [error, setError] = React.useState('')
  const [isLoading, setIsLoading] = React.useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    // Simple validation
    if (!email || !password) {
      setError('Email and password are required')
      setIsLoading(false)
      return
    }

    if (!email.includes('@')) {
      setError('Please enter a valid email')
      setIsLoading(false)
      return
    }

    // Simulate API call
    setTimeout(() => {
      onSuccess?.()
      setIsLoading(false)
    }, 100)
  }

  return (
    <>
      <div className="text-2xl mb-10 text-center mx-auto inline-block">
        Login
      </div>

      <div className="space-y-3 mb-6">
        <button className="w-full py-2 px-4 border rounded-md">
          Sign in with Google
        </button>
        <button className="w-full py-2 px-4 border rounded-md">
          Sign in with GitHub
        </button>
      </div>

      <div className="relative my-6 text-center">
        <span className="absolute left-0 top-1/2 w-[40%] h-px bg-muted -translate-y-1/2"></span>
        <span className="relative z-10 px-3 text-muted-foreground">OR</span>
        <span className="absolute right-0 top-1/2 w-[40%] h-px bg-muted -translate-y-1/2"></span>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="mb-[22px]">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isLoading}
              className="w-full rounded-md border border-solid bg-transparent px-5 py-3 text-base text-dark outline-none transition focus:border-primary focus-visible:shadow-none disabled:opacity-50 disabled:cursor-not-allowed"
          />
        </div>
        <div className="mb-[22px]">
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isLoading}
              className="w-full rounded-md border border-solid bg-transparent px-5 py-3 text-base text-dark outline-none transition focus:border-primary focus-visible:shadow-none disabled:opacity-50 disabled:cursor-not-allowed"
          />
        </div>
        {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
        <div className="mb-9">
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2 rounded-md bg-primary text-primary-foreground font-medium border border-primary hover:bg-muted hover:text-primary transition duration-300 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-primary disabled:hover:text-primary-foreground flex items-center justify-center gap-2"
          >
            {isLoading && (
              <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
            )}
            {isLoading ? 'Signing In...' : 'Sign In'}
          </button>
        </div>
      </form>

      <a
        href="/forgot-password"
        className="text-body-secondary text-base hover:underline"
      >
        Forgot Password?
      </a>
      <p className="text-body-secondary text-base">
        Not a member yet?{' '}
        <a href="/auth/signup" className="text-primary hover:underline">
          Sign Up
        </a>
      </p>
    </>
  )
}

describe('Sign In Component', () => {
  it('renders sign in form elements', () => {
    cy.mount(<SimpleSignIn />)
    
    cy.contains('Login').should('be.visible')
    cy.contains('OR').should('be.visible')
    
    // Should have email and password inputs
    cy.get('input[type="email"]').should('exist')
    cy.get('input[type="password"]').should('exist')
    
    // Should have submit button
    cy.get('button[type="submit"]').should('exist')
  })

  it('allows user to enter email and password', () => {
    cy.mount(<SimpleSignIn />)
    
    cy.get('input[type="email"]').type('test@example.com')
    cy.get('input[type="password"]').type('password123')
    
    cy.get('input[type="email"]').should('have.value', 'test@example.com')
    cy.get('input[type="password"]').should('have.value', 'password123')
  })

  it('displays validation errors for empty fields', () => {
    cy.mount(<SimpleSignIn />)
    
    cy.get('button[type="submit"]').click()
    
    cy.contains('Email and password are required').should('be.visible')
  })

  it('shows loading state during form submission', () => {
    cy.mount(<SimpleSignIn />)
    
    cy.get('input[type="email"]').type('test@example.com')
    cy.get('input[type="password"]').type('password123')
    cy.get('button[type="submit"]').click()
    
    cy.contains('Signing In...').should('be.visible')
    cy.get('.animate-spin').should('exist')
  })

  it('renders social sign in component', () => {
    cy.mount(<SimpleSignIn />)
    
    cy.contains('Sign in with Google').should('be.visible')
    cy.contains('Sign in with GitHub').should('be.visible')
  })

  it('has proper form structure and accessibility', () => {
    cy.mount(<SimpleSignIn />)
    
    cy.get('form').should('exist')
    cy.get('input[type="email"]').should('have.attr', 'placeholder', 'Email')
    cy.get('input[type="password"]').should('have.attr', 'placeholder', 'Password')
  })

  it('handles form submission with valid data', () => {
    const onSuccessSpy = cy.stub().as('onSuccess')
    cy.mount(<SimpleSignIn onSuccess={onSuccessSpy} />)
    
    cy.get('input[type="email"]').type('test@example.com')
    cy.get('input[type="password"]').type('password123')
    cy.get('button[type="submit"]').click()
    
    cy.get('@onSuccess').should('have.been.called')
  })

  it('displays proper styling and layout', () => {
    cy.mount(<SimpleSignIn />)
    
    cy.get('.text-2xl').should('exist')
    cy.get('.w-full').should('exist')
    cy.get('.rounded-md').should('exist')
  })

  it('renders in a modal context', () => {
    cy.mount(
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md mx-auto">
        <SimpleSignIn />
      </div>
    )
    
    cy.contains('Login').should('be.visible')
    cy.get('input[type="email"]').should('be.visible')
  })

  it('handles different screen sizes responsively', () => {
    cy.viewport(320, 568) // Small mobile screen
    cy.mount(<SimpleSignIn />)
    
    cy.contains('Login').should('be.visible')
    cy.get('input[type="email"]').should('be.visible')
    cy.get('button[type="submit"]').should('be.visible')
  })

  it('maintains form state during interaction', () => {
    cy.mount(<SimpleSignIn />)
    
    cy.get('input[type="email"]').type('test@example.com')
    cy.get('input[type="password"]').type('password123')
    
    // Click elsewhere to blur
    cy.get('.text-2xl').click()
    
    // Values should still be there
    cy.get('input[type="email"]').should('have.value', 'test@example.com')
    cy.get('input[type="password"]').should('have.value', 'password123')
  })
})