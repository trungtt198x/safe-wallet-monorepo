import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import { FormProvider, useForm } from 'react-hook-form'
import AddressAutocompleteField from './AddressAutocompleteField'
import type { AddressBookEntry } from '../AddressAutocomplete'

const theme = createTheme()

interface TestFormData {
  address: string
}

const TestWrapper = ({
  children,
  defaultValues = { address: '' },
}: {
  children: React.ReactNode
  defaultValues?: TestFormData
}) => {
  const methods = useForm<TestFormData>({
    defaultValues,
    mode: 'onChange',
  })

  return (
    <ThemeProvider theme={theme}>
      <FormProvider {...methods}>{children}</FormProvider>
    </ThemeProvider>
  )
}

describe('AddressAutocompleteField', () => {
  const defaultProps = {
    id: 'test-input',
    name: 'address' as const,
    label: 'Address',
    addressBook: [] as AddressBookEntry[],
  }

  it('renders with a label', () => {
    render(
      <TestWrapper>
        <AddressAutocompleteField {...defaultProps} />
      </TestWrapper>,
    )

    expect(screen.getByLabelText('Address')).toBeInTheDocument()
  })

  it('integrates with react-hook-form and updates value', async () => {
    const user = userEvent.setup()

    render(
      <TestWrapper>
        <AddressAutocompleteField {...defaultProps} />
      </TestWrapper>,
    )

    const input = screen.getByRole('combobox')
    await user.type(input, '0x1234567890123456789012345678901234567890')

    expect(input).toHaveValue('0x1234567890123456789012345678901234567890')
  })

  it('shows validation error from rules', async () => {
    const user = userEvent.setup()

    render(
      <TestWrapper>
        <AddressAutocompleteField
          {...defaultProps}
          rules={{
            validate: (value) => {
              if (value !== '0x1234567890123456789012345678901234567890') {
                return 'Invalid address'
              }
            },
          }}
        />
      </TestWrapper>,
    )

    const input = screen.getByRole('combobox')
    await user.type(input, 'invalid')
    fireEvent.blur(input)

    await waitFor(() => {
      expect(screen.getByText('Invalid address')).toBeInTheDocument()
    })
  })

  it('shows required validation error', async () => {
    render(
      <TestWrapper>
        <AddressAutocompleteField
          {...defaultProps}
          rules={{
            required: 'Address is required',
          }}
        />
      </TestWrapper>,
    )

    const input = screen.getByRole('combobox')
    fireEvent.focus(input)
    fireEvent.blur(input)

    await waitFor(() => {
      expect(screen.getByText('Address is required')).toBeInTheDocument()
    })
  })

  it('uses custom validate prop combined with rules', async () => {
    const user = userEvent.setup()
    const customValidate = jest.fn().mockReturnValue('Custom validation error')

    render(
      <TestWrapper>
        <AddressAutocompleteField {...defaultProps} validate={customValidate} />
      </TestWrapper>,
    )

    const input = screen.getByRole('combobox')
    await user.type(input, '0x1234567890123456789012345678901234567890')
    fireEvent.blur(input)

    await waitFor(() => {
      expect(customValidate).toHaveBeenCalled()
    })
  })

  it('renders with default value from form context', () => {
    render(
      <TestWrapper defaultValues={{ address: '0xabCDeF0123456789AbcdEf0123456789aBCDEF01' }}>
        <AddressAutocompleteField {...defaultProps} />
      </TestWrapper>,
    )

    const input = screen.getByRole('combobox')
    // AddressAutocomplete checksums addresses
    expect(input).toHaveValue('0xabCDeF0123456789AbcdEf0123456789aBCDEF01')
  })

  it('shows address book options in dropdown', async () => {
    const user = userEvent.setup()
    const addressBook: AddressBookEntry[] = [
      { address: '0x1234567890123456789012345678901234567890', name: 'Test Contact' },
    ]

    render(
      <TestWrapper>
        <AddressAutocompleteField {...defaultProps} addressBook={addressBook} />
      </TestWrapper>,
    )

    const input = screen.getByRole('combobox')
    await user.type(input, 'Test')

    await waitFor(() => {
      expect(screen.getByText('Test Contact')).toBeInTheDocument()
    })
  })

  it('calls onBlur callback', async () => {
    const onBlur = jest.fn()

    render(
      <TestWrapper>
        <AddressAutocompleteField {...defaultProps} onBlur={onBlur} />
      </TestWrapper>,
    )

    const input = screen.getByRole('combobox')
    fireEvent.focus(input)
    fireEvent.blur(input)

    await waitFor(() => {
      expect(onBlur).toHaveBeenCalled()
    })
  })
})
