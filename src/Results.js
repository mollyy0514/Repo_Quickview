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

import UseRepoSearch from "./UseRepoSearch";

const loadFunc = () => {
    if(!this.state.isLoading) {
      this.props.fetchItems();
    }
  }

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

const Results = (props) => {

    const { repo } = props;
    console.log("REPOS: ", repo);
    const searchOwner = props.header;

    var repoInfoList = <li>hihi</li>;
    const [repoLen, setRepoLen] = useState(-1);
    const [repoOwner, setRepoOwner] = useState("");
    const [repoList, setRepoList] = useState([]);

    useEffect(() => {
        if (repo.data === undefined) {
            console.log("repo data is undefined")
        }
        else {
            setRepoLen(Object.keys(repo.data).length);
            // console.log("repolen setted", repo.data, repoLen, Object.keys(repo.data).length)
            resetRepoList(Object.keys(repo.data).length);
        }
        // console.log(typeof(repo));
    }, [])



    const resetRepoList = (e) => {
        if (repo.data === undefined) {
            console.log("repo data is undefined")
        }
        else if (e > 0) {
            let owner = repo.data[0].owner.login;
            let newArray = [];

            repo.data.map((item) => {
                var info = {
                    id: '',
                    owner: '',
                    name: '',
                    starCnt: '',
                    description: '',
                }
                info.id = item.id;
                info.owner = searchOwner;
                info.name = item.name;
                info.starCnt = item.stargazers_count;
                info.description = item.description;

                newArray.push(info);
                console.log("debug: ", newArray);
                
            })
            // console.log("final input: ", newArray);
            setRepoOwner(owner);
            setRepoList(newArray);
        }
        else {
            setRepoList("No Repos found!");
            // console.log("nothing...")
        }
    }

    return (
        <div className="results">
            <Link to="/Repo_Quickview/" className="backToSearch" onClick={() => {window.location.href="/Repo_Quickview/"}}>Back</Link>
            <header className="user">
                { repoOwner }
            </header>
            
            {(repoLen > 0) ? (<p className="sort">sorted by created time </p>):(<></>)}
            
            {/* <ul>
                {(repoLen === -1) ? (
                    repoInfoList = <li></li>
                 ) : ((repoLen > 0) ? (
                        repoInfoList = repoList.map((item) => 
                        <li className="repoList" key={ item.id }>
                            <Link to={`/users/${repoOwner}/repos/${item.name}`}>
                                { item.name } { item.starCnt }
                            </Link>
                        </li>)
                    ) : (
                        repoInfoList = <li className="noRepo">No Repositary found.</li>
                    )
                 )}
            </ul> */}

            {(repoLen === -1) ? (
                repoInfoList = <li></li>
                 ) : ((repoLen > 0) ? (
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
                                {repoInfoList = repoList.map((item) => (
                                    <StyledTableRow hover role="checkbox" key={item.id}>
                                        <StyledTableCell className="tableRepoName" component="th" scope="row">
                                            <Link to={`/users/${repoOwner}/repos/${item.name}`}>
                                                {item.name}
                                            </Link>
                                        </StyledTableCell>
                                        <StyledTableCell className="starCnt" align="right">
                                                <Link to={`/users/${repoOwner}/repos/${item.name}`}>
                                                    {item.description}
                                                </Link>
                                            </StyledTableCell>
                                        <StyledTableCell className="starCnt" align="right">
                                            <Link to={`/users/${repoOwner}/repos/${item.name}`}>
                                                {item.starCnt}
                                            </Link>
                                        </StyledTableCell>
                                    </StyledTableRow>
                                ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    ) : (
                        repoInfoList = <li className="noRepo">No Repositary found.</li>
                    )
                 )}
        </div>
     );
}
 
export default Results;
