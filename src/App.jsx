import React, { useState } from 'react'
import LandingPage from './pages/LandingPage.jsx'
import PlatformApp from './PlatformApp.jsx'

export default function App() {
  const [page, setPage] = useState('landing') // landing | platform

  if (page === 'platform') {
    return <PlatformApp onBack={() => setPage('landing')} />
  }

  return <LandingPage onEnter={() => setPage('platform')} />
}
