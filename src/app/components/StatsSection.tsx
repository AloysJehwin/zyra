'use client'

import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef, useEffect, useState } from 'react'

const stats = [
  { number: 10000, suffix: '+', label: 'Happy Users', color: 'text-purple-400' },
  { number: 99.9, suffix: '%', label: 'Uptime', color: 'text-green-400' },
  { number: 50, suffix: 'ms', label: 'Response Time', color: 'text-blue-400' },
  { number: 24, suffix: '/7', label: 'Support', color: 'text-pink-400' }
]

function AnimatedNumber({ number, suffix, inView }: { number: number, suffix: string, inView: boolean }) {
  const [displayNumber, setDisplayNumber] = useState(0)

  useEffect(() => {
    if (inView) {
      const duration = 2000 // 2 seconds
      const steps = 60
      const increment = number / steps
      let current = 0
      
      const timer = setInterval(() => {
        current += increment
        if (current >= number) {
          setDisplayNumber(number)
          clearInterval(timer)
        } else {
          setDisplayNumber(Math.floor(current))
        }
      }, duration / steps)
      
      return () => clearInterval(timer)
    }
  }, [inView, number])

  return <span>{displayNumber}{suffix}</span>
}

export default function StatsSection() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, threshold: 0.3 })

  return (
    <section className="py-20 px-6" ref={ref}>
      <div className="container mx-auto">
        <motion.div
          className="grid grid-cols-2 md:grid-cols-4 gap-8"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={inView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.8 }}
        >
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              className="text-center group"
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ scale: 1.1 }}
            >
              <motion.div
                className={`text-4xl md:text-6xl font-space font-bold ${stat.color} mb-2 group-hover:scale-110 transition-transform`}
              >
                <AnimatedNumber number={stat.number} suffix={stat.suffix} inView={inView} />
              </motion.div>
              <p className="text-gray-300 font-poppins font-medium">{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}