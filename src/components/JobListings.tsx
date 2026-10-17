import { useState, useEffect } from "react"

import JobListing from "./JobListing"
import type { Job } from "./JobListing"
import Spinner from "./Spinner"
import jobData from "../jobs.json"


const JobListings = ({ isHome = false }) => {
    const [jobs, setJobs] = useState<Job[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const controller = new AbortController()

        const fetchJobs = async () => {
            try {
                const res = await fetch('http://localhost:5000/jobs', {
                    signal: controller.signal,
                })
                if (!res.ok) throw new Error('Unable to load jobs')
                const data = await res.json()
                if (!Array.isArray(data)) throw new Error('Invalid jobs response')
                setJobs(data)

            } catch {
                if (!controller.signal.aborted) setJobs(jobData.jobs)
            } finally {
                if (!controller.signal.aborted) setLoading(false)
            }
        }

        void fetchJobs()
        return () => controller.abort()
    }, [])

    const displayedJobs = isHome ? jobs.slice(0, 3) : jobs
    return (
        <>
            <section className="bg-blue-50 px-4 py-10">
                <div className="container-xl lg:container m-auto">
                    <h2 className="text-3xl font-bold text-indigo-500 mb-6 text-center">
                        {isHome ? 'Recent Jobs' : 'Browse Jobs'}
                    </h2>
                    {loading ? (
                        <div role="status" aria-label="Loading jobs">
                            <Spinner loading={loading} />
                        </div>
                    ) : displayedJobs.length === 0 ? (
                        <p className="text-center text-gray-600">No jobs available right now.</p>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {displayedJobs.map((item) => <JobListing key={item.id} item={item} />)}
                        </div>
                    )}
                </div>
            </section>
        </>
    )
}

export default JobListings
