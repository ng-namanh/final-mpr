import '~/global.css'
import * as React from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { ThemeProvider } from '@react-navigation/native'
import { SplashScreen, Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { DARK_THEME, LIGHT_THEME } from '~/lib/constants'
import { useColorScheme } from '~/hooks/useColorScheme'
import { PortalHost } from '~/components/primitives/portal'
import { ThemeToggle } from '~/components/ThemeToggle'
import '~/config/firebase'
import { useEffect } from 'react'
export { ErrorBoundary } from 'expo-router'

SplashScreen.preventAutoHideAsync()

export default function RootLayout() {
  const { colorScheme, setColorScheme, isDarkColorScheme } = useColorScheme()
  const [isColorSchemeLoaded, setIsColorSchemeLoaded] = React.useState(false)

  useEffect(() => {
    ;(async () => {
      const theme = await AsyncStorage.getItem('theme')
      if (!theme) {
        AsyncStorage.setItem('theme', colorScheme)
        setIsColorSchemeLoaded(true)
        return
      }
      const colorTheme = theme === 'dark' ? 'dark' : 'light'
      if (colorTheme !== colorScheme) {
        setColorScheme(colorTheme)

        setIsColorSchemeLoaded(true)
        return
      }
      setIsColorSchemeLoaded(true)
    })().finally(() => {
      SplashScreen.hideAsync()
    })
  }, [])

  if (!isColorSchemeLoaded) {
    return null
  }

  return (
    <ThemeProvider value={isDarkColorScheme ? DARK_THEME : LIGHT_THEME}>
      <StatusBar style={isDarkColorScheme ? 'light' : 'dark'} />
      <Stack>
        <Stack.Screen
          name='index'
          options={{
            title: 'Home',
            headerRight: () => <ThemeToggle />
          }}
        />
        <Stack.Screen
          name='auth/login'
          options={{
            title: 'Login',
            headerRight: () => <ThemeToggle />
          }}
        />
        <Stack.Screen
          name='auth/register'
          options={{
            title: 'Register',
            headerRight: () => <ThemeToggle />
          }}
        />
      </Stack>
      <PortalHost />
    </ThemeProvider>
  )
}
