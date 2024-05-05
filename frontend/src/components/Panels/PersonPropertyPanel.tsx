import { AddPersonForm } from "../Forms/AddPersonForm.tsx";
import { PersonsTable } from "../Tables/PersonsTable.tsx";
import React,{FC, useState, useRef, useEffect, PropsWithChildren} from 'react';
import { Button, Modal,  Checkbox, Label, TextInput, CustomFlowbiteTheme } from 'flowbite-react';
import { useQuery } from "@tanstack/react-query";
import { buttonTheme } from "../../themes/buttonTheme";
import { CustomButton } from "../../Presentational/Button/CustomButton";
import { HiOutlineArrowRight } from "react-icons/hi";
import { modalTheme } from "../../themes/modalTheme";
import { PropertyTable } from "../Tables/PropertyTable.tsx";
import { AddPropertyForm } from "../Forms/AddPropertyForm.tsx";
import axios from "axios";
import { CustomButtonTable } from "../../Presentational/CustomButtonTable.tsx";


export interface Property {
  id: BigInteger,
  title: String,
  type: String,
  description: String,
  egn: String,
  action: () => {}
}
export const PersonPropertyPanel:FC<PropsWithChildren> = ({children}) => {
    const [openModal, setOpenModal] = useState<string | undefined>();
    const [modalPlacement, setModalPlacement] = useState<string>('center');
    const [deleteModal, setDeleteModal] = useState(false)
    const [inProgress, setInProgress] = useState(false)
    const [hasError, setHasError] = useState(false)
    const [delConfirm, setDelConfirm] = useState(false)


    const [email, setEmail] = useState("");
    const props = { openModal, setOpenModal, email, setEmail, setModalPlacement, modalPlacement };
  
    const deletePersonProperty = (cur_records:any) => {
      let ids:BigInteger[] = []
      console.log(cur_records)
      cur_records.forEach( (elem:any) => {
        ids.push(elem.original.id)
      })
      let headers = {
        'Content-Type': 'application/json'
      }
      console.log(ids)
      setInProgress(true)
      ids.forEach( (id) => {
        console.log(id)
        axios.delete(`/api/person-property/${id}`, {
          headers: headers
        }).then( (res) => {
          console.log(res);
          setInProgress(false)
          //table.resetRowSelection() // this might be a problem
          return (
            person_property.refetch()
          )
        })
      })          
      
    }
    const editPersonProperty = (cur_record:any) => {
      console.log(cur_record[0].original.id)
      let ids:BigInteger[] = []
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
            person_property.refetch()
          }else{
            setHasError(true)
            setOpenModal('undefined')
          }
        })
 
    }
    const person_property = useQuery({
      queryKey: ['person_prop'],
      queryFn: () => fetch("/api/person-property").then( (res) => res.json()),
      refetchInterval: 30000,
      refetchOnWindowFocus: true,
    })

  
    return (
        <div>
        <Modal show={props.openModal === 'dismissible'} size="3xl" popup onClose={() => props.setOpenModal(undefined)} position="center" theme={modalTheme} >
        <Modal.Header>Add new person</Modal.Header>
        <Modal.Body>
          <AddPropertyForm test="one" action={() => setOpenModal('undefined')} onSubmit={onSubmit} />
        </Modal.Body>
      </Modal>
      
        <div className="flex flex-col md:flex-row items-stretch md:items-center md:space-x-3 space-y-3 md:space-y-0 justify-between mx-4 py-4 border-t dark:border-gray-700">
          {person_property.isSuccess ?
          <PropertyTable  deleteButtonMethod={deletePersonProperty}
                          editButtonMethod={editPersonProperty} 
                          newButtonMethod = { () => setOpenModal('dismissible') }
                          data={person_property.data}
                          />
                          : ''}
                          
        </div>
      </div>
        
    )
}
