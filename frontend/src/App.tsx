import './App.css'
import { DeploymentsTable } from './components/Tables/DeploymentsTable'
import { DeploymentForm } from './components/Forms/DeploymentForm'
import { CommitsTable } from './components/Tables/CommitsTable'
import { Tabs, Sidebar, Navbar, Button,Flowbite, DarkThemeToggle  } from 'flowbite-react'
import { HiAdjustments, HiClipboardList, HiUserCircle } from 'react-icons/hi';
import { MdCommit } from 'react-icons/md';
import {GrDeploy} from 'react-icons/gr'
import { customTheme } from './themes/customTheme'
import { DeploymentsPanel } from './components/Panels/DeploymentsPanel'
import { TestTable } from './components/Tables/test'
import { HiArrowSmRight, HiChartPie, HiInbox, HiShoppingBag, HiTable, HiUser, HiViewBoards } from 'react-icons/hi';
import axios from 'axios'
import { useQuery } from '@tanstack/react-query'
import { useEffect } from 'react'
import { Route, Routes } from 'react-router-dom'
import { Dashboard } from './components/Dashboard'
import { Link } from 'react-router-dom'
import { MdRocketLaunch } from "react-icons/md";
import { IoMdGitCommit } from "react-icons/io";



async function fetchUser(username){
  const res = await fetch(`/api/getdeployments`).then( res => res.json());
  return res;

}

function GithubUser({username}){
  const {isLoading, error, data} = useQuery({
    queryKey: ['username'],
    queryFn: () => fetchUser(username),
    refetchInterval: 5,
  })
  if (isLoading) return 'Loading...'

  if (error) return 'An error has occurred: ' + error.message
  console.log(data);
  return(
    <div>
      {data?.map( (item: any) => {
        return(
         <p> {item.id} | {item.container_name}</p>            
        )
      })}
        <p>{data.container_name}</p>
    </div>
  )
}

function Example() {
  const { isLoading, error, data } = useQuery({
    queryKey: ['repoData'],
    queryFn: () =>
      fetch('https://api.github.com/repos/TanStack/query').then(
        (res) => res.json(),
      ),
  })
  if (isLoading) return 'Loading...'

  if (error) return 'An error has occurred: ' + error.message

  return (
    <div>
      <h1>{data?.name}</h1>
      <p>{data?.description}</p>
      <strong>👀 {data?.subscribers_count}</strong>{' '}
      <strong>✨ {data?.stargazers_count}</strong>{' '}
      <strong>🍴 {data?.forks_count}</strong>
    </div>
  )
}



function App() {

  return (
    <div className="relative w-full h-full overflow-y-auto bg-gray-50 lg:ml-64 dark:bg-black">
      <div className="absolute top-0 right-0"><DarkThemeToggle /></div>
      
        <ul className="flex  items-center justify-center text-gray-900 dark:text-white w-full ">
          <li><Link to="/deployments" className="flex p-3" ><MdRocketLaunch /> Deployments</Link></li>
          <li><Link to="/commits" className="flex p-3"><IoMdGitCommit />Commits</Link></li>
        </ul>

    <Routes>
      <Route path="/deployments" element={<DeploymentsPanel />} />
      <Route path="/commits" element={<CommitsTable />} />
    </Routes>

    </div>
  )
}

export default App


 