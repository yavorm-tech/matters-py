var BACKEND_URL = "/api"
var DEPLOYMENTS_PATH = `${BACKEND_URL}/getdeployments`;
var COMMITS_PATH = `${BACKEND_URL}/getcommits`;
var REPOS_PATH = `${BACKEND_URL}/getgitrepos`;
var REPO_BRANCHES_PATH = `${BACKEND_URL}/getgitrepos`;

//TODO 
import {getOperation, postOperation} from "./util";



export function getDeployments(){
    return getOperation(`${DEPLOYMENTS_PATH}`)
}
export function getCommits(){
    return getOperation(`${COMMITS_PATH}`)
}
export function getGitRepos(){
    return getOperation(`${REPOS_PATH}`)
}
export function getRepoBranches(){
    return getOperation(`${REPO_BRANCHES_PATH}`)
}

export function postDeployBranch(){
    return postOperation()
}