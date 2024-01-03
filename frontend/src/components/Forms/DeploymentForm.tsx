import React,{FC, useState, useRef, useEffect} from 'react';
import axios from 'axios';
import { Button } from 'flowbite-react';
import { getGitRepos, getRepoBranches } from '../../apis';
import { Circles } from 'react-loading-icons';
import Oval from 'react-loading-icons/dist/esm/components/oval';
import {defineConfig} from 'vite'

/*TODO add     git_url = "git@github.com:Payarc/payarc3.0.git" */

//const test = getGitRepos().then( (res) => console.log(res)).catch( (error) => console.log(error));
const backend_url = "/api"

interface DeploymentFormProps {
    test: string,
    action(): void
}
interface repoOptions {
    name: string,
    value: string,
}
interface Branches {
    label: string
}

export const DeploymentForm: FC<DeploymentFormProps> = (props) => {
    const inputRef = useRef<HTMLInputElement | null>(null);
    const [isloading, setIsloading] = useState(false);
    const [branch, setBranch] = useState('');
    const [repo, setRepo] = useState('payarc3.0');
    const [reposlist, setReposlist]= useState<repoOptions[] | undefined>([])
    const [repobranches, setRepobranches] = useState<string[] | undefined | null>([])
    const [repobranchesform, setRepobranchesForm] = useState<string[] | undefined | null>([])
    const [showSuggestions, setShowSuggestions] = useState(false);
    const dropdownRef = useRef();
    const my_list: string[] =[];
    useEffect( () => {
//        console.log(import.meta.env)
console.log(backend_url);
        if (!inputRef.current){
            return;
        }
        inputRef.current.focus()
    }, [])
    useEffect( () => {
        setIsloading(true);
        getGitRepos().then( (res) => { 
            setIsloading(false); 
            setReposlist(res);
            res.unshift({name:'', value: ''});
            console.log(res);
        }).catch( (error) => console.log(error));
    }, [])

    useEffect( () => {
        const handleOutsideClick = (event: React.MouseEvent<HTMLElement>) => {
            if(dropdownRef.current && ! dropdownRef.current.contains(event.target))
            {
                setShowSuggestions(false);
            }
        }
        document.addEventListener('click', handleOutsideClick)
        return () => {
            document.removeEventListener('click', handleOutsideClick)
        }
    }, [])

    useEffect( () => {
        const timer = setTimeout( () => {
            console.log(repo);
            console.log(repobranches);
            console.log('change')
            let filteredvalues = repobranches?.filter( (repobranch) => repobranch.label.toLowerCase().startsWith(inputRef.current?.value.toLowerCase()));
            setRepobranchesForm(filteredvalues);
            console.log(filteredvalues);

            //make a request to backend to receive all branches of the repository
            
        }, 1000);
        return () => {
            setIsloading(false);
            clearTimeout(timer);
        }
        
    }, [branch])

    const onClick = () => {
        const headers = {
            'Content-Type':'application/json',
        }
        if((branch == undefined || branch === '')){
            console.log("variables are defined");
            props.action();
        }else{
            console.log("deployment initiated");
            axios.post(`${backend_url}/deploy-branch`, {
                branch: branch,
                repo_name: repo,
                headers: headers            
            }).then(function(response) {
                console.log(response)
                if(response.data.error){
                    console.log("error:",response.data.error)
                }
            }).catch(function(error) {
                console.log(error);
            })
            props.action();
            }
    }

    const populateBranches = (repo:string) => {
        setIsloading(true)
        setRepo(repo);
        setRepobranches([])
        setRepobranchesForm([])
        console.log(repo);
        const headers = {
            'Content-Type':'application/json',
        }

        //make a request to backend to receive all branches of the repository
        axios.get(`${backend_url}/getrepobranches/${repo}`, {
                headers: headers            
            }).then(function(response) {
                setIsloading(false);
                setRepobranches(response.data);
                setRepobranchesForm(response.data)
                console.log(response.data)
                if(response.data.error){
                    console.log("error:",response.data.error)
                }
            }).catch(function(error) {
                console.log(error);
            })

    }

    const filterBranches = (e:React.ChangeEvent<HTMLInputElement>) => {
        setBranch(e.target.value);
        // if(e.target.value.length == 0){
        //     setIsloading(true)
        //     setBranch('');
        //     populateBranches(repo);
        // }else{
        //     setBranch(inputRef.current.value);
        //     let filteredvalues = repobranches?.filter( (repobranch) => repobranch.label.toLowerCase().includes(inputRef.current?.value.toLowerCase()))
        //     setRepobranches(filteredvalues);
        // }
    }

    const handleSuggestions = (suggestions:string) => {
        setRepobranches(null);
        setBranch(suggestions);
        setShowSuggestions(false);
       
    }
    
    return (
        <div>
            {isloading ? <Oval width={30}/>: ''}
            <p>Repository </p>
            <select onChange={(e) => {populateBranches(e.target.value)}} >
                {reposlist.map( (opt) => {
                    return (
                        <option key={opt.name} value={opt.name}>{opt.name}</option>
                    )
                })}
            </select>

            Branch 
            <div className="w96 mt-3" ref={dropdownRef}>
                <input className="border-0 w-96 m-2 text-lg p-0" ref={inputRef} value={branch} onChange={(e) => filterBranches(e)} 
                            onFocus={() => setShowSuggestions(true)} />
                {showSuggestions && (
                    <ol className="list-none m-0 p-0 border-t-1 bg-transparent rounded-md">
                        
                        {repobranchesform?.map( (i,v) => {
                        return (
                            <li key={v} className="list-none p-1 cursor-pointer hover:bg-slate-400" onClick={() => handleSuggestions(i.label)}>{i.label}</li>    
                        )
                    })}
                    
                    </ol>
                )}
                                    </div>

                        
            <button onClick={onClick}>Deploy</button>
        </div>
    )
}
