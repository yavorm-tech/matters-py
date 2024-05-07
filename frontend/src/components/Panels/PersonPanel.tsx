import React,{FC, useState, useRef, useEffect, PropsWithChildren} from 'react';
import { Button, Modal,  Checkbox, Label, TextInput, CustomFlowbiteTheme } from 'flowbite-react';
import { buttonTheme } from "../../themes/buttonTheme";
import { HiOutlineArrowRight } from "react-icons/hi";
import { modalTheme } from "../../themes/modalTheme";
import axios from "axios";
import { ImSpinner9 } from "react-icons/im";
import "./PersonPanel.css"
import { QueryClient, QueryClientProvider, useQuery, useQueryClient } from "@tanstack/react-query";
import Test from "./test.tsx"
import { IndeterminateCheckbox } from "../Functional/IndeterminateCheckbox.tsx"
import { AbstractTable } from "../Tables/AbstractTable.tsx";
import { ColumnDef, RowSelection } from "@tanstack/react-table";
import { Edit } from "lucide-react";
import { PersonForm } from "../Forms/PersonForm.tsx";

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
export type Person = {
  id?: BigInteger,
  first_name: String,
  middle_name: String,
  last_name: String,
  egn: BigInt,
  eik: BigInt,
  fpn: BigInt,
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
    const [showEditModal, setShowEditModal] = useState<string | undefined>()
    const [editRecordData, setEditRecordData] = useState<Person | undefined>()
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
    const editPerson = (rec?:any) => {
      let selectedIndex = Object.getOwnPropertyNames(rec)[0]
      const {id,first_name,middle_name,last_name,egn,eik,fpn} = rec[selectedIndex].original
      let data:Person = {
          id: id,
          first_name: first_name,
          middle_name: middle_name,
          last_name: last_name,
          egn: egn,
          eik: eik,
          fpn: fpn
      }
      setEditRecordData(data)
      setShowEditModal("dissmissible")

    }
    const onSubmit = (rec) => {
        // Do something with form data
        console.log(rec.target)
        let headers = {"Content-Type":"application/json"}
        const {first_name, middle_name, last_name,egn,eik,fpn} = rec.target
        axios.post('/api/person', {
            headers: headers,
            first_name: first_name.value,
            middle_name: middle_name.value,
            last_name: last_name.value,
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
    const onSubmitEdit = (rec) => {
      console.log(rec)
      // Do something with form data
      let headers = {"Content-Type":"application/json"}
      const {first_name, middle_name, last_name,egn,eik,fpn} = rec.target
      const {id} = editRecordData
      axios.put(`/api/person/${id}`, {
        headers: headers,
        first_name: first_name.value,
        middle_name: middle_name.value,
        last_name: last_name.value,
        egn: egn.value,
        eik: eik.value,
        fpn: fpn.value,
    }).then( (res) => {
      if(res.status == 201){
        setShowEditModal('undefined')
        setEditRecordData(undefined)
        persons.refetch()
      }else{
        setOnNewError(true)
        setShowEditModal('undefined')
      }
    }).catch( (error) => {
      console.log(error)
      setShowEditModal('undefined')
      persons.refetch()
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
    const columns: ColumnDef<Person>[] = [
      {
        accessorKey: 'select',
        header: ({ table }) => (
            <div className="w-6">
            <IndeterminateCheckbox
                {...{
                  checked: table.getIsAllRowsSelected(),
                  indeterminate: table.getIsSomeRowsSelected(),
                  onChange: table.getToggleAllRowsSelectedHandler(),
                }}
            />
            </div>
        ),
        cell: ({ row }) => (
            <div className="">
              <IndeterminateCheckbox
                  {...{
                    checked: row.getIsSelected(),
                    indeterminate: row.getIsSomeSelected(),
                    onChange: row.getToggleSelectedHandler(),
                  }}
              />
            </div>
        ),
        size: 20,
      },
      {
        accessorKey: 'id',
        header: () => <div className="w-4">Id</div>,
        cell: info => <div>{info.getValue()}</div>,
        size: 30,
      },
      {
        accessorKey: 'first_name',
        cell: info => info.getValue(),
        header: () => <span>First Name</span>,
        size: 100,
      },
      {
        accessorKey: 'middle_name',
        header: () => 'Middle Name',
        cell: info => info.renderValue(),
        size: 100
        
      },
      {
        accessorKey: 'last_name',
        header: () => 'Last Name',
        cell: info => info.renderValue(),
        size: 100
      },
      {
        accessorKey: 'egn',
        header: () => 'Egn',
        cell: info => info.renderValue(),
        size: 100
      },
      {
        accessorKey: 'eik',
        header: () => 'Eik/Bulstat',
        cell: info => info.renderValue(),
        size: 100
      },
      {
        accessorKey: 'fpn',
        header: () => 'Foreign Person N',
        cell: info => info.renderValue(),
        size: 100
      }
    ]
    const EditRecord = () => {
      return (
        <div>
          <Modal show={showEditModal === 'dissmissible'} size='3xl' popup onClose={() => setShowEditModal('undefined')} position='center' theme={modalTheme}>
          <Modal.Header><div className="text-blue-700 ">Edit Person</div></Modal.Header>
            <Modal.Body>
              <PersonForm data={editRecordData} action={() => setShowEditModal('undefined')} onSubmit={onSubmitEdit}/> 
            </Modal.Body>
          </Modal>
        </div>
      )
    }
    return (
        <div>
        <OnDeleteErrorBox />
        <Modal show={props.openModal === 'dismissible'} size="3xl" popup onClose={() => props.setOpenModal(undefined)} position="center" theme={modalTheme} >
            <Modal.Header><div className="text-blue-700 "> Add new person</div></Modal.Header>
        <Modal.Body>
          <PersonForm action={() => setOpenModal('undefined')} onSubmit={onSubmit} />
        </Modal.Body>
      </Modal>
      <EditRecord />
      <div className="flex flex-col md:flex-row items-stretch md:items-center md:space-x-3 space-y-3 md:space-y-0 justify-between mx-4 py-4 border-t dark:border-gray-700">

        {inProgress ? <ImSpinner9 className="loading-icon" /> : ""} 
          {persons.isSuccess ? 
          <AbstractTable editButtonMethod={editPerson} 
                         deleteButtonMethod={deletePersons} 
                         newButtonMethod = { () => setOpenModal('dismissible') }
                         data={persons.data}
                         columns = {columns}
          />: ''
          }
        </div>
      </div>
    )
}