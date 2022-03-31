import { useEffect, useState } from 'react'
import { request } from "@octokit/request";

export default function UseRepoSearch(username, pageNumber) {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [repos, setRepos] = useState([]);
    const [hasMore, setHasMore] = useState(false);

    useEffect(async () => {
        const result =  await request('GET /users/{username}/repos', {
            username: username,
            per_page: 10,
            sort: 'created',
            page: pageNumber
        }).then(res => {
            console.log(res.data);
            setRepos(prevRepos => {
                return [...new Set([...prevRepos, ...res.data.map(b => b.name)])]
                })
                setHasMore(res.data.length > 0);
                setLoading(false);
        })
        // .catch(e => {
        //     if (axios.isCancel(e)) return
        //     setError(true)
        //     })
        // return () => cancel()

    }, [username, pageNumber])

    return { loading, error, repos, hasMore }
}
