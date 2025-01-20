import { redirect } from 'next/navigation'

function Home() {
  redirect('/login')
}

export default Home