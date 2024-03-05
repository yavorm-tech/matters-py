import React, { useState } from 'react';
import { createColumnHelper, flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table';
import { useQuery } from '@tanstack/react-query';
import {Dropdown} from "flowbite-react";
import axios from "axios";
import {get_persons_url, delete_persons_url} from "../../apis/util.tsx";

type Person = {
  id: BigInteger,
  first_name: String,
  middle_name: String,
  last_name: String,
  egn: BigInt,
  eik: BigInt,
  ssn: BigInt
  fpn: BigInt,
  action: () => {}
}

function IndeterminateCheckbox({
                                 indeterminate,
                                 className = '',
                                 ...rest
                               }: { indeterminate?: boolean } & HTMLProps<HTMLInputElement>) {
  const ref = React.useRef<HTMLInputElement>(null!)

  React.useEffect(() => {
    if (typeof indeterminate === 'boolean') {
      ref.current.indeterminate = !rest.checked && indeterminate
    }
  }, [ref, indeterminate])

  return (
      <input
          type="checkbox"
          ref={ref}
          className={className + ' cursor-pointer'}
          {...rest}
      />
  )
}

const columnHelper = createColumnHelper<Person>();



export const PersonsTable = () => {
  const [persons, setPersons] = useState([]);
  const [globalFilter, setGlobalFilter] = React.useState('')
  const [rowSelection, setRowSelection] = React.useState({})
  const [inProgress, setInProgress] = React.useState(false)


  // const deletePersons = () => {
  //   let cur_records = table.getSelectedRowModel().flatRows
  //   setInProgress(false)
  // }
  const deletePersons = () => {
    let cur_records = table.getSelectedRowModel().flatRows
    setInProgress(true)
    cur_records.forEach( (elem) => {
      axios.delete(`${delete_persons_url}/${elem.original.id}`).then(
          (res) => {
            console.log("deleted record with id " + elem.original.id)
          }
      )
    })
    table.resetRowSelection()
    setInProgress(false)

  }
  const executeAShell = () => {
    console.log("execute a shell into selected containers")
  }

  const columns = [
    columnHelper.accessor('select',{
      header: ({ table }) => (
          <IndeterminateCheckbox
              {...{
                checked: table.getIsAllRowsSelected(),
                indeterminate: table.getIsSomeRowsSelected(),
                onChange: table.getToggleAllRowsSelectedHandler(),
              }}
          />
      ),
      cell: ({ row }) => (
          <div className="px-1">
            <IndeterminateCheckbox
                {...{
                  checked: row.getIsSelected(),
                  indeterminate: row.getIsSomeSelected(),
                  onChange: row.getToggleSelectedHandler(),
                }}
            />
          </div>
      ),
    }),
    columnHelper.accessor('id',{
      cell: info => info.getValue()
    }),
    columnHelper.accessor(row => row.first_name,{
      id: 'first_name',
      cell: info => info.getValue(),
      header: () => <span>First name</span>
    }),
    columnHelper.accessor('middle_name', {
      header: () => 'Middle Name',
      cell: info => info.renderValue(),
      footer: info => info.column.id,
      
    }),
    columnHelper.accessor('last_name', {
      header: () => 'Last Name',
      cell: info => info.renderValue(),
      footer: info => info.column.id,
    }),
    columnHelper.accessor('egn', {
      header: () => 'EGN',
      cell: info => info.renderValue(),
      footer: info => info.column.id,
    }),
    columnHelper.accessor('eik', {
      header: () => 'EIK/Bulstat',
      cell: info => info.renderValue(),
      footer: info => info.column.id,
    }),
    columnHelper.accessor('fpn', {
      header: () => 'Foreign Person №',
      cell: info => info.renderValue(),
      footer: info => info.column.id,
    }),
  ]
  const rerender = React.useReducer(() => ({}), {})[1]

  // async function fetchUser(){
  //   const res = await fetch(`/api/getdeployments`).then( res => res.json());
  //   return res;
  // }

  // async function fetchDeployments(){
  //   const res = await fetch(`/api/getdeployments`).then(res => res.json());
  //   return res;
  // }


  // const {isLoading, error, data, isFetched} = useQuery({
  //   queryKey: ['username'],
  //   queryFn: () => fetchDeployments(),
  //   refetchInterval: 5,
  // })


  React.useEffect(() => {

  }, []);

  const {isLoading, error, data, isFetched} = useQuery({
    queryKey: ['persons'],
    queryFn: () => fetch(get_persons_url).then( (res) => res.json()),
    refetchInterval: 30000,
  })
  if(data){
    console.log(data);
  }else{
    console.log('empty');
  }
  const table = useReactTable({
    data, 
    columns, 
    getCoreRowModel: getCoreRowModel(),
    enableRowSelection: true,
    state: {
      rowSelection: rowSelection
    },
    onRowSelectionChange: setRowSelection,
    meta: {
      removeRow: (rowIndex: number) => {
        const setFilterFunc = (old: Person[]) =>
            old.filter((_row: Student, index: number) => index !== rowIndex);
        setPersons(setFilterFunc);
        setOriginalData(setFilterFunc);
      },
    }
  })
  if (isLoading || !persons){
    return <div>Loading...</div>
  }
  if(inProgress){
    return <div>Deleting...</div>
  }
  console.log(table.getRowModel())
  return (
    <div className="w-screen">
      <Dropdown label="Mass Actions" dismissOnClick={true} >
        <Dropdown.Item onClick={ () => deletePersons() }>Delete</Dropdown.Item>
      </Dropdown>
      <table className="border-collapse">
        <thead>
          {table.getHeaderGroups().map(headerGroup => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map(header => (
                <th className="border border-amber-600" key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody className="border-collapse">
          {table.getRowModel().rows.map(row => (
            <tr className="border border-yellow-500" key={row.id}>
              {row.getVisibleCells().map(cell => (
                <td className="w-72" key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <div className="h-4" />
      <button onClick={() => rerender()} className="border p-2">
        Rerender
      </button>
    </div>
  )
  }