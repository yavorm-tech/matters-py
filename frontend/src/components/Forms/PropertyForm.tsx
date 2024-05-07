import React,{FC, useState, useRef, useEffect} from 'react';
import axios from 'axios';
import {Button, Dropdown, Label, Textarea} from 'flowbite-react';
import { Circles } from 'react-loading-icons';
import Oval from 'react-loading-icons/dist/esm/components/oval';
import {defineConfig} from 'vite'
import ReactDOM from "react-dom/client";
import {useForm} from "@tanstack/react-form";
import { zodValidator} from "@tanstack/zod-form-adapter";
import {z} from 'zod'
import {Checkbox} from "flowbite-react";
import { PropertyInterface } from '../Panels/PersonPropertyPanel';
import { buttonTheme } from '../../themes/buttonTheme';
/*TODO add     git_url = "git@github.com:Payarc/payarc3.0.git" */

//const test = getGitRepos().then( (res) => console.log(res)).catch( (error) => console.log(error));


interface AddPropertyFormProps {
    data?: PropertyInterface,
    action(): void
    onSubmit(e?): void
}

export const PropertyForm: FC<AddPropertyFormProps> = (props) => {

    const form = useForm({
        defaultValues: {
            title: '',
            type: '',
            description: '',
            owner: ''
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
                                    <label htmlFor={field.name} className="w-28">Title: </label>
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
                                    <label htmlFor={field.name} className='w-28'>Type: </label>
                                    <select id="type" className="w-32 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                                        <option selected value="0">Movable</option>
                                        <option value="1">Real Estate</option>                                    
                                    </select>
                                </div>
                            )}/>
                    </div>
                    <div className="mb-2 block ">
                        <form.Field
                            name="description"
                            validatorAdapter={zodValidator}
                            validators={{
                                onChange: z.string().min(50, 'must be at least 50 characters'),
                                onChangeAsyncDebounceMs: 500,
                                onChangeAsync: z.string().refine(
                                    async (value) => {
                                        await new Promise((resolve) => setTimeout(resolve, 1000))
                                        return !value.includes('error')
                                    }, {
                                        message: 'No error allowed in description'
                                    }
                                )
                            }}
                            children={(field) => (
                                <div className="flex gap-2">
                                    <label htmlFor={field.name} className="w-28">Description: </label>
                                    <textarea className="w-96 h-6 "
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
                    <form.Subscribe
                        selector={(state) => [state.canSubmit, state.isSubmitting]}
                        children={([canSubmit, isSubmitting]) => (
                            <button type="submit" disabled={!canSubmit}
                                    className={!canSubmit ? "text-white bg-gray-400 dark:bg-blue-500 cursor-not-allowed font-medium rounded-lg text-sm px-5 py-2.5 text-center\" disabled>Disabled button"
                                        : "focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-teal-900 dark:hover:bg-teal-800 dark:focus:ring-teal-900"}>
                                {isSubmitting ? '...' : 'Submit'}
                            </button>
                        )}/>
                </form>
            </form.Provider>
        </div>
    )
}
