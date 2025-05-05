import "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      name?: string | null
      email?: string | null
      image?: string | null
      preferred_name?: string | null
      role?: string | null
      status?: string | null
      device_id?: string | null
      is_remembered_device?: boolean
    }
  }
  
  interface User {
    id: string
    name?: string | null
    email?: string | null
    image?: string | null
    preferred_name?: string | null
    role?: string | null
    status?: string | null
    device_id?: string | null
    is_remembered_device?: boolean
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string
    name?: string | null
    email?: string | null
    picture?: string | null
    preferred_name?: string | null
    role?: string | null
    status?: string | null
    device_id?: string | null
    is_remembered_device?: boolean
    last_activity?: number
  }
}