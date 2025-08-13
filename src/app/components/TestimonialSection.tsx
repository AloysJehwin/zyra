'use client'

import { motion } from 'framer-motion'
import { Star, Quote } from 'lucide-react'

const testimonials = [
  {
    name: 'Sarah Chen',
    role: 'Product Designer',
    company: 'TechCorp',
    content: 'This platform completely transformed how we approach user experience. The animations are smooth and the responsiveness is incredible.',
    avatar: '👩‍💻',
    rating: 5
  },
  {
    name: 'Marcus Rodriguez',
    role: 'CTO',
    company: 'StartupXYZ',
    content: 'The authentication system is seamless and the performance metrics speak for themselves. Our users love the new interface.',
    avatar: '👨‍💼',
    rating: 5
  },
  {
    name: 'Emily Johnson',
    role: 'Frontend Developer',
    company: 'WebStudio',
    content: 'As a developer, I appreciate the clean code structure and the modern tech stack. Everything just works beautifully.',
    avatar: '👩‍🎨',
    rating: 5
  }
]

export default function TestimonialSection() {
  return (
    <section className="py-20 px-6">
      <div className="container mx-auto">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-5xl md:text-6xl font-playfair font-bold mb-6">
            <span className="gradient-text">What People Say</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto font-poppins">
            Hear from our amazing community of creators and innovators
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              className="group relative p-8 glass-effect rounded-2xl hover:glow-effect transition-all duration-300"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              whileHover={{ y: -10, scale: 1.02 }}
            >
              <motion.div
                className="absolute top-4 right-4 text-purple-400 opacity-20 group-hover:opacity-40 transition-opacity"
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6 }}
              >
                <Quote size={32} />
              </motion.div>

              <div className="flex items-center mb-6">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 flex items-center justify-center text-2xl mr-4">
                  {testimonial.avatar}
                </div>
                <div>
                  <h4 className="font-space font-bold text-lg text-white">{testimonial.name}</h4>
                  <p className="text-gray-400 font-poppins">{testimonial.role} at {testimonial.company}</p>
                </div>
              </div>

              <div className="flex mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 + i * 0.1 }}
                  >
                    <Star className="w-5 h-5 text-yellow-400 fill-current" />
                  </motion.div>
                ))}
              </div>

              <p className="text-gray-300 leading-relaxed font-poppins">
                &quot;{testimonial.content}&quot;
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}