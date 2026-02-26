import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Delete } from 'lucide-react'
import { useAuthStore } from '@/stores/authStore'
import type { UserRole } from '@/stores/authStore'
import { cn } from '@/lib/utils'

// ── Mock data ────────────────────────────────────────────────────────────────

const MOCK_STORES = [
  { id: 'store-1', name: 'Birmingham Bull Ring' },
  { id: 'store-2', name: 'London Oxford Street' },
  { id: 'store-3', name: 'Manchester Arndale' },
  { id: 'store-4', name: 'Leeds White Rose' },
]

const MOCK_STAFF = [
  { id: 'staff-1', name: 'Alex Thompson',  storeId: 'store-1', role: 'floor-lead' as UserRole },
  { id: 'staff-2', name: 'Jamie Collins',  storeId: 'store-1', role: 'staff'      as UserRole },
  { id: 'staff-3', name: 'Sarah Mitchell', storeId: 'store-1', role: 'manager'    as UserRole },
  { id: 'staff-4', name: 'Chris Patel',    storeId: 'store-2', role: 'staff'      as UserRole },
  { id: 'staff-5', name: 'Emma Davies',    storeId: 'store-2', role: 'floor-lead' as UserRole },
  { id: 'staff-6', name: 'Marcus Johnson', storeId: 'store-3', role: 'staff'      as UserRole },
  { id: 'staff-7', name: 'Priya Shah',     storeId: 'store-3', role: 'manager'    as UserRole },
  { id: 'staff-8', name: 'Tom Williams',   storeId: 'store-4', role: 'floor-lead' as UserRole },
  { id: 'staff-9', name: 'Lisa Brown',     storeId: 'store-4', role: 'staff'      as UserRole },
]

const CORRECT_PIN = '1234'

// ── Component ────────────────────────────────────────────────────────────────

export default function LoginPage() {
  const navigate = useNavigate()
  const { setAuth } = useAuthStore()

  const [loading, setLoading] = useState(true)
  const [selectedStore, setSelectedStore] = useState<(typeof MOCK_STORES)[0] | null>(null)
  const [selectedStaff, setSelectedStaff] = useState<(typeof MOCK_STAFF)[0] | null>(null)
  const [pin, setPin] = useState('')
  const [error, setError] = useState('')
  const [shake, setShake] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 700)
    return () => clearTimeout(t)
  }, [])

  const storeStaff = selectedStore
    ? MOCK_STAFF.filter(s => s.storeId === selectedStore.id)
    : []

  const step = !selectedStore ? 'store' : !selectedStaff ? 'user' : 'pin'

  // ── Handlers ──────────────────────────────────────────────────────────────

  const handleStoreSelect = (storeId: string) => {
    const store = MOCK_STORES.find(s => s.id === storeId)
    if (!store) return
    setSelectedStore(store)
    setSelectedStaff(null)
    setPin('')
    setError('')
  }

  const handleUserSelect = (userId: string) => {
    const staff = storeStaff.find(s => s.id === userId)
    if (!staff) return
    setSelectedStaff(staff)
    setPin('')
    setError('')
  }

  const handlePinDigit = (digit: string) => {
    if (pin.length >= 4) return
    const next = pin + digit
    setPin(next)
    setError('')

    if (next.length === 4) {
      if (next === CORRECT_PIN) {
        setAuth(
          { email: '', name: selectedStaff!.name, store: selectedStore!.name, role: selectedStaff!.role },
          'mock-jwt-token-' + Date.now()
        )
        navigate('/', { replace: true })
      } else {
        setError('Incorrect PIN. Please try again.')
        setShake(true)
        setTimeout(() => setShake(false), 600)
      }
    }
  }

  const handlePinDelete = () => {
    setPin(prev => prev.slice(0, -1))
    setError('')
  }

  const handleBack = () => {
    if (selectedStaff) {
      setSelectedStaff(null)
      setPin('')
      setError('')
    } else if (selectedStore) {
      setSelectedStore(null)
      setError('')
    }
  }

  // ── Loading ────────────────────────────────────────────────────────────────

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-navy to-primark-blue">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-white/30 border-t-white rounded-full animate-spin mx-auto mb-4" />
          <p className="text-white/80 text-sm">Loading...</p>
        </div>
      </div>
    )
  }

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-gradient-to-b from-navy to-primark-blue flex items-center justify-center p-4">
      <div className="w-full max-w-sm">

        {/* Branding */}
        <div className="text-center mb-8">
          <p className="font-primark text-primark-blue uppercase" style={{ fontSize: '42px', fontWeight: 500 }}>
            PRIMARK
          </p>
          <p className="text-white/70 text-sm mt-1">Pulse — Store Operations Platform</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8">

          {/* Step 1: Store */}
          {step === 'store' && (
            <div>
              <h2 className="text-xl font-bold text-navy mb-5 text-center">Select Your Location</h2>
              <select
                defaultValue=""
                onChange={e => e.target.value && handleStoreSelect(e.target.value)}
                className="w-full border-2 border-border-grey rounded-xl px-4 py-3 text-[15px] text-charcoal focus:outline-none focus:border-primark-blue focus:ring-2 focus:ring-primark-blue/20"
              >
                <option value="" disabled>Select a location…</option>
                {MOCK_STORES.map(s => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
            </div>
          )}

          {/* Step 2: User */}
          {step === 'user' && (
            <div>
              <div className="text-center mb-5">
                <h2 className="text-xl font-bold text-navy">Select Team Member</h2>
                <p className="text-sm text-mid-grey mt-1">{selectedStore!.name}</p>
              </div>
              <select
                defaultValue=""
                onChange={e => e.target.value && handleUserSelect(e.target.value)}
                className="w-full border-2 border-border-grey rounded-xl px-4 py-3 text-[15px] text-charcoal focus:outline-none focus:border-primark-blue focus:ring-2 focus:ring-primark-blue/20 mb-4"
              >
                <option value="" disabled>Select your name…</option>
                {storeStaff.map(u => (
                  <option key={u.id} value={u.id}>{u.name}</option>
                ))}
              </select>
              <button
                onClick={handleBack}
                className="w-full py-2.5 text-sm text-primark-blue hover:bg-primark-blue-light rounded-lg transition-colors"
              >
                ← Back to Store Selection
              </button>
            </div>
          )}

          {/* Step 3: PIN */}
          {step === 'pin' && (
            <div>
              <div className="text-center mb-5">
                <h2 className="text-xl font-bold text-navy">Enter Your PIN</h2>
                <p className="text-sm text-mid-grey mt-1">{selectedStaff!.name}</p>
              </div>

              {/* PIN dot indicators */}
              <div className="flex justify-center">
                <div className={cn('flex gap-5 mb-6', shake && 'animate-shake')}>
                  {[0, 1, 2, 3].map(i => (
                    <div
                      key={i}
                      className={cn(
                        'w-4 h-4 rounded-full border-2 transition-all duration-150',
                        i < pin.length ? 'bg-navy border-navy scale-110' : 'bg-transparent border-mid-grey'
                      )}
                    />
                  ))}
                </div>
              </div>

              {/* Number pad */}
              <div className="grid grid-cols-3 gap-2.5">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(n => (
                  <button
                    key={n}
                    onClick={() => handlePinDigit(String(n))}
                    className="flex items-center justify-center h-14 rounded-xl bg-light-grey hover:bg-border-grey active:scale-95 text-xl font-semibold text-navy transition-all"
                  >
                    {n}
                  </button>
                ))}
                <div />
                <button
                  onClick={() => handlePinDigit('0')}
                  className="flex items-center justify-center h-14 rounded-xl bg-light-grey hover:bg-border-grey active:scale-95 text-xl font-semibold text-navy transition-all"
                >
                  0
                </button>
                <button
                  onClick={handlePinDelete}
                  aria-label="Delete"
                  className="flex items-center justify-center h-14 rounded-xl bg-light-grey hover:bg-border-grey active:scale-95 transition-all"
                >
                  <Delete className="w-5 h-5 text-charcoal" />
                </button>
              </div>

              {error && (
                <p className="mt-4 text-sm text-danger text-center">{error}</p>
              )}

              <button
                onClick={handleBack}
                className="w-full mt-4 py-2.5 text-sm text-primark-blue hover:bg-primark-blue-light rounded-lg transition-colors"
              >
                ← Back to Team Selection
              </button>
            </div>
          )}

        </div>

        {/* Footer */}
        <p className="text-center text-white/50 text-xs mt-6">
          Internal use only • Staff members only
        </p>
      </div>
    </div>
  )
}
