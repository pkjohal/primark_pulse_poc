import { useEffect, useRef, useState } from 'react'
import { BrowserMultiFormatReader, NotFoundException } from '@zxing/library'
import { Camera, CameraOff } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

interface BarcodeScannerProps {
  onScan: (barcode: string) => void
  className?: string
}

export function BarcodeScanner({ onScan, className }: BarcodeScannerProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const readerRef = useRef<BrowserMultiFormatReader | null>(null)
  const [isScanning, setIsScanning] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [lastScanned, setLastScanned] = useState<string | null>(null)

  const startScanning = async () => {
    if (!videoRef.current) return

    try {
      setError(null)
      const reader = new BrowserMultiFormatReader()
      readerRef.current = reader

      // Get video devices and prefer back camera on mobile
      const devices = await navigator.mediaDevices.enumerateDevices()
      const videoDevices = devices.filter(d => d.kind === 'videoinput')
      const backCamera = videoDevices.find(d =>
        d.label.toLowerCase().includes('back') ||
        d.label.toLowerCase().includes('rear') ||
        d.label.toLowerCase().includes('environment')
      )

      await reader.decodeFromVideoDevice(
        backCamera?.deviceId || null, // Prefer back camera, fallback to default
        videoRef.current,
        (result, err) => {
          if (result) {
            const barcode = result.getText()
            // Prevent duplicate scans within short interval
            if (barcode !== lastScanned) {
              setLastScanned(barcode)
              onScan(barcode)
              // Reset last scanned after 2 seconds to allow rescanning same barcode
              setTimeout(() => setLastScanned(null), 2000)
            }
          }
          if (err && !(err instanceof NotFoundException)) {
            // NotFoundException is normal when no barcode is in view
            console.error('Scan error:', err)
          }
        }
      )

      setIsScanning(true)
    } catch (err) {
      console.error('Failed to start scanner:', err)
      setError('Camera access denied. Please grant camera permission or use manual entry.')
      setIsScanning(false)
    }
  }

  const stopScanning = () => {
    if (readerRef.current) {
      readerRef.current.reset()
      readerRef.current = null
    }
    setIsScanning(false)
  }

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopScanning()
    }
  }, [])

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
      {/* Camera Viewfinder */}
      <Card className="relative overflow-hidden aspect-[4/3] bg-slate-900">
        <video
          ref={videoRef}
          className={cn(
            'absolute inset-0 w-full h-full object-cover',
            !isScanning && 'hidden'
          )}
          playsInline
          muted
        />

        {/* Overlay when not scanning */}
        {!isScanning && (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
            <Camera className="w-12 h-12 mb-3 opacity-60" />
            <p className="text-sm opacity-80">Tap to start scanning</p>
          </div>
        )}

        {/* Scanning Frame Overlay */}
        {isScanning && (
          <div className="absolute inset-0 pointer-events-none">
            {/* Corner brackets */}
            <div className="absolute top-1/4 left-1/4 w-12 h-12 border-l-2 border-t-2 border-primary" />
            <div className="absolute top-1/4 right-1/4 w-12 h-12 border-r-2 border-t-2 border-primary" />
            <div className="absolute bottom-1/4 left-1/4 w-12 h-12 border-l-2 border-b-2 border-primary" />
            <div className="absolute bottom-1/4 right-1/4 w-12 h-12 border-r-2 border-b-2 border-primary" />

            {/* Scanning line animation */}
            <div className="absolute left-1/4 right-1/4 top-1/2 h-0.5 bg-primary/80 animate-pulse" />
          </div>
        )}
      </Card>

      {/* Control Button */}
      <Button
        onClick={isScanning ? stopScanning : startScanning}
        variant={isScanning ? 'outline' : 'default'}
        className="w-full"
      >
        <Camera className="w-4 h-4 mr-2" />
        {isScanning ? 'Stop Scanning' : 'Start Camera'}
      </Button>
    </div>
  )
}
