import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import AddressAutocomplete from './AddressAutocomplete'
import type { AddressBookEntry } from './types'

const theme = createTheme()

const renderWithTheme = (ui: React.ReactElement) => {
  return render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>)
}

describe('AddressAutocomplete', () => {
  const defaultProps = {
    id: 'test-input',
    name: 'testAddress',
    value: '',
    onChange: jest.fn(),
    label: 'Address',
    addressBook: [] as AddressBookEntry[],
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders with a label', () => {
    renderWithTheme(<AddressAutocomplete {...defaultProps} />)
    expect(screen.getByLabelText('Address')).toBeInTheDocument()
  })

  it('has autoComplete="off" for accessibility', () => {
    renderWithTheme(<AddressAutocomplete {...defaultProps} />)
    const input = screen.getByRole('combobox')
    expect(input).toHaveAttribute('autocomplete', 'off')
  })

  it('displays error message when error prop is provided', () => {
    renderWithTheme(<AddressAutocomplete {...defaultProps} error="Invalid address" />)
    expect(screen.getByText('Invalid address')).toBeInTheDocument()
  })

  it('displays error in label when showErrorsInTheLabel is true', () => {
    renderWithTheme(<AddressAutocomplete {...defaultProps} error="Invalid address" showErrorsInTheLabel />)
    expect(screen.getByLabelText('Invalid address')).toBeInTheDocument()
  })

  it('calls onChange when user types an address', async () => {
    const user = userEvent.setup()
    const onChange = jest.fn()
    renderWithTheme(<AddressAutocomplete {...defaultProps} onChange={onChange} />)

    const input = screen.getByRole('combobox')
    await user.type(input, '0x1234567890123456789012345678901234567890')

    expect(onChange).toHaveBeenCalled()
  })

  it('shows address book options when user types partial search term', async () => {
    const user = userEvent.setup()
    const addressBook: AddressBookEntry[] = [
      { address: '0x1234567890123456789012345678901234567890', name: 'Test Contact' },
    ]

    renderWithTheme(<AddressAutocomplete {...defaultProps} addressBook={addressBook} />)

    const input = screen.getByRole('combobox')
    await user.type(input, 'Test')

    await waitFor(() => {
      expect(screen.getByText('Test Contact')).toBeInTheDocument()
    })
  })

  it('filters address book based on input', async () => {
    const user = userEvent.setup()
    const addressBook: AddressBookEntry[] = [
      { address: '0x1234567890123456789012345678901234567890', name: 'Alice' },
      { address: '0xabcdef0123456789abcdef0123456789abcdef01', name: 'Bob' },
    ]

    renderWithTheme(<AddressAutocomplete {...defaultProps} addressBook={addressBook} />)

    const input = screen.getByRole('combobox')
    await user.type(input, 'Alice')

    await waitFor(() => {
      expect(screen.getByText('Alice')).toBeInTheDocument()
      expect(screen.queryByText('Bob')).not.toBeInTheDocument()
    })
  })

  it('updates label to show selected contact name', async () => {
    const addressBook: AddressBookEntry[] = [{ address: '0x1234567890123456789012345678901234567890', name: 'Alice' }]

    renderWithTheme(
      <AddressAutocomplete
        {...defaultProps}
        addressBook={addressBook}
        value="0x1234567890123456789012345678901234567890"
      />,
    )

    expect(screen.getByLabelText('Address (Alice)')).toBeInTheDocument()
  })

  it('shows loading spinner when isResolvingAddress is true', () => {
    renderWithTheme(<AddressAutocomplete {...defaultProps} isResolvingAddress />)
    expect(screen.getByRole('progressbar')).toBeInTheDocument()
    expect(screen.getByLabelText('Loading')).toBeInTheDocument()
  })

  it('is disabled when disabled prop is true', () => {
    renderWithTheme(<AddressAutocomplete {...defaultProps} disabled />)
    const input = screen.getByRole('combobox')
    expect(input).toBeDisabled()
  })

  it('calls onBlur when input loses focus', async () => {
    const onBlur = jest.fn()
    renderWithTheme(<AddressAutocomplete {...defaultProps} onBlur={onBlur} />)

    const input = screen.getByRole('combobox')
    fireEvent.focus(input)
    fireEvent.blur(input)

    expect(onBlur).toHaveBeenCalled()
  })

  it('renders custom endAdornment', () => {
    renderWithTheme(<AddressAutocomplete {...defaultProps} endAdornment={<span data-testid="custom-adornment" />} />)
    expect(screen.getByTestId('custom-adornment')).toBeInTheDocument()
  })

  it('checksums valid addresses', async () => {
    const user = userEvent.setup()
    const onChange = jest.fn()
    renderWithTheme(<AddressAutocomplete {...defaultProps} onChange={onChange} />)

    const input = screen.getByRole('combobox')
    // Use a lowercase address that should be checksummed
    await user.type(input, '0xd8da6bf26964af9d7eed9e03e53415d37aa96045')

    // The onChange should be called with the checksummed address
    expect(onChange).toHaveBeenLastCalledWith('0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045')
  })

  describe('validation callback', () => {
    it('calls validate function and displays validation error', async () => {
      const validate = jest.fn().mockResolvedValue('Custom validation error')

      renderWithTheme(
        <AddressAutocomplete
          {...defaultProps}
          value="0x1234567890123456789012345678901234567890"
          validate={validate}
        />,
      )

      await waitFor(() => {
        expect(validate).toHaveBeenCalledWith('0x1234567890123456789012345678901234567890')
        expect(screen.getByText('Custom validation error')).toBeInTheDocument()
      })
    })

    it('does not show validation error when validate returns undefined', async () => {
      const validate = jest.fn().mockResolvedValue(undefined)

      renderWithTheme(
        <AddressAutocomplete
          {...defaultProps}
          value="0x1234567890123456789012345678901234567890"
          validate={validate}
        />,
      )

      await waitFor(() => {
        expect(validate).toHaveBeenCalled()
      })

      expect(screen.queryByRole('alert')).not.toBeInTheDocument()
    })

    it('shows external error over validation error when both provided', () => {
      renderWithTheme(
        <AddressAutocomplete {...defaultProps} error="External error" validate={() => 'Validation error'} />,
      )

      expect(screen.getByText('External error')).toBeInTheDocument()
      expect(screen.queryByText('Validation error')).not.toBeInTheDocument()
    })

    it('shows loading spinner during validation', async () => {
      let resolveValidation: (value: string | undefined) => void
      const validate = jest.fn().mockImplementation(
        () =>
          new Promise<string | undefined>((resolve) => {
            resolveValidation = resolve
          }),
      )

      renderWithTheme(
        <AddressAutocomplete
          {...defaultProps}
          value="0x1234567890123456789012345678901234567890"
          validate={validate}
        />,
      )

      await waitFor(() => {
        expect(screen.getByRole('progressbar')).toBeInTheDocument()
      })

      // Resolve validation
      resolveValidation!(undefined)

      await waitFor(() => {
        expect(screen.queryByRole('progressbar')).not.toBeInTheDocument()
      })
    })
  })

  describe('address book save button', () => {
    it('shows save button when onAddressBookClick is provided and value is valid', () => {
      const onAddressBookClick = jest.fn()

      renderWithTheme(
        <AddressAutocomplete
          {...defaultProps}
          value="0x1234567890123456789012345678901234567890"
          onAddressBookClick={onAddressBookClick}
        />,
      )

      expect(screen.getByRole('button', { name: 'Save to address book' })).toBeInTheDocument()
    })

    it('does not show save button when disabled', () => {
      const onAddressBookClick = jest.fn()

      renderWithTheme(
        <AddressAutocomplete
          {...defaultProps}
          value="0x1234567890123456789012345678901234567890"
          onAddressBookClick={onAddressBookClick}
          disabled
        />,
      )

      expect(screen.queryByRole('button', { name: 'Save to address book' })).not.toBeInTheDocument()
    })

    it('does not show save button when address is invalid', () => {
      const onAddressBookClick = jest.fn()

      renderWithTheme(
        <AddressAutocomplete {...defaultProps} value="invalid-address" onAddressBookClick={onAddressBookClick} />,
      )

      expect(screen.queryByRole('button', { name: 'Save to address book' })).not.toBeInTheDocument()
    })

    it('calls onAddressBookClick when save button is clicked', async () => {
      const user = userEvent.setup()
      const onAddressBookClick = jest.fn()

      renderWithTheme(
        <AddressAutocomplete
          {...defaultProps}
          value="0x1234567890123456789012345678901234567890"
          onAddressBookClick={onAddressBookClick}
        />,
      )

      const saveButton = screen.getByRole('button', { name: 'Save to address book' })
      await user.click(saveButton)

      expect(onAddressBookClick).toHaveBeenCalled()
    })
  })
})
