# :space_invader:Repository Quickview

This project is designed to search a user's repository list, and view their basic information easily.

The project comprises of:

* An searching page
* An searching results page
* Every repositary owns a self-introduction page.

The project is deployed at github-pages: [https://mollyy0514.github.io/Repo_Quickview/](https://mollyy0514.github.io/Repo_Quickview/)

## Table of Contents
- [Repositary Quickview](#Repositary-Quickview)
    - [Quick Start](#Quick-Start)
      - [Run](#Run)
      - [Search](#Search)
        - [Not seeing the expected output?](#Not-seeing-the-expected-output?)
      - [Repository List](#Repository-List)
      - [Single Repositary Page](#Single-Repositary-Page)
    - [Framework](#Framework)
        - [Search.js](#Search.js)
            - [GitHub API request](#GitHub-API-request)
            - [HttpError](#HttpError)
        - [Results.js](#Results.js)
            - [Reposiory list](#Repository-List)
            - [Infinite scroll component](#Infinite-scroll-component)
        - [RepoPage.js](#RepoPage.js)
            - [GitHub API request](#GitHub-API-request)
        - [Routes](#Routes)

## Quick Start

### Run

To run the project, run this command:

```bash
$ npm run start
```

### Search

After entering the page, you can enter any username you want. If the user is validate, you will be link to the page which shows a list of repositories.

#### Not seeing the expected output?

- If you see the result page displays `No Match User!`, please try again and be sure that you've enter the right username.
- Do not click enter without input anything, you will be shown `Invalid Input!`.

> :warning: Note that there's no difference between uppercase and lowercase in the current version.

### Repositary List

In the repositary list page, with the username in header, after scrolling down to the bottom of the page, it will automatically fetch more data via the [GitHub Rest API](https://docs.github.com/en/rest) until there's no more repositary.

The result list will contain the repositary name, description, and star count.

### Single Repositary Page

Users can click in to any repositary, and it will show a page of the repositary which contains full name, star counts, created time, and description, as well as a link to the original repositary's URL.


## Framework

The data is requested from:

- [List repositories for a user](https://docs.github.com/en/rest/reference/repos#list-repositories-for-a-user)
- [Get a repository](https://docs.github.com/en/rest/reference/repos#get-a-repository)
- [octokit.request](https://github.com/octokit/request.js/)


### Search.js

#### GitHub API request
The initial request may be like this if we would like to request repository of  `mollyy0514`, and the maximum results per page is set to be 10, as well as it is sorted by their created time.

```javascript
const result =  await request('GET /users/{username}/repos', {
                    username: 'mollyy0514',
                    per_page: 10,
                    sort: 'created'
                })
```
#### HttpError
If the input username is unvalaible, it will report a HttpError, and the page will display `No Match User!`. You can click the `Back` button to get back to the initial searching page.

In addition, if you input nothing and click enter, it will show `Invalid Input!`

### Results.js

After clicking the `Search` button, `Results` will be called.

#### Repository list

In Results.js, the initial results will be passed by Search.js, and by using `map` function to construct an array `repoList`, which every item in this array is an object.

#### Infinite scroll component

The method that I used to triggered API re-render every time as scrolling down to the bottom of the page is
[React-infinite-scroll-component](https://www.npmjs.com/package/react-infinite-scroll-component).

Below is the code from documentation:
```javascript
import InfiniteScroll from 'react-infinite-scroll-component';

<InfiniteScroll
    dataLength={repoList.length} //This is important field to render the next data
    next={fetchData}
    hasMore={hasMore}
    loader={<h4 className="seenAll" style={{ textAlign: 'center' }}>Loading...</h4>}
    endMessage={<h4 className="seenAll" style={{ textAlign: 'center' }}>
                    <b>You have seen it all!</b>
                </h4>}
>
    // function that deals with what to print out
</ InfiniteScroll>
```

- `fetchData` function is used to fetch data from GiHub API if there's more data to fetch. If so, it will return the data to `hasMore` function.
- `hasMore` function is set to check whether there's more data to fetch, adding page, and append data which returned by `fetchData` funciton.
- If there's still more than 10 repository in this GitHub user, as scrolling down to the bottom, it will show `Loading...` while fetching, and it there's no more data to get, `You have seen it all!` will be shown in the bottom.

### RepoPage.js

#### GitHub API request

After entering a single repositary page, it will request the repository data from the API, the method is the same as I did in [Search.js](#Search.js).

The whole information of the repository is stored as an object, which the variable name is `repoInfo`.


### Routes
- Initial path: `/`
- After entering a username, the route will be changed to: `/users/{username}/repos`, no matter the user is valid or not.
- If we click the `Back` button, the route will link to the initial path again.
- As clicking one of the repository, the route is set to be `/users/{username}/repos/{repoName}`.
- The `Back` button in a single repositary page, is link back to the repository list page.
