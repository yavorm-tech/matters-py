import { AddPersonForm } from "../Forms/AddPersonForm.tsx";
import { PersonsTable } from "../Tables/PersonsTable.tsx";
import React,{FC, useState, useRef, useEffect, PropsWithChildren} from 'react';
import { Button, Modal,  Checkbox, Label, TextInput, CustomFlowbiteTheme } from 'flowbite-react';
import { buttonTheme } from "../../themes/buttonTheme";
import { CustomButton } from "../../Presentational/Button/CustomButton";
import { HiOutlineArrowRight } from "react-icons/hi";
import { modalTheme } from "../../themes/modalTheme";
import {AddNewPersonForm} from "../Forms/AddNewPersonForm.tsx";
import { CustomButtonTable } from "../../Presentational/CustomButtonTable.tsx";
import axios from "axios";
import { ImSpinner9 } from "react-icons/im";
import "./PersonPanel.css"
import { QueryClient, QueryClientProvider, useQuery, useQueryClient } from "@tanstack/react-query";
import Test from "./test.tsx"

async function getPersons() {
  return fetch(`https://api.github.com/users/${username}`)
    .then((res) => res.json());
};
const User = ({username}) => {
  const userQuery = useQuery(["user", username], getPersons,)
  if (userQuery.isLoading) {
    return <p>Getting user...</p>;
  }
  
  if (userQuery.error) {
    return (
      <p>Error getting user: {userQuery.error.message}</p>
    );
  }

  return <p>{userQuery.data.name}</p>;
}
export const PersonPanel:FC<PropsWithChildren> = ({children}) => {
    const [openModal, setOpenModal] = useState<string | undefined>();
    const [modalPlacement, setModalPlacement] = useState<string>('center');
    const [email, setEmail] = useState("");
    const [inProgress, setInProgress] = useState<Boolean | undefined>(false)
    const props = { openModal, setOpenModal, email, setEmail, setModalPlacement, modalPlacement };
    const [reloaded, setReloaded] = useState(false)
    const [onDeleteError, setOnDeleteError] = useState<String>('')
    const [onDeleteErrorModal, setOnDeleteErrorModal] = useState<boolean | undefined>(false)
    const [onNewError, setOnNewError] = useState<Boolean | undefined>(false)
    const queryClient = useQueryClient()
    const deletePersons = (cur_records:any) => {
      let ids:BigInteger[] = []
      
      cur_records.forEach( (elem:any) => {
        ids.push(elem.original.id)
      })
      let headers = {
        'Content-Type': 'application/json'
      }
      setInProgress(true)
      console.log(ids)
      ids.forEach( (id) => {
        axios.delete(`/api/person/${id}`, {
          headers: headers
        }).then( (res) => {
          setInProgress(false)
          //table.resetRowSelection() // this might be a problem
          return (
            console.log(res),
            persons.refetch()
          )
        }).catch( (error) => {
          setInProgress(false)
          setOnDeleteError(error.response.data)
          setOnDeleteErrorModal(true)
          console.log(error.response.data)
          return(error.response.data)
        })
      })
    }
    const editPerson = () => {

    }
    const onSubmit = (rec) => {
        // Do something with form data
        let headers = {"Content-Type":"application/json"}
        const {fName, mName, lName,egn,eik,fpn} = rec.target
        axios.post('/api/person', {
            headers: headers,
            fname: fName.value,
            mname: mName.value,
            lname: lName.value,
            egn: egn.value,
            eik: eik.value,
            fpn: fpn.value,
        }).then( (res) => {
          if(res.status == 200){
            setOpenModal('undefined')
            persons.refetch()
          }else{
            setOnNewError(true)
            setOpenModal('undefined')
          }
        })
 
    }
    const OnDeleteErrorBox = () => {
      return(
        <div>
          <Modal show={onDeleteErrorModal} onClose={() => setOnDeleteErrorModal(false)}>
          <Modal.Header>
            Delete Error
          </Modal.Header>
          <Modal.Body>
            <div className="space-y-6">
              <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400 text-center" >
                {onDeleteError}
              </p>
            </div>
          </Modal.Body>
          <Modal.Footer className="flex flex-row justify-evenly">
            <Button onClick={() => {
               setOnDeleteErrorModal(false)
              }}>Ok</Button>
          </Modal.Footer>
        </Modal>
      </div>
    )}
    const persons = useQuery({
      queryKey: ['persons'],
      queryFn: () => fetch("/api/person").then( (res) => res.json()),
      refetchInterval: 30000,
      refetchOnWindowFocus: true,
    })
    return (
        <div>
        <OnDeleteErrorBox />
        <Modal show={props.openModal === 'dismissible'} size="3xl" popup onClose={() => props.setOpenModal(undefined)} position="center" theme={modalTheme} >
            <Modal.Header><div className="text-blue-700 "> Add new person</div></Modal.Header>
        <Modal.Body>
          <AddPersonForm test="one" action={() => setOpenModal('undefined')} onSubmit={onSubmit} />
        </Modal.Body>
      </Modal>
        {inProgress ? <ImSpinner9 className="loading-icon" /> : ""} 
          {persons.isSuccess ? 
          <PersonsTable newButton={CustomButton}
                        Button={CustomButtonTable} 
                        editButtonMethod={editPerson} 
                        deleteButtonMethod={deletePersons} 
                        newButtonMethod = { () => setOpenModal('dismissible') }
                        data={persons.data}
          />: ''
          }
        </div>
    )
}