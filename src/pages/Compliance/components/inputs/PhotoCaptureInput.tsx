import { useEffect, useRef, useState } from 'react'
import { Camera, CameraOff, X, RotateCcw } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

interface PhotoCaptureInputProps {
  value?: string | null
  onChange: (photoDataUrl: string) => void
  onClear?: () => void
  disabled?: boolean
  className?: string
}

export function PhotoCaptureInput({
  value,
  onChange,
  onClear,
  disabled,
  className,
}: PhotoCaptureInputProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const [isCameraActive, setIsCameraActive] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const startCamera = async () => {
    if (!videoRef.current) return

    try {
      setError(null)
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'environment', // Prefer rear camera
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
      })

      videoRef.current.srcObject = stream
      streamRef.current = stream
      setIsCameraActive(true)
    } catch (err) {
      console.error('Failed to access camera:', err)
      setError('Camera access denied. Please grant camera permission.')
      setIsCameraActive(false)
    }
  }

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop())
      streamRef.current = null
    }
    setIsCameraActive(false)
  }

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return

    const video = videoRef.current
    const canvas = canvasRef.current

    canvas.width = video.videoWidth
    canvas.height = video.videoHeight

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    ctx.drawImage(video, 0, 0)
    const dataUrl = canvas.toDataURL('image/jpeg', 0.8)

    onChange(dataUrl)
    stopCamera()
  }

  const clearPhoto = () => {
    onClear?.()
  }

  const retakePhoto = () => {
    clearPhoto()
    startCamera()
  }

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopCamera()
    }
  }, [])

  // If we have a captured photo, show it
  if (value) {
    return (
      <div className={cn('space-y-3', className)}>
        <Card className="relative overflow-hidden aspect-[4/3]">
          <img
            src={value}
            alt="Captured photo"
            className="absolute inset-0 w-full h-full object-cover"
          />
          {!disabled && (
            <button
              type="button"
              onClick={clearPhoto}
              className="absolute top-2 right-2 w-8 h-8 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </Card>
        {!disabled && (
          <Button
            variant="outline"
            onClick={retakePhoto}
            className="w-full"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Retake Photo
          </Button>
        )}
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <Card className={cn('p-6 text-center', className)}>
        <CameraOff className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
        <p className="text-sm text-muted-foreground mb-4">{error}</p>
        <Button variant="outline" onClick={() => setError(null)}>
          Try Again
        </Button>
      </Card>
    )
  }

  return (
    <div className={cn('space-y-3', className)}>
      {/* Hidden canvas for photo capture */}
      <canvas ref={canvasRef} className="hidden" />

      {/* Camera viewfinder or placeholder */}
      <Card className="relative overflow-hidden aspect-[4/3] bg-slate-900">
        <video
          ref={videoRef}
          className={cn(
            'absolute inset-0 w-full h-full object-cover',
            !isCameraActive && 'hidden'
          )}
          playsInline
          muted
          autoPlay
        />

        {/* Overlay when camera is not active */}
        {!isCameraActive && (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
            <Camera className="w-12 h-12 mb-3 opacity-60" />
            <p className="text-sm opacity-80">Tap to take photo</p>
          </div>
        )}

        {/* Frame overlay when camera is active */}
        {isCameraActive && (
          <div className="absolute inset-0 pointer-events-none">
            {/* Corner brackets */}
            <div className="absolute top-4 left-4 w-8 h-8 border-l-2 border-t-2 border-white/60" />
            <div className="absolute top-4 right-4 w-8 h-8 border-r-2 border-t-2 border-white/60" />
            <div className="absolute bottom-4 left-4 w-8 h-8 border-l-2 border-b-2 border-white/60" />
            <div className="absolute bottom-4 right-4 w-8 h-8 border-r-2 border-b-2 border-white/60" />
          </div>
        )}
      </Card>

      {/* Control buttons */}
      {isCameraActive ? (
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={stopCamera}
            className="flex-1"
            disabled={disabled}
          >
            Cancel
          </Button>
          <Button
            onClick={capturePhoto}
            className="flex-1"
            disabled={disabled}
          >
            <Camera className="w-4 h-4 mr-2" />
            Capture
          </Button>
        </div>
      ) : (
        <Button
          onClick={startCamera}
          variant="outline"
          className="w-full"
          disabled={disabled}
        >
          <Camera className="w-4 h-4 mr-2" />
          Open Camera
        </Button>
      )}
    </div>
  )
}
