import jwt from 'jsonwebtoken'

export interface DecodedToken {
  userId: string
  email: string
  role: string
  firstName?: string
  lastName?: string
  iat: number
  exp: number
}

export function verifyToken(token: string): DecodedToken | null {
  try {
    const decoded = jwt.verify(token, process.env.NEXTAUTH_SECRET!) as DecodedToken
    return decoded
  } catch (error) {
    console.error('Token verification failed:', error)
    return null
  }
}

export function generateToken(payload: Omit<DecodedToken, 'iat' | 'exp'>): string {
  return jwt.sign(payload, process.env.NEXTAUTH_SECRET!, { expiresIn: '7d' })
}

export function isTokenExpired(token: string): boolean {
  try {
    const decoded = jwt.decode(token) as DecodedToken
    if (!decoded || !decoded.exp) return true
    
    const currentTime = Math.floor(Date.now() / 1000)
    return decoded.exp < currentTime
  } catch (error) {
    return true
  }
}

export function extractTokenFromHeader(authHeader: string | null): string | null {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null
  }
  return authHeader.substring(7)
}
