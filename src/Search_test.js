import { useState, useEffect } from "react";
import { request } from "@octokit/request";
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import { useNavigate, Link } from "react-router-dom";

import Results_test from "./Results_test";
import RepoPage from "./RepoPage";

const Search = () => {

    // 為什麼要設 useState？因為這樣才能讓他在整個程式碼裡面都使用
    const [username, setUsername] = useState('');
    const [repo, setRepo] = useState([]);
    const [httpFlag, setHttpFlag] = useState(true);
    const [inputFlag, setInputFlag] = useState(true);
    const [searchFlag, setSearchFlag] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setUsername(e.target.value);
    }

    const handleClick = async () => {
        // console.log(username);
        try {
            const result =  await request('GET /users/{username}/repos', {
                username: username,
                per_page: 10,
                sort: 'created'
            })
            console.log("useruser: ", username);
            console.log(result);
            setRepo(result);
            setHttpFlag(true);
            setInputFlag(true);
        } catch(err) {
            if (err.name === "HttpError") {
                setHttpFlag(false);
                setInputFlag(true);
            }
            if (username == '') {
                setHttpFlag(false);
                setInputFlag(false);
            }
            console.log("username", username);
        }
        console.log(repo);
        setSearchFlag(true);
        navigate(`/users/${username}/repos`);
    }

    console.log(httpFlag);

    console.log("continue");
    return ( 
        <div>
            {(searchFlag === false) ? (
            <div className="search">
                <input className="username" type="text" placeholder="Search" value={username} onChange={handleChange}></input>
                <button type="submit" className="searchBtn" onClick={handleClick} onKeyPress={(e) => e.key === 'Enter' && {handleClick}}>Enter</button>

            </div>
            ) : (<div />
                )}
            <div>  
                <Routes>
                    <Route path="/Repo_Quickview/" element={<div />}></Route>
                    <Route path="/users/:username/repos" element={
                        httpFlag ? (
                            // <Results repo={ repo } header={ username }/>
                            <Results_test username={ username } repo={ repo } />
                        ) : (
                            <div className="invalidDiv">
                                <Link to="/Repo_Quickview/" className="backToSearch" onClick={() => {window.location.href="/"}}>Back</Link>
                                <p className="invalid">No Match User!</p>
                            </div>
                        )} 
                    />
                    <Route path="/users//repos" element={
                        <div className="invalidDiv">
                            <Link to="/Repo_Quickview/" className="backToSearch" onClick={() => {window.location.href="/"}}>Back</Link>
                            <p className="invalid">Invalid Input!</p>
                        </div>
                    } />

                    <Route path="/users/:username/repos/:repoName" element={<RepoPage />}></Route>
                </Routes>
            </div>

        </div>
     );
}

export default Search;