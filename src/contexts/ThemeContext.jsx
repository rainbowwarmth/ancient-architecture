import { createContext, useState, useEffect, useContext } from 'react'

const ThemeContext = createContext()

export const useTheme = () => useContext(ThemeContext)

export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    // 从本地存储读取主题设置
    const savedTheme = localStorage.getItem('theme')
    if (savedTheme) {
      return savedTheme === 'dark'
    }
    // 检测系统偏好
    return window.matchMedia('(prefers-color-scheme: dark)').matches
  })

  // 自动根据时间切换主题
  useEffect(() => {
    const checkTime = () => {
      const hour = new Date().getHours()
      // 晚上7点到早上7点为深色模式
      if (hour >= 19 || hour < 7) {
        setIsDarkMode(true)
      } else {
        setIsDarkMode(false)
      }
    }

    // 初始检查
    checkTime()

    // 每小时检查一次
    const interval = setInterval(checkTime, 60 * 60 * 1000)

    return () => clearInterval(interval)
  }, [])

  // 切换主题
  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode)
  }

  // 保存主题到本地存储
  useEffect(() => {
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light')
    // 更新文档根元素的类名
    if (isDarkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [isDarkMode])

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}
