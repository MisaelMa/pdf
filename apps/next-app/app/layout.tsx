export const metadata = {
  title: 'PDFCraft — Next.js Demo',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          fontFamily: 'system-ui, -apple-system, sans-serif',
          background: '#f8f9fa',
        }}
      >
        {children}
      </body>
    </html>
  )
}
