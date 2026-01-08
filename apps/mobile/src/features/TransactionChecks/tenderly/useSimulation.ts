import { useCallback, useMemo } from 'react'
import { getSimulationPayload } from '@/src/features/TransactionChecks/tenderly/utils'
import { asError } from '@safe-global/utils/services/exceptions/utils'
import { type UseSimulationReturn } from '@safe-global/utils/components/tx/security/tenderly/useSimulation'
import {
  getSimulation,
  getSimulationLink,
  type SimulationTxParams,
} from '@safe-global/utils/components/tx/security/tenderly/utils'
import { useAppDispatch, useAppSelector } from '@/src/store/hooks'
import { selectTenderly } from '@/src/store/settingsSlice'
import {
  resetSimulation as resetSimulationAction,
  selectSimulationForTx,
  simulationFailed,
  simulationStarted,
  simulationSucceeded,
} from '@/src/store/simulationSlice'
import Logger from '@/src/utils/logger'

export const useSimulation = (txId?: string): UseSimulationReturn => {
  const dispatch = useAppDispatch()
  const simulationState = useAppSelector((state) => selectSimulationForTx(state, txId))
  const tenderly = useAppSelector(selectTenderly)

  const simulationLink = useMemo(
    () => getSimulationLink(simulationState.simulation?.simulation.id || '', tenderly),
    [simulationState.simulation, tenderly],
  )

  const resetSimulation = useCallback(() => {
    dispatch(resetSimulationAction())
  }, [dispatch])

  const simulateTransaction = useCallback(
    async (params: SimulationTxParams, txIdentifier?: string) => {
      dispatch(simulationStarted({ txId: txIdentifier }))

      try {
        const simulationPayload = await getSimulationPayload(params)

        const data = await getSimulation(simulationPayload, tenderly)

        dispatch(simulationSucceeded({ txId: txIdentifier, simulation: data }))
      } catch (error) {
        Logger.error(asError(error).message)

        dispatch(simulationFailed({ txId: txIdentifier, error: asError(error).message }))
      }
    },
    [dispatch, tenderly],
  )

  return {
    simulateTransaction,
    // This is only used by the provider
    _simulationRequestStatus: simulationState.status,
    simulationData: simulationState.simulation,
    simulationLink,
    requestError: simulationState.requestError,
    resetSimulation,
  } as UseSimulationReturn
}
