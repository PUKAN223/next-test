import { redirect } from 'next/navigation'
import React from 'react'

function Home() {
  redirect('/login')
}

export default Home