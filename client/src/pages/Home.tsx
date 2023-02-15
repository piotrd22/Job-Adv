import axios from "axios";
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { AiOutlineArrowUp } from "react-icons/ai";
import Loader from "../components/Loader";
import OneJob from "../components/OneJob";
import { Job } from "../types/Job";

function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const [isSkipLoading, setIsSkipLoading] = useState(false);
  const [jobs, setJobs] = useState([]);
  const [skip, setSkip] = useState(0);
  const [searchParams, setSearchParams] = useSearchParams({});
  const [isTop, setIsTop] = useState(true);
  const [pos, setPos] = useState(
    searchParams.get("pos") ? searchParams.get("pos") : ""
  );
  const [lang, setLang] = useState(
    searchParams.get("lang") ? searchParams.get("lang") : ""
  );

  const getjobs = async (skip = 0, shouldClear = false) => {
    try {
      setIsSkipLoading(true);
      const searchParam = searchParams.get("lang");
      const sortParam = searchParams.get("pos");
      const url = `${import.meta.env.VITE_PORT}/jobs`;

      if (searchParam && sortParam) {
        const response = await axios.get(
          url +
            (`?lang=${searchParam}&pos=${sortParam}` +
              (shouldClear ? "&skip=0" : `&skip=${skip}`))
        );
        shouldClear
          ? setJobs(response.data)
          : setJobs(jobs.concat(response.data));
        setIsLoading(false);
        setIsSkipLoading(false);
      } else if (searchParam) {
        const response = await axios.get(
          url +
            (`?lang=${searchParam}` +
              (shouldClear ? "&skip=0" : `&skip=${skip}`))
        );
        shouldClear
          ? setJobs(response.data)
          : setJobs(jobs.concat(response.data));
        setIsLoading(false);
        setIsSkipLoading(false);
      } else if (sortParam) {
        const response = await axios.get(
          url + (`?pos=${pos}` + (shouldClear ? "&skip=0" : `&skip=${skip}`))
        );
        shouldClear
          ? setJobs(response.data)
          : setJobs(jobs.concat(response.data));
        setIsLoading(false);
        setIsSkipLoading(false);
      } else {
        const response = await axios.get(
          url + (shouldClear ? "?skip=0" : `?skip=${skip}`)
        );
        shouldClear
          ? setJobs(response.data)
          : setJobs(jobs.concat(response.data));
        setIsLoading(false);
        setIsSkipLoading(false);
      }
    } catch (error) {
      setIsLoading(false);
      console.log(error);
    }
  };

  const handleSortLang = (e: React.ChangeEvent<HTMLSelectElement>) => {
    e.preventDefault();
    setPos(e.target.value);
    const search = searchParams.get("pos");
    if (search) {
      setSearchParams({ pos: search, lang: e.target.value });
    } else {
      setSearchParams({ lang: e.target.value });
    }
  };

  const handleSort = (e: React.ChangeEvent<HTMLSelectElement>) => {
    e.preventDefault();
    setPos(e.target.value);
    const search = searchParams.get("lang");
    if (search) {
      setSearchParams({ lang: search, pos: e.target.value });
    } else {
      setSearchParams({ pos: e.target.value });
    }
  };

  useEffect(() => {
    const onScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } =
        document.documentElement;

      if (scrollTop === 0) {
        setIsTop(true);
      }

      if (scrollTop !== 0) {
        setIsTop(false);
      }

      //infinite scroll pagination
      if (scrollTop + clientHeight >= scrollHeight - 10) {
        setSkip(jobs.length);
      }
    };

    window.addEventListener("scroll", onScroll, {
      passive: true,
    });
    return () => window.removeEventListener("scroll", onScroll);
  });

  const goToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const clearSearch = () => {
    setSearchParams({});
    setPos("");
    setLang("");
  };

  useEffect(() => {
    setPos(searchParams.get("pos") ? searchParams.get("pos") : "");
    setLang(searchParams.get("lang") ? searchParams.get("lang") : "");
    getjobs(0, true);
  }, [searchParams]);

  useEffect(() => {
    getjobs(skip);
  }, [skip]);

  const jobComponents = jobs?.map((job: Job) => (
    <OneJob key={job.id} job={job} />
  ));

  if (isLoading) return <Loader />;

  return (
    <div className="container mx-auto p-3 min-h-screen">
      <div className="w-full flex justify-between flex-wrap">
        <select
          className="select w-full sm:w-1/3 input-bordered"
          onChange={handleSortLang}
          value={lang ? lang : ""}
        >
          <option disabled value="">
            Select technology:
          </option>
          <option value="javascript">JavaScript</option>
          <option value="java">Java</option>
          <option value="python">Python</option>
          <option value="scala">Scala</option>
          <option value="go">Go</option>
          <option value="c++">C++</option>
          <option value="c">C</option>
          <option value="c#">C#</option>
          <option value="ruby">Ruby</option>
        </select>
        <select
          className="select w-full sm:w-1/3 input-bordered"
          onChange={handleSort}
          value={pos ? pos : ""}
        >
          <option disabled value="">
            Select position:
          </option>
          <option value="intern">Intern</option>
          <option value="junior">Junior</option>
          <option value="mid">Mid</option>
          <option value="senior">Senior</option>
        </select>
      </div>
      {(pos || lang) && (
        <div className="flex items-center justify-between mt-5">
          <button onClick={clearSearch} className="btn btn-active">
            CLEAR SEARCH
          </button>
        </div>
      )}
      {jobs.length > 0 ? (
        <div>{jobComponents}</div>
      ) : (
        <div className="my-3 text-center">No jobs</div>
      )}
      {!isTop && (
        <button
          className="btn btn-square fixed bottom-3 right-3 z-50 "
          onClick={goToTop}
        >
          <AiOutlineArrowUp />
        </button>
      )}
      {isSkipLoading && <Loader />}
    </div>
  );
}

export default Home;
