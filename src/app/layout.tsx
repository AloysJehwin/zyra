import './globals.css'
import { Inter, Space_Grotesk, Poppins, Playfair_Display } from 'next/font/google'
import { AppKitProvider } from '../providers/AppKitProvider'

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const spaceGrotesk = Space_Grotesk({ 
  subsets: ['latin'],
  variable: '--font-space-grotesk',
  display: 'swap',
})

const poppins = Poppins({ 
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  variable: '--font-poppins',
  display: 'swap',
})

const playfair = Playfair_Display({ 
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
})

export const metadata = {
  title: 'Modern Web App - Revolutionary Experience',
  description: 'Experience the future of web applications with stunning design and seamless interactions.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${spaceGrotesk.variable} ${poppins.variable} ${playfair.variable} font-inter antialiased bg-black text-white overflow-x-hidden`}>
        <AppKitProvider>
          {children}
        </AppKitProvider>
      </body>
    </html>
  )
}