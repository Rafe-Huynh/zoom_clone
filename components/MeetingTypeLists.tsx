'use client'
import React, { useState } from 'react'
import Image from 'next/image'
import HomeCards from './HomeCards'
import { useRouter } from 'next/navigation'
import MeetingModal from './MeetingModal'
import { useUser } from '@clerk/nextjs'
import { Call, useStreamVideoClient } from '@stream-io/video-react-sdk'
import { useToast } from "@/components/ui/use-toast"

const MeetingTypeLists = () => {
    const {toast} = useToast()
    const router = useRouter()
    const [meetingState, setMeetingState] = useState<'isScheduleMeeting' | 'isJoiningMeeting' | 'isInstantMeeting' | undefined>()
    const {user} = useUser()
    const client = useStreamVideoClient()
    const [values, setValues] = useState({
        dateTime: new Date(),
        desc: '',
        link: ''
    })
    const [detail, setDetail] = useState<Call>()
    const createMeeting = async () => {
        if(!client || !user) return
        try {
            if(!values.dateTime){
                toast({
                    title: "please select date and time",
                   })
            }
            const id = crypto.randomUUID()
            const call = client.call('default', id)
            if(!call) throw new Error('Failed to create')
            const startsAt = values.dateTime.toISOString() || new Date(Date.now()).toISOString()
            const desc = values.desc || 'Instant Meeting'
            await call.getOrCreate({
                data: {
                    starts_at: startsAt,
                    custom: {
                        desc
                    }
                }
            })
            setDetail(call)
            if(!values.desc){
                router.push(`/meeting/${call.id}`)
            }
            toast({
                title: "Create Meeting Successfully",
               })
        } catch (error) {
            console.log(error)
           toast({
            title: "failed to create Meeting",
           })
        }
    }
    return (
        <section className='grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4'>
            <HomeCards
                img="/icons/add-meeting.svg"
                title="New Meeting"
                description="Start an instant meeting"
                className="bg-orange-1"
                handleClick={() => setMeetingState('isInstantMeeting')}
            />
            <HomeCards
                img="/icons/join-meeting.svg"
                title="Join Meeting"
                description="via invitation link"
                className="bg-blue-1"
                handleClick={() => setMeetingState('isJoiningMeeting')}
            />
            <HomeCards
                img="/icons/schedule.svg"
                title="Schedule Meeting"
                description="Plan your meeting"
                className="bg-purple-1"
                handleClick={() => setMeetingState('isScheduleMeeting')}
            />
            <HomeCards
                img="/icons/recordings.svg"
                title="View Recordings"
                description="Meeting Recordings"
                className="bg-yellow-1"
                handleClick={() => router.push('/recordings')}
            />
            <MeetingModal
                isOpen={meetingState === 'isInstantMeeting'}
                onClose={() => setMeetingState(undefined)}
                title="start an Instant Meeting"
                className="text-center"
                buttonText="start Meeting"
                handleClick={createMeeting}
            />
        </section>
    )
}

export default MeetingTypeLists