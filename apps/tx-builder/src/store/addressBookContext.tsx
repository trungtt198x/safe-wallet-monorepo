import { createContext, useContext, useEffect, useState, useCallback, PropsWithChildren } from 'react'
import type { AddressBookItem } from '@safe-global/safe-apps-sdk'
import { useSafeAppsSDK } from '@safe-global/safe-apps-react-sdk'

type AddressBookContextProps = {
  addressBook: AddressBookItem[]
  isLoading: boolean
  error: Error | null
  refetch: () => Promise<void>
}

export const AddressBookContext = createContext<AddressBookContextProps | null>(null)

const AddressBookProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const { sdk, safe } = useSafeAppsSDK()
  const [addressBook, setAddressBook] = useState<AddressBookItem[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const fetchAddressBook = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const data = await sdk.safe.requestAddressBook()
      const filtered = data.filter((item) => item.chainId === String(safe.chainId))
      setAddressBook(filtered)
    } catch (err) {
      // Permission denied or other error - fail silently, address book just won't be available
      setAddressBook([])
      if (err instanceof Error) {
        setError(err)
      }
    } finally {
      setIsLoading(false)
    }
  }, [sdk, safe.chainId])

  useEffect(() => {
    fetchAddressBook()
  }, [fetchAddressBook])

  return (
    <AddressBookContext.Provider value={{ addressBook, isLoading, error, refetch: fetchAddressBook }}>
      {children}
    </AddressBookContext.Provider>
  )
}

export const useAddressBook = () => {
  const context = useContext(AddressBookContext)
  if (!context) {
    throw new Error('useAddressBook must be used within AddressBookProvider')
  }
  return context
}

export default AddressBookProvider
