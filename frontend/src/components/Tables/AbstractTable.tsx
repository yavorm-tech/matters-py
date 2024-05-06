import React, { useMemo, useState } from 'react';
import { FaTrash,FaEdit } from "react-icons/fa";
import {Modal} from 'flowbite-react'
import {  
  flexRender, 
  getCoreRowModel, 
  useReactTable, 
  getFilteredRowModel,
  ColumnFiltersState,
  FilterFn,
  SortingFn,
  Table,
  getFacetedMinMaxValues,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getPaginationRowModel,
  getSortedRowModel,
  sortingFns,
} from '@tanstack/react-table';
import {
  RankingInfo,
  rankItem,
  compareItems,
} from '@tanstack/match-sorter-utils'
import {Dropdown, Button} from "flowbite-react";
import axios from "axios";

declare module '@tanstack/react-table' {
  interface FilterFns {
    fuzzy: FilterFn<unknown>
  }
  interface FilterMeta {
    itemRank: RankingInfo
  }
}


export function IndeterminateCheckbox({
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

const fuzzyFilter: FilterFn<any> = (row, columnId, value, addMeta) => {
  // Rank the item
  const itemRank = rankItem(row.getValue(columnId), value)

  // Store the itemRank info
  addMeta({
    itemRank,
  })

  // Return if the item should be filtered in/out
  return itemRank.passed
}
const fuzzySort: SortingFn<any> = (rowA, rowB, columnId) => {
  let dir = 0

  // Only sort by rank if the column has ranking information
  if (rowA.columnFiltersMeta[columnId]) {
    dir = compareItems(
      rowA.columnFiltersMeta[columnId]?.itemRank!,
      rowB.columnFiltersMeta[columnId]?.itemRank!
    )
  }

  // Provide an alphanumeric fallback for when the item ranks are equal
  return dir === 0 ? sortingFns.alphanumeric(rowA, rowB, columnId) : dir
}
function Filter({
    column,
    table,
  }: {
    column: Column<any, unknown>
    table: Table<any>
  }) {
    const firstValue = table
      .getPreFilteredRowModel()
      .flatRows[0]?.getValue(column.id)
  
    const columnFilterValue = column.getFilterValue()
  
    const sortedUniqueValues = React.useMemo(
      () =>
        typeof firstValue === 'number'
          ? []
          : Array.from(column.getFacetedUniqueValues().keys()).sort(),
      [column.getFacetedUniqueValues()]
    )
  
    return typeof firstValue === 'number' ? (
      <div>
        <div className="flex space-x-2">
          <DebouncedInput
            type="number"
            min={Number(column.getFacetedMinMaxValues()?.[0] ?? '')}
            max={Number(column.getFacetedMinMaxValues()?.[1] ?? '')}
            value={(columnFilterValue as [number, number])?.[0] ?? ''}
            onChange={value =>
              column.setFilterValue((old: [number, number]) => [value, old?.[1]])
            }
            placeholder={`Min ${
              column.getFacetedMinMaxValues()?.[0]
                ? `(${column.getFacetedMinMaxValues()?.[0]})`
                : ''
            }`}
            className="w-24 border shadow rounded"
          />
          <DebouncedInput
            type="number"
            min={Number(column.getFacetedMinMaxValues()?.[0] ?? '')}
            max={Number(column.getFacetedMinMaxValues()?.[1] ?? '')}
            value={(columnFilterValue as [number, number])?.[1] ?? ''}
            onChange={value =>
              column.setFilterValue((old: [number, number]) => [old?.[0], value])
            }
            placeholder={`Max ${
              column.getFacetedMinMaxValues()?.[1]
                ? `(${column.getFacetedMinMaxValues()?.[1]})`
                : ''
            }`}
            className="w-24 border shadow rounded"
          />
        </div>
        <div className="h-1" />
      </div>
    ) : (
      <>
        <datalist id={column.id + 'list'}>
          {sortedUniqueValues.slice(0, 5000).map((value: any) => (
            <option value={value} key={value} />
          ))}
        </datalist>
        <DebouncedInput
          type="text"
          value={(columnFilterValue ?? '') as string}
          onChange={value => column.setFilterValue(value)}
          placeholder={`Search... (${column.getFacetedUniqueValues().size})`}
          className="w-36 border shadow rounded"
          list={column.id + 'list'}
        />
        <div className="h-1" />
      </>
    )
  }
    
    // A debounced input react component
  function DebouncedInput({
    value: initialValue,
    onChange,
    debounce = 500,
    ...props
  }: {
    value: string | number
    onChange: (value: string | number) => void
    debounce?: number
  } & Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'>) {
    const [value, setValue] = React.useState(initialValue)
  
    React.useEffect(() => {
      setValue(initialValue)
    }, [initialValue])
  
    React.useEffect(() => {
      const timeout = setTimeout(() => {
        onChange(value)
      }, debounce)
  
      return () => clearTimeout(timeout)
    }, [value])
  
    return (
      <input {...props} value={value} onChange={e => setValue(e.target.value)} />
    )
  }

export const AbstractTable = (props) => {
  const [globalFilter, setGlobalFilter] = React.useState('')
  const [rowSelection, setRowSelection] = React.useState({})
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
    )
  const [confirmDeleteModal, setConfirmDeleteModal] = useState(false)

  const ConfirmationBox = () => {
    return(
      <div>
        <Modal show={confirmDeleteModal} onClose={() => setConfirmDeleteModal(false)}>
        <Modal.Body>
          <div className="space-y-6">
            <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400 text-center" >
              Are you sure you want to delete the selected records ?
            </p>
          </div>
        </Modal.Body>
        <Modal.Footer className="flex flex-row justify-evenly">
          <Button onClick={() => {
            table.toggleAllRowsSelected(false)
            let selectedRows = table.getSelectedRowModel().flatRows
            props.deleteButtonMethod(selectedRows)
            setConfirmDeleteModal(false)       
            }}>Yes</Button>
          <Button color="gray" onClick={() => {
            table.toggleAllRowsSelected(false)
            setConfirmDeleteModal(false)       
            }}>
            No
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  )}



  //const data = useMemo(() => props.data,[])
  
  const table = useReactTable({
    data:props.data, 
    columns: props.columns, 
    getCoreRowModel: getCoreRowModel(),
    enableRowSelection: true,
    state: {
      rowSelection: rowSelection
    },
    onRowSelectionChange: setRowSelection,
    getFilteredRowModel: getFilteredRowModel(),
    filterFns: {
      fuzzy: fuzzyFilter,
    },
    state: {
      columnFilters,
      globalFilter,
      rowSelection,
    },
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: fuzzyFilter,
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getFacetedMinMaxValues: getFacetedMinMaxValues(),
    debugTable: true,
    debugHeaders: true,
    debugColumns: false,
  })
  // console.log(table.getRowModel())
  // console.log(props.data)
  return (
    <div className="overflow-x-auto w-full">
      <div className="flex items-center justify-between w-full pb-3 pt-3">

        <div className="flex flex-row items-left gap-4">
        <DebouncedInput
          value={globalFilter ?? ''}
          onChange={value => setGlobalFilter(String(value))}
          className="p-2 font-lg shadow border border-block w-96"
          placeholder="Search all columns..."
        />
      
          <Button  onClick={() => {
            setConfirmDeleteModal(true)       
           
          }}><FaTrash /></Button>

          <Button onClick={() => props.editButtonMethod(table.getSelectedRowModel().rowsById)}><FaEdit /></Button>

          </div>
          <Button onClick={() => props.newButtonMethod()} color='green'>New </Button>
      </div>
      <ConfirmationBox />
      <table className="w-full text-sm text-left text-gray-500  dark:text-gray-200 table-fixed">
        <thead className="text-xs text-gray-700  bg-gray-50 dark:bg-teal-900 dark:text-gray-400">
          {table.getHeaderGroups().map(headerGroup => {
            console.log(headerGroup) 
            return (
            <tr key={headerGroup.id} className="bg-slate-200 text-lg dark:bg-teal-900 dark:text-gray-200 ">
              {headerGroup.headers.map(header => {
                  console.log(header.getSize())
                return (
                <th key={header.id} style={{ width: header.getSize()}}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </th>
              )})}
            </tr>
          )})}
        </thead>
        <tbody className="border">
          {table.getRowModel().rows.map(row => (
            <tr className="even:bg-gray-100 odd:bg-white dark:even:bg-neutral-950 dark:odd:bg-black" key={row.id} >
              {row.getVisibleCells().map(cell => (
                <td  key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <div className="flex gap-4 items-center justify-between pt-3 pb-3">
      <Button onClick={ () => table.previousPage()}
        disabled={!table.getCanPreviousPage()} color="green"> Previous</Button>
      <span className="flex items-center gap-1 dark:text-white">
          <div>Page</div>
          <strong>
            {table.getState().pagination.pageIndex + 1} of{' '}
            {table.getPageCount().toLocaleString()}
          </strong>
      </span>
      <Button onClick={ () => table.nextPage()}
        disabled={!table.getCanNextPage()} color="green" > Next</Button>
      </div>
    </div>
  )
  }
