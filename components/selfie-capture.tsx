/*"use client"

import { useRef, useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Camera, Download, RefreshCw } from "lucide-react"

export default function SelfieCapture() {
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
      stream.getTracks().forEach((track) => track.stop())
      setStream(null)
    }
  }

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current
      const canvas = canvasRef.current
      const context = canvas.getContext("2d")

      // Set canvas dimensions to match video
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight

      // Draw the current video frame to the canvas
      context?.drawImage(video, 0, 0, canvas.width, canvas.height)

      // Convert canvas to data URL
      const imageDataUrl = canvas.toDataURL("image/png")
      setCapturedImage(imageDataUrl)

      // Stop the camera after capturing
      stopCamera()
    }
  }

  const retakePhoto = () => {
    setCapturedImage(null)
    startCamera()
  }

  const downloadImage = () => {
    if (capturedImage) {
      const link = document.createElement("a")
      link.href = capturedImage
      link.download = `selfie-${new Date().toISOString()}.png`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }

  useEffect(() => {
    // Start camera when component mounts
    startCamera()

    // Clean up when component unmounts
    return () => {
      stopCamera()
    }
  }, [])

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        {capturedImage ? (
          <div className="relative">
            <img src={capturedImage || "/placeholder.svg"} alt="Captured selfie" className="w-full h-auto" />
            <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
              <div className="p-4 flex gap-2">
                <Button onClick={retakePhoto} variant="secondary">
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Retake
                </Button>
                <Button onClick={downloadImage}>
                  <Download className="mr-2 h-4 w-4" />
                  Save
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="relative">
            {isCameraLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/10 z-10">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
              </div>
            )}
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-auto"
              style={{ display: stream ? "block" : "none" }}
            />
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
                  className="rounded-full h-14 w-14 flex items-center justify-center"
                >
                  <Camera className="h-6 w-6" />
                  <span className="sr-only">Take Photo</span>
                </Button>
              </div>
            )}
          </div>
        )}
        { "Hidden canvas for capturing the image" }
        <canvas ref={canvasRef} className="hidden" />
      </CardContent>
    </Card>
  )
} */