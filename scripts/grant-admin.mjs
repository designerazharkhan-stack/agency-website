import { applicationDefault, initializeApp } from 'firebase-admin/app'
import { getAuth } from 'firebase-admin/auth'

const email = process.argv[2]?.trim()
const projectId = process.env.GOOGLE_CLOUD_PROJECT

if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
  console.error('Usage: npm run grant:admin -- user@example.com')
  process.exitCode = 1
} else if (!projectId) {
  console.error('Set GOOGLE_CLOUD_PROJECT to the Firebase project ID before granting admin access.')
  process.exitCode = 1
} else {
  try {
    const app = initializeApp({ credential: applicationDefault(), projectId })
    const auth = getAuth(app)
    const user = await auth.getUserByEmail(email)
    await auth.setCustomUserClaims(user.uid, { ...user.customClaims, admin: true })
    console.info(`Granted admin access to ${email} in Firebase project ${projectId}.`)
    console.info('The user must sign out and sign in again to refresh their ID token.')
  } catch (error) {
    console.error(
      'Could not grant admin access:',
      error instanceof Error ? error.message : 'Unknown Firebase Admin SDK error.',
    )
    process.exitCode = 1
  }
}
