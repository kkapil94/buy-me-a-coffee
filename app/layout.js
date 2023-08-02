import "../styles/styles.css"

export const metadata = {
  title: 'Buy me a Coffee',
  description: 'you can buy me a coffee',
}
 
export default function RootLayout({ children }) {
 return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
