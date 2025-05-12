"use client"

import { useEffect, useState } from "react"
import Link from "next/link"

export default function DiagnosePage() {
  const [apiStatus, setApiStatus] = useState<string>("Testing...")
  const [dbStatus, setDbStatus] = useState<string>("Testing...")
  const [errorDetails, setErrorDetails] = useState<string | null>(null)
  const [dbTestResults, setDbTestResults] = useState<any>(null)
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [fixAttempted, setFixAttempted] = useState(false)
  useEffect(() => {
    // Test the alumni API
    async function testAlumniApi() {
      try {
        const response = await fetch('/api/alumni?limit=1')
        if (response.ok) {
          const data = await response.json()
          setApiStatus(`Success! API returned ${data.alumni?.length || 0} alumni.`)
        } else {
          const errorText = await response.text()
          setApiStatus(`Failed with status: ${response.status}`)
          setErrorDetails(errorText)
        }
      } catch (err) {
        setApiStatus("Error during fetch")
        setErrorDetails(err instanceof Error ? err.message : String(err))
      }
    }

    // Test database connection directly
    async function testDbConnection() {
      try {
        const response = await fetch('/api/test-db')
        if (response.ok) {
          const data = await response.json()
          setDbStatus(`Success! Database connection working.`)
          setDbTestResults(data)
          
          if (data.currentUser) {
            setCurrentUser(data.currentUser)
          }
        } else {
          const errorText = await response.text()
          setDbStatus(`Failed with status: ${response.status}`)
          setErrorDetails(prev => (prev || "") + "\n\nDatabase Test Error: " + errorText)
        }
      } catch (err) {
        setDbStatus("Error during database test")
        setErrorDetails(prev => (prev || "") + "\n\nDatabase Test Error: " + 
          (err instanceof Error ? err.message : String(err)))
      }
    }

    testAlumniApi()
    testDbConnection()
  }, [fixAttempted])

  const approveCurrentUser = async () => {
    if (!currentUser?.sessionInfo?.id) {
      alert("Cannot determine your user ID. Please make sure you're logged in.")
      return
    }
    
    try {
      const response = await fetch(`/api/admin/approve-user?id=${currentUser.sessionInfo.id}`, {
        method: 'POST'
      })
      
      if (response.ok) {
        const data = await response.json()
        alert(`Your status has been updated to '${data.user.status}'. You must sign out and sign back in for the changes to take effect.`)
        setFixAttempted(true)
      } else {
        const errorText = await response.text()
        alert(`Failed to update status: ${errorText}`)
      }
    } catch (err) {
      alert(`Error: ${err instanceof Error ? err.message : String(err)}`)
    }
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">API Diagnostics</h1>
      
      <div className="mb-4">
        <h2 className="text-xl font-semibold">Alumni API Status</h2>
        <p className={`mt-2 ${apiStatus.includes("Success") ? "text-green-600" : "text-red-600"}`}>
          {apiStatus}
        </p>
      </div>

      <div className="mb-4">
        <h2 className="text-xl font-semibold">Database Connection Status</h2>
        <p className={`mt-2 ${dbStatus.includes("Success") ? "text-green-600" : "text-red-600"}`}>
          {dbStatus}
        </p>
      </div>

      {dbTestResults && (
        <div className="p-4 bg-gray-100 rounded mb-4">
          <h3 className="font-semibold">Database Test Results:</h3>
          <div className="mt-2">
            <p>Total Users: {dbTestResults.userCount}</p>
            
            {dbTestResults.statusCounts && (
              <div className="mt-2">
                <p className="font-semibold">User Status Counts:</p>
                <ul className="list-disc pl-5">
                  {dbTestResults.statusCounts.map((item: any, i: number) => (
                    <li key={i}>{item.status}: {item.count}</li>
                  ))}
                </ul>
              </div>
            )}
            
            {dbTestResults.sampleUsers && dbTestResults.sampleUsers.length > 0 && (
              <div className="mt-4">
                <p className="font-semibold">Sample User Data:</p>
                <pre className="bg-gray-200 p-2 rounded mt-1 text-sm overflow-auto">
                  {JSON.stringify(dbTestResults.sampleUsers, null, 2)}
                </pre>
              </div>
            )}
          </div>
        </div>
      )}

      {errorDetails && (
        <div className="p-4 bg-gray-100 rounded mb-4">
          <h3 className="font-semibold">Error Details:</h3>
          <pre className="mt-2 whitespace-pre-wrap text-sm">{errorDetails}</pre>
        </div>      )}
      
      {currentUser && (
        <div className="p-4 bg-gray-100 rounded mb-4">
          <h3 className="font-semibold">Current User Information:</h3>
          <div className="mt-2">
            <p><strong>Status in Token:</strong> {currentUser.tokenInfo?.status || 'Unknown'}</p>
            <p><strong>Status in Database:</strong> {currentUser.databaseInfo?.status || 'Unknown'}</p>
            <p><strong>User ID:</strong> {currentUser.sessionInfo?.id || 'Unknown'}</p>
            
            {currentUser.databaseInfo && currentUser.tokenInfo && 
              currentUser.databaseInfo.status !== currentUser.tokenInfo.status && (
                <div className="mt-3 p-3 bg-yellow-100 rounded">
                  <p className="text-orange-700 font-semibold">Status Mismatch Detected</p>
                  <p className="mt-1">Your database status ({currentUser.databaseInfo.status}) does not match 
                  your token status ({currentUser.tokenInfo.status}). This can cause authentication issues.</p>
                  <button 
                    onClick={approveCurrentUser}
                    className="mt-2 px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    Approve My Account
                  </button>
                </div>
              )
            }
            
            {currentUser.tokenInfo?.status !== 'approved' && (
              <div className="mt-3">
                <button 
                  onClick={approveCurrentUser}
                  className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                >
                  Fix: Set My Status to Approved
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-2">Troubleshooting Tips</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li>Make sure you are signed in (API requires authentication)</li>
          <li>Check database connectivity and proper SQL queries</li>
          <li>Verify that the alumni table exists and has records</li>
          <li>Ensure proper permissions are set for accessing the database</li>
          <li>Check that approved users exist in the database</li>
        </ul>
      </div>
        <div className="mt-6">
        <h2 className="text-xl font-semibold mb-2">Actions</h2>
        <div className="flex space-x-4">
          <Link href="/dashboard/alumni" className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
            Try Alumni Directory
          </Link>
          <Link href="/" className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">
            Return to Home
          </Link>
          <Link href="/api/auth/signout" className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">
            Sign Out
          </Link>
        </div>
      </div>
    </div>
  )
}
