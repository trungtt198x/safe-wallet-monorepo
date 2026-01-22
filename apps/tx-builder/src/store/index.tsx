import TransactionsProvider from './transactionsContext'
import TransactionLibraryProvider from './transactionLibraryContext'
import React, { PropsWithChildren } from 'react'
import NetworkProvider from './networkContext'
import AddressBookProvider from './addressBookContext'

const StoreProvider: React.FC<PropsWithChildren> = ({ children }) => {
  return (
    <NetworkProvider>
      <AddressBookProvider>
        <TransactionsProvider>
          <TransactionLibraryProvider>{children}</TransactionLibraryProvider>
        </TransactionsProvider>
      </AddressBookProvider>
    </NetworkProvider>
  )
}

export { useTransactions } from './transactionsContext'
export { useTransactionLibrary } from './transactionLibraryContext'
export { useNetwork } from './networkContext'
export { useAddressBook } from './addressBookContext'

export default StoreProvider
