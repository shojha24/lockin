"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Download, Home, Clock } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { onAuthStateChanged } from "firebase/auth";
import { auth } from '../firebase'
import { getFirestore, doc, onSnapshot, getDoc, collection, query, orderBy, limit } from "firebase/firestore"

interface DashboardProps {
  profileImage: string
  duration: number
  task: string
}

export default function Dashboard({ profileImage, duration, task }: DashboardProps) {
  const router = useRouter()
  const [timeLeft, setTimeLeft] = useState(duration * 60) // Convert minutes to seconds
  const [activities, setActivities] = useState<string[]>([])
  const [sessionEnded, setSessionEnded] = useState(false)
  const [showEndDialog, setShowEndDialog] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  const db = getFirestore();

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timer)
          setSessionEnded(true)
          setShowEndDialog(true)
          return 0
        }
        return prevTime - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    let unsubscribeSession: (() => void) | null = null;
    let unsubscribeAuth: (() => void) | null = null;
  
    const fetchAndListen = async () => {
      setIsLoading(true);
      
      unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
        if (!user) {
          console.error("No user logged in.");
          setIsLoading(false);
          return;
        }
  
        try {
          console.log("User logged in:", user.uid);
  
          const userDocRef = doc(db, "users", user.uid);
          const userDocSnap = await getDoc(userDocRef);
          
          if (!userDocSnap.exists()) {
            console.error("No user document found.");
            setIsLoading(false);
            return;
          }
          
          // Get the user's sessions data
          const userData = userDocSnap.data();
          
          // Check if sessions is an array in the user document
          if (userData.sessions && Array.isArray(userData.sessions)) {
            // Get the most recent session (last item in the array)
            const sessionData = userData.sessions.length > 0 ? 
              userData.sessions[userData.sessions.length - 1] : null;
              
            // Set up listener on the user document to get real-time updates
            unsubscribeSession = onSnapshot(userDocRef, (doc) => {
              const updatedUserData = doc.data();
              if (updatedUserData?.sessions && Array.isArray(updatedUserData.sessions)) {
                const latestSession = updatedUserData.sessions.length > 0 ? 
                  updatedUserData.sessions[updatedUserData.sessions.length - 1] : null;
                
                if (latestSession?.notes) {
                  const newActivities: string[] = [];
                  for (let i = 0; i < latestSession.notes.length; i += 2) {
                    const timestamp = latestSession.notes[i];
                    const description = latestSession.notes[i + 1];
                    newActivities.push(`[${timestamp}] ${description}`);
                  }
                  setActivities(newActivities.reverse());
                }
              }
              setIsLoading(false);
            });
          } 
          // If sessions is a subcollection instead of an array
          else {
            // Query the sessions subcollection to get the most recent session
            const sessionsRef = collection(db, "users", user.uid, "sessions");
            const q = query(sessionsRef, orderBy("createdAt", "desc"), limit(1));
            
            unsubscribeSession = onSnapshot(q, (querySnapshot) => {
              if (!querySnapshot.empty) {
                const latestSession = querySnapshot.docs[0].data();
                
                if (latestSession.notes) {
                  const newActivities: string[] = [];
                  for (let i = 0; i < latestSession.notes.length; i += 2) {
                    const timestamp = latestSession.notes[i];
                    const description = latestSession.notes[i + 1];
                    newActivities.push(`[${timestamp}] ${description}`);
                  }
                  setActivities(newActivities.reverse());
                }
              }
              setIsLoading(false);
            });
          }
        } catch (error) {
          console.error("Error setting up session listener:", error);
          setIsLoading(false);
        }
      });
    };
  
    fetchAndListen();
  
    return () => {
      if (unsubscribeAuth) unsubscribeAuth();
      if (unsubscribeSession) unsubscribeSession();
    };
  }, []);
  
  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const remainingSeconds = seconds % 60
    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`
  }

  const progressPercentage = ((duration * 60 - timeLeft) / (duration * 60)) * 100

  const downloadActivities = () => {
    // Create session summary
    const date = new Date().toLocaleDateString()
    const startTime = new Date(Date.now() - duration * 60 * 1000).toLocaleTimeString()
    const endTime = new Date().toLocaleTimeString()
    const sessionSummary = [
      "LOCK IN - SESSION REPORT",
      "=======================",
      `Date: ${date}`,
      `Duration: ${formatDuration(duration)}`,
      `Time: ${startTime} - ${endTime}`,
      `Task: ${task}`,
      "",
      "ACTIVITY LOG:",
      "-------------",
      ...activities.reverse(),
    ].join("\n")

    // Create and download the file
    const blob = new Blob([sessionSummary], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = `LOCKIN_Session_${date.replace(/\//g, "-")}.txt`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const remainingMinutes = minutes % 60
    return `${hours}h ${remainingMinutes}m`
  }

  const goToHome = () => {
    router.push("/")
  }

  return (
    <>
      <div className="space-y-6">
        <Card className={`bg-gray-900 border-gray-800 ${sessionEnded ? "border-red-500" : ""}`}>
          <CardHeader className="flex flex-row items-center space-x-4 pb-2">
            <img
              src={profileImage || "/placeholder.svg"}
              alt="Profile"
              className="w-16 h-16 rounded-full object-cover"
            />
            <div>
              <CardTitle className="text-2xl font-bold">Your Session</CardTitle>
              <div className="flex items-center">
                <Clock className="mr-2 h-4 w-4 text-gray-400" />
                <p className={`${sessionEnded ? "text-red-500 font-bold" : "text-gray-400"}`}>
                  {sessionEnded ? "Session Completed!" : `Time Remaining: ${formatTime(timeLeft)}`}
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Progress
              value={progressPercentage}
              className={`h-2 mt-2 ${sessionEnded ? "bg-gray-800" : ""}`}
              indicatorClassName={sessionEnded ? "bg-red-500" : undefined}
            />
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle className="text-xl font-bold">Current Task</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-300">{task}</p>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle className="text-xl font-bold">Recent Activities</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <p className="text-gray-400">Loading activities...</p>
            ) : (
              <ul className="space-y-2">
                {activities.length > 0 ? (
                  activities.map((activity, index) => (
                    <li key={index} className="text-sm text-gray-300">
                      {activity}
                    </li>
                  ))
                ) : (
                  <p className="text-gray-400">No activities recorded yet.</p>
                )}
              </ul>
            )}
          </CardContent>
          {sessionEnded && (
            <CardFooter className="border-t border-gray-800 pt-4">
              <Button onClick={downloadActivities} className="w-full">
                <Download className="mr-2 h-4 w-4" />
                Download Activity Log
              </Button>
            </CardFooter>
          )}
        </Card>
      </div>

      <Dialog open={showEndDialog} onOpenChange={setShowEndDialog}>
        <DialogContent className="bg-gray-900 border-gray-800 text-white">
          <DialogHeader>
            <DialogTitle className="text-xl">Session Complete!</DialogTitle>
            <DialogDescription className="text-gray-400">
              Your LOCK IN session has ended. What would you like to do next?
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm text-gray-300 mb-2">
              You worked on: <span className="font-medium text-white">{task}</span>
            </p>
            <p className="text-sm text-gray-300">
              Session duration: <span className="font-medium text-white">{formatDuration(duration)}</span>
            </p>
          </div>
          <DialogFooter className="flex flex-col sm:flex-row gap-2">
            <Button variant="outline" onClick={goToHome} className="sm:flex-1">
              <Home className="mr-2 h-4 w-4" />
              Return Home
            </Button>
            <Button onClick={downloadActivities} className="sm:flex-1 bg-red-600 hover:bg-red-700">
              <Download className="mr-2 h-4 w-4" />
              Download Report
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
