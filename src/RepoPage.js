import { useState, useEffect } from "react";
import { Route, useParams, Routes, Link, useNavigate } from "react-router-dom";
import { request } from "@octokit/request";

const RepoPage = () => {
    const navigate = useNavigate();
    const { username, repoName } = useParams();
    const [resultGot, setResultGot] = useState();
    const [repoInfo, setRepoInfo] = useState({
        id: '',
        owner: '',
        name: '',
        starCnt: '',
        time: '',
        fullname: '',
        url: '',
        description: '',
    });
    const [errorFlag, setErrorFlag] = useState();

    useEffect(async() => {
            // console.log(username);
            try {
                // const result = await axios(listUrl);
                const result =  await request('GET /repos/{username}/{repo}', {
                    username: username,
                    repo: repoName
                })
                console.log("useruser: ", username);
                console.log(result);
                setResultGot(result);
                setErrorFlag(true);
                
            } catch(err) {
                if (err.name === "HttpError") {
                    // let checkUser = [false];
                    setErrorFlag(false);
                    
                }

            }
        
    }, [])

    useEffect(() => {
        if (errorFlag == true) {
            console.log("in");
            setRepoInfo({
                id: resultGot.data.id,
                owner: username,
                name: repoName,
                starCnt: resultGot.data.stargazers_count,
                time: resultGot.data.created_at,
                fullname: resultGot.data.full_name,
                url: resultGot.data.html_url,
                description: resultGot.data.description,
            });
            console.log("repoInfo", repoInfo);
        }
    }, [errorFlag])

    return ( 
        <div className="repoPage">
            <Link to="/Repo_Quickview/" className="backToSearch" onClick={() => navigate(-1)}>Back</Link>
            <header className="repoName">
                { repoInfo.name }
            </header>
            <h3 className="owner">
                {repoInfo.owner}
            </h3>
            <div className="urlDiv">
            <a className="ghUrl" onClick={() => {window.open(repoInfo.url)}}>GitHub Page</a>
            </div>
            <div className="infoLi">
            <ul>
                <li>
                    FULLNAME: {repoInfo.fullname}
                </li>
                <li>
                    STARS: {repoInfo.starCnt}
                </li>
                <li>
                    CREATED TIME: {repoInfo.time}
                </li>
                <li>
                    DESCRIPTION: {repoInfo.description}
                </li>
            </ul>
            </div>
        </div>
    );
}
 
export default RepoPage;