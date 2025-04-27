"use client"

import { useRef, useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Camera, RefreshCw } from "lucide-react"

interface SelfieCaptureStepProps {
  onCapture: (imageUrl: string) => void
}

export default function SelfieCaptureStep({ onCapture }: SelfieCaptureStepProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [stream, setStream] = useState<MediaStream | null>(null)
  const [capturedImage, setCapturedImage] = useState<string | null>(null)
  const [cameraPermission, setCameraPermission] = useState<boolean | null>(null)
  const [isCameraLoading, setIsCameraLoading] = useState(false)

  const startCamera = async () => {
    try {
      setIsCameraLoading(true)
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user" },
        audio: false,
      })

      setStream(mediaStream)
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream
      }
      setCameraPermission(true)
    } catch (error) {
      console.error("Error accessing camera:", error)
      setCameraPermission(false)
    } finally {
      setIsCameraLoading(false)
    }
  }

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => {
        track.stop()
        track.enabled = false
      })
      if (videoRef.current) {
        videoRef.current.srcObject = null
      }
      setStream(null)
    }
  }

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current
      const canvas = canvasRef.current
      const context = canvas.getContext("2d")

      canvas.width = video.videoWidth
      canvas.height = video.videoHeight
      context?.drawImage(video, 0, 0, canvas.width, canvas.height)

      const imageDataUrl = canvas.toDataURL("image/png")
      setCapturedImage(imageDataUrl)
      stopCamera()
    }
  }

  const retakePhoto = () => {
    setCapturedImage(null)
    startCamera()
  }
  
  const handleContinue = () => {
    onCapture(capturedImage!)
    stopCamera()
  }

  useEffect(() => {
    startCamera()
    return () => {
      stopCamera()
    }
  }, [])

  return (
    <Card className="overflow-hidden bg-gray-900 border-gray-800">
      <CardContent className="p-0">
        {capturedImage ? (
          <div className="relative">
            <img src={capturedImage || "/placeholder.svg"} alt="Captured selfie" className="w-full h-auto" />
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
              <Button onClick={retakePhoto} variant="outline" className="mr-2">
                <RefreshCw className="mr-2 h-4 w-4" />
                Retake
              </Button>
              <Button onClick={handleContinue}>Continue</Button>
            </div>
          </div>
        ) : (
          <div className="relative">
            {isCameraLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-10">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
              </div>
            )}
            <div className="aspect-[3/4] bg-black">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
                style={{ display: stream ? "block" : "none" }}
              />
            </div>
            {cameraPermission === false && (
              <div className="p-8 text-center">
                <p className="text-red-500 mb-4">Camera access denied or not available</p>
                <Button onClick={startCamera}>Try Again</Button>
              </div>
            )}
            {stream && (
              <div className="absolute bottom-0 left-0 right-0 p-4 flex justify-center">
                <Button
                  onClick={capturePhoto}
                  size="lg"
                  className="rounded-full h-16 w-16 flex items-center justify-center bg-red-600 hover:bg-red-700 border-none"
                >
                  <Camera className="h-8 w-8" />
                  <span className="sr-only">Take Photo</span>
                </Button>
              </div>
            )}
          </div>
        )}
        <canvas ref={canvasRef} className="hidden" />
      </CardContent>
    </Card>
  )
}