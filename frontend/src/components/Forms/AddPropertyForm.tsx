import React,{FC, useState, useRef, useEffect} from 'react';
import axios from 'axios';
import {Button, Label, Textarea} from 'flowbite-react';
import { Circles } from 'react-loading-icons';
import Oval from 'react-loading-icons/dist/esm/components/oval';
import {defineConfig} from 'vite'
import ReactDOM from "react-dom/client";
import {useForm} from "@tanstack/react-form";
import { zodValidator} from "@tanstack/zod-form-adapter";
import {z} from 'zod'
import {Checkbox} from "flowbite-react";
import { PropertyTable } from '../Tables/PropertyTable';
/*TODO add     git_url = "git@github.com:Payarc/payarc3.0.git" */

//const test = getGitRepos().then( (res) => console.log(res)).catch( (error) => console.log(error));


interface AddPropertyFormProps {
    test: string,
    action(): void
    onSubmit(e?): void
}

export const AddPropertyForm: FC<AddPropertyFormProps> = (props) => {

    const form = useForm({
        defaultValues: {
            title: '',
            type: '',
            description: '',
        },
        onSubmit: async ({ value }) => {
            // Do something with form data
            let headers = {"Content-Type":"application/json"}
            axios.post('/api/person', {
                headers: headers,
            })
            props.action();
        },
        validators: {
            onChange( {value})  {
                if(value.title < '3'){
                    return 'must be at least 3 characters'
                }
            }
        },
        defaultState: {
            canSubmit: false,
            isFormValid: false,
        }
    })

    useEffect( () => {
//        console.log(import.meta.env)
    }, [])

    return (
        <div>
            <form.Provider>
                <form className="flex flex-col gap-4"
                      onSubmit={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          props.onSubmit(e);
                      }}
                >
                    <div className="mb-2 block ">
                        <form.Field
                            name="title"
                            validatorAdapter={zodValidator}
                            validators={{
                                onChange: z.string().min(3, 'must be at least 3 characters'),
                                onChangeAsyncDebounceMs: 500,
                                onChangeAsync: z.string().refine(
                                    async (value) => {
                                        await new Promise((resolve) => setTimeout(resolve, 1000))
                                        return !value.includes('error')
                                    }, {
                                        message: 'No error allowed in first name'
                                    }
                                )
                            }}
                            children={(field) => (
                                <div className="flex gap-2">
                                    <label htmlFor={field.name} className="w-28">First Name: </label>
                                    <input className="w-72"
                                           name={field.name}
                                           value={field.state.value}

                                           onBlur={field.handleBlur}
                                           onChange={(e) => field.handleChange(e.target.value)}
                                    />
                                    {field.state.meta.errorMap['onChange'] ?
                                        <em className="text-red-600">{field.state.meta.errorMap['onChange']}</em> : null}
                                </div>
                            )}
                        />
                    </div>

                    <div className="mb-2 block ">
                        <form.Field
                            name="type"
                            children={(field) => (
                                <div className="flex gap-2">
                                    <label htmlFor={field.name} className="w-46">
                                        Is Jurisdict person
                                        <p>{field.state.value}</p>
                                        {field.state.value ?
                                        <Checkbox className="w-6 h-6"
                                                  id={field.name}
                                                  checked
                                                  value={field.state.value}
                                                  onChange={(e) => {
                                                      console.log(e)
                                                  }}

                                        /> :  <Checkbox className="w-6 h-6"
                                                        id={field.name}
                                                        value={field.state.value}
                                                        onChange={(e) => {
                                                            console.log(e)
                                                        }}

                                            />
                                        }
                                    </label>
                                </div>
                            )}/>


                    </div>
                    <div className='w-96 h-96 b-1'>
                            <button>Add</button> <button>Remove</button>
                            <PropertyTable />
                    </div>
                    <div className="mb-2 block ">
                        <form.Field
                            name="description"
                            children={(field) => (
                                <div className="flex gap-2">
                                    <label htmlFor={field.name} className="w-46">
                                        <Textarea cols={50} rows={50}>
                                        </Textarea>
                                    </label>
                                </div>
                            )}/>


                    </div>
                    <form.Subscribe
                        selector={(state) => [state.canSubmit, state.isSubmitting]}
                        children={([canSubmit, isSubmitting]) => (
                            <button type="submit" disabled={!canSubmit}
                                    className={!canSubmit ? "text-white bg-gray-400 dark:bg-blue-500 cursor-not-allowed font-medium rounded-lg text-sm px-5 py-2.5 text-center\" disabled>Disabled button"
                                        : "focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"}>
                                {isSubmitting ? '...' : 'Submit'}
                            </button>
                        )}/>
                </form>
            </form.Provider>
        </div>
    )
}
