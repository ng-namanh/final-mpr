export const getUsernameFromEmail = (email: string | null) => {
  return email?.split('@')[0]
}
