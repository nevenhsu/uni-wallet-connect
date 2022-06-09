import { createSlice } from '@reduxjs/toolkit'
import { SupportedLocale } from '../../constants/locales'

const currentTimestamp = () => new Date().getTime()

export interface UserState {
  matchesDarkMode: boolean // whether the dark mode media query matches

  userDarkMode: boolean | null // the user's choice for dark mode or light mode
  userLocale: SupportedLocale | null

  timestamp: number
}

export const initialState: UserState = {
  matchesDarkMode: false,
  userDarkMode: null,
  userLocale: null,
  timestamp: currentTimestamp(),
}

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    updateUserDarkMode(state, action) {
      state.userDarkMode = action.payload.userDarkMode
      state.timestamp = currentTimestamp()
    },
    updateMatchesDarkMode(state, action) {
      state.matchesDarkMode = action.payload.matchesDarkMode
      state.timestamp = currentTimestamp()
    },
    updateUserLocale(state, action) {
      state.userLocale = action.payload.userLocale
      state.timestamp = currentTimestamp()
    },
  },
})

export const { updateMatchesDarkMode, updateUserDarkMode, updateUserLocale } = userSlice.actions
export default userSlice.reducer
