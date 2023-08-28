export function generateUID(): string {
  const characters = '0123456789'
  let uid = ''

  for (let i = 0; i < 10; i++) {
    const randomIndex: number = Math.floor(Math.random() * characters.length)
    uid += characters[randomIndex]
  }

  return uid
}
