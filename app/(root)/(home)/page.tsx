import MeetingTypeLists from '@/components/MeetingTypeLists'
import React from 'react'

const page = () => {
  const now = new Date()
  const time = now.toLocaleTimeString([],{hour:'2-digit', minute:'2-digit'})
  const date = now.toLocaleDateString([],{weekday:"long",month:'long', day:'numeric', year:'2-digit'})
  return (
    <section className='flex size-full flex-col gap-10 text-white'>
        <div className='h-[300px] w-full rounded-[20px] bg-hero bg-cover' >
          <div className='flex h-full flex-col justify-between max-md:px-5 max-md:py-8 lg:p-11'>
            <h2 className='glassmorphism max-w-[270px] rounded py-2 text-center text-base'>
              Upcoming Meeting
            </h2>
            <div className='flex flex-col gap-2'>
              <h1 className='text-4xl font-extrabold lg:text-7xl'>
                  {time}
              </h1>
              <p className='text-lg font-medium text-sky-200 lg:text-7xl'> {date}</p>
            </div>
          </div>
        </div>
    <MeetingTypeLists />
    </section>
  )
}

export default page