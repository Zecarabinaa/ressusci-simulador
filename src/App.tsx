import { Routes, Route } from 'react-router-dom'
import SafetyStrip from './components/SafetyStrip'
import Topbar from './components/Topbar'
import AppFooter from './components/AppFooter'
import Home from './pages/Home'
import Setup from './pages/Setup'
import Simulation from './pages/Simulation'
import Debrief from './pages/Debrief'
import Library from './pages/Library'
import { SimulationProvider } from './context/SimulationContext'

export default function App() {
  return (
    <SimulationProvider>
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <SafetyStrip />
        <Topbar />
        <div style={{ flex: 1 }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/setup/:caseId" element={<Setup />} />
            <Route path="/simulacao/:caseId" element={<Simulation />} />
            <Route path="/debrief" element={<Debrief />} />
            <Route path="/biblioteca" element={<Library />} />
          </Routes>
        </div>
        <AppFooter />
      </div>
    </SimulationProvider>
  )
}
