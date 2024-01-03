import { FC } from "react"
import { Button } from "flowbite-react"
import { buttonTheme } from "../../themes/buttonTheme"


interface CustomButtonProps {
    children: (string | JSX.Element | JSX.Element[]),
    action?(): void,
    color?: string, 
    fullsized?: boolean,
    disabled?:boolean,
    isProcessing?:boolean,
    spinnerSlot?:boolean,
    spinnerLeftPosition?:string,
    gradient?:string,
    gradientDuoTone?:string,
    inner?:string,
    label?:string,
    outline?:string,
    pill?:string,
    size?:string,
}

export const CustomButton: FC<CustomButtonProps> = (props) => {
    
    return (
        <Button 
            theme={buttonTheme} 
            color={props.color} 
            onClick={props.action}
            >
        {props.children}
        </Button>
    )
}
