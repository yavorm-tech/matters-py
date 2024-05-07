import './App.css'
import { Tabs, Sidebar, Navbar, Button,Flowbite, DarkThemeToggle  } from 'flowbite-react'
import { HiAdjustments, HiClipboardList, HiUserCircle } from 'react-icons/hi';
import { MdCommit } from 'react-icons/md';
import {GrDeploy} from 'react-icons/gr'
import { customTheme } from './themes/customTheme'
import { PersonPanel } from './components/Panels/PersonPanel.tsx'
import { PersonPropertyPanel } from './components/Panels/PersonPropertyPanel.tsx'
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
    <section className="bg-gray-50 dark:bg-black px-4 pt-6">
      <div className="absolute top-0 right-0 z-10"><DarkThemeToggle /></div>      
      <div className="mx-auto  px-4 lg:px-12 w-full">

        <nav className="bg-white dark:bg-gray-800 relative shadow-md sm:rounded-lg overflow-hidden mb-2">
          <ul className="flex  items-center justify-center text-gray-900 dark:text-white w-full ">
            <li><Link to="/person" className="flex p-3" ><MdRocketLaunch /> Persons</Link></li>
            <li><Link to="/person-property" className="flex p-3"><IoMdGitCommit />Person property</Link></li>
          </ul>
        </nav>
        <div className="bg-white dark:bg-gray-800 relative shadow-md sm:rounded-lg overflow-hidden p-3">
          <Routes>
            <Route path="/person" element={<PersonPanel />} />
            <Route path="/person-property" element={<PersonPropertyPanel />} />
          </Routes>
        </div>
      </div>
    </section>
  )
}

export default App


 