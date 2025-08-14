'use client'

import { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { Upload, Play, Pause, Trash2, Download, Eye, Edit } from 'lucide-react'

interface Video {
  id: string
  title: string
  description: string
  url: string
  posterUrl?: string
  duration: string
  uploadDate: string
  status: 'active' | 'draft' | 'archived'
}

interface VideoUploadProps {
  onVideoUpload: (video: File) => void
  onVideoDelete: (videoId: string) => void
  onVideoUpdate: (videoId: string, updates: Partial<Video>) => void
  videos: Video[]
}

export default function VideoUpload({
  onVideoUpload,
  onVideoDelete,
  onVideoUpdate,
  videos
}: VideoUploadProps) {
  const [dragActive, setDragActive] = useState(false)
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onVideoUpload(e.dataTransfer.files[0])
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onVideoUpload(e.target.files[0])
    }
  }

  const handleVideoClick = (video: Video) => {
    setSelectedVideo(video)
    setIsEditing(false)
  }

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsEditing(true)
  }

  const handleSave = () => {
    if (selectedVideo) {
      onVideoUpdate(selectedVideo.id, selectedVideo)
      setIsEditing(false)
    }
  }

  const handleCancel = () => {
    setIsEditing(false)
    setSelectedVideo(null)
  }

  return (
    <div className="space-y-6">
      {/* Upload Area */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Upload New Video</h3>
        
        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            dragActive 
              ? 'border-blue-500 bg-blue-50' 
              : 'border-gray-300 hover:border-gray-400'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-lg font-medium text-gray-900 mb-2">
            Drop your video here, or click to browse
          </p>
          <p className="text-gray-500 mb-4">
            Supports MP4, MOV, AVI up to 100MB
          </p>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Choose File
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="video/*"
            onChange={handleFileSelect}
            className="hidden"
          />
        </div>
      </div>

      {/* Video Library */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Video Library ({videos.length})</h3>
        </div>
        
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {videos.map((video) => (
              <motion.div
                key={video.id}
                whileHover={{ scale: 1.02 }}
                className="bg-gray-50 rounded-lg overflow-hidden cursor-pointer border border-gray-200 hover:border-blue-300 transition-colors"
                onClick={() => handleVideoClick(video)}
              >
                {/* Video Thumbnail */}
                <div className="relative h-48 bg-gray-200">
                  {video.posterUrl ? (
                    <img 
                      src={video.posterUrl} 
                      alt={video.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Play className="w-12 h-12 text-gray-400" />
                    </div>
                  )}
                  
                  {/* Status Badge */}
                  <div className="absolute top-2 right-2">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      video.status === 'active' 
                        ? 'bg-green-100 text-green-800'
                        : video.status === 'draft'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {video.status}
                    </span>
                  </div>
                </div>

                {/* Video Info */}
                <div className="p-4">
                  <h4 className="font-medium text-gray-900 mb-1 truncate">{video.title}</h4>
                  <p className="text-sm text-gray-500 mb-2 line-clamp-2">{video.description}</p>
                  <div className="flex items-center justify-between text-xs text-gray-400">
                    <span>{video.duration}</span>
                    <span>{new Date(video.uploadDate).toLocaleDateString()}</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="px-4 pb-4 flex space-x-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      window.open(video.url, '_blank')
                    }}
                    className="flex-1 bg-blue-600 text-white px-3 py-2 rounded text-sm hover:bg-blue-700 transition-colors flex items-center justify-center space-x-1"
                  >
                    <Eye className="w-4 h-4" />
                    <span>View</span>
                  </button>
                  <button
                    onClick={handleEdit}
                    className="bg-gray-600 text-white px-3 py-2 rounded text-sm hover:bg-gray-700 transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      onVideoDelete(video.id)
                    }}
                    className="bg-red-600 text-white px-3 py-2 rounded text-sm hover:bg-red-700 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Video Editor Modal */}
      {selectedVideo && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">
                {isEditing ? 'Edit Video' : 'Video Details'}
              </h3>
              <button
                onClick={handleCancel}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            {isEditing ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Title
                  </label>
                  <input
                    type="text"
                    value={selectedVideo.title}
                    onChange={(e) => setSelectedVideo({...selectedVideo, title: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    value={selectedVideo.description}
                    onChange={(e) => setSelectedVideo({...selectedVideo, description: e.target.value})}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <select
                    value={selectedVideo.status}
                    onChange={(e) => setSelectedVideo({...selectedVideo, status: e.target.value as any})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="active">Active</option>
                    <option value="draft">Draft</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>

                <div className="flex space-x-3 pt-4">
                  <button
                    onClick={handleSave}
                    className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Save Changes
                  </button>
                  <button
                    onClick={handleCancel}
                    className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Title
                  </label>
                  <p className="text-gray-900">{selectedVideo.title}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <p className="text-gray-900">{selectedVideo.description}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                    selectedVideo.status === 'active' 
                      ? 'bg-green-100 text-green-800'
                      : selectedVideo.status === 'draft'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {selectedVideo.status}
                  </span>
                </div>

                <div className="flex space-x-3 pt-4">
                  <button
                    onClick={handleEdit}
                    className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Edit Video
                  </button>
                  <button
                    onClick={handleCancel}
                    className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </div>
  )
}
