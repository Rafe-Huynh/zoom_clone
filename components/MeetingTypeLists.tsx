'use client'
import React, { useState } from 'react'
import Image from 'next/image'
import HomeCards from './HomeCards'
import { useRouter } from 'next/navigation'
import MeetingModal from './MeetingModal'
import { useUser } from '@clerk/nextjs'
import { Call, useStreamVideoClient } from '@stream-io/video-react-sdk'
import { useToast } from "@/components/ui/use-toast"
import { Textarea } from './ui/textarea'
import ReactDatePicker from 'react-datepicker'
import { Input } from './ui/input'
const MeetingTypeLists = () => {
    const { toast } = useToast()
    const router = useRouter()
    const [meetingState, setMeetingState] = useState<'isScheduleMeeting' | 'isJoiningMeeting' | 'isInstantMeeting' | undefined>()
    const { user } = useUser()
    const client = useStreamVideoClient()
    const [values, setValues] = useState({
        dateTime: new Date(),
        desc: '',
        link: ''
    })
    const [detail, setDetail] = useState<Call>()
    const createMeeting = async () => {
        if (!client || !user) return
        try {
            if (!values.dateTime) {
                toast({
                    title: "please select date and time",
                })
            }
            const id = crypto.randomUUID()
            const call = client.call('default', id)
            if (!call) throw new Error('Failed to create')
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
            if (!values.desc) {
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
    const meetingLink = `${process.env.NEXT_PUBLIC_BASE_URL}/meeting/${detail?.id}`
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
            {!detail ? (
                <MeetingModal
                    isOpen={meetingState === 'isScheduleMeeting'}
                    onClose={() => setMeetingState(undefined)}
                    title="Create Meeting"
                    handleClick={createMeeting}
                >
                    <div className='flex flex-col gap-2.5'>
                        <label className='text-base text-normal leading-[22px] text-sky-2'>
                            Add Description
                        </label>
                        <Textarea className='border-none bg-dark-3 focus-visible:ring-0 focus-visible:ring-offset-0' onChange={(e) => { setValues({ ...values, desc: e.target.value }) }} />
                    </div>
                    <div className='flex flex-col gap-2.5'>
                        <label className='text-base text-normal leading-[22px] text-sky-2'>
                            Select Date and Time
                        </label>
                        <ReactDatePicker
                            selected={values.dateTime}
                            onChange={(date) => setValues({ ...values, dateTime: date! })}
                            showTimeSelect
                            timeFormat='HH:mm'
                            timeIntervals={15}
                            timeCaption='time'
                            dateFormat='MMMM d, yyyy h:mm aa'
                            className='w-full rounded bg-dark-2 p-2 focus:outline-none'
                        />
                    </div>
                </MeetingModal>
            ) : (
                <MeetingModal
                    isOpen={meetingState === 'isScheduleMeeting'}
                    onClose={() => setMeetingState(undefined)}
                    title="Start an Instant Meeting"
                    className="text-center"
                    handleClick={() => {
                        navigator.clipboard.writeText(meetingLink)
                        toast({ title: 'Link Copied' })
                    }}
                    image='/icons/checked.svg'
                    buttonIcon='/icons/copy.svg'
                    buttonText='Copy Meeting Link'
                />
            )}
            <MeetingModal
                isOpen={meetingState === 'isInstantMeeting'}
                onClose={() => setMeetingState(undefined)}
                title="Start an Instant Meeting"
                className="text-center"
                buttonText="Start Meeting"
                handleClick={createMeeting}
            />
            <MeetingModal
                isOpen={meetingState === 'isJoiningMeeting'}
                onClose={() => setMeetingState(undefined)}
                title="Enter The Link"
                className="text-center"
                buttonText="Join Meeting"
                handleClick={() => router.push(values.link)}
            > 
            <Input placeholder='Enter Link' className='border-none bg-dark-3 focus-visible:ring-0 focus-visible:ring-offset-0'
            onChange={(e) => setValues({...values, link: e.target.value })} // use link to push to the above link
            />
            </MeetingModal>
        </section>
    )
}

export default MeetingTypeLists