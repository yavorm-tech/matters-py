import React, { useState } from 'react';
import { getCommits} from '../../apis';
import { createColumnHelper, flexRender, getCoreRowModel, useReactTable, defaultColumnSizing, ColumnResizeMode } from '@tanstack/react-table';
import {useQuery} from '@tanstack/react-query';
type Commits = {
  id: BigInteger,
  git_commit_id: String,
  push_event_id: BigInt,
  message: String,
  url: String,
  author: String,
  username: String, 
  created_at: String,

  action: () => {}
}
const columnHelper = createColumnHelper<Commits>();


export const CommitsTable = () => {
  const columns = [
    columnHelper.accessor('id',{
      cell: info => info.getValue()
    }),

    columnHelper.accessor('message', {
      header: () => 'Message',
      cell: info => info.renderValue(),
      footer: info => info.column.id,
    }),
    columnHelper.accessor('url', {
      size: 100,
      header: () => 'Url',
      cell: info => info.renderValue(),
      footer: info => info.column.id,
    }),
    columnHelper.accessor('username', {
      header: () => 'Username',
      cell: info => info.renderValue(),
      footer: info => info.column.id,    
    }),
    columnHelper.accessor('created_at', {
      header: () => 'Created at',
      cell: info => info.renderValue(),
      footer: info => info.column.id,  
    }),
  ]
  const [commits, setCommits] = useState([]);
  const rerender = React.useReducer(() => ({}), {})[1]

  React.useEffect(() => {
  }, []);

  const {isLoading, error, data, isFetched} = useQuery({
    queryKey: ['commits'],
    queryFn: () => getCommits(),
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
    defaultColumn: {
      size: 500,
    }    
  })
  if (isLoading || !commits){
    return <div>Loading...</div>
  }
  console.log(table.getRowModel())
  return (
    <div className="">
      <table className="border-collapse" >
        <thead>
          {table.getHeaderGroups().map(headerGroup => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map(header => (
                <th className="border border-amber-600" key={header.id} >
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
                <td key={cell.id}>                  
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