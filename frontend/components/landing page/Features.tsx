'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'
import { TrendingUp, DollarSign, Activity, CreditCard, Shield, Zap, Globe, Users2 } from 'lucide-react'

const features = [
  {
    icon: TrendingUp,
    title: 'Brand Exposure',
    description: 'Reach millions of engaged followers through authentic creator content',
    details: 'Leverage creator audiences to expand your brand reach and build authentic connections with potential customers.',
    color: 'from-purple-500 to-purple-600'
  },
  {
    icon: DollarSign,
    title: 'Creator Monetization',
    description: 'Turn your social media presence into a sustainable income stream',
    details: 'Earn competitive rates for your content creation while building long-term partnerships with leading brands.',
    color: 'from-blue-500 to-blue-600'
  },
  {
    icon: Activity,
    title: 'Real-time Tracking',
    description: 'Monitor campaign performance with detailed analytics and insights',
    details: 'Track engagement rates, reach, impressions, and conversions in real-time to optimize your campaigns.',
    color: 'from-indigo-500 to-indigo-600'
  },
  {
    icon: CreditCard,
    title: 'Easy Payments',
    description: 'Automated payments ensure creators get paid quickly and securely',
    details: 'Secure payment processing with multiple payout options and transparent fee structures for all users.',
    color: 'from-teal-500 to-teal-600'
  },
  {
    icon: Shield,
    title: 'Content Protection',
    description: 'Advanced content protection and brand safety measures',
    details: 'AI-powered content moderation and brand safety tools to ensure your campaigns maintain quality standards.',
    color: 'from-green-500 to-green-600'
  },
  {
    icon: Zap,
    title: 'Instant Matching',
    description: 'AI-powered matching connects brands with the perfect creators',
    details: 'Our algorithm analyzes audience demographics, engagement rates, and content style for optimal matches.',
    color: 'from-yellow-500 to-yellow-600'
  },
  {
    icon: Globe,
    title: 'Global Reach',
    description: 'Connect with creators and brands worldwide across all markets',
    details: 'Multi-language support and global payment processing enable worldwide brand-creator collaborations.',
    color: 'from-pink-500 to-pink-600'
  },
  {
    icon: Users2,
    title: 'Community Support',
    description: 'Dedicated support team and community resources for success',
    details: 'Access to best practices, campaign optimization tips, and responsive customer support when you need it.',
    color: 'from-rose-500 to-rose-600'
  }
]

export default function Features() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <section id="features" ref={ref} className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Powerful{' '}
            <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Features
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Everything you need to run successful brand-creator campaigns, 
            from discovery to payment, all in one platform.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
              transition={{ duration: 0.6, delay: index * 0.05 }}
            >
              <Card className="h-full group hover:shadow-2xl transition-all duration-500 hover:-translate-y-3 border-0 shadow-lg bg-white hover:bg-gradient-to-br hover:from-white hover:to-gray-50">
                <CardHeader className="text-center pb-4">
                  <motion.div
                    whileHover={{ 
                      scale: 1.2, 
                      rotate: [0, -10, 10, -10, 0],
                      transition: { duration: 0.5 }
                    }}
                    className={`w-16 h-16 mx-auto rounded-2xl bg-gradient-to-r ${feature.color} flex items-center justify-center mb-4 shadow-lg group-hover:shadow-xl`}
                  >
                    <feature.icon className="w-8 h-8 text-white" />
                  </motion.div>
                  
                  <CardTitle className="text-xl font-bold text-gray-900 group-hover:bg-gradient-to-r group-hover:from-purple-600 group-hover:to-blue-600 group-hover:bg-clip-text group-hover:text-transparent transition-all duration-300">
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                
                <CardContent className="pt-0">
                  <CardDescription className="text-gray-600 mb-4 leading-relaxed group-hover:text-gray-700 transition-colors">
                    {feature.description}
                  </CardDescription>
                  
                  <p className="text-sm text-gray-500 leading-relaxed group-hover:text-gray-600 transition-colors">
                    {feature.details}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mt-20"
        >
          {/* <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-3xl p-12 text-center text-white">
            <motion.h3 
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.6, delay: 0.7 }}
              className="text-3xl md:text-4xl font-bold mb-6"
            >
              Ready to Transform Your Marketing?
            </motion.h3>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="text-xl mb-8 text-purple-100 max-w-2xl mx-auto"
            >
              Join the platform that's revolutionizing how brands and creators collaborate. 
              Start your first campaign today.
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.6, delay: 0.9 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-white text-purple-600 font-semibold rounded-xl hover:bg-gray-50 transition-all duration-300 text-lg"
              >
                Start Free Trial
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 border-2 border-white text-white font-semibold rounded-xl hover:bg-white/10 transition-all duration-300 text-lg"
              >
                Schedule Demo
              </motion.button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.6, delay: 1.0 }}
              className="mt-8 text-purple-200"
            >
              <p className="text-sm">No credit card required • 14-day free trial • Cancel anytime</p>
            </motion.div>
          </div> */}
        </motion.div>
      </div>
    </section>
  )
}