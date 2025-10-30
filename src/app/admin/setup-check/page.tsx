/**
 * Firebase Setup Check Page
 *
 * Helper page to verify Firebase configuration
 * Visit at /admin/setup-check
 */

'use client'

import { useEffect, useState } from 'react'
import { GlassCard } from '@/components/ui/GlassCard'
import { Container } from '@/components/ui/Container'
import { Heading } from '@/components/ui/Heading'
import { FiCheckCircle, FiXCircle, FiInfo } from 'react-icons/fi'

interface ConfigCheck {
  name: string
  value: string | undefined
  status: 'ok' | 'missing'
}

export default function SetupCheckPage() {
  const [checks, setChecks] = useState<ConfigCheck[]>([])

  useEffect(() => {
    const configChecks: ConfigCheck[] = [
      {
        name: 'Firebase API Key',
        value: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
        status: process.env.NEXT_PUBLIC_FIREBASE_API_KEY ? 'ok' : 'missing'
      },
      {
        name: 'Firebase Auth Domain',
        value: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
        status: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ? 'ok' : 'missing'
      },
      {
        name: 'Firebase Project ID',
        value: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
        status: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ? 'ok' : 'missing'
      },
      {
        name: 'Admin UID',
        value: process.env.NEXT_PUBLIC_ADMIN_UID,
        status: process.env.NEXT_PUBLIC_ADMIN_UID ? 'ok' : 'missing'
      }
    ]

    setChecks(configChecks)
  }, [])

  const allOk = checks.every(check => check.status === 'ok')

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4">
      <Container size="md">
        <div className="text-center mb-8">
          <Heading as="h1" className="mb-2">
            Firebase Setup Check
          </Heading>
          <p className="text-muted-foreground">
            Verify your Firebase configuration
          </p>
        </div>

        <GlassCard className="space-y-6">
          {/* Overall Status */}
          <div className={`p-4 rounded-lg border ${allOk ? 'bg-green-500/10 border-green-500/20' : 'bg-yellow-500/10 border-yellow-500/20'}`}>
            <div className="flex items-center gap-3">
              {allOk ? (
                <FiCheckCircle className="text-green-500" size={24} />
              ) : (
                <FiInfo className="text-yellow-500" size={24} />
              )}
              <div>
                <p className="font-semibold">
                  {allOk ? 'Configuration Complete' : 'Configuration Incomplete'}
                </p>
                <p className="text-sm text-muted-foreground">
                  {allOk
                    ? 'All Firebase configuration values are set'
                    : 'Some configuration values are missing'
                  }
                </p>
              </div>
            </div>
          </div>

          {/* Individual Checks */}
          <div className="space-y-3">
            {checks.map((check) => (
              <div
                key={check.name}
                className="flex items-center justify-between p-3 rounded-lg bg-foreground/5"
              >
                <div className="flex items-center gap-3">
                  {check.status === 'ok' ? (
                    <FiCheckCircle className="text-green-500" size={20} />
                  ) : (
                    <FiXCircle className="text-red-500" size={20} />
                  )}
                  <div>
                    <p className="font-medium">{check.name}</p>
                    {check.value && (
                      <p className="text-xs text-muted-foreground font-mono">
                        {check.name === 'Firebase API Key'
                          ? `${check.value.substring(0, 20)}...`
                          : check.value
                        }
                      </p>
                    )}
                  </div>
                </div>
                <span className={`text-xs font-medium px-2 py-1 rounded ${
                  check.status === 'ok'
                    ? 'bg-green-500/20 text-green-500'
                    : 'bg-red-500/20 text-red-500'
                }`}>
                  {check.status === 'ok' ? 'OK' : 'Missing'}
                </span>
              </div>
            ))}
          </div>

          {/* Instructions */}
          <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
            <h3 className="font-semibold mb-2 flex items-center gap-2">
              <FiInfo className="text-blue-500" />
              Next Steps
            </h3>
            <ol className="text-sm text-muted-foreground space-y-2 list-decimal list-inside">
              <li>Go to Firebase Console: console.firebase.google.com</li>
              <li>Select your project: <strong>portfolio-v3-8ca49</strong></li>
              <li>Go to Authentication → Sign-in method</li>
              <li>Enable &quot;Email/Password&quot; provider</li>
              <li>Go to Authentication → Users</li>
              <li>Click &quot;Add user&quot; and create an admin account</li>
              <li>Copy the UID from the user list</li>
              <li>Update <code className="bg-foreground/10 px-1 rounded">NEXT_PUBLIC_ADMIN_UID</code> in .env.local</li>
              <li>Restart the dev server</li>
              <li>Try logging in at <code className="bg-foreground/10 px-1 rounded">/admin/login</code></li>
            </ol>
          </div>

          {/* Current Admin UID */}
          {process.env.NEXT_PUBLIC_ADMIN_UID && (
            <div className="p-4 rounded-lg bg-[#00274C]/10 border border-[#00274C]/20">
              <h3 className="font-semibold mb-2">Current Admin UID</h3>
              <code className="text-sm bg-foreground/10 px-3 py-2 rounded block font-mono">
                {process.env.NEXT_PUBLIC_ADMIN_UID}
              </code>
              <p className="text-xs text-muted-foreground mt-2">
                Make sure this matches the UID of the user you create in Firebase Console
              </p>
            </div>
          )}
        </GlassCard>
      </Container>
    </div>
  )
}
