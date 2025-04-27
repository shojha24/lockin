"use client"

import { useState } from "react"
import SelfieCaptureStep from "@/components/selfie-capture-step"
import TimerDialog from "@/components/timer-dialog"
import WorkOnDialog from "@/components/work-on-dialog"
import Dashboard from "@/components/dashboard"
import { auth } from '../firebase'
import { getFirestore, doc, updateDoc, arrayUnion } from "firebase/firestore"

export default function SetupProcess() {
  const [setupStep, setSetupStep] = useState<"selfie" | "timer" | "workOn" | "dashboard">("selfie")
  const [capturedImage, setCapturedImage] = useState<string | null>(null)
  const [timerDuration, setTimerDuration] = useState<number>(0)
  const [workOnTask, setWorkOnTask] = useState<string>("")

  const handleSelfieCaptured = (imageUrl: string) => {
    setCapturedImage(imageUrl)
    setSetupStep("timer")
  }

  const handleTimerSet = (duration: number) => {
    setTimerDuration(duration)
    setSetupStep("workOn")
  }

  const handleWorkOnSet = async (task: string) => {
    setWorkOnTask(task)
    setSetupStep("dashboard")
    const db = getFirestore()
    const user = auth.currentUser;
    if(user) {
      try {
        const session = {
          task: task,
          timestamp: new Date().toISOString(),
          duration: timerDuration * 60,
          emotionAlerts: 0,
          postureAlerts: 0,
          notes: []
        };

        const userRef = doc(db, "users", user.uid);

        await updateDoc(userRef, {
          sessions: arrayUnion(session),
        });

        console.log("session added successfully")
      } catch (error) {
        console.error("Error adding session:", error);
      }
    } else {
      console.error("User is not authenticated")
    }
  }

  return (
    <div className="flex flex-col gap-8 pb-20">
      <section className="min-h-[calc(100vh-200px)] flex flex-col items-center justify-center">
        <div className="w-full max-w-md mx-auto">
          {setupStep === "selfie" && (
            <>
              <div className="mb-8 text-center">
                <h3 className="text-xl font-bold mb-2">Take Your Profile Picture</h3>
                <p className="text-gray-400">Take a clear selfie to set up your profile</p>
              </div>
              <SelfieCaptureStep onCapture={handleSelfieCaptured} />
            </>
          )}

          {setupStep === "timer" && capturedImage && <TimerDialog onTimerSet={handleTimerSet} />}

          {setupStep === "workOn" && capturedImage && <WorkOnDialog onWorkOnSet={handleWorkOnSet} />}

          {setupStep === "dashboard" && capturedImage && (
            <Dashboard profileImage={capturedImage} duration={timerDuration} task={workOnTask} />
          )}
        </div>
      </section>
    </div>
  )
}
