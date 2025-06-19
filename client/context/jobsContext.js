import React from "react";
import { createContext, useEffect, useState, useContext } from "react";
import axios from "axios";
import { get } from "http";
import { toast } from "react-hot-toast";
import { useGlobalContext } from "./globalContext";

const JobsContext = createContext();

axios.defaults.baseURL = "http://localhost:8000";
axios.defaults.withCredentials = true;

export const JobsContextProvider = ({ children }) => {

    //const { userProfile } = useContext(GlobalContext);
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [userJobs, setUserJobs] = useState([]);
    const { userProfile, getUserProfile } = useGlobalContext();

    const getJobs = async () => {
        setLoading(true);
        try {
            const response = await axios.get("/api/v1/jobs");
            setJobs(response.data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const createJob = async (jobData) => {
        try {
            const response = await axios.post("/api/v1/jobs", jobData);
            setJobs((prevJobs) => [response.data, ...prevJobs]);
            toast.success("Job created successfully");

            if (userProfile._id) {
                setUserJobs((prevJobs) => [response.data, ...prevJobs]);
            }

        } catch (error) {
            console.error("Error creating job:", error);
            toast.error("Failed to create job");
        }
    };

    const getUserJobs = async (userId) => {
        setLoading(true);
        try {
            const response = await axios.get(`/api/v1/jobs/user/${userId}`);
            setUserJobs(response.data);
            setLoading(false);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const searchJobs = async (tags, location, title) => {
        setLoading(true);
        try {
            // build query string
            const query = new URLSearchParams();

            if (tags) query.append("tags", tags);
            if (location) query.append("location", location);
            if (title) query.append("title", title);

            // send the request

            const res = await axios.get(`/api/v1/jobs/search?${query.toString()}`);

            // set jobs to the response data
            setJobs(res.data);
            setLoading(false);
        } catch (error) {
            console.log("Error searching jobs", error);
        } finally {
            setLoading(false);
        }
    };

    // get job by id
    const getJobById = async (id) => {
        setLoading(true);
        try {
            const res = await axios.get(`/api/v1/jobs/${id}`);

            setLoading(false);
            return res.data;
        } catch (error) {
            console.log("Error getting job by id", error);
        } finally {
            setLoading(false);
        }
    };

    // like a job
    const likeJob = async (jobId) => {
        console.log("Job liked", jobId);
        try {
            const res = await axios.put(`/api/v1/jobs/like/${jobId}`);

            console.log("Job liked successfully", res);
            toast.success("Job liked successfully");
            getJobs();
        } catch (error) {
            console.log("Error liking job", error);
        }
    };

    // apply to a job
    const applyToJob = async (jobId) => {
        const job = jobs.find((job) => job._id === jobId);

        if (job && job.applicants.includes(userProfile._id)) {
            toast.error("You have already applied to this job");
            return;
        }

        try {
            const res = await axios.put(`/api/v1/jobs/apply/${jobId}`);

            toast.success("Applied to job successfully");
            getJobs();
        } catch (error) {
            console.log("Error applying to job", error);
            toast.error(error.response.data.message);
        }
    };

    // delete a job
    const deleteJob = async (jobId) => {
        try {
            await axios.delete(`/api/v1/jobs/${jobId}`);
            setJobs((prevJobs) => prevJobs.filter((job) => job._id !== jobId));
            setUserJobs((prevJobs) => prevJobs.filter((job) => job._id !== jobId));

            toast.success("Job deleted successfully");
        } catch (error) {
            console.log("Error deleting job", error);
        }
    };


    useEffect(() => {
        getJobs();
    }, []);

    useEffect(() => {
        if (userProfile._id) {
            getUserJobs(userProfile._id);
        }
    }, [userProfile]);



    return (
        <JobsContext.Provider value={{ jobs, loading, error, createJob, getJobs, userJobs, getUserJobs, searchJobs, getJobById, likeJob, applyToJob, deleteJob }}>
            {children}
        </JobsContext.Provider>
    );
}

export const useJobsContext = () => {
    return useContext(JobsContext);
};
