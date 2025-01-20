'use client'
import React from 'react'


type Props = {
    children: React.ReactNode
}

function Wrap({ children }: Props) {
    return (
        <div className='flex w-full' style={{ width: '100%' }}>
            {children}
        </div>
    )
}

export default Wrap