import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import { FETCH_STATUS, type TenderlySimulation } from '@safe-global/utils/components/tx/security/tenderly/types'
import type { RootState } from '@/src/store'

type SimulationState = {
  txId?: string
  simulation?: TenderlySimulation
  status: FETCH_STATUS
  requestError?: string
  updatedAt?: string
}

const initialState: SimulationState = {
  status: FETCH_STATUS.NOT_ASKED,
}

const simulationSlice = createSlice({
  name: 'simulation',
  initialState,
  reducers: {
    simulationStarted: (state, action: PayloadAction<{ txId?: string }>) => {
      state.txId = action.payload.txId
      state.status = FETCH_STATUS.LOADING
      state.simulation = undefined
      state.requestError = undefined
      state.updatedAt = new Date().toISOString()
    },
    simulationSucceeded: (state, action: PayloadAction<{ txId?: string; simulation: TenderlySimulation }>) => {
      state.txId = action.payload.txId
      state.simulation = action.payload.simulation
      state.status = FETCH_STATUS.SUCCESS
      state.requestError = undefined
      state.updatedAt = new Date().toISOString()
    },
    simulationFailed: (state, action: PayloadAction<{ txId?: string; error: string }>) => {
      state.txId = action.payload.txId
      state.status = FETCH_STATUS.ERROR
      state.simulation = undefined
      state.requestError = action.payload.error
      state.updatedAt = new Date().toISOString()
    },
    resetSimulation: () => initialState,
  },
})

export const { simulationStarted, simulationSucceeded, simulationFailed, resetSimulation } = simulationSlice.actions

export const selectSimulationState = (state: RootState): SimulationState => state.simulation

export const selectSimulationForTx = (state: RootState, txId?: string): SimulationState => {
  const simulation = selectSimulationState(state)

  if (!simulation.txId || simulation.txId !== txId) {
    return initialState
  }

  return simulation
}

export default simulationSlice.reducer
