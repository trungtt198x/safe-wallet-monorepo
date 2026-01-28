import { render, screen } from '@testing-library/react'
import { withFeatureGuard } from './withFeatureGuard'

// Mock component to test with
const MockComponent = ({ message }: { message: string }) => <div data-testid="mock-component">{message}</div>

describe('withFeatureGuard', () => {
  it('renders nothing when guard returns false', () => {
    const useGuard = () => false
    const GuardedComponent = withFeatureGuard(MockComponent, useGuard)

    const { container } = render(<GuardedComponent message="test" />)

    expect(container).toBeEmptyDOMElement()
  })

  it('renders nothing when guard returns undefined (loading state)', () => {
    const useGuard = () => undefined
    const GuardedComponent = withFeatureGuard(MockComponent, useGuard)

    const { container } = render(<GuardedComponent message="test" />)

    expect(container).toBeEmptyDOMElement()
  })

  it('renders the component when guard returns true', () => {
    const useGuard = () => true
    const GuardedComponent = withFeatureGuard(MockComponent, useGuard)

    render(<GuardedComponent message="Hello World" />)

    expect(screen.getByTestId('mock-component')).toBeInTheDocument()
    expect(screen.getByText('Hello World')).toBeInTheDocument()
  })

  it('renders the component with wrapper when guard returns true', () => {
    const useGuard = () => true
    const GuardedComponent = withFeatureGuard(MockComponent, useGuard)

    render(
      <GuardedComponent
        message="Wrapped Content"
        wrapper={(children) => <section data-testid="wrapper">{children}</section>}
      />,
    )

    expect(screen.getByTestId('wrapper')).toBeInTheDocument()
    expect(screen.getByTestId('mock-component')).toBeInTheDocument()
    expect(screen.getByText('Wrapped Content')).toBeInTheDocument()
  })

  it('does not render wrapper when guard returns false', () => {
    const useGuard = () => false
    const GuardedComponent = withFeatureGuard(MockComponent, useGuard)

    const { container } = render(
      <GuardedComponent message="test" wrapper={(children) => <section data-testid="wrapper">{children}</section>} />,
    )

    expect(container).toBeEmptyDOMElement()
    expect(screen.queryByTestId('wrapper')).not.toBeInTheDocument()
  })

  it('sets display name for React DevTools', () => {
    const useGuard = () => true
    const NamedComponent = ({ value }: { value: string }) => <div>{value}</div>
    NamedComponent.displayName = 'NamedComponent'

    const GuardedComponent = withFeatureGuard(NamedComponent, useGuard)

    expect(GuardedComponent.displayName).toBe('Guarded(NamedComponent)')
  })
})
