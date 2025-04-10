'use client'

import { useState, useEffect } from 'react'
import type { ThemeName } from '@/theme'
import { createCustomTheme } from '@/theme'
import { useToast } from '@chakra-ui/react'

export const useUserTheme = () => {
  const [theme, setTheme] = useState<ThemeName>('default')
  const toast = useToast()

  useEffect(() => {
    const savedTheme = localStorage.getItem('userTheme')
    if (savedTheme && ['default', 'gaming', 'nature', 'retro'].includes(savedTheme)) {
      setTheme(savedTheme as ThemeName)
    }
  }, [])

  const changeTheme = (newTheme: ThemeName) => {
    setTheme(newTheme)
    localStorage.setItem('userTheme', newTheme)
    toast({
      title: 'Thème mis à jour',
      description: `Le thème ${newTheme} a été appliqué`,
      status: 'success',
      duration: 2000,
    })
  }

  return { 
    theme, 
    changeTheme,
    themeObject: createCustomTheme(theme)
  }
}
