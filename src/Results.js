import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import * as React from 'react';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

import InfiniteScroll from "react-infinite-scroll-component";
import { request } from "@octokit/request";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: theme.palette.common.black,
      color: theme.palette.common.white,
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 17,
    },
  }));

  const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.action.hover,
    },
    // hide last border
    '&:last-child td, &:last-child th': {
      border: 0,
    },
  }));

const Results_test = (props) => {
 
    const { repo } = props;
    // console.log("REPOS: ", repo);
    const searchOwner = props.header;

    var repoInfoList = <li>hihi</li>;
    const [repoLen, setRepoLen] = useState(-1);
    const [repoOwner, setRepoOwner] = useState("");
    const [repoList, setRepoList] = useState([]);

    useEffect(() => {
        if (repo.data === undefined) {
            // console.log("repo data is undefined")
        }
        else {
            setRepoLen(Object.keys(repo.data).length);
            resetRepoList(Object.keys(repo.data).length);
        }
    }, [])


    const resetRepoList = (l) => {
        if (repo.data === undefined) {
            // console.log("repo data is undefined")
        }
        else if (l > 0) {
            let owner = repo.data[0].owner.login;
            setRepoOwner(owner);
            setRepoList(repo.data);
        }
        else {
            setRepoList("No Repos found!");
        }
    }

    const [hasMore, sethasMore] = useState((Object.keys(repo.data).length < 10) ? (false) : (true));
    const [page, setpage] = useState(2);

    const fetchComments = async () => {
        const res =  await request('GET /users/{username}/repos', {
            username: repoOwner,
            per_page: 10,
            sort: 'created',
            page: page
        })
        const data = res.data;
        // console.log("data: ", data)
        return data;
    };

    const fetchData = async () => {
        const commentsFormServer = await fetchComments();

        setRepoList([...repoList, ...commentsFormServer]);
        if (commentsFormServer.length === 0 || commentsFormServer.length < 10) {
            sethasMore(false);
        }
        setpage(page + 1);
    };

    return (
        <div className="results">
            <Link to="/Repo_Quickview/" className="backToSearch" onClick={() => {window.location.href="/Repo_Quickview/"}}>Back</Link>
            <header className="user">
                { repoOwner }
            </header>
            
            {(repoLen > 0) ? (<p className="sort">sorted by created time </p>):(<></>)}

            {(repoLen === -1) ? (
                <div></div>
                 ) : ((repoLen > 0) ? (
                    <InfiniteScroll
                        dataLength={repoList.length} //This is important field to render the next data
                        next={fetchData}
                        hasMore={hasMore}
                        loader={<h4 className="seenAll" style={{ textAlign: 'center' }}>Loading...</h4>}
                        endMessage={
                            <h4 className="seenAll" style={{ textAlign: 'center' }}>
                                <b>You have seen it all!</b>
                            </h4>
                        }
                    >
                        <TableContainer component={Paper}>
                            <Table sx={{ minWidth: 700 }} aria-label="customized table">
                                <TableHead>
                                <TableRow>
                                    <StyledTableCell>Repository Name</StyledTableCell>
                                    <StyledTableCell align="right">Description</StyledTableCell>
                                    <StyledTableCell align="right">Stars&nbsp;</StyledTableCell>
                                </TableRow>
                                </TableHead>
                                
                                <TableBody className="repoTable">
                                
                                    {repoList.map((item) => (
                                        <StyledTableRow hover role="checkbox" key={item.id}>
                                            <StyledTableCell className="tableRepoName" component="th" scope="row">
                                                <Link to={`/users/${repoOwner}/repos/${item.name}`}>
                                                    {item.name}
                                                </Link>
                                            </StyledTableCell>
                                            <StyledTableCell className="tableDescription" align="right">
                                                    <Link to={`/users/${repoOwner}/repos/${item.name}`}>
                                                        {item.description}
                                                    </Link>
                                                </StyledTableCell>
                                            <StyledTableCell className="tableStarCnt" align="right">
                                                <Link to={`/users/${repoOwner}/repos/${item.name}`}>
                                                    {item.stargazers_count}
                                                </Link>
                                            </StyledTableCell>
                                        </StyledTableRow>
                                    ))}
                                </TableBody>
                                
                            </Table>
                        </TableContainer>
                    </InfiniteScroll>
                    ) : (
                        <div className="noRepo">No Repositary found.</div>
                    )
                 )}
                 
        </div>
     );
}
 
export default Results_test;
