/*"use client"

import { useRef, useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle } from "lucide-react"

interface LiveFootageStepProps {
  profileImage: string
}

export default function LiveFootageStep({ profileImage }: LiveFootageStepProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [stream, setStream] = useState<MediaStream | null>(null)
  const [cameraPermission, setCameraPermission] = useState<boolean | null>(null)
  const [isCameraLoading, setIsCameraLoading] = useState(false)
  const [isVerifying, setIsVerifying] = useState(false)
  const [isVerified, setIsVerified] = useState(false)

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

  const verifyIdentity = () => {
    setIsVerifying(true)

    // Simulate verification process
    setTimeout(() => {
      setIsVerifying(false)
      setIsVerified(true)
    }, 3000)
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
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-gray-700">
          <img src={profileImage || "/placeholder.svg"} alt="Profile" className="w-full h-full object-cover" />
        </div>
        <div>
          <h3 className="font-medium">Profile Photo</h3>
          <p className="text-sm text-gray-400">Captured successfully</p>
        </div>
      </div>

      <Card className="overflow-hidden bg-gray-900 border-gray-800">
        <CardContent className="p-0">
          <div className="relative">
            {isCameraLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-10">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
              </div>
            )}
            <div className="aspect-video bg-black">
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

            {isVerifying && (
              <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mb-4"></div>
                <p>Verifying your identity...</p>
              </div>
            )}

            {isVerified && (
              <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center">
                <CheckCircle className="h-16 w-16 text-green-500 mb-4" />
                <p className="text-xl font-bold mb-2">Identity Verified</p>
                <p className="text-gray-400 mb-4">You're all set to use LOCK IN</p>
                <Button>Continue to Dashboard</Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {!isVerifying && !isVerified && stream && (
        <div className="flex justify-center mt-4">
          <Button onClick={verifyIdentity} className="bg-red-600 hover:bg-red-700 text-white px-8 py-6 text-lg">
            Verify Identity
          </Button>
        </div>
      )}

      <div className="text-sm text-gray-400 text-center">
        <p>Please look directly at the camera and ensure your face is clearly visible</p>
      </div>
    </div>
  )
}
*/