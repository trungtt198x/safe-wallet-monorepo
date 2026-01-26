import type { Meta, StoryObj } from '@storybook/react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ArrowUpRight, ArrowDownLeft, ArrowLeftRight, Check, X, AlertCircle, Info } from 'lucide-react'

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="mb-12">
    <h2 className="text-2xl font-semibold mb-6 pb-2 border-b">{title}</h2>
    {children}
  </div>
)

const SubSection = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="mb-8">
    <h3 className="text-lg font-medium mb-4 text-muted-foreground">{title}</h3>
    {children}
  </div>
)

const ComponentShowcase = () => {
  return (
    <div className="p-8 max-w-4xl mx-auto font-sans">
      <div className="mb-12">
        <h1 className="text-4xl font-bold mb-2">Design System Components</h1>
        <p className="text-lg text-muted-foreground">
          All shadcn/ui components styled with Safe design tokens
        </p>
      </div>

      {/* BUTTONS */}
      <Section title="Buttons">
        <SubSection title="Variants">
          <div className="flex flex-wrap gap-3">
            <Button variant="default">Default</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="link">Link</Button>
            <Button variant="destructive">Destructive</Button>
          </div>
        </SubSection>

        <SubSection title="Sizes">
          <div className="flex flex-wrap items-center gap-3">
            <Button size="sm">Small</Button>
            <Button size="default">Default</Button>
            <Button size="lg">Large</Button>
            <Button size="icon"><Check className="h-4 w-4" /></Button>
          </div>
        </SubSection>

        <SubSection title="With Icons">
          <div className="flex flex-wrap gap-3">
            <Button><ArrowUpRight className="h-4 w-4 mr-2" />Send</Button>
            <Button variant="secondary"><ArrowLeftRight className="h-4 w-4 mr-2" />Swap</Button>
            <Button variant="outline"><ArrowDownLeft className="h-4 w-4 mr-2" />Receive</Button>
          </div>
        </SubSection>

        <SubSection title="States">
          <div className="flex flex-wrap gap-3">
            <Button>Normal</Button>
            <Button disabled>Disabled</Button>
          </div>
        </SubSection>
      </Section>

      {/* INPUTS */}
      <Section title="Inputs">
        <SubSection title="Basic">
          <div className="space-y-4 max-w-md">
            <Input placeholder="Default input" />
            <Input type="email" placeholder="Email input" />
            <Input type="password" placeholder="Password input" />
            <Input type="number" placeholder="Number input" />
          </div>
        </SubSection>

        <SubSection title="States">
          <div className="space-y-4 max-w-md">
            <Input placeholder="Normal" />
            <Input placeholder="Disabled" disabled />
            <Input value="Read only value" readOnly />
          </div>
        </SubSection>

        <SubSection title="With Labels">
          <div className="space-y-4 max-w-md">
            <div className="space-y-2">
              <label className="text-sm font-medium">Email Address</label>
              <Input type="email" placeholder="email@example.com" />
              <p className="text-xs text-muted-foreground">We&apos;ll never share your email.</p>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Wallet Address</label>
              <Input placeholder="0x..." className="border-destructive" />
              <p className="text-xs text-destructive">Invalid Ethereum address</p>
            </div>
          </div>
        </SubSection>
      </Section>

      {/* BADGES */}
      <Section title="Badges">
        <SubSection title="Variants">
          <div className="flex flex-wrap gap-3">
            <Badge variant="default">Default</Badge>
            <Badge variant="secondary">Secondary</Badge>
            <Badge variant="outline">Outline</Badge>
            <Badge variant="destructive">Destructive</Badge>
          </div>
        </SubSection>

        <SubSection title="Use Cases">
          <div className="flex flex-wrap gap-3">
            <Badge variant="secondary">Pending</Badge>
            <Badge variant="default">Confirmed</Badge>
            <Badge variant="destructive">Failed</Badge>
            <Badge variant="outline">Draft</Badge>
          </div>
        </SubSection>

        <SubSection title="With Icons">
          <div className="flex flex-wrap gap-3">
            <Badge variant="default"><Check className="h-3 w-3 mr-1" />Success</Badge>
            <Badge variant="destructive"><X className="h-3 w-3 mr-1" />Error</Badge>
            <Badge variant="secondary"><AlertCircle className="h-3 w-3 mr-1" />Warning</Badge>
            <Badge variant="outline"><Info className="h-3 w-3 mr-1" />Info</Badge>
          </div>
        </SubSection>
      </Section>

      {/* CARDS */}
      <Section title="Cards">
        <SubSection title="Basic Card">
          <Card className="max-w-md">
            <CardHeader>
              <CardTitle>Card Title</CardTitle>
              <CardDescription>Card description goes here</CardDescription>
            </CardHeader>
            <CardContent>
              <p>This is the card content. You can put any content here.</p>
            </CardContent>
          </Card>
        </SubSection>

        <SubSection title="Card with Footer">
          <Card className="max-w-md">
            <CardHeader>
              <CardTitle>Confirm Transaction</CardTitle>
              <CardDescription>Review the details below</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Amount</span>
                  <span>1.5 ETH</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">To</span>
                  <span className="font-mono">0x1234...5678</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Gas</span>
                  <span>~0.002 ETH</span>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end gap-2">
              <Button variant="outline">Cancel</Button>
              <Button>Confirm</Button>
            </CardFooter>
          </Card>
        </SubSection>

        <SubSection title="Card Variants">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Safe Account</CardTitle>
                <CardDescription>eth:0x1234...5678</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-semibold">12.5 ETH</div>
                <p className="text-sm text-muted-foreground">~$25,000 USD</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">Pending Transaction</CardTitle>
                  <Badge variant="secondary">1 of 2</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm">Send 0.5 ETH to vitalik.eth</p>
              </CardContent>
              <CardFooter>
                <Button size="sm" className="w-full">Sign</Button>
              </CardFooter>
            </Card>
          </div>
        </SubSection>
      </Section>

      {/* COMPOSITIONS */}
      <Section title="Compositions">
        <SubSection title="Dashboard Overview">
          <Card className="border-0 px-6 pt-5 pb-3">
            <CardContent className="p-0">
              <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Total balance</p>
                  <p className="text-4xl font-semibold tracking-tight">
                    12,456.78{' '}
                    <span className="text-2xl font-normal text-muted-foreground">USD</span>
                  </p>
                </div>
                <div className="flex flex-wrap md:flex-nowrap gap-2">
                  <Button className="flex-1 md:flex-none h-[42px] gap-2">
                    <ArrowUpRight className="h-4 w-4" />
                    Send
                  </Button>
                  <Button variant="secondary" className="flex-1 md:flex-none h-[42px] gap-2">
                    <ArrowLeftRight className="h-4 w-4" />
                    Swap
                  </Button>
                  <Button variant="secondary" className="flex-1 md:flex-none h-[42px] gap-2">
                    <ArrowDownLeft className="h-4 w-4" />
                    Receive
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </SubSection>

        <SubSection title="Form Example">
          <Card className="max-w-md">
            <CardHeader>
              <CardTitle>Create New Safe</CardTitle>
              <CardDescription>Set up your multi-signature wallet</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Safe Name</label>
                <Input placeholder="My Safe" />
                <p className="text-xs text-muted-foreground">A name for your new Safe</p>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Owner Address</label>
                <Input placeholder="0x..." />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Threshold</label>
                <Input type="number" placeholder="2" />
                <p className="text-xs text-muted-foreground">Signatures required to execute</p>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end gap-2">
              <Button variant="outline">Cancel</Button>
              <Button>Create Safe</Button>
            </CardFooter>
          </Card>
        </SubSection>

        <SubSection title="Transaction Queue">
          <div className="space-y-3 max-w-lg">
            {[
              { title: 'Send 1.5 ETH', to: 'vitalik.eth', status: 'pending', sigs: '1/2' },
              { title: 'Approve USDC', to: 'Uniswap', status: 'pending', sigs: '0/2' },
              { title: 'Swap ETH → USDC', to: 'CoW Swap', status: 'ready', sigs: '2/2' },
            ].map((tx, i) => (
              <Card key={i}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{tx.title}</p>
                      <p className="text-sm text-muted-foreground">To: {tx.to}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={tx.status === 'ready' ? 'default' : 'secondary'}>
                        {tx.sigs}
                      </Badge>
                      <Button size="sm" variant={tx.status === 'ready' ? 'default' : 'outline'}>
                        {tx.status === 'ready' ? 'Execute' : 'Sign'}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </SubSection>
      </Section>
    </div>
  )
}

const meta: Meta<typeof ComponentShowcase> = {
  title: 'Design System/Component Showcase',
  component: ComponentShowcase,
  parameters: {
    layout: 'fullscreen',
  },
}

export default meta
type Story = StoryObj<typeof ComponentShowcase>

export const AllComponents: Story = {}
