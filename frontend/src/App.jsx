import { useState, useEffect, useRef } from 'react'

function App() {
  const [players, setPlayers] = useState(8)
  const [roles, setRoles] = useState({
    Percival: true,
    Morgana: true,
    Mordred: false,
    Oberon: true
  })
  
  const [isNarrating, setIsNarrating] = useState(false)
  const [script, setScript] = useState([])
  const [currentStep, setCurrentStep] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  
  const timerRef = useRef(null)

  const handleRoleToggle = (role) => {
    setRoles(prev => ({
      ...prev,
      [role]: !prev[role]
    }))
  }

  const startNarration = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch('http://localhost:8000/api/generate-script', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(roles)
      })
      
      if (!response.ok) throw new Error("Failed to connect to Python backend")
      
      const data = await response.json()
      setScript(data.script)
      setIsNarrating(true)
      setCurrentStep(0)
    } catch (err) {
      setError(err.message + ". Make sure the backend is running.")
    } finally {
      setLoading(false)
    }
  }
  
  useEffect(() => {
    if (isNarrating && script.length > 0 && currentStep < script.length) {
      const step = script[currentStep]
      
      // Speak the text
      const utterance = new SpeechSynthesisUtterance(step.text)
      utterance.rate = 0.9 // slightly slower, dramatic
      utterance.pitch = 0.9 // slightly deeper
      
      // When speech ends, wait for the pause duration before going to next step
      utterance.onend = () => {
        if (step.pause > 0) {
          timerRef.current = setTimeout(() => {
            setCurrentStep(prev => prev + 1)
          }, step.pause * 1000)
        } else {
          setCurrentStep(prev => prev + 1)
        }
      }
      
      window.speechSynthesis.speak(utterance)
      
      return () => {
        window.speechSynthesis.cancel()
        if (timerRef.current) clearTimeout(timerRef.current)
      }
    }
    
    // When done
    if (isNarrating && currentStep >= script.length) {
      setIsNarrating(false)
    }
  }, [isNarrating, currentStep, script])
  
  const cancelNarration = () => {
    window.speechSynthesis.cancel()
    if (timerRef.current) clearTimeout(timerRef.current)
    setIsNarrating(false)
    setCurrentStep(0)
  }

  if (isNarrating) {
    const isDone = currentStep >= script.length;
    return (
      <div className="glass-panel narration-screen">
        <h1>Avalon Night</h1>
        <div className={`current-text ${!isDone ? 'pulse' : ''}`}>
          {isDone ? "Narration Complete" : script[currentStep]?.text}
        </div>
        <button onClick={cancelNarration}>
          {isDone ? "Return to Setup" : "Stop Narration"}
        </button>
      </div>
    )
  }

  return (
    <div className="glass-panel">
      <h1>Avalon Narrator</h1>
      
      <div className="form-group">
        <label>Number of Players</label>
        <select value={players} onChange={(e) => setPlayers(Number(e.target.value))}>
          {[5, 6, 7, 8, 9, 10].map(n => (
            <option key={n} value={n}>{n} Players</option>
          ))}
        </select>
      </div>
      
      <div className="form-group">
        <label>Optional Roles</label>
        <div className="checkbox-grid">
          {Object.entries(roles).map(([role, isSelected]) => (
            <label key={role} className="checkbox-label">
              <input 
                type="checkbox" 
                checked={isSelected}
                onChange={() => handleRoleToggle(role)}
              />
              {role}
            </label>
          ))}
        </div>
      </div>
      
      {error && <p style={{color: '#ef4444', textAlign: 'center'}}>{error}</p>}
      
      <button onClick={startNarration} disabled={loading}>
        {loading ? 'Consulting the Spirits...' : 'Begin Narration'}
      </button>
    </div>
  )
}

export default App
