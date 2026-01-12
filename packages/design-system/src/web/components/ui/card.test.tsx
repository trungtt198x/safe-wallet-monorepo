import { render, screen } from '@testing-library/react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from './card'

describe('Card', () => {
  describe('Figma Design Fidelity', () => {
    it('should match Figma design tokens for the base Card', () => {
      const { container } = render(<Card data-testid="card">Card title</Card>)
      const card = container.firstChild as HTMLElement

      expect(card).toHaveClass('rounded-md')
      expect(card).toHaveClass('bg-surface')
      expect(card).toHaveClass('px-ds-2')
      expect(card).toHaveClass('py-ds-1')
    })

    it('should use correct spacing tokens (8px vertical, 16px horizontal)', () => {
      const { container } = render(<Card>Content</Card>)
      const card = container.firstChild as HTMLElement

      expect(card.className).toContain('px-ds-2')
      expect(card.className).toContain('py-ds-1')
    })

    it('should use correct border radius token (12px)', () => {
      const { container } = render(<Card>Content</Card>)
      const card = container.firstChild as HTMLElement

      expect(card.className).toContain('rounded-md')
    })

    it('should use correct background color token (bg-surface)', () => {
      const { container } = render(<Card>Content</Card>)
      const card = container.firstChild as HTMLElement

      expect(card.className).toContain('bg-surface')
    })

    it('should NOT have border (Figma design has no border)', () => {
      const { container } = render(<Card>Content</Card>)
      const card = container.firstChild as HTMLElement

      expect(card.className).not.toContain('border')
    })

    it('should NOT have shadow (Figma design has no shadow)', () => {
      const { container } = render(<Card>Content</Card>)
      const card = container.firstChild as HTMLElement

      expect(card.className).not.toContain('shadow')
    })
  })

  describe('Component Rendering', () => {
    it('should render the Card component', () => {
      render(<Card data-testid="card">Test content</Card>)
      const card = screen.getByTestId('card')
      expect(card).toBeInTheDocument()
      expect(card).toHaveTextContent('Test content')
    })

    it('should accept custom className', () => {
      const { container } = render(<Card className="custom-class">Content</Card>)
      const card = container.firstChild as HTMLElement
      expect(card).toHaveClass('custom-class')
    })

    it('should forward ref correctly', () => {
      const ref = { current: null }
      render(<Card ref={ref as React.RefObject<HTMLDivElement>}>Content</Card>)
      expect(ref.current).toBeInstanceOf(HTMLDivElement)
    })

    it('should spread additional props', () => {
      render(
        <Card data-testid="card" aria-label="Test card">
          Content
        </Card>,
      )
      const card = screen.getByTestId('card')
      expect(card).toHaveAttribute('aria-label', 'Test card')
    })
  })

  describe('CardHeader', () => {
    it('should render CardHeader', () => {
      render(
        <Card>
          <CardHeader data-testid="header">Header content</CardHeader>
        </Card>,
      )
      expect(screen.getByTestId('header')).toBeInTheDocument()
    })

    it('should apply correct flex layout classes', () => {
      const { container } = render(
        <Card>
          <CardHeader>Header</CardHeader>
        </Card>,
      )
      const header = container.querySelector('[class*="flex"]')
      expect(header).toHaveClass('flex', 'flex-col', 'space-y-1.5', 'p-6')
    })
  })

  describe('CardTitle', () => {
    it('should render CardTitle', () => {
      render(
        <Card>
          <CardHeader>
            <CardTitle data-testid="title">Title</CardTitle>
          </CardHeader>
        </Card>,
      )
      expect(screen.getByTestId('title')).toBeInTheDocument()
      expect(screen.getByTestId('title')).toHaveTextContent('Title')
    })

    it('should apply correct typography classes', () => {
      render(
        <Card>
          <CardHeader>
            <CardTitle>Title</CardTitle>
          </CardHeader>
        </Card>,
      )
      const title = screen.getByText('Title')
      expect(title).toHaveClass('font-semibold', 'leading-none', 'tracking-tight')
    })
  })

  describe('CardDescription', () => {
    it('should render CardDescription', () => {
      render(
        <Card>
          <CardHeader>
            <CardDescription data-testid="description">Description</CardDescription>
          </CardHeader>
        </Card>,
      )
      expect(screen.getByTestId('description')).toBeInTheDocument()
      expect(screen.getByTestId('description')).toHaveTextContent('Description')
    })

    it('should apply correct text style classes', () => {
      render(
        <Card>
          <CardHeader>
            <CardDescription>Description</CardDescription>
          </CardHeader>
        </Card>,
      )
      const description = screen.getByText('Description')
      expect(description).toHaveClass('text-sm', 'text-muted-foreground')
    })
  })

  describe('CardContent', () => {
    it('should render CardContent', () => {
      render(
        <Card>
          <CardContent data-testid="content">Content</CardContent>
        </Card>,
      )
      expect(screen.getByTestId('content')).toBeInTheDocument()
    })

    it('should apply correct padding classes', () => {
      render(
        <Card>
          <CardContent>Content</CardContent>
        </Card>,
      )
      const content = screen.getByText('Content')
      expect(content).toHaveClass('p-6', 'pt-0')
    })
  })

  describe('CardFooter', () => {
    it('should render CardFooter', () => {
      render(
        <Card>
          <CardFooter data-testid="footer">Footer</CardFooter>
        </Card>,
      )
      expect(screen.getByTestId('footer')).toBeInTheDocument()
    })

    it('should apply correct layout classes', () => {
      render(
        <Card>
          <CardFooter>Footer</CardFooter>
        </Card>,
      )
      const footer = screen.getByText('Footer')
      expect(footer).toHaveClass('flex', 'items-center', 'p-6', 'pt-0')
    })
  })

  describe('Composition', () => {
    it('should render a complete card with all sections', () => {
      render(
        <Card data-testid="card">
          <CardHeader data-testid="header">
            <CardTitle data-testid="title">Title</CardTitle>
            <CardDescription data-testid="description">Description</CardDescription>
          </CardHeader>
          <CardContent data-testid="content">Content</CardContent>
          <CardFooter data-testid="footer">Footer</CardFooter>
        </Card>,
      )

      expect(screen.getByTestId('card')).toBeInTheDocument()
      expect(screen.getByTestId('header')).toBeInTheDocument()
      expect(screen.getByTestId('title')).toBeInTheDocument()
      expect(screen.getByTestId('description')).toBeInTheDocument()
      expect(screen.getByTestId('content')).toBeInTheDocument()
      expect(screen.getByTestId('footer')).toBeInTheDocument()
    })

    it('should work with just content and no wrapper components', () => {
      render(<Card data-testid="card">Simple text content</Card>)

      const card = screen.getByTestId('card')
      expect(card).toBeInTheDocument()
      expect(card).toHaveTextContent('Simple text content')
    })
  })

  describe('Accessibility', () => {
    it('should be accessible as a semantic div', () => {
      const { container } = render(<Card>Content</Card>)
      const card = container.firstChild as HTMLElement
      expect(card.tagName).toBe('DIV')
    })

    it('should support ARIA attributes', () => {
      render(
        <Card data-testid="card" role="article" aria-labelledby="card-title">
          <CardTitle id="card-title">Title</CardTitle>
        </Card>,
      )
      const card = screen.getByTestId('card')
      expect(card).toHaveAttribute('role', 'article')
      expect(card).toHaveAttribute('aria-labelledby', 'card-title')
    })
  })
})
