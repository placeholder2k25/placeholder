'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'
import { Rocket, Users, Camera, BarChart3 } from 'lucide-react'

const steps = [
  {
    icon: Rocket,
    title: 'Brand Starts Campaign',
    description: 'Brands create campaigns with their product images and campaign requirements',
    details: 'Upload your product photos, set campaign goals, define target audience, and specify content guidelines for creators to follow.',
    color: 'from-purple-500 to-purple-600'
  },
  {
    icon: Users,
    title: 'Creator Joins Campaign',
    description: 'Creators browse and apply to campaigns that match their audience and style',
    details: 'Creators can filter campaigns by industry, compensation, and requirements to find the perfect brand partnerships.',
    color: 'from-blue-500 to-blue-600'
  },
  {
    icon: Camera,
    title: 'Creator Edits & Posts',
    description: 'Creators edit the brand images and share them on their Instagram profiles',
    details: 'Use our built-in editing tools or your favorite apps to create engaging content that resonates with your followers.',
    color: 'from-indigo-500 to-indigo-600'
  },
  {
    icon: BarChart3,
    title: 'Brand Tracks Performance',
    description: 'Brands monitor creator performance and manage payments through the dashboard',
    details: 'Real-time analytics show engagement rates, reach, conversions, and ROI to optimize future campaigns.',
    color: 'from-purple-600 to-blue-600'
  }
]

export default function HowItWorks() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <section id="how-it-works" ref={ref} className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            How It{' '}
            <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Works
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Our streamlined platform makes brand-creator collaborations effortless, 
            from campaign creation to performance tracking.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Card className="h-full group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                <CardHeader className="text-center pb-4">
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    className={`w-16 h-16 mx-auto rounded-2xl bg-gradient-to-r ${step.color} flex items-center justify-center mb-4 shadow-lg`}
                  >
                    <step.icon className="w-8 h-8 text-white" />
                  </motion.div>
                  
                  <div className="flex items-center justify-center mb-2">
                    <span className="text-sm font-semibold text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                      Step {index + 1}
                    </span>
                  </div>
                  
                  <CardTitle className="text-xl font-bold text-gray-900 group-hover:text-purple-600 transition-colors">
                    {step.title}
                  </CardTitle>
                </CardHeader>
                
                <CardContent className="pt-0">
                  <CardDescription className="text-gray-600 mb-4 leading-relaxed">
                    {step.description}
                  </CardDescription>
                  
                  <p className="text-sm text-gray-500 leading-relaxed">
                    {step.details}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-center mt-16"
        >
          <div className="bg-white rounded-2xl p-8 shadow-lg max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Ready to Get Started?
            </h3>
            <p className="text-gray-600 mb-6">
              Join thousands of brands and creators who are already growing together on Placeholder.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-xl hover:from-purple-700 hover:to-blue-700 transition-all duration-300"
              >
                Start as a Brand
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-3 border-2 border-purple-600 text-purple-600 font-semibold rounded-xl hover:bg-purple-50 transition-all duration-300"
              >
                Join as a Creator
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}