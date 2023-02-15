import { Link } from "react-router-dom";
import { Job } from "../types/Job";

type Props = {
  job: Job;
  key: string;
};

function OneJob({ job }: Props) {
  return (
    <div className="collapse collapse-arrow border border-base-300 bg-base-100 rounded-box p-3 my-6">
      <input type="checkbox" className="peer" />
      <div className="collapse-title text-xl font-medium flex justify-between items-end">
        <p>{job.title.toUpperCase()}</p>
        <p>
          {job.tech.toUpperCase()} {job.position.toLocaleUpperCase()}
        </p>
      </div>
      <div className="collapse-content ">
        <div className="flex justify-between items-end">
          <div>
            <p className="mt-5">
              {new Date(job.updatedAt).toLocaleDateString()}
            </p>
          </div>
          <Link to={`/more/${job.id}`}>
            <button className="btn mt-3">MORE</button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default OneJob;
