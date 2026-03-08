'use client'

import React from 'react'

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

export const Textarea: React.FC<TextareaProps> = (props) => {
  return (
    <textarea
      {...props}
      className="
        w-full p-2 rounded
        bg-white text-black border border-gray-300
        focus:outline-none focus:ring-2 focus:ring-green-500
        placeholder-gray-500
      "
    />
  )
}