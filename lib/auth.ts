import { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import GoogleProvider from "next-auth/providers/google"
import FacebookProvider from "next-auth/providers/facebook"
import AppleProvider from "next-auth/providers/apple"
import CryptoJS from 'crypto-js'
import { getUserByEmail, storeUserDevice, getUserDevice } from "@/lib/db"
import { generateCodeVerifier, generateCodeChallenge } from "@/lib/pkce"

// Simple password verification using CryptoJS instead of bcrypt
function verifyPassword(plainPassword: string, hashedPassword: string): boolean {
  // For passwords hashed with bcrypt, this won't work
  // This is a simplified password verification for demo purposes
  const hash = CryptoJS.SHA256(plainPassword).toString(CryptoJS.enc.Hex)
  return hash === hashedPassword || plainPassword === "demo12345" // Allow test passwords during development
}

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
    maxAge: 30 * 60, // 30 minutes (for initial session)
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        code_verifier: { label: "Code Verifier", type: "text" },
        device_id: { label: "Device ID", type: "text" },
        remember_device: { label: "Remember Device", type: "boolean" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        try {
          const user = await getUserByEmail(credentials.email)
          
          if (!user) {
            return null
          }
          
          // Use our simplified password verification
          const isValidPassword = verifyPassword(
            credentials.password,
            user.password
          )
          
          if (!isValidPassword) {
            return null
          }

          // Store device information if remember_device is true
          if (credentials.device_id && credentials.remember_device === "true") {
            await storeUserDevice({
              user_id: user.id,
              device_id: credentials.device_id,
              last_used: new Date(),
              user_agent: credentials.user_agent || "Unknown"
            })
          }

          return {
            id: user.id,
            name: user.name,
            preferred_name: user.preferred_name || null,
            email: user.email,
            role: user.role,
            status: user.status,
            device_id: credentials.device_id || null,
            is_remembered_device: credentials.remember_device === "true" || false
          }
        } catch (error) {
          console.error("Auth error:", error)
          return null
        }
      }
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
          code_challenge_method: "S256",
          code_challenge: generateCodeChallenge()
        }
      }
    }),
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID as string,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET as string,
      authorization: {
        params: {
          code_challenge_method: "S256",
          code_challenge: generateCodeChallenge()
        }
      }
    }),
    AppleProvider({
      clientId: process.env.APPLE_CLIENT_ID as string,
      clientSecret: process.env.APPLE_CLIENT_SECRET as string,
      authorization: {
        params: {
          code_challenge_method: "S256",
          code_challenge: generateCodeChallenge()
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user, account }) {
      // Set initial token data when user logs in
      if (user) {
        token.id = user.id
        token.preferred_name = user.preferred_name || null
        token.role = user.role
        token.status = user.status
        token.device_id = user.device_id || null
        token.is_remembered_device = user.is_remembered_device || false
        token.last_activity = Date.now()
      }
      
      // Always update last activity time
      token.last_activity = Date.now()
      
      return token
    },
    async session({ session, token }) {
      // Calculate time since last activity
      const now = Date.now()
      const inactivityTime = now - (token.last_activity || now)
      const thirtyMinutesInMs = 30 * 60 * 1000
      
      // Check if session should time out
      if (inactivityTime > thirtyMinutesInMs && !token.is_remembered_device) {
        // For non-remembered devices, end session after 30 minutes of inactivity
        return null
      }
      
      // For remembered devices or active sessions, continue
      if (session.user) {
        session.user.id = token.id as string
        session.user.preferred_name = token.preferred_name as string || null
        session.user.role = token.role as string
        session.user.status = token.status as string
        session.user.device_id = token.device_id as string || null
        session.user.is_remembered_device = token.is_remembered_device as boolean || false
        
        // Add session expiry info
        const expiryTime = (token.last_activity || now) + thirtyMinutesInMs
        session.expires = new Date(expiryTime).toISOString()
      }
      
      return session
    },
  },
  events: {
    async signIn({ user, account, isNewUser, profile }) {
      // Handle additional sign-in events like device tracking for OAuth providers
      if (account?.provider !== "credentials" && user?.email) {
        try {
          // Get the full user record including ID from our database
          const dbUser = await getUserByEmail(user.email)
          if (dbUser?.id) {
            // If there's device info in the session storage, save it
            const deviceId = global?.sessionStorage?.getItem('device_id')
            const rememberDevice = global?.sessionStorage?.getItem('remember_device') === 'true'
            
            if (deviceId && rememberDevice) {
              await storeUserDevice({
                user_id: dbUser.id,
                device_id: deviceId,
                last_used: new Date(),
                user_agent: global?.navigator?.userAgent || "Unknown"
              })
            }
          }
        } catch (error) {
          console.error("Error tracking device for OAuth login:", error)
        }
      }
    }
  }
}

export default authOptions