import React,{FC, useState, useRef, useEffect} from 'react';
import axios from 'axios';
import {Button, Label} from 'flowbite-react';
import { Circles } from 'react-loading-icons';
import Oval from 'react-loading-icons/dist/esm/components/oval';
import {defineConfig} from 'vite'
import ReactDOM from "react-dom/client";
import {useForm} from "@tanstack/react-form";
import { zodValidator} from "@tanstack/zod-form-adapter";
import {z} from 'zod'
import {Checkbox} from "flowbite-react";
import { Person } from '../Panels/PersonPanel';
/*TODO add     git_url = "git@github.com:Payarc/payarc3.0.git" */

//const test = getGitRepos().then( (res) => console.log(res)).catch( (error) => console.log(error));


interface PersonFormProps {
    data?: any,
    action(): void
    onSubmit(e?): void
}

export const PersonForm: FC<PersonFormProps> = (props) => {

    const form = useForm({
        defaultValues: {
            first_name: props.data ? props.data.first_name : '',
            middle_name: props.data ? props.data.middle_name : '',
            last_name: props.data ? props.data.last_name : '',
            egn: props.data ? props.data?.egn : '',
            eik: props.data ? props.data?.eik : '',
            fpn: props.data ? props.data?.fpn : '',
            is_jurisdict_person: false
        },
        onSubmit: async ({ value }) => {
         
        },
        validators: {
            onChange( {value})  {
                if(value.fName < '3'){
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
                            name="first_name"
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
                            name="is_jurisdict_person"
                            children={(field) => (
                                <div className="flex gap-2">
                                    <label htmlFor={field.name} className="w-46">
                                        Is Jurisdict person
                                        <p>{field.state.value}</p>
                                        {field.state.value ?
                                        <Checkbox className="w-6 h-6"
                                                  id={field.name}
                                                  checked
                                                  value={field.state.is_jurisdict_person}
                                                  onChange={(e) => {
                                                      console.log(e)
                                                  }}

                                        /> :  <Checkbox className="w-6 h-6"
                                                        id={field.name}
                                                        value={field.state.is_jurisdict_person}
                                                        onChange={(e) => {
                                                            console.log(e)
                                                        }}

                                            />
                                        }
                                    </label>
                                </div>
                            )}/>


                    </div>
                    <div className="mb-2 block ">
                        <form.Field
                            name="middle_name"
                            validatorAdapter={zodValidator}
                            validators={{
                                onChange: z.string().min(4, 'must be at least 4 characters'),
                                onChangeAsyncDebounceMs: 500,
                                onChangeAsync: z.string().refine(
                                    async (value) => {
                                        await new Promise((resolve) => setTimeout(resolve, 1000))
                                        return !value.includes('error')
                                    }, {
                                        message: 'No error allowed in middle name'
                                    }
                                )
                            }}
                            children={(field) => (
                                <div className="flex gap-2">
                                    <label htmlFor={field.name} className="w-28">Middle Name: </label>
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
                            name="last_name"
                            validatorAdapter={zodValidator}
                            validators={{
                                onChange: z.string().min(2, 'must be at least 5 characters'),
                                onChangeAsyncDebounceMs: 500,
                                onChangeAsync: z.string().refine(
                                    async (value) => {
                                        await new Promise((resolve) => setTimeout(resolve, 1000))
                                        return !value.includes('error')
                                    }, {
                                        message: 'No error allowed in last name'
                                    }
                                )
                            }}
                            children={(field) => (
                                <div className="flex gap-2">
                                    <label htmlFor={field.name} className="w-28">Last Name: </label>
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
                            name="egn"
                            validatorAdapter={zodValidator}
                            validators={{
                                onChange: z.string().min(10, 'min 10 integers ').max(10, "max 10 intergers"),
                                onChangeAsyncDebounceMs: 500,
                                onChangeAsync: z.string().refine(
                                    async (value) => {
                                        await new Promise((resolve) => setTimeout(resolve, 1000))
                                        return !value.includes('error')
                                    }, {
                                        message: 'No error allowed in egn'
                                    }
                                )
                            }}
                            children={(field) => (
                                <div className="flex gap-2">
                                    <label htmlFor={field.name} className="w-28">EGN: </label>
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
                            name="eik"
                            validatorAdapter={zodValidator}
                            validators={{
                                onChange: z.string().min(9, 'min 9 characters').max(13, "max 13 characters"),
                                onChangeAsyncDebounceMs: 500,
                                onChangeAsync: z.string().refine(
                                    async (value) => {
                                        await new Promise((resolve) => setTimeout(resolve, 1000))
                                        return !value.includes('error')
                                    }, {
                                        message: 'No error allowed in eik'
                                    }
                                )
                            }}
                            children={(field) => (
                                <div className="flex gap-2">
                                    <label htmlFor={field.name} className="w-28">EIK: </label>
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
                            name="fpn"
                            validatorAdapter={zodValidator}
                            validators={{
                                onChange: z.string().min(9, 'min 9 integers').max(9, 'max 9 integers'),
                                onChangeAsyncDebounceMs: 500,
                                onChangeAsync: z.string().refine(
                                    async (value) => {
                                        await new Promise((resolve) => setTimeout(resolve, 1000))
                                        return !value.includes('error')
                                    }, {
                                        message: 'No error allowed in fpn'
                                    }
                                )
                            }}
                            children={(field) => (
                                <div className="flex gap-2">
                                    <label htmlFor={field.name} className="w-28">FPN: </label>
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
