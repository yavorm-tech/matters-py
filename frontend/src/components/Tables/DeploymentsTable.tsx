import React, { useState } from 'react';
import { getDeployments } from '../../apis';
import { createColumnHelper, flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table';
import { useQuery } from '@tanstack/react-query';

type Deployment = {
  id: BigInteger,
  container_name: String,
  destination_port: BigInt,
  repo_id: BigInt,
  status: String,
  build_status: String,
  public_url: String, 
  private_url: String,
  created_at: String,

  action: () => {}
}
const columnHelper = createColumnHelper<Deployment>();


export const DeploymentsTable = () => {
  const [users, setUsers] = useState([]);

  const columns = [
    columnHelper.accessor('id',{
      cell: info => info.getValue()
    }),
    columnHelper.accessor(row => row.container_name,{
      id: 'container_name',
      cell: info => info.getValue(),
      header: () => <span>Container name</span>
    }),
    columnHelper.accessor('destination_port', {
      header: () => 'Destination port',
      cell: info => info.renderValue(),
      footer: info => info.column.id,
      
    }),
    columnHelper.accessor('repo_id', {
      header: () => 'Repository',
      cell: info => info.renderValue(),
      footer: info => info.column.id,
    }),
    columnHelper.accessor('status', {
      header: () => 'Status',
      cell: info => info.renderValue(),
      footer: info => info.column.id,
    }),
    columnHelper.accessor('public_url', {
      header: () => 'Public url',
      cell: info => info.renderValue(),
      footer: info => info.column.id,
    }),
    columnHelper.accessor('private_url', {
      header: () => 'Private url',
      cell: info => info.renderValue(),
      footer: info => info.column.id,
    }),
    columnHelper.accessor('created_at', {
      header: () => 'Created at',
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
    queryKey: ['users'],
    queryFn: () => getDeployments(),
  })
  if(data){
    console.log(data);
  
  }else{
    console.log('empty');
  
  }
  const table = useReactTable({
    data, 
    columns, 
    getCoreRowModel: getCoreRowModel()
  })
  if (isLoading || !users){
    return <div>Loading...</div>
  }
  console.log(table.getRowModel())
  return (
    <div className="">
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