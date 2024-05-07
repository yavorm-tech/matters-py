import React,{FC, useState, useRef, useEffect, PropsWithChildren} from 'react';
import { Button, Modal,  Checkbox, Label, TextInput, CustomFlowbiteTheme } from 'flowbite-react';
import { useQuery } from "@tanstack/react-query";
import { buttonTheme } from "../../themes/buttonTheme";
import { HiOutlineArrowRight } from "react-icons/hi";
import { modalTheme } from "../../themes/modalTheme";
import { PropertyForm } from "../Forms/PropertyForm.tsx";
import axios from "axios";
import { ColumnDef } from "@tanstack/react-table";
import { IndeterminateCheckbox } from "../Functional/IndeterminateCheckbox.tsx"
import { AbstractTable } from "../Tables/AbstractTable.tsx";
import { ImSpinner9 } from "react-icons/im";

export interface PropertyInterface {
  id: BigInteger,
  title: String,
  type: String,
  description: String,
  egn: String,
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
        const {title, type, description} = rec.target
        axios.post('/api/person-property', {
            headers: headers,
            title: title.value,
            type: type.value,
            description: description.value,
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
      refetchInterval: 0,
      refetchOnWindowFocus: true,
    })

    const columns: ColumnDef<PropertyInterface>[] = [
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
        accessorKey: 'title',
        id: 'title',
        cell: info => info.getValue(),
        header: () => <span>Title</span>,
        size: 100,
      },
      {
        accessorKey: 'type',
        header: () => 'Type',
        cell: info => <> {info.renderValue() == '0' ? "Movable" : 'Real Estate'}</>,
        footer: info => info.column.id,
        size: 50
        
      },
      {
        accessorKey: 'description',
        header: () => 'Description',
        cell: info => info.renderValue(),
        footer: info => info.column.id,
        size: 500
      },
      {
        accessorKey: 'egn',
        header: () => 'Owner Egn',
        cell: info => info.renderValue(),
        footer: info => info.column.id,
        size: 100
      }
    ]
    return (
        <div>
        <Modal show={props.openModal === 'dismissible'} size="3xl" popup onClose={() => props.setOpenModal(undefined)} position="center" theme={modalTheme} >
        <Modal.Header><div className="dark:text-blue-700">Add new property</div></Modal.Header>
        <Modal.Body>
          <PropertyForm action={() => setOpenModal('undefined')} onSubmit={onSubmit} />
        </Modal.Body>
      </Modal>
      
        <div className="flex flex-col md:flex-row items-stretch md:items-center md:space-x-3 space-y-3 md:space-y-0 justify-between mx-4 py-4 border-t dark:border-gray-700">
          {inProgress ? <ImSpinner9 className="loading-icon" /> : ""} 
          {person_property.isSuccess ?
          <AbstractTable  deleteButtonMethod={deletePersonProperty}
                          editButtonMethod={editPersonProperty} 
                          newButtonMethod = { () => setOpenModal('dismissible') }
                          data={person_property.data}
                          columns={columns}
                          />
                          : ''}                          
        </div>
      </div>
        
    )
}
