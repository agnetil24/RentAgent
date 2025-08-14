'use client'

import { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { Play, Pause, Volume2, VolumeX, Maximize2, ArrowRight, CheckCircle } from 'lucide-react'

interface VideoHeroProps {
  videoUrl: string
  posterUrl?: string
  title: string
  subtitle: string
  features: string[]
}

export default function VideoHero({ 
  videoUrl, 
  posterUrl, 
  title, 
  subtitle, 
  features 
}: VideoHeroProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [showControls, setShowControls] = useState(true)
  const videoRef = useRef<HTMLVideoElement>(null)

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause()
      } else {
        videoRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted
      setIsMuted(!isMuted)
    }
  }

  const toggleFullscreen = () => {
    if (videoRef.current) {
      if (document.fullscreenElement) {
        document.exitFullscreen()
      } else {
        videoRef.current.requestFullscreen()
      }
    }
  }

  const handleVideoEnd = () => {
    setIsPlaying(false)
  }

  return (
    <section className="relative py-20 bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-32 h-32 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-purple-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '4s' }}></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Side - Text Content */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="text-left"
          >
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6"
            >
              {title}
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-lg md:text-xl text-blue-100 mb-8"
            >
              {subtitle}
            </motion.p>

            {/* Call to Action */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="mb-8"
            >
              <button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-4 px-8 rounded-lg transition-all duration-200 hover:scale-105 shadow-lg flex items-center space-x-2">
                <span>Start Your Free Trial</span>
                <ArrowRight className="w-5 h-5" />
              </button>
              <p className="text-blue-200 mt-4 text-sm">
                No credit card required • 14-day free trial • Cancel anytime
              </p>
            </motion.div>

            {/* Video Features */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="grid grid-cols-1 sm:grid-cols-2 gap-4"
            >
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="flex items-center space-x-3 bg-white/10 backdrop-blur-sm rounded-lg p-3 border border-white/20 hover:border-blue-400/50 transition-all duration-300"
                >
                  <CheckCircle className="w-5 h-5 text-blue-400 flex-shrink-0" />
                  <p className="text-white font-medium text-sm">{feature}</p>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right Side - Video Container */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="relative"
          >
            <div className="relative bg-black rounded-2xl shadow-2xl overflow-hidden">
              {/* Video Element */}
              <video
                ref={videoRef}
                className="w-full h-auto"
                poster={posterUrl}
                onEnded={handleVideoEnd}
                onMouseEnter={() => setShowControls(true)}
                onMouseLeave={() => setShowControls(false)}
              >
                <source src={videoUrl} type="video/mp4" />
                Your browser does not support the video tag.
              </video>

              {/* Video Controls Overlay */}
              <div className={`absolute inset-0 bg-black/20 transition-opacity duration-300 ${showControls ? 'opacity-100' : 'opacity-0'}`}>
                {/* Play/Pause Button */}
                <button
                  onClick={togglePlay}
                  className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-20 h-20 bg-white/90 hover:bg-white rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110 shadow-lg"
                >
                  {isPlaying ? (
                    <Pause className="w-8 h-8 text-gray-900" />
                  ) : (
                    <Play className="w-8 h-8 text-gray-900 ml-1" />
                  )}
                </button>

                {/* Bottom Controls Bar */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <button
                        onClick={toggleMute}
                        className="text-white hover:text-blue-300 transition-colors"
                      >
                        {isMuted ? (
                          <VolumeX className="w-5 h-5" />
                        ) : (
                          <Volume2 className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                    <button
                      onClick={toggleFullscreen}
                      className="text-white hover:text-blue-300 transition-colors"
                    >
                      <Maximize2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Video Overlay Text */}
              <div className="absolute top-8 left-8 right-8">
                <div className="bg-black/60 backdrop-blur-sm rounded-lg p-4 text-white">
                  <h3 className="text-lg font-semibold mb-2">🎯 AI-Powered Rent Collection</h3>
                  <p className="text-sm text-blue-100">
                    Watch how RentAgent uses artificial intelligence to streamline your property management
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
